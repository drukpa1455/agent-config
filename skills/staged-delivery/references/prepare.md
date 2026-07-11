# Prepare a Stage

Turn one provisional stage into a frozen execution contract. This is where uncertainty is resolved; execution should not need routine design questions afterward.

## 1. Establish current truth

Verify that the stage is open, belongs to the intended epic, and is unblocked. Fetch `origin/HEAD` and record the candidate stage base without changing code.

Read:

- the epic, approved plan, stage, and current sub-issues;
- prior landed stage reports and decisions;
- relevant repository modules, tests, migrations, and operational docs;
- `.gitmodules`, pinned submodule SHAs, referenced SDKs/specifications, and upstream primary sources;
- current behavior at the highest observable seam.

When the user invokes [`terminal-diagrams`](../../terminal-diagrams/SKILL.md),
take a fresh GitHub observation and project only the stage's relevant hierarchy,
blockers, stack, or source-backed architecture question. It supports this
existing launch-readiness evidence; it does not freeze or amend the lease.

Name the assumption most likely to invalidate this stage. Obtain fresh evidence for it now through source inspection, a bounded research task, characterization, or a disposable prototype. If false, reshape the stage before asking for launch.

## 2. Refine the work graph

Each implementation child must be one independently reviewable PR purpose with explicit acceptance and verification. Split or combine provisional children accordingly. Put special investigation, prototype, migration-risk, or contract questions before implementation and close them before launch.

Order implementation children as the intended PR stack. The stack is a total merge order even when semantic dependencies form a smaller DAG; encode only real prerequisites with native `blocked by` relationships. Every child must leave its branch green. Do not create user checkpoints between children.

## 3. Prove launch readiness

A stage is ready only when:

- every question that could change scope, architecture, contracts, migration, stack shape, or verification is resolved;
- residual unknowns are classified as reversible execution choices inside the lease;
- the plan-invalidating assumption has fresh evidence;
- the complete stack fits one bounded integrated review and merge budget;
- landing the stage creates a coherent trunk state from which the next stage can start;
- rollback and repair paths are explicit.

Keep unresolved load-bearing work in investigation or prototype children. Close it before launch; do not hide fog inside an implementation issue.

## 4. Draft the execution lease

Update the stage body with:

```markdown
## Outcome

## Epic invariants

## Source plan and revision

## Stage base revision

## Base drift policy

## Evidence and plan-invalidating assumption

## Reference and submodule snapshot

## PR stack order

## Acceptance criteria

## Verification contract

## Rollback and repair

## Context and concurrency budget

## Allowed external actions and resource cap

## Stop conditions

## Out of scope
```

The lease should authorize routine implementation, commits, pushes, PR creation, debugging, fresh-context child execution, checkpoint comments, and review for the named children. Its base drift policy may allow one clean pre-review stack rebase only when range-diff, layer behavior, and checks remain equivalent; conflicts or semantic drift stop the stage. The post-review stack merge is authorized only after the human merge gate; production remains separately revision-bounded.

## 5. Present the launch gate

Show:

- the final stage body diff;
- every child created, edited, closed, or reparented;
- native blocker changes;
- base revision and stack order;
- evidence gathered and unresolved risks;
- execution authority and stop conditions.

Ask once whether to publish the refinements and authorize execution of this exact lease. On approval:

1. Apply the bounded GitHub edits and verify native relationships.
2. Normalize and hash the final stage body as defined in `state.md`.
3. Post exactly one launch marker with the lease ID, frozen base commit and tree, source revision, child issue numbers, and stack order.
4. Re-fetch the body and comment, recompute the lease ID, and verify the transition.

The launch marker authorizes `run` mode without another semantic approval. Stop prepare mode without creating a worktree so a fresh execution context can reconstruct the lease; the operator or harness may invoke `run` immediately. Prepare is complete only when all launch-readiness checks pass and another session can reconstruct the exact lease from GitHub alone.
