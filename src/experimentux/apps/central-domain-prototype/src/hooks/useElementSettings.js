/**
 * useElementSettings Hook
 * Provides resolved settings for elements using the 6-layer inheritance system
 */

import { useMemo } from 'react';
import { useEditorStore } from '../store/editorStore';
import {
  resolveSettings,
  getSettingGroups,
  getElementSettings,
  getStructureSettings,
} from '../utils/settingsInheritance';

/**
 * Get resolved settings for an element
 * @param {Object} elementPath - Path to the element { zoneId, rowIndex, columnIndex, elementIndex }
 * @param {Object} options - Additional options
 * @param {Object} options.parentSettings - Parent element settings (for nested structures)
 * @param {Object} options.overrides - Settings to override (highest priority)
 * @returns {Object} Resolved settings with all inheritance applied
 */
export function useElementSettings(elementPath, options = {}) {
  const currentPage = useEditorStore((state) => state.currentPage);
  const { parentSettings, overrides } = options;

  const resolvedSettings = useMemo(() => {
    if (!elementPath || !currentPage) {
      return {};
    }

    // Get base settings from page structure
    const baseSettings = getElementSettings(currentPage, elementPath);

    // If this is a nested structure element, apply parent settings
    let finalSettings = baseSettings;
    if (parentSettings) {
      const element = currentPage.zones
        ?.find(z => z.id === elementPath.zoneId)
        ?.rows?.[elementPath.rowIndex]
        ?.columns?.[elementPath.columnIndex]
        ?.elements?.[elementPath.elementIndex];

      if (element) {
        finalSettings = getStructureSettings(parentSettings, element.settings || {});
      }
    }

    // Apply overrides if provided
    if (overrides) {
      finalSettings = resolveSettings({
        element: finalSettings,
        structure: overrides,
      });
    }

    return finalSettings;
  }, [currentPage, elementPath, parentSettings, overrides]);

  return resolvedSettings;
}

/**
 * Get resolved setting groups for an element
 * @param {Object} elementPath - Path to the element
 * @param {Object} options - Additional options
 * @returns {Object} { layout, appearance, data, typography, businessRules, structure }
 */
export function useSettingGroups(elementPath, options = {}) {
  const settings = useElementSettings(elementPath, options);
  return useMemo(() => getSettingGroups(settings), [settings]);
}

/**
 * Get a specific setting group
 * @param {Object} elementPath - Path to the element
 * @param {string} groupName - Name of the setting group
 * @param {Object} options - Additional options
 * @returns {Object} Settings for the specified group
 */
export function useSettingGroup(elementPath, groupName, options = {}) {
  const settings = useElementSettings(elementPath, options);
  return useMemo(() => settings?.[groupName] || {}, [settings, groupName]);
}

/**
 * Get page-level default settings
 * @returns {Object} Page default settings
 */
export function usePageSettings() {
  const currentPage = useEditorStore((state) => state.currentPage);
  return useMemo(() => currentPage?.settings || {}, [currentPage]);
}

/**
 * Get zone-level settings
 * @param {string} zoneId - Zone identifier
 * @returns {Object} Zone settings
 */
export function useZoneSettings(zoneId) {
  const currentPage = useEditorStore((state) => state.currentPage);

  return useMemo(() => {
    const zone = currentPage?.zones?.find(z => z.id === zoneId);
    return zone?.settings || {};
  }, [currentPage, zoneId]);
}

/**
 * Get row-level settings
 * @param {string} zoneId - Zone identifier
 * @param {number} rowIndex - Row index
 * @returns {Object} Row settings
 */
export function useRowSettings(zoneId, rowIndex) {
  const currentPage = useEditorStore((state) => state.currentPage);

  return useMemo(() => {
    const zone = currentPage?.zones?.find(z => z.id === zoneId);
    const row = zone?.rows?.[rowIndex];
    return row?.settings || {};
  }, [currentPage, zoneId, rowIndex]);
}

/**
 * Get column-level settings
 * @param {string} zoneId - Zone identifier
 * @param {number} rowIndex - Row index
 * @param {number} columnIndex - Column index
 * @returns {Object} Column settings
 */
export function useColumnSettings(zoneId, rowIndex, columnIndex) {
  const currentPage = useEditorStore((state) => state.currentPage);

  return useMemo(() => {
    const zone = currentPage?.zones?.find(z => z.id === zoneId);
    const row = zone?.rows?.[rowIndex];
    const column = row?.columns?.[columnIndex];
    return column?.settings || {};
  }, [currentPage, zoneId, rowIndex, columnIndex]);
}

/**
 * Update settings at a specific layer
 * @param {Object} path - Path to the layer
 * @param {string} path.layer - Layer name (page, zone, row, column, element)
 * @param {string} path.zoneId - Zone ID (for zone/row/column/element)
 * @param {number} path.rowIndex - Row index (for row/column/element)
 * @param {number} path.columnIndex - Column index (for column/element)
 * @param {number} path.elementIndex - Element index (for element)
 * @param {Object} updates - Settings updates to apply
 */
export function useUpdateSettings() {
  const updatePageMetadata = useEditorStore((state) => state.updatePageMetadata);
  const updateZoneSettings = useEditorStore((state) => state.updateZoneSettings);
  const updateRowSettings = useEditorStore((state) => state.updateRowSettings);
  const updateColumnSettings = useEditorStore((state) => state.updateColumnSettings);
  const updateElement = useEditorStore((state) => state.updateElement);

  return (path, updates) => {
    const { layer, zoneId, rowIndex, columnIndex, elementIndex } = path;

    switch (layer) {
      case 'page':
        updatePageMetadata({ settings: updates });
        break;

      case 'zone':
        updateZoneSettings(zoneId, updates);
        break;

      case 'row':
        updateRowSettings(zoneId, rowIndex, updates);
        break;

      case 'column':
        updateColumnSettings(zoneId, rowIndex, columnIndex, updates);
        break;

      case 'element':
        updateElement(
          { zoneId, rowIndex, columnIndex, elementIndex },
          { settings: updates }
        );
        break;

      default:
        console.error(`Unknown layer: ${layer}`);
    }
  };
}
