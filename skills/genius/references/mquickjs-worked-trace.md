# Worked MQuickJS Constraint Trace

This trace demonstrates the evidence method for hard budgets, designed
rejection, forced relocation, same-environment artifact repeatability, and
cooperative interruption. It was reproduced against `bellard/mquickjs` commit
`ee50431eac9b14b99f722b537ec4cac0c8dd75ab` on macOS arm64 with the existing
Apple Clang toolchain.

Run it only with explicit permission to build upstream source. Do not install a
compiler or dependencies merely for this trace. Keep the study checkout clean by
building an archived copy in temporary storage.

## Verify and isolate the source

```sh
MQUICKJS_PATH=${MQUICKJS_PATH:-$HOME/tmp/genius-study/mquickjs}
REV=ee50431eac9b14b99f722b537ec4cac0c8dd75ab

test "$(git -C "$MQUICKJS_PATH" remote get-url origin)" = \
  https://github.com/bellard/mquickjs.git
test "$(git -C "$MQUICKJS_PATH" rev-parse HEAD)" = "$REV"
test -z "$(git -C "$MQUICKJS_PATH" status --short)"

BUILD=$(mktemp -d)
trap 'rm -rf "$BUILD"' EXIT
git -C "$MQUICKJS_PATH" archive HEAD | tar -x -C "$BUILD"
make -C "$BUILD" -j4
make -C "$BUILD" test
```

The test target runs the bundled closure, language, loop, built-in, persistent
bytecode, and C embedding paths. It completed successfully at the pinned
revision.

## Exercise the stated budget and subset

The bundled Mandelbrot program completes with a 10 KiB arena:

```sh
"$BUILD/mqjs" --memory-limit 10k "$BUILD/tests/mandelbrot.js" >/dev/null
```

Unsupported semantics fail visibly:

```sh
for source in \
  'var a=[]; a[2]=1' \
  'var x=new Number(1)' \
  "eval('1+2')"
do
  if "$BUILD/mqjs" -e "$source"; then
    echo "unexpected success: $source" >&2
    exit 1
  fi
done
```

Expected errors include:

```text
TypeError: invalid array subscript
TypeError: number constructor not supported
SyntaxError: direct eval is not supported
```

Arena exhaustion also becomes an engine error rather than an unbounded host
allocation:

```sh
set +e
"$BUILD/mqjs" --memory-limit 6k \
  -e 'var a=[]; for(var i=0;i<10000;i++) a.push(i)' \
  >"$BUILD/oom.log" 2>&1
status=$?
set -e

test "$status" -ne 0
grep -q 'InternalError: out of memory' "$BUILD/oom.log"
```

The arena bounds only MQuickJS's engine state. The CLI's arena and file buffers
still belong to the host.

## Force object movement

Rebuild the temporary copy with `DEBUG_GC`. This mode collects before
allocations and perturbs addresses during compaction:

```sh
make -C "$BUILD" clean
CFLAGS='-Wall -g -MMD -D_GNU_SOURCE -fno-math-errno -fno-trapping-math -Os -DDEBUG_GC'
make -C "$BUILD" -j4 CFLAGS="$CFLAGS"
make -C "$BUILD" test CFLAGS="$CFLAGS"

"$BUILD/mqjs" --memory-limit 64k \
  -e 'var a={x:1}; var b={a:a}; gc(); if (b.a.x !== 1) throw Error("bad root")'
```

The suite and explicit root-retention probe both pass. This proves the tested
paths tolerate forced movement; it does not prove every embedding extension
obeys `JSGCRef` discipline.

## Check repeated trusted bytecode

Return to a normal temporary build, compile the same source twice, compare it,
and exercise the explicit trust gate:

```sh
make -C "$BUILD" clean
make -C "$BUILD" -j4

"$BUILD/mqjs" -o "$BUILD/a.bin" "$BUILD/tests/test_closure.js"
"$BUILD/mqjs" -o "$BUILD/b.bin" "$BUILD/tests/test_closure.js"
cmp "$BUILD/a.bin" "$BUILD/b.bin"

set +e
"$BUILD/mqjs" "$BUILD/a.bin" >/dev/null 2>&1
without_gate=$?
set -e

test "$without_gate" -ne 0
"$BUILD/mqjs" -b "$BUILD/a.bin"
```

