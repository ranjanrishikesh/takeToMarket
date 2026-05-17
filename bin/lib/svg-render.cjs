'use strict';

const { execSync } = require('child_process');
const fs = require('fs');

function commandExists(cmd) {
  try {
    execSync(`command -v ${cmd}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function detectRenderer() {
  if (commandExists('rsvg-convert')) return 'rsvg-convert';
  if (commandExists('inkscape')) return 'inkscape';
  if (commandExists('magick')) return 'magick';
  try {
    require.resolve('sharp');
    return 'sharp';
  } catch {}
  return 'none';
}

function renderSvgToPng(svgPath, pngPath, renderer) {
  const r = renderer || detectRenderer();
  if (r === 'none') {
    return { ok: false, error: 'No renderer available. Install rsvg-convert (brew install librsvg) or Inkscape.' };
  }
  try {
    if (r === 'rsvg-convert') {
      execSync(`rsvg-convert "${svgPath}" -o "${pngPath}"`);
    } else if (r === 'inkscape') {
      execSync(`inkscape "${svgPath}" --export-type=png --export-filename="${pngPath}"`);
    } else if (r === 'magick') {
      execSync(`magick "${svgPath}" "${pngPath}"`);
    } else if (r === 'sharp') {
      // sharp path is async - synchronous wrapper not supported here
      return { ok: false, error: 'sharp path is async - call renderSvgToPngAsync instead' };
    }
    return { ok: true, renderer: r };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

module.exports = { detectRenderer, renderSvgToPng };
