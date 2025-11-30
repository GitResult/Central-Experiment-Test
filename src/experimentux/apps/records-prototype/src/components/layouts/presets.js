/**
 * Layout Presets
 *
 * Pre-configured page layouts that users can select as starting points.
 * Similar to templates in Squarespace, Wix, or Duda.
 *
 * Each preset defines a complete zone configuration that can be used
 * for both standalone pages and canvas frames.
 */

export const LAYOUT_PRESETS = {
  /**
   * Database Page Layout (Notion-style)
   *
   * Features: Cover image, icon, title, description, flexible content
   * Use case: Documentation, wikis, content pages, database records
   */
  'database-page': {
    id: 'database-page',
    name: 'Database Page',
    description: 'Cover image, icon, title, description and flexible content blocks',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    zones: [
      {
        id: 'cover',
        type: 'cover',
        visible: false, // Hidden by default - user can enable via settings
        containerWidth: 'full',
        padding: { x: 0, y: 0 },
        background: '',
        border: false,
        rows: [
          {
            id: 'cover-row',
            columns: [
              {
                id: 'cover-col',
                span: 12,
                elements: [
                  {
                    id: 'cover-image',
                    type: 'cover-image',
                    data: {
                      url: '',
                      position: 50
                    },
                    settings: {
                      height: '300px'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'header',
        type: 'header',
        visible: true,
        containerWidth: 'standard', // 900px for better readability
        padding: { x: 8, y: 6 },
        background: '',
        border: false,
        rows: [
          {
            id: 'icon-row',
            columns: [
              {
                id: 'icon-col',
                span: 12,
                elements: [
                  {
                    id: 'page-icon',
                    type: 'page-icon',
                    data: {
                      icon: '📄',
                      editable: true
                    },
                    settings: {
                      size: 'xl'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'title-row',
            columns: [
              {
                id: 'title-col',
                span: 12,
                elements: [
                  {
                    id: 'page-title',
                    type: 'title',
                    data: {
                      content: 'Untitled',
                      editable: true
                    },
                    settings: {
                      fontSize: '4xl',
                      fontWeight: 'bold',
                      color: 'text-gray-900'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'description-row',
            columns: [
              {
                id: 'description-col',
                span: 12,
                elements: [
                  {
                    id: 'page-description',
                    type: 'description',
                    data: {
                      content: 'Add a description...',
                      editable: true
                    },
                    settings: {
                      fontSize: 'base',
                      color: 'text-gray-500'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'body',
        type: 'body',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 8, y: 8 },
        background: '',
        border: false,
        rows: [] // Empty - user adds content via slash commands
      }
    ],
    features: {
      insertMethod: 'both', // Slash commands + drag-drop panel
      showSlashHint: true,
      allowZoneToggle: true,
      enableDragReorder: true,
      focusOnLoad: 'page-title'
    }
  },

  /**
   * Data Record Layout (3-Zone)
   *
   * Features: Header with breadcrumb/actions, full-width body, footer with metadata
   * Use case: Data records, forms, structured content
   */
  'data-record': {
    id: 'data-record',
    name: 'Data Record',
    description: 'Structured layout for data records with header and footer',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    zones: [
      {
        id: 'header',
        type: 'header',
        visible: true,
        containerWidth: 'standard', // 900px
        padding: { x: 8, y: 6 },
        background: '',
        border: false,
        rows: [
          // Breadcrumb, title, and actions will be added by user
        ]
      },
      {
        id: 'body',
        type: 'body',
        visible: true,
        containerWidth: 'full',
        padding: { x: 8, y: 8 },
        background: '',
        border: false,
        rows: [] // User adds form fields, data grids, etc.
      },
      {
        id: 'footer',
        type: 'footer',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 8, y: 6 },
        background: '',
        border: false,
        rows: [
          // Metadata will be added by user
        ]
      }
    ],
    features: {
      insertMethod: 'both', // Slash + drag-drop
      showSlashHint: false,
      allowZoneToggle: true
    }
  },

  /**
   * Blank Page Layout
   *
   * Features: Single body zone, minimal configuration
   * Use case: Starting from scratch
   */
  'blank': {
    id: 'blank',
    name: 'Blank Page',
    description: 'Start from scratch with an empty page',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    zones: [
      {
        id: 'body',
        type: 'body',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 8, y: 8 },
        background: '',
        border: false,
        rows: []
      }
    ],
    features: {
      insertMethod: 'both',
      showSlashHint: true,
      allowZoneToggle: true
    }
  },

  /**
   * Full Width Layout
   *
   * Features: Edge-to-edge content, no container constraints
   * Use case: Landing pages, hero sections, full-screen experiences
   */
  'full-width': {
    id: 'full-width',
    name: 'Full Width',
    description: 'Edge-to-edge content with no container constraints',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    zones: [
      {
        id: 'body',
        type: 'body',
        visible: true,
        containerWidth: 'full',
        padding: { x: 0, y: 0 },
        background: '',
        border: false,
        rows: []
      }
    ],
    features: {
      insertMethod: 'both',
      showSlashHint: true,
      allowZoneToggle: false
    }
  },

  /**
   * Event Landing Page Layout (Adobe Summit style)
   *
   * Features: Hero section, content grid, multiple zones
   * Use case: Marketing landing pages, event pages, product launches
   * Based on: EVENT_LANDING_ANALYSIS.md
   */
  'event-landing': {
    id: 'event-landing',
    name: 'Event Landing Page',
    description: 'Full-featured event landing with hero, content grid, and call-to-actions',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    zones: [
      {
        id: 'hero',
        type: 'hero',
        visible: true,
        containerWidth: 'full',
        padding: { x: 0, y: 0 },
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
        border: false,
        rows: []
      },
      {
        id: 'content',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 8, y: 12 },
        background: '#ffffff',
        border: false,
        rows: []
      },
      {
        id: 'cta',
        type: 'body',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 8, y: 12 },
        background: '#f9fafb',
        border: false,
        rows: []
      }
    ],
    features: {
      insertMethod: 'both',
      showSlashHint: false,
      allowZoneToggle: true
    }
  }
};

/**
 * Get layout preset by ID
 *
 * @param {string} presetId - Preset ID
 * @returns {Object|null} Preset configuration or null if not found
 */
export const getLayoutPreset = (presetId) => {
  return LAYOUT_PRESETS[presetId] || null;
};

/**
 * Get all layout preset IDs
 *
 * @returns {string[]} Array of preset IDs
 */
export const getLayoutPresetIds = () => {
  return Object.keys(LAYOUT_PRESETS);
};

/**
 * Get all layout presets as array
 *
 * Useful for rendering preset picker UIs.
 *
 * @returns {Array} Array of preset objects
 */
export const getLayoutPresetsArray = () => {
  return Object.entries(LAYOUT_PRESETS).map(([id, preset]) => ({
    ...preset,
    id
  }));
};

/**
 * Create page config from preset
 *
 * Deep clones preset to create a new page configuration.
 *
 * @param {string} presetId - Preset ID
 * @returns {Object|null} Page configuration or null if preset not found
 */
export const createPageConfigFromPreset = (presetId) => {
  const preset = LAYOUT_PRESETS[presetId];

  if (!preset) {
    return null;
  }

  // Deep clone to prevent mutations
  return {
    layoutPresetId: preset.id,
    zones: JSON.parse(JSON.stringify(preset.zones)),
    features: { ...preset.features }
  };
};
