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
intent + live truth -> decisions -> order -> work -> proof
                           ^                           |
                           +---------------------------+
```

Build with radical simplicity and maximum elegance. Plan and code should read
like the same system at different resolutions: few concepts, straight-line flow,
explicit boundaries, and obvious ownership. Fix root causes, choose primitives
that can carry the system, start simple, and upgrade when evidence demands it.
Avoid band-aids, clever golf, and speculative architecture.

Repository sources own current behavior. Persisted plans own intended decisions.
Git owns revisions. GitHub owns delivery state. Retained evidence owns proof.
Diagrams own nothing; they are projections.

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
boundaries needed to make it natural:

- **Tiny core, wide reach:** make everything else composition.
- **One source of truth:** change owning sources, not generated outputs.
- **Truth is visible:** call or import the real owner; avoid magic surfaces.
- **Wrappers pay rent:** add an invariant, cache, retry, instrumentation, or
  another real seam—or call directly.
- **Core is pure:** keep semantic logic explicit and orchestration pragmatic;
  contain I/O and workflow translation at the edges.
- **Variability ends at boundaries:** normalize optional, environment-dependent,
  sync, and async paths; make nondeterminism explicit and controllable.
- **Paths and ownership are canonical:** keep dependency direction acyclic and
  give state, caches, locks, and clients clear owners and lifetimes.
- **Writes are explicit:** name source of truth, durability, visibility,
  consistency, replay, and repair behavior.
- **Derived data is replaceable:** name its source, staleness, rebuild, and repair
  behavior.
- **External work is bounded:** cap waits, retries, capacity, memory, and
  concurrency; expose failure, observability, and cleanup ownership.

Extend an existing owner before introducing a parallel representation. Record
the chosen design and only alternatives whose tradeoffs matter.

Treat an existing plan as evidence, not timeless authority: preserve sound
decisions, revise contradicted assumptions, and avoid replanning what remains
valid.

## Polish the touched surface

Use the requested change to reduce semantic and cognitive weight in its owning
surface, not to launch unrelated cleanup.

Trace affected facts through producers, validators, identity, serialization,
consumers, and mutations. Classify each representation:

- same facts, mirror validation, independent mutation, or lossless rebuild:
  duplicate carrier;
- new target, authority, durability, effect, or consumer semantics: legitimate
  boundary.

When convergence supports the outcome:

1. Characterize existing behavior and external contracts.
2. Choose one canonical owner and deterministic identity where identity matters.
3. Move consumers toward it.
4. Keep temporary compatibility only at the edge, with an invariant and deletion
   condition.
5. Delete duplicate producers, validators, adapters, hashes, fallbacks, and
   carrier-specific tests.
6. Prove no hidden path reconstructs semantics or order.

If the opportunity changes unrelated behavior or needs an independent migration,
make it another ordered outcome rather than smuggling it into the current change.

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
3. Implement in dependency order. Organize files top-down around a straight-line
   happy path. Use purpose-first names and visible dependencies; reserve comments
   for necessary why or contract value. Prefer models that make invalid states
   difficult. Keep behavior, tests, migration, documentation, and cleanup
   together in each coherent PR.
4. Run focused checks, then broader checks justified by affected contracts.
5. Review the effective diff for conceptual weight, ownership, interfaces,
   dependency direction, invalid states, failure and repair, migration,
   operations, and unintended scope.
6. Fix valid findings, absorb compatible drift, and rerun affected checks.
7. Merge in safe order, verify fresh trunk, record decisive evidence, clean task
   state, and continue.

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
