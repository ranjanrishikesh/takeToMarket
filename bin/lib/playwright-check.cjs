'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');

function defaultSettingsPath() {
  return path.join(os.homedir(), '.claude', 'settings.json');
}

function checkPlaywrightMcp(opts = {}) {
  const settingsPath = opts.settingsPath || defaultSettingsPath();
  let detected = false;
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      if (settings.mcpServers && settings.mcpServers.playwright) detected = true;
    } catch {}
  }
  return {
    detected,
    settingsPath,
    setupHint: detected ? 'Playwright MCP is configured.' : 'Run /ttm-playwright-setup to install.',
  };
}

module.exports = { checkPlaywrightMcp };
