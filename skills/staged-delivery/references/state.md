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
<!-- staged-delivery:invalidated v1 -->

lease-id: <sha256>
manifest-id: <sha256 or none>
prior-state: <launched | reviewed | merge-approved | landed>
evidence: <canonical path or URL at revision, or sha256 of exact report bytes>
reason: <scope | architecture | contract | invariant | controlled-resource | behavior | verification>: <safe concise summary>
landed-commit: <sha or none>
next-mode: prepare
```

```markdown
<!-- staged-delivery:landed v1 -->

manifest-id: <sha256>
trunk-commit: <sha>
trunk-tree: <tree>
checks: <fresh result summary>
```

Canonicalize the reviewed manifest as recursively sorted-key, compact UTF-8 JSON with LF endings and one trailing newline, then hash those bytes with SHA-256 to produce `manifest-id`. Record that exact JSON in the reviewed comment so another session can recompute it.

## Invalidation semantics

An invalidation marker with the current `lease-id` supersedes launch authority
and any named reviewed, merge-approved, or landed manifest. It blocks merges,
stage closure, and later-stage launch. Only a newly prepared stage body and its
new verified launch marker can restore execution authority.

For pre-merge invalidation, `landed-commit` is `none`. For post-landing
invalidation, record the actual trunk commit and reopen the stage; the marker
revokes semantic acceptance without claiming that landed commits disappeared.
Keep the summary safe for the repository's visibility. When the evidence cannot
be copied safely, record an immutable private reference or the SHA-256 digest of
the exact report bytes and retain the report at its approved private source.

## Ownership

- Launch comment freezes authority.
- A base-refresh comment records an allowed pre-review rebase without changing the lease.
- Child issues and PRs own implementation status.
- Checkpoint comments make the stack reconstructible across fresh contexts.
- Reviewed comment freezes the exact stack the human sees.
- Merge approval authorizes only that manifest.
- Landed comment records fresh trunk evidence.
- Invalidation revokes semantic authority while preserving delivered-history facts.

Before acting, derive the latest valid transition from issue comments and
recompute its hash. Reconcile evidence from the current invocation before using
that transition. Stop on an invalidation, missing marker, mismatch, duplicate
transition, or unknown-success write.
