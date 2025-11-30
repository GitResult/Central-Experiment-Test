/**
 * Enterprise Design System
 * Refined, confident, and elegant aesthetic for professional applications
 */

export const theme = {
  colors: {
    // Primary accent - Used strategically for key actions and focus states only
    primary: {
      50: '#F5F8FF',
      100: '#EBF2FF',
      200: '#D6E4FF',
      300: '#ADC8FF',
      400: '#85A3FF',
      500: '#5C7CFA',   // Refined professional blue
      600: '#4C63D2',
      700: '#3B4DAA',
      800: '#2D3A82',
      900: '#1F285A'
    },

    // Sophisticated neutrals - The foundation of enterprise UI
    neutral: {
      0: '#FFFFFF',
      50: '#FAFAFA',
      100: '#F7F7F8',
      200: '#EDEDEF',
      300: '#DCDCE0',
      400: '#B4B4BB',
      500: '#86868F',
      600: '#5E5E66',
      700: '#43434A',
      800: '#2E2E33',
      900: '#1A1A1D',
      950: '#000000'
    },

    // Semantic colors - Muted for enterprise, used sparingly
    success: {
      50: '#F3F9F4',
      500: '#4CAF6F',   // Muted professional green
      600: '#3D8C5A',
      700: '#2F6B44'
    },
    warning: {
      50: '#FFF9F0',
      500: '#E89B3C',   // Muted amber
      600: '#C6812F',
      700: '#A46725'
    },
    error: {
      50: '#FEF5F5',
      500: '#E85C5C',   // Muted professional red
      600: '#C74A4A',
      700: '#A63A3A'
    },

    // Data visualization - Refined, professional palette
    charts: {
      primary: '#5C7CFA',
      secondary: '#86868F',
      tertiary: '#B4B4BB',
      accent1: '#7C5CFA',
      accent2: '#5CAFA8',
      accent3: '#E89B3C',
      muted1: '#A8B4C8',
      muted2: '#C8A8B4',
      muted3: '#B4C8A8'
    },

    // Text hierarchy - Simplified for enterprise clarity
    text: {
      primary: '#1A1A1D',      // High contrast for main content
      secondary: '#43434A',    // Supporting content
      tertiary: '#86868F',     // De-emphasized content
      disabled: '#B4B4BB',     // Disabled states
      inverse: '#FFFFFF',      // On dark backgrounds
      link: '#5C7CFA',         // Strategic accent use
      linkHover: '#4C63D2'
    },

    // Background hierarchy - Clean and minimal
    background: {
      primary: '#FFFFFF',      // Main canvas
      secondary: '#FAFAFA',    // Subtle depth
      tertiary: '#F7F7F8',     // Cards and panels
      elevated: '#FFFFFF',     // Floating elements
      overlay: 'rgba(26, 26, 29, 0.6)',  // Modal backdrops
      glass: 'rgba(255, 255, 255, 0.85)' // Translucent surfaces
    },

    // Border hierarchy - Extremely subtle for enterprise refinement
    border: {
      subtle: '#F7F7F8',       // Barely visible separations
      default: '#EDEDEF',      // Standard dividers
      medium: '#DCDCE0',       // Emphasized borders
      strong: '#B4B4BB',       // High emphasis (rare)
      focus: '#5C7CFA'         // Strategic accent
    },

    // Interactive states - Refined and minimal
    interactive: {
      hover: 'rgba(0, 0, 0, 0.03)',     // Subtle hover
      active: 'rgba(0, 0, 0, 0.06)',    // Subtle press
      selected: 'rgba(92, 124, 250, 0.08)', // Accent tint
      disabled: '#F7F7F8'               // Disabled background
    }
  },

  typography: {
    fontFamily: {
      // Inter font family
      sans: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
      mono: '"SF Mono", ui-monospace, "Cascadia Code", "Roboto Mono", Menlo, Monaco, "Courier New", monospace',
      display: '"Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif'
    },

    fontSize: {
      xs: '0.6875rem',    // 11px
      sm: '0.8125rem',    // 13px
      base: '0.875rem',   // 14px
      md: '1rem',         // 16px
      lg: '1.125rem',     // 18px
      xl: '1.3125rem',    // 21px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.75rem',   // 28px
      '4xl': '2.125rem',  // 34px
      '5xl': '2.625rem',  // 42px
      '6xl': '3.5rem',    // 56px
      '7xl': '4.5rem'     // 72px
    },

    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },

    lineHeight: {
      none: '1',
      tight: '1.2',
      snug: '1.3',
      normal: '1.47',     // Apple standard
      relaxed: '1.6',
      loose: '1.8'
    },

    letterSpacing: {
      tighter: '-0.03em',
      tight: '-0.015em',
      normal: '0',
      wide: '0.015em',
      wider: '0.03em'
    }
  },

  spacing: {
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    32: '8rem',       // 128px
    40: '10rem',      // 160px
    48: '12rem',      // 192px
    56: '14rem',      // 224px
    64: '16rem'       // 256px
  },

  borderRadius: {
    none: '0',
    sm: '0.375rem',   // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px - Apple standard
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
    '3xl': '1.75rem', // 28px
    full: '9999px'
  },

  shadows: {
    none: 'none',
    // Enterprise-refined shadows - extremely subtle depth
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
    base: '0 2px 6px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 0 rgba(0, 0, 0, 0.03)',
    md: '0 4px 12px 0 rgba(0, 0, 0, 0.06), 0 2px 6px 0 rgba(0, 0, 0, 0.04)',
    lg: '0 8px 24px 0 rgba(0, 0, 0, 0.08), 0 4px 12px 0 rgba(0, 0, 0, 0.05)',
    xl: '0 16px 40px 0 rgba(0, 0, 0, 0.1), 0 8px 24px 0 rgba(0, 0, 0, 0.06)',
    '2xl': '0 24px 56px 0 rgba(0, 0, 0, 0.12), 0 12px 32px 0 rgba(0, 0, 0, 0.08)',
    inner: 'inset 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
    // Professional focus ring
    focus: '0 0 0 3px rgba(92, 124, 250, 0.2)',
    // Elevated elements
    elevated: '0 4px 12px 0 rgba(0, 0, 0, 0.05), 0 0 1px 0 rgba(0, 0, 0, 0.03)',
    elevatedHover: '0 8px 24px 0 rgba(0, 0, 0, 0.08), 0 0 1px 0 rgba(0, 0, 0, 0.04)'
  },

  transitions: {
    // Apple-style easing
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slowest: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
    // Apple spring
    spring: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)'
  },

  // Apple-style blur effects
  blur: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '40px',
    '3xl': '64px'
  },

  // Component-specific tokens
  components: {
    button: {
      height: {
        sm: '1.75rem',
        md: '2.25rem',
        lg: '2.75rem'
      },
      padding: {
        sm: '0 1rem',
        md: '0 1.5rem',
        lg: '0 2rem'
      }
    },
    input: {
      height: {
        sm: '1.75rem',
        md: '2.25rem',
        lg: '2.75rem'
      },
      padding: {
        sm: '0 0.75rem',
        md: '0 1rem',
        lg: '0 1.25rem'
      }
    },
    card: {
      padding: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '2.5rem'
      }
    }
  },

  // Layout tokens
  layout: {
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1440px',
      full: '100%'
    },
    sidebar: {
      narrow: '240px',
      default: '280px',
      wide: '320px'
    },
    header: {
      height: '64px'
    }
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070
  }
};
