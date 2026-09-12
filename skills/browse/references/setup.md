# Setup

Use installed CLIs when available. Setup downloads npm packages and browser
binaries; disclose that before running it. Keep installations outside repositories.

For Playwright CLI, use Node.js 20+ and the upstream installer:

```sh
npm install -g @playwright/cli
playwright-cli --help
playwright-cli install-browser
```

The Patchright adapter expects `patchright-core` in the existing user-local
runtime. Install it only if missing:

```sh
npm install --prefix "$HOME/.local/share/pi-browser/patchright-runtime" --save-exact patchright-core@1.61.1
"$SKILL_DIR/scripts/patchright" --help
```

Patchright uses installed stable Google Chrome with `open --browser=chrome`.
`PERSISTENT_BROWSER_RUNTIME` may select another runtime directory. The adapter
loads an internal agent CLI entrypoint; verify `--help`, open, and close when
upgrading Patchright. Its ordinary `patchright` binary is a different CLI.

Former wrapper configuration files, generated configs, and leases are no longer
read. Do not carry their `userDataDir` into ordinary sessions.
Retire old profiles and output only after checking ownership and retained evidence.

See the [upstream CLI guide](https://github.com/microsoft/playwright-cli#readme)
for sessions, persistent profiles, dashboard, and command details.
