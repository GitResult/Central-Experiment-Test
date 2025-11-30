/**
 * Structure Element Schema
 * Type: structure (ui domain - ephemeral, not persisted)
 * Purpose: Layout containers and structural elements
 * Reference: GENERIC_ELEMENT_TYPES.md § 4. Structure Element
 */

import { baseElementSettings } from './baseElementSettings';

export const structureTypes = [
  'div', 'stack', 'grid', 'flex', 'card', 'panel',
  'tabs', 'accordion', 'modal', 'drawer', 'carousel', 'canvas'
];

export const semanticRoles = [
  'content-group', 'hero', 'navigation', 'footer', 'sidebar', null
];

export const structureSpecificSettings = {
  structureType: 'div',
  semanticRole: null
};

export const createStructureElement = (structureType = 'div', overrides = {}) => {
  return {
    id: `structure-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'structure',
    settings: {
      layout: { ...baseElementSettings.layout, ...overrides.layout },
      appearance: { ...baseElementSettings.appearance, ...overrides.appearance },
      data: { ...baseElementSettings.data, ...overrides.data },
      typography: { ...baseElementSettings.typography, ...overrides.typography },
      businessRules: { ...baseElementSettings.businessRules, ...overrides.businessRules },
      structure: { ...structureSpecificSettings, structureType, ...overrides.structure }
    },
    elements: overrides.elements || []
  };
};

export const validateStructureElement = (element, depth = 0) => {
  const errors = [];
  if (element.type !== 'structure') errors.push(`Invalid type: expected 'structure', got '${element.type}'`);
  if (!element.settings?.structure) errors.push('Missing required settings.structure');
  if (!element.settings?.structure?.structureType) errors.push('Missing required settings.structure.structureType');
  if (element.settings?.structure?.structureType && !structureTypes.includes(element.settings.structure.structureType)) {
    errors.push(`Invalid structureType: '${element.settings.structure.structureType}'`);
  }
  if (!Array.isArray(element.elements)) errors.push('Structure must have elements array');

  // Validate nesting depth (max 3)
  if (depth > 3) {
    errors.push('Maximum nesting depth exceeded (max: 3)');
  }

  // Validate child elements recursively
  if (element.elements) {
    element.elements.forEach((child, index) => {
      if (child.type === 'structure') {
        const childValidation = validateStructureElement(child, depth + 1);
        if (!childValidation.valid) {
          errors.push(`Child ${index}: ${childValidation.errors.join(', ')}`);
        }
      }
    });
  }

  return { valid: errors.length === 0, errors };
};

export default { structureTypes, semanticRoles, structureSpecificSettings, createStructureElement, validateStructureElement };
