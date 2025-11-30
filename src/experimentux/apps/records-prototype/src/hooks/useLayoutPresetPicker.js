import { useState, useCallback } from 'react';

/**
 * useLayoutPresetPicker Hook
 *
 * Manages state for the LayoutPresetPicker component.
 * Provides methods to show/hide the picker and handle preset selection.
 *
 * @param {Function} onSelectPreset - Callback when preset is selected
 * @returns {Object} Layout preset picker state and controls
 */
export const useLayoutPresetPicker = (onSelectPreset) => {
  const [isOpen, setIsOpen] = useState(false);
  const [context, setContext] = useState('page');

  /**
   * Show the layout preset picker
   * @param {string} ctx - Context ('frame' or 'page')
   */
  const show = useCallback((ctx = 'page') => {
    setContext(ctx);
    setIsOpen(true);
  }, []);

  /**
   * Hide the layout preset picker
   */
  const hide = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * Handle preset selection
   * @param {string} presetId - Selected preset ID
   * @param {Object} config - Generated page config
   */
  const handleSelectPreset = useCallback((presetId, config) => {
    if (onSelectPreset) {
      onSelectPreset(presetId, config, context);
    }
    hide();
  }, [onSelectPreset, context, hide]);

  return {
    isOpen,
    context,
    show,
    hide,
    handleSelectPreset
  };
};

export default useLayoutPresetPicker;
