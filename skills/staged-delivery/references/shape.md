# Shape Delivery

Convert an approved plan into the smallest useful GitHub hierarchy. This mode publishes structure; it does not deepen a stage or execute implementation.

## 1. Validate the source

Read the plan completely. Require a stable source:

- tracked file: repository path plus blob or commit SHA;
- GitHub artifact: issue or discussion URL plus current revision context.

Require canonical `Status: Approved`; do not reconstruct approval from chat, a PR title, or invocation wording. Stop if that status is absent, the plan contains unresolved consequential choices, contradicts repository policy, or cannot name an observable destination. Resolve repository visibility before drafting issue bodies.

When the user invokes [`terminal-diagrams`](../../terminal-diagrams/SKILL.md), it
may project the approved plan revision's outcome dependencies before
normalization. Do not represent the proposed hierarchy as live GitHub state
until it exists; the projection neither publishes nor changes the graph.

## 2. Normalize the hierarchy

Use no more hierarchy than the work earns:

- one coherent purpose: return it to the repository's ordinary issue/worktree/PR workflow without publishing a staged graph;
- genuinely multi-stage effort: one epic with ordered stage sub-issues;
- multiple independently reviewable changes inside a stage: implementation sub-issues;
- unresolved load-bearing question: an investigation or prototype sub-issue that must close before stage launch.

If the plan has one coherent purpose, stop here with the ordinary workflow handoff; do not present or publish a staged graph.

Stages are outcome-shaped, not architecture layers. Implementation issues are one-purpose PR units. For wide mechanical refactors, use expand, bounded migrations, then contract rather than forcing false vertical slices.

Normalization may change tracker structure, not plan semantics. Preserve the approved outcomes, architecture, stage order, interfaces, and invariants. The plan revision pins those semantics, not the current trunk commit. If trunk moved, refresh factual execution-base context and absorb compatible changes; a changed SHA or overlapping path alone is not a plan amendment. If an approved outcome, architecture, interface, invariant, controlled-resource exposure, observable behavior, or required verification must change, stop and return to `implementation-planning` for a new approved revision.

For every node draft:

- title and observable outcome;
- parent;
- native blockers;
- plan source and immutable revision;
- acceptance criteria and out of scope;
- focused interface or file surface when stable enough to help ownership.

For an epic, name cross-stage invariants. Each stage names what evidence it must produce before launch and after landing.

## 3. Present one publication plan

Show the complete tree, dependency edges, issue types if the repository already defines them, and exact issue count. Mark implementation children of unprepared stages as provisional. Recommend omission over placeholder issues.

Obtain one explicit approval for this repository and graph.

## 4. Protect the publication boundary

Before any GitHub write, scan every title and body for credentials, tokens, cookies, private/customer data, paid payloads, local-only paths, and source material the repository's visibility cannot safely expose. Link a private canonical artifact instead of copying it. Stop on any high-risk finding rather than redacting by guess.

## 5. Publish deterministically

Create parents before children:

```sh
gh issue create --title <title> --body-file <file>
gh issue create --parent <parent> --title <title> --body-file <file>
gh issue edit <issue> --add-blocked-by <blocker>
```

Use native sub-issues and dependencies, not duplicated checklist relationships. Apply an existing issue type, label, milestone, or project only when repository policy requires it; never create taxonomy as setup.

Record every returned URL immediately. On partial failure, stop and report the exact created graph, failed operation, observed remote state, and next idempotent repair action. Never rerun the creation batch blindly. Repair by inspecting and attaching existing issues, not recreating them.

## 6. Finish at the publication boundary

Verify parent and dependency fields with `gh issue view --json parent,subIssues,blockedBy,blocking`.

A one-unit plan is a terminal no-write result: report the ordinary workflow handoff and stop staged delivery.

For an epic hierarchy, report the epic URL, stage order, provisional children, and recommended first stage. Do not prepare it until the user selects that stage.

Shape is complete only when every approved issue URL is recorded, every native relationship matches the proposed graph, no unapproved issue or taxonomy was created, and the correct terminal branch was reported.
