'use strict';
const { test, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { legacyFolderCheck, migrateLegacyFolder, requireMigratedState } = require('../bin/lib/legacy-folder.cjs');

const created = [];
function makeTmpDir() {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-legacy-'));
  created.push(d);
  return d;
}

after(() => {
  for (const d of created) {
    try { fs.rmSync(d, { recursive: true, force: true }); } catch {}
  }
});

test('legacyFolderCheck returns none when neither folder exists', () => {
  const dir = makeTmpDir();
  const result = legacyFolderCheck(dir);
  assert.strictEqual(result.state, 'none');
});

test('legacyFolderCheck returns legacy when only .marketing exists', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.marketing'));
  const result = legacyFolderCheck(dir);
  assert.strictEqual(result.state, 'legacy');
  assert.strictEqual(result.legacyPath, path.join(dir, '.marketing'));
});

test('legacyFolderCheck returns current when only .taketomarket exists', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.taketomarket'));
  assert.strictEqual(legacyFolderCheck(dir).state, 'current');
});

test('legacyFolderCheck returns conflict when both exist', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.marketing'));
  fs.mkdirSync(path.join(dir, '.taketomarket'));
  assert.strictEqual(legacyFolderCheck(dir).state, 'conflict');
});

test('migrateLegacyFolder renames .marketing -> .taketomarket', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.marketing'));
  fs.writeFileSync(path.join(dir, '.marketing', 'STATE.md'), '# state');
  const result = migrateLegacyFolder(dir);
  assert.strictEqual(result.ok, true);
  assert.strictEqual(fs.existsSync(path.join(dir, '.marketing')), false);
  assert.strictEqual(fs.existsSync(path.join(dir, '.taketomarket', 'STATE.md')), true);
});

test('migrateLegacyFolder preserves nested directory structure', () => {
  const dir = makeTmpDir();
  const legacy = path.join(dir, '.marketing');
  fs.mkdirSync(path.join(legacy, 'CAMPAIGNS', 'spring-launch'), { recursive: true });
  fs.mkdirSync(path.join(legacy, 'PLAYBOOKS'));
  fs.writeFileSync(path.join(legacy, 'STATE.md'), '# state');
  fs.writeFileSync(path.join(legacy, 'DRIFT-LOG.md'), 'log');
  fs.writeFileSync(path.join(legacy, 'CAMPAIGNS', 'spring-launch', 'BRIEF.md'), 'brief');
  fs.writeFileSync(path.join(legacy, 'PLAYBOOKS', 'launch.md'), 'playbook');

  const result = migrateLegacyFolder(dir);
  assert.strictEqual(result.ok, true);

  const current = path.join(dir, '.taketomarket');
  assert.strictEqual(fs.existsSync(legacy), false);
  assert.strictEqual(fs.readFileSync(path.join(current, 'STATE.md'), 'utf8'), '# state');
  assert.strictEqual(fs.readFileSync(path.join(current, 'DRIFT-LOG.md'), 'utf8'), 'log');
  assert.strictEqual(fs.readFileSync(path.join(current, 'CAMPAIGNS', 'spring-launch', 'BRIEF.md'), 'utf8'), 'brief');
  assert.strictEqual(fs.readFileSync(path.join(current, 'PLAYBOOKS', 'launch.md'), 'utf8'), 'playbook');
});

test('migrateLegacyFolder refuses to overwrite existing .taketomarket', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.marketing'));
  fs.mkdirSync(path.join(dir, '.taketomarket'));
  const result = migrateLegacyFolder(dir);
  assert.strictEqual(result.ok, false);
  assert.match(result.error, /already exist/);
});

test('migrateLegacyFolder returns clear error when nothing to migrate', () => {
  const dir = makeTmpDir();
  const result = migrateLegacyFolder(dir);
  assert.strictEqual(result.ok, false);
  assert.match(result.error, /Nothing to migrate/);
  assert.match(result.error, /State: none/);
});

test('requireMigratedState ok on fresh project (state: none)', () => {
  const dir = makeTmpDir();
  const result = requireMigratedState(dir);
  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.state, 'none');
});

test('requireMigratedState ok on migrated project (state: current)', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.taketomarket'));
  const result = requireMigratedState(dir);
  assert.strictEqual(result.ok, true);
  assert.strictEqual(result.state, 'current');
});

test('requireMigratedState blocks legacy state with actionable message', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.marketing'));
  const result = requireMigratedState(dir);
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.state, 'legacy');
  assert.match(result.message, /Legacy '\.marketing\/'/);
  assert.match(result.message, /\/ttm-update/);
  assert.match(result.message, /legacy-folder migrate/);
});

test('requireMigratedState blocks conflict state with resolution guidance', () => {
  const dir = makeTmpDir();
  fs.mkdirSync(path.join(dir, '.marketing'));
  fs.mkdirSync(path.join(dir, '.taketomarket'));
  const result = requireMigratedState(dir);
  assert.strictEqual(result.ok, false);
  assert.strictEqual(result.state, 'conflict');
  assert.match(result.message, /Conflict/);
  assert.match(result.message, /diff -r/);
});
