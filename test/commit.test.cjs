'use strict';

const { describe, it, before, after, mock, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { execSync } = require('node:child_process');
const { createTempDir } = require('./helpers.cjs');
const { cmdCommit } = require('../bin/lib/commit.cjs');

describe('commit.cjs', () => {
  let tmp, originalCwdFn, originalOsCwd, stdoutMock, stderrMock, exitMock;

  before(() => {
    tmp = createTempDir('ttm-commit-test-');
    // Save and override both: the process.cwd function (used by path.resolve
    // in commit.cjs for project root) AND the real OS cwd (used by execFileSync
    // which spawns git subprocesses in the current OS working directory).
    originalCwdFn = process.cwd;
    originalOsCwd = originalCwdFn();
    process.cwd = () => tmp.dir;
    process.chdir(tmp.dir);
    // Init a real git repo in the temp dir
    execSync('git init', { cwd: tmp.dir, stdio: 'pipe' });
    execSync('git config user.email "test@test.com"', { cwd: tmp.dir, stdio: 'pipe' });
    execSync('git config user.name "Test"', { cwd: tmp.dir, stdio: 'pipe' });
  });

  after(() => {
    process.cwd = originalCwdFn;
    process.chdir(originalOsCwd);
    tmp.cleanup();
  });

  beforeEach(() => {
    stdoutMock = mock.method(process.stdout, 'write', () => true);
    stderrMock = mock.method(process.stderr, 'write', () => true);
    exitMock = mock.method(process, 'exit', () => {});
  });

  afterEach(() => {
    stdoutMock.mock.restore();
    stderrMock.mock.restore();
    exitMock.mock.restore();
  });

  describe('module exports', () => {
    it('exports cmdCommit as a function', () => {
      assert.strictEqual(typeof cmdCommit, 'function');
    });
  });

  describe('cmdCommit validation', () => {
    it('errors on empty message', () => {
      cmdCommit('', ['file.txt'], false);
      assert.ok(exitMock.mock.calls.length >= 1);
    });

    it('errors on whitespace-only message', () => {
      cmdCommit('   ', ['file.txt'], false);
      assert.ok(exitMock.mock.calls.length >= 1);
    });

    it('errors on empty files array', () => {
      cmdCommit('msg', [], false);
      assert.ok(exitMock.mock.calls.length >= 1);
    });

    it('errors on null files', () => {
      // cmdCommit with null files calls error(), then execution continues
      // and for...of null throws TypeError. We catch the TypeError since
      // the real process.exit is mocked and does not halt execution.
      try {
        cmdCommit('msg', null, false);
      } catch {
        // TypeError from for...of null is expected when process.exit is mocked
      }
      assert.ok(exitMock.mock.calls.length >= 1);
    });

    it('errors on message exceeding 500 characters', () => {
      cmdCommit('a'.repeat(501), ['file.txt'], false);
      assert.ok(exitMock.mock.calls.length >= 1);
    });

    it('errors on path traversal in file list', () => {
      cmdCommit('msg', ['../../etc/passwd'], false);
      assert.ok(exitMock.mock.calls.length >= 1);
      // Verify the error message mentions path escaping
      const stderrCalls = stderrMock.mock.calls;
      const hasPathError = stderrCalls.some(
        (call) => call.arguments[0].includes('escapes project directory')
      );
      assert.ok(hasPathError, 'should report path traversal error');
    });
  });

  describe('cmdCommit with real git repo', () => {
    it('commits a file and outputs JSON with sha', () => {
      const filePath = path.join(tmp.dir, 'test1.txt');
      fs.writeFileSync(filePath, 'hello');

      cmdCommit('test commit', ['test1.txt'], false);

      // Should not have triggered any exit calls
      assert.strictEqual(exitMock.mock.calls.length, 0);

      const written = stdoutMock.mock.calls[0].arguments[0];
      const parsed = JSON.parse(written);
      assert.strictEqual(parsed.committed, true);
      assert.strictEqual(parsed.message, 'test commit');
      assert.strictEqual(typeof parsed.sha, 'string');
      assert.ok(parsed.sha.length >= 6);

      // Verify commit exists in git log
      const log = execSync('git log --oneline', { cwd: tmp.dir, encoding: 'utf-8' });
      assert.ok(log.includes('test commit'));
    });

    it('sanitizes shell metacharacters from commit message', () => {
      const filePath = path.join(tmp.dir, 'test2.txt');
      fs.writeFileSync(filePath, 'data');

      cmdCommit('hello `whoami` $(rm -rf /) ${HOME}; echo; | cat', ['test2.txt'], false);

      assert.strictEqual(exitMock.mock.calls.length, 0);

      const written = stdoutMock.mock.calls[0].arguments[0];
      const parsed = JSON.parse(written);
      assert.strictEqual(parsed.committed, true);
      // Verify dangerous characters are stripped
      assert.ok(!parsed.message.includes('`'), 'backticks should be stripped');
      assert.ok(!parsed.message.includes('$('), '$( should be stripped');
      assert.ok(!parsed.message.includes('${'), '${ should be stripped');
      assert.ok(!parsed.message.includes(';'), 'semicolons should be stripped');
      assert.ok(!parsed.message.includes('|'), 'pipes should be stripped');
    });

    it('outputs raw sha when raw=true', () => {
      const filePath = path.join(tmp.dir, 'test3.txt');
      fs.writeFileSync(filePath, 'raw');

      cmdCommit('raw test', ['test3.txt'], true);

      assert.strictEqual(exitMock.mock.calls.length, 0);

      const written = stdoutMock.mock.calls[0].arguments[0];
      // Raw mode outputs just the sha string (not JSON)
      assert.ok(typeof written === 'string');
      // Should be a short hash followed by newline
      assert.match(written.trim(), /^[0-9a-f]{7,}$/);
    });

    it('errors on message that becomes empty after sanitization', () => {
      // All special characters: backticks, semicolons, pipes
      // sanitizeMessage replaces each with space, then trims -> empty string
      cmdCommit('`; |', ['test1.txt'], false);
      assert.ok(exitMock.mock.calls.length >= 1);

      // Verify the error mentions empty after sanitization
      const stderrCalls = stderrMock.mock.calls;
      const hasEmptyError = stderrCalls.some(
        (call) => call.arguments[0].includes('empty after sanitization')
      );
      assert.ok(hasEmptyError, 'should report empty-after-sanitization error');
    });
  });
});
