/**
 * Settings Inheritance System
 * Implements 6-layer settings resolution for the page builder
 *
 * Inheritance Order (lowest to highest priority):
 * 1. Page defaults
 * 2. Zone settings
 * 3. Row settings
 * 4. Column settings
 * 5. Element settings
 * 6. Structure (nested) settings
 */

/**
 * Deep merge two objects
 * Later object properties override earlier ones
 */
function deepMerge(target, source) {
  if (!source) return target;
  if (!target) return source;

  const result = { ...target };

  Object.keys(source).forEach(key => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (
      sourceValue &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      // Both are objects, merge them recursively
      result[key] = deepMerge(targetValue, sourceValue);
    } else if (sourceValue !== undefined) {
      // Override with source value
      result[key] = sourceValue;
    }
  });

  return result;
}

/**
 * Merge settings from all layers
 * @param {Object} layers - Object containing settings from different layers
 * @param {Object} layers.page - Page-level settings
 * @param {Object} layers.zone - Zone-level settings
 * @param {Object} layers.row - Row-level settings
 * @param {Object} layers.column - Column-level settings
 * @param {Object} layers.element - Element-level settings
 * @param {Object} layers.structure - Structure (nested) settings
 * @returns {Object} Merged settings object
 */
export function resolveSettings(layers = {}) {
  const {
    page = {},
    zone = {},
    row = {},
    column = {},
    element = {},
    structure = {}
  } = layers;

  // Start with empty base
  let resolved = {};

  // Apply settings in order of priority (lowest to highest)
  resolved = deepMerge(resolved, page);
  resolved = deepMerge(resolved, zone);
  resolved = deepMerge(resolved, row);
  resolved = deepMerge(resolved, column);
  resolved = deepMerge(resolved, element);
  resolved = deepMerge(resolved, structure);

  return resolved;
}

/**
 * Get settings for a specific setting group
 * @param {Object} settings - Merged settings object
 * @param {string} group - Setting group name (layout, appearance, data, typography, businessRules)
 * @returns {Object} Settings for the specified group
 */
export function getSettingGroup(settings, group) {
  return settings?.[group] || {};
}

/**
 * Get all setting groups from merged settings
 * @param {Object} settings - Merged settings object
 * @returns {Object} Object containing all setting groups
 */
export function getSettingGroups(settings) {
  return {
    layout: getSettingGroup(settings, 'layout'),
    appearance: getSettingGroup(settings, 'appearance'),
    data: getSettingGroup(settings, 'data'),
    typography: getSettingGroup(settings, 'typography'),
    businessRules: getSettingGroup(settings, 'businessRules'),
    structure: getSettingGroup(settings, 'structure'),
  };
}

/**
 * Extract settings from page structure for a specific element
 * @param {Object} page - Page object
 * @param {Object} path - Element path { zoneId, rowIndex, columnIndex, elementIndex }
 * @returns {Object} Merged settings for the element
 */
export function getElementSettings(page, path) {
  const { zoneId, rowIndex, columnIndex, elementIndex } = path;

  // Get page defaults
  const pageSettings = page.settings || {};

  // Get zone
  const zone = page.zones?.find(z => z.id === zoneId);
  if (!zone) {
    return resolveSettings({ page: pageSettings });
  }

  const zoneSettings = zone.settings || {};

  // Get row
  const row = zone.rows?.[rowIndex];
  if (!row) {
    return resolveSettings({
      page: pageSettings,
      zone: zoneSettings
    });
  }

  const rowSettings = row.settings || {};

  // Get column
  const column = row.columns?.[columnIndex];
  if (!column) {
    return resolveSettings({
      page: pageSettings,
      zone: zoneSettings,
      row: rowSettings
    });
  }

  const columnSettings = column.settings || {};

  // Get element
  const element = column.elements?.[elementIndex];
  if (!element) {
    return resolveSettings({
      page: pageSettings,
      zone: zoneSettings,
      row: rowSettings,
      column: columnSettings
    });
  }

  const elementSettings = element.settings || {};

  // Resolve all layers
  return resolveSettings({
    page: pageSettings,
    zone: zoneSettings,
    row: rowSettings,
    column: columnSettings,
    element: elementSettings
  });
}

/**
 * Get settings for a nested structure element
 * @param {Object} parentSettings - Parent element's resolved settings
 * @param {Object} structureSettings - Structure element's own settings
 * @returns {Object} Merged settings including structure inheritance
 */
export function getStructureSettings(parentSettings, structureSettings) {
  return resolveSettings({
    element: parentSettings,
    structure: structureSettings
  });
}

/**
 * Check if a setting value is explicitly set (not inherited)
 * @param {Object} settings - Element's own settings (not resolved)
 * @param {string} group - Setting group name
 * @param {string} key - Setting key
 * @returns {boolean} True if the setting is explicitly set
 */
export function isSettingExplicit(settings, group, key) {
  return settings?.[group]?.[key] !== undefined;
}

/**
 * Get inheritance chain for a setting
 * Shows which layer provided the final value
 * @param {Object} layers - All setting layers
 * @param {string} group - Setting group name
 * @param {string} key - Setting key
 * @returns {Object} { value, source } where source is the layer name
 */
export function getSettingSource(layers, group, key) {
  const sources = ['structure', 'element', 'column', 'row', 'zone', 'page'];

  for (const source of sources) {
    const value = layers[source]?.[group]?.[key];
    if (value !== undefined) {
      return { value, source };
    }
  }

  return { value: undefined, source: null };
}

/**
 * Validate settings against schema
 * @param {Object} settings - Settings to validate
 * @param {Object} schema - Schema object (from element schemas)
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validateSettings(settings, schema) {
  const errors = [];

  if (!schema) {
    return { valid: true, errors: [] };
  }

  // This is a simplified validation
  // In a real implementation, you'd use the full schema validation
  Object.keys(settings).forEach(group => {
    const groupSettings = settings[group];
    const groupSchema = schema.settingGroups?.[group];

    if (!groupSchema) {
      errors.push(`Unknown setting group: ${group}`);
      return;
    }

    Object.keys(groupSettings).forEach(key => {
      const value = groupSettings[key];
      const fieldSchema = groupSchema.settings?.[key];

      if (!fieldSchema) {
        errors.push(`Unknown setting: ${group}.${key}`);
      }
    });
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Create default settings for an element type
 * @param {string} elementType - Element type (field, markup, structure, record)
 * @param {string} subType - Specific type (e.g., 'text', 'title', 'card')
 * @returns {Object} Default settings object
 */
export function createDefaultSettings(elementType, subType) {
  const defaults = {
    field: {
      layout: {
        width: '{{theme.sizes.full}}',
        padding: '{{theme.spacing.2}}',
      },
      appearance: {
        border: '1px solid {{theme.colors.border.default}}',
        borderRadius: '{{theme.borderRadius.md}}',
      },
      typography: {
        fontSize: '{{theme.typography.fontSize.base}}',
      },
    },
    markup: {
      typography: {
        fontSize: '{{theme.typography.fontSize.base}}',
        lineHeight: '{{theme.typography.lineHeight.normal}}',
      },
    },
    structure: {
      layout: {
        padding: '{{theme.spacing.4}}',
        gap: '{{theme.spacing.4}}',
      },
    },
    record: {
      layout: {
        gap: '{{theme.spacing.2}}',
      },
    },
  };

  return defaults[elementType] || {};
}

/**
 * Export deep merge for external use
 */
export { deepMerge };
