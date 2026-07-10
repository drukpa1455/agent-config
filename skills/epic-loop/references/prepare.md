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

Name the assumption most likely to invalidate this stage. Obtain fresh evidence for it now through source inspection, a bounded research task, characterization, or a disposable prototype. If false, reshape the stage before asking for launch.

## 2. Refine the work graph

Each implementation child must be one independently reviewable PR purpose with explicit acceptance and verification. Split or combine provisional children accordingly. Put special investigation, prototype, migration-risk, or contract questions before implementation and close them before launch.

Order implementation children as the intended PR stack. Encode real prerequisites with native `blocked by` relationships. Do not create user checkpoints between children.

## 3. Draft the execution lease

Update the stage body with:

```markdown
## Outcome

## Epic invariants

## Source plan and revision

## Stage base revision

## Evidence and plan-invalidating assumption

## Reference and submodule snapshot

## PR stack order

## Acceptance criteria

## Verification contract

## Allowed external actions and resource cap

## Stop conditions

## Out of scope
```

The lease should authorize routine implementation, commits, pushes, PR creation, debugging, and review for the named children. It must state whether the post-review stack merge is authorized only after the human merge gate; production remains separately revision-bounded.

## 4. Present the launch gate

Show:

- the final stage body diff;
- every child created, edited, closed, or reparented;
- native blocker changes;
- base revision and stack order;
- evidence gathered and unresolved risks;
- execution authority and stop conditions.

Ask once whether to publish the refinements and launch this exact lease. On approval, apply the bounded GitHub edits, verify native relationships, and post a launch comment recording the frozen base, source revision, child issue numbers, and stack order.

Stop. Do not create a worktree or begin implementation in prepare mode.
