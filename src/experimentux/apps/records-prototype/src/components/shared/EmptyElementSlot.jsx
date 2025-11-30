import React, { useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import SlashPalette from './SlashPalette';
import { useSlashPalette } from '../../hooks/useSlashPalette';
import { getElementDefinition } from '../elements/registry';

/**
 * EmptyElementSlot Component
 *
 * Displays an empty state with slash command hint.
 * When user types "/", shows the SlashPalette to insert elements.
 *
 * @param {Function} onInsertElement - Callback when element should be inserted (elementType) => void
 * @param {string} placeholder - Placeholder text for the input
 * @param {boolean} showSlashHint - Whether to show the "/" hint (default: true)
 * @param {string[]} filterCategories - Optional categories to filter in palette
 * @param {string[]} excludeTypes - Optional element types to exclude from palette
 */
const EmptyElementSlot = ({
  onInsertElement,
  placeholder = "Type '/' for commands...",
  showSlashHint = true,
  filterCategories = null,
  excludeTypes = []
}) => {
  const inputRef = useRef(null);
  const { isOpen, position, show, hide, createInputHandlers } = useSlashPalette();

  const handleSelectElement = (elementType) => {
    // Get default settings from registry
    const elementDef = getElementDefinition(elementType);
    const defaultSettings = elementDef?.defaultSettings || {};

    // Create element with default data
    const newElement = {
      id: `elem-${Date.now()}`,
      type: elementType,
      settings: defaultSettings,
      data: getDefaultData(elementType)
    };

    onInsertElement(newElement);

    // Clear input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  // Memoize input handlers to prevent recreation on every render
  const inputHandlers = useMemo(() => createInputHandlers(), [createInputHandlers]);

  return (
    <div className="py-4">
      {/* Slash Hint */}
      {showSlashHint && (
        <div className="flex items-center gap-3 text-neutral-400 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span className="text-sm">
            Type <kbd className="px-2 py-0.5 text-xs bg-neutral-100 border border-neutral-300 rounded">/</kbd> for commands
          </span>
        </div>
      )}

      {/* Input Field */}
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        {...inputHandlers}
        onChange={(e) => {
          inputHandlers.onChange(e);
          // Also support Enter key to insert plain text
        }}
        onKeyDown={(e) => {
          inputHandlers.onKeyDown(e);
          // Enter key creates a text element
          if (e.key === 'Enter' && e.target.value.trim() && !isOpen) {
            const newElement = {
              id: `elem-${Date.now()}`,
              type: 'text',
              settings: {},
              data: { content: e.target.value.trim() }
            };
            onInsertElement(newElement);
            e.target.value = '';
          }
        }}
      />

      {/* Slash Palette */}
      <SlashPalette
        isOpen={isOpen}
        position={position}
        onClose={hide}
        onSelectElement={handleSelectElement}
        filterCategories={filterCategories}
        excludeTypes={excludeTypes}
      />
    </div>
  );
};

/**
 * Get default data for a given element type
 */
function getDefaultData(elementType) {
  const defaults = {
    'text': { content: '' },
    'title': { content: 'Untitled' },
    'heading': { content: 'Heading' },
    'description': { content: '' },
    'page-icon': { icon: '📄' },
    'image': { src: '', alt: '', caption: '' },
    'button': { text: 'Click me', url: '' },
    'content-card': {
      title: 'Card Title',
      description: 'Card description',
      media: null,
      cta: null
    }
  };

  return defaults[elementType] || {};
}

EmptyElementSlot.propTypes = {
  onInsertElement: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  showSlashHint: PropTypes.bool,
  filterCategories: PropTypes.arrayOf(PropTypes.string),
  excludeTypes: PropTypes.arrayOf(PropTypes.string)
};

export default EmptyElementSlot;
