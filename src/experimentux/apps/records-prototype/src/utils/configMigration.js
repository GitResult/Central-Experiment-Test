/**
 * Configuration Migration Utility
 *
 * Migrates existing page configurations to the Unified Page System format.
 * Preserves all existing data and settings.
 */

import { LAYOUT_PRESETS } from '../components/layouts/presets';

/**
 * Migrate a page configuration to the Unified Page System format
 *
 * @param {Object} oldConfig - Existing page configuration
 * @param {string} oldType - Type of the old page ('database' | 'record' | 'blank')
 * @returns {Object} New UniversalPage configuration
 */
export const migrateToUnifiedConfig = (oldConfig, oldType) => {
  console.log(`Migrating ${oldType} page to UniversalPage format...`, oldConfig);

  switch (oldType) {
    case 'database':
      return migrateDatabasePage(oldConfig);
    case 'record':
      return migrateRecordPage(oldConfig);
    case 'blank':
      return createBlankPage(oldConfig);
    default:
      console.warn(`Unknown page type: ${oldType}, creating blank page`);
      return createBlankPage(oldConfig);
  }
};

/**
 * Migrate a Database Page from App.jsx format (settings.cover/header/body)
 * to UniversalPage format
 *
 * This handles the specific format used in App.jsx where:
 * - activePage.settings.cover = { enabled, image, verticalPosition }
 * - activePage.settings.header = { icon, title, description }
 * - activePage.settings.body = { elements, showSlashInput }
 *
 * @param {Object} activePage - Page object from App.jsx customPages array
 * @returns {Object} UniversalPage configuration
 */
export const migrateDatabasePageFromAppFormat = (activePage) => {
  const settings = activePage.settings || {};
  const cover = settings.cover || {};
  const header = settings.header || {};
  const body = settings.body || {};

  // Transform to format expected by migrateDatabasePage
  const transformedConfig = {
    id: activePage.id,
    name: activePage.name,
    cover: cover.enabled ? {
      url: cover.image,
      verticalPosition: cover.verticalPosition || 50,
      alt: 'Cover Image',
      height: '340px'
    } : null,
    icon: header.icon,
    title: header.title || activePage.name || 'Untitled',
    description: header.description,
    body: {
      elements: body.elements || []
    }
  };

  return migrateDatabasePage(transformedConfig);
};

/**
 * Migrate a Database Page (Notion-style) to UniversalPage format
 *
 * Database pages have:
 * - Optional cover image
 * - Optional page icon (emoji)
 * - Title
 * - Body with various elements
 */
const migrateDatabasePage = (oldConfig) => {
  const preset = { ...LAYOUT_PRESETS['database-page'] };

  // Map zones from preset
  const zones = preset.zones.map(zone => {
    switch (zone.type) {
      case 'cover':
        return migrateCoverZone(zone, oldConfig.cover);

      case 'header':
        return migrateHeaderZone(zone, oldConfig);

      case 'body':
        return migrateBodyZone(zone, oldConfig.body);

      default:
        return zone;
    }
  });

  return {
    id: oldConfig.id,
    name: oldConfig.name,
    layoutPresetId: 'database-page',
    zones,
    features: {
      ...preset.features,
      insertMethod: 'slash',
      showSlashHint: true,
      allowZoneToggle: true
    },
    metadata: {
      migratedFrom: 'database-page',
      migratedAt: new Date().toISOString(),
      originalConfig: oldConfig // Keep original for reference
    }
  };
};

/**
 * Migrate a Data Record Page (3-zone layout) to UniversalPage format
 *
 * Record pages have:
 * - Header zone (metadata, title)
 * - Body zone (main content, often with cards)
 * - Footer zone (actions, metadata)
 */
const migrateRecordPage = (oldConfig) => {
  const preset = { ...LAYOUT_PRESETS['data-record'] };

  // Map zones from preset
  const zones = preset.zones.map(zone => {
    switch (zone.type) {
      case 'header':
        return migrateRecordHeaderZone(zone, oldConfig.header);

      case 'body':
        return migrateRecordBodyZone(zone, oldConfig.body);

      case 'footer':
        return migrateRecordFooterZone(zone, oldConfig.footer);

      default:
        return zone;
    }
  });

  return {
    layoutPresetId: 'data-record',
    zones,
    features: {
      ...preset.features,
      insertMethod: 'both',
      showSlashHint: false,
      allowZoneToggle: true
    },
    metadata: {
      migratedFrom: 'data-record',
      migratedAt: new Date().toISOString(),
      originalConfig: oldConfig
    }
  };
};

/**
 * Create a blank page configuration
 */
const createBlankPage = (oldConfig = {}) => {
  const preset = { ...LAYOUT_PRESETS['blank'] };

  return {
    layoutPresetId: 'blank',
    zones: preset.zones,
    features: preset.features,
    metadata: {
      migratedFrom: 'blank',
      migratedAt: new Date().toISOString(),
      originalConfig: oldConfig
    }
  };
};

/**
 * Migrate cover zone for database pages
 */
const migrateCoverZone = (zone, coverConfig = {}) => {
  if (!coverConfig || !coverConfig.url) {
    return { ...zone, visible: false };
  }

  return {
    ...zone,
    visible: true,
    rows: [
      {
        id: `row-cover`,
        columns: [
          {
            id: `col-cover`,
            span: 12,
            elements: [
              {
                id: `elem-cover`,
                type: 'cover-image',
                data: {
                  url: coverConfig.url,
                  alt: coverConfig.alt || 'Cover image',
                  position: coverConfig.verticalPosition || 50
                },
                settings: {
                  height: coverConfig.height || '300px'
                }
              }
            ]
          }
        ]
      }
    ]
  };
};

