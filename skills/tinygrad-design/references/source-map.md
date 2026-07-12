# Tinygrad Design Source Map

This guide was validated against upstream Tinygrad
`e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b` on 2026-07-11. Tinygrad changes
rapidly: record the checkout revision and verify every path and symbol before
using it as evidence.

## Current end-to-end path

```text
Tensor methods and mixins
  -> UOp tensor graph
  -> transform_to_call
  -> rangeify and kernel graph rewrites
  -> ordered LINEAR(CALL, ...)
  -> compile_linear / to_program
  -> run_linear
  -> renderer, compiler, runtime, allocator
```

The important property is not these names. Friendly syntax converges into one
small graph vocabulary, transformations remain explicit and inspectable, and
realization consumes an ordered representation rather than reconstructing
intent from wrappers.

Start with `docs/developer/developer.md`, `docs/developer/layout.md`, and
`docs/abstractions3.py` for orientation, then verify the path in core source and
tests. Tinygrad's README warns that code outside `tinygrad/` is less tested;
examples demonstrate use but do not own architecture. Documentation can lag the
fast-moving source, and older diagrams that end in `ExecItem` are no longer
current.

## Find the relevant source

| Design pressure                  | Start here                                                                                       | What to inspect                                                                            |
| -------------------------------- | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| Public API versus deep core      | `tinygrad/tensor.py`, `tinygrad/mixin/`                                                          | `Tensor._apply_uop` and how broad sugar immediately constructs `UOp`                       |
| Canonical language and identity  | `tinygrad/uop/__init__.py`, `tinygrad/uop/ops.py`                                                | `Ops`, `UOp`, interning in `UOpMetaClass`, content key, traversal, replacement             |
| Legal and transitional states    | `tinygrad/uop/spec.py`                                                                           | `spec_tensor`, `spec_program`, `spec_full`, and which operations must disappear            |
| Early normalization              | `tinygrad/callify.py`                                                                            | `transform_to_call`, buffer normalization, cache-key boundary                              |
| Planning and deterministic order | `tinygrad/schedule/__init__.py`, `tinygrad/schedule/rangeify.py`                                 | `get_kernel_graph`, dependency construction, `create_linear_with_vars`                     |
| Resource lifetime                | `tinygrad/schedule/memory.py`                                                                    | Lifetimes transformed into arena slices without a parallel execution model                 |
| Lowering and transforms          | `tinygrad/codegen/`, `tinygrad/uop/symbolic.py`, `tinygrad/uop/movement.py`                      | Named pattern sets and progressive `PROGRAM` sources                                       |
| Realization and effects          | `tinygrad/engine/realize.py`                                                                     | `compile_linear`, `pm_exec`, `run_linear`; ordered `CALL` nodes dispatch directly          |
| Repeated execution               | `tinygrad/engine/jit.py`                                                                         | Capture and transform the same `LINEAR` representation rather than inventing a second plan |
| Target seams                     | `tinygrad/device.py`, `tinygrad/renderer/`, `tinygrad/runtime/ops_*.py`                          | Capability-bearing renderer/compiler/runtime/allocator boundaries                          |
| Introspection                    | `docs/env_vars.md`, rewrite tracking in `tinygrad/uop/ops.py`, `tinygrad/viz/`                   | Intermediate IR, generated code, timings, rewrite traces, and assembly                     |
| Refactor confidence              | `test/external/process_replay/`, `test/null/test_schedule.py`, `test/null/test_graph_rewrite.py` | Intermediate replay, kernel shape, laziness, and rewrite equivalence                       |

Use `rg` to locate current symbols, `git log -- <path>` to find why a seam moved,
and `git show <commit> -- <path>` to inspect a clarifying deletion or refactor.
Read a narrow end-to-end slice; do not browse unrelated accelerator code for a
workflow-design question.

## Project ethos supported by primary evidence

Tinygrad's current `README.md` explicitly says:

- low line count is a guiding light, but code golf is rejected;
- the true goal is reducing complexity and increasing readability;
- speedups must be benchmarked against maintainability;
- large or complex diffs should be decomposed into independently clear wins;
- prerequisite refactors are valuable when they make the final feature tiny;
- deep-core readability, dead-code removal, regression tests, fuzzers, and
  process replay are valued.

That policy supports a design method: make the semantic center smaller, not the
text denser. A three-line feature is compelling only when prior simplification
made those three lines the honest consequence of the design.

## Pearls visible in source and history

### One language can span phases without one undifferentiated state

`Ops` includes tensor, scheduling, call, linear, program, source, and binary
forms. `uop/spec.py` gives different phases different legality rules. The same
node machinery is reused, while phase contracts still prevent every operation
from being valid everywhere.

**Transfer:** reuse one representation framework when it removes translators,
but keep explicit phase-specific validity. "One IR" does not mean "all states
are legal at all times."

### The realization boundary makes laziness useful

`Tensor._apply_uop` constructs graph state. `Tensor.realize` produces a linear
schedule only for unrealized values. `run_linear` compiles and directly walks
its ordered calls.

**Transfer:** laziness is not deferred work by accident. It is a named boundary
where the system gains enough global knowledge to validate, order, optimize,
cap, preview, or reject work before effects.

### Order is data

The scheduler returns one `LINEAR` node whose sources are ordered `CALL` nodes.
The runtime iterates that order. It does not rediscover dependencies while
executing.

**Transfer:** once planning owns order, execution should consume it. A runtime
that replans from partial facts creates a second semantic owner.

### Transitional carriers should disappear

History shows a sequence rather than a slogan:

- `744af193f` merged `ScheduleItem` into `ExecItem`;
- `9656d97d9` changed JIT capture to retain linears, not execution items;
- `bb652352c` removed `ExecItem`, letting graph nodes plus `ExecContext` own the
  remaining facts;
- current `run_linear` dispatches each call through explicit execution rules.

**Transfer:** first converge duplicate carriers; then ask whether the remaining
carrier still owns a distinct phase. A class that only repackages canonical
facts is a deletion candidate.

### Intermediate states have a deletion direction

`spec_full` calls its accepted forms intermediate and says they should all be
deleted from that set. The contract admits migration states while making their
elimination direction visible.

**Transfer:** transitional compatibility should have one direction, a bounded
lifetime, and a testable deletion condition.

### Introspection follows the representation

Debug levels reveal scheduling, optimizations, generated code, IR, linearized
operations, and assembly. Rewrite tracing captures named passes and matched
nodes. Process replay compares generated kernels across commits.

**Transfer:** instrument canonical phase boundaries and transformations. End
logs cannot explain where meaning changed.

### Adapters are narrow because the core language is strong

Devices supply allocators, renderers, compilers, runtimes, and optional graph
support. Backend variation stays near those capability boundaries; the tensor
surface does not fork into a different framework per accelerator.

**Transfer:** normalize target variability at the edge. Extract a generic
adapter only from repeated real capabilities, not hypothetical providers.

## Where the analogy breaks

Tinygrad is a fast-moving compiler/runtime optimized around process-local
execution. Its global caches, environment controls, weak-reference process-local
interning, compact syntax, and device assumptions are not templates for systems
that need durable identity,
multi-tenant isolation, permissions, audit, idempotency, transactional effects,
or long-lived compatibility.

For those systems, retain the Tinygrad lessons about convergence, phases,
realization, adapters, deletion, introspection, and replay while adding the
domain's required authority and durability explicitly.
