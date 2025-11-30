import React, { useState, useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { getElementsByCategory } from '../elements/registry';

/**
 * SlashPalette Component
 *
 * A reusable slash command palette that shows available elements
 * from the ElementRegistry. Can be triggered by typing "/" in any input.
 *
 * @param {boolean} isOpen - Whether the palette is visible
 * @param {Object} position - Position { x, y } for the palette
 * @param {Function} onClose - Callback when palette should close
 * @param {Function} onSelectElement - Callback when element is selected (elementType) => void
 * @param {string[]} filterCategories - Optional array of categories to show (default: all)
 * @param {string[]} excludeTypes - Optional array of element types to exclude
 */
const SlashPalette = ({
  isOpen,
  position,
  onClose,
  onSelectElement,
  filterCategories = null,
  excludeTypes = []
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef(null);
  const paletteRef = useRef(null);
  const selectedItemRef = useRef(null);

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

    return categories;
  }, [filterCategories, excludeTypes]);

  // Category display names and order
  const categoryConfig = {
    'content': { name: 'Content', order: 1 },
    'structure': { name: 'Structure', order: 2 },
    'media': { name: 'Media', order: 3 },
    'interactive': { name: 'Interactive', order: 4 },
    'data': { name: 'Data', order: 5 },
    'layout': { name: 'Layout', order: 6 },
    'navigation': { name: 'Navigation', order: 7 }
  };

  // Filter elements based on search query
  const filterElements = (elements) => {
    if (!searchQuery.trim()) return elements;

    const query = searchQuery.toLowerCase();
    return elements.filter(el =>
      el.type.toLowerCase().includes(query) ||
      el.description.toLowerCase().includes(query)
    );
  };

  // Flatten and filter all elements for keyboard navigation
  const allFilteredElements = useMemo(() => {
    return Object.values(elementsByCategory)
      .flat()
      .filter(el => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return el.type.toLowerCase().includes(query) ||
               el.description.toLowerCase().includes(query);
      });
  }, [elementsByCategory, searchQuery]);

  // Sort categories by order
  const sortedCategories = useMemo(() => {
    return Object.keys(elementsByCategory).sort((a, b) => {
      const orderA = categoryConfig[a]?.order || 999;
      const orderB = categoryConfig[b]?.order || 999;
      return orderA - orderB;
    });
  }, [elementsByCategory]);

  // Handle keyboard navigation on the input
  const handleInputKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) =>
          (prev + 1) % Math.max(1, allFilteredElements.length)
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        e.stopPropagation();
        setSelectedIndex((prev) =>
          (prev - 1 + allFilteredElements.length) % Math.max(1, allFilteredElements.length)
        );
        break;
      case 'Enter':
        e.preventDefault();
        e.stopPropagation();
        if (allFilteredElements[selectedIndex]) {
          onSelectElement(allFilteredElements[selectedIndex].type);
          onClose();
        }
        break;
      case 'Escape':
        e.preventDefault();
        e.stopPropagation();
        onClose();
        break;
      default:
        break;
    }
  };

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    }
  }, [isOpen]);

  // Reset search and selection when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Reset selection when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedItemRef.current) {
      selectedItemRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth'
      });
    }
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[100]"
        onClick={onClose}
      />

      {/* Palette */}
      <div
        ref={paletteRef}
        className="fixed z-[101] bg-white rounded-lg shadow-2xl border border-neutral-200 w-96 max-h-[500px] overflow-hidden flex flex-col"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        {/* Search Input */}
        <div className="p-3 border-b border-neutral-200">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search elements..."
            className="w-full px-3 py-2 text-sm border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        {/* Elements List */}
        <div className="overflow-y-auto flex-1">
          {sortedCategories.map(category => {
            const elements = elementsByCategory[category];
            const filteredElements = filterElements(elements);

            if (!elements || filteredElements.length === 0) return null;

            return (
              <div key={category} className="p-2">
                {/* Category Header */}
                <div className="text-xs font-semibold text-neutral-500 uppercase tracking-wider px-3 py-2">
                  {categoryConfig[category]?.name || category}
                </div>

                {/* Elements in Category */}
                {filteredElements.map((element) => {
                  const globalIndex = allFilteredElements.findIndex(el => el.type === element.type);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={element.type}
                      ref={isSelected ? selectedItemRef : null}
                      onClick={() => {
                        onSelectElement(element.type);
                        onClose();
                      }}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-3 ${
                        isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-neutral-50'
                      }`}
                    >
                      {/* Icon */}
                      <div className={`flex-shrink-0 mt-0.5 ${isSelected ? 'text-blue-600' : 'text-neutral-400'}`}>
                        {element.icon.startsWith('M') || element.icon.startsWith('m') ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={element.icon} />
                          </svg>
                        ) : (
                          <span className="text-xl">{element.icon}</span>
                        )}
                      </div>

                      {/* Element Info */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium capitalize ${
                          isSelected ? 'text-blue-900' : 'text-neutral-900'
                        }`}>
                          {element.type.replace(/-/g, ' ')}
                        </div>
                        <div className={`text-xs truncate ${
                          isSelected ? 'text-blue-700' : 'text-neutral-500'
                        }`}>
                          {element.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* Empty State */}
          {allFilteredElements.length === 0 && (
            <div className="p-8 text-center">
              <svg className="mx-auto h-12 w-12 text-neutral-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <p className="text-sm text-neutral-500">No elements found</p>
              <p className="text-xs text-neutral-400 mt-1">Try a different search term</p>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="px-3 py-2 border-t border-neutral-200 bg-neutral-50 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-xs">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-xs">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-neutral-300 rounded text-xs">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

SlashPalette.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectElement: PropTypes.func.isRequired,
  filterCategories: PropTypes.arrayOf(PropTypes.string),
  excludeTypes: PropTypes.arrayOf(PropTypes.string)
};

export default SlashPalette;
