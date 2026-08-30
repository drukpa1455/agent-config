# Setup

Setup requires Node.js 20+, npm, stable Google Chrome, and the platform's file
lock utility (`lockf` on macOS or `flock` on Linux). It downloads exact npm
dependencies and the official Chrome for Testing build into user-local storage:

```sh
$SKILL_DIR/scripts/setup
```

Default local paths, retained across the skill rename so existing profiles keep
their identity:

- persistent profiles and leases: `~/.local/share/persistent-browser/`
- disposable task profiles: `~/.local/share/persistent-browser/tasks/`
- disposable output: `~/.cache/persistent-browser/`
- optional overrides: `~/.config/persistent-browser/config.json`

The optional JSON configuration accepts these absolute paths:

```json
{
  "dataDir": "/path/to/state",
  "outputDir": "/path/to/output",
  "runtimeDir": "/path/to/runtime",
  "officialCli": "/path/to/playwright-cli",
  "patchrightRuntime": "/path/to/patchright-runtime",
  "officialProfile": "/path/to/official-profile",
  "patchrightProfile": "/path/to/patchright-profile"
}
```

Environment variables override JSON: `PERSISTENT_BROWSER_DATA_DIR`, `PERSISTENT_BROWSER_OUTPUT_DIR`, `PERSISTENT_BROWSER_RUNTIME_DIR`, `PERSISTENT_BROWSER_OFFICIAL_CLI`, `PERSISTENT_BROWSER_PATCHRIGHT_RUNTIME`, `PERSISTENT_BROWSER_OFFICIAL_PROFILE`, and `PERSISTENT_BROWSER_PATCHRIGHT_PROFILE`.

Task identity comes from `BROWSE_TASK_ID` when set. Otherwise the wrapper
derives it from the Codex thread or owning Pi/Claude/Codex process, plus the
working directory. Set `BROWSE_TASK_ID` explicitly when one task must issue
commands from multiple directories or a restricted harness exposes neither
identifier. Shared-profile leases expire after 15 minutes without an owner
command or active-command keepalive and can then be reclaimed with `open`.

Never put profiles, cookies, storage state, credentials, screenshots, traces, downloads, or generated configuration in the skill repository.
