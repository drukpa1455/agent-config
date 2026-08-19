---
name: spec
description: Turn a consequential repository discussion, feature, migration, or architectural change into a codebase-grounded specification and delivery graph. Use explicitly when the user asks to formalize developed work, create a detailed spec or plan, or decompose it into stages, issues, and sub-issues before implementation.
disable-model-invocation: true
---

# Spec

Turn a developed discussion into an executable agreement. This workflow owns
planning, not implementation: inspect the target freely, create or update its
planning artifacts, and stop before editing product code. Mutate an external
tracker only when the request or established repository workflow calls for it.

## Ground the work

Read the governing conversation and linked material, repository instructions,
and the source, tests, contracts, history, and tracker state that can change the
design. Separate evidence, decisions, assumptions, and open questions.

Study relevant sample modules, upstream implementations, papers, specifications,
and documentation when they can change the contract or design. Bind sources to
revisions where drift matters, and distinguish observation from inference. Give
each research thread a decision or invalidating assumption to resolve and stop
when enough evidence exists to decide or state the remaining uncertainty.

Resolve ordinary details from evidence. When a choice would materially change
behavior, scope, architecture, compatibility, safety, cost, proof, or delivery
order, recommend a default and ask. Do not hide unresolved choices in tasks.

## Write the specification

For durable or multi-stage work, read and scale
[the specification contract](references/spec-contract.md). Establish:

1. **Outcome:** affected consumers, current and desired behavior, scope, and
   non-goals.
2. **Behavioral contract:** stable, testable invariants and acceptance criteria,
   including material boundaries, failures, compatibility, and recovery.
3. **Technical design:** current owners, proposed flow and responsibilities,
   interfaces, lasting decisions, meaningful tradeoffs, and operational or
   migration semantics that shape the work.
4. **Open decisions:** only consequential choices evidence cannot resolve.

Synthesize a recommended design before decomposing it. Validate the draft
against the live repository and revise contradicted assumptions. Include a
compact ASCII architecture map for complex designs; it is a projection of the
written contract, not another source of truth.

## Build the delivery graph

Split by coherent, independently provable outcomes—not files, layers, teams, or
template symmetry. Use stages only for useful intermediate trunk states, distinct
risk boundaries, or evidence needed by later work. Use sub-issues only when they
clarify ownership or permit independent progress.

Size an issue for one focused agent run, one coherent review, and one landable
change. Split only at a real behavior, dependency, risk, or evidence boundary;
use this as a design signal, not a quota.

For a multi-stage epic, include an ASCII delivery map. Specify the epic outcome,
stage contracts, order, and dependencies completely, but detail only the next
stage to implementation depth. Preserve later stages as outcomes, invariants,
dependencies, and invalidating assumptions until evidence from earlier stages
can refine them.

Keep shared contracts and decisions in the parent spec. Give each issue its local
outcome, boundary, dependencies, fixed decisions, and proof without copying the
whole specification. When publishing tracker items, use native hierarchy and
dependencies as the canonical execution graph; do not mirror live status in the
spec.

Treat every stage boundary as a learning boundary. After a stage lands, re-ground
the next stage against fresh trunk, new evidence, and the governing epic before
its issues are finalized or implemented.

## Validate and publish

Verify every named path, symbol, command, issue, and dependency. Ensure each
stage leaves a coherent system and each issue can be executed without inventing
a product or architecture decision.

Check coverage in both directions: every invariant and acceptance criterion must
map to a stage and decisive proof; every next-stage criterion must map to an
issue; every issue must advance a named stage outcome. Reject missing, circular,
or ornamental work before publishing.

Use the smallest useful artifact: one issue for a small decided change, a durable
spec for consequential work, and an epic or staged issue graph only when order or
coordination benefits. Report what was created, the delivery order, and open
decisions. Stop with the planning artifacts ready for review; begin code only
after a later explicit implementation request.
