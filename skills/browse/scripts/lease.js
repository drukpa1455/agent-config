'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync, spawnSync } = require('node:child_process');

const leaseTtl = 15 * 60 * 1000;

if (require.main === module) helper();

function actor(environment = process.env, cwd = process.cwd(), agent) {
  const directory = path.resolve(cwd);
  const explicit = environment.BROWSE_TASK_ID;
  const session = environment.CODEX_THREAD_ID || environment.CODEX_SESSION_ID;
  const processAgent = explicit || session ? null
    : agent === undefined ? agentProcess() : agent;
  const origin = explicit ? null : session ? `session:${session}`
    : processAgent;
  if (!explicit && !origin)
    throw new Error('No unique browser task identity; set BROWSE_TASK_ID.');
  const source = explicit ? `task:${explicit}` : `${origin}\0${directory}`;
  const key = crypto.createHash('sha256').update(source).digest('hex').slice(0, 16);
  const context = explicit || `${short(origin, 20)}@${path.basename(directory) || '/'}`;
  return { owner: `task-${key}`, key, task: short(context, 80), cwd: directory };
}

function claim(file, label, owner) {
  return transact(file, { action: 'claim', label, owner });
}

function own(file, label, owner) {
  return transact(file, { action: 'own', label, owner });
}

function keep(file, label, owner, operation, onError, interval = leaseTtl / 3) {
  let timer;
  let stopped = false;
  const touch = () => {
    try {
      renew(file, label, owner, operation);
      schedule(interval);
    } catch (error) {
      if (error.code === 'BROWSE_LEASE_LOCKED') schedule(Math.min(interval, 1000));
      else {
        stopped = true;
        onError(error);
      }
    }
  };
  const schedule = delay => {
    if (stopped) return;
    timer = setTimeout(touch, delay);
    timer.unref();
  };
  schedule(interval);
  return () => {
    stopped = true;
    clearTimeout(timer);
  };
}

function finish(file, owner, operation) {
  transact(file, { action: 'finish', operation, owner });
}

function release(file, owner, operation) {
  transact(file, { action: 'release', operation, owner });
}

function renew(file, label, owner, operation) {
  return transact(file, { action: 'renew', label, operation, owner });
}

function transact(file, request) {
  if (!path.isAbsolute(file)) throw new Error(`Browser lease path must be absolute: ${file}`);
  const lock = `${file}.lock`;
  prepareLock(lock);
  const [command, prefix] = locker(lock);
  const result = spawnSync(command, [...prefix, process.execPath, __filename, 'apply'], {
    input: JSON.stringify({ ...request, file }),
    encoding: 'utf8',
    timeout: 2000,
    maxBuffer: 1024 * 1024,
  });
  if (result.error) throw result.error;

  let response;
  try {
    response = JSON.parse(result.stdout);
  } catch {
  }
  if (response?.error) throw new Error(response.error);
  if (result.status !== 0) throw locked(file);
  return response?.value;
}

function locked(file) {
  const error = new Error(`Browser lease ${file} is changing; retry the command.`);
  error.code = 'BROWSE_LEASE_LOCKED';
  return error;
}

function prepareLock(lock) {
  fs.mkdirSync(path.dirname(lock), { recursive: true, mode: 0o700 });
  const descriptor = fs.openSync(lock, 'a', 0o600);
  fs.closeSync(descriptor);
  fs.chmodSync(lock, 0o600);
}

function locker(lock) {
  if (process.platform === 'darwin' && fs.existsSync('/usr/bin/lockf'))
    return ['/usr/bin/lockf', ['-s', '-t', '1', '-k', lock]];
  const flock = executable('flock');
  if (flock) return [flock, ['-w', '1', lock]];
  throw new Error('Browser leases require lockf or flock');
}

function executable(name) {
  for (const directory of (process.env.PATH || '').split(path.delimiter)) {
    const file = path.resolve(directory || '.', name);
    try {
      fs.accessSync(file, fs.constants.X_OK);
      return file;
    } catch {
    }
  }
}

function helper() {
  try {
    const request = JSON.parse(fs.readFileSync(0, 'utf8'));
    process.stdout.write(JSON.stringify({ value: apply(request) }));
  } catch (error) {
    process.stdout.write(JSON.stringify({ error: error.message }));
    process.exitCode = 2;
  }
}

function apply(request) {
  if (request.action === 'claim') return claimLease(request);
  if (request.action === 'own') return ownLease(request);
  if (request.action === 'renew') return renewLease(request);
  if (request.action === 'finish') return finishLease(request);
  if (request.action === 'release') return releaseLease(request);
  throw new Error(`Unknown browser lease action: ${request.action}`);
}

