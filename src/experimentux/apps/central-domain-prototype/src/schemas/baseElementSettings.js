/**
 * Base Element Settings Schema
 * Five organized setting groups inherited by all element types
 * Reference: ELEMENT_SETTINGS_ARCHITECTURE.md § Shared Element Settings
 */

/**
 * Base settings that all elements inherit
 * Organized into 5 logical groups:
 * 1. Layout - Position and structure
 * 2. Appearance - Colors, borders, shadows (theme-based)
 * 3. Data - Binding, format, validation
 * 4. Typography - Fonts and text styling
 * 5. Business Rules - Visibility, permissions, conditional logic, animation
 */
export const baseElementSettings = {
  // Group 1: Layout (position and structure)
  layout: {
    // Dimensions
    width: 'full', // 'full' | 'auto' | 'fixed' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4'
    fixedWidth: null, // e.g., '600px'
    height: 'auto', // 'auto' | 'fixed'
    fixedHeight: null, // e.g., '400px'

    // Alignment
    alignment: 'left', // 'left' | 'center' | 'right'
    verticalAlignment: 'top', // 'top' | 'middle' | 'bottom'

    // Display
    display: 'block', // 'block' | 'inline' | 'flex' | 'grid'

    // Spacing
    spacing: {
      margin: {
        top: '0',
        right: '0',
        bottom: '{{theme.spacing.sm}}', // Theme token
        left: '0'
      },
      padding: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      }
    },

    // Responsive (optional per-breakpoint overrides)
    responsive: {
      mobile: null, // { width, height, spacing }
      tablet: null, // { width, height, spacing }
      desktop: null // { width, height, spacing }
    }
  },

  // Group 2: Appearance (colors, borders, shadows via theme tokens)
  appearance: {
    // Background
    background: '{{theme.colors.background.primary}}', // Theme token ONLY

    // Border
    border: {
      width: '0',
      style: 'none', // 'none' | 'solid' | 'dashed' | 'dotted'
      color: '{{theme.colors.border.default}}', // Theme token ONLY
      radius: '0'
    },

    // Shadow
    shadow: 'none', // Theme token: '{{theme.shadows.md}}' or 'none'

    // Opacity
    opacity: 1, // 0-1

    // Custom colors (evaluated when theme tokens insufficient)
    customColors: {
      background: null, // Hex/RGB when theme insufficient
      border: null, // Hex/RGB when theme insufficient
      text: null // Hex/RGB when theme insufficient
    }
  },

  // Group 3: Data (binding, format, validation)
  data: {
    // Binding mode (explicit data flow)
    bindingMode: 'static', // 'static' | 'bound-read' | 'bound-write' | 'bound-bidirectional'

    // Binding configuration
    binding: null,
    // When set:
    // {
    //   source: string,      // Data source path (e.g., 'record.customer', 'collection.speakers')
    //   property: string,    // Property to bind (e.g., 'email', 'name')
    //   transform: function, // Optional transform function
    //   mode: 'read' | 'write' | 'bidirectional' // Data flow direction
    // }

    // Format
    format: null,
    // When set:
    // {
    //   type: 'text' | 'number' | 'date' | 'currency' | 'custom',
    //   locale: string,      // BCP 47 locale tag (optional, inherits from user profile)
    //   options: object      // Intl.* options for formatting
    // }

    // Validation (for field elements)
    validation: {},
    // When set:
    // {
    //   required: boolean,
    //   min: number,
    //   max: number,
    //   minLength: number,
    //   maxLength: number,
    //   pattern: string,         // Regex
    //   customValidator: function,
    //   errorMessage: string,    // Locale key or literal
    //   showErrorIcon: boolean,
    //   showSuccessIcon: boolean
    // }

    // Slash commands (for input elements)
    slashCommands: {
      enabled: false, // Enable slash command detection
      context: 'internal' // 'internal' | 'external' | 'both'
    }
  },

  // Group 4: Typography (fonts and text styling)
  typography: {
    fontSize: '{{theme.typography.fontSize.base}}', // Theme token
    fontWeight: '{{theme.typography.fontWeight.normal}}', // Theme token
    fontFamily: '{{theme.typography.fontFamily.sans}}', // Theme token
    lineHeight: '{{theme.typography.lineHeight.normal}}', // Theme token
    letterSpacing: 'normal',
    textTransform: 'none', // 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    color: '{{theme.colors.text.primary}}' // Theme token
  },

  // Group 5: Business Rules (visibility, permissions, conditional logic, animation)
  businessRules: {
    // Visibility rules
    visibility: {
      hidden: false,
      responsive: {
        hideOnMobile: false,
        hideOnTablet: false,
        hideOnDesktop: false
      }
    },

    // Permissions
    permissions: {
      view: ['*'], // Roles that can view (all by default)
      edit: ['*'], // Roles that can edit (all by default)
      delete: ['admin'] // Roles that can delete (admin only)
    },

    // Conditional display
    conditional: null,
    // When set:
    // {
    //   show: boolean,
    //   dependsOn: string,      // Element ID this depends on
    //   condition: function     // Condition function
    // }

    // Animation
    animation: {
      entrance: 'none', // 'fade' | 'slide' | 'scale' | 'none'
      duration: 0, // milliseconds
      delay: 0, // milliseconds
      easing: 'ease' // 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
    }
  }
};

/**
 * Create element settings with defaults
 * @param {Object} overrides - Setting overrides
 * @returns {Object} Complete settings object
 */
export const createElementSettings = (overrides = {}) => {
  return {
    layout: { ...baseElementSettings.layout, ...overrides.layout },
    appearance: { ...baseElementSettings.appearance, ...overrides.appearance },
    data: { ...baseElementSettings.data, ...overrides.data },
    typography: { ...baseElementSettings.typography, ...overrides.typography },
    businessRules: { ...baseElementSettings.businessRules, ...overrides.businessRules }
  };
};

export default baseElementSettings;
