# Optional specification outline

Use the parts that clarify the decision. A small change may need one paragraph
and acceptance criteria. Reuse an existing project template when available.

```markdown
# <Observable outcome>

## Outcome

What happens now, who experiences it, and what should change?
What nearby work is outside this request?

## Design

Which existing code owns the behavior? What responsibilities or interfaces change?
Which decisions matter, why were they chosen, and what costs do they accept?
Record sources or inspected revisions when they affect the reasoning.

## Acceptance

- <Observable condition and how to verify it.>
- <Material failure, compatibility, or recovery condition.>

## Delivery

If staging helps, describe each useful intermediate outcome, its dependencies,
and what proves it. Detail only the next stage's implementation work.

## Open questions

- <Consequential uncertainty, recommended default, and what it blocks.>
```

For a migration, the delivery sequence might first establish compatibility,
then move consumers, then remove the old interface. Each stage should leave a
coherent system. A diagram helps when ownership or ordering is hard to explain
in prose; it is optional.

Give a child issue its local outcome, dependencies, decisions, and verification.
Link shared context instead of copying it. Keep stable criterion IDs when other
artifacts need to cite them; a coverage table is useful only when it exposes a
real gap. Revisit later stages when earlier work changes their assumptions.
