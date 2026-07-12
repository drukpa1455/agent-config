---
name: tinygrad-design
description: Apply a source-backed Tinygrad and George Hotz design lens to architecture, system design, abstraction, code organization, introspection, refactors, and difficult implementation choices. Use when the user explicitly asks what Tinygrad or geohot would do, requests a Tinygrad comparison, or asks to study Tinygrad for ideas before designing.
disable-model-invocation: true
license: MIT
compatibility: Requires read access to a Tinygrad checkout for source-backed analysis.
---

# Tinygrad Design

Use Tinygrad as comparative evidence, not as an aesthetic costume. Study the
actual target first, trace the relevant current Tinygrad path, then transfer an
invariant only when it reduces the target's real complexity.

Read [the source map](references/source-map.md) when selecting upstream paths or
applying the design principles below.

## Orient

1. State the target's user-visible outcome, canonical state, hot path, effect
   boundary, and hardest invariant.
2. Identify the concrete design pressure: duplicated semantics, scattered
   branches, hidden order, adapter leakage, premature work, opaque identity,
   weak replay, or an abstraction that may not earn its keep.
3. Read the target's owning code and tests before seeking an analogy.

## Ground in current source

Resolve Tinygrad from the first available location:

1. `TINYGRAD_PATH`
2. the target repository's `submodules/ai/tinygrad`
3. `~/src/tinygrad`

Read Tinygrad's `AGENTS.md`, record `git rev-parse HEAD`, and keep the checkout
read-only. Do not fetch, initialize a submodule, install dependencies, or clone
without explicit approval. If no checkout is available, report the source gap
instead of substituting memory.

Select only the source paths relevant to the pressure. Trace one complete path
from public entrypoint through representation, transformations, realization,
and target adapter. Then inspect the tests and use history when it can explain
the suspicious seam. Tinygrad moves quickly; verify symbols and paths rather
than trusting a stale summary.

## Translate mechanics, not nouns

For each useful observation, write down:

- **Mechanic:** what current Tinygrad source actually does, with revision, path,
  and symbol.
- **Invariant:** the complexity or invalid state that mechanic removes.
- **Target analogue:** the target's own domain concept, without borrowing
  `Tensor`, `UOp`, kernel, or device names gratuitously.
- **Divergence:** durability, authority, security, audit, latency, or team-scale
  constraints that make the target different.
- **Consequence:** the smallest deletion, primitive, phase boundary, or test
  that follows.

Prefer these recurring moves when the evidence fits:

1. One canonical internal language; ergonomic surfaces lower into it early.
2. Explicit, inspectable phases rather than control flow smeared across callers.
3. A deliberate realization boundary between describing work and causing work.
4. Named deterministic transforms instead of provider or target branches in the
   core.
5. Execution order represented as data and consumed directly.
6. Thin edge adapters that add only target capabilities and effects.
7. Visible identity semantics for interning, caching, replay, and diagnostics.
8. Specs that define legal states at each phase and eliminate transitional
   states before the next boundary.
9. Structural observability at every lowering step, not logs only at the end.
10. Deletion pressure: merge duplicate carriers, then delete the survivor when
    the canonical representation can own the phase directly.

## Write and organize

Arrange modules and top-level functions in the order work actually flows. Keep
entrypoint orchestration straight: normalize, transform, plan, realize. Let data
carry semantics and order; let functions perform named transformations; let
classes earn their existence through identity, state, or a real capability.
Keep presentation and diagnostics derived from canonical phase data. Prefer one
deep readable module over shallow wrappers, but split I/O, authority, target
capabilities, and independently testable phases at explicit boundaries.

## Resist cargo culting

- Do not introduce a graph, IR, scheduler, rewrite engine, cache, JIT, or generic
  adapter merely because Tinygrad has one. Direct code wins when there is no
  repeated transformation problem.
- Do not copy dense syntax, line compression, global caches, environment-driven
  semantics, process-local identity, or hardware-specific tradeoffs into a
  durable multi-user system.
- Do not call an idea "geohot's intent" unless an explicit primary source says
  so. Distinguish repository evidence, project policy, and your inference.
- Do not treat low line count as the goal. Tinygrad's stated goal is lower deep
  complexity and greater readability; performance claims require benchmarks.

## Prove the transfer

Test both output and architecture. Depending on the change, prove canonical
identity, phase legality, deterministic ordering, laziness before realization,
adapter deletion, replay across fresh processes, or absence of a legacy path.
Benchmark any speed or resource claim. For a refactor, compare a representative
intermediate or replay artifact, not only final output.

Report the recommendation first. Include only decisive Tinygrad evidence, the
translated invariant, where the analogy breaks, and the verification or
smallest next experiment. If Tinygrad teaches that the target needs no new
abstraction, say so directly.
