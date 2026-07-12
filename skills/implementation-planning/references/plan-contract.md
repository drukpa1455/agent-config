# Plan Contract

Scale the plan to the work. Omit empty sections and routine implementation
detail.

```markdown
# <Observable outcome> Implementation Plan

Repository: <owner/repo>
Source inputs: <paths or URLs with revisions>

## Destination

- Current behavior and evidence
- Observable outcome and success evidence

## Invariants and exclusions

- Preserved behavior and ownership
- Explicitly out of scope
- Controlled resources and hard limits

## Decision

- Chosen approach and why
- Material alternatives rejected and why

## Architecture

- Owning components and dependency direction
- Dataflow, state transitions, and interfaces
- Failure, consistency, idempotency, concurrency, and repair where relevant

## Delivery

### Unit or stage: <landed outcome>

- Entry evidence:
- Plan-invalidating assumption:
- Owns:
- Files and symbols:
- Consumes and produces:
- Acceptance evidence:
- Verification commands and expected results:
- Rollback and repair:
- Out of scope:

## Migration and operations

- Safe transition and rollback point
- Partial-failure recovery
- Observability, capacity, cost, and production bounds

## References

- Repository and external contract revisions

## Open decisions

- Include only unresolved consequential choices; omit this section when none.
```

## Quality check

Before implementation, verify that:

- the outcome is observable rather than a task list;
- scope is the smallest complete change;
- each fact, effect, and repair path has one owner;
- interfaces and dependency direction are explicit;
- invalid states and failures are handled;
- each PR and stage earns its boundary;
- behavior changes have executable evidence;
- waits, retries, memory, concurrency, spend, and production are bounded;
- external contracts are pinned where load-bearing;
- no unresolved consequential decision is hidden as an implementation detail.

If a check fails, revise the plan or return `BLOCKED`. Otherwise proceed without
an approval ceremony when implementation is already in scope.
