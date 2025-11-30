/**
 * useKeyboardShortcut Hook
 * Register keyboard shortcuts in React components
 */

import { useEffect, useRef } from 'react';
import keyboardShortcutManager from '../KeyboardShortcutManager';

/**
 * Hook to register a keyboard shortcut
 * @param {string|string[]} shortcut - Shortcut string or array of shortcuts
 * @param {Function} handler - Function to execute when shortcut is triggered
 * @param {Object} options - Configuration options
 * @param {string} options.description - Human-readable description
 * @param {string} options.category - Category for grouping
 * @param {string} options.context - Context where shortcut is active
 * @param {boolean} options.enabled - Whether shortcut is enabled
 * @param {Array} options.dependencies - Dependencies array (like useEffect)
 */
export function useKeyboardShortcut(
  shortcut,
  handler,
  {
    description = '',
    category = 'General',
    context = 'global',
    enabled = true,
    preventDefault = true,
    dependencies = []
  } = {}
) {
  const handlerRef = useRef(handler);

  // Update handler ref when it changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const shortcuts = Array.isArray(shortcut) ? shortcut : [shortcut];
    const unregisterFuncs = [];

    shortcuts.forEach(sc => {
      const unregister = keyboardShortcutManager.register(
        sc,
        (event) => handlerRef.current(event),
        {
          description,
          category,
          context,
          preventDefault
        }
      );
      unregisterFuncs.push(unregister);
    });

    return () => {
      unregisterFuncs.forEach(fn => fn());
    };
  }, [shortcut, description, category, context, enabled, preventDefault, ...dependencies]);
}

export default useKeyboardShortcut;
