---
name: implementation
description: Ground, plan, and deliver consequential repository work from current truth through coherent changes or stages, verification, merge, and cleanup.
disable-model-invocation: true
license: MIT
compatibility: Requires filesystem access and the target repository's normal source, test, and Git tools. GitHub delivery requires an authenticated GitHub CLI.
---

# Implementation

Carry consequential repository work through one flow:

```text
truth -> architecture -> landed outcomes -> plan when useful -> delivery -> evidence
```

The plan and resulting code are two resolutions of one design: few concepts,
straight-line flow, explicit boundaries, and obvious ownership. Apply the active
`AGENTS.md` chain throughout; plans and issues record only change-specific
consequences, not copies of general policy.

Enter from an intent, specification, plan, issue, findings block, epic, or stage.
Stop where the user's intent ends. A coherent change stays one change; real
dependencies or evidence boundaries become stages.

## Establish live truth

1. Read repository instructions and the complete source material.
2. Trace current behavior through owning code, tests, contracts, history, and
   dependencies. For active delivery, also inspect trunk, worktrees, issues, PRs,
   and concurrent work.
3. Reconcile plans and findings with current behavior by semantics, not path
   overlap. Separate observed facts from assumptions.
4. Identify the destination, invariants, exclusions, owners, dependencies,
   failure and repair behavior, resource bounds, and decisive evidence.

If load-bearing evidence is unavailable, return `BLOCKED` with the exact gap and
how to close it. Never invent files, symbols, commands, SDK behavior, or delivery
guarantees. Ask only when evidence cannot resolve a consequential tradeoff.

## Choose the architecture

Start from the observable outcome, then identify the few primitives and ownership
boundaries that make it natural:

- one source of truth and one canonical path per concern; change owning sources,
  not generated outputs;
- explicit dataflow, interfaces, dependency direction, and state transitions;
- pure semantic logic with I/O, workflow translation, and normalized variability
  at the edges;
- explicit owners and lifetimes for state, plus source, staleness, rebuild, and
  repair semantics for derived data;
- visible write, failure, replay, migration, rollback, and repair behavior;
- explicit time, randomness, environment, and external input; bounded external
  work and deterministic verification.

Extend an existing owner before introducing a parallel representation. A wrapper,
abstraction, stage, or compatibility path must own a real seam. Start simple and
upgrade only where current evidence requires it. Record the chosen design and
only the rejected alternatives whose tradeoffs matter.

Treat an existing plan as evidence, not timeless authority: preserve sound
decisions, revise contradicted assumptions, and avoid replanning what remains
valid.

## Shape landed outcomes

Order work by coherent trunk states, dependencies, and evidence:

- one outcome that can land and verify together: one change;
- independently useful outcomes with real dependencies: an ordered PR set;
- sequential outcomes that retire distinct risks or need separate trunk
  evidence: stages;
- unresolved load-bearing uncertainty: a bounded investigation first.

Each unit owns the behavior, tests, documentation, migration, and cleanup needed
for its outcome. Every abstraction, PR, and stage boundary must pay for itself
with clearer ownership, safer ordering, or evidence unavailable earlier. Never
split work merely by architecture layer, file list, or template shape.

Use epics, stage issues, sub-issues, parent links, dependencies, and comments only
when they clarify ownership or order. Publish useful structure directly and
reuse live issues. GitHub owns tracker state, Git owns revisions, and repository
evidence owns acceptance; do not create a parallel delivery state.

A stage contract names its landed outcome, entry evidence, invalidating
assumption, owned changes, dependencies, acceptance evidence, rollback, and
repair.

When structure is easier to see than read, include a compact ASCII diagram in
the plan, relevant epic, stage, or sub-issue, and final response. Show one thing
clearly—architecture, hierarchy, or order—rather than mixing them. Diagrams
project the same verified facts; native GitHub links, Git revisions, and
repository evidence remain authoritative.

## Write the plan when it carries meaning

Use [the plan contract](references/plan-contract.md), scaled to the work, when the
user asks for a plan or when durable reasoning will guide multiple changes. Name
exact paths and symbols only when verified. Make revisions, interfaces, state
transitions, evidence, rollback, repair, and limits explicit. Omit placeholders,
boilerplate, routine implementation detail, and facts readable directly from the
repository.

List unresolved decisions plainly. If one prevents a coherent architecture or
safe delivery path, return `BLOCKED` rather than hiding it as an implementation
task.

If the user asked only for a plan, return it and stop. Otherwise continue
directly; the plan is part of the flow, not a second workflow.

## Deliver in order

For each change or stage:

1. Test the assumption most likely to invalidate it.
2. Refine only the work current evidence supports and isolate it according to
   project workflow.
3. Implement in dependency order. Organize code top-down around a straight-line
   happy path, with purpose-first names, visible dependencies, and comments only
   for necessary why or contract value. Keep behavior, tests, migration,
   documentation, and cleanup together in each coherent PR.
4. Run focused checks, then the broader checks justified by affected contracts.
5. Review against the active `AGENTS.md` chain, especially ownership, interfaces,
   invalid states, dependency direction, generated and derived sources, failure
   and replay, operations, rollback, repair, and unintended scope.
6. Fix valid findings, absorb compatible drift, merge in safe order, and verify
   fresh trunk.
7. Record decisive evidence, clean task state, and continue to the next unblocked
   outcome.

Use stacked PRs only for real dependencies. Never merge a broken intermediate
state or rediscover order during execution; the delivery graph owns order.

## Adapt at the owning boundary

Fresh evidence may reshape current or landed work:

- inside the destination: fix, split, combine, or add only the unit needed, then
  rerun affected evidence;
- contradictory evidence: identify the invalidated assumption, reopen or create
  corrective work, and verify the whole affected path—even when the producer was
  unchanged;
- unrelated work: keep it out unless it blocks correctness;
- unresolved consequential tradeoff, unverifiable correctness, or the global
  high-impact boundary: stop at that boundary.

A landed revision remains historical fact; it does not make a contradicted
assumption true. Correct the owning source plainly and continue from canonical
Git, GitHub, and repository evidence.

## Finish

Verify the complete outcome from fresh trunk, update or close owning issues,
remove task branches and worktrees, and report only:

- landed revisions and observable outcome;
- decisive verification and any environment limitation;
- residual risk or deliberately deferred work.

Do not narrate routine tracker transitions or successful intermediate steps.
