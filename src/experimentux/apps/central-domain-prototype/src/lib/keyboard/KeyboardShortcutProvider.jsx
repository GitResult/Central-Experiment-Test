/**
 * Keyboard Shortcut Provider
 * React context provider for keyboard shortcut system
 */

import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import keyboardShortcutManager from './KeyboardShortcutManager';

const KeyboardShortcutContext = createContext({
  shortcuts: [],
  categories: [],
  enabled: true,
  setEnabled: () => {},
  setContext: () => {},
  getShortcuts: () => [],
  formatShortcut: () => ''
});

export function KeyboardShortcutProvider({ children, initialContext = 'global' }) {
  const [shortcuts, setShortcuts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [enabled, setEnabledState] = useState(true);

  // Set initial context
  useEffect(() => {
    keyboardShortcutManager.setContext(initialContext);
  }, [initialContext]);

  // Subscribe to shortcut changes
  useEffect(() => {
    const updateShortcuts = () => {
      setShortcuts(keyboardShortcutManager.getShortcuts());
      setCategories(keyboardShortcutManager.getCategories());
    };

    // Initial load
    updateShortcuts();

    // Subscribe to changes
    const unsubscribe = keyboardShortcutManager.subscribe(updateShortcuts);

    return unsubscribe;
  }, []);

  const setEnabled = (value) => {
    setEnabledState(value);
    keyboardShortcutManager.setEnabled(value);
  };

  const setContext = (context) => {
    keyboardShortcutManager.setContext(context);
  };

  const getShortcuts = (options) => {
    return keyboardShortcutManager.getShortcuts(options);
  };

  const formatShortcut = (shortcut) => {
    return keyboardShortcutManager.formatShortcut(shortcut);
  };

  const value = {
    shortcuts,
    categories,
    enabled,
    setEnabled,
    setContext,
    getShortcuts,
    formatShortcut
  };

  return (
    <KeyboardShortcutContext.Provider value={value}>
      {children}
    </KeyboardShortcutContext.Provider>
  );
}

KeyboardShortcutProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialContext: PropTypes.string
};

export function useKeyboardShortcutContext() {
  const context = useContext(KeyboardShortcutContext);
  if (!context) {
    throw new Error('useKeyboardShortcutContext must be used within KeyboardShortcutProvider');
  }
  return context;
}

export default KeyboardShortcutProvider;
