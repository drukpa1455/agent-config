# Repository readiness

Use this checklist when readiness is the requested outcome. Scale it to the
repository and change; it does not add gates to an ordinary scoped task. Follow
[shared policy](../../../global/AGENTS.md), including its authorization boundaries.

Bind the review to `repository@revision`, outcome, owner, consumer, and the
existing spec or issue. Record applicable proof or the exact gap there; mark
inapplicable items with a reason. Keep current evidence separate from target
behavior, and use the existing tracker rather than a parallel status system.

## Checklist

- [ ] **Outcome.** One owner and a clear finish line identify what consumers can
  do, the scope, dependencies, blockers, and acceptance evidence. A pending spec
  or untested target is a gap, not proof of readiness.
- [ ] **Taxonomy.** The actual tree explains capabilities, cohesive modules and
  submodules, and their owners. Prefer clear one-word module/file names with
  necessary ecosystem exceptions. Nest at real responsibility boundaries;
  avoid arbitrary flattening, forced depth, and mechanical renaming. Symbols,
  public surfaces, docs, and tests use the same concepts and names.
- [ ] **Boundaries.** Each fact, state, and effect has a visible owner and lifetime.
  Dependencies follow those boundaries; cohesion does not justify hidden coupling
  or cycles. Packaging and import contracts justify each `__init__.py`; it is
  empty or contains only necessary re-exports, with implementation in named
  modules. Authorization, consequential failures, recovery, and compatibility
  are explicit where relevant.
- [ ] **Surfaces.** Identify which API, SDK, CLI, and MCP surfaces actually apply.
  For each applicable surface, separate current revision-bound behavior from
  target behavior and gaps. They expose consistent concepts through explicit
  bindings to the owning capability. A repository need not implement every
  transport, and a planned surface is not an available one.
- [ ] **Installed journey.** Demonstrate one meaningful consumer journey in an
  independent environment, outside the source checkout, using the installed
  artifact and its documented entrypoint. Record artifact version, commands,
  observable result, and the relevant endpoint, identity, resource/namespace,
  configuration, and dependency bindings without exposing secrets. Use a non-editable install,
  without source-path injection or implicit host state. Use authorized
  fixtures; identify setup, relevant failure/recovery behavior, and owned cleanup.
- [ ] **Documentation.** Public setup and examples run against the stated installed
  version with explicit prerequisites and bindings. Internal architecture names
  actual owners, data/effect flow, dependencies, and failure/recovery paths, and
  distinguishes current topology from proposals. Links, symbols, and commands
  resolve; undocumented host state cannot stand in for an explanation.
- [ ] **Proof.** Reuse the smallest high-signal tests and fixtures proving important
  public behavior, invariants, and consequential failures. Choose unit, contract,
  integration, or journey checks at the owning risk boundary; an installed journey
  does not replace necessary unit proof. Preserve essential authorization,
  financial correctness, recovery, and integration guarantees. Avoid redundant or
  implementation-mirroring tests, arbitrary count targets, and mass deletion.
  Start focused; broaden for actual cross-boundary risk or an evidence gap, and
  reuse unchanged passing results.
- [ ] **Delivery.** The reviewed revision, useful demonstration, necessary consumer
  adoption, and reconciled docs/tracking establish completion. Owned scratch,
  fixtures, resources, and task state have explicit lifetimes and safe cleanup.
  Preserve others' work, dirty files, and unrecoverable data; report remaining
  gaps and preserved state instead of claiming completion.

For a multi-surface review, use a compact table in the existing spec or issue:

| Surface | Current evidence | Target or gap | Applicability and reason |
| --- | --- | --- | --- |
| Applicable API, SDK, CLI, or MCP | Revision and proof | Spec decision or blocker | Consumer need, or why inapplicable |

## Tinygrad grounding

The pinned [Tinygrad study](../../lens/references/tinygrad.md) uses
`tinygrad/tinygrad@e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b`:

- The [tree](https://github.com/tinygrad/tinygrad/tree/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad)
  groups `engine/jit.py` and `engine/realize.py`, with nested
  `codegen/decomp/`, `codegen/late/`, and `codegen/opt/search.py`. Concise names
  and hierarchy expose related responsibilities; transfer that clarity, not
  compiler machinery or exact vocabulary.
- [`tensor.py::Tensor`](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/tensor.py)
  and `uop/ops.py::UOp` name public behavior and its semantic owner. Keep the
  target repository's own concepts equally deliberate across surfaces.
- Tinygrad's [package initializer](https://github.com/tinygrad/tinygrad/blob/e69ce4be7f6e24f8641a50aa4dfba5a97224ee9b/tinygrad/__init__.py)
  includes runtime logic. The re-export-only initializer rule above is the
  owner's stricter convention, not a claim that Tinygrad follows it. Transfer
  demonstrated invariants rather than every upstream convention.
