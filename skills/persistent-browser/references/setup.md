# Setup

Setup requires Node.js 20+, npm, and stable Google Chrome. It downloads exact npm dependencies and the official Chrome for Testing build into user-local storage:

```sh
$SKILL_DIR/scripts/setup
```

Default local paths:

- state and profiles: `~/.local/share/persistent-browser/`
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

Never put profiles, cookies, storage state, credentials, screenshots, traces, downloads, or generated configuration in the skill repository.
