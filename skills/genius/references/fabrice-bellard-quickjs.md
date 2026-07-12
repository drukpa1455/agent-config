# Fabrice Bellard, Contributors, and QuickJS

QuickJS is the lens for compact complete systems, explicit embedding contracts,
host-owned resource bounds, direct lowering, and deliberate dependency
avoidance.

This profile studies `bellard/quickjs` at
[`04be246001599f5995fa2f2d8c91a0f198d3f34c`](https://github.com/bellard/quickjs/tree/04be246001599f5995fa2f2d8c91a0f198d3f34c),
observed on 2026-07-12. The repository history and license identify Fabrice
Bellard as the principal author and also credit Charlie Gordon and other
contributors. Attribute specific mechanics to the project unless source history
establishes otherwise.

## Use this lens when

- a runtime or library must embed behind a small host API;
- startup, code footprint, dependencies, or deterministic cleanup matter;
- memory, stack, execution time, and jobs need explicit host ownership;
- an intermediate representation may cost more than it clarifies;
- generated executable artifacts need a clear trust and version boundary;
- a complete vertical implementation may be simpler than integrating many
  independent subsystems.

Do not use it to justify giant files, manual memory ownership, private formats,
custom Unicode or regular expression engines, or direct bytecode generation
when the target needs inspectable transformations.

## Observed shape

```text
C host
  -> JSRuntime resource owner
  -> one or more JSContext realms
  -> parse and direct bytecode generation
  -> stack bytecode execution
  -> explicit pending-job loop
  -> reference counts + cycle removal
```

Project documentation presents a few dependency-free C files, low startup cost,
near-complete language conformance, standalone executable generation, and
reference counting with cycle removal as one coherent product shape
([`doc/quickjs.texi::Main Features`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/doc/quickjs.texi#L23-L49)).
Compactness comes from controlling the whole path, not from omitting language
semantics.

## High-leverage mechanics

### The host boundary exposes ownership directly

`JSRuntime` owns an object heap; contexts share objects only inside a runtime.
Values crossing the C API have explicit duplicate and free operations, C
functions receive ordinary parameters instead of an implicit VM stack, and
exceptions must be checked explicitly
([`doc/quickjs.texi::QuickJS C API`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/doc/quickjs.texi#L801-L846),
[`quickjs.h::JS_DupValue,JS_FreeValue`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/quickjs.h#L680-L723)).
The API makes lifetime and failure obligations visible to the embedding host.

### Resource policy stays with the host

The public API supports memory limits, custom allocators, maximum stack size,
and interrupt callbacks. Pending jobs are advanced explicitly by the host
([`quickjs.h::runtime controls`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/quickjs.h#L360-L386),
[`quickjs.h::JS_SetInterruptHandler`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/quickjs.h#L918-L932),
[`quickjs.h::JS_ExecutePendingJob`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/quickjs.h#L971-L977)).
The engine supplies capabilities; the embedding application retains policy and
lifecycle ownership.

### Direct lowering is paired with static analysis

The compiler emits stack bytecode without retaining a parse-tree IR, then runs
optimization passes over the bytecode. It computes each function's maximum stack
size before execution
([`doc/quickjs.texi::Bytecode`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/doc/quickjs.texi#L915-L935)).
`compute_stack_size` explores control flow, rejects inconsistent stack levels,
and records the maximum
([`quickjs.c::compute_stack_size`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/quickjs.c#L35699-L35951)).
Directness is safe here because the retained bytecode still supports the needed
legality and resource checks.

### Deterministic reclamation handles cycles separately

Reference-counted values release immediately when counts reach zero. A separate
cycle pass decrements child references, retains externally reachable objects,
and frees the remaining cycles
([`quickjs.c::gc_decref,JS_RunGCInternal`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/quickjs.c#L6687-L6838)).
The architecture gives the common acyclic path deterministic behavior while
isolating the exceptional graph problem.

### Unstable artifacts have an explicit trust boundary

QuickJS documentation says bytecode is version-bound, performs no security check
before execution, and must not be loaded from untrusted sources. The compiler
deliberately offers no raw binary-bytecode output option for that reason
([`doc/quickjs.texi::Script evaluation`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/doc/quickjs.texi#L848-L862)).
It likewise says binary JSON may change and is unsuitable for persistence
([`doc/quickjs.texi::Binary JSON`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/doc/quickjs.texi#L958-L967)).
Not every efficient internal representation should become a durable interchange
format.

### Conformance is an owned baseline

The repository includes a Test262 runner, configuration, and a checked-in list
of expected failures. The runner distinguishes new failures from corrected or
changed ones
([`doc/quickjs.texi::Test262`](https://github.com/bellard/quickjs/blob/04be246001599f5995fa2f2d8c91a0f198d3f34c/doc/quickjs.texi#L187-L242)).
A compact implementation still anchors language claims to an external standard
suite and an explicit exception baseline.

## Source map

| Pressure               | Start here                                                                            | Inspect                                       |
| ---------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------- |
| Host API and ownership | `quickjs.h`, C API section of `doc/quickjs.texi`                                      | runtimes, contexts, values, exceptions, jobs  |
| Resource bounds        | `JS_NewRuntime2`, `JS_SetMemoryLimit`, `JS_SetMaxStackSize`, `JS_SetInterruptHandler` | allocator and execution policy seams          |
| Compiler path          | compiler sections in `quickjs.c`, `quickjs-opcode.h`                                  | direct bytecode, optimization, stack analysis |
| Runtime representation | `JSValue`, atom, shape, and function code in `quickjs.c`                              | fast paths and representation tradeoffs       |
| Memory reclamation     | `JS_FreeValue`, `gc_decref`, `gc_scan`, `gc_free_cycles`                              | deterministic common path and cycle handling  |
| Embedding examples     | `quickjs-libc.c`, `examples/`                                                         | native modules and host integration           |
| Conformance            | `run-test262.c`, `test262.conf`, `test262_errors.txt`                                 | external suite and known-error baseline       |

## Transfer limits

QuickJS optimizes for a small embeddable interpreter in C. Explicit reference
counting exposes ownership but also creates manual obligations. Its direct
bytecode path, private version-bound format, lack of runtime multithreading, and
large central source file are domain tradeoffs, not general ideals.

Use Tinygrad or esbuild as a counter-lens when the target has repeated
transformations that need inspectable intermediate states, replay, or parallel
work. Use SQLite when persisted formats or crash recovery must remain compatible
across versions.