/**
 * Migrate header zone for database pages
 */
const migrateHeaderZone = (zone, oldConfig) => {
  const elements = [];

  // Add page icon if present
  if (oldConfig.icon) {
    elements.push({
      id: `elem-icon`,
      type: 'page-icon',
      data: {
        icon: oldConfig.icon,
        size: oldConfig.iconSize || 'lg'
      },
      settings: {}
    });
  }

  // Add title
  if (oldConfig.title) {
    elements.push({
      id: `elem-title`,
      type: 'title',
      data: {
        content: oldConfig.title
      },
      settings: {
        fontSize: '4xl',
        fontWeight: 'bold'
      }
    });
  }

  // Add description if present
  if (oldConfig.description) {
    elements.push({
      id: `elem-description`,
      type: 'description',
      data: {
        content: oldConfig.description
      },
      settings: {}
    });
  }

  return {
    ...zone,
    visible: true,
    rows: [
      {
        id: `row-header`,
        columns: [
          {
            id: `col-header`,
            span: 12,
            elements
          }
        ]
      }
    ]
  };
};

/**
 * Migrate body zone (handles elements from old format)
 */
const migrateBodyZone = (zone, bodyConfig = {}) => {
  const elements = (bodyConfig.elements || []).map((elem, index) =>
    migrateElement(elem, `elem-${index}`)
  );

  // Group elements into rows (for now, one element per row)
  const rows = elements.map((elem, index) => ({
    id: `row-body-${index}`,
    columns: [
      {
        id: `col-body-${index}`,
        span: 12,
        elements: [elem]
      }
    ]
  }));

  return {
    ...zone,
    visible: true,
    rows
  };
};

/**
 * Migrate record header zone
 */
const migrateRecordHeaderZone = (zone, headerConfig = {}) => {
  const elements = [];

  // Add breadcrumb if present
  if (headerConfig.breadcrumb) {
    elements.push({
      id: `elem-breadcrumb`,
      type: 'breadcrumb',
      data: {
        items: headerConfig.breadcrumb
      },
      settings: {}
    });
  }

  // Add title
  if (headerConfig.title) {
    elements.push({
      id: `elem-title`,
      type: 'title',
      data: {
        content: headerConfig.title
      },
      settings: {}
    });
  }

  // Add metadata bar if present
  if (headerConfig.metadata) {
    elements.push({
      id: `elem-metadata`,
      type: 'metadata-bar',
      data: {
        fields: headerConfig.metadata
      },
      settings: {}
    });
  }

  return {
    ...zone,
    visible: true,
    rows: [
      {
        id: `row-header`,
        columns: [
          {
            id: `col-header`,
            span: 12,
            elements
          }
        ]
      }
    ]
  };
};

/**
 * Migrate record body zone
 */
const migrateRecordBodyZone = (zone, bodyConfig = {}) => {
  // Similar to database body migration
  return migrateBodyZone(zone, bodyConfig);
};

/**
 * Migrate record footer zone
 */
const migrateRecordFooterZone = (zone, footerConfig = {}) => {
  const elements = (footerConfig.elements || []).map((elem, index) =>
    migrateElement(elem, `elem-footer-${index}`)
  );

  return {
    ...zone,
    visible: footerConfig.visible !== false,
    rows: [
      {
        id: `row-footer`,
        columns: [
          {
            id: `col-footer`,
            span: 12,
            elements
          }
        ]
      }
    ]
  };
};

/**
 * Migrate individual element to new format
 */
const migrateElement = (oldElem, id) => {
  // Map old element types to new element types
  const typeMapping = {
    'text': 'text',
    'heading': 'heading',
    'title': 'title',
    'description': 'description',
    'image': 'image',
    'button': 'button',
    'data': 'data-grid',
    'list': 'text', // Lists become text elements for now
    'checkbox': 'text', // Checklists become text elements for now
    'card': 'content-card',
    'grid': 'grid-layout',
    'canvas': 'canvas-layout'
  };

  const newType = typeMapping[oldElem.type] || 'text';

  return {
    id: oldElem.id || id,
    type: newType,
    data: oldElem.data || { content: oldElem.content || '' },
    settings: oldElem.settings || {}
  };
};

/**
 * Check if a configuration is already in UniversalPage format
 *
 * @param {Object} config - Configuration to check
 * @returns {boolean} True if already in UniversalPage format
 */
export const isUniversalPageConfig = (config) => {
  return config && config.zones && Array.isArray(config.zones);
};

/**
 * Batch migrate multiple pages
 *
 * @param {Array} pages - Array of {config, type} objects
 * @returns {Array} Array of migrated configurations
 */
export const batchMigrate = (pages) => {
  return pages.map(({ config, type }) => {
    if (isUniversalPageConfig(config)) {
      console.log(`Page already in UniversalPage format, skipping migration`);
      return config;
    }
    return migrateToUnifiedConfig(config, type);
  });
};

/**
 * Validate migrated configuration
 *
 * @param {Object} config - Configuration to validate
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export const validateMigratedConfig = (config) => {
  const errors = [];

  if (!config.zones || !Array.isArray(config.zones)) {
    errors.push('Configuration must have a zones array');
  }

  if (!config.layoutPresetId) {
    errors.push('Configuration must have a layoutPresetId');
  }

  config.zones?.forEach((zone, zoneIndex) => {
    if (!zone.id) {
      errors.push(`Zone ${zoneIndex} missing id`);
    }
    if (!zone.type) {
      errors.push(`Zone ${zoneIndex} missing type`);
    }
    if (!Array.isArray(zone.rows)) {
      errors.push(`Zone ${zoneIndex} missing rows array`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
};
