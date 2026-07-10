#!/usr/bin/env node
'use strict';

const path = require('node:path');

const runtime = process.env.PERSISTENT_BROWSER_RUNTIME;
if (!runtime) fail('PERSISTENT_BROWSER_RUNTIME is not set');

let program;
let version;
try {
  ({ program } = require(path.join(runtime, 'node_modules', 'patchright-core', 'lib', 'tools', 'cli-client', 'program')));
  ({ version } = require(path.join(runtime, 'node_modules', 'patchright-core', 'package.json')));
} catch (error) {
  fail(`Patchright runtime missing under ${runtime}: ${error.message}`);
}

program({ embedderVersion: version }).catch(error => fail(error.message));

function fail(message) {
  console.error(`persistent-browser: ${message}`);
  process.exit(1);
}
