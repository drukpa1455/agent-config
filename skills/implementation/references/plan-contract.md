# Plan Contract

Scale this shape to the work. Omit empty sections and facts readable directly
from the repository.

```markdown
# <Observable outcome> Implementation Plan

Repository: <owner/repo at revision>
Sources: <paths or external contracts at revisions>

## Destination

- Current behavior and evidence
- Observable outcome and proof
- Invariants and exclusions

## Decisions

- Chosen primitives, owners, and source of truth
- Interfaces, dataflow, state transitions, and dependency direction
- Straight-line implementation shape, visible dependencies, and invalid-state model
- State, write, and derived-data lifetimes and repair where material
- Failure, migration, rollback, and resource bounds where material
- Material alternative rejected and why

## Map

    <one compact ASCII architecture, hierarchy, or delivery view when useful>

## Order

### <Coherent landed outcome>

- Owned behavior and paths
- Invalidating assumption
- Decisive evidence and verification commands
- Dependencies, rollback, or repair when material

## Open decisions

- Only unresolved consequential choices; omit when none
```

## Falsify the plan

- Does current evidence support the destination and decisions?
- Is this the fewest-concept design that fully solves the outcome?
- Does each fact and effect have one visible owner and canonical path?
- Does every retained representation introduce target, authority, durability,
  effect, or consumer semantics of its own?
- Are dependencies explicit, the happy path straight, and invalid states difficult?
- Does every wrapper, abstraction, PR, and stage own a real boundary?
- Can each intermediate trunk state operate coherently and be repaired?
- Do checks prove behavior rather than task completion?
- Are nondeterminism, external contracts, and resource bounds explicit where
  load-bearing?
- Is any unresolved product or architecture decision disguised as a task?

Revise any weak point. If evidence cannot resolve a load-bearing decision, return
`BLOCKED`; otherwise proceed directly.
