/**
 * Panel Store
 * Manages global panel state for docked, floating, and minimized panels
 */

import { create } from 'zustand';

// Default panel configurations
const DEFAULT_PANEL_SIZES = {
  narrow: { width: 280, height: 400 },
  medium: { width: 400, height: 500 },
  wide: { width: 600, height: 600 },
  full: { width: 800, height: 800 }
};

export const usePanelStore = create((set, get) => ({
  // Panel states - keyed by panel ID
  panels: {},

  // Active panel (for z-index management)
  activePanel: null,

  // Taskbar minimized panels
  minimizedPanels: [],

  /**
   * Register a panel
   */
  registerPanel: (id, config) => {
    const {
      title = 'Panel',
      mode = 'docked', // 'docked' | 'floating' | 'minimized'
      position = 'right', // 'left' | 'right' | 'bottom' | 'center'
      defaultSize = DEFAULT_PANEL_SIZES.medium,
      resizable = true,
      minimizable = true,
      closable = true,
      visible = true
    } = config;

    set(state => ({
      panels: {
        ...state.panels,
        [id]: {
          id,
          title,
          mode,
          position,
          size: defaultSize,
          defaultSize,
          floatingPosition: { x: window.innerWidth / 2 - defaultSize.width / 2, y: 100 },
          resizable,
          minimizable,
          closable,
          visible,
          zIndex: 0
        }
      }
    }));
  },

  /**
   * Unregister a panel
   */
  unregisterPanel: (id) => {
    set(state => {
      const { [id]: removed, ...remaining } = state.panels;
      return {
        panels: remaining,
        minimizedPanels: state.minimizedPanels.filter(panelId => panelId !== id),
        activePanel: state.activePanel === id ? null : state.activePanel
      };
    });
  },

  /**
   * Show/hide panel
   */
  setPanelVisible: (id, visible) => {
    set(state => ({
      panels: {
        ...state.panels,
        [id]: { ...state.panels[id], visible }
      }
    }));
  },

  /**
   * Toggle panel visibility
   */
  togglePanel: (id) => {
    const panel = get().panels[id];
    if (panel) {
      get().setPanelVisible(id, !panel.visible);
    }
  },

  /**
   * Set panel mode (docked, floating, minimized)
   */
  setPanelMode: (id, mode) => {
    set(state => {
      const newMinimized = mode === 'minimized'
        ? [...state.minimizedPanels, id]
        : state.minimizedPanels.filter(panelId => panelId !== id);

      return {
        panels: {
          ...state.panels,
          [id]: { ...state.panels[id], mode, visible: mode !== 'minimized' }
        },
        minimizedPanels: newMinimized
      };
    });
  },

  /**
   * Dock panel
   */
  dockPanel: (id, position = 'right') => {
    set(state => ({
      panels: {
        ...state.panels,
        [id]: { ...state.panels[id], mode: 'docked', position, visible: true }
      },
      minimizedPanels: state.minimizedPanels.filter(panelId => panelId !== id)
    }));
  },

  /**
   * Float panel
   */
  floatPanel: (id, position = null) => {
    set(state => {
      const panel = state.panels[id];
      const floatingPosition = position || panel.floatingPosition;

      return {
        panels: {
          ...state.panels,
          [id]: { ...panel, mode: 'floating', floatingPosition, visible: true }
        },
        minimizedPanels: state.minimizedPanels.filter(panelId => panelId !== id),
        activePanel: id
      };
    });
  },

  /**
   * Minimize panel
   */
  minimizePanel: (id) => {
    get().setPanelMode(id, 'minimized');
  },

  /**
   * Restore panel from minimized state
   */
  restorePanel: (id) => {
    const panel = get().panels[id];
    if (panel) {
      const mode = panel.mode === 'minimized' ? 'docked' : panel.mode;
      get().setPanelMode(id, mode);
    }
  },

  /**
   * Close panel
   */
  closePanel: (id) => {
    get().setPanelVisible(id, false);
  },

  /**
   * Update panel size
   */
  setPanelSize: (id, size) => {
    set(state => ({
      panels: {
        ...state.panels,
        [id]: { ...state.panels[id], size }
      }
    }));
  },

  /**
   * Update floating panel position
   */
  setPanelPosition: (id, position) => {
    set(state => ({
      panels: {
        ...state.panels,
        [id]: { ...state.panels[id], floatingPosition: position }
      }
    }));
  },

  /**
   * Set active panel (brings to front)
   */
  setActivePanel: (id) => {
    set(state => {
      const maxZ = Math.max(...Object.values(state.panels).map(p => p.zIndex || 0), 0);

      return {
        activePanel: id,
        panels: {
          ...state.panels,
          [id]: { ...state.panels[id], zIndex: maxZ + 1 }
        }
      };
    });
  },

  /**
   * Get panel by ID
   */
  getPanel: (id) => {
    return get().panels[id];
  },

  /**
   * Get all docked panels by position
   */
  getDockedPanels: (position) => {
    return Object.values(get().panels).filter(
      panel => panel.mode === 'docked' && panel.position === position && panel.visible
    );
  },

  /**
   * Get all floating panels
   */
  getFloatingPanels: () => {
    return Object.values(get().panels).filter(
      panel => panel.mode === 'floating' && panel.visible
    );
  },

  /**
   * Get all minimized panels
   */
  getMinimizedPanels: () => {
    return get().minimizedPanels.map(id => get().panels[id]).filter(Boolean);
  }
}));

export default usePanelStore;
