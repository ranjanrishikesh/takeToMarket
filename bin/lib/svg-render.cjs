'use strict';

const { execSync, execFileSync } = require('child_process');

// `cmd` is always a hardcoded literal (rsvg-convert, inkscape, magick).
// Not user input, so the shell expansion is safe.
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
  return 'none';
}

function renderSvgToPng(svgPath, pngPath, renderer) {
  const r = renderer || detectRenderer();
  if (r === 'none') {
    return { ok: false, error: 'No renderer available. Install rsvg-convert (brew install librsvg) or Inkscape.' };
  }
  try {
    if (r === 'rsvg-convert') {
      execFileSync('rsvg-convert', [svgPath, '-o', pngPath]);
    } else if (r === 'inkscape') {
      execFileSync('inkscape', [svgPath, '--export-type=png', `--export-filename=${pngPath}`]);
    } else if (r === 'magick') {
      execFileSync('magick', [svgPath, pngPath]);
    }
    return { ok: true, renderer: r };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

module.exports = { detectRenderer, renderSvgToPng };
