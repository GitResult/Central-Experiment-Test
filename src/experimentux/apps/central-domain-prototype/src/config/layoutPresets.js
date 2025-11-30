/**
 * Layout Presets Library
 * Pre-defined page layout templates for quick page setup
 * Reference: IMPLEMENTATION_PLAN.md § Phase 3
 *
 * Categories: marketing, dashboard, content, application, ecommerce, blank
 */

export const layoutPresets = {
  // ========================================
  // BLANK LAYOUTS
  // ========================================
  'single-column': {
    id: 'single-column',
    name: 'Single Column',
    description: 'Full-width single column layout',
    thumbnail: '/presets/single-column.svg',
    category: 'blank',
    zones: [
      {
        id: 'main-content',
        type: 'body',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 6, y: 6 },
        background: null,
        border: false,
        rows: [
          {
            id: 'row-1',
            columns: [
              { id: 'col-1', span: 12, elements: [] }
            ]
          }
        ]
      }
    ]
  },

  'two-column-6-6': {
    id: 'two-column-6-6',
    name: 'Two Columns (Equal)',
    description: '50/50 split two-column layout',
    thumbnail: '/presets/two-column-6-6.svg',
    category: 'blank',
    zones: [
      {
        id: 'main-content',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 6, y: 6 },
        background: null,
        border: false,
        rows: [
          {
            id: 'row-1',
            columns: [
              { id: 'col-1', span: 6, elements: [] },
              { id: 'col-2', span: 6, elements: [] }
            ]
          }
        ]
      }
    ]
  },

  'two-column-8-4': {
    id: 'two-column-8-4',
    name: 'Two Columns (Wide + Sidebar)',
    description: '67/33 split with main content and sidebar',
    thumbnail: '/presets/two-column-8-4.svg',
    category: 'blank',
    zones: [
      {
        id: 'main-content',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 6, y: 6 },
        background: null,
        border: false,
        rows: [
          {
            id: 'row-1',
            columns: [
              { id: 'col-main', span: 8, elements: [] },
              { id: 'col-sidebar', span: 4, elements: [] }
            ]
          }
        ]
      }
    ]
  },

  'three-column': {
    id: 'three-column',
    name: 'Three Columns',
    description: 'Equal three-column layout',
    thumbnail: '/presets/three-column.svg',
    category: 'blank',
    zones: [
      {
        id: 'main-content',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 6, y: 6 },
        background: null,
        border: false,
        rows: [
          {
            id: 'row-1',
            columns: [
              { id: 'col-1', span: 4, elements: [] },
              { id: 'col-2', span: 4, elements: [] },
              { id: 'col-3', span: 4, elements: [] }
            ]
          }
        ]
      }
    ]
  },

  'notion-style': {
    id: 'notion-style',
    name: 'Notion Style',
    description: 'Centered narrow column (Notion-like)',
    thumbnail: '/presets/notion-style.svg',
    category: 'content',
    zones: [
      {
        id: 'main-content',
        type: 'body',
        visible: true,
        containerWidth: 'notion',
        padding: { x: 8, y: 12 },
        background: null,
        border: false,
        rows: [
          {
            id: 'row-1',
            columns: [
              { id: 'col-1', span: 12, elements: [] }
            ]
          }
        ]
      }
    ]
  },

  'dashboard': {
    id: 'dashboard',
    name: 'Dashboard',
    description: 'Header + three-column body',
    thumbnail: '/presets/dashboard.svg',
    category: 'dashboard',
    zones: [
      {
        id: 'header-zone',
        type: 'header',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 6, y: 4 },
        background: null,
        border: false,
        rows: [
          {
            id: 'header-row',
            columns: [
              { id: 'header-col', span: 12, elements: [] }
            ]
          }
        ]
      },
      {
        id: 'body-zone',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 6, y: 6 },
        background: null,
        border: false,
        rows: [
          {
            id: 'dashboard-row',
            columns: [
              { id: 'col-1', span: 4, elements: [] },
              { id: 'col-2', span: 4, elements: [] },
              { id: 'col-3', span: 4, elements: [] }
            ]
          }
        ]
      }
    ]
  },

  // ========================================
  // MARKETING LAYOUTS
  // ========================================
  'hero-cta': {
    id: 'hero-cta',
    name: 'Hero + CTA',
    description: 'Full-width hero with call-to-action',
    thumbnail: '/presets/hero-cta.svg',
    category: 'marketing',
    zones: [
      {
        id: 'hero',
        type: 'header',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 8, y: 12 },
        background: null,
        border: false,
        rows: [
          {
            id: 'hero-row',
            columns: [
              { id: 'hero-col', span: 12, elements: [] }
            ]
          }
        ]
      },
      {
        id: 'cta',
        type: 'body',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 6, y: 8 },
        background: null,
        border: false,
        rows: [
          {
            id: 'cta-row',
            columns: [
              { id: 'cta-col', span: 12, elements: [] }
            ]
          }
        ]
      }
    ]
  },

  'features-grid': {
    id: 'features-grid',
    name: 'Features Grid',
    description: 'Three-column feature showcase',
    thumbnail: '/presets/features-grid.svg',
    category: 'marketing',
    zones: [
      {
        id: 'features',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 6, y: 6 },
        background: null,
        border: false,
        rows: [
          {
            id: 'features-row',
            columns: [
              { id: 'feature-1', span: 4, elements: [] },
              { id: 'feature-2', span: 4, elements: [] },
              { id: 'feature-3', span: 4, elements: [] }
            ]
          }
        ]
      }
    ]
  },

  // ========================================
  // CONTENT LAYOUTS
  // ========================================
  'blog-post': {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Article layout with sidebar',
    thumbnail: '/presets/blog-post.svg',
    category: 'content',
    zones: [
      {
        id: 'article',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 6, y: 6 },
        background: null,
        border: false,
        rows: [
          {
            id: 'article-row',
            columns: [
              { id: 'content', span: 8, elements: [] },
              { id: 'sidebar', span: 4, elements: [] }
            ]
          }
        ]
      }
    ]
  },

  // ========================================
  // APPLICATION LAYOUTS
  // ========================================
  'split-view': {
    id: 'split-view',
    name: 'Split View',
    description: 'Equal two-pane layout',
    thumbnail: '/presets/split-view.svg',
    category: 'application',
    zones: [
      {
        id: 'main',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 6, y: 6 },
        background: null,
        border: false,
        rows: [
          {
            id: 'split-row',
            columns: [
              { id: 'left-pane', span: 6, elements: [] },
              { id: 'right-pane', span: 6, elements: [] }
            ]
          }
        ]
      }
    ]
  },

  'master-detail': {
    id: 'master-detail',
    name: 'Master-Detail',
    description: 'List view with detail panel',
    thumbnail: '/presets/master-detail.svg',
    category: 'application',
    zones: [
      {
        id: 'main',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 6, y: 6 },
        background: null,
        border: false,
        rows: [
          {
            id: 'master-detail-row',
            columns: [
              { id: 'master', span: 4, elements: [] },
              { id: 'detail', span: 8, elements: [] }
            ]
          }
        ]
      }
    ]
  }
};

