---
name: persistent-browser
description: Controls isolated visible Playwright and Patchright browser profiles for web navigation, research, social-media work, screenshots, and live user collaboration. Routes fidelity-sensitive work to official Playwright and authorized social-media work to Patchright.
license: MIT
compatibility: Requires Node.js 20+, npm, stable Google Chrome, a POSIX shell, and one approved setup download.
---

# Persistent Browser

Let `$SKILL_DIR` be the absolute directory containing this loaded `SKILL.md`. Resolve it from the loaded file path and set it in each shell command; never guess or invoke a different browser CLI.

## Route

Choose one engine at task start and never switch silently:

- Use `$SKILL_DIR/scripts/patchright` for user-authorized social-media work or when the user explicitly selects Patchright. This includes ordinary reading, posting, commenting, messaging, and account use. Read [references/patchright.md](references/patchright.md) first.
- Use `$SKILL_DIR/scripts/browser` for everything else, especially development, testing, diagnostics, security or CSP inspection, service workers, billing, recovery, passwords, MFA, and account-security settings.
- The user's explicit engine choice overrides these defaults. Never operate the same account through both engines concurrently.

Never attach over CDP, access another profile, or bypass CAPTCHA, access controls, account limits, or site policy.

## Start

If a command reports that its runtime is missing, read [references/setup.md](references/setup.md). State that setup downloads pinned npm packages and Chrome for Testing, then obtain approval before running `$SKILL_DIR/scripts/setup`.

```sh
SKILL_DIR=/absolute/path/to/persistent-browser
"$SKILL_DIR/scripts/browser" list
"$SKILL_DIR/scripts/browser" open about:blank
"$SKILL_DIR/scripts/dashboard"
```

Both engines are headed and persistent. The dashboard lets the user watch or take control. Use `scripts/browser show --annotate` when visual intent or feedback is ambiguous.

## Operate

Follow one bounded loop: observe, target, act, verify.

1. Use `find` or a shallow partial snapshot when possible.
2. Prefer snapshot refs, then accessible role/name, label/text, test ID, and finally CSS.
3. Perform one semantic action.
4. Verify its visible result. Re-snapshot after navigation or material DOM changes; never reuse stale refs.

```sh
"$SKILL_DIR/scripts/browser" goto <url>
"$SKILL_DIR/scripts/browser" find <text>
"$SKILL_DIR/scripts/browser" snapshot --depth=4
"$SKILL_DIR/scripts/browser" click <ref>
"$SKILL_DIR/scripts/browser" fill <ref> <text>
"$SKILL_DIR/scripts/browser" tab-list
"$SKILL_DIR/scripts/browser" screenshot
```

Rely on Playwright auto-waiting. Never use arbitrary sleeps or unbounded retries. Use `eval` or `run-code` only when semantic commands cannot express the operation, and keep execution and returned values narrow.

## Boundaries

Navigation and reading are allowed. Before any action that could mutate remote state—including submit, save, send, delete, purchase, upload, permission or account changes, and autosaving fields—state the exact action and obtain explicit approval.

The user handles passwords, passkeys, CAPTCHA, and two-factor authentication. Pause while they authenticate; do not inspect the page until they say it is complete. Never inspect, export, save, or shell-capture cookies, storage, passwords, tokens, or authentication state unless the user explicitly requests that exact operation.

Treat screenshots, downloads, traces, videos, console output, and network bodies as potentially sensitive. Inspect only what the task requires and remove disposable artifacts when done.

File access is restricted to the dedicated workspace. Copy only an explicitly approved upload into that workspace.

Close the selected browser when active work is finished. Closing preserves its profile. Never run `delete-data`, `close-all`, or `kill-all` without explicit approval.
