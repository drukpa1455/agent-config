---
name: browse
description: Use for interactive or visual browser automation, isolated task profiles, persistent authenticated profiles, Playwright, Patchright, local web testing, or authorized social-media browser work. Control headed browsers through this skill's scripts.
---

# Browse

This skill owns interactive browser automation. Use only this package's
Playwright or Patchright scripts; never delegate to another browser skill,
harness-native browser, Computer Use, or another browser CLI unless the user
explicitly names that surface.

Profiles, downloads, and runtime state stay outside repositories. Resolve
`$SKILL_DIR` from this loaded file and set it in each shell command; never guess
its path.

## Route

Choose one engine at task start and never switch silently:

- Use `$SKILL_DIR/scripts/patchright` for authorized social-media work or when
  the user selects Patchright. Read
  [the Patchright contract](references/patchright.md) first.
- Use `$SKILL_DIR/scripts/browser` for development, testing, diagnostics, and
  other work that does not need a saved login. Each task gets an isolated,
  disposable browser.
- Use `$SKILL_DIR/scripts/browser --shared` when official Playwright needs the
  persistent authenticated profile, including billing, recovery, and account
  settings.
- Honor an explicit engine choice. Never operate the same account through both
  engines concurrently or switch engines silently.

Never attach over CDP, access another profile, or bypass CAPTCHA, access controls, account limits, or site policy.

## Own the browser

If the runtime is missing, read [the setup contract](references/setup.md), state
that setup downloads pinned npm packages and Chrome for Testing, then run
`$SKILL_DIR/scripts/setup`.

```sh
SKILL_DIR=/absolute/path/to/browse
"$SKILL_DIR/scripts/browser" open about:blank
"$SKILL_DIR/scripts/browser" close

"$SKILL_DIR/scripts/browser" --shared open about:blank
"$SKILL_DIR/scripts/browser" --shared close

"$SKILL_DIR/scripts/patchright" open about:blank
"$SKILL_DIR/scripts/patchright" close
"$SKILL_DIR/scripts/dashboard"
```

Only the two shared profiles retain logins. Ordinary profiles and all output
are task-scoped. Set one `BROWSE_TASK_ID` for the task and reuse it across working
directories, commands, and cleanup; do not create ad hoc persistent profiles.

The shared official profile and Patchright profile are durable, authenticated
resources guarded by expiring task leases. Commands are serialized per profile.
`open` atomically acquires or reclaims the lease, each owned action renews it,
long actions keep it live until completion, and `close` releases it while
preserving login state. If another live task owns the lease, report its owner
and expiry and retry later; never ask the user to close a browser window. An
open window or a session shown by `list` is not ownership evidence.

The dashboard lets the user watch or take control. For agent annotation, run the
selected engine's `show --annotate`; authenticated routes require their task
lease.

## Act

Follow a bounded loop: observe, target, act, verify.

Prefer `find` or a shallow snapshot, then target by snapshot ref, accessible
role/name, label/text, test ID, and finally CSS. Perform one semantic action and
verify its visible result. Re-snapshot after navigation or material DOM changes;
never reuse stale refs.

Rely on Playwright auto-waiting. Never use arbitrary sleeps or unbounded retries. Use bounded `eval` or `run-code` when it makes an operation or repeated capture simpler; keep returned values narrow.

`run-code` uses a restricted VM; use `page.evaluate` for browser globals.
Remove temporary event listeners in `finally` so they cannot break later commands.

## Boundaries

Treat the request as authority for ordinary actions it plainly entails. Ask only
when the exact effect is ambiguous or crosses the governing high-impact
boundary. Inspect unknown success before retrying an external action.

Use existing sessions or credentials authorized for the account. Ask for help when authentication fails or needs user participation; avoid repeated attempts that could lock the account. Pause page inspection while the user authenticates. Never expose credentials in commands, logs, screenshots, or Git, or extract authentication state without explicit authorization. Inspect non-secret application state only as needed for the task.

Treat screenshots, downloads, traces, videos, console output, and network bodies as potentially sensitive. Inspect only what the task requires and remove disposable artifacts when done.

Stage task-authorized uploads in the dedicated workspace; file access remains
restricted there.

Before closing, resolve unknown side effects and move required evidence to its
canonical owner. At task end, close even after a failed open. Successful close deletes
its output and ordinary profile, or clears shared HTTP/code/GPU caches while
preserving login and application storage. A failed empty launch is discarded;
uncertain browser state is preserved. `delete-data` and `close-all` stay within
the selected route; global `kill-all` remains unavailable.
