---
name: implement
description: Deliver a decided repository issue, stage, epic, specification, plan, findings block, or brief through isolated implementation, verification, landing, tracker closure, and cleanup. Use explicitly when the user is ready to execute the agreed outcome rather than continue specification or discussion.
disable-model-invocation: true
---

# Implement

Deliver the selected scope without forcing its input into a new planning
workflow. The governing input may be the current conversation, a specification,
an issue, a stage, an epic, a plan, or review findings.

## Ground the change

Read applicable repository instructions, the governing input, and the source and
tests that own the affected behavior. Identify the authorized outcome,
boundaries, fixed decisions, dependencies, acceptance evidence, and unresolved
choices.

Select scope from the request: one named issue, a complete named stage, or a
complete epic. With no explicit scope, infer the next incomplete stage from the
active specification or tracker and ask only when the choice is genuinely
ambiguous.

Reconcile the input with live truth. Preserve agreed intent; correct its
canonical owner only when evidence shows a path, assumption, contract, or
dependency is stale. Ask only when evidence cannot resolve a consequential
product, architecture, compatibility, safety, cost, or authority decision.

Before each stage, study the sample modules, references, papers, specifications,
and documentation that can invalidate its design. Re-ground the stage against
fresh trunk and revise its contract and issues before coding when new evidence
requires it.

## Execute the scope

Keep the primary checkout on trunk and read-only. Use the repository's isolation
entrypoint for each independently landable change. When none exists, resolve
`$SKILL_DIR` from this loaded file and run `$SKILL_DIR/scripts/work new <task>`;
it creates a task branch and worktree under `~/.worktrees`. Follow the issue
graph in dependency order; use stacked work only for real dependencies. The
fallback requires Git and Python 3.9 or newer.

Keep required behavior, tests, migration, documentation, and cleanup together.
Do not absorb adjacent polish, speculative architecture, or unrelated failures.
Resolve ordinary implementation mechanics from repository patterns and evidence.

When implementation invalidates the governing specification or delivery graph,
update the affected contract, decision, issue, or dependency before continuing.
Never silently narrow, defer, or reinterpret specified behavior.

Complete the full selected issue or stage. For epic scope, repeat the stage loop:
deliver one stage, verify it from fresh trunk, refine the next stage from what was
learned, and continue until the epic contract is satisfied or genuinely blocked.

## Prove and land

Test the most likely invalidating assumption early. Run focused checks while
iterating, then broader checks justified by affected contracts. Review the
complete effective diff for scope, ownership, interfaces, invalid states,
failure behavior, migration, cleanup, and unintended change.

For every change, commit and push the candidate, then open or update its ready
pull request. Bind the candidate head and await every configured review and
required check for that exact revision. Fetch the review findings; completion or
a successful or neutral check is not approval. Validate each finding, fix valid
defects, reject false findings with evidence, and resolve every review thread.

When the global independent-review condition applies, use one configured
read-only reviewer when available; otherwise give one reviewer the applicable
instructions, acceptance criteria, and exact candidate revision. After any
material change, rerun affected evidence, push the new candidate, and repeat the
review loop. Merge only when every configured review covers the exact head, no
finding remains unresolved, and required checks pass. The implementer retains
ownership through merge, landed verification, tracker closure, and cleanup.

## Close the scope

Before closing a stage, verify its complete outcome from fresh trunk. Map every
stage invariant and acceptance criterion to evidence, test seams between its
issues, and record landed revisions, decisive proof, material deviations, and
their effect on later stages in the canonical stage or epic surface. Then
re-ground and refine the next stage when the selected scope continues.

Before closing an epic, audit every epic invariant and acceptance criterion,
exercise cross-stage behavior, and review the aggregate landed diff for
architectural drift, duplicated concepts, and incomplete cleanup. Reconcile the
specification's decision state and landed revision with what shipped.

Update or close completed issues, intentionally close superseded pull requests,
then use the repository's cleanup entrypoint or run
`$SKILL_DIR/scripts/work done`. The fallback removes only its current clean task
worktree and branch after proving a pull request for its exact head was merged
into fresh trunk and no open or local work depends on it. It requires
authenticated `gh`; if unavailable,
preserve the workspace and use provider-native evidence and cleanup. Do not create
a separate summary artifact when the canonical spec, tracker, and retained
evidence suffice. Do not destroy blocked evidence merely to make the tracker look
clean; leave every unresolved artifact in an explicit reported state.

Invocation authorizes delivery and cleanup for the selected repository scope. It
does not bypass the global high-impact boundary or authorize production mutation.
Report the landed outcome, decisive evidence, environment limits, residual risk,
and any intentionally open artifact without routine logs or plan bookkeeping.
