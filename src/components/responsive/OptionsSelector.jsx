/**
 * OptionsSelector Component
 *
 * A responsive options selection component that adapts to different contexts:
 * - Desktop: Grid layout in centered modal
 * - Mobile: Single-column list in bottom sheet
 * - Supports search/filter
 * - Touch-optimized selection
 *
 * Features:
 * - Responsive grid/list layout
 * - Search/filter options
 * - Keyboard navigation
 * - Touch-friendly buttons (min 44px)
 * - Multi-select support
 * - Groups/categories support
 *
 * @component
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Check } from 'lucide-react';
import ResponsivePanel from './ResponsivePanel';

const OptionsSelector = ({
  isOpen,
  onClose,
  onSelect,
  options = [],
  title = 'Select Option',
  searchable = true,
  multiSelect = false,
  selectedValues = [],
  placeholder = 'Search options...',
  columns = 'auto', // 'auto', 1, 2, 3, 4
  showIcons = false,
  grouped = false, // Whether options are grouped
  emptyMessage = 'No options available',
  confirmButton = false, // Show confirm button for multi-select
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState(selectedValues);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const searchInputRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(window.innerWidth);

  // Track viewport width
  useEffect(() => {
    const handleResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Focus search input when panel opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen, searchable]);

  // Reset search when closed
  useEffect(() => {
    if (!isOpen) {
      setSearchTerm('');
      setFocusedIndex(0);
    }
  }, [isOpen]);

  // Sync selected items with prop
  useEffect(() => {
    setSelectedItems(selectedValues);
  }, [selectedValues]);

  // Determine columns based on viewport width if 'auto'
  const getEffectiveColumns = () => {
    if (columns !== 'auto') return columns;

    if (viewportWidth < 640) return 1; // Mobile: single column
    if (viewportWidth < 768) return 2; // Small tablet: 2 columns
    if (viewportWidth < 1024) return 2; // Tablet: 2 columns
    return 3; // Desktop: 3 columns
  };

  const effectiveColumns = getEffectiveColumns();

  // Filter options based on search
  const getFilteredOptions = () => {
    if (!searchTerm.trim()) return options;

    const term = searchTerm.toLowerCase();

    if (grouped) {
      // Filter grouped options
      return options
        .map(group => ({
          ...group,
          items: group.items.filter(item =>
            (typeof item === 'string' ? item : item.label)
              .toLowerCase()
              .includes(term)
          ),
        }))
        .filter(group => group.items.length > 0);
    }

    // Filter flat options
    return options.filter(option =>
      (typeof option === 'string' ? option : option.label)
        .toLowerCase()
        .includes(term)
    );
  };

  const filteredOptions = getFilteredOptions();

  // Handle option selection
  const handleSelectOption = (option) => {
    const value = typeof option === 'string' ? option : option.value || option.label;

    if (multiSelect) {
      const newSelected = selectedItems.includes(value)
        ? selectedItems.filter(v => v !== value)
        : [...selectedItems, value];
      setSelectedItems(newSelected);

      if (!confirmButton) {
        onSelect(newSelected);
      }
    } else {
      onSelect(value);
      onClose();
    }
  };

  // Handle confirm for multi-select
  const handleConfirm = () => {
    onSelect(selectedItems);
    onClose();
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    const allOptions = grouped
      ? filteredOptions.flatMap(g => g.items)
      : filteredOptions;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIndex(prev => Math.min(prev + 1, allOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (allOptions[focusedIndex]) {
        handleSelectOption(allOptions[focusedIndex]);
      }
    }
  };

  // Grid columns class
  const gridColsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  // Render option button
  const renderOptionButton = (option, index, isSelected) => {
    const label = typeof option === 'string' ? option : option.label;
    const Icon = showIcons && typeof option !== 'string' ? option.icon : null;
    const isFocused = index === focusedIndex;

    return (
      <button
        key={index}
        onClick={() => handleSelectOption(option)}
        className={`
          w-full px-4 py-3 sm:py-3.5 rounded-lg text-left transition-all
          flex items-center gap-3 min-h-[44px]
          ${isFocused ? 'ring-2 ring-blue-500' : ''}
          ${isSelected
            ? 'bg-blue-500 text-white shadow-md'
            : 'bg-gray-50 hover:bg-blue-50 text-gray-900 hover:text-blue-700 border-2 border-gray-200 hover:border-blue-400'
          }
          ${effectiveColumns === 1 ? 'text-base' : 'text-sm'}
        `}
      >
        {multiSelect && (
          <div className={`
            w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0
            ${isSelected ? 'bg-white border-white' : 'border-gray-400'}
          `}>
            {isSelected && <Check className="w-3 h-3 text-blue-500" strokeWidth={3} />}
          </div>
        )}

        {Icon && (
          <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-white' : ''}`} />
        )}

        <span className="font-medium truncate">{label}</span>
      </button>
    );
  };

  // Render content
  const renderContent = () => {
    if (filteredOptions.length === 0) {
      return (
        <div className="p-12 text-center">
          <p className="text-gray-500 text-sm">{emptyMessage}</p>
        </div>
      );
    }

    if (grouped) {
      return (
        <div className="space-y-6">
          {filteredOptions.map((group, groupIndex) => (
            <div key={groupIndex}>
              {group.label && (
                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3 px-6">
                  {group.label}
                </h4>
              )}
              <div className={`grid ${gridColsClass[effectiveColumns]} gap-3 px-6`}>
                {group.items.map((option, idx) => {
                  const value = typeof option === 'string' ? option : option.value || option.label;
                  const isSelected = selectedItems.includes(value);
                  return renderOptionButton(option, idx, isSelected);
                })}
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className={`grid ${gridColsClass[effectiveColumns]} gap-3 px-6`}>
        {filteredOptions.map((option, idx) => {
          const value = typeof option === 'string' ? option : option.value || option.label;
          const isSelected = selectedItems.includes(value);
          return renderOptionButton(option, idx, isSelected);
        })}
      </div>
    );
  };

  return (
    <ResponsivePanel
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      showHeader={true}
    >
      <div className="flex flex-col h-full" onKeyDown={handleKeyDown}>
        {/* Search Bar */}
        {searchable && (
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        )}

        {/* Options List */}
        <div className="flex-1 overflow-y-auto py-4 sm:py-6">
          {renderContent()}
        </div>

        {/* Confirm Button for Multi-Select */}
        {multiSelect && confirmButton && (
          <div className="p-4 sm:p-6 border-t border-gray-200">
            <button
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
              className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]"
            >
              Confirm Selection {selectedItems.length > 0 && `(${selectedItems.length})`}
            </button>
          </div>
        )}
      </div>
    </ResponsivePanel>
  );
};

export default OptionsSelector;
