/**
 * Dark Theme
 * Dark mode variant with inverted colors
 * Reference: ELEMENT_SETTINGS_ARCHITECTURE.md
 */

import { defaultTheme } from './defaultTheme';

export const darkTheme = {
  id: 'dark-theme',
  name: 'Dark Theme',
  tokens: {
    ...defaultTheme.tokens,

    // Override colors for dark mode
    colors: {
      ...defaultTheme.tokens.colors,

      // Primary stays same
      primary: defaultTheme.tokens.colors.primary,

      // Accent stays same
      accent: defaultTheme.tokens.colors.accent,

      // Background colors (inverted)
      background: {
        primary: '#111827',      // gray-900
        secondary: '#1F2937',    // gray-800
        tertiary: '#374151'      // gray-700
      },

      // Surface colors (for cards, panels)
      surface: '#1F2937',        // gray-800

      // Text colors (inverted)
      text: {
        primary: '#F9FAFB',      // gray-50
        secondary: '#D1D5DB',    // gray-300
        tertiary: '#9CA3AF',     // gray-400
        inverse: '#111827',      // gray-900
        disabled: '#6B7280'      // gray-500
      },

      // Border colors (adjusted for dark)
      border: {
        default: '#374151',      // gray-700
        strong: '#4B5563',       // gray-600
        subtle: '#1F2937',       // gray-800
        focus: '#60A5FA'         // primary-400 (lighter for dark)
      },

      // Status colors (slightly adjusted for dark)
      status: {
        success: '#34D399',      // green-400
        warning: '#FBBF24',      // amber-400
        error: '#F87171',        // red-400
        info: '#60A5FA'          // blue-400
      }
    }
  }
};

export default darkTheme;
