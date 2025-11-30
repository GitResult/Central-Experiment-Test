/**
 * Default Notion-Style Page Configuration
 *
 * Creates a beautiful, complete page that's immediately ready to use.
 * Unlike a "blank" page, this is a PROPER database page with all the visual elements
 * that make Notion pages feel polished and professional.
 */

export const BLANK_DATABASE_PAGE = {
  layoutPresetId: 'database-page',
  containerWidth: 'standard',  // 900px - reading-optimized width

  zones: [
    // Cover zone - Hidden by default, user can enable via settings
    {
      id: 'cover',
      type: 'cover',
      visible: false,  // Hidden until user adds cover image
      containerWidth: 'full',
      padding: { x: 0, y: 0 },
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
                    url: '',  // Empty but visible - users can click to add
                    position: 50
                  },
                  settings: {
                    height: '300px',
                    placeholder: 'Add cover image'
                  }
                }
              ]
            }
          ]
        }
      ]
    },

    // Header zone with COMPLETE Notion-style layout
    {
      id: 'header',
      type: 'header',
      visible: true,
      containerWidth: 'standard',
      padding: { x: 8, y: 6 },
      rows: [
        // Icon row
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
                    size: 'xl'  // Large like Notion
                  }
                }
              ]
            }
          ]
        },
        // Title row
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
        // Description row
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

    // Body zone - ready for content
    {
      id: 'body',
      type: 'body',
      visible: true,
      containerWidth: 'standard',
      padding: { x: 8, y: 8 },
      rows: [
        {
          id: 'body-row-1',
          columns: [
            {
              id: 'body-col-0',
              span: 12,
              elements: []
            }
          ]
        }
      ]
    },

    // Footer zone (hidden by default but easily toggleable)
    {
      id: 'footer',
      type: 'footer',
      visible: false,
      containerWidth: 'standard',
      padding: { x: 8, y: 4 },
      rows: []
    }
  ],

  // Enable all drag-and-drop features
  features: {
    insertMethod: 'both',        // Slash commands + drag-drop panel
    showSlashHint: true,          // Show "Type / for commands" hint
    allowZoneToggle: true,        // Let users show/hide cover and footer
    enableDragReorder: true,      // Enable drag-to-reorder elements
    focusOnLoad: 'page-title'     // Auto-focus title for immediate typing
  }
};

/**
 * Create a blank page record
 *
 * @param {Object} options - Optional overrides
 * @returns {Object} New blank page record
 */
export const createBlankPage = (options = {}) => {
  const timestamp = Date.now();

  return {
    id: options.id || `PAGE-${timestamp}`,
    title: options.title || 'Untitled',
    templateId: 'blank',
    customData: {},
    pageConfig: BLANK_DATABASE_PAGE,
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: options.createdBy || 'current-user'
    },
    ...options
  };
};
