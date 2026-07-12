# AGENTS

This workspace values **radical simplicity** and **maximum elegance**. Write code
that reads like pseudocode: few concepts, crisp boundaries, deterministic flows,
and obvious ownership.

Small means low cognitive load, not the smallest patch. Fix root causes, choose
primitives that can carry the system, start simple, and upgrade when evidence
demands it. Avoid band-aids, clever golf, and speculative architecture.

## Defaults

- Every line and concept must earn its keep. Readability beats cleverness.
- Be honest; do not bluff or merely agree. Push back on unnecessary complexity
  or weak framing, state uncertainty, recommend a path, and act once intent is
  clear.
- Read before editing or claiming. Ask only when missing evidence leaves a
  consequential tradeoff unresolved. Research, review, and unowned repositories
  remain read-only unless a change or contribution is requested.
- Keep each change to one purpose. Do not mix behavior, refactors, cleanup,
  generated churn, or whitespace unless they are inseparable.
- Communicate with the same discipline as the code: answer first, stay concise,
  and add detail only when it changes a decision. Compress phrasing, not meaning;
  preserve exact technical terms, code, commands, and errors.
- Project guidance specializes these defaults but cannot weaken privacy or the
  high-impact boundary below.

## Design

- **Tiny core, wide reach:** identify the primitives; everything else is
  composition.
- **One source of truth:** define facts once and derive tables, indexes, and build
  artifacts. Change generators, not generated outputs.
- **Truth is visible:** avoid magic shims and implicit surfaces; call or import
  the real owner.
- **Wrappers must pay rent:** add a real seam—such as an invariant, cache, retry,
  or instrumentation—or call directly.
- **Core is pure:** stable domain logic is explicit input to explicit output.
  Keep orchestration pragmatic: compose semantic functions, contain I/O and
  workflow translation, and do not generalize it prematurely.
- **Normalize variability early:** turn optional, environment-dependent, sync,
  and async paths into one straight-line internal flow at the boundary.
- **Determinism is a feature:** make time, randomness, environment, and external
  input explicit and controllable.
- **Canonical paths and boundaries matter:** give each concern one owner and one
  path; lower layers do not import upward, and cycles are design bugs.
- **Ownership is explicit:** state, caches, locks, and clients have obvious
  owners, lifetimes, and cleanup.
- **Write semantics are explicit:** name the source of truth, durability,
  visibility, consistency, replay, and repair behavior.
- **Derived data is replaceable:** name its source, staleness, rebuild, and repair
  semantics.
- **External work is bounded:** cap waits, retries, capacity, memory, and
  concurrency; expose failure, observability, and cleanup ownership. Retry only
  idempotent or transactional work, and inspect unknown success before retrying.

## Code shape

- Organize files top-down: entrypoints first, orchestration next, semantic helpers
  after, and deep internals last. Keep the happy path straight.
- Function and file size are design signals, not quotas. Split only at real
  responsibility boundaries.
- Names carry intent: prefer short, purpose-first nouns and verbs; avoid vague
  `Manager`, `Helper`, or `Util` names unless they are genuinely generic.
- Comments and docstrings carry necessary why or contract value, not syntax or
  code organization.
- Treat optional fields and same-shaped identifiers as design warnings. Prefer
  composed models and distinct domain types that make invalid states difficult.
- Keep dependencies visible with explicit imports and exports; avoid re-export
  chains, wildcard surfaces, and unnecessary aliases.

## Delivery

- In a user-owned repository, a request to implement, fix, proceed, work through,
  or land authorizes the routine path: inspect, isolate, implement, verify,
  commit, push, coordinate issues and PRs, address valid review findings, merge,
  and clean up. Do not pause for normal Git or GitHub steps.
- Follow project workflow and use coordination tools proportionately. Isolate
  nontrivial or concurrent work, preserve unrelated changes, and absorb
  compatible drift. Issues, stages, worktrees, and PR stacks are tools, not
  prerequisites.
- Keep each landed change coherent, single-purpose, and independently
  verifiable. Exact-revision reviews and production remain revision-bound.

## Evidence

- Validate external input and dependency responses at trust boundaries; retain
  diagnostic context and fail on impossible state.
- Test behavior changes. Characterize unclear or weakly tested behavior before
  changing its semantics.
- Verify with fresh evidence before claiming success. Benchmark performance and
  prove refactor equivalence. Treat review findings as hypotheses to test, not
  instructions to obey.

## High-impact boundary

- Confirm only immediately before money movement, new paid commitments or
  material spend, production mutation, irreversible loss, or exposing
  credentials or private/customer data. Bind confirmation to the exact target,
  revision, and hard limit; keep sensitive data out of Git unless sharing it is
  explicit.
