/**
 * Studio Dock Store
 * Manages the state of the Studio Dock and its expanded options
 */

import { create } from 'zustand';

export const useStudioDockStore = create((set) => ({
  // Dock expanded state
  isExpanded: false,

  // Whether dock is in focus (for muted state)
  isFocused: false,

  // Toggle dock expansion
  toggleDock: () => set((state) => ({
    isExpanded: !state.isExpanded,
    isFocused: !state.isExpanded // Focus when expanding
  })),

  // Explicitly open/close dock
  openDock: () => set({ isExpanded: true, isFocused: true }),
  closeDock: () => set({ isExpanded: false, isFocused: false }),

  // Focus management
  setFocused: (focused) => set({ isFocused: focused }),

  // Panel states for each tool
  panels: {
    menu: false,
    studioOptionsBar: false,
    pages: false,
    snapshots: false,
    toolkit: false,
    explorer: false,
    insights: false,
    reports: false,
    timeline: false,
  },

  // Toggle specific panel
  togglePanel: (panelName) => set((state) => ({
    panels: {
      ...state.panels,
      [panelName]: !state.panels[panelName]
    }
  })),

  // Open specific panel
  openPanel: (panelName) => set((state) => ({
    panels: {
      ...state.panels,
      [panelName]: true
    }
  })),

  // Close specific panel
  closePanel: (panelName) => set((state) => ({
    panels: {
      ...state.panels,
      [panelName]: false
    }
  })),

  // Close all panels
  closeAllPanels: () => set({
    panels: {
      menu: false,
      studioOptionsBar: false,
      pages: false,
      snapshots: false,
      toolkit: false,
      explorer: false,
      insights: false,
      reports: false,
      timeline: false,
    }
  })
}));
