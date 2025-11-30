import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { getElementsByCategory } from '../elements/registry';

/**
 * SlashPalette
 *
 * Unified slash command palette for inserting elements.
 * Works with both legacy pages and UniversalPage system.
 *
 * Usage:
 * - Type '/' in any text field to trigger
 * - Shows categorized list of available elements
 * - Click an element to insert it
 */
const SlashPalette = ({
  isOpen,
  position,
  onClose,
  onSelectElement,
  filter = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(filter);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const paletteRef = useRef(null);
  const searchInputRef = useRef(null);

  // Get elements grouped by category
  const elementsByCategory = getElementsByCategory();

  // Filter elements based on search query
  const filterElements = (elements) => {
    if (!searchQuery) return elements;

    const query = searchQuery.toLowerCase();
    return elements.filter(el =>
      el.type.toLowerCase().includes(query) ||
      el.description.toLowerCase().includes(query)
    );
  };

  // Flatten and filter all elements for keyboard navigation
  const allElements = Object.values(elementsByCategory)
    .flat()
    .filter(el => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return el.type.toLowerCase().includes(query) ||
             el.description.toLowerCase().includes(query);
    });

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % allElements.length);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + allElements.length) % allElements.length);
          break;
        case 'Enter':
          e.preventDefault();
          if (allElements[selectedIndex]) {
            onSelectElement(allElements[selectedIndex].type);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, allElements, onSelectElement, onClose]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset search and selection when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

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
        className="fixed z-[101] bg-white rounded-lg shadow-2xl border border-gray-200 w-96 max-h-[500px] overflow-hidden flex flex-col"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`
        }}
      >
        {/* Search input */}
        <div className="p-3 border-b border-gray-200">
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search elements..."
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Elements list */}
        <div className="overflow-y-auto flex-1">
          {Object.entries(elementsByCategory).map(([category, elements]) => {
            const filteredElements = filterElements(elements);

            if (filteredElements.length === 0) return null;

            return (
              <div key={category} className="p-2">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                  {category}
                </div>
                {filteredElements.map((element, index) => {
                  const globalIndex = allElements.findIndex(el => el.type === element.type);
                  const isSelected = globalIndex === selectedIndex;

                  return (
                    <button
                      key={element.type}
                      onClick={() => onSelectElement(element.type)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-3 ${
                        isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
                      }`}
                    >
                      {/* Icon */}
                      <div className={`flex-shrink-0 mt-0.5 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                        {element.icon.startsWith('M') || element.icon.startsWith('m') ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={element.icon} />
                          </svg>
                        ) : (
                          <span className="text-xl">{element.icon}</span>
                        )}
                      </div>

                      {/* Name and description */}
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                          {formatElementName(element.type)}
                        </div>
                        <div className={`text-xs ${isSelected ? 'text-blue-700' : 'text-gray-500'} truncate`}>
                          {element.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            );
          })}

          {/* No results */}
          {allElements.length === 0 && (
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
        <div className="px-3 py-2 border-t border-gray-200 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

// Helper function to format element type names
const formatElementName = (type) => {
  return type
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

SlashPalette.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectElement: PropTypes.func.isRequired,
  filter: PropTypes.string
};

SlashPalette.defaultProps = {
  filter: ''
};

export default SlashPalette;
