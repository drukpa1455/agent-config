# Plan Contract

Scale sections to the work. Omit empty optional sections; never fill them with placeholders.

```markdown
# <Observable outcome> Implementation Plan

Status: Draft
Repository: <owner/repo>
Source inputs: <paths or URLs with revisions>

## Destination

- Current behavior and evidence
- Affected user or system
- Observable outcome
- Success evidence

## Invariants and exclusions

- Preserved behavior and ownership
- Explicitly out of scope
- Controlled resources and hard limits

## Decision

- Chosen approach and why
- Material alternatives rejected and why
- Existing code or infrastructure reused

## Architecture

- Owning components and dependency direction
- Dataflow and state transitions
- Public interfaces and compatibility
- Consistency, idempotency, concurrency, and failure behavior where relevant

## Delivery

For one coherent change, use only:

### Implementation unit: <one PR purpose>

- Entry evidence:
- Plan-invalidating assumption:
- Owns:
- Files and symbols:
- Consumes:
- Produces:
- Acceptance evidence:
- Verification commands and expected results:
- Rollback and repair:
- Out of scope:

For genuinely staged work, repeat:

### Stage N: <coherent landed outcome>

- Entry evidence:
- Plan-invalidating assumption:
- Ordered implementation units: <one PR purpose each>
- Stage-wide acceptance and verification:
- Stage exit evidence:
- Rollback and repair:

## Migration and operations

- Expand, migrate, verify, and contract sequence
- Rollback point and partial-failure recovery
- Observability and operator evidence
- Performance, security, capacity, cost, and production bounds

## References

- Repository revision
- Dependency, SDK, submodule, protocol, and external specification revisions

## Open decisions

None.
```

## Review gate

The plan is approvable only when all answers are yes:

- **Destination:** Can fresh evidence prove the outcome rather than only task completion?
- **Scope:** Is this the smallest complete change, with exclusions explicit?
- **Ownership:** Does every fact, state transition, write path, and repair path have one owner?
- **Architecture:** Are dependency direction and interfaces explicit without speculative machinery?
- **State:** Are source, durability, visibility, consistency, staleness, rebuild, and repair named where relevant?
- **Failure:** Are retries bounded and limited to idempotent or transactional work? Is unknown success handled?
- **Decomposition:** Does each unit earn one PR, and each stage earn a human gate and coherent landed state? Is a single change free of ceremonial stages? Does compatibility removal wait for landed migration evidence?
- **Verification:** Does every behavior change have fresh, executable acceptance evidence?
- **Operations:** Are migration, rollback, observability, cleanup, resources, and production actions bounded?
- **References:** Are load-bearing external contracts pinned and verified?
- **Decisions:** Are all remaining choices reversible implementation details?

If any answer is no, revise or return `BLOCKED` with the exact missing evidence. Never convert the gap into a placeholder implementation task.
