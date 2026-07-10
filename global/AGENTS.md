# AGENTS

This repo values **radical simplicity** and **maximum elegance**.
Write code that reads like pseudocode: few concepts, crisp boundaries, deterministic flows, obvious ownership.

## Defaults

- Every line must earn its keep. Readability beats cleverness.
- Fix root causes, not symptoms. Prefer enforcing invariants over patching call sites.
- One PR, one purpose. No unrelated changes.
- Don't rewrite large areas without explicit permission.
- Never mix functionality changes with whitespace-only changes.
- If context is missing or you're unsure, stop and ask.
- Communicate with the same discipline as the code: answer first, stay brief, and add detail only when it changes the decision.
- Default to tight paragraph prose. Use lists only when the content is inherently list-shaped.
- Compress phrasing, not meaning: keep technical terms, code, and quoted errors exact; fragments are fine when obvious; prefer shorter exact words; cut filler, pleasantries, hedging, and throat-clearing.
- When useful, structure concise answers as: thing, action, reason, next step. Use abbreviations or symbolic shorthand only when standard and unambiguous.
- Prefer full clarity over terseness for security warnings, irreversible actions, and confusing or multi-step instructions. If writing contracts differ by surface or mode, make the boundaries and enter/exit conditions explicit.
- Read before claiming. If unsure, say so.

## Workflow

- Work in a git worktree under `.worktrees/`; use repo root only for status, fetch, and worktree commands.
- Canonical trunk is `origin/HEAD`.
- Repo root is orchestration-only: never commit from root `master`; keep it clean and synced to `origin/HEAD`.
- Branch/worktree names: `agent/aNN/issue-<id>-<slug>`, `.worktrees/aNN-issue-<id>-<slug>`.
- Commit messages use lowercase conventional format: `fix: align editor popup lifecycle`.
- Do not use `git stash` as storage. Preserve work in a branch/PR, a patch or archive under `tmp/<issue-or-branch>/`, or a canonical tracked path.
- If you inherit a stash, classify it immediately as land, archive, or drop; never leave stash entries as unresolved repo state.
- Treat worktrees as shared: inspect existing diffs before touching dirty files and preserve changes you did not make.
- Plan the work as: epic -> ordered stage issues -> scoped implementation issues.
- Epics and stage issues are planning containers; implementation happens on scoped implementation issues.
- One implementation issue = one purpose, one branch/worktree, one PR, one focused file surface.
- Branch, worktree, and PR must use the same implementation issue `#<id>`; the PR body must explicitly close it.
- Put temporary artifacts under `tmp/<issue-or-branch>/`; never leave screenshots, patches, bundles, logs, or preserves in repo root, Desktop, Downloads, or home tmp.
- Durable artifacts must move into a canonical tracked repo path before merge; disposable artifacts must be deleted before final response.
- If a PR is stacked, merge the base first, then rebase or retarget the next PR onto `origin/HEAD`; do not treat a merge into a non-trunk base branch as landed until its merge commit is an ancestor of `origin/HEAD`.
- After merge, clean up completely: verify `git status`, `git worktree list`, PR/issue state, and local/remote branch cleanup.

## At-Risk Resources

- Treat money, portfolio exposure, subscriptions, credits, tokens, cloud jobs, paid APIs, broker/data feeds, and external writes as controlled resources.
- Default to plan-only: state scope, risk, cap, output, and stop condition; act only after explicit approval and a hard cap.
- Preserve partial progress, keep credentials, private/customer/project data, and paid payloads out of git unless sharing is explicit, and stop/report/tighten guards when risk escapes the plan.
- Production deploy approval is revision-bounded: build, promote, verify, or cancel only the approved commit/release, and report drift instead of chasing moving `master`.

## Design

- Tiny core, wide reach: identify primitives; everything else is composition.
- One source of truth: define once; derive tables/build artifacts from it.
- Generated outputs are not source: change the owning source, rebuild, and avoid hand edits.
- Truth is visible: no magic shims; call/import the real thing.
- Wrappers must pay rent: add a real seam (invariants, caching, retries, instrumentation) or don't wrap.
- Core is pure: domain logic is `args -> return`; edges do I/O and translation.
- Prefer semantic functions for stable domain logic: explicit inputs, explicit outputs, no hidden side effects.
- Keep orchestration in pragmatic functions: compose semantic functions, contain workflow-specific logic, and do not generalize it prematurely.
- Normalize variability early: turn optional/env-dependent paths into one straight-line flow at boundaries.
- Determinism is a feature: stable outputs, reproducible layouts.
- Nondeterminism is explicit and controllable: time, randomness, environment, and external inputs enter through boundaries.
- Resource budgets are explicit: cap time/memory/recursion at boundaries; enforce them.
- Start simple, upgrade late: cheapest representation first; upgrade only when needed.
- One canonical path per concern: one settings mechanism, one client creation path, one storage boundary, one job/runner pattern.
- Abstraction barriers matter: lower layers don't import upward; cycles are design bugs.
- Ownership is explicit: state/caches/locks/clients have obvious owners and lifetimes.
- Write paths must name source of truth, durability, visibility, consistency, retry/replay behavior, and repair path.
- Derived data (caches, indexes, projections, search copies, denormalized fields) must name owner, staleness, rebuild, and repair semantics.
- External work (calls, queues, jobs, pools, caches) must have bounded waits, bounded retries, capacity behavior, observability, and cleanup ownership.
- Retries require idempotency or a transaction boundary; handle duplicate, replayed, reordered, and unknown-success work explicitly.

## Code

- Top-down files: entrypoints first; helpers later; deep internals last.
- Straight-line flow: happy path first; use guard returns only when they simplify.
- Bounded passes: prefer one-pass or bounded algorithms; avoid unbounded recursion.
- Keep functions (~27 lines) and files (~270 lines) small; split by responsibility when they grow.
- Default: no comments/docstrings. Add them only for "why/contract" value (invariants, public APIs, tricky edges).
- Names carry intent: short, purpose-first nouns/verbs; avoid "Manager/Helper/Util" unless truly generic.
- Name shared functions by stable behavior; name orchestration by usage context when the exact steps may change.
- Treat new optional fields as a design warning; prefer splitting models or composing smaller ones so invalid states stay hard to represent.
- Use distinct domain types for same-shaped identifiers when mixups are plausible.
- Imports: make dependencies obvious; avoid implicit re-export chains; group by origin with blank lines.
- Test behavior changes; if hard to test, state why and verify the narrowest observable contract.
- In weakly tested or unclear code, characterize existing behavior before changing semantics.
- Keep behavior changes, refactors, and cleanup separate when that makes review or rollback clearer.
- Validate external input and dependency responses at trust boundaries; keep diagnostic context and fail rather than continuing from corrupted/impossible state.
- Read files before modifying them. Never edit blind.
