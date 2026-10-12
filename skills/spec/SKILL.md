---
name: spec
description: Turn a developed discussion into a codebase-grounded specification. Use explicitly when asked to formalize outcomes, design decisions, acceptance criteria, or staged delivery.
disable-model-invocation: true
---

# Spec

Produce the smallest agreement that lets someone implement the intended outcome
without inventing consequential product or architecture decisions.

Ground current behavior and proposed design in the relevant code, tests, and
sources. Separate settled decisions from assumptions and open questions. Resolve
routine details from evidence; surface choices that materially change the result.

Capture the outcome, scope, important design decisions and tradeoffs, and
observable acceptance criteria. Include compatibility, migration, or failure
behavior where it affects the work. Use the project's format; the
[optional outline](references/spec-contract.md) can help with larger changes.

Split work only when dependencies, risk, or independently useful outcomes justify
it. Detail the next stage; leave later mechanics open to what implementation
teaches. Keep shared decisions in the spec and live status in the existing tracker.

Check that the proposed work covers the intended behavior and that its acceptance
criteria can be verified. Publish files or tracker items only within the requested
scope. A planning request ends with the plan; an existing request to implement
continues without another approval gate.
