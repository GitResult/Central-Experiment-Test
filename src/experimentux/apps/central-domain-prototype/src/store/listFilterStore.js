/**
 * List Filter Store
 * Manages cross-card filtering when list items are selected (multi-select)
 */

import { create } from 'zustand';

export const useListFilterStore = create((set, get) => ({
  // Currently selected filters (array for multi-select)
  selectedFilters: [], // [{ cardId, itemName, itemColor, ratio }]

  // Record slide-out state
  slideOutOpen: false,
  slideOutData: null, // { itemName, itemColor, count, records }

  // Toggle a filter (add if not present, remove if present)
  // ratio: the proportion of total this item represents (0-1)
  toggleFilter: (cardId, itemName, itemColor, ratio = 1) => {
    const state = get();
    const existingIndex = state.selectedFilters.findIndex(
      f => f.cardId === cardId && f.itemName === itemName
    );

    if (existingIndex >= 0) {
      // Remove the filter
      set({
        selectedFilters: state.selectedFilters.filter((_, i) => i !== existingIndex)
      });
    } else {
      // Add the filter with its ratio
      set({
        selectedFilters: [...state.selectedFilters, { cardId, itemName, itemColor, ratio }]
      });
    }
  },

  // Clear all filters
  clearFilter: () => set({
    selectedFilters: []
  }),

  // Clear filters for a specific card
  clearCardFilters: (cardId) => {
    const state = get();
    set({
      selectedFilters: state.selectedFilters.filter(f => f.cardId !== cardId)
    });
  },

  // Record slide-out actions
  openSlideOut: (data) => set({
    slideOutOpen: true,
    slideOutData: data
  }),

  closeSlideOut: () => set({
    slideOutOpen: false,
    slideOutData: null
  }),

  // Check if a specific item is selected
  isItemSelected: (cardId, itemName) => {
    const state = get();
    return state.selectedFilters.some(
      f => f.cardId === cardId && f.itemName === itemName
    );
  },

  // Check if filter is active for a card
  isCardFiltered: (cardId) => {
    const state = get();
    return state.selectedFilters.some(f => f.cardId === cardId);
  },

  // Get filters for a specific card
  getCardFilters: (cardId) => {
    const state = get();
    return state.selectedFilters.filter(f => f.cardId === cardId);
  },

  // Get all selected filter names
  getSelectedNames: () => {
    const state = get();
    return state.selectedFilters.map(f => f.itemName);
  },

  // Get combined ratio from filters in other cards (for cross-card filtering)
  // When multiple items are selected, sum their ratios (capped at 1)
  getCrossCardRatio: (excludeCardId) => {
    const state = get();
    const otherFilters = state.selectedFilters.filter(f => f.cardId !== excludeCardId);
    if (otherFilters.length === 0) return 1;

    // Group by card and sum ratios within each card, then average across cards
    const cardRatios = {};
    otherFilters.forEach(f => {
      if (!cardRatios[f.cardId]) {
        cardRatios[f.cardId] = 0;
      }
      cardRatios[f.cardId] += f.ratio || 0;
    });

    // Cap each card's total ratio at 1
    const ratioValues = Object.values(cardRatios).map(r => Math.min(r, 1));

    // Average the ratios from different cards
    return ratioValues.reduce((sum, r) => sum + r, 0) / ratioValues.length;
  }
}));
