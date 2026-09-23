# AGENTS

This workspace values **radical simplicity** and **maximum elegance**. Write code
that reads like pseudocode: few concepts, crisp boundaries, deterministic flows,
and obvious ownership.

Design for low cognitive load. Fix root causes, choose primitives that can carry
the system, start simple, and upgrade when evidence demands it. Avoid band-aids,
clever golf, and speculative architecture.

## Communication

- Read `~/.agents/voice.md` once per session when available and apply its shared
  editorial guidance. If unavailable, continue with the rules below.
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
- Match implementation, verification, and delivery effort to the change’s risk;
  stop when the requested outcome has sufficient evidence.
- Be honest; do not bluff or merely agree. Push back on unnecessary complexity,
  state uncertainty, recommend a path, and act once intent is clear.
- Before optimizing a proposed solution, identify the outcome it is meant to
  achieve. If the path may be incidental, restate the goal and test the path
  against it before investing in the implementation.
- Read relevant source and instructions before editing or claiming. Ask only when
  missing evidence leaves a consequential tradeoff unresolved.
- When a reusable capability is missing or the user asks to discover, compare,
  or install skills, search skills.sh with `npx skills` before GitHub or general
  web search. Inspect candidates and install only the smallest necessary set.
- Route interactive browser automation through the owned `browse` skill. If
  unavailable or broken, use an equivalent tool that preserves authentication,
  privacy, and cleanup constraints. Honor explicitly requested browser surfaces.
- Research, diagnosis, planning, status, review, and unowned repositories remain
  read-only unless a change or contribution is requested.
- Keep each change to one purpose. Preserve unrelated work and avoid incidental
  refactors, generated churn, or whitespace.
- Repository `AGENTS.md` files state only repository-specific differences; never
  copy shared defaults into them.
- Treat repository conventions as revisable defaults. When the user authorizes a
  conflicting change, update the guidance with the implementation; don't ask
  again unless privacy or a high-impact boundary requires it.
- Project guidance specializes these defaults but cannot weaken privacy or the
  high-impact boundary below.

## Contributions

- Make the change easy to accept: one purpose, a clear win, and exact proof.
- Do not open a pull request as a working notebook. Open it when the change is
  coherent and ready to merge.
- Separate a prerequisite refactor only when it is necessary and independently
  useful; keep unrelated cleanup out of the behavior change.
- Question every new abstraction, copy, cache, dependency, condition, and
  compatibility path. If it owns no necessary fact, remove it.
- Add tests only for plausible regressions or meaningful contracts; do not test
  prose, implementation shape, or duplicate existing proof. Correctness and
  performance claims need reproducible evidence.
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
  and async paths into one straight-line flow when it simplifies the internals.
- **Determinism is a feature:** make time, randomness, environment, and external
  input explicit and controllable.
- **Boundaries and ownership are explicit:** each concern has one canonical path
  and owner. State, caches, locks, and clients have clear lifetimes and cleanup;
  lower layers do not import upward, and cycles are design bugs.
- Make state ownership, lifetime, consistency, and recovery explicit where
  relevant.
- Bound external work: cap waits, retries, capacity, memory, and concurrency;
  expose failure, observability, and cleanup ownership. Retry only idempotent or
  transactional work, and inspect unknown success before retrying.
- Batch related reads, request only decision-relevant output, and reuse unchanged
  evidence. Expand context or repeat checks when needed to resolve uncertainty
  or verify changed state. When installed, use `rtk` for supported routine Git,
  GitHub, and test summaries; prefer native field filters for structured data.
  Read full diffs for review;
  use `rtk recall` for omitted diagnostics before rerunning a command.

## Code shape

- Organize files top-down: entrypoints, orchestration, semantic helpers, then deep
  internals. Keep the happy path straight.
- Split functions and files at responsibility boundaries when it improves clarity,
  not to meet a line count.
- Prefer clear domain names for files and directories; avoid unnecessary
  abbreviations.
