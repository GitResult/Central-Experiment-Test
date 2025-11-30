import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { getElementsByCategory } from '../elements/registry';

/**
 * ElementPanel
 *
 * Drag-and-drop element panel for adding elements to pages.
 * Shows all available elements organized by category.
 *
 * Can be used as a sidebar, dropdown, or floating panel.
 */
const ElementPanel = ({ onSelectElement, isOpen = true, onClose }) => {
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const elementsByCategory = getElementsByCategory();

  // Filter elements based on search
  const filterElements = (elements) => {
    if (!searchQuery) return elements;

    const query = searchQuery.toLowerCase();
    return elements.filter(el =>
      el.type.toLowerCase().includes(query) ||
      el.description.toLowerCase().includes(query)
    );
  };

  const handleElementClick = (elementType) => {
    onSelectElement(elementType);
  };

  if (!isOpen) return null;

  return (
    <div className="element-panel bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">Elements</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search elements..."
          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Elements by category */}
      <div className="overflow-y-auto max-h-[600px]">
        {Object.entries(elementsByCategory).map(([category, elements]) => {
          const filteredElements = filterElements(elements);

          if (filteredElements.length === 0) return null;

          const isExpanded = activeCategory === category || searchQuery !== '';

          return (
            <div key={category} className="border-b border-gray-200">
              {/* Category header */}
              <button
                onClick={() => setActiveCategory(isExpanded ? null : category)}
                className="w-full px-4 py-2 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  {category} ({filteredElements.length})
                </span>
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Category elements */}
              {isExpanded && (
                <div className="p-2 bg-gray-50">
                  <div className="grid grid-cols-2 gap-2">
                    {filteredElements.map((element) => (
                      <button
                        key={element.type}
                        onClick={() => handleElementClick(element.type)}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('elementType', element.type);
                          e.dataTransfer.effectAllowed = 'copy';
                        }}
                        className="flex flex-col items-center gap-2 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-sm transition-all cursor-pointer group"
                      >
                        {/* Icon */}
                        <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                          {element.icon.startsWith('M') || element.icon.startsWith('m') ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={element.icon} />
                            </svg>
                          ) : (
                            <span className="text-2xl">{element.icon}</span>
                          )}
                        </div>

                        {/* Name */}
                        <span className="text-xs font-medium text-gray-700 group-hover:text-blue-900 text-center">
                          {formatElementName(element.type)}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* No results */}
        {Object.values(elementsByCategory).every(elements => filterElements(elements).length === 0) && (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <p className="text-sm text-gray-500">No elements found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different search term</p>
          </div>
        )}
      </div>

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
        Click or drag elements to add them to your page
      </div>
    </div>
  );
};

// Helper function to format element type names
const formatElementName = (type) => {
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

ElementPanel.propTypes = {
  onSelectElement: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func
};

ElementPanel.defaultProps = {
  isOpen: true,
  onClose: null
};

export default ElementPanel;
