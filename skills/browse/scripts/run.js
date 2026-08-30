#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');
const leases = require('./lease');
const state = require('./state');

const valueOptions = new Set([
  '--body', '--browser', '--cdp', '--config', '--content-type', '--cursor', '--data', '--depth',
  '--description', '--device', '--domain', '--duration', '--endpoint', '--expires', '--extension',
  '--filename', '--filter', '--header', '--host', '--modifiers', '--path', '--port', '--position',
  '--profile', '--regex', '--remove-header', '--sameSite', '--session', '--size', '--skills',
  '--status', '--style',
]);
const booleanOptions = new Set([
  '--all', '--annotate', '--boxes', '--clear', '--dry-run', '--force', '--full-page', '--headed',
  '--help', '--hide', '--hires', '--httpOnly', '--json', '--kill', '--list', '--mobile',
  '--no-shell', '--only-shell', '--persistent', '--raw', '--secure', '--static', '--submit',
  '--version', '--with-deps',
]);

try {
  main(process.argv[2], process.argv.slice(3));
} catch (error) {
  fail(error.message);
}

function main(mode, args) {
  const paths = state.resolve();
  if (mode === 'official') official(paths, args);
  else if (mode === 'patchright') patchright(paths, args);
  else if (mode === 'dashboard') dashboard(paths, args);
  else if (mode === 'setup') setup(paths, args);
  else throw new Error(`Unknown mode: ${mode || '(missing)'}`);
}

function official(paths, rawArgs) {
  const shared = rawArgs[0] === '--shared';
  if (!shared && rawArgs.includes('--shared'))
    throw new Error('--shared must precede the browser command');

  const args = shared ? rawArgs.slice(1) : rawArgs;
  const owner = leases.actor();
  const route = shared ? state.official(paths) : state.task(paths, owner.key);
  const file = shared ? path.join(paths.dataDir, 'leases', 'official.json') : null;
  execute(paths.officialCli, args, paths, route, owner, file);
}

function patchright(paths, args) {
  const owner = leases.actor();
  const route = state.patchright(paths);
  const command = process.execPath;
  const commandArgs = [path.join(__dirname, 'patchright-cli.js'), ...args];
  const additions = { PERSISTENT_BROWSER_RUNTIME: paths.patchrightRuntime };
  const file = path.join(paths.dataDir, 'leases', 'patchright.json');
  execute(command, commandArgs, paths, route, owner, file, additions, args);
}

function execute(command, commandArgs, paths, route, owner, leaseFile, additions = {}, logicalArgs = commandArgs) {
  requireRuntime(command);
  rejectRouteOverrides(logicalArgs);
  rejectUnknownLeadingOptions(logicalArgs);
  const action = findAction(logicalArgs);
  if (action === 'attach') throw new Error('attach bypasses the browser route owned by this wrapper');
  const diagnostic = isDiagnostic(logicalArgs, action);
  if (action === 'kill-all' && !diagnostic)
    throw new Error('kill-all crosses browser task ownership; close each selected route instead');
  const terminal = ['close', 'close-all', 'delete-data'].includes(action);
  const cleanup = terminal && !diagnostic;
  const globalDiagnostic = diagnostic && route.transient && !['list', 'show'].includes(action);
  if (globalDiagnostic) state.prepareWorkspace(paths);
  else if (diagnostic && route.transient) state.prepareRoute(route);
  else state.prepare(route);

  let commandLease;
  if (leaseFile && !diagnostic) {
    if (action === 'open') {
      commandLease = leases.claim(leaseFile, label(route), owner);
    } else {
      commandLease = leases.own(leaseFile, label(route), owner);
    }
  }

  const environment = {
    ...additions,
    PLAYWRIGHT_CLI_SESSION: route.session,
    PLAYWRIGHT_MCP_CONFIG: route.config,
  };
  const maintain = leaseFile && !diagnostic
    ? onError => leases.keep(leaseFile, label(route), owner, commandLease.operation, onError)
    : null;
  const cwd = globalDiagnostic ? paths.workspace : route.workspace;
  const invocation = normalize(commandArgs, action, route, cleanup);
  launch(command, invocation, cwd, environment, outcome => {
    if (commandLease) {
      if ((outcome.ok && cleanup) || (!outcome.ok && commandLease.acquired))
        leases.release(leaseFile, owner, commandLease.operation);
      else leases.finish(leaseFile, owner, commandLease.operation);
    }
    if (!leaseFile && outcome.ok && cleanup) {
      state.remove(route);
    }
  }, maintain);
}

function normalize(args, action, route, cleanup) {
  if (!cleanup) return args;
  if (route.transient) return replaceAction(args, action, 'delete-data');
  if (action === 'close-all') return replaceAction(args, action, 'close');
  return args;
}

function replaceAction(args, action, replacement) {
  const result = [...args];
  result[result.indexOf(action)] = replacement;
  return result;
}

function label(route) {
  return route.session === 'persistent-patchright'
    ? 'Patchright authenticated browser'
    : 'Official authenticated browser';
}

