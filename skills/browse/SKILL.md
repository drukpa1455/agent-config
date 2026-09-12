---
name: browse
description: Use for interactive browser automation, visual web testing, persistent logins, or authorized social-media work. Use Playwright CLI directly, or the Patchright adapter for social media.
---

# Browse

Use `playwright-cli` directly for ordinary browsing and visual testing. For
user-authorized social-media work, use `$SKILL_DIR/scripts/patchright`, which
exposes the same agent CLI from Patchright. Resolve `$SKILL_DIR` from this file.
Honor an explicit engine choice; never switch silently or share a profile
between engines. Read [setup](references/setup.md) only if a CLI is missing.

## Sessions

Run from task-scoped scratch, with one unique session name for the whole task.
Pass `-s=<task>` on every command, including cleanup. Use native `--help` for
commands; do not invent another wrapper or copy its command catalog here.

```sh
playwright-cli -s=<task> open about:blank --headed
playwright-cli -s=<task> snapshot
playwright-cli -s=<task> close
playwright-cli -s=<task> delete-data
```

Ordinary sessions are ephemeral: omit `--persistent`, `--profile`, and custom
`userDataDir`. Cookies survive calls within a session, then disappear on close.
Use `playwright-cli show` for the native dashboard.

Only when a saved login is needed, add the engine's existing profile to `open`:

- Playwright: `--profile="$HOME/.local/share/pi-browser/profile"`
- Patchright: `--browser=chrome --profile="$HOME/.local/share/pi-browser/patchright-profile"`

Keep the unique task session name for saved profiles too. Native browser locks
prevent simultaneous use of a profile; if busy, wait for its owner or continue
independent work. Never attach to, stop, or delete another task's session, use
`close-all` or `kill-all`, or create extra persistent profiles unless requested.

## Work

Observe, act, and verify the visible result. Prefer accessible locators or fresh
snapshot refs; refresh them after navigation or material DOM changes. Use bounded
scripts when they simplify repeated work. `run-code` uses a restricted VM:
use `page.evaluate` for browser globals and remove temporary listeners in
`finally`. Inspect unknown success before retrying an external action.

Use existing sessions or credentials authorized for the account. Ask for help
only when authentication fails or needs user participation; avoid repeated
attempts that could lock the account. Pause inspection while the user
authenticates. Never expose credentials in commands, logs, screenshots, or Git,
or extract authentication state without explicit authorization. Non-secret
application state may be inspected when the task requires it.

Do not bypass CAPTCHA, access controls, account limits, or site policy. Stage
only task-authorized uploads in scratch. Use official Playwright to verify CSP,
security headers, response bytes, console, or service-worker behavior: Patchright
can alter those surfaces. Do not rotate or spoof browser identity.

## Finish

Resolve unknown side effects and move required evidence to its canonical owner.
Close only the task's session, then use its `delete-data` command to remove CLI
session metadata. Delete disposable scratch after cleanup succeeds; report
failures with the preserved session and paths. No age-based sweeps of other work.

The two explicit saved profiles retain login and application data after close;
the CLI's `delete-data` does not erase these custom paths. Reset them only when
requested, after their browsers close. No automatic cache pruning or disk quota
is provided. Ordinary tasks should not leave persistent profiles behind.
