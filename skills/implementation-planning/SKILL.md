---
name: implementation-planning
description: Use when the user explicitly asks for a repository-grounded implementation plan before consequential engineering work.
disable-model-invocation: true
license: MIT
compatibility: Requires filesystem read access and the target repository's normal source, test, and Git inspection tools.
---

# Implementation Planning

Write a plan that reads like clear code: current truth flows into one design,
ordered landed outcomes, and decisive evidence. The plan should reduce cognitive
load and preserve reasoning an implementer would otherwise have to rediscover.
It carries decisions and evidence; ordinary repository workflow still owns
delivery.

## Establish truth

1. Read the target repository instructions and the complete named source.
2. Trace current behavior through its owning code, tests, contracts, history,
   dependencies, and open work.
3. Separate observed facts from assumptions. Resolve the destination,
   invariants, exclusions, failure behavior, repair, resource bounds, and
   verification.
4. Ask only when evidence cannot resolve a consequential tradeoff.

If load-bearing evidence is unavailable, return `BLOCKED` with the exact gap and
how to close it. Never invent files, symbols, commands, SDK behavior, or delivery
guarantees.

## Choose the architecture

Start from the observable outcome, then identify the few primitives and ownership
boundaries that make it natural:

- one source of truth and one canonical path per concern;
- explicit dataflow, interfaces, dependency direction, and state transitions;
- pure semantic logic with I/O and workflow translation at the edges;
- visible write, failure, replay, migration, rollback, and repair behavior;
- bounded external work and deterministic verification.

Extend an existing owner before introducing a parallel representation. A wrapper,
abstraction, stage, or compatibility path must own a real seam. Start simple and
upgrade only where current evidence requires it. Record the chosen design and
only the rejected alternatives whose tradeoffs matter.

When the user explicitly asks to falsify the architecture visually, use
[`terminal-diagrams`](../terminal-diagrams/SKILL.md) as a read-only projection.
It supports reasoning but never becomes plan authority.

## Shape landed outcomes

Decompose by coherent trunk states, not architecture layers or file lists:

- one outcome that can land and verify together: one change;
- independently useful outcomes with a real dependency: a small ordered PR set;
- sequential outcomes that retire distinct risks or require separate evidence:
  stages;
- unresolved load-bearing uncertainty: a bounded investigation first.

Each unit owns the behavior, tests, documentation, migration, and cleanup needed
for its outcome. Stages sequence coherent states and verification. Every boundary
must pay for itself with safer ordering, clearer ownership, or evidence
unavailable earlier.

## Write only what carries meaning

Use [the plan contract](references/plan-contract.md), scaled to the work. Name
exact paths and symbols only when verified. Make source revisions, interfaces,
state transitions, acceptance evidence, rollback, repair, and limits explicit.
Omit placeholders, boilerplate, routine implementation detail, and duplicated
delivery state.

List unresolved decisions plainly. If one prevents a coherent architecture or
safe delivery path, return `BLOCKED` rather than hiding it as an implementation
task.

## Continue

If the user asked only for a plan, return it and stop. If implementation or
delivery is already requested, continue directly through the repository's
ordinary flow or [`staged-delivery`](../staged-delivery/SKILL.md). Persist the
plan with the implementation when it has durable value; do not create
a separate plan PR unless the repository requires one.

Revise from fresh evidence when needed. Otherwise execute and report the landed
result.