/**
 * Preset categories with metadata
 */
export const presetCategories = [
  { id: 'all', name: 'All Layouts', icon: '📁' },
  { id: 'blank', name: 'Blank', icon: '⬜' },
  { id: 'marketing', name: 'Marketing', icon: '📄' },
  { id: 'dashboard', name: 'Dashboard', icon: '📊' },
  { id: 'content', name: 'Content', icon: '📝' },
  { id: 'application', name: 'Application', icon: '⚙️' },
  { id: 'ecommerce', name: 'E-Commerce', icon: '🛍️' }
];

/**
 * Get all presets as array
 */
export function getAllPresets() {
  return Object.values(layoutPresets);
}

/**
 * Get presets by category
 */
export function getPresetsByCategory(category) {
  if (category === 'all') return getAllPresets();

  // Default category for presets without explicit category
  const defaultCategory = 'blank';

  return getAllPresets().filter(preset =>
    (preset.category || defaultCategory) === category
  );
}

/**
 * Get preset by ID
 */
export function getPresetById(id) {
  return layoutPresets[id];
}

/**
 * Apply a preset to create a new page
 */
export function applyPreset(preset) {
  return {
    id: `page-${Date.now()}`,
    name: `New ${preset.name}`,
    description: preset.description,
    type: 'Custom',
    layout: 'wide',
    zones: JSON.parse(JSON.stringify(preset.zones)) // Deep clone
  };
}

export default layoutPresets;
