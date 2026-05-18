'use strict';

const fs = require('fs');
const path = require('path');

// Relative path fragment. Always prepended with `cwd` in readConfig/writeConfig.
const CONFIG_RELATIVE_PATH = path.join('.taketomarket', 'CONFIG.md');

const DEFAULTS = {
  yolo: false,
  inline_education: true,
  landing_path: null,
  brand_path: '.taketomarket/brand',
};

function parseYamlFrontmatter(text) {
  if (!text.startsWith('---\n')) return {};
  const end = text.indexOf('\n---', 4);
  if (end < 0) return {};
  const yaml = text.slice(4, end);
  const out = {};
  const lines = yaml.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    // Match scalar key: `key: value`
    const scalar = line.match(/^([a-z_][a-z0-9_]*):\s*(.*)$/);
    if (!scalar) { i++; continue; }
    const key = scalar[1];
    let val = scalar[2].trim();
    if (val === '') {
      // Possible nested object: gather indented `key.subkey: value` form on following lines
      // We support a single-level nested object whose keys are listed as `  subkey: value`.
      const obj = {};
      let j = i + 1;
      let foundChild = false;
      while (j < lines.length) {
        const child = lines[j].match(/^[ \t]+([a-zA-Z0-9_\-]+):\s*(.*)$/);
        if (!child) break;
        foundChild = true;
        let cval = child[2].trim();
        if (cval === 'true') cval = true;
        else if (cval === 'false') cval = false;
        else if (cval === 'null' || cval === '~' || cval === '') cval = null;
        else if (/^-?\d+$/.test(cval)) cval = parseInt(cval, 10);
        obj[child[1]] = cval;
        j++;
      }
      if (foundChild) {
        out[key] = obj;
        i = j;
        continue;
      }
      out[key] = null;
      i++;
      continue;
    }
    if (val === 'true') val = true;
    else if (val === 'false') val = false;
    else if (val === 'null' || val === '~') val = null;
    else if (/^-?\d+$/.test(val)) val = parseInt(val, 10);
    out[key] = val;
    i++;
  }
  return out;
}

function serializeYamlFrontmatter(obj) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(obj)) {
    if (v === null) lines.push(`${k}: null`);
    else if (typeof v === 'boolean') lines.push(`${k}: ${v}`);
    else if (v && typeof v === 'object' && !Array.isArray(v)) {
      const keys = Object.keys(v);
      if (keys.length === 0) {
        lines.push(`${k}: {}`);
      } else {
        lines.push(`${k}:`);
        for (const sk of keys) {
          const sv = v[sk];
          if (sv === null) lines.push(`  ${sk}: null`);
          else if (typeof sv === 'boolean') lines.push(`  ${sk}: ${sv}`);
          else lines.push(`  ${sk}: ${sv}`);
        }
      }
    }
    else lines.push(`${k}: ${v}`);
  }
  lines.push('---');
  return lines.join('\n');
}

function readConfig(cwd) {
  const p = path.join(cwd, CONFIG_RELATIVE_PATH);
  if (!fs.existsSync(p)) return { ...DEFAULTS };
  const body = fs.readFileSync(p, 'utf8');
  return { ...DEFAULTS, ...parseYamlFrontmatter(body) };
}

function writeConfig(cwd, cfg) {
  const dir = path.join(cwd, '.taketomarket');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const merged = { ...DEFAULTS, ...cfg };
  const text = serializeYamlFrontmatter(merged) + '\n\n# takeToMarket Config\n\nManaged by `/ttm-config`. Do not edit the frontmatter manually unless you know what you are doing.\n';
  fs.writeFileSync(path.join(cwd, CONFIG_RELATIVE_PATH), text);
}

function setConfig(cwd, key, value) {
  const cfg = readConfig(cwd);
  cfg[key] = value;
  writeConfig(cwd, cfg);
}

function markFirstRunSeen(cwd, skillName) {
  const cfg = readConfig(cwd);
  const seen = (cfg.first_run_seen && typeof cfg.first_run_seen === 'object')
    ? { ...cfg.first_run_seen }
    : {};
  seen[skillName] = true;
  cfg.first_run_seen = seen;
  writeConfig(cwd, cfg);
}

function isFirstRunSeen(cwd, skillName) {
  const cfg = readConfig(cwd);
  return !!(cfg.first_run_seen && typeof cfg.first_run_seen === 'object' && cfg.first_run_seen[skillName] === true);
}

module.exports = { readConfig, writeConfig, setConfig, markFirstRunSeen, isFirstRunSeen, DEFAULTS };
