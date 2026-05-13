'use strict';

const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { createTempDir } = require('./helpers.cjs');

const install = require('../install.js');

describe('install.js module exports', () => {
  it('can be required without triggering install', () => {
    assert.ok(install, 'module exports a truthy object');
  });

  it('exports all expected functions', () => {
    const expectedFns = [
      'detectRuntime',
      'validateInstall',
      'copyDirSync',
      'dirExists',
      'fileExists',
      'printResults',
    ];
    for (const fn of expectedFns) {
      assert.strictEqual(typeof install[fn], 'function', `exports.${fn} is a function`);
    }
  });

  it('exports DIRS_TO_COPY as a non-empty array', () => {
    assert.ok(Array.isArray(install.DIRS_TO_COPY), 'DIRS_TO_COPY is an array');
    assert.ok(install.DIRS_TO_COPY.length > 0, 'DIRS_TO_COPY is not empty');
  });

  it('exports FILES_TO_COPY as a non-empty array', () => {
    assert.ok(Array.isArray(install.FILES_TO_COPY), 'FILES_TO_COPY is an array');
    assert.ok(install.FILES_TO_COPY.length > 0, 'FILES_TO_COPY is not empty');
  });
});

describe('install.js dirExists', () => {
  let tmp;

  before(() => {
    tmp = createTempDir();
  });

  after(() => {
    tmp.cleanup();
  });

  it('returns true for an existing directory', () => {
    assert.strictEqual(install.dirExists(tmp.dir), true);
  });

  it('returns false for a non-existent path', () => {
    assert.strictEqual(install.dirExists(path.join(tmp.dir, 'nope')), false);
  });
});

describe('install.js fileExists', () => {
  let tmp;
  let testFile;

  before(() => {
    tmp = createTempDir();
    testFile = path.join(tmp.dir, 'test-file.txt');
    fs.writeFileSync(testFile, 'hello');
  });

  after(() => {
    tmp.cleanup();
  });

  it('returns true for an existing file', () => {
    assert.strictEqual(install.fileExists(testFile), true);
  });

  it('returns false for a non-existent path', () => {
    assert.strictEqual(install.fileExists(path.join(tmp.dir, 'nope.txt')), false);
  });
});

describe('registerPlugin', () => {
  let tmp;

  before(() => { tmp = createTempDir(); });
  after(() => { tmp.cleanup(); });

  it('creates installed_plugins.json with correct structure', () => {
    const installPath = path.join(tmp.dir, 'plugin');
    const homeDir = tmp.dir;
    install.registerPlugin(installPath, '2.0.0', homeDir);

    const registryPath = path.join(homeDir, '.claude', 'plugins', 'installed_plugins.json');
    assert.ok(install.fileExists(registryPath), 'registry file created');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    assert.strictEqual(registry.version, 2, 'root version is 2');
    assert.ok(registry.plugins, 'has plugins object');
    const entry = registry.plugins['taketomarket@npm'];
    assert.ok(Array.isArray(entry) && entry.length === 1, 'entry is array of 1');
    assert.strictEqual(entry[0].scope, 'user');
    assert.strictEqual(entry[0].installPath, installPath);
    assert.strictEqual(entry[0].version, '2.0.0');
    assert.ok(entry[0].installedAt, 'installedAt set');
    assert.ok(entry[0].lastUpdated, 'lastUpdated set');
  });

  it('preserves existing plugins when upserting taketomarket entry', () => {
    const homeDir2 = path.join(tmp.dir, 'home2');
    fs.mkdirSync(path.join(homeDir2, '.claude', 'plugins'), { recursive: true });
    const registryPath = path.join(homeDir2, '.claude', 'plugins', 'installed_plugins.json');
    fs.writeFileSync(registryPath, JSON.stringify({
      version: 2,
      plugins: {
        'other-plugin@npm': [{ scope: 'user', installPath: '/some/path', version: '1.0.0',
          installedAt: '2026-01-01T00:00:00.000Z', lastUpdated: '2026-01-01T00:00:00.000Z', gitCommitSha: null }],
      },
    }));

    install.registerPlugin('/new/path', '2.0.0', homeDir2);
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    assert.ok(registry.plugins['other-plugin@npm'], 'existing plugin preserved');
    assert.ok(registry.plugins['taketomarket@npm'], 'new entry added');
  });

  it('preserves installedAt but updates lastUpdated on reinstall', () => {
    const homeDir3 = path.join(tmp.dir, 'home3');
    const installPath = path.join(homeDir3, 'plugin');
    install.registerPlugin(installPath, '2.0.0', homeDir3);
    const registryPath = path.join(homeDir3, '.claude', 'plugins', 'installed_plugins.json');
    const first = JSON.parse(fs.readFileSync(registryPath, 'utf8')).plugins['taketomarket@npm'][0];

    install.registerPlugin(installPath, '2.0.1', homeDir3);
    const second = JSON.parse(fs.readFileSync(registryPath, 'utf8')).plugins['taketomarket@npm'][0];

    assert.strictEqual(second.installedAt, first.installedAt, 'installedAt unchanged');
    assert.strictEqual(second.version, '2.0.1', 'version updated');
  });

  it('backs up corrupted JSON and recreates', () => {
    const homeDir4 = path.join(tmp.dir, 'home4');
    const pluginsDir = path.join(homeDir4, '.claude', 'plugins');
    fs.mkdirSync(pluginsDir, { recursive: true });
    const registryPath = path.join(pluginsDir, 'installed_plugins.json');
    fs.writeFileSync(registryPath, 'not valid json {{{');

    install.registerPlugin('/some/path', '2.0.0', homeDir4);

    assert.ok(install.fileExists(registryPath + '.bak'), 'backup created');
    assert.ok(install.fileExists(registryPath), 'registry recreated');
    const registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    assert.strictEqual(registry.version, 2);
  });
});
