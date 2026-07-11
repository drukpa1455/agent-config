# AGENTS

Optimize for radical simplicity: few concepts, crisp boundaries, deterministic flows, obvious ownership. These are global defaults; keep project-specific policy in the project.

## Scope

- More-specific repository and directory instructions add to or override this file; the closest applicable rule wins.
- The user sets the goal. Preserve project invariants and downstream users; surface conflicts and ask before choosing a tradeoff.
- Research and review are read-only unless editing is requested. Do not create implementation ceremony for read-only work.
- Treat unowned repositories as read-only until a contribution is explicitly requested; then follow upstream policy and keep the diff minimal.

## Core invariants

- Read before editing or claiming. Inspect first; ask only when a consequential decision cannot be derived.
- Build the complete smallest coherent solution. Every line and concept must earn its keep; readability beats cleverness.
- Fix root causes and enforce invariants rather than patching symptoms or call sites.
- One change, one purpose. Do not mix behavior, refactors, cleanup, generated churn, or whitespace unless inseparable.
- Answer first. Include only decision-relevant conclusions, evidence, risks, errors, and next steps; expand when the user asks or added context changes a decision.
- Do not narrate routine planning, tool choice, internal deliberation, or successful intermediate actions. Report progress only at material phase changes, blockers, or when the user must act.
- Use complete, unambiguous prose for approvals, safety, irreversible actions, ambiguity, errors, and verification. Preserve exact code, commands, paths, identifiers, technical terms, error text, and material risk statements.

## Repository changes

- Apply this workflow to changes intended to land. Read-only work, disposable experiments, and explicitly local trivial edits do not require issues or PRs.
- Work in a git worktree under `.worktrees/`; use the repository root only for status, fetch, and worktree operations. Inspect existing diffs and preserve changes you did not make.
- Canonical trunk is `origin/HEAD`. Keep the root clean and synced; never commit from its checked-out branch.
- One landing change gets one branch, worktree, and PR. Use a scoped issue when work is nontrivial, already tracked, or part of a larger plan; the PR closes it.
- For issue-backed work, use `agent/aNN/issue-<id>-<slug>` and `.worktrees/aNN-issue-<id>-<slug>`.
- Use epics and ordered stages only for genuinely multi-stage work; implementation stays in scoped issues.
- Use lowercase conventional commits. Never use `git stash` as storage; preserve work in a branch, patch, archive, or canonical tracked path.
- Keep temporary artifacts under `tmp/<scope>/`. Move durable outputs to canonical paths, delete disposable outputs, and clean branches and worktrees after merge.

## Controlled actions

- Treat destructive local actions, external writes, money, subscriptions, credits, tokens, cloud jobs, paid APIs, broker/data feeds, and production as controlled resources.
- Default to plan-only: state scope, risk, hard cap, output, and stop condition. Act only after explicit approval of the exact targets or revision.
- Keep credentials, profiles, cookies, tokens, private data, and paid payloads out of git unless sharing is explicit.
- Production approval is revision-bounded: build, promote, verify, or cancel only the approved revision; report drift instead of chasing trunk.

## Design

- Tiny core, wide reach: prefer a few canonical primitives and explicit phases over parallel special cases; everything else is composition.
- Keep one source of truth. Change owning sources and rebuild generated outputs; never hand-edit derivations.
- Keep truth visible. Wrappers must add a real seam such as invariants, caching, retries, or instrumentation.
- Keep stable domain logic pure; contain I/O and workflow translation at explicit edges.
- Normalize variability at boundaries into one straight-line internal flow.
- Make outputs deterministic. Pass time, randomness, environment, and external input explicitly.
- Give each concern one canonical path and explicit owner; lower layers do not import upward, and cycles are design bugs.
- Write and derived-data paths must name source, durability, visibility, consistency, staleness, rebuild, and repair behavior.
- Bound waits, retries, capacity, memory, and concurrency. Retry only idempotent or transactional work; stop on unknown success.

## Code and evidence

- Organize files top-down: entrypoints, orchestration, semantic helpers, deep internals. Keep the happy path straight.
- Treat function and file size as design signals, not quotas; split only at real responsibility boundaries.
- Names carry intent. Comments explain non-obvious reasons or contracts, not code organization.
- Model invalid states out where practical; optional fields and same-shaped identifiers deserve scrutiny.
- Validate external input and dependency responses at trust boundaries; retain diagnostic context and fail on impossible state.
- Test behavior changes. In unclear or weakly tested code, characterize current behavior before changing semantics.
- Verify with fresh evidence before claiming success. Benchmark performance claims and prove refactor equivalence with focused tests or replay.

## Rule hygiene

- Add global rules only for non-obvious, repeated, actionable failures. Project maps, architecture, commands, and local conventions belong in project guidance.
- Change behavioral policy deliberately, not as drive-by cleanup; prefer the smallest rule that prevents the observed failure.
