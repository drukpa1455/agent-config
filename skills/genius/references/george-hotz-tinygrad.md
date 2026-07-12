# George Hotz, Contributors, and Tinygrad

Tinygrad is the lens for semantic convergence, explicit transformation phases,
realization, structural introspection, and deletion pressure.

This profile studies `tinygrad/tinygrad` at
[`e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b`](https://github.com/tinygrad/tinygrad/tree/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b),
observed on 2026-07-11. The repository is collaborative. Attribute a mechanic to
Tinygrad unless a commit or primary statement establishes individual ownership;
do not turn project behavior into a claim about George Hotz's intent.

## Use this lens when

- broad public operations continue as parallel internal models;
- transformation phases or legal states are implicit;
- execution rediscovers order already known during planning;
- effects occur before global validation or optimization;
- adapters leak target branches into the core;
- a wrapper or carrier may no longer own a distinct fact;
- final output cannot explain which transformation changed meaning.

Do not use it to justify a graph, compiler vocabulary, rewrite engine, cache,
scheduler, JIT, dense syntax, or low line count in ordinary application code.

## Observed path

```text
Tensor methods and mixins
  -> UOp tensor graph
  -> transform_to_call
  -> rangeify and kernel rewrites
  -> ordered LINEAR(CALL, ...)
  -> compile_linear / PROGRAM
  -> run_linear
  -> renderer, compiler, runtime, allocator
```

Tinygrad's developer guide separates frontend, scheduling, lowering, and
execution while saying Tensor syntax constructs UOps
([`docs/developer/developer.md`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/docs/developer/developer.md#L1-L36)).
The phases stay distinct but reuse one graph machinery.

## High-leverage mechanics

### A broad surface converges quickly

`Tensor._apply_uop` unwraps input tensors, constructs a UOp, and wraps the result
without creating another persistent semantic model
([`tinygrad/tensor.py::Tensor._apply_uop`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/tensor.py#L108-L116)).
The leverage comes from a wide ergonomic surface sharing one semantic center,
not from making the public API small.

### Shared representation still has phase contracts

`Ops` spans tensor, movement, call, schedule, program, source, and binary forms,
while `spec_tensor`, `spec_program`, and `spec_full` define different legal
states
([`tinygrad/uop/spec.py`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/uop/spec.py#L130-L246)).
A common representation removes translators only when legality remains explicit.

### Realization is a named effect boundary

`Tensor.realize` selects unrealized work, creates a linear schedule, and passes
it to `run_linear`; schedule tests prove planning does not allocate while
execution does
([`tinygrad/tensor.py::Tensor.realize`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/tensor.py#L178-L197),
[`test/null/test_schedule.py::test_buffer_has_buffer`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/test/null/test_schedule.py#L37-L47)).
Laziness earns its cost by making global validation, ordering, fusion, memory
planning, and target selection possible before effects.

### Planning owns order as data

The scheduler constructs dependencies and returns one `LINEAR` whose sources are
ordered calls. `run_linear` walks that order instead of reconstructing the graph
([`tinygrad/schedule/__init__.py::create_schedule`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/schedule/__init__.py#L29-L99),
[`tinygrad/engine/realize.py::run_linear`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/engine/realize.py#L252-L281)).
The transferable invariant is one owner for dependency order.

### Introspection follows transformations

Debug levels expose schedules, optimizations, generated code, UOps, linearized
operations, assembly, and timings. Rewrite tracking records named rewrites,
matched nodes, source locations, and timing
([`docs/env_vars.md`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/docs/env_vars.md#L63-L73),
[`tinygrad/uop/ops.py::graph_rewrite`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/uop/ops.py#L1416-L1542)).
Observability attached to canonical transitions explains where meaning changed.

### Target variability stays at capability edges

A compiled device combines allocation, candidate renderers, a runtime program
constructor, and optional graph support. Renderers expose target capabilities
and lower program UOps into source or assembly
([`tinygrad/device.py::Compiled`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/device.py#L289-L338),
[`tinygrad/renderer/__init__.py::Renderer`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/renderer/__init__.py#L58-L84)).
Target adapters add capabilities and effects without forking the tensor surface
or core language.

### Simplification culminates in deletion, not code golf

Tinygrad's contribution policy calls low line count a guiding light but rejects
code golf; it names reduced complexity and increased readability as the goal and
requires benchmarks for performance claims
([`README.md::Contributing`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/README.md#L165-L186)).

History first merged scheduling and execution carriers, moved JIT capture to the
linear representation, introduced direct `run_linear`, and then deleted
`ExecItem`:

- [`744af193f`](https://github.com/tinygrad/tinygrad/commit/744af193f08a94110eccf190b6275ca456f97ff8)
- [`9656d97d9`](https://github.com/tinygrad/tinygrad/commit/9656d97d97f6a6152791690e519d755756e77100)
- [`23ca680a3`](https://github.com/tinygrad/tinygrad/commit/23ca680a3a9d24f4a53add1ac674f2869e91673f)
- [`bb652352c`](https://github.com/tinygrad/tinygrad/commit/bb652352c75a46adf90734c076bf5fe026b6d4d2)

The lesson is re-ownership before deletion: remove a carrier only after its facts,
invariants, and consumers have moved to canonical owners.

## Source map

| Pressure                       | Start here                                     | Inspect                                             |
| ------------------------------ | ---------------------------------------------- | --------------------------------------------------- |
| Public sugar and core language | `tinygrad/tensor.py`, `tinygrad/mixin/`        | `_apply_uop`, broad operations converging on UOps   |
| Identity and legal states      | `tinygrad/uop/ops.py`, `tinygrad/uop/spec.py`  | structural identity, interning, phase specs         |
| Early normalization            | `tinygrad/callify.py`                          | buffer parameterization and cache boundary          |
| Planning and order             | `tinygrad/schedule/__init__.py`, `rangeify.py` | dependency construction and `LINEAR`                |
| Resource lifetime              | `tinygrad/schedule/memory.py`                  | lifetimes rewritten into arena slices               |
| Realization                    | `tinygrad/engine/realize.py`                   | compile rules, execution context, `run_linear`      |
| Target edges                   | `tinygrad/device.py`, `renderer/`, `runtime/`  | allocator, renderer, compiler, runtime capabilities |
| Replay and proof               | `test/external/process_replay/`, `test/null/`  | intermediate equivalence and structural contracts   |

Read the [worked trace](tinygrad-worked-trace.md) for a reproduced
`MUL -> LINEAR -> PROGRAM -> run_linear` path and exact evidence format.

## Transfer limits

Tinygrad is a fast-moving local compiler/runtime. Its process-global caches,
environment controls, weak-reference interning, compact style, pragmatic import
cycles, and device assumptions are not templates for durable multi-user systems.
Such targets still need stable identity, permissions, idempotency,
transactionality, bounded retries, receipts, and repair.

Use SQLite as a counter-lens when compatibility, corruption resistance, or
long-lived external state makes aggressive deletion unsafe.
