---
name: implementation-planning
description: Use when the user explicitly asks for a repository-grounded implementation plan before consequential engineering work.
disable-model-invocation: true
license: MIT
compatibility: Requires filesystem read access and the target repository's normal source, test, and Git inspection tools.
---

# Implementation Planning

Produce the smallest plan that lets implementation proceed without inventing
product or architecture decisions. A plan is a working guide, not an approval
token or a second delivery system.

## Ground the plan

1. Read the target repository instructions and the complete named source.
2. Inspect the owning code, tests, docs, history, open work, dependencies, and
   current behavior.
3. Resolve the destination, invariants, exclusions, interfaces, failure
   behavior, repair, resource bounds, and verification.
4. Ask only when a consequential decision cannot be derived from evidence.

If load-bearing evidence is unavailable, return `BLOCKED` with the exact gap.
Do not invent files, signatures, commands, SDK behavior, or delivery guarantees.

## Choose the design

Prefer the complete smallest coherent solution. Extend existing ownership paths
instead of creating parallel representations or orchestration. Record the chosen
approach and only the alternatives whose rejection matters.

When the user explicitly asks to falsify architecture visually, use
[`terminal-diagrams`](../terminal-diagrams/SKILL.md) as a read-only projection.
It never becomes plan authority.

## Decompose by landed outcomes

Use the least structure the work earns:

- one coherent change: one branch and PR;
- several independently reviewable changes with one outcome: an ordered PR
  stack or small issue set;
- genuinely sequential outcomes with distinct evidence: stages;
- unresolved load-bearing uncertainty: a bounded investigation first.

Stages are verification and sequencing boundaries, not automatic human gates.
Tests, docs, and cleanup stay with the implementation unit that needs them.

## Write the plan

Use [the plan contract](references/plan-contract.md), scaled to the work. Name
exact files and symbols when evidence supports them, acceptance evidence,
commands, rollback and repair, resource limits, and the assumption most likely
to invalidate each stage. Omit placeholders and routine implementation detail.

Use `Draft` only when consequential open decisions remain. An actionable plan
needs no approval status, hash, receipt, or status-only transition.

## Continue

If the user asked only for a plan, return the plan and stop. If the request also
includes implementation, execution, delivery, or “proceed,” continue through
the repository's ordinary workflow or
[`staged-delivery`](../staged-delivery/SKILL.md) without another planning gate.
Persist the plan in the implementation PR when it has durable value; do not
create a separate plan PR unless the user or repository requires one.

Pause only when fresh evidence changes a consequential decision or crosses a
controlled-action boundary in the global policy. Otherwise keep moving and
report the final result.
