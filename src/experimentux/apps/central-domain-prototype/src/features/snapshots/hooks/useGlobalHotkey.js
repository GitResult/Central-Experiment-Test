/**
 * useGlobalHotkey Hook
 * Registers global keyboard shortcut
 */

import { useEffect } from 'react';

/**
 * Registers global keyboard shortcut
 * @param {string} key - Key combination (e.g., 'cmd+shift+s')
 * @param {Function} callback - Function to call when hotkey pressed
 * @param {Object} options - Configuration options
 */
export function useGlobalHotkey(key, callback, options = {}) {
  const { enabled = true, preventDefault = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlKey = isMac ? event.metaKey : event.ctrlKey;

      // Match: Cmd/Ctrl + Shift + S
      if (ctrlKey && event.shiftKey && event.key.toLowerCase() === 's') {
        if (preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => window.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [key, callback, enabled, preventDefault]);
}
