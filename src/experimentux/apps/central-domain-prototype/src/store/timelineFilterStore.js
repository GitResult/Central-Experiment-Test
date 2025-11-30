/**
 * Timeline Filter Store
 * Manages the week range filter for collection data
 */

import { create } from 'zustand';

// Generate week data for 2025 Annual Conference (Jan - Sep 2025)
const generateWeekData = () => {
  const weeks = [];
  const startDate = new Date('2025-01-06'); // First Monday of 2025
  const endDate = new Date('2025-09-15'); // Conference date

  let currentDate = new Date(startDate);
  let weekNum = 1;

  while (currentDate <= endDate) {
    const weekStart = new Date(currentDate);
    const weekEnd = new Date(currentDate);
    weekEnd.setDate(weekEnd.getDate() + 6);

    // Generate realistic registration data (grows as conference approaches)
    const weeksUntilConference = Math.max(1, Math.ceil((endDate - currentDate) / (7 * 24 * 60 * 60 * 1000)));
    const baseRegistrations = Math.floor(Math.random() * 15) + 5;
    const growthFactor = Math.max(1, (36 - weeksUntilConference) / 10);
    const registrations = Math.floor(baseRegistrations * growthFactor);

    weeks.push({
      id: weekNum,
      weekNum,
      startDate: weekStart.toISOString(),
      endDate: weekEnd.toISOString(),
      label: `W${weekNum}`,
      fullLabel: `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
      monthLabel: weekStart.toLocaleDateString('en-US', { month: 'short' }),
      registrations,
      // Breakdown by type
      breakdown: {
        full: Math.floor(registrations * 0.45),
        early: Math.floor(registrations * 0.30),
        student: Math.floor(registrations * 0.15),
        vip: Math.floor(registrations * 0.10)
      }
    });

    currentDate.setDate(currentDate.getDate() + 7);
    weekNum++;
  }

  return weeks;
};

const WEEK_DATA = generateWeekData();

export const useTimelineFilterStore = create((set, get) => ({
  // All available weeks
  weeks: WEEK_DATA,

  // Selected range (week indices, 0-based)
  rangeStart: 0,
  rangeEnd: WEEK_DATA.length - 1,

  // Whether filter is active
  isFilterActive: false,

  // Panel visibility
  isPanelOpen: false,

  // Drag state for smooth interactions
  isDragging: false,
  dragHandle: null, // 'start' | 'end' | 'range'

  // Actions
  setRange: (start, end) => set({
    rangeStart: Math.max(0, Math.min(start, WEEK_DATA.length - 1)),
    rangeEnd: Math.max(0, Math.min(end, WEEK_DATA.length - 1)),
    isFilterActive: true
  }),

  setRangeStart: (start) => set((state) => ({
    rangeStart: Math.max(0, Math.min(start, state.rangeEnd)),
    isFilterActive: true
  })),

  setRangeEnd: (end) => set((state) => ({
    rangeEnd: Math.min(WEEK_DATA.length - 1, Math.max(end, state.rangeStart)),
    isFilterActive: true
  })),

  resetRange: () => set({
    rangeStart: 0,
    rangeEnd: WEEK_DATA.length - 1,
    isFilterActive: false
  }),

  togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),
  openPanel: () => set({ isPanelOpen: true }),
  closePanel: () => set({ isPanelOpen: false }),

  setDragging: (isDragging, handle = null) => set({ isDragging, dragHandle: handle }),

  // Computed values
  getSelectedWeeks: () => {
    const state = get();
    return state.weeks.slice(state.rangeStart, state.rangeEnd + 1);
  },

  getTotalRegistrations: () => {
    const state = get();
    const selected = state.weeks.slice(state.rangeStart, state.rangeEnd + 1);
    return selected.reduce((sum, week) => sum + week.registrations, 0);
  },

  getBreakdownTotals: () => {
    const state = get();
    const selected = state.weeks.slice(state.rangeStart, state.rangeEnd + 1);
    return selected.reduce((totals, week) => ({
      full: totals.full + week.breakdown.full,
      early: totals.early + week.breakdown.early,
      student: totals.student + week.breakdown.student,
      vip: totals.vip + week.breakdown.vip
    }), { full: 0, early: 0, student: 0, vip: 0 });
  },

  getDateRange: () => {
    const state = get();
    const startWeek = state.weeks[state.rangeStart];
    const endWeek = state.weeks[state.rangeEnd];
    return {
      start: new Date(startWeek.startDate),
      end: new Date(endWeek.endDate)
    };
  }
}));
