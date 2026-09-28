---
name: browse
description: Use for interactive browser automation, visual web testing, or persistent logins. Prefer configured service integrations; use Playwright CLI for browser work and Patchright only when explicitly requested.
---

# Browse

Use `playwright-cli` directly when the task needs a browser. Use Patchright only
when explicitly requested, through `$SKILL_DIR/scripts/patchright`, which exposes
its agent CLI. Resolve `$SKILL_DIR` from this file.
Honor an explicit engine choice; never switch silently or share a profile
between engines. Read [setup](references/setup.md) if a CLI is missing or an older
saved profile needs migration.

## Sessions

Run from task-scoped scratch, with one unique session name for the whole task.
Reuse that session and its tabs across calls and resumed turns; inspect its state
before opening another browser. Pass `-s=<task>` on every command, including
cleanup. Use native `--help` for commands; do not invent another wrapper or copy
its command catalog here.

```sh
playwright-cli -s=<task> open about:blank --headed --idle-timeout=900000
playwright-cli -s=<task> snapshot
playwright-cli -s=<task> close
playwright-cli -s=<task> delete-data
```

Ordinary sessions are ephemeral: omit `--persistent`, `--profile`, and custom
`userDataDir`. Cookies survive calls within a session, then disappear on close.
Use `playwright-cli show` for the native dashboard.

Pass `--idle-timeout=900000` on every Playwright `open`, including saved profiles.
Headed browsers otherwise have no idle shutdown. This bounds abandoned browser
processes; explicit close and metadata cleanup are still required. For Patchright,
check its native help for timeout support; do not assume identical options.

## Saved profiles

A profile stores logins across tasks; a session is its running browser. Reuse one
canonical Playwright automation profile when saved login is needed:

- Playwright: `--profile="$HOME/.local/share/pi-browser/profile"`
- Explicit Patchright exception: `--browser=chrome --profile="$HOME/.local/share/pi-browser/patchright-profile"`

Check that the profile exists before opening it: `--profile` can create a new
directory. If absent, explain that a fresh profile requires login; create it only
as part of user-authorized saved-login setup. Do not silently recreate a deleted
profile. Keep the path stable across upgrades; if an older saved profile exists,
resolve its migration before creating another. Never copy authentication state
without explicit authorization.

Keep automation separate from the user's everyday Chrome profile: Playwright
does not support automating Chrome's default user data directory. Do not create
profiles per task, site, or retry, or create a Patchright profile speculatively.

Keep the unique task session name for saved profiles too. Native browser locks
prevent simultaneous use of a profile; if busy, wait for its owner or continue
independent work. Do not create a substitute profile to evade the lock.
Never attach to, stop, or delete another task's session, use
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

Saved profiles retain login and application data after close;
the CLI's `delete-data` does not erase these custom paths. Reset them only when
requested, after their browsers close. No automatic cache pruning or disk quota
is provided. Ordinary tasks should not leave persistent profiles behind.