function rejectRouteOverrides(args) {
  const long = ['--browser', '--config', '--persistent', '--profile', '--session'];
  const override = optionArgs(args).find(argument =>
    long.some(flag =>
      argument === flag ||
      argument === `--no-${flag.slice(2)}` ||
      argument.startsWith(`${flag}=`)) ||
    /^-[^-]*s/.test(argument));
  if (override)
    throw new Error(`${override.split('=')[0]} overrides the browser route owned by this wrapper`);
}

function findAction(args) {
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--') return args[index + 1];
    if (!argument.startsWith('-')) return argument;
    if (takesValue(argument, args[index + 1])) index += 1;
  }
}

function rejectUnknownLeadingOptions(args) {
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--' || !argument.startsWith('-')) return;
    if (!knownOption(argument))
      throw new Error(`Unknown browser option before command: ${argument.split('=', 1)[0]}`);
    if (takesValue(argument, args[index + 1])) index += 1;
  }
}

function knownOption(argument) {
  const option = argument.split('=', 1)[0];
  if (/^-[hv]+$/.test(option)) return true;
  if (valueOptions.has(option) || booleanOptions.has(option)) return true;
  if (option.startsWith('--no-')) return booleanOptions.has(`--${option.slice(5)}`);
  return false;
}

function takesValue(argument, next) {
  const option = argument.split('=', 1)[0];
  return valueOptions.has(option) && !argument.includes('=') &&
    next !== undefined && next !== '--' && !next.startsWith('-');
}

function isDiagnostic(args, action) {
  const options = optionArgs(args);
  const names = options.map(argument => argument.split('=', 1)[0]);
  if (!action || names.includes('--help') || names.includes('--version') ||
    names.some(option => /^-[hv]+$/.test(option))) return true;
  return action === 'list' || (action === 'show' && !options.includes('--annotate'));
}

function optionArgs(args) {
  const separator = args.indexOf('--');
  return separator < 0 ? args : args.slice(0, separator);
}

function dashboard(paths, args) {
  rejectRouteOverrides(args);
  if (optionArgs(args).includes('--annotate'))
    throw new Error('annotate requires the selected browser route and its task lease');
  // Playwright's registry spans workspaces; one stable cwd keeps one dashboard daemon.
  state.prepareWorkspace(paths);
  launch(paths.officialCli, ['show', ...args], paths.workspace, {
    PLAYWRIGHT_CLI_SESSION: null,
  }, () => {});
}

function setup(paths, setupArgs) {
  const allowed = new Set(['--no-browser-download']);
  const unknown = setupArgs.filter(argument => !allowed.has(argument));
  if (unknown.length) throw new Error(`Unknown setup option: ${unknown.join(', ')}`);
  if (Number(process.versions.node.split('.')[0]) < 20)
    throw new Error(`Node.js 20+ is required; found ${process.versions.node}`);
  if (!hasStableChrome())
    throw new Error('Stable Google Chrome is required for Patchright. Install it, then rerun setup.');

  state.prepareSetup(paths);
  const source = path.join(__dirname, '..', 'runtime');
  for (const file of ['package.json', 'package-lock.json'])
    fs.copyFileSync(path.join(source, file), path.join(paths.runtimeDir, file));

  run('npm', ['ci', '--ignore-scripts', '--no-audit', '--no-fund'], paths.runtimeDir);
  if (!setupArgs.includes('--no-browser-download'))
    run(paths.officialCli, ['install-browser', 'chrome-for-testing', '--no-shell'], paths.workspace);

  console.log('browse: setup complete');
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

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} exited with status ${result.status}`);
}

function requireRuntime(command) {
  if (!fs.existsSync(command))
    throw new Error(`Runtime missing: ${command}\nRead references/setup.md, disclose its downloads, then run scripts/setup.`);
}

function launch(command, args, cwd, additions, after, maintain) {
  requireRuntime(command);
  const env = childEnvironment(additions);
  const child = spawn(command, args, { cwd, env, stdio: 'inherit' });
  let finished = false;
  const stopMaintaining = maintain
    ? maintain(error => {
      child.kill('SIGTERM');
      finish({ ok: false, error });
    })
    : () => {};
  const handlers = new Map();
  child.once('error', error => finish({ ok: false, error }));
  child.once('exit', (code, signal) => finish({ ok: !signal && code === 0, code, signal }));
  for (const signal of ['SIGINT', 'SIGTERM']) {
    const handler = () => child.kill(signal);
    handlers.set(signal, handler);
    process.on(signal, handler);
  }

  function finish(outcome) {
    if (finished) return;
    finished = true;
    stopMaintaining();
    for (const [signal, handler] of handlers)
      process.removeListener(signal, handler);
    try {
      after(outcome);
    } catch (error) {
      fail(error.message);
    }
    if (outcome.error) fail(outcome.error.message);
    if (outcome.signal) process.kill(process.pid, outcome.signal);
    else process.exit(outcome.code ?? 1);
  }
}

function childEnvironment(additions) {
  const env = { ...process.env, NO_UPDATE_NOTIFIER: '1' };
  for (const [key, value] of Object.entries(additions)) {
    if (value === null) delete env[key];
    else env[key] = value;
  }
  return env;
}

function fail(message) {
  console.error(`browse: ${message}`);
  process.exit(1);
}
