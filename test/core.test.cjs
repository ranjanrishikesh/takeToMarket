'use strict';

const { describe, it, before, after, mock, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const { createTempDir } = require('./helpers.cjs');
const core = require('../bin/lib/core.cjs');

describe('core.cjs module exports', () => {
  it('exports output, error, parseNamedArgs, safeReadFile, safeWriteFile, parseFrontmatter, serializeFrontmatter as functions', () => {
    const expectedExports = [
      'output',
      'error',
      'parseNamedArgs',
      'safeReadFile',
      'safeWriteFile',
      'parseFrontmatter',
      'serializeFrontmatter',
    ];
    for (const name of expectedExports) {
      assert.strictEqual(typeof core[name], 'function', `core.${name} should be a function`);
    }
  });
});

describe('output()', () => {
  let stdoutMock;

  beforeEach(() => {
    stdoutMock = mock.method(process.stdout, 'write', () => true);
  });

  afterEach(() => {
    stdoutMock.mock.restore();
  });

  it('writes JSON to stdout when raw=false', () => {
    core.output({ foo: 'bar' }, false);
    const written = stdoutMock.mock.calls[0].arguments[0];
    const parsed = JSON.parse(written);
    assert.strictEqual(parsed.foo, 'bar');
  });

  it('writes raw string with newline when raw=true', () => {
    core.output({ foo: 'bar' }, true, 'bar');
    const written = stdoutMock.mock.calls[0].arguments[0];
    assert.strictEqual(written, 'bar\n');
  });

  it('writes JSON when raw=true but rawValue is undefined', () => {
    core.output({ foo: 'bar' }, true);
    const written = stdoutMock.mock.calls[0].arguments[0];
    const parsed = JSON.parse(written);
    assert.strictEqual(parsed.foo, 'bar');
  });
});

describe('error()', () => {
  let stderrMock, exitMock;

  beforeEach(() => {
    stderrMock = mock.method(process.stderr, 'write', () => true);
    exitMock = mock.method(process, 'exit', () => {});
  });

  afterEach(() => {
    stderrMock.mock.restore();
    exitMock.mock.restore();
  });

  it('writes error message to stderr with Error: prefix', () => {
    core.error('broken');
    const written = stderrMock.mock.calls[0].arguments[0];
    assert.ok(written.includes('Error: broken'), `Expected stderr to contain "Error: broken", got "${written}"`);
  });

  it('calls process.exit with code 1', () => {
    core.error('broken');
    assert.strictEqual(exitMock.mock.calls.length, 1);
    assert.strictEqual(exitMock.mock.calls[0].arguments[0], 1);
  });
});

describe('parseNamedArgs()', () => {
  it('parses --key value pairs into named object', () => {
    const result = core.parseNamedArgs(['--name', 'test', '--count', '5']);
    assert.deepStrictEqual(result.named, { name: 'test', count: '5' });
    assert.deepStrictEqual(result.positional, []);
  });

  it('collects positional args', () => {
    const result = core.parseNamedArgs(['hello', 'world']);
    assert.deepStrictEqual(result.positional, ['hello', 'world']);
    assert.deepStrictEqual(result.named, {});
  });

  it('skips --raw flag', () => {
    const result = core.parseNamedArgs(['--raw', '--name', 'test']);
    assert.deepStrictEqual(result.named, { name: 'test' });
    assert.deepStrictEqual(result.positional, []);
  });

  it('handles mixed positional and named args', () => {
    const result = core.parseNamedArgs(['pos1', '--key', 'val', 'pos2']);
    assert.deepStrictEqual(result.positional, ['pos1', 'pos2']);
    assert.deepStrictEqual(result.named, { key: 'val' });
  });

  it('handles --flag at end with no value as positional', () => {
    const result = core.parseNamedArgs(['--lonely']);
    assert.deepStrictEqual(result.positional, ['--lonely']);
  });
});

describe('safeReadFile()', () => {
  let tmp;

  before(() => {
    tmp = createTempDir();
    fs.writeFileSync(path.join(tmp.dir, 'test.txt'), 'hello world');
  });

  after(() => {
    tmp.cleanup();
  });

  it('reads existing file contents', () => {
    const content = core.safeReadFile(path.join(tmp.dir, 'test.txt'));
    assert.strictEqual(content, 'hello world');
  });

  it('returns null for non-existent file', () => {
    const content = core.safeReadFile(path.join(tmp.dir, 'nope.txt'));
    assert.strictEqual(content, null);
  });
});

describe('safeWriteFile()', () => {
  let tmp;

  before(() => {
    tmp = createTempDir();
  });

  after(() => {
    tmp.cleanup();
  });

  it('writes file and creates parent directories', () => {
    const filePath = path.join(tmp.dir, 'sub', 'deep', 'file.txt');
    core.safeWriteFile(filePath, 'content');
    assert.ok(fs.existsSync(filePath), 'File should exist after write');
    assert.strictEqual(fs.readFileSync(filePath, 'utf-8'), 'content');
  });

  it('overwrites existing file', () => {
    const filePath = path.join(tmp.dir, 'overwrite.txt');
    core.safeWriteFile(filePath, 'first');
    core.safeWriteFile(filePath, 'second');
    assert.strictEqual(fs.readFileSync(filePath, 'utf-8'), 'second');
  });
});

describe('parseFrontmatter() / serializeFrontmatter()', () => {
  it('parses valid frontmatter', () => {
    const result = core.parseFrontmatter('---\ntitle: hello\nstatus: active\n---\nBody text');
    assert.strictEqual(result.frontmatter.title, 'hello');
    assert.strictEqual(result.frontmatter.status, 'active');
    assert.ok(result.body.includes('Body text'), 'Body should contain "Body text"');
  });

  it('returns empty frontmatter for content without ---', () => {
    const result = core.parseFrontmatter('No frontmatter here');
    assert.deepStrictEqual(result.frontmatter, {});
    assert.strictEqual(result.body, 'No frontmatter here');
  });

  it('returns empty frontmatter for null/empty content', () => {
    const resultNull = core.parseFrontmatter(null);
    assert.deepStrictEqual(resultNull.frontmatter, {});
    assert.strictEqual(resultNull.body, '');

    const resultEmpty = core.parseFrontmatter('');
    assert.deepStrictEqual(resultEmpty.frontmatter, {});
    assert.strictEqual(resultEmpty.body, '');
  });

  it('handles quoted values in frontmatter', () => {
    const result = core.parseFrontmatter('---\nname: "hello world"\n---\n');
    assert.strictEqual(result.frontmatter.name, 'hello world');
  });

  it('round-trips frontmatter through serialize then parse', () => {
    const data = { status: 'active', name: 'Test' };
    const body = '# Hello';
    const serialized = core.serializeFrontmatter(data, body);
    const parsed = core.parseFrontmatter(serialized);
    assert.strictEqual(parsed.frontmatter.status, 'active');
    assert.strictEqual(parsed.frontmatter.name, 'Test');
    assert.ok(parsed.body.includes('# Hello'), 'Body should contain "# Hello"');
  });

  it('serializes values containing colons with quotes', () => {
    const serialized = core.serializeFrontmatter({ url: 'https://example.com' }, '');
    assert.ok(serialized.includes('url: "https://example.com"'), `Expected quoted URL, got: ${serialized}`);
  });

  it('handles Windows line endings', () => {
    const result = core.parseFrontmatter('---\r\ntitle: win\r\n---\r\nBody');
    assert.strictEqual(result.frontmatter.title, 'win');
  });
});
