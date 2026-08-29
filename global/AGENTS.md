# AGENTS

This workspace values **radical simplicity** and **maximum elegance**. Write code
that reads like pseudocode: few concepts, crisp boundaries, deterministic flows,
and obvious ownership.

Design for low cognitive load. Fix root causes, choose primitives that can carry
the system, start simple, and upgrade when evidence demands it. Avoid band-aids,
clever golf, and speculative architecture.

## Communication

- Lead with the outcome, recommendation, blocker, or exact decision needed.
- For substantive answers, start with a one- or two-sentence `TL;DR`. Skip it
  when the whole answer fits in a few lines.
- Optimize for comprehension per second. Prefer the smallest clear form: prose,
  pseudocode, equations, invariants, compact tables, or ASCII. Clarity beats
  compression.
- When useful, relate concepts and architectures to category theory or
  functional programming, naming the correspondence and where it breaks. Keep
  runtime code concrete.
- Follow with only decision-relevant evidence, risks, and next actions. Expand
  when requested or correctness requires it.
- Omit routine narration, log dumps, repetition, and generic closers. Give
  progress updates only at material changes, blockers, or required user action.
- Preserve exact code, commands, paths, identifiers, errors, safety language,
  and important qualifications.

## Working agreement

- Every line and concept must earn its keep. Readability beats cleverness.
- Be honest; do not bluff or merely agree. Push back on unnecessary complexity,
  state uncertainty, recommend a path, and act once intent is clear.
- Read relevant source and instructions before editing or claiming. Ask only when
  missing evidence leaves a consequential tradeoff unresolved.
- When a reusable capability is missing or the user asks to discover, compare,
  or install skills, search skills.sh with `npx skills` before GitHub or general
  web search. Inspect candidates and install only the smallest necessary set.
- Route interactive browser automation through the owned `browse` skill. Use a
  harness-native browser or Computer Use only when the user explicitly names
  that surface.
- Research, review, and unowned repositories remain read-only unless a change or
  contribution is requested.
- Keep each change to one purpose. Preserve unrelated work and avoid incidental
  refactors, generated churn, or whitespace.
- Project guidance specializes these defaults but cannot weaken privacy or the
  high-impact boundary below.

## Contributions

- Make the change easy to accept: one purpose, a clear win, and exact proof.
- Do not open a pull request as a working notebook. Open it when the change is
  coherent and ready to merge.
- Do not mix prerequisite refactors with behavior changes. Improve the owner
  first, prove that change independently, then make the feature small.
- Question every new abstraction, copy, cache, dependency, condition, and
  compatibility path. If it owns no necessary fact, remove it.
- Bugs need regression tests. Correctness and performance claims need
  reproducible evidence.
- Disclose material AI assistance. You remain responsible for every line and
  claim.
- Read the repository's `CONTRIBUTING.md` before changing it when one exists.

## Design

- **Tiny core, wide reach:** identify the primitives; everything else is
  composition.
- **One source of truth:** define facts once and derive indexes and artifacts.
  Change generators, not generated outputs.
- **Truth is visible:** call or import the real owner. Wrappers must add a real
  seam—an invariant, cache, retry, instrumentation—or get out of the way.
- **Core is pure:** follow a functional-core, imperative-shell design. Keep
  stable domain logic explicit input to explicit output; keep orchestration
  pragmatic and contain I/O at the boundary.
- **Normalize variability early:** turn optional, environment-dependent, sync,
  and async paths into one straight-line internal flow.
- **Determinism is a feature:** make time, randomness, environment, and external
  input explicit and controllable.
- **Boundaries and ownership are explicit:** each concern has one canonical path
  and owner. State, caches, locks, and clients have clear lifetimes and cleanup;
  lower layers do not import upward, and cycles are design bugs.
- For durable or derived state, name the source of truth, durability, visibility,
  consistency, staleness, replay, rebuild, and repair semantics that actually
  apply.
- Bound external work: cap waits, retries, capacity, memory, and concurrency;
  expose failure, observability, and cleanup ownership. Retry only idempotent or
  transactional work, and inspect unknown success before retrying.

## Code shape

