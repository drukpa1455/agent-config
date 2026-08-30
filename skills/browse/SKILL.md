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

Ordinary official browsers are task-isolated. `close` removes that task's
profile and output without touching another task. Set `BROWSE_TASK_ID` when the
same task runs commands from different working directories.

The shared official profile and Patchright profile are durable, authenticated
resources guarded by expiring task leases. Commands are serialized per profile.
`open` atomically acquires or reclaims the lease, each owned action renews it,
long actions keep it live until completion, and `close` releases it while
preserving the profile. If another live task owns the lease, report its owner
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

Rely on Playwright auto-waiting. Never use arbitrary sleeps or unbounded retries. Use `eval` or `run-code` only when semantic commands cannot express the operation, and keep execution and returned values narrow.

## Boundaries

Treat the request as authority for ordinary actions it plainly entails. Ask only
when the exact effect is ambiguous or crosses the governing high-impact
boundary. Inspect unknown success before retrying an external action.

The user handles passwords, passkeys, CAPTCHA, and two-factor authentication. Pause while they authenticate; do not inspect the page until they say it is complete. Never inspect, export, save, or shell-capture cookies, storage, passwords, tokens, or authentication state unless the user explicitly requests that exact operation.

Treat screenshots, downloads, traces, videos, console output, and network bodies as potentially sensitive. Inspect only what the task requires and remove disposable artifacts when done.

File access is restricted to the dedicated workspace. Upload only files the
request identifies.

Close the selected browser when active work is finished. Shared profiles
persist; ordinary task profiles are deleted. `delete-data` and `close-all` stay
within the selected route. Global `kill-all` is unavailable because it crosses
task ownership.
