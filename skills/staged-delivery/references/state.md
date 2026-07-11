# Durable State

GitHub owns lifecycle state. Do not rely on chat history, local summaries, labels, or a parallel database.

## Stage body

The stage body is mutable during prepare and immutable after launch. Normalize it to UTF-8 with LF endings and one trailing newline, hash those exact bytes with SHA-256, and call the result `lease-id`.

Any body edit after launch changes the lease and returns the stage to prepare mode.

## Transition comments

Use one machine-readable marker per transition:

```markdown
<!-- staged-delivery:launch v1 -->

lease-id: <sha256>
base-commit: <sha>
base-tree: <tree>
plan-revision: <revision>
stack: <ordered child issue numbers>
```

```markdown
<!-- staged-delivery:base-refreshed v1 -->

lease-id: <sha256>
old-base-commit: <sha>
new-base-commit: <sha>
new-base-tree: <tree>
equivalence: <range-diff and check summary>
```

```markdown
<!-- staged-delivery:stack-checkpoint v1 -->

lease-id: <sha256>
issue: <number>
pr: <url>
head-commit: <sha>
head-tree: <tree>
base-branch: <branch>
checks: <fresh result summary>
```

```markdown
<!-- staged-delivery:reviewed v1 -->

manifest-id: <sha256>
lease-id: <sha256>
base-commit: <sha>
base-tree: <tree>
tip-commit: <sha>
tip-tree: <tree>
layers: <ordered issue, PR, head commit, and tree records>
checks: <fresh result summary>
```

```markdown
<!-- staged-delivery:merge-approved v1 -->

manifest-id: <sha256>
```

```markdown
<!-- staged-delivery:landed v1 -->

manifest-id: <sha256>
trunk-commit: <sha>
trunk-tree: <tree>
checks: <fresh result summary>
```

Canonicalize the reviewed manifest as recursively sorted-key, compact UTF-8 JSON with LF endings and one trailing newline, then hash those bytes with SHA-256 to produce `manifest-id`. Record that exact JSON in the reviewed comment so another session can recompute it.

## Ownership

- Launch comment freezes authority.
- A base-refresh comment records an allowed pre-review rebase without changing the lease.
- Child issues and PRs own implementation status.
- Checkpoint comments make the stack reconstructible across fresh contexts.
- Reviewed comment freezes the exact stack the human sees.
- Merge approval authorizes only that manifest.
- Landed comment records fresh trunk evidence.

Before acting, derive the latest valid transition from issue comments and recompute its hash. Stop on a missing marker, mismatch, duplicate transition, or unknown-success write.
