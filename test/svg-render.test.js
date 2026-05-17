'use strict';
const { test } = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const os = require('os');

const { detectRenderer, renderSvgToPng } = require('../bin/lib/svg-render.cjs');

function tmpDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), 'ttm-svg-'));
}

test('detectRenderer returns a string identifying available tool or "none"', () => {
  const r = detectRenderer();
  assert.ok(typeof r === 'string');
  assert.ok(['rsvg-convert', 'inkscape', 'magick', 'sharp', 'none'].includes(r));
});

test('renderSvgToPng skips if no renderer available, returns ok=false', () => {
  const d = tmpDir();
  const svgPath = path.join(d, 'logo.svg');
  const pngPath = path.join(d, 'logo.png');
  fs.writeFileSync(svgPath, '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="red"/></svg>');
  const result = renderSvgToPng(svgPath, pngPath, 'none');
  assert.strictEqual(result.ok, false);
  assert.match(result.error, /no renderer/i);
});
