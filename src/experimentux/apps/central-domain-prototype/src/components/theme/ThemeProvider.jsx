/**
 * ThemeProvider Component
 * Provides theme context and token resolution
 * Reference: ELEMENT_SETTINGS_ARCHITECTURE.md § Theme System Architecture
 */

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { defaultTheme } from '../../config/themes';

const ThemeContext = createContext();

export const ThemeProvider = ({ children, initialTheme = defaultTheme }) => {
  const [activeTheme, setActiveTheme] = useState(initialTheme);

  /**
   * Resolve a theme token path to its value
   * @param {string} tokenPath - Token path like "{{theme.colors.text.primary}}"
   * @returns {string} Resolved value or original path if not found
   */
  const resolveToken = useMemo(() => (tokenPath) => {
    if (!tokenPath || typeof tokenPath !== 'string') {
      return tokenPath;
    }

    // Check if it's a theme token (starts with {{theme.)
    if (!tokenPath.startsWith('{{theme.')) {
      return tokenPath;
    }

    // Parse token path: "{{theme.colors.text.primary}}" → ["colors", "text", "primary"]
    const cleanPath = tokenPath.replace(/^{{theme\.|}}$/g, '');
    const pathParts = cleanPath.split('.');

    // Traverse theme object
    let value = activeTheme.tokens;
    for (const part of pathParts) {
      if (value && typeof value === 'object' && part in value) {
        value = value[part];
      } else {
        console.warn(`Theme token not found: ${tokenPath}`);
        return tokenPath; // Return original if not found
      }
    }

    return value;
  }, [activeTheme]);

  /**
   * Resolve all theme tokens in a settings object recursively
   * @param {Object} settings - Settings object with potential theme tokens
   * @returns {Object} Settings with all tokens resolved
   */
  const resolveAllTokens = useMemo(() => (settings) => {
    if (!settings || typeof settings !== 'object') {
      return settings;
    }

    if (Array.isArray(settings)) {
      return settings.map(item => resolveAllTokens(item));
    }

    const resolved = {};
    for (const [key, value] of Object.entries(settings)) {
      if (typeof value === 'string') {
        resolved[key] = resolveToken(value);
      } else if (typeof value === 'object') {
        resolved[key] = resolveAllTokens(value);
      } else {
        resolved[key] = value;
      }
    }

    return resolved;
  }, [resolveToken]);

  /**
   * Generate CSS variables from theme tokens
   * Writes theme tokens to :root as CSS custom properties
   */
  useEffect(() => {
    const generateCSSVariables = (tokens, prefix = '--theme') => {
      const cssVars = {};

      const traverse = (obj, path = []) => {
        for (const [key, value] of Object.entries(obj)) {
          const currentPath = [...path, key];

          if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
            // Recurse into nested objects
            traverse(value, currentPath);
          } else if (typeof value === 'string' || typeof value === 'number') {
            // Create CSS variable name: --theme-colors-text-primary
            const varName = `${prefix}-${currentPath.join('-')}`;
            cssVars[varName] = value;
          }
        }
      };

      traverse(tokens);
      return cssVars;
    };

    // Generate CSS variables
    const cssVars = generateCSSVariables(activeTheme.tokens);

    // Apply to :root
    const root = document.documentElement;
    Object.entries(cssVars).forEach(([name, value]) => {
      root.style.setProperty(name, value);
    });

    // Cleanup on theme change
    return () => {
      Object.keys(cssVars).forEach((name) => {
        root.style.removeProperty(name);
      });
    };
  }, [activeTheme]);

  /**
   * Get a CSS variable reference for a token path
   * @param {string} tokenPath - Token path like "colors.text.primary"
   * @returns {string} CSS variable reference like "var(--theme-colors-text-primary)"
   */
  const getCSSVariable = (tokenPath) => {
    if (!tokenPath) return '';
    const cleanPath = tokenPath.replace(/^{{theme\.|}}$/g, '');
    const varName = `--theme-${cleanPath.replace(/\./g, '-')}`;
    return `var(${varName})`;
  };

  const value = {
    activeTheme,
    setActiveTheme,
    resolveToken,
    resolveAllTokens,
    getCSSVariable,
    tokens: activeTheme.tokens
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialTheme: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tokens: PropTypes.object.isRequired
  })
};

/**
 * Hook to access theme context
 * @returns {Object} Theme context with activeTheme, setActiveTheme, resolveToken, etc.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
