/**
 * usePanelZIndex Hook
 * Manages panel z-index and stacking order
 */

import { useCallback } from 'react';
import { usePanelStore } from '../../../store/panelStore';

/**
 * Hook for managing panel z-index
 * @param {string} panelId - Panel ID
 * @returns {Object} Z-index state and functions
 */
export function usePanelZIndex(panelId) {
  const { setActivePanel, getPanel } = usePanelStore();
  const panel = usePanelStore(state => state.panels[panelId]);
  const activePanel = usePanelStore(state => state.activePanel);

  const bringToFront = useCallback(() => {
    setActivePanel(panelId);
  }, [panelId, setActivePanel]);

  const isActive = activePanel === panelId;
  const zIndex = panel?.zIndex || 0;

  return {
    zIndex,
    isActive,
    bringToFront
  };
}

export default usePanelZIndex;
