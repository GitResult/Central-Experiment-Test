/**
 * Theme Token Matcher
 * Fuzzy matching utility for theme tokens to help users find and use tokens
 * Supports partial matching, category filtering, and suggestions
 */

import { theme } from '../config/theme';

/**
 * Extract all available theme tokens from theme object
 * Returns flat array of token paths
 */
export function getAllThemeTokens() {
  const tokens = [];

  function traverse(obj, path = '') {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, currentPath);
      } else {
        tokens.push({
          path: currentPath,
          value: value,
          template: `{{theme.${currentPath}}}`,
        });
      }
    }
  }

  traverse(theme);
  return tokens;
}

/**
 * Calculate similarity score between two strings
 * Uses Levenshtein distance algorithm
 */
function calculateSimilarity(str1, str2) {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  // Exact match
  if (s1 === s2) return 1.0;

  // Starts with
  if (s2.startsWith(s1)) return 0.9;

  // Contains
  if (s2.includes(s1)) return 0.7;

  // Levenshtein distance
  const matrix = [];
  const len1 = s1.length;
  const len2 = s2.length;

  for (let i = 0; i <= len2; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len1; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len2; i++) {
    for (let j = 1; j <= len1; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  const distance = matrix[len2][len1];
  const maxLen = Math.max(len1, len2);
  return 1 - distance / maxLen;
}

/**
 * Fuzzy match theme tokens
 * @param {string} query - Search query (partial token path or value)
 * @param {Object} options - Search options
 * @returns {Array} Matched tokens sorted by relevance
 */
export function fuzzyMatchTokens(query, options = {}) {
  const {
    category = null, // Filter by category: 'colors', 'typography', 'spacing', etc.
    minScore = 0.3, // Minimum similarity score (0-1)
    maxResults = 10, // Maximum number of results
    includeValues = false, // Also search in values
  } = options;

  if (!query || query.trim().length === 0) {
    return [];
  }

  const allTokens = getAllThemeTokens();
  const matches = [];

  allTokens.forEach((token) => {
    // Apply category filter
    if (category && !token.path.startsWith(category)) {
      return;
    }

    // Calculate score based on path
    const pathScore = calculateSimilarity(query, token.path);

    // Calculate score based on value if enabled
    let valueScore = 0;
    if (includeValues && typeof token.value === 'string') {
      valueScore = calculateSimilarity(query, token.value);
    }

    const score = Math.max(pathScore, valueScore);

    if (score >= minScore) {
      matches.push({
        ...token,
        score,
        matchType: pathScore > valueScore ? 'path' : 'value',
      });
    }
  });

  // Sort by score (descending)
  matches.sort((a, b) => b.score - a.score);

  // Limit results
  return matches.slice(0, maxResults);
}

/**
 * Get token suggestions for a specific category
 * @param {string} category - Token category
 * @param {number} limit - Maximum number of suggestions
 * @returns {Array} Token suggestions
 */
export function getTokenSuggestions(category, limit = 20) {
  const allTokens = getAllThemeTokens();

  const categoryTokens = allTokens.filter((token) =>
    token.path.startsWith(category)
  );

  return categoryTokens.slice(0, limit);
}

/**
 * Parse theme token template
 * Extract the token path from {{theme.xxx}} format
 */
export function parseTokenTemplate(template) {
  if (typeof template !== 'string') return null;

  const match = template.match(/\{\{theme\.([^}]+)\}\}/);
  return match ? match[1] : null;
}

/**
 * Validate theme token
 * Check if a token path exists in theme
 */
export function validateToken(tokenPath) {
  const allTokens = getAllThemeTokens();
  return allTokens.some((token) => token.path === tokenPath);
}

/**
 * Get token value by path
 * Returns the actual value from theme object
 */
export function getTokenValue(tokenPath) {
  const parts = tokenPath.split('.');
  let value = theme;

  for (const part of parts) {
    if (value && typeof value === 'object' && part in value) {
      value = value[part];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Token categories with metadata
 */
export const tokenCategories = [
  {
    id: 'colors',
    name: 'Colors',
    description: 'Color palette including primary, status, and semantic colors',
    icon: '🎨',
  },
  {
    id: 'typography',
    name: 'Typography',
    description: 'Font sizes, weights, and line heights',
    icon: '📝',
  },
  {
    id: 'spacing',
    name: 'Spacing',
    description: 'Padding, margin, and gap values',
    icon: '📏',
  },
  {
    id: 'borderRadius',
    name: 'Border Radius',
    description: 'Corner rounding values',
    icon: '⬛',
  },
  {
    id: 'shadows',
    name: 'Shadows',
    description: 'Box shadow presets',
    icon: '🌑',
  },
  {
    id: 'breakpoints',
    name: 'Breakpoints',
    description: 'Responsive design breakpoints',
    icon: '📱',
  },
];

/**
 * Get popular tokens by usage context
 * Returns commonly used tokens for specific element settings
 */
export function getPopularTokens(context) {
  const popularByContext = {
    color: [
      'colors.text.primary',
      'colors.text.secondary',
      'colors.primary.500',
      'colors.primary.600',
      'colors.gray.700',
    ],
    background: [
      'colors.background.primary',
      'colors.background.secondary',
      'colors.surface',
      'colors.primary.50',
      'colors.gray.100',
    ],
    fontSize: [
      'typography.fontSize.sm',
      'typography.fontSize.base',
      'typography.fontSize.lg',
      'typography.fontSize.xl',
      'typography.fontSize.2xl',
    ],
    fontWeight: [
      'typography.fontWeight.normal',
      'typography.fontWeight.medium',
      'typography.fontWeight.semibold',
      'typography.fontWeight.bold',
    ],
    spacing: [
      'spacing.2',
      'spacing.4',
      'spacing.6',
      'spacing.8',
      'spacing.12',
    ],
    borderRadius: [
      'borderRadius.sm',
      'borderRadius.md',
      'borderRadius.lg',
      'borderRadius.xl',
      'borderRadius.full',
    ],
  };

  return popularByContext[context] || [];
}

/**
 * Format token for display
 * Returns human-readable label for a token
 */
export function formatTokenLabel(tokenPath) {
  const parts = tokenPath.split('.');
  const lastPart = parts[parts.length - 1];

  // Capitalize and format
  return lastPart
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
