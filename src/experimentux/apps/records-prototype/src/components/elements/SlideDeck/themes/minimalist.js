/**
 * Minimalist Theme - Apple-inspired design
 *
 * Clean, elegant theme with generous white space and refined typography.
 * Inspired by Apple's design language.
 */

export const minimalistTheme = {
  name: 'Minimalist',

  // Typography - Apple SF Pro inspired
  fonts: {
    heading: 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
    body: 'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    code: 'ui-monospace, "SF Mono", Menlo, Monaco, "Courier New", monospace'
  },

  // Colors - Refined and subtle
  colors: {
    background: '#FFFFFF',
    text: '#1D1D1F',
    heading: '#000000',
    accent: '#0071E3',
    muted: '#86868B',
    border: '#D2D2D7',
    code: {
      background: '#F5F5F7',
      text: '#1D1D1F'
    }
  },

  // Spacing - Generous and balanced
  spacing: {
    slidePadding: '80px',
    headingMargin: '32px',
    paragraphMargin: '16px',
    listItemMargin: '8px'
  },

  // Type scale - Harmonious proportions
  typeScale: {
    title: {
      fontSize: '60px',
      fontWeight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.02em'
    },
    heading1: {
      fontSize: '48px',
      fontWeight: '600',
      lineHeight: '1.15',
      letterSpacing: '-0.015em'
    },
    heading2: {
      fontSize: '36px',
      fontWeight: '600',
      lineHeight: '1.2',
      letterSpacing: '-0.01em'
    },
    heading3: {
      fontSize: '30px',
      fontWeight: '500',
      lineHeight: '1.25',
      letterSpacing: '0em'
    },
    body: {
      fontSize: '20px',
      fontWeight: '400',
      lineHeight: '1.6',
      letterSpacing: '0em'
    },
    small: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0em'
    },
    code: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
      letterSpacing: '0em'
    }
  },

  // Layout
  layout: {
    aspectRatio: '16/9',
    maxWidth: '1200px',
    alignment: 'center'
  }
};

export default minimalistTheme;
