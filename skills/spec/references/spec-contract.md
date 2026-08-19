# Specification Contract

Start from this shape for durable work. Collapse or omit sections that add no
information; preserve stable IDs once another artifact cites them.

```markdown
# <Observable outcome>

Decision state: Proposed | Decided | Superseded
Repository: <owner/repo>
Inspected revision: <commit>
Landed revision: <commit, only after completion>
Sources: <governing conversations, documents, contracts, or issues>

## Research

### Question

- **Decision informed:** <Contract, design choice, or invalidating assumption.>
- **Stop condition:** <Evidence sufficient to decide or bound uncertainty.>

### Sources

- <Sample module, upstream implementation, paper, specification, or documentation
  at a stable URL or revision>

### Findings

- **Observed:** <Directly supported fact and source.>
- **Inferred:** <Design implication, confidence, and what would disprove it.>
- **Decision:** <What this evidence settles, or the uncertainty that remains.>

## Outcome

### Current behavior

<What happens now, who experiences it, and why it is insufficient.>

### Desired behavior

<What consumers will observe and be able to rely on.>

### Scope

- <Included outcome>

### Non-goals

- <Nearby behavior deliberately unchanged>

## Behavioral contract

- **INV-1:** <Rule that must always hold.>
- **AC-1:** <Observable condition that proves the outcome.>

Cover relevant state transitions, boundaries, failures, cancellation,
concurrency, compatibility, recovery, and edge cases. Omit categories that do
not affect the change. Use measurable bounds instead of “robust,” “fast,” or
“seamless.”

## Technical design

### Current system and owners

<How the affected path works today and which source owns each responsibility.>

### Proposed flow

<The straight-line path through changed responsibilities, interfaces, data, and
state.>

### Architecture map

    <source> -> <boundary> -> <core owner> -> <effect>
                      |             |
                      +-> <proof> <-+

Include a compact ASCII map for complex ownership, data flow, state transitions,
or lifecycle. Keep it consistent with the written contract; the prose remains
canonical.

### Decisions

- **D-1:** <Choice, rationale, meaningful alternative, and accepted cost.>

### Failure and operational behavior

<Only material migration, rollback, repair, security, privacy, durability,
capacity, rollout, or operational semantics.>

## Delivery graph

    Epic: <observable outcome>
      |
      +-- Stage 1: <coherent landed state>
      |     +-- Issue 1.1
      |     `-- Issue 1.2 -> Issue 1.3
      |
      `-- Stage 2: <next landed state; depends on Stage 1 evidence>

Use an ASCII delivery map for multi-stage work. Show real hierarchy and
dependencies, not decorative parallelism.

### Stage 1: <Coherent landed outcome>

- **Outcome:** <Working behavior after this stage lands.>
- **Depends on:** <Earlier stages or external prerequisites.>
- **Invalidating assumption:** <What should be tested earliest.>
- **Proof:** <Decisive automated or manual evidence.>

#### Issue: <Plain action and result>

**What and why:** <Short problem, outcome, and practical value.>

**Done when:**

- <Observable result, with INV-n or AC-n when useful.>

**How to verify:**

- `<Exact command when known>`
- <Required manual evidence when automation cannot prove it.>

**Agent notes:**

- Parent: <spec or stage>
- Depends on: <issues or none>
- Fixed decisions: <only task-local constraints>

**Out of scope:**

- <Nearby work this issue must not absorb.>

### Stage 2: <Later coherent landed outcome>

- **Outcome:** <Behavior this stage adds.>
- **Depends on:** <Earlier stages and evidence.>
- **Invariants:** <Contracts already fixed by the epic.>
- **Invalidating assumption:** <What earlier work must teach us.>
- **Refine after:** <Stage or evidence boundary before detailed issues are
  finalized.>

## Coverage

| Contract | Delivered by        | Proven by           |
| -------- | ------------------- | ------------------- |
| INV-1    | Stage 1 / issue 1.1 | <decisive evidence> |
| AC-1     | Stage 1 / issue 1.2 | <decisive evidence> |

## Open decisions

- **O-1:** <Consequential unresolved choice, recommendation, and what it blocks.>
```

Keep one coherent behavior change together. Separate refactoring when combining
it would obscure semantic change. Do not create scaffolding, cleanup,
documentation, or testing issues without an independently valuable checked
outcome.

An implementation-ready issue should fit one focused agent run, one coherent
review, and one landable change. This is a boundary test, not a size quota. Split
only when behavior, dependency, risk, or evidence can stand independently.

Specify the epic and every stage contract deeply enough to establish safe order.
Specify only the next stage's issues to implementation depth. Later stages should
not pretend to know file-level mechanics that earlier implementation may change.

After publication, the specification owns agreed intent and durable decisions;
source and tests own implemented behavior; native tracker relationships own
execution order and status; Git and merged pull requests own completed history;
retained evidence owns proof. Update the owning fact rather than synchronizing
copies.

Before publishing, confirm that evidence supports current behavior; every
invariant and acceptance criterion maps to a stage and proof; every detailed
criterion maps to an issue; every issue advances its stage; dependencies are
complete and acyclic; a fresh implementer can execute each issue without a
hidden product or architecture choice; execution status is represented once;
and every artifact or subdivision earns its maintenance cost.
