/**
 * Snapshot Store
 * Zustand store for managing snapshot state
 */

import { create } from 'zustand';

export const useSnapshotStore = create((set) => ({
  // Capture state
  isCapturing: false,
  isUploading: false,
  captureError: null,
  lastSnapshot: null,
  captureMode: 'region', // 'region' | 'pre-markup'
  preMarkupAnnotations: null,

  // Gallery state
  snapshots: [],
  selectedSnapshot: null,
  galleryView: 'grid', // 'grid' | 'list' | 'polaroid'
  galleryFilters: {
    module: null,
    dateRange: null,
    creator: null,
    searchQuery: '',
  },

  // Discussion panel state
  discussionPanelOpen: false,
  discussionPanelSnapshot: null,

  // Actions
  startCapture: (mode = 'region') => set({ isCapturing: true, captureError: null, captureMode: mode }),
  cancelCapture: () => set({ isCapturing: false, captureMode: 'region', preMarkupAnnotations: null }),
  setPreMarkupAnnotations: (annotations) => set({ preMarkupAnnotations: annotations }),
  setUploading: (uploading) => set({ isUploading: uploading }),
  setCaptureError: (error) => set({ captureError: error, isCapturing: false, isUploading: false }),
  setLastSnapshot: (snapshot) => set({ lastSnapshot: snapshot }),

  // Snapshot management
  addSnapshot: (snapshot) => set((state) => ({
    snapshots: [snapshot, ...state.snapshots],
    lastSnapshot: snapshot,
  })),

  setSnapshots: (snapshots) => set({ snapshots }),

  selectSnapshot: (snapshot) => set({ selectedSnapshot: snapshot }),

  updateSnapshot: (snapshotId, updates) => set((state) => ({
    snapshots: state.snapshots.map(s =>
      s.id === snapshotId ? { ...s, ...updates } : s
    ),
  })),

  deleteSnapshot: (snapshotId) => set((state) => ({
    snapshots: state.snapshots.filter(s => s.id !== snapshotId),
  })),

  // Gallery controls
  setGalleryView: (view) => set({ galleryView: view }),
  setGalleryFilters: (filters) => set({ galleryFilters: filters }),

  // Discussion panel
  openDiscussionPanel: (snapshot) => set({
    discussionPanelOpen: true,
    discussionPanelSnapshot: snapshot,
  }),

  closeDiscussionPanel: () => set({
    discussionPanelOpen: false,
    discussionPanelSnapshot: null,
  }),
}));
