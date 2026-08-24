---
name: browse
description: Control the canonical persistent headed browser through this skill's Playwright or Patchright scripts. Use explicitly when the user invokes $browse for its persistent profiles, live dashboard, or authorized social-media browser work.
disable-model-invocation: true
---

# Browse

Loading this skill selects its canonical browser surface. Use only this package's
Playwright or Patchright scripts; never delegate to another browser skill,
harness-native browser, or browser CLI.

Profiles, downloads, and runtime state stay outside repositories. Resolve
`$SKILL_DIR` from this loaded file and set it in each shell command; never guess
its path.

## Route

Choose one engine at task start and never switch silently:

- Use `$SKILL_DIR/scripts/patchright` for authorized social-media work or when
  the user selects Patchright. Read
  [the Patchright contract](references/patchright.md) first.
- Use `$SKILL_DIR/scripts/browser` for everything else, especially development,
  testing, diagnostics, security, billing, recovery, and account settings.
- Honor an explicit engine choice. Never operate the same account through both
  engines concurrently or switch engines silently.

Never attach over CDP, access another profile, or bypass CAPTCHA, access controls, account limits, or site policy.

## Own the session

If the runtime is missing, read [the setup contract](references/setup.md), state
that setup downloads pinned npm packages and Chrome for Testing, then run
`$SKILL_DIR/scripts/setup`.

```sh
SKILL_DIR=/absolute/path/to/browse
"$SKILL_DIR/scripts/browser" list
"$SKILL_DIR/scripts/browser" open about:blank
"$SKILL_DIR/scripts/dashboard"
```

Both engines are headed and persistent. Their fixed sessions and profiles are
single-owner resources. Run the selected engine's `list` command first. If its
session exists and the current task does not own it, stop rather than reusing it.
The dashboard lets the user watch or take control. Use an annotated view when
visual intent is ambiguous.

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

Close the selected browser when active work is finished; its profile persists.
Run `delete-data`, `close-all`, or `kill-all` only when the request identifies
that exact cleanup.
