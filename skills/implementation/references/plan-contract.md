# Plan Contract

Scale this shape to the work. Omit empty sections and anything an implementer can
read directly from the repository.

```markdown
# <Observable outcome> Implementation Plan

Repository: <owner/repo at revision>
Source inputs: <paths or external contracts at revisions>

## Destination

- Current behavior and evidence
- Observable outcome and proof

## Constraints

- Invariants and preserved behavior
- Explicit exclusions
- High-impact resources and hard limits

## Design

- Chosen primitives, owners, and source of truth
- Dataflow, state transitions, interfaces, and dependency direction
- Failure, consistency, idempotency, replay, and repair where relevant
- Material alternative rejected and why

## Map

    <one compact ASCII architecture, hierarchy, or delivery view when useful>

## Delivery

### <Unit or stage>: <coherent landed outcome>

- Entry evidence or plan-invalidating assumption
- Why this boundary exists
- Owned behavior, paths, and symbols
- Inputs, outputs, and transition
- Acceptance evidence and verification commands
- Rollback, repair, and cleanup

## Migration and operations

- Safe transition and rollback point
- Partial-failure recovery
- Observability, capacity, cost, and production bounds

## Open decisions

- Only unresolved consequential choices; omit when none
```

## Falsify the plan

Before implementation, ask:

- Does the plan lead from current evidence to an observable outcome?
- Is there one owner and canonical path for each fact and effect?
- Do abstractions, wrappers, PRs, and stages each own a real boundary?
- When present, does the map clarify real topology without becoming a second
  source of truth?
- Can every intermediate trunk state operate coherently and be repaired?
- Are failure, replay, migration, rollback, and derived-data semantics explicit
  where they matter?
- Do executable checks prove behavior rather than task completion?
- Are time, retries, memory, concurrency, spend, and production bounded?
- Are load-bearing external contracts pinned?
- Is any unresolved product or architecture decision disguised as a task?

Revise any weak point. If evidence cannot resolve a load-bearing decision, return
`BLOCKED`; otherwise proceed directly.