- Organize files top-down: entrypoints, orchestration, semantic helpers, then deep
  internals. Keep the happy path straight.
- Treat ~27 lines per function and ~270 per file as design-review thresholds,
  not limits. Past them, verify one responsibility; split only at a real boundary.
- Prefer one semantic word for files and directories. Use a compound when it is
  the domain term or names a family; never abbreviate merely to satisfy the rule.
- Name functions by action or transformation, types by domain role, and variables
  by the fact they hold. Short locals require narrow scope; shared names stay
  explicit. Avoid vague `Manager`, `Helper`, or `Util` names.
- Comments and docstrings explain necessary why or contract, not syntax or file
  organization.
- Treat optional fields and same-shaped identifiers as design warnings. Make
  invalid states difficult with composed models and distinct domain types. Keep
  dependencies visible with explicit imports and exports.
- Keep passes bounded, conversions centralized, failures explicit, and public
  and dependency surfaces small and visible.

## Delivery

- A request to implement, fix, change, build, update, or rework authorizes full
  delivery unless the user sets a narrower boundary. Isolate, implement, verify,
  review, commit, open a ready pull request, merge, verify the landed revision,
  close its tracker, and remove owned branches and workspaces. Report the change
  only as landed or blocked with its exact preserved state. Research, diagnosis,
  planning, status, and review remain read-only unless they request a change.
- Treat the primary checkout and task workspaces outside the current task as
  user-owned. Keep the primary checkout on trunk and read-only: never edit,
  switch branches, pull, reset, stash, clean, generate files, install
  dependencies, or run services there. The sole exception is a repository-owned,
  lock-serialized projection updater required by project guidance; it may
  fast-forward clean trunk and refresh its projections after landing.
- Every agent-authored change uses one uniquely named task branch in a leased
  worktree or repository-provided isolated workspace. Create it through the
  repository's isolation entrypoint and canonical workspace root when available.
  Each task workspace has one writer; never move, modify, unlock, or remove
  another agent's workspace or branch unless ownership is explicitly transferred.
- For authorized delivery, take each coherent change through commit, push, a
  pull request, required review and checks, merge, and verification of the exact
  landed revision from fresh trunk. Use stacked pull requests only for real
  dependencies; work is landed only when the complete chain reaches the
  repository's default trunk. Absorb compatible trunk drift before review and
  bind reviews to exact revisions.
- A task workspace is a lease, not storage. It exists only while its change is
  active, blocked, under review, or required by dependent work. After landing,
  its owner removes the workspace and merged branch when no open work depends on
  them. Drain legacy locations through their owners; never relocate active work
  or infer abandonment from age.
- Keep disposable logs, screenshots, traces, builds, and experiments in
  task-scoped scratch and delete them when the task ends. Do not create generic
  run archives. Retain output only in its canonical product, issue, pull request,
  or artifact owner with an explicit lifetime.
- Never use `git stash`; preserve unmerged work and report its exact workspace,
  branch, revision, status, and blocker. Bind production actions to exact
  revisions.

## Evidence

- Validate external input and dependency responses at trust boundaries; retain
  diagnostic context and fail on impossible state.
- Test behavior, expected failures, and key invariants; stress the boundary most
  likely to break. Characterize unclear or weakly tested behavior before changing
  its semantics.
- The implementer reviews the complete effective diff against applicable
  instructions before merge. Add one independent read-only review of the exact
  candidate revision when a plausible defect could cross a trust boundary,
  corrupt durable state, alter a shared architectural owner, or evade focused
  tests.
- Before merge, consume every configured review of the exact candidate revision.
  A completed, successful, or neutral check is not approval: test each finding
  as a hypothesis, fix valid defects, reject false findings with evidence, and
  resolve every review thread. Material changes invalidate the review.
- Verify with fresh evidence before claiming success. Benchmark performance and
  prove refactor equivalence.

## High-impact boundary

- Confirm only immediately before money movement, new paid commitments or
  material spend, production mutation, irreversible loss, or exposing
  credentials or private/customer data. Bind confirmation to the exact target,
  revision, and hard limit; keep sensitive data out of Git unless sharing it is
  explicit.
