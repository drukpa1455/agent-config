---
name: browse
description: Use Playwright CLI or the Patchright adapter when requested or needed for browser work. Prefer suitable authorized browser control already provided by the host for ordinary interaction.
---

# Browse

Honor the requested browser surface. Host-managed browsers follow their own
instructions and lifecycle. Use this CLI route when it supplies a needed
capability; it does not require another login or profile merely to use the skill.

Use `playwright-cli` or `$SKILL_DIR/scripts/patchright`, resolving `$SKILL_DIR`
from this file. Honor the chosen engine and keep engine profiles separate. Read
[setup](references/setup.md) only for missing tools or legacy-profile migration.
Discover commands through the installed CLI's help.

## Sessions and profiles

Run from task-scoped scratch. Use one unique session name, pass `-s=<task>` on
every command, and reuse its tabs across calls and resumed turns. Inspect the
session before opening another browser.

```sh
playwright-cli -s=<task> open about:blank --headed
playwright-cli -s=<task> snapshot
playwright-cli -s=<task> close
playwright-cli -s=<task> delete-data
```

Ordinary sessions are ephemeral: omit `--persistent`, `--profile`, and custom
`userDataDir`. Ephemeral storage does not end the browser process. If the chosen
CLI's help supports it, add `--idle-timeout=900000` to `open`; otherwise use
explicit cleanup.

When the task needs saved login, reuse the engine's canonical automation profile:

- Playwright: `--profile="$HOME/.local/share/pi-browser/profile"`
- Patchright: `--browser=chrome --profile="$HOME/.local/share/pi-browser/patchright-profile"`

These stay separate from everyday Chrome. Keep paths stable; resolve legacy
profiles before creating duplicates. A missing profile may need user login.
Copying authentication state requires explicit authorization. Respect native
profile locks; wait for the owner instead of bypassing the lock with a duplicate
profile. Never stop or delete another task's session.

## Operate and finish

Use fresh snapshot references or accessible locators and verify the visible
result. `run-code` uses a restricted VM: access browser globals through
`page.evaluate` and remove temporary listeners in `finally`. Inspect uncertain
success before retrying an external action.

Pause browser inspection during user authentication. Keep credentials out of
commands, logs, screenshots, and Git. Do not bypass CAPTCHA or access controls.
Use official Playwright when testing CSP, security headers, response bytes,
console, or service-worker behavior; Patchright can alter these surfaces.

When browser work ends, retain required evidence, close the task's session, and
run its `delete-data`. Confirm cleanup and remove disposable scratch. Keep a
session open for ongoing user interaction or an explicit request, and identify
it at handoff. Report cleanup failures instead of sweeping other sessions.

Custom saved profiles survive `close` and `delete-data`; reset them only when
requested, after their browsers close.
