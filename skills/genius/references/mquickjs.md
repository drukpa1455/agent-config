# MQuickJS: Fabrice Bellard, Charlie Gordon, and Contributors

MQuickJS is the lens for hard resource budgets, designed semantic subsets,
purpose-built representations, relocation-safe handles, build-time facts,
bounded memory and stack, host-owned interruption, and executable-artifact
trust.

This profile studies `bellard/mquickjs` at
[`ee50431eac9b14b99f722b537ec4cac0c8dd75ab`](https://github.com/bellard/mquickjs/tree/ee50431eac9b14b99f722b537ec4cac0c8dd75ab),
observed on 2026-07-12. The license names Fabrice Bellard and Charlie Gordon;
the pinned Git history also includes contributions from Erge, Wes, and Siqi Yan.
Attribute project mechanics to MQuickJS and its contributors unless a primary
source establishes narrower ownership. Do not infer personal intent.

## Use this lens when

- a hard RAM, storage, stack, latency, or capacity ceiling should shape the API;
- a system pays permanently for semantics its supported domain does not need;
- addresses or instances move while callers retain stale references;
- static facts consume dynamic memory or startup work;
- an intermediate representation may own no required transformation or proof;
- cancellation, exhaustion, or executable-input trust is implicit;
- tests cover happy output but not relocation, limits, or rejected states.

Do not use it to justify silent compatibility breaks, bit packing, one giant
arena, a custom VM, generated code, or unvalidated executable artifacts without
the same measured pressure.

## Observed path

```text
standard-library declarations
  -> host generator
  -> const atom, property, class, and function tables
  -> ROM

caller memory buffer
  -> JSContext | heap -> free gap <- stack

JavaScript source
  -> explicit parser state machine
  -> direct bytecode emission
  -> closure resolution and stack analysis
  -> iterative VM and interrupt polls

trusted persistent path
  -> compact compiled heap image
  -> relocate to base zero before writing
  -> relocate into long-lived input storage
  -> version/width checks
  -> run without full bytecode validation
```

## High-leverage mechanics

### The budget enters through construction

`JS_NewContext` requires the host to supply a memory region and size. The context
and heap grow from one end while the value stack grows from the other. Heap and
stack reservations share `check_free_mem`, which compacts and then fails with an
out-of-memory exception when the gap remains insufficient
([`mquickjs.h::JS_NewContext`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.h#L243-L268),
[`mquickjs.c::JSContext`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L204-L256),
[`mquickjs.c::check_free_mem,JS_StackCheck,js_malloc`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L499-L555)).

The engine core does not call libc allocation, but the host still owns the arena,
input buffers, and any user-class opaque payloads. `JS_FreeContext` calls user
finalizers; it does not free the arena
([`example.c`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/example.c#L43-L151),
[`mquickjs.c::JS_FreeContext`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L3653-L3681)).

**Transfer:** make the real budget, owner, lifetime, and exhaustion path explicit
at construction. Do not call a bounded core a bounded process when adapters can
still allocate elsewhere.

### The supported semantics are deliberately smaller

MQuickJS implements a stricter JavaScript subset close to ES5. Arrays have no
holes, direct `eval` cannot access local scope, primitive boxing constructors are
unsupported, and several property and iteration behaviors are narrower
([`README.md::Stricter mode`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/README.md#L69-L190)).
The implementation rejects these states. It caps function stack size, locals,
arguments, and recursive `JS_Call` entries
([`mquickjs.c::limits`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L58-L70)).
The CLI separately caps timers and include files, while the loader caps attached
ROM atom tables
([`mqjs.c::MAX_TIMERS,main`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mqjs.c#L121-L153),
[`mqjs.c::main`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mqjs.c#L588-L700),
[`mquickjs.c::JS_LoadBytecode`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L12971-L12990)).

A history change rejects `splice` when coercion changes the source array's length
instead of carrying an edge case judged impractical
([`74b7ec5`](https://github.com/bellard/mquickjs/commit/74b7ec5003a06d62d8cfb60448fa2b93c0441d1b)).

**Transfer:** subtraction is an optimization only when the product contract can
honestly exclude the state. Reject it visibly; never silently weaken established
semantics.

### Representation follows measured operations

`JSValue` is one CPU word. Tags encode short integers, pointers, special values,
one-character strings, short C functions, and selected 64-bit floats. Heap
blocks carry compact memory tags
([`mquickjs.h::JSValue,tags`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.h#L35-L105),
[`mquickjs_priv.h::memory tags`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs_priv.h#L20-L57)).
Property keys reuse values, strings use WTF-8, and many C functions fit in an
immediate value without arbitrary properties
([`README.md::Value and object representation`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/README.md#L296-L328)).

**Transfer:** choose storage from operations and an evidenced budget. Compact
encoding carries portability, safety, and debugging costs; it is not elegance by
itself.

### Moving objects require updateable roots

Compaction can move an object on any allocation. Raw pointer-bearing `JSValue`s
are temporary; longer-lived C references live in registered `JSGCRef` slots
([`mquickjs.h::JSGCRef`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.h#L133-L152),
[`README.md::Memory handling`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/README.md#L210-L253)).
The collector marks context fields, VM stack, roots, parser state, and heap
references, then threads pointers through targets and rewrites them while moving
blocks
([`mquickjs.c::gc_mark_all`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L12047-L12160),
[`mquickjs.c::gc_compact_heap`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L12204-L12420)).

`DEBUG_GC` collects before allocation and perturbs addresses. The pinned suite
passed with this mode. History still contains fixes for an unrooted separator and
unbalanced roots on exception paths
([`a593cd5`](https://github.com/bellard/mquickjs/commit/a593cd56fd181a268237c9cc506e7cfe039f5c3f),
[`de23bae`](https://github.com/bellard/mquickjs/commit/de23baea624b38c79cd089823159e4c84fc6e4c1)).

**Transfer:** stable ownership is not stable address. Put retained references in
holders the relocation owner can update, then force relocation in tests.
Process-local roots do not replace durable IDs or versions.

### Static facts become generated read-only data

A host utility collects standard-library atoms, properties, functions, classes,
and finalizers, builds lookup tables, and emits aligned constant C data
([`mquickjs_build.h`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs_build.h#L25-L97),
[`mquickjs_build.c::add_atom,dump_atoms`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs_build.c#L200-L338),
[`mquickjs_build.c::build_atoms`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs_build.c#L828-L932)).
Runtime contexts point at those ROM tables. Mutation copies ROM-backed property
tables into the arena first
([`mquickjs.c::stdlib_init`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L3500-L3657),
[`mquickjs.c::js_update_props`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L2748-L2831)).

**Transfer:** move genuinely static facts to generated read-only artifacts, keep
the generator authoritative, and define how mutation crosses into runtime-owned
storage.

### Direct bytecode still receives semantic checks

The parser replaces C recursion with explicit function and resume states on the
engine stack and emits bytecode without retaining an AST
([`mquickjs.c::parser state machine`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L9073-L9300)).
After parsing, MQuickJS resolves closure variables, shrinks temporary storage,
and traverses control flow to compute maximum operand-stack size and reject
invalid opcodes, inconsistent heights, underflow, overflow, and bad branches
([`mquickjs.c::compute_stack_size`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L11251-L11375),
[`mquickjs.c::js_parse_local_functions`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L11440-L11535)).

The iterative VM polls an optional interrupt callback. The embedding host owns
whether to install it and what cancellation means
([`mquickjs.c::POLL_INTERRUPT,JS_Call`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L5044-L5115)).

**Transfer:** delete an intermediate only when no transformation, validation,
diagnostic, or consumer fact needs it. Bounded implementation stack use is not a
time limit; cancellation still needs an owner.

### Repeatable bytecode remains trusted internal data

Bytecode preparation removes unrelated objects and compacts the compiled graph.
The CLI relocates pointers to base zero before writing; two runs with the same
source, build, path, target, and revision matched byte for byte in the pinned
reproduction
([`mquickjs.c::JS_PrepareBytecode`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L12461-L12505),
[`mqjs.c::compile_file`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mqjs.c#L359-L430)).

The format is word-size, endian, and version dependent. Loading checks its
header and relocation base but does not validate the internal graph or
instructions. The CLI requires `-b` before treating input as bytecode, a gate
added after the risk was identified
([`mquickjs.h::bytecode warning`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.h#L321-L364),
[`mquickjs.c::bytecode load`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L12846-L12990),
[`cb1ff4a`](https://github.com/bellard/mquickjs/commit/cb1ff4a6bdf1c296f769ddd72e6f63a2c9498b38)).

**Transfer:** repeatability, compatibility, validation, and trust are separate.
Never expose an unverified internal image as a hostile-input interchange format.

## Proof and known limits

At the pinned revision, isolated builds reproduced:

- the bundled language, closure, loop, built-in, bytecode, and embedding tests;
- the same suite with forced-moving `DEBUG_GC`;
- Mandelbrot in a 10 KiB arena;
- visible strict-subset rejection and bounded-arena exhaustion;
- byte-for-byte matching repeated bytecode generation and trusted replay;
- cooperative interruption of an infinite loop.

The external Octane pack and target-specific ARM ROM size were not reproduced.
The source TODOs still name stack-bottom logic, GC cadence, compaction policy,
property rehashing, and saved-bytecode bytes as open work
([`mquickjs.c::TODO`](https://github.com/bellard/mquickjs/blob/ee50431eac9b14b99f722b537ec4cac0c8dd75ab/mquickjs.c#L38-L55)).
History contains allocation, exception, root, stack, ROM mutation, and bytecode
cleanup fixes. Compactness concentrates correctness pressure; it does not prove
perfection.

## Source map

| Pressure             | Start here                                              | Inspect                                                    |
| -------------------- | ------------------------------------------------------- | ---------------------------------------------------------- |
| Budget and subset    | `README.md`                                             | RAM/ROM scope, stricter semantics, bytecode warning        |
| Public API           | `mquickjs.h`                                            | word values, roots, arena, interrupt, bytecode             |
| Arena ownership      | `mquickjs.c`                                            | `JSContext`, allocation gap, stack checks, OOM             |
| Moving state         | `mquickjs.c`                                            | mark roots, pointer threading, compaction, debug movement  |
| Static facts         | `mquickjs_build.*`, `mqjs_stdlib.c`                     | generated atoms, properties, classes, functions            |
| Parsing              | `mquickjs.c`                                            | explicit parse states, direct emission, closure resolution |
| Program checks       | `mquickjs_opcode.h`, `compute_stack_size`               | widths, stack effects, control-flow validation             |
| Runtime              | `JS_Call`, `POLL_INTERRUPT`                             | iterative frames, bounded recursive entries, cancellation  |
| Persistent artifacts | `JS_PrepareBytecode`, `compile_file`, `JS_LoadBytecode` | compaction, relocation, compatibility, trust               |
| Embedding            | `example.c`, `example_stdlib.c`                         | host memory, roots, opaque payloads, finalizers            |
| Proof                | `Makefile`, `tests/`, pinned commits                    | normal/forced-GC behavior and historical failures          |

Read the [worked trace](mquickjs-worked-trace.md) for a reproduced budget,
rejection, forced relocation, repeated bytecode, and interruption path.

## Transfer limits

MQuickJS is an embedded C runtime with a deliberately restricted language,
single-context arena, target-shaped values, generated C tables, and trusted
bytecode path. A service, browser, multi-tenant product, durable store, or public
plugin system may require broader compatibility, hierarchical quotas, memory
safety, authorization, stable IDs, transactions, sandboxing, artifact
validation, version migration, process isolation, and hard wall-clock limits.

Do not copy the costume. The lens is useful when the target has a real budget or
relocation problem; direct readable application code remains the default.
