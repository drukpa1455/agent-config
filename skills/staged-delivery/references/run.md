# Run a Stage

Execute one launched stage as an unmerged PR stack, review it as one integrated change, pause once for the human merge gate, then land it base-to-tip.

## 1. Reconcile evidence and verify the lease

First apply the fresh-evidence reconciliation in `SKILL.md`. Map every finding
supplied with this invocation to the stage contract before deriving authority
from prior comments. If the latest valid transition is an invalidation, or new
evidence requires one, stop and return to `prepare`; never continue because an
older merge approval still exists.

Then derive the latest stage transition from the markers in `state.md`.
Recompute the stage-body hash and require one valid launch marker with the same
`lease-id`.

Confirm that every stack child is open, ordered, and still matches the lease;
referenced plans, submodules, and controlled-resource caps have not materially
drifted; and existing branches, worktrees, PRs, and unrelated dirty state are
understood.

When the user invokes [`terminal-diagrams`](../../terminal-diagrams/SKILL.md),
take a fresh observation before using a hierarchy, blocker, or stack projection.
It may make an inconsistency visible, but it neither changes the lease nor
replaces the required live GitHub and Git checks.

If `origin/HEAD` differs from the launch base, follow the lease's base drift policy. Commit movement or path overlap alone is not material drift. A clean refresh before review is allowed only when the changed trunk is compatible, the stack can be rebased without conflict, range-diff and observable behavior remain equivalent, and required checks pass. Record a base-refresh marker. Otherwise return to prepare mode. Never chase moving trunk silently.

## 2. Build the stack

A fresh agent or context may implement each child when the harness supports it. The child issue, frozen lease, repository instructions, and preceding PR are the complete handoff; do not pass an expanding transcript. Context changes are not human gates.

For each implementation child in order:

1. Create the repository-prescribed branch and `.worktrees/` checkout using that issue number.
2. Base the first branch on the current stage base and each later branch on the preceding stack branch.
3. Implement only the child contract. Handle routine reversible choices without asking.
4. Characterize unclear behavior, test changes, and use fresh verification evidence.
5. Commit, push, and open a PR against the preceding stack branch; the first PR targets trunk.
6. Post a stack-checkpoint marker containing the lease ID, issue, PR, head commit, head tree, base branch, and fresh checks.
7. Re-fetch the marker and PR, then continue immediately to the next child. Merge nothing during execution.

Do not create surprise implementation issues during run mode. Resolve work inside the lease or stop on an escape condition.

## 3. Stabilize the review base

Fetch `origin/HEAD` again before review. If it moved during execution and the lease permits a clean refresh, rebase the complete unmerged stack bottom-up, prove each layer's range-diff and behavior remain equivalent, rerun affected checks, and record the refreshed base. Conflict or semantic drift stops the stage before the human sees a stale stack.

After this point, any trunk drift invalidates the reviewed manifest and stops merging.

## 4. Review the integrated stage

Review the complete diff from stabilized base to stack tip, not only each PR in isolation. Keep findings separate:

- **Contract** — child acceptance, stage outcome, epic invariants, and out-of-scope behavior.
- **Standards** — repository policy, code quality, tests, migrations, and documentation.
- **Integration** — cross-child behavior, regression, end-to-end checks, and coherent trunk state.
- **Reference drift** — submodules, SDKs, specifications, and upstream contracts against the lease snapshot.
- **Operations** — resource bounds, observability, rollback, repair, cleanup, and unknown-success handling.

Use independent fresh-context reviewers when available. Fix findings inside the lease and rerun affected checks. If a finding changes the lease, stop and return to prepare.

Create canonical sorted-key JSON containing the lease ID, reviewed base commit and tree, every ordered issue/PR/head commit/head tree/check result, and reviewed tip commit and tree. Hash it as `manifest-id` and post one reviewed marker with the full JSON.

Present the five-axis report, manifest ID, ordered PRs, deviations, residual
risk, and the disposition of every fresh finding supplied in the current
invocation. Ask once whether to merge this exact manifest. A mode-selection or
continue response is not merge approval. On exact approval, post and verify one
merge-approved marker.

## 5. Merge base-to-tip

Merge the approved stack without issue-by-issue questions:

1. Require `origin/HEAD` to equal the reviewed base commit and tree.
2. Reconfirm the first PR head commit, tree, and required checks, then merge it using repository policy.
3. Fetch and require the new trunk tree to equal that reviewed layer tree.
4. Rebase or retarget the next PR as required by the repository's stack and merge method.
5. Require the rebased branch tree to equal its reviewed layer tree; verify range-diff contains only the expected base rewrite and rerun required checks.
6. Merge and repeat to the tip.
7. Require final `origin/HEAD` tree to equal the reviewed tip tree.

Stop on conflict, trunk drift, tree mismatch, changed behavior, failed checks, or unknown merge result. Inspect remote state and follow the lease's repair path; never retry or alter the reviewed stage blindly.

## 6. Verify and close the stage

From fresh `origin/HEAD`:

- rerun the stage verification contract;
- prove every landed revision and effective layer is present in trunk;
- verify child issue and PR state;
- remove all task-owned worktrees, local and remote branches, and temporary artifacts;
- post and verify one landed marker with final trunk commit, tree, and checks;
- report proposed amendments to future stages without editing them;
- close the stage issue when its native children and acceptance criteria are complete.

If post-merge verification or newly reconciled evidence contradicts the stage
contract, record the physical landed revision, then present the exact
invalidation marker and issue reopen. Do not close the stage or launch later
work. Run is complete only when the landed marker is reproducible from live
Git/GitHub state, semantic acceptance remains valid, cleanup is complete, and no
future stage was launched or mutated.
