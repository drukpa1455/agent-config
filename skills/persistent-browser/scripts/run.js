#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

const mode = process.argv[2];
const args = process.argv.slice(3);
const settings = loadSettings();
const paths = resolvePaths(settings);

prepare(paths);

if (mode === 'official') {
  launch(paths.officialCli, args, paths, {
    PLAYWRIGHT_CLI_SESSION: 'persistent-official',
    PLAYWRIGHT_MCP_CONFIG: paths.officialConfig,
  });
} else if (mode === 'patchright') {
  launch(process.execPath, [path.join(__dirname, 'patchright-cli.js'), ...args], paths, {
    PERSISTENT_BROWSER_RUNTIME: paths.patchrightRuntime,
    PLAYWRIGHT_CLI_SESSION: 'persistent-patchright',
    PLAYWRIGHT_MCP_CONFIG: paths.patchrightConfig,
  });
} else if (mode === 'dashboard') {
  launch(paths.officialCli, ['show', ...args], paths, { PLAYWRIGHT_CLI_SESSION: null });
} else if (mode === 'setup') {
  setup(paths, args);
} else {
  fail(`Unknown mode: ${mode || '(missing)'}`);
}

function loadSettings() {
  const file = process.env.PERSISTENT_BROWSER_CONFIG ||
    path.join(os.homedir(), '.config', 'persistent-browser', 'config.json');
  if (!fs.existsSync(file)) return {};

  let value;
  try {
    value = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`Invalid configuration ${file}: ${error.message}`);
  }
  if (!value || Array.isArray(value) || typeof value !== 'object')
    fail(`Configuration must be a JSON object: ${file}`);
  return value;
}

function resolvePaths(settings) {
  const home = os.homedir();
  const dataDir = setting('dataDir', 'PERSISTENT_BROWSER_DATA_DIR',
    path.join(home, '.local', 'share', 'persistent-browser'));
  const outputDir = setting('outputDir', 'PERSISTENT_BROWSER_OUTPUT_DIR',
    path.join(home, '.cache', 'persistent-browser'));
  const runtimeDir = setting('runtimeDir', 'PERSISTENT_BROWSER_RUNTIME_DIR',
    path.join(dataDir, 'runtime'));

  return {
    dataDir,
    outputDir,
    runtimeDir,
    officialCli: setting('officialCli', 'PERSISTENT_BROWSER_OFFICIAL_CLI',
      path.join(runtimeDir, 'node_modules', '.bin', 'playwright-cli')),
    patchrightRuntime: setting('patchrightRuntime', 'PERSISTENT_BROWSER_PATCHRIGHT_RUNTIME', runtimeDir),
    officialProfile: setting('officialProfile', 'PERSISTENT_BROWSER_OFFICIAL_PROFILE',
      path.join(dataDir, 'official-profile')),
    patchrightProfile: setting('patchrightProfile', 'PERSISTENT_BROWSER_PATCHRIGHT_PROFILE',
      path.join(dataDir, 'patchright-profile')),
    workspace: path.join(dataDir, 'workspace'),
    configDir: path.join(dataDir, 'config'),
    officialConfig: path.join(dataDir, 'config', 'official.json'),
    patchrightConfig: path.join(dataDir, 'config', 'patchright.json'),
  };

  function setting(key, environment, fallback) {
    const value = process.env[environment] || settings[key] || fallback;
    if (typeof value !== 'string' || !path.isAbsolute(value))
      fail(`${key} must be an absolute path`);
    return value;
  }
}

function prepare(paths) {
  const directories = [
    paths.dataDir,
    paths.outputDir,
    paths.officialProfile,
    paths.patchrightProfile,
    paths.workspace,
    path.join(paths.workspace, '.playwright'),
    paths.configDir,
    path.join(paths.outputDir, 'official', 'downloads'),
    path.join(paths.outputDir, 'patchright', 'downloads'),
  ];
  for (const directory of directories) {
    fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
    fs.chmodSync(directory, 0o700);
  }

  writeJson(paths.officialConfig, browserConfig(
    paths.officialProfile,
    path.join(paths.outputDir, 'official'),
    'chrome-for-testing',
  ));
  writeJson(paths.patchrightConfig, browserConfig(
    paths.patchrightProfile,
    path.join(paths.outputDir, 'patchright'),
    'chrome',
  ));
}

function browserConfig(profile, outputDir, channel) {
  return {
    browser: {
      browserName: 'chromium',
      userDataDir: profile,
      launchOptions: {
        channel,
        headless: false,
        downloadsPath: path.join(outputDir, 'downloads'),
      },
    },
    outputDir,
    outputMode: 'stdout',
    allowUnrestrictedFileAccess: false,
    timeouts: { action: 5000, navigation: 60000 },
  };
}

function writeJson(file, value) {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content)
    fs.writeFileSync(file, content, { mode: 0o600 });
  fs.chmodSync(file, 0o600);
}

function setup(paths, setupArgs) {
  const allowed = new Set(['--no-browser-download']);
  const unknown = setupArgs.filter(arg => !allowed.has(arg));
  if (unknown.length) fail(`Unknown setup option: ${unknown.join(', ')}`);
  if (Number(process.versions.node.split('.')[0]) < 20)
    fail(`Node.js 20+ is required; found ${process.versions.node}`);
  if (!hasStableChrome())
    fail('Stable Google Chrome is required for Patchright. Install it, then rerun setup.');

  const source = path.join(__dirname, '..', 'runtime');
  fs.mkdirSync(paths.runtimeDir, { recursive: true, mode: 0o700 });
  fs.chmodSync(paths.runtimeDir, 0o700);
  for (const file of ['package.json', 'package-lock.json'])
    fs.copyFileSync(path.join(source, file), path.join(paths.runtimeDir, file));

  run('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], paths.runtimeDir);
  if (!setupArgs.includes('--no-browser-download'))
    run(paths.officialCli, ['install-browser', 'chrome-for-testing', '--no-shell'], paths.workspace);

  console.log('persistent-browser: setup complete');
}

function hasStableChrome() {
  if (process.platform === 'darwin')
    return fs.existsSync('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome');
  if (process.platform === 'linux')
    return ['google-chrome', 'google-chrome-stable'].some(onPath);
  return false;
}

function onPath(command) {
  return (process.env.PATH || '').split(path.delimiter)
    .some(directory => fs.existsSync(path.join(directory, command)));
}

function run(command, commandArgs, cwd) {
  const result = spawnSync(command, commandArgs, { cwd, stdio: 'inherit' });
  if (result.error) fail(result.error.message);
  if (result.status !== 0) fail(`${command} exited with status ${result.status}`);
}

function launch(command, commandArgs, paths, additions) {
  if (!fs.existsSync(command))
    fail(`Runtime missing: ${command}\nRun scripts/setup after explicit download approval.`);

  const env = { ...process.env, NO_UPDATE_NOTIFIER: '1' };
  for (const [key, value] of Object.entries(additions)) {
    if (value === null) delete env[key];
    else env[key] = value;
  }

  const child = spawn(command, commandArgs, {
    cwd: paths.workspace,
    env,
    stdio: 'inherit',
  });
  child.on('error', error => fail(error.message));
  child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exit(code ?? 1);
  });
  for (const signal of ['SIGINT', 'SIGTERM'])
    process.on(signal, () => child.kill(signal));
}

function fail(message) {
  console.error(`persistent-browser: ${message}`);
  process.exit(1);
}
