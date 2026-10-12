---
name: spec
description: Formalize a developed discussion into a durable specification or staged epic when explicitly requested.
disable-model-invocation: true
---

# Spec

Capture an agreement that someone can implement without inventing consequential
product or architecture decisions. Choose a conversation draft, document, or
tracker item from the request and project workflow; update an existing owner
when one already holds the decision.

Ground current behavior and proposed changes in the relevant code and evidence.
Preserve settled decisions unless new evidence challenges them. Separate
assumptions and open questions from what has been decided; recommend a path for
consequential choices instead of silently burying them in tasks.

Use the project's format. Capture the intended outcome, scope, design decisions
and tradeoffs, and observable acceptance criteria. Include migration, failure,
and compatibility behavior when material. The [optional outline](references/spec-contract.md)
helps when a larger change has no established format.

Split delivery only at meaningful dependencies, risk boundaries, or useful
intermediate outcomes. Detail the next stage and refine later mechanics as
implementation teaches us. Keep shared decisions in the spec and live status in
the existing tracker.

Check that the proposed work covers the outcome and has verifiable acceptance
criteria. A planning-only request ends with the agreement; an established request
to implement continues without another approval gate.