The repeated bytecode matches for this same source, build, path, target, and
revision; base-zero relocation removes the original pointer address from the
file. This does not establish reproducibility across environments. The format is
still word-size, endian, and version dependent, and its internal graph is not
validated. Only trusted bytecode belongs on the `-b` path.

## Reproduce cooperative interruption

An empty generated standard library is enough to test the embedding contract:

```sh
cat >"$BUILD/probe_stdlib.c" <<'C'
#include "mquickjs_build.h"
static const JSPropDef global[] = { JS_PROP_END };
int main(int argc, char **argv) {
  return build_atoms("js_probe_stdlib", global, 0, argc, argv);
}
C

gcc -Wall -O2 -D_GNU_SOURCE -I"$BUILD" \
  -o "$BUILD/probe_stdlib" \
  "$BUILD/probe_stdlib.c" "$BUILD/mquickjs_build.c" "$BUILD/cutils.c"
"$BUILD/probe_stdlib" >"$BUILD/probe_stdlib.h"

cat >"$BUILD/probe.c" <<'C'
#include <assert.h>
#include <stdint.h>
#include <stdio.h>
#include <string.h>
#include "mquickjs.h"
#include "probe_stdlib.h"

static int polls;
static int stop(JSContext *ctx, void *opaque) {
  (void)ctx; (void)opaque;
  return ++polls >= 2;
}

int main(void) {
  uint8_t memory[65536];
  JSContext *ctx = JS_NewContext(memory, sizeof(memory), &js_probe_stdlib);
  JS_SetInterruptHandler(ctx, stop);
  const char source[] = "while (1) {}";
  JSValue out = JS_Eval(ctx, source, strlen(source), "probe", 0);
  assert(JS_IsException(out));
  assert(polls == 2);
  assert(JS_IsError(ctx, JS_GetException(ctx)));
  JS_FreeContext(ctx);
  puts("cooperative interruption: passed");
}
C

gcc -Wall -Os -D_GNU_SOURCE -I"$BUILD" \
  -o "$BUILD/probe" \
  "$BUILD/probe.c" "$BUILD/mquickjs.c" "$BUILD/dtoa.c" \
  "$BUILD/libm.c" "$BUILD/cutils.c" -lm
"$BUILD/probe"
```

Expected output:

```text
cooperative interruption: passed
```

The engine polls; the host supplies the policy. This does not provide a hard
wall-clock deadline or process sandbox.

## Follow the source evidence

1. Context construction divides the caller's arena between heap and stack:
   [`mquickjs.c::JS_NewContext2`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L3536-L3657).
2. Allocation and stack checks compact before reporting exhaustion:
   [`mquickjs.c::check_free_mem,JS_StackCheck,js_malloc`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L499-L555).
3. Registered roots are included in marking and rewritten by compaction:
   [`mquickjs.c::gc_mark_all,gc_compact_heap`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L12047-L12420).
4. Bytecode preparation compacts the retained program, while the CLI normalizes
   its base address before writing:
   [`mquickjs.c::JS_PrepareBytecode`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L12461-L12505),
   [`mqjs.c::compile_file`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mqjs.c#L359-L430).
5. Loading checks header facts but explicitly requires trusted input:
   [`mquickjs.c::JS_LoadBytecode`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L12846-L12990).
6. The VM polls host-owned interruption during long-running operations:
   [`mquickjs.c::POLL_INTERRUPT`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L5044-L5115).

## Transfer the invariant

For a target whose caches or projections are rebuilt while callers retain raw
object references, a concise recommendation could be:

- **Recommendation:** replace retained instance pointers with owner-updateable
  handles and force rebuild or relocation in tests.
- **Mechanic:** MQuickJS registers `JSGCRef` slots, then rewrites those slots when
  compaction moves objects.
- **Invariant:** callers retain a stable holder rather than assuming stable
  storage location.
- **Target analogue:** the target's own generation-tagged handle or durable ID,
  not a copied `JSGCRef` API.
- **Divergence:** cross-process and durable references also need identity,
  version, authorization, missing-target, and repair semantics.
- **Consequence:** first add one test that rebuilds the owner between acquisition
  and use. Do not introduce handles when object lifetime is already lexical and
  immovable.

The trace proves pinned MQuickJS behavior. Target pressure and divergence decide
whether the transfer is useful.
