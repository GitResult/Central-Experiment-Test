/**
 * Navigation Store
 * Zustand store for navigation state
 */

import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
  isNavigatorOpen: false,

  openNavigator: () => set({ isNavigatorOpen: true }),
  closeNavigator: () => set({ isNavigatorOpen: false }),
  toggleNavigator: () => set((state) => ({ isNavigatorOpen: !state.isNavigatorOpen }))
}));
