'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

function resolve() {
  const settings = loadSettings();
  const home = os.homedir();
  const dataDir = setting(settings, 'dataDir', 'PERSISTENT_BROWSER_DATA_DIR',
    path.join(home, '.local', 'share', 'persistent-browser'));
  const outputDir = setting(settings, 'outputDir', 'PERSISTENT_BROWSER_OUTPUT_DIR',
    path.join(home, '.cache', 'persistent-browser'));
  const runtimeDir = setting(settings, 'runtimeDir', 'PERSISTENT_BROWSER_RUNTIME_DIR',
    path.join(dataDir, 'runtime'));

  return {
    dataDir,
    outputDir,
    runtimeDir,
    officialCli: setting(settings, 'officialCli', 'PERSISTENT_BROWSER_OFFICIAL_CLI',
      path.join(runtimeDir, 'node_modules', '.bin', 'playwright-cli')),
    patchrightRuntime: setting(settings, 'patchrightRuntime', 'PERSISTENT_BROWSER_PATCHRIGHT_RUNTIME', runtimeDir),
    officialProfile: setting(settings, 'officialProfile', 'PERSISTENT_BROWSER_OFFICIAL_PROFILE',
      path.join(dataDir, 'official-profile')),
    patchrightProfile: setting(settings, 'patchrightProfile', 'PERSISTENT_BROWSER_PATCHRIGHT_PROFILE',
      path.join(dataDir, 'patchright-profile')),
    workspace: path.join(dataDir, 'workspace'),
  };
}

function official(paths) {
  return route(
    'persistent-official',
    paths.officialProfile,
    paths.workspace,
    path.join(paths.dataDir, 'config', 'official.json'),
    path.join(paths.outputDir, 'official'),
    'chrome-for-testing',
  );
}

function patchright(paths) {
  return route(
    'persistent-patchright',
    paths.patchrightProfile,
    paths.workspace,
    path.join(paths.dataDir, 'config', 'patchright.json'),
    path.join(paths.outputDir, 'patchright'),
    'chrome',
  );
}

function task(paths, key) {
  if (!/^[a-f0-9]{16}$/.test(key)) throw new Error(`Invalid browser task key: ${key}`);
  const data = path.join(paths.dataDir, 'tasks', key);
  const output = path.join(paths.outputDir, 'tasks', key);
  return {
    ...route(
      `task-official-${key}`,
      path.join(data, 'profile'),
      path.join(data, 'workspace'),
      path.join(data, 'config.json'),
      output,
      'chrome-for-testing',
    ),
    transient: { data, output },
  };
}

function route(session, profile, workspace, config, output, channel) {
  return { session, profile, workspace, config, output, channel };
}

function prepare(route) {
  const directories = [
    route.profile,
    path.dirname(route.config),
    route.output,
    path.join(route.output, 'downloads'),
  ];
  for (const directory of directories) secure(directory);
  prepareRoute(route);
  writeJson(route.config, browserConfig(route));
}

function prepareWorkspace(paths) {
  secure(paths.dataDir);
  prepareRoute({ workspace: paths.workspace });
}

function prepareRoute(route) {
  secure(route.workspace);
  secure(path.join(route.workspace, '.playwright'));
}

function prepareSetup(paths) {
  secure(paths.runtimeDir);
  prepareWorkspace(paths);
  prepare(official(paths));
  prepare(patchright(paths));
}

function remove(route) {
  if (!route.transient) throw new Error('Refusing to remove a persistent browser route');
  fs.rmSync(route.transient.data, { recursive: true, force: true });
  fs.rmSync(route.transient.output, { recursive: true, force: true });
}

function browserConfig(route) {
  return {
    browser: {
      browserName: 'chromium',
      userDataDir: route.profile,
      launchOptions: {
        channel: route.channel,
        headless: false,
        downloadsPath: path.join(route.output, 'downloads'),
      },
    },
    outputDir: route.output,
    outputMode: 'stdout',
    allowUnrestrictedFileAccess: false,
    timeouts: { action: 5000, navigation: 60000 },
  };
}

function loadSettings() {
  const file = process.env.PERSISTENT_BROWSER_CONFIG ||
    path.join(os.homedir(), '.config', 'persistent-browser', 'config.json');
  if (!fs.existsSync(file)) return {};

  let value;
  try {
    value = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    throw new Error(`Invalid configuration ${file}: ${error.message}`);
  }
  if (!value || Array.isArray(value) || typeof value !== 'object')
    throw new Error(`Configuration must be a JSON object: ${file}`);
  return value;
}

function setting(settings, key, environment, fallback) {
  const value = process.env[environment] || settings[key] || fallback;
  if (typeof value !== 'string' || !path.isAbsolute(value))
    throw new Error(`${key} must be an absolute path`);
  return value;
}

function secure(directory) {
  fs.mkdirSync(directory, { recursive: true, mode: 0o700 });
  fs.chmodSync(directory, 0o700);
}

function writeJson(file, value) {
  const content = `${JSON.stringify(value, null, 2)}\n`;
  if (!fs.existsSync(file) || fs.readFileSync(file, 'utf8') !== content)
    fs.writeFileSync(file, content, { mode: 0o600 });
  fs.chmodSync(file, 0o600);
}

module.exports = {
  official, patchright, prepare, prepareRoute, prepareSetup, prepareWorkspace, remove, resolve, task,
};
