'use strict';

const { describe, it, mock, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const { cmdSlug, cmdTimestamp } = require('../bin/lib/slug.cjs');

describe('slug.cjs module exports', () => {
  it('exports cmdSlug and cmdTimestamp as functions', () => {
    assert.strictEqual(typeof cmdSlug, 'function');
    assert.strictEqual(typeof cmdTimestamp, 'function');
  });
});

describe('cmdSlug', () => {
  let stdoutMock, stderrMock, exitMock;

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

  it('generates slug from simple text', () => {
    cmdSlug('Hello World', false);
    const output = JSON.parse(stdoutMock.mock.calls[0].arguments[0]);
    assert.strictEqual(output.slug, 'hello-world');
  });

  it('generates slug in raw mode', () => {
    cmdSlug('Hello World', true);
    assert.strictEqual(stdoutMock.mock.calls[0].arguments[0], 'hello-world\n');
  });

  it('strips special characters from slug', () => {
    cmdSlug('Hello, World! @#$%', false);
    const output = JSON.parse(stdoutMock.mock.calls[0].arguments[0]);
    assert.strictEqual(output.slug, 'hello-world');
  });

  it('truncates slug to 60 characters', () => {
    cmdSlug('a'.repeat(100), false);
    const output = JSON.parse(stdoutMock.mock.calls[0].arguments[0]);
    assert.ok(output.slug.length <= 60, `Slug length ${output.slug.length} exceeds 60`);
  });

  it('trims leading and trailing hyphens', () => {
    cmdSlug('---hello---', false);
    const output = JSON.parse(stdoutMock.mock.calls[0].arguments[0]);
    assert.strictEqual(output.slug, 'hello');
  });

  it('errors on empty text', () => {
    cmdSlug('', false);
    assert.strictEqual(exitMock.mock.calls.length, 1);
    assert.strictEqual(exitMock.mock.calls[0].arguments[0], 1);
  });

  it('errors on whitespace-only text', () => {
    cmdSlug('   ', false);
    assert.strictEqual(exitMock.mock.calls.length, 1);
    assert.strictEqual(exitMock.mock.calls[0].arguments[0], 1);
  });
});

describe('cmdTimestamp', () => {
  let stdoutMock, stderrMock, exitMock;

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

  it('outputs ISO date for format=date', () => {
    cmdTimestamp('date', false);
    const output = JSON.parse(stdoutMock.mock.calls[0].arguments[0]);
    assert.match(output.timestamp, /^\d{4}-\d{2}-\d{2}$/);
  });

  it('outputs filename-safe format', () => {
    cmdTimestamp('filename', false);
    const output = JSON.parse(stdoutMock.mock.calls[0].arguments[0]);
    assert.match(output.timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}$/);
  });

  it('outputs full ISO timestamp as default', () => {
    cmdTimestamp('full', false);
    const output = JSON.parse(stdoutMock.mock.calls[0].arguments[0]);
    assert.match(output.timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  });

  it('outputs raw timestamp string', () => {
    cmdTimestamp('date', true);
    const written = stdoutMock.mock.calls[0].arguments[0];
    assert.match(written, /^\d{4}-\d{2}-\d{2}\n$/);
  });
});
