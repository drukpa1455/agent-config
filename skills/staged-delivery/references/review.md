# Review the Epic

Review the integrated result after all stages have landed. This is not a summary of stage reports; it tests whether their composition reached the epic destination.

## 1. Establish the landed set

Verify every stage is closed, every implementation PR is merged into `origin/HEAD`, all native blockers are clear, and no stage branch or worktree remains. Recompute every stage's landed marker from live Git/GitHub state. Resolve the original plan and epic revision that defined the destination.

When the user invokes [`terminal-diagrams`](../../terminal-diagrams/SKILL.md),
take a fresh observation for any delivery graph or a pinned `diff` for any
architecture comparison. Treat the view as supporting evidence for this
existing epic-acceptance gate, never as acceptance itself.

## 2. Test the composition

Use fresh evidence and report these axes separately:

- **Destination** — the original problem, observable outcome, and explicit exclusions.
- **Composition** — cross-stage invariants and end-to-end behavior spanning stage seams.
- **System** — final architecture, data ownership, migrations, repair paths, and operational limits.
- **References** — documentation, submodules, SDKs, specifications, and external contracts at current pinned revisions.
- **Integrity** — contradictions, duplicated representations, and repository/issue/PR/branch/worktree/artifact cleanup.

Do not accept “each stage passed” as proof that the epic passes. Run the narrowest whole-system checks that can falsify the integrated result.

## 3. Reconcile drift

Classify findings:

- **inside an existing stage contract** — reopen that stage and add the smallest corrective implementation child;
- **newly discovered epic requirement** — propose a new stage and explain why the original plan could not contain it;
- **out of scope** — record it without silently expanding the epic;
- **invalidated destination** — stop and return to epic shaping.

Corrective work follows the same prepare, run, and merge gates. Never patch trunk directly from epic review.

## 4. Present the epic gate

Report the final trunk revision, landed stages, whole-system checks, plan and reference drift, residual risks, cleanup state, and whether the destination is met. Ask once whether to accept and close the epic.

On approval, close the epic and verify GitHub shows all native sub-issues complete. Review is complete only when the whole-system evidence is fresh, every finding is classified, and the epic's live GitHub state matches the report. Do not deploy production or begin a new epic as a side effect.
