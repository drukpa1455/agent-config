# Run a Stage

Execute one launched stage as an unmerged PR stack, review it as one integrated change, pause once for the human merge gate, then land it base-to-tip.

## 1. Verify the lease

Read the frozen stage lease and launch comment. Confirm:

- `origin/HEAD` still equals the frozen stage base;
- every stack child is open, unblocked in order, and still matches the lease;
- referenced plans, submodules, and controlled-resource caps have not materially drifted;
- existing branches, worktrees, PRs, and unrelated dirty state are understood.

Any material drift returns the stage to prepare mode. Do not silently chase moving trunk.

## 2. Build the stack

For each implementation child in order:

1. Create the repository-prescribed branch and `.worktrees/` checkout using that issue number.
2. Base the first branch on the frozen stage base and each later branch on the preceding stack branch.
3. Implement only the child contract. Handle routine reversible choices without asking.
4. Characterize unclear behavior, test changes, and use fresh verification evidence.
5. Commit, push, and open a PR against the preceding stack branch; the first PR targets trunk.
6. Record the issue, branch, worktree, PR, head SHA, base, and checks in the stage trace.
7. Continue immediately to the next child. Merge nothing during execution.

Do not create surprise implementation issues during run mode. Resolve work inside the lease or stop on an escape condition.

## 3. Review the integrated stage

Review the complete diff from frozen base to stack tip, not only each PR in isolation. Verify:

- every child and stage acceptance criterion;
- repository standards, epic invariants, migrations, docs, and operational behavior;
- stage-wide integration, regression, and end-to-end checks;
- submodule and upstream contract alignment against the frozen snapshot;
- no unrelated scope, generated churn, debug instrumentation, or temporary artifacts;
- the final effective tree and exact base-to-tip merge order.

Fix findings inside the lease and rerun the affected checks. If a finding changes the lease, stop and return to prepare.

Present one stage report with the reviewed base and tip SHAs, ordered PR manifest, checks, deviations, reference drift, and residual risk. Ask once whether to merge this exact stack.

## 4. Merge base-to-tip

After approval, merge the entire reviewed stack without issue-by-issue questions:

1. Reconfirm every approved PR head SHA and required check.
2. Merge the base PR using repository policy.
3. Fetch and verify the merge landed in `origin/HEAD`.
4. Rebase or retarget the next PR as required by the repository's stack and merge method.
5. Prove its effective patch remains equivalent to the reviewed stack; rerun required checks.
6. Repeat to the tip.

Stop on conflict, trunk drift, changed effective behavior, failed checks, or unknown merge result. Never resolve such drift by silently altering the reviewed stage.

## 5. Verify and close the stage

From fresh `origin/HEAD`:

- prove every landed revision is an ancestor and the integrated stage behavior matches the reviewed tip;
- rerun the stage verification contract;
- verify child issue and PR state;
- remove all task-owned worktrees, local/remote branches, and temporary artifacts;
- post the landed stage report with final revisions and evidence;
- update only future provisional stages affected by new evidence;
- close the stage issue when its native children and acceptance criteria are complete.

Do not launch the next stage. Report its new evidence and wait for the user to select and prepare it.
