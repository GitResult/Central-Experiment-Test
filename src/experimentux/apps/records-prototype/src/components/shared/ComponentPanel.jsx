import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDraggable } from '@dnd-kit/core';
import { getElementsByCategory } from '../elements/registry';

/**
 * DraggableComponentItem - Draggable wrapper for component panel items
 */
const DraggableComponentItem = ({ element }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `component-panel-${element.type}`,
    data: {
      type: 'component-panel-item',
      elementType: element.type
    }
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`p-3 border border-neutral-200 rounded-lg cursor-grab active:cursor-grabbing hover:border-blue-400 hover:bg-blue-50 transition-all group ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <svg
          className="w-5 h-5 text-neutral-400 group-hover:text-blue-600 flex-shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d={element.icon}
          />
        </svg>

        {/* Element Info */}
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium text-neutral-900 capitalize">
            {element.type.replace(/-/g, ' ')}
          </div>
          <div className="text-xs text-neutral-500 line-clamp-2">
            {element.description}
          </div>
        </div>

        {/* Drag Handle */}
        <svg className="w-4 h-4 text-neutral-300 group-hover:text-neutral-400 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 4h4v4h-4V4zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4z" />
        </svg>
      </div>
    </div>
  );
};

DraggableComponentItem.propTypes = {
  element: PropTypes.shape({
    type: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired
  }).isRequired
};

/**
 * ComponentPanel Component
 *
 * A draggable panel showing available elements from the ElementRegistry.
 * Supports drag-and-drop for element insertion using @dnd-kit.
 *
 * @param {boolean} isOpen - Whether the panel is visible
 * @param {Function} onClose - Callback when panel should close
 * @param {string[]} filterCategories - Optional array of categories to show
 * @param {string[]} excludeTypes - Optional array of element types to exclude
 */
const ComponentPanel = ({
  isOpen = true,
  onClose,
  filterCategories = null,
  excludeTypes = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState({
    'structure': true,
    'content': true,
    'media': true,
    'interactive': true
  });

  // Get elements grouped by category from registry
  const elementsByCategory = useMemo(() => {
    const allCategories = getElementsByCategory();

    // Filter categories if specified
    const categories = filterCategories
      ? Object.fromEntries(
          Object.entries(allCategories).filter(([cat]) => filterCategories.includes(cat))
        )
      : allCategories;

    // Filter out excluded types
    if (excludeTypes.length > 0) {
      Object.keys(categories).forEach(cat => {
        categories[cat] = categories[cat].filter(elem => !excludeTypes.includes(elem.type));
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      Object.keys(categories).forEach(cat => {
        categories[cat] = categories[cat].filter(elem =>
          elem.type.toLowerCase().includes(query) ||
          elem.description.toLowerCase().includes(query)
        );
      });
    }

    return categories;
  }, [filterCategories, excludeTypes, searchQuery]);

  // Category display configuration
  const categoryConfig = {
    'structure': { name: 'Structure', icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2zM14 15a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z', order: 1 },
    'content': { name: 'Content', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', order: 2 },
    'media': { name: 'Media', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', order: 3 },
    'interactive': { name: 'Interactive', icon: 'M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122', order: 4 },
    'data': { name: 'Data', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', order: 5 },
    'layout': { name: 'Layout', icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5z', order: 6 },
    'navigation': { name: 'Navigation', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', order: 7 },
    'presentation': { name: 'Presentation', icon: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z', order: 8 }
  };

  // Sort categories by order
  const sortedCategories = useMemo(() => {
    return Object.keys(elementsByCategory).sort((a, b) => {
      const orderA = categoryConfig[a]?.order || 999;
      const orderB = categoryConfig[b]?.order || 999;
      return orderA - orderB;
    });
  }, [elementsByCategory]);

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="component-panel fixed right-0 top-0 h-full w-80 bg-white border-l border-neutral-200 shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-neutral-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-neutral-900">Components</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-neutral-100 transition-colors"
              aria-label="Close panel"
            >
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        {sortedCategories.map(category => {
          const elements = elementsByCategory[category];
          if (!elements || elements.length === 0) return null;

          const config = categoryConfig[category] || { name: category, icon: 'M12 4v16m8-8H4' };
          const isExpanded = expandedCategories[category];

          return (
            <div key={category} className="mb-4 last:mb-0">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center justify-between p-2 hover:bg-neutral-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={config.icon} />
                  </svg>
                  <span className="text-sm font-semibold text-neutral-700">{config.name}</span>
                  <span className="text-xs text-neutral-400">({elements.length})</span>
                </div>
                <svg
                  className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Elements in Category */}
              {isExpanded && (
                <div className="mt-2 space-y-1">
                  {elements.map((element) => (
                    <DraggableComponentItem key={element.type} element={element} />
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {sortedCategories.length === 0 && (
          <div className="py-12 text-center text-neutral-400">
            <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <div className="text-sm">No components found</div>
            {searchQuery && (
              <div className="text-xs mt-1">Try a different search term</div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200 bg-neutral-50">
        <div className="text-xs text-neutral-500 text-center">
          Drag components onto the page to insert
        </div>
      </div>
    </div>
  );
};

ComponentPanel.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  filterCategories: PropTypes.arrayOf(PropTypes.string),
  excludeTypes: PropTypes.arrayOf(PropTypes.string)
};

export default ComponentPanel;
