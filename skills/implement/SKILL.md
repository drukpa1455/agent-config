---
name: implement
description: Deliver a decided repository issue, stage, epic, specification, plan, findings block, or brief through isolated implementation, verification, landing, tracker closure, and cleanup. Use explicitly when the user is ready to execute the agreed outcome rather than continue specification or discussion.
disable-model-invocation: true
---

# Implement

Deliver the agreed issue, stage, or epic without forcing it into a new planning
workflow. Use the conversation, specification, plan, or findings that already
own the intended outcome.

Implement with radical simplicity and maximum elegance. Fix root causes, keep
ownership explicit, and make every abstraction earn its place. Preserve the
agreed outcome; prove it against its acceptance criteria.

## Ground and execute

Read applicable instructions and the source and tests that own the affected
behavior. Select the requested scope; when unspecified, infer the next incomplete
stage and ask only if a consequential choice remains unresolved.

Reconcile the plan with current code. Investigate uncertainty that could change
the implementation; preserve settled decisions unless evidence contradicts them.
Resolve ordinary mechanics independently. Update the existing plan or tracker
when findings change it; never silently narrow or reinterpret the outcome.

Follow shared review and delivery policy and repository-specific requirements.
Keep each change coherent. For an epic, deliver in dependency order, use what
was learned to refine the next stage, and continue through the selected scope.
A finished stage is not a stopping point when authorized work remains.

## Prove the outcome

Test the assumption most likely to invalidate the change. Derive acceptance
checks from the requested behavior, not the implementation's current shape.
Use focused checks while iterating and broader checks justified by affected
contracts; reuse applicable evidence for unchanged code and conditions.

Verify the landed outcome against its acceptance criteria, including relevant
cross-stage behavior. Record decisive evidence, revisions, and unresolved work
in the existing tracker. Passing tests or a merged PR alone do not establish
that the whole requested outcome is complete.

Continue work that available evidence supports; qualify unproven claims rather
than inventing prerequisites. Stop dependent work when a consequential decision,
required check, or applicable authorization boundary genuinely prevents progress.
Report the exact gap and preserved state. Invocation does not authorize production
mutation or bypass the shared high-impact boundary.

## Workspace fallback

Use the repository's isolation and cleanup entrypoints. When absent, resolve
`$SKILL_DIR` from this loaded file and use `$SKILL_DIR/scripts/work new <task>`
and `$SKILL_DIR/scripts/work done`. Creation requires Git and Python 3.9+;
cleanup also requires authenticated `gh`.

The fallback creates a task branch and worktree under `~/.worktrees`. It removes
only its current clean task after proving the exact head was merged onto fresh
trunk and no open or local work depends on it. It first fast-forwards clean
primary trunk; dirty, off-trunk, or diverged primaries preserve the task. If `gh`
is unavailable, preserve the workspace until provider-native evidence supports
safe cleanup. Do not create a separate summary artifact when the existing
tracker suffices.
