import { lazy } from 'react';

/**
 * Element Registry
 *
 * Central registry for all element types available in the Universal Page system.
 * Elements are lazy-loaded for performance.
 *
 * Element Definition Structure:
 * {
 *   component: React.lazy(() => import('./ElementComponent.jsx')),
 *   category: 'content' | 'structure' | 'data' | 'layout' | 'navigation' | 'media' | 'interactive' | 'presentation',
 *   icon: '<svg path>',
 *   description: 'Element description',
 *   defaultSettings: { ... }
 * }
 */
export const ElementRegistry = {
  // Text Content Elements
  'text': {
    component: lazy(() => import('./TextElement.jsx')),
    category: 'content',
    icon: 'M4 6h16M4 12h16M4 18h7',
    description: 'Plain text block with inline editing',
    defaultSettings: {
      fontSize: 'base',
      color: 'text-gray-700',
      align: 'left'
    }
  },

  'title': {
    component: lazy(() => import('./TitleElement.jsx')),
    category: 'structure',
    icon: 'M4 6h16',
    description: 'Large page title',
    defaultSettings: {
      fontSize: '4xl',
      fontWeight: 'bold',
      color: 'text-gray-900'
    }
  },

  'heading': {
    component: lazy(() => import('./HeadingElement.jsx')),
    category: 'content',
    icon: 'M4 6h16M4 12h10M4 18h7',
    description: 'Section heading (h2-h6)',
    defaultSettings: {
      level: 2,
      color: 'text-gray-900'
    }
  },

  'description': {
    component: lazy(() => import('./DescriptionElement.jsx')),
    category: 'structure',
    icon: 'M4 6h16M4 12h16',
    description: 'Page description or subtitle',
    defaultSettings: {
      fontSize: 'sm',
      color: 'text-gray-500'
    }
  },

  // Structure Elements
  'page-icon': {
    component: lazy(() => import('./PageIconElement.jsx')),
    category: 'structure',
    icon: '😀',
    description: 'Emoji or icon for page identification',
    defaultSettings: {
      size: 'lg'
    }
  },

  // Media Elements
  'image': {
    component: lazy(() => import('./ImageElement.jsx')),
    category: 'media',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    description: 'Image with optional caption',
    defaultSettings: {
      width: 'full',
      objectFit: 'cover',
      height: '300px'
    }
  },

  // Interactive Elements
  'button': {
    component: lazy(() => import('./ButtonElement.jsx')),
    category: 'interactive',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    description: 'Clickable button with link',
    defaultSettings: {
      variant: 'primary',
      size: 'md',
      align: 'left'
    }
  },

  'content-card': {
    component: lazy(() => import('./ContentCardElement.jsx')),
    category: 'content',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    description: 'Versatile content card for various layouts',
    defaultSettings: {
      variant: 'info',
      background: 'light'
    }
  },

  // Cover/Hero Elements
  'cover-image': {
    component: lazy(() => import('./CoverImageElement.jsx')),
    category: 'media',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
    description: 'Full-width cover image with drag-to-reposition',
    defaultSettings: {
      height: '300px'
    }
  },

  // Navigation Elements
  'breadcrumb': {
    component: lazy(() => import('./BreadcrumbElement.jsx')),
    category: 'navigation',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
    description: 'Breadcrumb navigation',
    defaultSettings: {}
  },

  // Data Elements
  'data-grid': {
    component: lazy(() => import('./DataGridElement.jsx')),
    category: 'data',
    icon: 'M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
    description: 'Interactive data table with sorting and CSV export',
    defaultSettings: {}
  },

  'metadata-bar': {
    component: lazy(() => import('./MetadataBarElement.jsx')),
    category: 'data',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Record metadata display bar',
    defaultSettings: {
      background: 'bg-gray-50'
    }
  },

  'form-field': {
    component: lazy(() => import('./FormFieldElement.jsx')),
    category: 'interactive',
    icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z',
    description: 'Form input field with various types',
    defaultSettings: {
      fieldType: 'text',
      rows: 4
    }
  },

  // Layout Elements - PRESERVE EXISTING IMPLEMENTATIONS
  'grid-layout': {
    component: lazy(() => import('./GridLayoutElement.jsx')),
    category: 'layout',
    icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5z',
    description: 'Grid layout with drag-to-position (wraps existing react-grid-layout)',
    defaultSettings: {
      cols: 12,
      rowHeight: 60,
      margin: [10, 10],
      compactType: 'vertical'
    }
  },

  'canvas-layout': {
    component: lazy(() => import('./CanvasLayoutElement.jsx')),
    category: 'layout',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5',
    description: 'Freeform canvas layout with grid/freeform modes (wraps existing canvas)',
    defaultSettings: {
      mode: 'grid',
      breakpoint: 'desktop'
    }
  },

  // Presentation Elements
  'slide-deck': {
    component: lazy(() => import('./SlideDeck/SlideDeckElement.jsx')),
    category: 'presentation',
    icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    description: 'Create beautiful slide deck presentations with markdown',
    defaultSettings: {
      template: 'blank',
      theme: 'minimalist',
      aspectRatio: '16:9',
      markdown: ''
    }
  }
};

/**
 * Get elements grouped by category
 *
 * Useful for building component panels and insertion UIs.
 *
 * @returns {Object} Elements grouped by category
 */
export const getElementsByCategory = () => {
  const categories = {};

  Object.entries(ElementRegistry).forEach(([type, def]) => {
    const category = def.category || 'other';

    if (!categories[category]) {
      categories[category] = [];
    }

    categories[category].push({
      type,
      ...def
    });
  });

  return categories;
};

/**
 * Get element definition by type
 *
 * @param {string} type - Element type
 * @returns {Object|null} Element definition or null if not found
 */
export const getElementDefinition = (type) => {
  return ElementRegistry[type] || null;
};

/**
 * Check if element type exists
 *
 * @param {string} type - Element type
 * @returns {boolean} True if element type is registered
 */
export const isValidElementType = (type) => {
  return type in ElementRegistry;
};

/**
 * Get all registered element types
 *
 * @returns {string[]} Array of element type names
 */
export const getElementTypes = () => {
  return Object.keys(ElementRegistry);
};

/**
 * Get element count
 *
 * @returns {number} Number of registered elements
 */
export const getElementCount = () => {
  return Object.keys(ElementRegistry).length;
};
