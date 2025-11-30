/**
 * usePanelDocking Hook
 * Manages panel docking, floating, and minimize logic
 */

import { useCallback } from 'react';
import { usePanelStore } from '../../../store/panelStore';

/**
 * Hook for panel docking operations
 * @param {string} panelId - Panel ID
 * @returns {Object} Docking functions
 */
export function usePanelDocking(panelId) {
  const {
    dockPanel,
    floatPanel,
    minimizePanel,
    restorePanel,
    setPanelMode,
    getPanel
  } = usePanelStore();

  const panel = usePanelStore(state => state.panels[panelId]);

  const toggleDockFloat = useCallback(() => {
    if (!panel) return;

    if (panel.mode === 'docked') {
      floatPanel(panelId);
    } else if (panel.mode === 'floating') {
      dockPanel(panelId, panel.position);
    }
  }, [panel, panelId, floatPanel, dockPanel]);

  const toggleMinimize = useCallback(() => {
    if (!panel) return;

    if (panel.mode === 'minimized') {
      restorePanel(panelId);
    } else {
      minimizePanel(panelId);
    }
  }, [panel, panelId, restorePanel, minimizePanel]);

  const dock = useCallback((position = 'right') => {
    dockPanel(panelId, position);
  }, [panelId, dockPanel]);

  const float = useCallback((position = null) => {
    floatPanel(panelId, position);
  }, [panelId, floatPanel]);

  const minimize = useCallback(() => {
    minimizePanel(panelId);
  }, [panelId, minimizePanel]);

  const restore = useCallback(() => {
    restorePanel(panelId);
  }, [panelId, restorePanel]);

  return {
    toggleDockFloat,
    toggleMinimize,
    dock,
    float,
    minimize,
    restore,
    isDocked: panel?.mode === 'docked',
    isFloating: panel?.mode === 'floating',
    isMinimized: panel?.mode === 'minimized'
  };
}

export default usePanelDocking;
