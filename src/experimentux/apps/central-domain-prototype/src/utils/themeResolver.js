/**
 * Theme Token Resolver
 * Resolves theme tokens like {{theme.colors.primary}} to actual values
 */

import { theme } from '../config/theme';

/**
 * Resolve a single theme token from a string
 * @param {string} value - Value that might contain theme token
 * @returns {string} - Resolved value
 */
export function resolveThemeToken(value) {
  if (!value || typeof value !== 'string') return value;

  // Check if value contains theme token pattern
  const tokenRegex = /\{\{theme\.([^}]+)\}\}/g;

  return value.replace(tokenRegex, (match, path) => {
    // Navigate theme object by path (e.g., 'colors.primary')
    const keys = path.split('.');
    let result = theme;

    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) {
        console.warn(`Theme token not found: ${path}`);
        return match; // Return original if not found
      }
    }

    return result;
  });
}

/**
 * Resolve all theme tokens in an object recursively
 * @param {object} obj - Object with potential theme tokens
 * @returns {object} - Object with resolved tokens
 */
export function resolveThemeTokens(obj) {
  if (!obj || typeof obj !== 'object') {
    return resolveThemeToken(obj);
  }

  const resolved = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      resolved[key] = resolveThemeToken(value);
    } else if (typeof value === 'object' && value !== null) {
      resolved[key] = resolveThemeTokens(value);
    } else {
      resolved[key] = value;
    }
  }

  return resolved;
}
