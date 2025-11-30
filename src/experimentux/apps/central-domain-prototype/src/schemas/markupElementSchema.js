/**
 * Markup Element Schema
 * Type: markup (ui domain - ephemeral, not persisted)
 * Purpose: Content presentation elements - text, buttons, icons
 * Reference: GENERIC_ELEMENT_TYPES.md § 3. Markup Element
 */

import { baseElementSettings } from './baseElementSettings';

/**
 * Markup types (subtypes)
 */
export const markupTypes = [
  // Text elements
  'title',      // Page titles (h1)
  'heading',    // Section headings (h2-h6)
  'paragraph',  // Body text
  'subtitle',   // Descriptions, captions
  'label',      // Small labels, tags
  'quote',      // Blockquote
  'code',       // Code block
  'html',       // Raw HTML content (for combos/templates)

  // Interactive elements
  'button',     // CTA button (navigation only)
  'link',       // Text hyperlink

  // Decorative elements
  'icon',       // Icon/emoji
  'divider',    // Horizontal rule separator
  'spacer'      // Vertical spacing block
];

/**
 * Markup-specific settings
 */
export const markupSpecificSettings = {
  markupType: 'paragraph', // Required subtype

  // For text types (title, heading, paragraph, subtitle)
  editMode: 'click', // 'always' | 'click' | 'double-click' | 'readonly'
  placeholder: '',
  textAlign: 'left', // 'left' | 'center' | 'right' | 'justify'

  // For heading type
  level: 2, // 1 | 2 | 3 | 4 | 5 | 6

  // For spacer type
  height: '{{theme.spacing.md}}',

  // For divider type
  thickness: '1px',
  dividerStyle: 'solid', // 'solid' | 'dashed' | 'dotted'

  // For button/link types
  url: '',
  target: '_self', // '_self' | '_blank'
  variant: 'primary', // 'primary' | 'secondary' | 'ghost'

  // For icon type
  icon: '',
  size: 'md', // 'sm' | 'md' | 'lg' | 'xl'
  pickerType: 'modal' // 'modal' | 'cycle' | 'none'
};

/**
 * Default markup element structure
 */
export const defaultMarkupElement = {
  type: 'markup',
  data: {
    content: '' // String content, null for spacer/divider
  },
  settings: {
    ...baseElementSettings,
    markup: markupSpecificSettings
  }
};

/**
 * Create markup element with defaults
 * @param {string} markupType - Markup type (title, heading, etc.)
 * @param {Object} overrides - Setting overrides
 * @returns {Object} Complete markup element
 */
export const createMarkupElement = (markupType = 'paragraph', overrides = {}) => {
  // Type-specific defaults
  const typeDefaults = {
    title: {
      typography: {
        fontSize: '{{theme.typography.fontSize.4xl}}',
        fontWeight: '{{theme.typography.fontWeight.bold}}'
      },
      markup: {
        editMode: 'always',
        placeholder: '{{i18n.elements.title.placeholder}}'
      }
    },
    heading: {
      typography: {
        fontSize: '{{theme.typography.fontSize.2xl}}',
        fontWeight: '{{theme.typography.fontWeight.semibold}}'
      }
    },
    subtitle: {
      typography: {
        fontSize: '{{theme.typography.fontSize.base}}',
        color: '{{theme.colors.text.secondary}}'
      },
      markup: {
        editMode: 'always',
        placeholder: '{{i18n.elements.description.placeholder}}'
      }
    },
    divider: {
      data: { content: null },
      appearance: {
        border: { color: '{{theme.colors.border.default}}' }
      },
      layout: {
        spacing: {
          margin: {
            top: '{{theme.spacing.lg}}',
            bottom: '{{theme.spacing.lg}}'
          }
        }
      }
    },
    spacer: {
      data: { content: null }
    },
    icon: {
      layout: {
        spacing: {
          margin: { bottom: '{{theme.spacing.sm}}' }
        }
      },
      markup: {
        size: 'xl',
        pickerType: 'modal'
      }
    }
  };

  const defaults = typeDefaults[markupType] || {};

  return {
    id: `markup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'markup',
    data: {
      content: defaults.data?.content ?? overrides.data?.content ?? ''
    },
    settings: {
      layout: { ...baseElementSettings.layout, ...defaults.layout, ...overrides.layout },
      appearance: { ...baseElementSettings.appearance, ...defaults.appearance, ...overrides.appearance },
      data: { ...baseElementSettings.data, ...defaults.data, ...overrides.data },
      typography: { ...baseElementSettings.typography, ...defaults.typography, ...overrides.typography },
      businessRules: { ...baseElementSettings.businessRules, ...defaults.businessRules, ...overrides.businessRules },
      markup: {
        ...markupSpecificSettings,
        markupType,
        ...defaults.markup,
        ...overrides.markup
      }
    }
  };
};

/**
 * Validate markup element
 * @param {Object} element - Markup element to validate
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export const validateMarkupElement = (element) => {
  const errors = [];

  if (element.type !== 'markup') {
    errors.push(`Invalid type: expected 'markup', got '${element.type}'`);
  }

  if (!element.settings?.markup) {
    errors.push('Missing required settings.markup');
  }

  if (!element.settings?.markup?.markupType) {
    errors.push('Missing required settings.markup.markupType');
  }

  if (element.settings?.markup?.markupType && !markupTypes.includes(element.settings.markup.markupType)) {
    errors.push(`Invalid markupType: '${element.settings.markup.markupType}'. Must be one of: ${markupTypes.join(', ')}`);
  }

  // Validate heading level
  if (element.settings?.markup?.markupType === 'heading') {
    const level = element.settings.markup.level;
    if (level && (level < 1 || level > 6)) {
      errors.push(`Invalid heading level: ${level}. Must be between 1 and 6`);
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export default {
  markupTypes,
  markupSpecificSettings,
  defaultMarkupElement,
  createMarkupElement,
  validateMarkupElement
};
