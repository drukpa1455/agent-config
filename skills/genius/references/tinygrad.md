# Tinygrad: George Hotz and Contributors

Tinygrad is the lens for semantic convergence, explicit transformation phases,
planner-owned order, realization, structural introspection, and deletion
pressure.

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
not from making the public API small. The center is semantic rather than
universal: realized buffers and metadata are attached through weak side mappings
instead of becoming part of every node's structural fields
([`tinygrad/uop/ops.py::buffers,all_metadata`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/uop/ops.py#L166-L240)).

### Shared representation still has phase contracts

`Ops` spans tensor, movement, call, schedule, program, source, and binary forms,
while `spec_tensor`, `spec_program`, and `spec_full` define different legal
states
([`tinygrad/uop/spec.py`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/uop/spec.py#L130-L246)).
A common representation removes translators only when legality remains explicit.
At the default `SPEC=1`, validation runs at scheduling and code-generation
boundaries; higher modes additionally validate UOps as they are constructed
([`tinygrad/helpers.py::SPEC`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/helpers.py#L248-L259),
[`tinygrad/schedule/__init__.py::lower_sink_to_linear`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/schedule/__init__.py#L108-L124),
[`tinygrad/codegen/__init__.py::full_rewrite_to_sink`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/codegen/__init__.py#L260-L358)).
The transferable choice is proportional validation at semantic transitions, not
checking every object at maximum cost.

### Variability is normalized before identity and caching

Tinygrad uses different identities for different jobs. Live UOps are
weak-interned by `(op, dtype, src, arg, tag)`. Their recursive `key` hashes
operation, dtype, argument, and source keys while excluding tags, metadata, and
realized-buffer state
([`tinygrad/uop/ops.py::UOpMetaClass,UOp.key`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/uop/ops.py#L166-L240)).

Before schedule caching, `transform_to_call` replaces concrete global buffers
and slices with parameters, strips values from symbolic bindings, and returns the
mapping from original values to final storage
([`tinygrad/callify.py::transform_to_call`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/callify.py#L207-L226)).
Structural cache identity is therefore normalized separately from live object
identity, diagnostics, runtime bindings, and storage. This is purpose-specific
identity, not a generic argument for caching.

### Realization is a named effect boundary

`Tensor.realize` selects unrealized work, creates a linear schedule, and passes
it to `run_linear`; schedule tests prove planning does not allocate underlying
device memory while execution does
([`tinygrad/tensor.py::Tensor.realize`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/tensor.py#L178-L197),
[`test/null/test_schedule.py::test_buffer_has_buffer`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/test/null/test_schedule.py#L37-L47)).
Laziness earns its cost by making global validation, ordering, fusion, memory
planning, and target selection possible before effects.

The boundary includes more than the final dispatch loop. `run_linear` compiles
before execution, and local-size optimization can allocate temporary buffers and
benchmark candidate launches
([`tinygrad/engine/realize.py::optimize_local_size`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/engine/realize.py#L87-L105),
[`tinygrad/engine/realize.py::run_linear`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/engine/realize.py#L262-L281)).
Compilation is therefore not guaranteed pure; a transferred design must name any
benchmarking, allocation, or probing inside its effect boundary.

### Planning owns order as data

The scheduler derives both read-after-write and write-after-read hazards from
`AFTER` buffer states, rejects cycles, and returns one `LINEAR` whose sources are
ordered calls. `run_linear` walks that order instead of reconstructing the graph
([`tinygrad/schedule/__init__.py::create_schedule`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/schedule/__init__.py#L29-L99),
[`tinygrad/engine/realize.py::run_linear`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/engine/realize.py#L252-L281)).

The memory planner derives lifetimes from `LINEAR` and substitutes arena slices
into it. Copy and compute buffers use separate arenas so reuse cannot introduce
false copy-to-compute-to-copy dependencies
([`tinygrad/schedule/memory.py::memory_plan_rewrite`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/schedule/memory.py#L20-L64),
[`test/null/test_memory_planner.py`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/test/null/test_memory_planner.py#L172-L218)).
The transferable invariant is one owner for causal order, including state
hazards, and no derived optimization that silently changes it.

### Introspection follows transformations

Debug levels expose schedules, optimizations, generated code, UOps, linearized
operations, assembly, and timings. Rewrite tracking records named rewrites,
matched nodes, source locations, and timing
([`docs/env_vars.md`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/docs/env_vars.md#L63-L73),
[`tinygrad/uop/ops.py::graph_rewrite`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/uop/ops.py#L1416-L1542)).
Observability attached to canonical transitions explains where meaning changed.
Process replay retains lowering inputs and compares generated source across
revisions, so refactors can preserve intermediate behavior rather than only final
numerical output
([`test/external/process_replay/README.md`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/test/external/process_replay/README.md#L1-L14)).

The rewrite machinery itself contains fixed-point loop detection, a stack bound,
and explicit call-entry behavior
([`tinygrad/uop/ops.py::RewriteContext`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/uop/ops.py#L1568-L1680)).
Tinygrad concentrates transformation complexity; specs, tracing, and replay pay
for it.

### Target variability stays at capability edges

A compiled device combines allocation, candidate renderers, a runtime program
constructor, and optional graph support. Renderers expose target capabilities
and lower program UOps into source or assembly
([`tinygrad/device.py::Compiled`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/device.py#L289-L338),
[`tinygrad/renderer/__init__.py::Renderer`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/renderer/__init__.py#L58-L84)).
Target adapters add capabilities and effects without forking the tensor surface
or core language.

After scheduling, execution ownership is explicit:

| Owner                       | Fact or effect                                                     |
| --------------------------- | ------------------------------------------------------------------ |
| `CALL`                      | Executable payload and ordered arguments                           |
| `LINEAR`                    | Cross-call order                                                   |
| `ExecContext`               | Runtime bindings, statistics, JIT, wait, timeout, and cache policy |
| `pm_exec`                   | Dispatch by payload kind                                           |
| `Buffer` and device runtime | Allocation, views, transfer, loading, launch, and synchronization  |

`run_linear` constructs the context and dispatches each call; no execution-item
wrapper reconstructs those facts
([`tinygrad/engine/realize.py`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/engine/realize.py#L131-L281)).

### Performance ownership follows phase ownership

Tinygrad separates compile speed, execution speed, model speed, and kernel speed.
Its guide associates their primary pressure with Python graph rewrites,
driver/runtime dispatch, scheduling and materialization, or code generation
([`docs/developer/speed.md`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/docs/developer/speed.md#L1-L49)).
This is a diagnostic decomposition, not exclusive causality: phases interact. A
benchmark is useful only when it names the constrained phase, workload, baseline,
and complexity tradeoff. Optimizing the renderer cannot repair a poor
materialization schedule.

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

## Known limits are part of the evidence

Tinygrad's speed guide says the scheduler still lacks a systematic answer for
recomputation versus materialization
([`docs/developer/speed.md`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/docs/developer/speed.md#L24-L47)).
Schedule tests preserve many current kernel counts beside TODOs for better fusion.
The visible semantic center makes these gaps inspectable; it does not make the
heuristics complete. Do not infer perfection or a universal design law from a
small architecture.

## Source map

| Pressure                       | Start here                                     | Inspect                                             |
| ------------------------------ | ---------------------------------------------- | --------------------------------------------------- |
| Public sugar and core language | `tinygrad/tensor.py`, `tinygrad/mixin/`        | `_apply_uop`, broad operations converging on UOps   |
| Identity and legal states      | `tinygrad/uop/ops.py`, `tinygrad/uop/spec.py`  | interning, structural keys, side state, phase specs |
| Transform machinery            | `PatternMatcher`, `RewriteContext`             | rule indexing, fixed points, traversal, tracing     |
| Early normalization            | `tinygrad/callify.py`                          | buffer parameterization and cache boundary          |
| Planning and order             | `tinygrad/schedule/__init__.py`, `rangeify.py` | state hazards, kernel splitting, and `LINEAR`       |
| Resource lifetime              | `tinygrad/schedule/memory.py`                  | lifetimes, arena lanes, and plan-preserving reuse   |
| Realization                    | `tinygrad/engine/realize.py`                   | compile rules, execution context, dispatch          |
| Repeated execution             | `tinygrad/engine/jit.py`                       | captured linears, parameterization, replay          |
| Target edges                   | `tinygrad/device.py`, `renderer/`, `runtime/`  | allocator, renderer, compiler, runtime capabilities |
| Replay and proof               | `test/external/process_replay/`, `test/null/`  | intermediate equivalence and structural contracts   |

Read the [worked trace](tinygrad-worked-trace.md) for a reproduced
`MUL -> LINEAR -> PROGRAM -> run_linear` path and exact evidence format.

## Transfer limits

Tinygrad is a fast-moving local compiler/runtime. Its process-global caches,
environment controls, weak-reference interning, compact style, pragmatic import
cycles, and device assumptions are not templates for durable multi-user systems.
Such targets still need stable identity, permissions, idempotency,
transactionality, bounded retries, receipts, and repair. When compatibility,
corruption resistance, or long-lived external state dominates, Tinygrad may be
the wrong lens; do not force it.
