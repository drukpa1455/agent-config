---
name: staged-delivery
description: Autonomously organize and deliver genuinely staged repository work through issues, sub-issues, branches, PRs, verification, merge, and cleanup.
disable-model-invocation: true
license: MIT
compatibility: Requires Git, an authenticated GitHub CLI, and a GitHub-hosted target repository.
---

# Staged Delivery

Turn a multi-stage goal into one straight path of coherent trunk states. Each
stage should retire a distinct risk, unlock evidence, or establish a dependency
for what follows. Structure must pay rent: a single coherent change stays a
single change.

The target repository owns project semantics and verification. Live GitHub and
Git state are delivery truth. The global policy owns the high-impact boundary.

## Orient from live truth

Accept a plan, issue, findings block, epic, stage, or implementation goal and
resolve its current state from live evidence.

1. Read repository instructions and the complete source material.
2. Inspect current trunk, worktrees, issues, PRs, dependencies, and concurrent
   work.
3. Reconcile new findings with active work by semantics, not path overlap.
4. Identify the destination, invariants, owners, dependencies, risks, and
   evidence that can prove completion.

If the outcome is one coherent change, use ordinary delivery instead. If a
consequential design choice remains unresolved, ground a direct
repository-backed plan before shaping tracker structure.

## Shape coherent outcomes

Order work by dependency and evidence:

- a reviewable outcome that can land independently: one change;
- several independently useful outcomes with real dependencies: an ordered PR
  set;
- sequential outcomes requiring distinct trunk evidence: stages;
- implementation sub-issues only when they own distinct landing changes.

Use an epic, stage issues, sub-issues, parent links, dependencies, and comments
only when they clarify ownership or order. Publish useful structure directly and
reuse live issues instead of duplicating them. Do not create a parallel delivery
state: GitHub already owns tracker state, Git owns revisions, and repository
evidence owns acceptance.

A stage contract names its landed outcome, entry evidence, invalidating
assumption, owned changes, dependencies, acceptance evidence, rollback, and
repair. Do not split stages by architecture layer or because a template has room.

## Deliver in order

For each stage:

1. Test the assumption most likely to invalidate it.
2. Refine only the landing changes current evidence supports.
3. Isolate each change according to project workflow and implement in dependency
   order.
4. Keep every PR coherent: behavior, tests, migration, documentation, and cleanup
   travel together.
5. Run focused checks, then the broader checks justified by the affected
   contracts.
6. Review the integrated stage for ownership, interfaces, failure and replay,
   operations, rollback, repair, and unintended scope.
7. Fix valid findings, absorb compatible drift, merge in safe order, and verify
   fresh trunk.
8. Record the decisive evidence, clean task state, and continue to the next
   unblocked stage.

Use stacked PRs only for real dependencies. Never merge a broken intermediate
state or rediscover ordering during execution; the delivery graph owns order.

## Adapt at the owning boundary

Fresh evidence can reshape current or completed work:

- inside the destination: fix, split, combine, or add only the unit needed and
  rerun affected evidence;
- contradictory evidence: identify the invalidated assumption, reopen or create
  corrective work, and verify the whole affected path—even when the producer was
  unchanged;
- unrelated work: keep it out unless it blocks correctness;
- unresolved consequential tradeoff, unverifiable correctness, or a global
  high-impact boundary: stop at that boundary.

A landed revision remains historical fact; it does not make a contradicted
assumption true. Correct the owning source plainly; Git, GitHub, and repository
evidence remain the canonical state.

## Finish

Verify the complete outcome from fresh trunk, update or close the owning issues,
remove task branches and worktrees, and report only:

- landed revisions and observable outcome;
- decisive verification and any environment limitation;
- residual risk or deliberately deferred work.

Do not narrate routine tracker transitions or successful intermediate steps.