- Preserve canonical import names; alias only when it improves clarity.
- Name functions by action or transformation, types by domain role, and variables
  by the fact they hold. Short locals require narrow scope; shared names stay
  explicit. Avoid vague `Manager`, `Helper`, or `Util` names.
- Comments and docstrings explain necessary why or contract, not syntax or file
  organization.
- Use composed models or distinct domain types when they prevent a concrete
  invalid state or identifier mix-up. Keep imports and exports explicit.
- Keep passes bounded, conversions centralized, failures explicit, and public
  and dependency surfaces small and visible.

## Delivery

- A request to implement, fix, change, build, update, or rework authorizes full
  delivery unless the user sets a narrower boundary, including local-only work.
  In maintained repositories, isolate, implement, verify, review, commit, push,
  open a ready pull request, satisfy required checks, merge, and verify the exact
  landed revision from fresh trunk. Close a linked tracker only when its
  acceptance criteria are satisfied. Continue while authorized work remains;
  if blocked, report the exact gap and preserved state.
- Keep the primary checkout on trunk and free of task work: never edit files,
  switch branches, reset, clean, generate files, install dependencies, or run
  services there. Use a uniquely named task branch and leased worktree through
  the repository's isolation entrypoint and canonical workspace root when
  available. Each workspace has one writer; treat other workspaces and branches
  as user-owned unless ownership is explicitly transferred.
- A task worktree and branch exist only while its task is active; after landing
  or explicit discard, remove both. Preserve work only by promoting it to the
  repository's canonical branch, an open pull request, or an explicitly named
  archive.
- Use stacked pull requests only for real dependencies; work is landed only
  when the complete chain reaches the repository's default trunk. Absorb
  compatible trunk drift before review and bind reviews to exact revisions.
- After landing, fast-forward clean primary trunk to the verified revision using
  the repository updater when available, then remove owned task workspaces and
  merged branches when no open work depends on them. If primary is dirty,
  off-trunk, or diverged, preserve it and report the exact state. Never delete
  another owner's active workspace or branch without explicit ownership.
- Keep disposable logs, screenshots, traces, builds, and experiments in
  task-scoped scratch and delete them when the task ends. Do not create generic
  run archives. Retain output only in its canonical product, issue, pull request,
  or artifact owner with an explicit lifetime.
- Never use `git stash`; preserve unmerged work and report its exact workspace,
  branch, revision, status, and blocker. Bind production actions to exact
  revisions.

## Evidence

- Verify locally by default. Hosted CI needs a clear purpose and user-approved
  cumulative budget, including push/PR/merge triggers and retries. Existing
  approval persists within its scope; ask only for new or increased spending.
  Never bypass required checks or raise spending limits to finish delivery.
- Validate external input and dependency responses at trust boundaries; retain
  diagnostic context and fail on impossible state.
- Run the smallest check that addresses the change’s risk. Broaden only for a
  failure or identified coverage gap; stop when the affected contracts have
  sufficient evidence. Characterize unclear behavior before changing semantics.
- For prose-only changes, review meaning and affected links. Do not add tests,
  run application suites, or trigger hosted CI. Executable examples and
  machine-consumed contracts may need focused validation.
- Review the complete candidate diff from first principles before committing.
  Before merging, confirm the candidate matches the reviewed revision; review
  subsequent changes and new feedback. Fix valid findings and resolve threads;
  tool failure or absence does not block merging. Request human review only when
  explicitly required.
- Verify landing by revision identity or content equivalence and checkout
  status; reuse passing evidence unless relevant content or conditions changed.
  Benchmark performance claims and check affected behavior when refactoring.

## High-impact boundary

- Confirm only immediately before money movement, new paid commitments or
  material spend, production mutation, irreversible loss, or exposing
  credentials or private/customer data. Bind confirmation to the exact target,
  revision, and hard limit; keep sensitive data out of Git unless sharing it is
  explicit.
