'use strict';
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function findPluginRoot() {
  // CLAUDE_PLUGIN_ROOT is set by Claude Code at runtime. If not present, try common paths.
  if (process.env.CLAUDE_PLUGIN_ROOT) return process.env.CLAUDE_PLUGIN_ROOT;
  const candidates = [
    path.join(process.env.HOME || '', '.claude', 'plugins', 'cache', 'claude-plugins-official', 'taketomarket'),
    path.join(process.env.HOME || '', '.claude', 'skills'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

function detectInstallMethod() {
  const root = findPluginRoot();
  if (!root) return { method: 'unknown', root: null };
  if (fs.existsSync(path.join(root, '.git'))) {
    return { method: 'clone', root };
  }
  return { method: 'npm', root };
}

module.exports = { detectInstallMethod, findPluginRoot };
