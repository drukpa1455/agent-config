# Shape the Epic

Convert an approved plan into the smallest useful GitHub hierarchy. This mode publishes structure; it does not deepen or execute a stage.

## 1. Validate the source

Read the plan completely. Require a stable source:

- tracked file: repository path plus blob or commit SHA;
- GitHub artifact: issue or discussion URL plus current revision context.

Stop if the plan is unapproved, contains unresolved consequential choices, contradicts repository policy, or cannot name an observable destination.

## 2. Normalize the hierarchy

Use no more hierarchy than the work earns:

- one coherent purpose: one implementation issue;
- genuinely multi-stage effort: one epic with ordered stage sub-issues;
- multiple independently reviewable changes inside a stage: implementation sub-issues;
- unresolved load-bearing question: an investigation or prototype sub-issue that must close before stage launch.

Stages are outcome-shaped, not architecture layers. Implementation issues are one-purpose PR units. For wide mechanical refactors, use expand, bounded migrations, then contract rather than forcing false vertical slices.

For every node draft:

- title and observable outcome;
- parent;
- native blockers;
- plan source and immutable revision;
- acceptance criteria and out of scope;
- focused interface or file surface when stable enough to help ownership.

The epic also names cross-stage invariants. Each stage names what evidence it must produce before launch and after landing.

## 3. Present one publication plan

Show the complete tree, dependency edges, issue types if the repository already defines them, and exact issue count. Mark implementation children of unprepared stages as provisional. Recommend omission over placeholder issues.

Obtain one explicit approval for this repository and graph.

## 4. Publish deterministically

Create parents before children:

```sh
gh issue create --title <title> --body-file <file>
gh issue create --parent <parent> --title <title> --body-file <file>
gh issue edit <issue> --add-blocked-by <blocker>
```

Use native sub-issues and dependencies, not duplicated checklist relationships. Apply an existing issue type, label, milestone, or project only when repository policy requires it; never create taxonomy as setup.

Record every returned URL immediately. On partial failure, stop and report the exact created graph plus the next idempotent repair action. Never rerun the creation batch blindly.

## 5. Finish at the epic gate

Verify parent and dependency fields with `gh issue view --json parent,subIssues,blockedBy,blocking`. Report the epic URL, stage order, provisional children, and recommended first stage. Do not prepare it until the user selects that stage.
