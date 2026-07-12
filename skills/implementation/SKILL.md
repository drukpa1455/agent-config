---
name: implementation
description: Ground, plan, and deliver consequential repository work from current truth through coherent changes or stages, verification, merge, and cleanup.
disable-model-invocation: true
license: MIT
compatibility: Requires filesystem access and the target repository's normal source, test, and Git tools. GitHub delivery requires an authenticated GitHub CLI.
---

# Implementation

Carry repository work through one flow:

```text
facts -> decisions -> order -> work -> proof
```

Plans retain design decisions; diagrams project them. GitHub records delivery
order. Code, plans, Git, GitHub, and retained evidence remain authoritative for
the facts they own.

Enter from an intent, specification, plan, issue, findings block, epic, or stage.
Stop where the user's intent ends. One coherent outcome stays one change; real
dependency or evidence boundaries become stages.

## Orient from live truth

Read applicable repository instructions and the complete source material. Trace
current behavior through owning code, tests, contracts, history, and
dependencies. For delivery, also inspect trunk, worktrees, issues, PRs, and
concurrent work.

Reconcile plans and findings with current behavior by semantics, not path
overlap. Separate facts from assumptions, then identify the destination,
invariants, exclusions, owners, dependencies, and decisive evidence.

If load-bearing evidence is unavailable, return `BLOCKED` with the exact gap and
how to close it. Never invent files, symbols, commands, SDK behavior, or delivery
guarantees. Ask only when evidence cannot resolve a consequential tradeoff.

## Decide the design

Start from the observable outcome and choose the few primitives and ownership
boundaries needed to make it natural. Resolve only change-specific decisions:

- source of truth, owners, interfaces, dataflow, and state transitions;
- dependency direction and the boundary between semantic logic and I/O;
- writes, failures, consistency, replay, migration, rollback, repair, external
  limits, and proof.

Extend an existing owner before introducing a parallel representation. Every
wrapper, abstraction, and compatibility path must own a real boundary. Start
simple and upgrade only where current evidence requires it. Record the chosen
design and only alternatives whose tradeoffs matter.

Treat an existing plan as evidence, not timeless authority: preserve sound
decisions, revise contradicted assumptions, and avoid replanning what remains
valid.

## Order landed outcomes

Order work by coherent trunk states, dependencies, and evidence:

- one outcome that can land and verify together: one change;
- independently useful outcomes with real dependencies: an ordered PR set;
- sequential outcomes that retire distinct risks or need separate trunk
  evidence: stages;
- unresolved load-bearing uncertainty: a bounded investigation first.

Each unit owns the behavior, tests, documentation, migration, and cleanup needed
for its outcome. Every PR and stage boundary must pay for itself with independent
value, safer ordering, or evidence unavailable earlier. Never split work merely
by architecture layer, file list, or template shape.

A stage's irreducible contract is its landed outcome, most likely invalidating
assumption, and decisive evidence. Add owners, dependencies, rollback, or repair
only when they materially shape delivery.

## Publish what others need

Create only artifacts that improve reasoning or coordination:

- a plan when requested or durable decisions span multiple changes;
- a compact ASCII map when architecture, hierarchy, or order is easier to see
  than read;
- epics, stages, sub-issues, dependencies, and comments when they clarify
  ownership or order.

Use [the plan contract](references/plan-contract.md), scaled to the work. Name
paths and symbols only when verified. Omit boilerplate, routine implementation
detail, and facts readable directly from the repository. Keep native GitHub
relationships canonical; place a map where it is consumed rather than
maintaining copies.

List unresolved decisions plainly. If one blocks coherent design or safe
delivery, return `BLOCKED`. If the user asked only for a plan or map, return it
and stop; otherwise continue directly.

## Deliver in order

For each change or stage:

1. Test the assumption most likely to invalidate it.
2. Refine only work current evidence supports and isolate it according to
   repository workflow.
3. Implement in dependency order, keeping behavior, tests, migration,
   documentation, and cleanup together in each coherent PR.
4. Run focused checks, then broader checks justified by affected contracts.
5. Review the effective diff against applicable instructions and contracts,
   including ownership, interfaces, failure and repair, migration, operations,
   and unintended scope.
6. Fix valid findings, absorb compatible drift, merge in safe order, verify fresh
   trunk, record decisive evidence, clean task state, and continue.

Use stacked PRs only for real dependencies. Never merge a broken intermediate
state or rediscover order during execution; the delivery graph owns order.

## Adapt and finish

Return fresh evidence to the decision it challenges:

- inside the destination, reshape the needed unit and rerun affected evidence;
- on contradiction, identify the invalidated assumption and verify the whole
  affected path, even when the producer was unchanged;
- keep unrelated work out unless it blocks correctness;
- stop at an unresolved consequential tradeoff, unverifiable correctness, or the
  global high-impact boundary.

A landed revision remains historical fact, not proof of a contradicted
assumption. Correct the owning source and continue from canonical evidence.

Finally, verify the complete outcome from fresh trunk, update or close owning
issues, remove task branches and worktrees, and report the landed outcome,
decisive evidence, environment limitations, and residual risk. Include one
compact map when it makes the result clearer; omit routine tracker narration.
