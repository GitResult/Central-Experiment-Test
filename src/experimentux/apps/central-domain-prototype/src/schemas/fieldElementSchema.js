/**
 * Field Element Schema
 * Type: field (data domain - persisted to database)
 * Purpose: Atomic data inputs that store user-entered values
 * Reference: GENERIC_ELEMENT_TYPES.md § 1. Field Element
 */

import { baseElementSettings } from './baseElementSettings';

/**
 * Field types (subtypes)
 */
export const fieldTypes = [
  'text',         // Single-line text input
  'textarea',     // Multi-line text input
  'email',        // Email with validation
  'number',       // Numeric input
  'date',         // Date picker
  'time',         // Time picker
  'selectSingle', // Single option selection
  'selectMulti',  // Multiple option selection
  'checkbox',     // Boolean checkbox
  'tel',          // Phone number
  'url',          // URL input
  'file',         // File upload
  'color',        // Color picker
  'range'         // Slider
];

/**
 * Input types (UI representation for select fields)
 */
export const inputTypes = [
  'dropdown',       // Standard dropdown menu
  'radio',          // Radio button group (selectSingle only)
  'pill',           // Pill/tag selector
  'checkbox-group', // Checkbox group (selectMulti only)
  'toggle',         // Toggle switches
  'button-group'    // Button group selector
];

/**
 * Field-specific settings
 */
export const fieldSpecificSettings = {
  fieldType: 'text', // Required subtype
  label: '',
  placeholder: '',
  helpText: '',
  required: false,
  disabled: false,
  readonly: false,

  // For selectSingle and selectMulti
  options: [], // Array<{ label: string, value: any }>
  inputType: 'dropdown' // UI representation
};

/**
 * Default field element structure
 */
export const defaultFieldElement = {
  type: 'field',
  data: {
    value: null // Varies by fieldType
  },
  settings: {
    ...baseElementSettings,
    field: fieldSpecificSettings
  }
};

/**
 * Create field element with defaults
 * @param {string} fieldType - Field type (text, email, etc.)
 * @param {Object} overrides - Setting overrides
 * @returns {Object} Complete field element
 */
export const createFieldElement = (fieldType = 'text', overrides = {}) => {
  return {
    id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'field',
    data: {
      value: overrides.data?.value ?? null
    },
    settings: {
      layout: { ...baseElementSettings.layout, ...overrides.layout },
      appearance: { ...baseElementSettings.appearance, ...overrides.appearance },
      data: { ...baseElementSettings.data, ...overrides.data },
      typography: { ...baseElementSettings.typography, ...overrides.typography },
      businessRules: { ...baseElementSettings.businessRules, ...overrides.businessRules },
      field: {
        ...fieldSpecificSettings,
        fieldType,
        ...overrides.field
      }
    }
  };
};

/**
 * Validate field element
 * @param {Object} element - Field element to validate
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export const validateFieldElement = (element) => {
  const errors = [];

  if (element.type !== 'field') {
    errors.push(`Invalid type: expected 'field', got '${element.type}'`);
  }

  if (!element.settings?.field) {
    errors.push('Missing required settings.field');
  }

  if (!element.settings?.field?.fieldType) {
    errors.push('Missing required settings.field.fieldType');
  }

  if (element.settings?.field?.fieldType && !fieldTypes.includes(element.settings.field.fieldType)) {
    errors.push(`Invalid fieldType: '${element.settings.field.fieldType}'. Must be one of: ${fieldTypes.join(', ')}`);
  }

  // Validate input type for select fields
  if (['selectSingle', 'selectMulti'].includes(element.settings?.field?.fieldType)) {
    if (element.settings.field.inputType && !inputTypes.includes(element.settings.field.inputType)) {
      errors.push(`Invalid inputType: '${element.settings.field.inputType}'. Must be one of: ${inputTypes.join(', ')}`);
    }

    // Radio only for selectSingle
    if (element.settings.field.inputType === 'radio' && element.settings.field.fieldType !== 'selectSingle') {
      errors.push('inputType "radio" is only valid for fieldType "selectSingle"');
    }

    // Checkbox-group only for selectMulti
    if (element.settings.field.inputType === 'checkbox-group' && element.settings.field.fieldType !== 'selectMulti') {
      errors.push('inputType "checkbox-group" is only valid for fieldType "selectMulti"');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

export default {
  fieldTypes,
  inputTypes,
  fieldSpecificSettings,
  defaultFieldElement,
  createFieldElement,
  validateFieldElement
};