function claimLease({ file, label, owner }) {
  const now = Date.now();
  const current = read(file);
  if (current && current.owner !== owner.owner && current.expiresAt > now)
    throw new Error(busy(label, current));

  const owned = current?.owner === owner.owner && current.expiresAt > now;
  if (owned) ensureIdle(label, current, now);
  const retainedAt = owned && Number.isFinite(current.acquiredAt) ? current.acquiredAt : now;
  const operation = crypto.randomUUID();
  const next = record(owner, retainedAt, now, operation);
  write(file, next);
  return { acquired: !owned, operation };
}

function ownLease({ file, label, owner }) {
  const now = Date.now();
  const current = read(file);
  if (!current) throw new Error(`${label} has no task lease; run open first.`);
  if (current.expiresAt <= now)
    throw new Error(`${label} has an expired lease; run open to reclaim it.`);
  if (current.owner !== owner.owner) throw new Error(busy(label, current));

  ensureIdle(label, current, now);
  const operation = crypto.randomUUID();
  const next = record(owner, current.acquiredAt, now, operation);
  write(file, next);
  return { acquired: false, operation };
}

function renewLease({ file, label, operation, owner }) {
  const now = Date.now();
  const current = read(file);
  if (!matches(current, owner, operation))
    throw new Error(`${label} command no longer owns its operation lease.`);
  const next = record(owner, current.acquiredAt, now, operation);
  write(file, next);
  return next;
}

function finishLease({ file, operation, owner }) {
  const current = read(file);
  if (!matches(current, owner, operation)) return;
  write(file, { ...current, operation: null, operationExpiresAt: null });
}

function releaseLease({ file, operation, owner }) {
  if (matches(read(file), owner, operation)) fs.rmSync(file, { force: true });
}

function record(owner, acquiredAt, now, operation) {
  return {
    version: 1,
    owner: owner.owner,
    task: owner.task,
    cwd: owner.cwd,
    acquiredAt,
    touchedAt: now,
    expiresAt: now + leaseTtl,
    operation,
    operationExpiresAt: now + leaseTtl,
  };
}

function ensureIdle(label, current, now) {
  if (current.operation && current.operationExpiresAt > now) {
    const expiry = new Date(current.operationExpiresAt).toISOString();
    throw new Error(`${label} already has an active command from this task until ${expiry}; retry after it finishes.`);
  }
}

function matches(current, owner, operation) {
  return current?.owner === owner.owner && current.operation === operation;
}

function busy(label, current) {
  const expiry = new Date(current.expiresAt).toISOString();
  return `${label} is leased by ${current.task} in ${current.cwd} until ${expiry}; retry after release or expiry.`;
}

function read(file) {
  let value;
  try {
    value = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    if (error instanceof SyntaxError)
      throw new Error(`Invalid browser lease ${file}: ${error.message}`);
    throw error;
  }
  if (!valid(value)) throw new Error(`Invalid browser lease ${file}: unexpected record shape`);
  return value;
}

function valid(value) {
  return value?.version === 1 &&
    typeof value.owner === 'string' && value.owner.length > 0 &&
    typeof value.task === 'string' &&
    typeof value.cwd === 'string' && path.isAbsolute(value.cwd) &&
    [value.acquiredAt, value.touchedAt, value.expiresAt].every(Number.isFinite) &&
    ((value.operation === null && value.operationExpiresAt === null) ||
      (typeof value.operation === 'string' && value.operation.length > 0 &&
        Number.isFinite(value.operationExpiresAt)));
}

function write(file, value) {
  const temporary = `${file}.${process.pid}.${crypto.randomUUID()}`;
  try {
    fs.writeFileSync(temporary, `${JSON.stringify(value, null, 2)}\n`, { flag: 'wx', mode: 0o600 });
    fs.renameSync(temporary, file);
    fs.chmodSync(file, 0o600);
  } finally {
    fs.rmSync(temporary, { force: true });
  }
}

function agentProcess() {
  try {
    for (let pid = process.ppid, depth = 0; pid && depth < 12; depth += 1) {
      const current = processInfo(pid);
      if (!current) break;
      if (isAgent(current.command)) return `agent:${pid}:${current.started}`;
      pid = current.parent;
    }
  } catch {
  }
  return null;
}

function processInfo(pid) {
  const line = execFileSync('ps', ['-o', 'ppid=,lstart=,command=', '-p', String(pid)], {
    encoding: 'utf8', timeout: 1000, maxBuffer: 64 * 1024,
  }).trim();
  const match = line.match(/^(\d+)\s+((?:\S+\s+){4}\S+)\s+(.+)$/);
  return match && { parent: Number(match[1]), started: match[2], command: match[3] };
}

function isAgent(command) {
  return /(?:^|[\s/])(?:claude|codex)(?:\s|$)/i.test(command) ||
    command.includes('pi-coding-agent');
}

function short(value, limit = 12) {
  return String(value).slice(0, limit);
}

module.exports = { actor, claim, finish, keep, own, release };
