/**
 * Slug -- Slug generation and timestamp formatting for ttm-tools.cjs
 *
 * Zero npm dependencies. Uses only Node.js built-ins.
 *
 * Exports: cmdSlug, cmdTimestamp
 */

'use strict';

const { output, error } = require('./core.cjs');

/**
 * Generate a URL-safe slug from text.
 * Security: /[^a-z0-9]+/g strips all non-alphanumeric characters,
 * preventing path traversal or injection via slug values.
 *
 * @param {string} text - Input text to slugify
 * @param {boolean} raw - Whether to output raw string
 */
function cmdSlug(text, raw) {
  if (!text || !text.trim()) {
    error('text required for slug generation');
  }
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
  output({ slug }, raw, slug);
}

/**
 * Output a timestamp in the specified format.
 *
 * @param {string} format - 'full' (default) | 'date' | 'filename'
 * @param {boolean} raw - Whether to output raw string
 */
function cmdTimestamp(format, raw) {
  const now = new Date();
  let result;
  switch (format) {
    case 'date':
      result = now.toISOString().split('T')[0];
      break;
    case 'filename':
      result = now.toISOString().replace(/:/g, '-').replace(/\..+/, '');
      break;
    default:
      result = now.toISOString();
      break;
  }
  output({ timestamp: result }, raw, result);
}

module.exports = {
  cmdSlug,
  cmdTimestamp,
};
