---
name: staged-delivery
description: Autonomously organize and deliver genuinely staged repository work through issues, sub-issues, branches, PRs, verification, merge, and cleanup.
disable-model-invocation: true
license: MIT
compatibility: Requires Git, an authenticated GitHub CLI, and a GitHub-hosted target repository.
---

# Staged Delivery

Turn a multi-stage goal into one straight delivery flow. Stages retire risk and
produce coherent trunk states; they are not recurring approval ceremonies.

The target repository's `AGENTS.md` owns project semantics and verification.
Global policy owns the few controlled actions that still require approval.

## Accept the user's intent

Accept a plan, issue, findings block, epic, stage, or implementation goal. Do not
require a mode keyword or approved-plan status. The request to proceed or work
through the goal authorizes routine GitHub coordination and delivery inside its
scope, including:

- issues, stages, sub-issues, parent and dependency links, and comments;
- branches, worktrees, commits, pushes, and PR stacks;
- review fixes, merges, issue closure, branch cleanup, and the next stage.

Do not preview write counts or ask separately for tracker operations.

## Orient once

1. Read repository instructions and the complete source material.
2. Inspect live trunk, existing worktrees, issues, PRs, and concurrent work.
3. Reconcile fresh findings with active work by semantics, not path overlap.
4. Identify the destination, invariants, controlled resources, and evidence that
   can prove completion.

If raw findings require design decisions, make the smallest repository-grounded
plan as part of this flow. Ask only when a consequential choice cannot be
resolved from evidence.

## Shape only useful structure

Use the least hierarchy that improves ownership or sequencing:

- one coherent change: ordinary branch and PR, no staged graph;
- several reviewable changes with one outcome: a small ordered issue/PR set;
- sequential outcomes needing distinct evidence: one epic with stage children;
- implementation sub-issues only when they own distinct PRs.

Publish issues, sub-issues, dependencies, and concise contracts directly. Reuse
existing issues and stages instead of duplicating them. GitHub live state is the
tracker truth; do not maintain hashes, leases, manifests, or a parallel state
database for routine repository delivery.

## Execute stage by stage

For each stage:

1. Verify the assumption most likely to invalidate the stage.
2. Refine its implementation units from current evidence.
3. Create or reuse one branch and worktree per landing change.
4. Implement in dependency order, keeping each PR independently coherent.
5. Run focused checks, then the broader checks justified by the change.
6. Review the integrated stage for contract, standards, integration,
   references, operations, rollback, and cleanup.
7. Fix valid findings inside scope, absorb compatible trunk drift, merge in safe
   order, verify fresh trunk, and clean task state.
8. Record a concise landed result and continue to the next unblocked stage.

Use stacked PRs only when a real dependency requires them. Otherwise prefer
small PRs directly against trunk. Never merge a broken intermediate state.

## Adapt without ceremony

Fresh evidence may change issue shape or invalidate completed assumptions.
Handle it at the owning boundary:

- inside current scope: fix or reshape autonomously and rerun affected checks;
- new but compatible work required for the destination: add the smallest issue
  or stage and continue;
- work that leaves the stated goal, requires an unresolved user product
  tradeoff, or crosses a high-impact boundary below: stop and ask;
- unrelated work: record it only when useful and keep it out of the change.

A landed commit remains historical fact even if later evidence requires a
correction. Reopen or add corrective work plainly; do not build a second
approval protocol around it.

## Stop conditions

Pause only for:

- a consequential decision that evidence cannot resolve;
- credentials or private/customer data disclosure;
- trading, money movement, new subscriptions, material or unbounded paid API or
  cloud spend;
- production changes;
- destructive or irreversible loss;
- unknown external-write success;
- verification that cannot establish correctness.

For a controlled action, state the exact target, risk, hard cap, output, and stop
condition once. Routine local work and GitHub delivery continue without asking.

## Finish

Complete whole-system verification, close or update the owning issues, remove
task worktrees and branches, and report:

- what landed and at which revision;
- decisive verification and any known environment limitation;
- residual risk or deliberately deferred work.

Do not narrate every tracker transition or successful intermediate step.
