/**
 * useShortcutHelp Hook
 * Access shortcut help information
 */

import { useState, useCallback } from 'react';
import { useKeyboardShortcutContext } from '../KeyboardShortcutProvider';

/**
 * Hook to access shortcut help
 * @returns {Object} Shortcut help utilities
 */
export function useShortcutHelp() {
  const { shortcuts, categories, formatShortcut, getShortcuts } = useKeyboardShortcutContext();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const openHelp = useCallback(() => {
    setIsHelpOpen(true);
  }, []);

  const closeHelp = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  const toggleHelp = useCallback(() => {
    setIsHelpOpen(prev => !prev);
  }, []);

  const getShortcutsByCategory = useCallback(() => {
    const grouped = {};

    categories.forEach(category => {
      grouped[category] = getShortcuts({ category });
    });

    return grouped;
  }, [categories, getShortcuts]);

  const searchShortcuts = useCallback((query) => {
    const lowerQuery = query.toLowerCase();

    return shortcuts.filter(shortcut =>
      shortcut.description.toLowerCase().includes(lowerQuery) ||
      shortcut.originalShortcut.toLowerCase().includes(lowerQuery) ||
      shortcut.category.toLowerCase().includes(lowerQuery)
    );
  }, [shortcuts]);

  return {
    shortcuts,
    categories,
    isHelpOpen,
    openHelp,
    closeHelp,
    toggleHelp,
    formatShortcut,
    getShortcuts,
    getShortcutsByCategory,
    searchShortcuts
  };
}

export default useShortcutHelp;
