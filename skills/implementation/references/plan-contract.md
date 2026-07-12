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
- Failure, migration, rollback, repair, and resource bounds where material
- Material alternative rejected and why

## Map

    <one compact ASCII architecture, hierarchy, or delivery view when useful>

## Order

### <Coherent landed outcome>

- Invalidating assumption
- Decisive evidence and verification commands
- Dependencies, rollback, or repair when material

## Open decisions

- Only unresolved consequential choices; omit when none
```

## Falsify the plan

- Does current evidence support the destination and decisions?
- Does each fact and effect have one owner and canonical path?
- Does every abstraction, PR, and stage own a real boundary?
- Can each intermediate trunk state operate coherently and be repaired?
- Do checks prove behavior rather than task completion?
- Are external contracts and resource bounds explicit where load-bearing?
- Is any unresolved product or architecture decision disguised as a task?

Revise any weak point. If evidence cannot resolve a load-bearing decision, return
`BLOCKED`; otherwise proceed directly.
