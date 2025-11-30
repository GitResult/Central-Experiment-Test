/**
 * Pages Store
 * Manages the state of pages in the application
 * Supports inline creation, editing, and navigation
 */

import { create } from 'zustand';

// Helper to generate slug from name
const generateSlug = (name) => {
  if (!name || name.trim() === '') return '/untitled';
  return '/' + name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Initial pages data
const INITIAL_PAGES = [
  { id: '1', slug: '/home', name: 'Home', isActive: true, hasContent: true },
  { id: '2', slug: '/dashboard', name: 'Dashboard', isActive: false, hasContent: true },
  { id: '3', slug: '/contacts', name: 'Contacts', isActive: false, hasContent: true },
  { id: '4', slug: '/contacts/:id', name: 'Contact Detail', isActive: false, hasContent: true },
  { id: '5', slug: '/tasks', name: 'Tasks', isActive: false, hasContent: true },
  { id: '6', slug: '/calendar', name: 'Calendar', isActive: false, hasContent: true },
  { id: '7', slug: '/settings', name: 'Settings', isActive: false, hasContent: true },
  { id: '8', slug: '/reports', name: 'Reports', isActive: false, hasContent: true },
  { id: '9', slug: '/studio', name: 'Studio', isActive: false, hasContent: true },
  { id: '10', slug: '/help', name: 'Help', isActive: false, hasContent: true }
];

export const usePagesStore = create((set, get) => ({
  // Pages list
  pages: INITIAL_PAGES,

  // Currently active page ID
  activePageId: '1',

  // Page being created (inline editing state)
  creatingPage: null, // { id, name, slug } or null

  // Page being edited
  editingPageId: null,

  // Generate unique ID
  generateId: () => {
    return `page-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Start creating a new page (inline)
  startCreatingPage: () => {
    const id = get().generateId();
    set({
      creatingPage: {
        id,
        name: '',
        slug: '/untitled'
      }
    });
    return id;
  },

  // Update the page being created
  updateCreatingPage: (name) => {
    set({
      creatingPage: {
        ...get().creatingPage,
        name,
        slug: generateSlug(name)
      }
    });
  },

  // Confirm page creation
  confirmCreatePage: () => {
    const { creatingPage, pages } = get();
    if (!creatingPage) return null;

    const finalName = creatingPage.name.trim() || 'Untitled';
    const finalSlug = generateSlug(finalName);

    const newPage = {
      id: creatingPage.id,
      name: finalName,
      slug: finalSlug,
      isActive: true,
      hasContent: false // New page has no content
    };

    // Deactivate other pages, add new page at top
    const updatedPages = pages.map(p => ({ ...p, isActive: false }));

    set({
      pages: [newPage, ...updatedPages],
      activePageId: newPage.id,
      creatingPage: null
    });

    return newPage;
  },

  // Cancel page creation
  cancelCreatePage: () => {
    set({ creatingPage: null });
  },

  // Select a page
  selectPage: (pageId) => {
    set((state) => ({
      pages: state.pages.map(p => ({
        ...p,
        isActive: p.id === pageId
      })),
      activePageId: pageId
    }));
  },

  // Start editing a page name
  startEditingPage: (pageId) => {
    set({ editingPageId: pageId });
  },

  // Update page name
  updatePageName: (pageId, name) => {
    set((state) => ({
      pages: state.pages.map(p =>
        p.id === pageId
          ? { ...p, name, slug: generateSlug(name) }
          : p
      )
    }));
  },

  // Stop editing
  stopEditingPage: () => {
    set({ editingPageId: null });
  },

  // Delete a page
  deletePage: (pageId) => {
    set((state) => {
      const newPages = state.pages.filter(p => p.id !== pageId);
      const wasActive = state.activePageId === pageId;

      return {
        pages: newPages,
        activePageId: wasActive && newPages.length > 0 ? newPages[0].id : state.activePageId
      };
    });
  },

  // Duplicate a page
  duplicatePage: (pageId) => {
    const { pages, generateId } = get();
    const page = pages.find(p => p.id === pageId);
    if (!page) return;

    const newId = generateId();
    const newName = `${page.name} (Copy)`;
    const newPage = {
      ...page,
      id: newId,
      name: newName,
      slug: generateSlug(newName),
      isActive: false
    };

    const index = pages.findIndex(p => p.id === pageId);
    const newPages = [...pages];
    newPages.splice(index + 1, 0, newPage);

    set({ pages: newPages });
    return newPage;
  },

  // Mark page as having content
  markPageHasContent: (pageId) => {
    set((state) => ({
      pages: state.pages.map(p =>
        p.id === pageId ? { ...p, hasContent: true } : p
      )
    }));
  },

  // Get active page
  getActivePage: () => {
    const { pages, activePageId } = get();
    return pages.find(p => p.id === activePageId);
  }
}));
