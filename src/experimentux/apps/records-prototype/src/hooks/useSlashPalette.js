import { useState, useCallback } from 'react';

/**
 * useSlashPalette Hook
 *
 * Manages state for the SlashPalette component.
 * Provides methods to show/hide the palette and track position.
 *
 * @returns {Object} Slash palette state and controls
 */
export const useSlashPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [triggerInput, setTriggerInput] = useState(null);

  /**
   * Show the palette at a specific position
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {HTMLElement} inputRef - Reference to input that triggered the palette
   */
  const show = useCallback((x, y, inputRef = null) => {
    setPosition({ x, y });
    setTriggerInput(inputRef);
    setIsOpen(true);
  }, []);

  /**
   * Hide the palette
   */
  const hide = useCallback(() => {
    setIsOpen(false);
    // Restore focus to input if available
    if (triggerInput) {
      setTimeout(() => triggerInput.focus(), 0);
    }
  }, [triggerInput]);

  /**
   * Create input handlers for slash command detection
   * @param {Function} onElementInsert - Callback when element should be inserted
   * @returns {Object} Input event handlers
   */
  const createInputHandlers = useCallback((onElementInsert) => {
    return {
      onChange: (e) => {
        // Detect "/" typed
        if (e.target.value === '/') {
          const rect = e.target.getBoundingClientRect();
          show(rect.left, rect.bottom + 8, e.target);
          e.target.value = ''; // Clear the slash
        }
      },
      onKeyDown: (e) => {
        if (e.key === 'Escape' && isOpen) {
          hide();
          e.preventDefault();
        }
      }
    };
  }, [show, hide, isOpen]);

  return {
    isOpen,
    position,
    show,
    hide,
    createInputHandlers
  };
};

export default useSlashPalette;
