/**
 * usePanel Hook
 * Hook for managing individual panel state
 */

import { useEffect } from 'react';
import { usePanelStore } from '../../../store/panelStore';

/**
 * Hook to manage panel state
 * @param {string} id - Unique panel ID
 * @param {Object} config - Panel configuration
 * @returns {Object} Panel state and control functions
 */
export function usePanel(id, config = {}) {
  const {
    registerPanel,
    unregisterPanel,
    getPanel,
    setPanelVisible,
    togglePanel,
    setPanelMode,
    dockPanel,
    floatPanel,
    minimizePanel,
    restorePanel,
    closePanel,
    setPanelSize,
    setPanelPosition,
    setActivePanel
  } = usePanelStore();

  // Register panel on mount
  useEffect(() => {
    registerPanel(id, config);

    return () => {
      unregisterPanel(id);
    };
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Get current panel state
  const panel = usePanelStore(state => state.panels[id]);

  if (!panel) {
    return {
      panel: null,
      isVisible: false,
      isMinimized: false,
      isDocked: false,
      isFloating: false,
      show: () => {},
      hide: () => {},
      toggle: () => {},
      dock: () => {},
      float: () => {},
      minimize: () => {},
      restore: () => {},
      close: () => {},
      setSize: () => {},
      setPosition: () => {},
      activate: () => {}
    };
  }

  return {
    panel,
    isVisible: panel.visible,
    isMinimized: panel.mode === 'minimized',
    isDocked: panel.mode === 'docked',
    isFloating: panel.mode === 'floating',

    show: () => setPanelVisible(id, true),
    hide: () => setPanelVisible(id, false),
    toggle: () => togglePanel(id),

    dock: (position) => dockPanel(id, position),
    float: (position) => floatPanel(id, position),
    minimize: () => minimizePanel(id),
    restore: () => restorePanel(id),
    close: () => closePanel(id),

    setSize: (size) => setPanelSize(id, size),
    setPosition: (position) => setPanelPosition(id, position),
    activate: () => setActivePanel(id)
  };
}

export default usePanel;
