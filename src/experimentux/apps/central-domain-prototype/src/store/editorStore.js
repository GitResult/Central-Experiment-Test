/**
 * Editor Store
 * Manages page editor state, selected elements, and edit operations
 */

import { create } from 'zustand';

const createEmptyPage = () => ({
  id: `page-${Date.now()}`,
  name: 'Untitled Page',
  description: '',
  type: 'Custom',
  layout: 'wide',
  zones: [
    {
      id: 'main-content',
      rows: []
    }
  ]
});

export const useEditorStore = create((set, get) => ({
  // Current page being edited
  currentPage: createEmptyPage(),

  // Multiple pages storage (keyed by route or page key)
  pages: {},

  // Version counter - increments on any pages change to force re-renders
  pagesVersion: 0,

  // Current page key being edited
  currentPageKey: null,

  // Selected elements for editing (array of paths to elements in page structure)
  selectedElements: [],

  // Right sidebar state
  sidebarOpen: false,
  sidebarTab: 'elements', // 'elements' | 'settings' - default to elements for drag-and-drop

  // Column drag state - for showing overlays on page during column width adjustment
  isAdjustingColumns: false,
  columnDragWidths: null,

  // Editor mode
  mode: 'edit', // 'edit' | 'preview'

  // Alignment guides state
  alignmentGuides: null,
  showAlignmentGuides: true,

  // Canvas zoom state
  canvasZoom: 1,
  canvasZoomBeforeDrag: null, // Stores zoom level before auto-zoom during drag
  isDragging: false,
  draggedElement: null, // Stores the element being dragged for overlay
  lastDroppedElementId: null, // Track the last dropped element for scroll-into-view

  // Canvas pan limits - minimum percentage of frame that must remain visible
  // 0.2 = 20% of frame must stay visible, 1.0 = frame edge can touch viewport edge
  canvasPanLimit: 0.2,
  setCanvasPanLimit: (limit) => set({ canvasPanLimit: Math.max(0.1, Math.min(1.0, limit)) }),

  // Canvas interaction mode - 'select' for normal editing, 'pan' for hand tool
  canvasInteractionMode: 'select',
  setCanvasInteractionMode: (mode) => set({ canvasInteractionMode: mode }),

  // JSON editor state
  jsonEditorOpen: false,

  // Theme customizer state
  themeCustomizerOpen: false,

  // Locale manager state
  localeManagerOpen: false,

  // History for undo/redo
  history: [],
  historyIndex: -1,

  // Initialize or get a page for a specific route
  ensurePage: (pageKey, defaultName = 'Untitled Page') => {
    const { pages } = get();
    if (!pages[pageKey]) {
      const newPage = createEmptyPage();
      newPage.name = defaultName;

      // Special initialization for home page (single zone with two columns)
      if (pageKey === 'home') {
        newPage.zones = [
          {
            id: 'home-main',
            rows: [{
              columns: [
                {
                  width: 67,  // Main content column (67%)
                  elements: [
                    // Default elements for home main column
                    {
                      id: 'home-welcome-1',
                      type: 'welcome-card',
                      data: {},
                      settings: {}
                    },
                    {
                      id: 'home-journey-1',
                      type: 'journey-card',
                      data: {},
                      settings: {}
                    },
                    {
                      id: 'home-insights-1',
                      type: 'insights-card',
                      data: {},
                      settings: {}
                    }
                  ]
                },
                {
                  width: 33,  // Sidebar column (33%)
                  elements: [
                    // Default elements for home sidebar column
                    {
                      id: 'home-quicklinks-1',
                      type: 'quick-links',
                      data: {},
                      settings: {}
                    },
                    {
                      id: 'home-tasks-1',
                      type: 'upcoming-tasks',
                      data: {},
                      settings: {}
                    }
                  ]
                }
              ]
            }]
          }
        ];
      } else {
        // Initialize with a row containing one column for most pages
        if (newPage.zones[0].rows.length === 0) {
          newPage.zones[0].rows.push({
            columns: [
              { elements: [], width: 100 }
            ]
          });
        }
      }

      set({ pages: { ...pages, [pageKey]: newPage } });
    }
    return get().pages[pageKey];
  },

  // Create new page
  createNewPage: () => {
    const newPage = createEmptyPage();
    set({
      currentPage: newPage,
      selectedElements: [],
      history: [newPage],
      historyIndex: 0
    });
  },

  // Load existing page
  loadPage: (pageData) => {
    set({
      currentPage: pageData,
      selectedElements: [],
      history: [pageData],
      historyIndex: 0
    });
  },

  // Update page metadata
  updatePageMetadata: (updates, pageKey = null) => {
    if (pageKey) {
      // Update specific page
      const { pages } = get();
      const page = pages[pageKey];
      if (page) {
        const updatedPage = { ...page, ...updates };
        set({ pages: { ...pages, [pageKey]: updatedPage } });
      }
    } else {
      // Update current page
      const currentPage = { ...get().currentPage, ...updates };
      set({ currentPage });
      get().addToHistory(currentPage);
    }
  },

  // Add element to the page
  addElement: (zoneId, rowIndex, columnIndex, element, pageKey = null, elementIndex = null) => {
    // Ensure element has a unique ID for proper React reconciliation
    const elementWithId = {
      ...element,
      id: element.id || `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    if (pageKey) {
      // Add to specific page
      const { pages } = get();
      const page = pages[pageKey];
      if (!page) return;

      const currentPage = JSON.parse(JSON.stringify(page));
      const zone = currentPage.zones.find(z => z.id === zoneId);

      if (!zone) return;

      // Create row if it doesn't exist
      if (!zone.rows[rowIndex]) {
        zone.rows[rowIndex] = { columns: [] };
      }

      // Create column if it doesn't exist
      if (!zone.rows[rowIndex].columns[columnIndex]) {
        zone.rows[rowIndex].columns[columnIndex] = {
          width: 100,
          elements: []
        };
      }

      // Add element at specific position or append
      if (elementIndex !== null && elementIndex !== undefined) {
        zone.rows[rowIndex].columns[columnIndex].elements.splice(elementIndex, 0, elementWithId);
      } else {
        zone.rows[rowIndex].columns[columnIndex].elements.push(elementWithId);
      }

      set({ pages: { ...pages, [pageKey]: currentPage }, lastDroppedElementId: elementWithId.id });
    } else {
      // Add to current page
      const currentPage = JSON.parse(JSON.stringify(get().currentPage));
      const zone = currentPage.zones.find(z => z.id === zoneId);

      if (!zone) return;

      // Create row if it doesn't exist
      if (!zone.rows[rowIndex]) {
        zone.rows[rowIndex] = { columns: [] };
      }

      // Create column if it doesn't exist
      if (!zone.rows[rowIndex].columns[columnIndex]) {
        zone.rows[rowIndex].columns[columnIndex] = {
          width: 100,
          elements: []
        };
      }

      // Add element at specific position or append
      if (elementIndex !== null && elementIndex !== undefined) {
        zone.rows[rowIndex].columns[columnIndex].elements.splice(elementIndex, 0, elementWithId);
      } else {
        zone.rows[rowIndex].columns[columnIndex].elements.push(elementWithId);
      }

      set({ currentPage });
      get().addToHistory(currentPage);
    }
  },

  // Update element
  updateElement: (path, updates, pageKey = null) => {
    // Helper function for deep merging nested objects
    const deepMerge = (target, source) => {
      const result = { ...target };
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          result[key] = deepMerge(target[key] || {}, source[key]);
        } else {
          result[key] = source[key];
        }
      }
      return result;
    };

    if (pageKey) {
      // Update element in specific page
      const { pages } = get();
      const page = pages[pageKey];

      if (page) {
        const updatedPage = JSON.parse(JSON.stringify(page));
        const element = get().getElementByPath(updatedPage, path);

        if (element) {
          // Merge updates
          if (updates.data) {
            element.data = { ...element.data, ...updates.data };
          }
          if (updates.settings) {
            element.settings = deepMerge(element.settings || {}, updates.settings);
          }

          set({ pages: { ...pages, [pageKey]: updatedPage } });
        }
      }
    } else {
      // Update element in currentPage
      const currentPage = JSON.parse(JSON.stringify(get().currentPage));
      const element = get().getElementByPath(currentPage, path);

      if (element) {
        // Merge updates
        if (updates.data) {
          element.data = { ...element.data, ...updates.data };
        }
        if (updates.settings) {
          element.settings = deepMerge(element.settings || {}, updates.settings);
        }

        set({ currentPage });
        get().addToHistory(currentPage);
      }
    }
  },

  // Update zone settings
  updateZoneSettings: (zoneId, settings) => {
    const currentPage = JSON.parse(JSON.stringify(get().currentPage));
    const zone = currentPage.zones.find(z => z.id === zoneId);

    if (zone) {
      zone.settings = { ...zone.settings, ...settings };
      set({ currentPage });
      get().addToHistory(currentPage);
    }
  },

  // Update row settings
  updateRowSettings: (zoneId, rowIndex, settings) => {
    const currentPage = JSON.parse(JSON.stringify(get().currentPage));
    const zone = currentPage.zones.find(z => z.id === zoneId);

    if (zone?.rows[rowIndex]) {
      const row = zone.rows[rowIndex];
      row.settings = { ...row.settings, ...settings };
      set({ currentPage });
      get().addToHistory(currentPage);
    }
  },

  // Update column settings
  updateColumnSettings: (zoneId, rowIndex, columnIndex, settings) => {
    const currentPage = JSON.parse(JSON.stringify(get().currentPage));
    const zone = currentPage.zones.find(z => z.id === zoneId);

    if (zone?.rows[rowIndex]?.columns[columnIndex]) {
      const column = zone.rows[rowIndex].columns[columnIndex];
      column.settings = { ...column.settings, ...settings };
      set({ currentPage });
      get().addToHistory(currentPage);
    }
  },

  // Remove element
  removeElement: (path, pageKey = null) => {
    if (pageKey) {
      // Remove from specific page
      const { pages } = get();
      const page = pages[pageKey];
      if (!page) return;

      const updatedPage = JSON.parse(JSON.stringify(page));
      const { zoneId, rowIndex, columnIndex, elementIndex } = path;

      const zone = updatedPage.zones.find(z => z.id === zoneId);
      if (zone?.rows[rowIndex]?.columns[columnIndex]?.elements) {
        zone.rows[rowIndex].columns[columnIndex].elements.splice(elementIndex, 1);
        set({ pages: { ...pages, [pageKey]: updatedPage } });
      }
    } else {
      // Remove from current page
      const currentPage = JSON.parse(JSON.stringify(get().currentPage));
      const { zoneId, rowIndex, columnIndex, elementIndex } = path;

      const zone = currentPage.zones.find(z => z.id === zoneId);
      if (zone?.rows[rowIndex]?.columns[columnIndex]?.elements) {
        zone.rows[rowIndex].columns[columnIndex].elements.splice(elementIndex, 1);

        // Remove from selection if selected
        const selectedElements = get().selectedElements.filter(
          sel => !(sel.zoneId === zoneId && sel.rowIndex === rowIndex &&
                  sel.columnIndex === columnIndex && sel.elementIndex === elementIndex)
        );

        set({ currentPage, selectedElements });
        get().addToHistory(currentPage);
      }
    }
  },

  // Move element from one position to another (atomic operation)
  moveElement: (fromPath, toZoneId, toRowIndex, toColumnIndex, toElementIndex, pageKey = null) => {
    if (pageKey) {
      const { pages } = get();
      const page = pages[pageKey];
      if (!page) return;

      const updatedPage = JSON.parse(JSON.stringify(page));
      const { zoneId: fromZoneId, rowIndex: fromRowIndex, columnIndex: fromColumnIndex, elementIndex: fromElementIndex } = fromPath;

      // Get source zone and element
      const fromZone = updatedPage.zones.find(z => z.id === fromZoneId);
      if (!fromZone?.rows[fromRowIndex]?.columns[fromColumnIndex]?.elements) return;

      // Remove element from source
      const [element] = fromZone.rows[fromRowIndex].columns[fromColumnIndex].elements.splice(fromElementIndex, 1);
      if (!element) return;

      // Get target zone
      const toZone = updatedPage.zones.find(z => z.id === toZoneId);
      if (!toZone) return;

      // Create row if needed
      if (!toZone.rows[toRowIndex]) {
        toZone.rows[toRowIndex] = { columns: [] };
      }

      // Create column if needed
      if (!toZone.rows[toRowIndex].columns[toColumnIndex]) {
        toZone.rows[toRowIndex].columns[toColumnIndex] = { elements: [], width: 100 };
      }

      // Adjust target index if moving within same column and source was before target
      let adjustedIndex = toElementIndex;
      const sameColumn = fromZoneId === toZoneId && fromRowIndex === toRowIndex && fromColumnIndex === toColumnIndex;
      if (sameColumn && fromElementIndex < toElementIndex) {
        adjustedIndex = toElementIndex - 1;
      }

      // Insert element at target
      toZone.rows[toRowIndex].columns[toColumnIndex].elements.splice(adjustedIndex, 0, element);

      const { pagesVersion } = get();
      const newPages = { ...pages, [pageKey]: updatedPage };
      set({ pages: newPages, pagesVersion: pagesVersion + 1, lastDroppedElementId: element.id });
    } else {
      // Move in current page
      const currentPage = JSON.parse(JSON.stringify(get().currentPage));
      const { zoneId: fromZoneId, rowIndex: fromRowIndex, columnIndex: fromColumnIndex, elementIndex: fromElementIndex } = fromPath;

      const fromZone = currentPage.zones.find(z => z.id === fromZoneId);
      if (!fromZone?.rows[fromRowIndex]?.columns[fromColumnIndex]?.elements) return;

      const [element] = fromZone.rows[fromRowIndex].columns[fromColumnIndex].elements.splice(fromElementIndex, 1);
      if (!element) return;

      const toZone = currentPage.zones.find(z => z.id === toZoneId);
      if (!toZone) return;

      if (!toZone.rows[toRowIndex]) {
        toZone.rows[toRowIndex] = { columns: [] };
      }
      if (!toZone.rows[toRowIndex].columns[toColumnIndex]) {
        toZone.rows[toRowIndex].columns[toColumnIndex] = { elements: [], width: 100 };
      }

      let adjustedIndex = toElementIndex;
      const sameColumn = fromZoneId === toZoneId && fromRowIndex === toRowIndex && fromColumnIndex === toColumnIndex;
      if (sameColumn && fromElementIndex < toElementIndex) {
        adjustedIndex = toElementIndex - 1;
      }

      toZone.rows[toRowIndex].columns[toColumnIndex].elements.splice(adjustedIndex, 0, element);

      set({ currentPage });
      get().addToHistory(currentPage);
    }
  },

  // Update page settings
  updatePageSettings: (updates, pageKey = null) => {
    if (pageKey) {
      // Update specific page in pages object
      const { pages } = get();
      const page = pages[pageKey];
      if (!page) return;

      const updatedPage = JSON.parse(JSON.stringify(page));

      // Update the main zone (first zone, first row)
      if (updatedPage.zones?.[0]) {
        const mainZone = updatedPage.zones[0];

        // Update zone-level settings
        if (updates.containerWidth !== undefined) {
          mainZone.containerWidth = updates.containerWidth;
        }
        if (updates.sectionSpacing !== undefined) {
          mainZone.sectionSpacing = updates.sectionSpacing;
        }

        // Update row-level settings
        if (mainZone.rows?.[0]) {
          const firstRow = mainZone.rows[0];

          if (updates.columns !== undefined && updates.columns !== firstRow.columns.length) {
            // Adjust number of columns
            const newColumns = updates.columns;
            const currentColumns = firstRow.columns.length;

            if (newColumns > currentColumns) {
              // Add columns with equal width distribution
              const equalWidth = 100 / newColumns;

              // Update existing columns to new equal width
              firstRow.columns.forEach(col => {
                col.width = equalWidth;
              });

              // Add new columns
              for (let i = currentColumns; i < newColumns; i++) {
                firstRow.columns.push({
                  elements: [],
                  width: equalWidth
                });
              }
            } else {
              // Remove columns and redistribute widths equally
              firstRow.columns.splice(newColumns);
              const equalWidth = 100 / newColumns;
              firstRow.columns.forEach(col => {
                col.width = equalWidth;
              });
            }
          }

          // Update individual column widths
          if (updates.columnWidths !== undefined && Array.isArray(updates.columnWidths)) {
            updates.columnWidths.forEach((width, index) => {
              if (firstRow.columns[index]) {
                firstRow.columns[index].width = width;
              }
            });
          }

          if (updates.columnGap !== undefined) {
            firstRow.columnGap = updates.columnGap;
          }
          if (updates.contentPadding !== undefined) {
            firstRow.contentPadding = updates.contentPadding;
          }
          if (updates.elementsVerticalGap !== undefined) {
            firstRow.elementsVerticalGap = updates.elementsVerticalGap;
          }
        }
      }

      set({ pages: { ...pages, [pageKey]: updatedPage } });
    } else {
      // Update currentPage
      const currentPage = JSON.parse(JSON.stringify(get().currentPage));

      // Update the main zone (first zone, first row)
      if (currentPage.zones?.[0]) {
        const mainZone = currentPage.zones[0];

        // Update zone-level settings
        if (updates.containerWidth !== undefined) {
          mainZone.containerWidth = updates.containerWidth;
        }
        if (updates.sectionSpacing !== undefined) {
          mainZone.sectionSpacing = updates.sectionSpacing;
        }

        // Update row-level settings
        if (mainZone.rows?.[0]) {
          const firstRow = mainZone.rows[0];

          if (updates.columns !== undefined && updates.columns !== firstRow.columns.length) {
            // Adjust number of columns
            const newColumns = updates.columns;
            const currentColumns = firstRow.columns.length;

            if (newColumns > currentColumns) {
              // Add columns with equal width distribution
              const equalWidth = 100 / newColumns;

              // Update existing columns to new equal width
              firstRow.columns.forEach(col => {
                col.width = equalWidth;
              });

              // Add new columns
              for (let i = currentColumns; i < newColumns; i++) {
                firstRow.columns.push({
                  elements: [],
                  width: equalWidth
                });
              }
            } else {
              // Remove columns and redistribute widths equally
              firstRow.columns.splice(newColumns);
              const equalWidth = 100 / newColumns;
              firstRow.columns.forEach(col => {
                col.width = equalWidth;
              });
            }
          }

          // Update individual column widths
          if (updates.columnWidths !== undefined && Array.isArray(updates.columnWidths)) {
            updates.columnWidths.forEach((width, index) => {
              if (firstRow.columns[index]) {
                firstRow.columns[index].width = width;
              }
            });
          }

          if (updates.columnGap !== undefined) {
            firstRow.columnGap = updates.columnGap;
          }
          if (updates.contentPadding !== undefined) {
            firstRow.contentPadding = updates.contentPadding;
          }
          if (updates.elementsVerticalGap !== undefined) {
            firstRow.elementsVerticalGap = updates.elementsVerticalGap;
          }
        }
      }

      set({ currentPage });
      get().addToHistory(currentPage);
    }
  },

  // Select element(s) for editing
  // mode: 'replace' (default), 'add' (Ctrl/Cmd+click), 'toggle' (click on selected)
  selectElement: (path, mode = 'replace') => {
    const { selectedElements } = get();

    // Helper to check if path matches
    const pathMatches = (p1, p2) =>
      p1.zoneId === p2.zoneId &&
      p1.rowIndex === p2.rowIndex &&
      p1.columnIndex === p2.columnIndex &&
      p1.elementIndex === p2.elementIndex;

    const isAlreadySelected = selectedElements.some(sel => pathMatches(sel, path));

    let newSelection = [];

    switch (mode) {
      case 'add':
        // Add to existing selection if not already selected
        newSelection = isAlreadySelected
          ? selectedElements
          : [...selectedElements, path];
        break;

      case 'toggle':
        // Toggle selection
        newSelection = isAlreadySelected
          ? selectedElements.filter(sel => !pathMatches(sel, path))
          : [...selectedElements, path];
        break;

      case 'replace':
      default:
        // Replace entire selection
        newSelection = [path];
        break;
    }

    // Automatically open sidebar and switch to settings tab when selecting an element
    if (newSelection.length > 0) {
      set({
        selectedElements: newSelection,
        sidebarOpen: true,
        sidebarTab: 'settings'
      });
    } else {
      set({ selectedElements: newSelection });
    }
  },

  // Select multiple elements at once
  selectMultiple: (paths) => {
    set({ selectedElements: paths });
  },

  // Deselect a specific element
  deselectElement: (path) => {
    const selectedElements = get().selectedElements.filter(
      sel => !(sel.zoneId === path.zoneId && sel.rowIndex === path.rowIndex &&
              sel.columnIndex === path.columnIndex && sel.elementIndex === path.elementIndex)
    );
    set({ selectedElements });
  },

  // Clear all selections
  clearSelection: () => {
    set({ selectedElements: [] });
  },

  // Check if element is selected
  isElementSelected: (path) => {
    return get().selectedElements.some(
      sel => sel.zoneId === path.zoneId && sel.rowIndex === path.rowIndex &&
            sel.columnIndex === path.columnIndex && sel.elementIndex === path.elementIndex
    );
  },

  // Toggle sidebar
  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  // Open sidebar
  openSidebar: (tab = 'elements') => {
    set({ sidebarOpen: true, sidebarTab: tab });
  },

  // Close sidebar
  closeSidebar: () => {
    set({ sidebarOpen: false });
  },

  // Set sidebar tab
  setSidebarTab: (tab) => {
    set({ sidebarTab: tab });
  },

  // Set column drag state (for showing overlays on page)
  setColumnDragState: (isAdjusting, widths = null) => {
    set({ isAdjustingColumns: isAdjusting, columnDragWidths: widths });
  },

  // Set or update a page in the pages object
  setPage: (pageKey, pageData) => {
    set((state) => ({
      pages: {
        ...state.pages,
        [pageKey]: JSON.parse(JSON.stringify(pageData)) // Deep clone
      }
    }));
  },

  // Set current page key (for multi-page scenarios like showcase)
  setCurrentPageKey: (pageKey) => {
    set({ currentPageKey: pageKey });
  },

  // Get element by path
  getElementByPath: (page, path) => {
    const { zoneId, rowIndex, columnIndex, elementIndex } = path;
    const zone = page.zones.find(z => z.id === zoneId);
    return zone?.rows[rowIndex]?.columns[columnIndex]?.elements[elementIndex];
  },

  // Get element from current page by path (convenience method)
  getElement: (path) => {
    const { currentPage } = get();
    return get().getElementByPath(currentPage, path);
  },

  // Get currently selected element (first in selection for backward compatibility)
  getSelectedElement: () => {
    const { currentPage, currentPageKey, pages, selectedElements } = get();
    if (!selectedElements || selectedElements.length === 0) return null;

    // Use the appropriate page based on whether we have a currentPageKey
    const page = currentPageKey && pages[currentPageKey] ? pages[currentPageKey] : currentPage;
    return get().getElementByPath(page, selectedElements[0]);
  },

  // Get all selected elements
  getSelectedElements: () => {
    const { currentPage, currentPageKey, pages, selectedElements } = get();

    // Use the appropriate page based on whether we have a currentPageKey
    const page = currentPageKey && pages[currentPageKey] ? pages[currentPageKey] : currentPage;

    return selectedElements.map(path => ({
      path,
      element: get().getElementByPath(page, path)
    })).filter(item => item.element !== undefined);
  },

  // Toggle mode
  toggleMode: () => {
    set((state) => ({
      mode: state.mode === 'edit' ? 'preview' : 'edit'
    }));
  },

  // History management
  addToHistory: (page) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(page)));

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1
    });
  },

  // Undo
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      set({
        currentPage: JSON.parse(JSON.stringify(history[newIndex])),
        historyIndex: newIndex
      });
    }
  },

  // Redo
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      set({
        currentPage: JSON.parse(JSON.stringify(history[newIndex])),
        historyIndex: newIndex
      });
    }
  },

  // Reorder elements within same column
  reorderElements: (zoneId, rowIndex, columnIndex, oldIndex, newIndex) => {
    const currentPage = JSON.parse(JSON.stringify(get().currentPage));
    const zone = currentPage.zones.find(z => z.id === zoneId);

    if (zone?.rows[rowIndex]?.columns[columnIndex]?.elements) {
      const elements = zone.rows[rowIndex].columns[columnIndex].elements;
      const [removed] = elements.splice(oldIndex, 1);
      elements.splice(newIndex, 0, removed);

      set({ currentPage });
      get().addToHistory(currentPage);
    }
  },

  // Move element between columns (within same row)
  moveElementBetweenColumns: (
    zoneId,
    rowIndex,
    sourceColumnIndex,
    destColumnIndex,
    sourceElementIndex,
    destElementIndex
  ) => {
    const currentPage = JSON.parse(JSON.stringify(get().currentPage));
    const zone = currentPage.zones.find(z => z.id === zoneId);

    if (!zone?.rows[rowIndex]) return;

    const sourceColumn = zone.rows[rowIndex].columns[sourceColumnIndex];
    const destColumn = zone.rows[rowIndex].columns[destColumnIndex];

    if (!sourceColumn?.elements || !destColumn) return;

    // Remove from source
    const [element] = sourceColumn.elements.splice(sourceElementIndex, 1);

    // Create elements array if it doesn't exist
    if (!destColumn.elements) {
      destColumn.elements = [];
    }

    // Add to destination
    destColumn.elements.splice(destElementIndex, 0, element);

    set({ currentPage });
    get().addToHistory(currentPage);
  },

  // Move element between rows
  moveElementBetweenRows: (
    zoneId,
    sourceRowIndex,
    destRowIndex,
    sourceColumnIndex,
    destColumnIndex,
    sourceElementIndex,
    destElementIndex
  ) => {
    const currentPage = JSON.parse(JSON.stringify(get().currentPage));
    const zone = currentPage.zones.find(z => z.id === zoneId);

    if (!zone?.rows[sourceRowIndex] || !zone?.rows[destRowIndex]) return;

    const sourceColumn = zone.rows[sourceRowIndex].columns[sourceColumnIndex];
    const destColumn = zone.rows[destRowIndex].columns[destColumnIndex];

    if (!sourceColumn?.elements || !destColumn) return;

    // Remove from source
    const [element] = sourceColumn.elements.splice(sourceElementIndex, 1);

    // Create elements array if it doesn't exist
    if (!destColumn.elements) {
      destColumn.elements = [];
    }

    // Add to destination
    destColumn.elements.splice(destElementIndex, 0, element);

    set({ currentPage });
    get().addToHistory(currentPage);
  },

  // Check if can undo/redo
  canUndo: () => {
    return get().historyIndex > 0;
  },

  canRedo: () => {
    const { history, historyIndex } = get();
    return historyIndex < history.length - 1;
  },

  // Bulk operations for multi-selection

  // Delete all selected elements
  deleteSelected: () => {
    const { selectedElements } = get();
    if (selectedElements.length === 0) return;

    const currentPage = JSON.parse(JSON.stringify(get().currentPage));

    // Sort by elementIndex descending to avoid index shifting issues
    const sortedPaths = [...selectedElements].sort((a, b) => {
      if (a.zoneId !== b.zoneId) return 0;
      if (a.rowIndex !== b.rowIndex) return 0;
      if (a.columnIndex !== b.columnIndex) return 0;
      return b.elementIndex - a.elementIndex;
    });

    // Delete each element
    sortedPaths.forEach(path => {
      const { zoneId, rowIndex, columnIndex, elementIndex } = path;
      const zone = currentPage.zones.find(z => z.id === zoneId);
      if (zone?.rows[rowIndex]?.columns[columnIndex]?.elements) {
        zone.rows[rowIndex].columns[columnIndex].elements.splice(elementIndex, 1);
      }
    });

    set({ currentPage, selectedElements: [] });
    get().addToHistory(currentPage);
  },

  // Duplicate all selected elements
  duplicateSelected: () => {
    const { selectedElements } = get();
    if (selectedElements.length === 0) return;

    const currentPage = JSON.parse(JSON.stringify(get().currentPage));
    const newPaths = [];

    selectedElements.forEach(path => {
      const { zoneId, rowIndex, columnIndex, elementIndex } = path;
      const zone = currentPage.zones.find(z => z.id === zoneId);

      if (zone?.rows[rowIndex]?.columns[columnIndex]?.elements) {
        const element = zone.rows[rowIndex].columns[columnIndex].elements[elementIndex];
        if (element) {
          // Deep clone the element
          const duplicatedElement = JSON.parse(JSON.stringify(element));

          // Insert after the original
          zone.rows[rowIndex].columns[columnIndex].elements.splice(
            elementIndex + 1,
            0,
            duplicatedElement
          );

          // Track the new element's path
          newPaths.push({
            zoneId,
            rowIndex,
            columnIndex,
            elementIndex: elementIndex + 1
          });
        }
      }
    });

    // Select the duplicated elements
    set({ currentPage, selectedElements: newPaths });
    get().addToHistory(currentPage);
  },

  // Move all selected elements (used for alignment, grouping, etc.)
  moveSelected: (targetZoneId, targetRowIndex, targetColumnIndex) => {
    const { selectedElements } = get();
    if (selectedElements.length === 0) return;

    const currentPage = JSON.parse(JSON.stringify(get().currentPage));
    const targetZone = currentPage.zones.find(z => z.id === targetZoneId);

    if (!targetZone) return;

    // Ensure target row and column exist
    if (!targetZone.rows[targetRowIndex]) {
      targetZone.rows[targetRowIndex] = { columns: [] };
    }
    if (!targetZone.rows[targetRowIndex].columns[targetColumnIndex]) {
      targetZone.rows[targetRowIndex].columns[targetColumnIndex] = {
        width: 'full',
        elements: []
      };
    }

    const targetColumn = targetZone.rows[targetRowIndex].columns[targetColumnIndex];
    if (!targetColumn.elements) {
      targetColumn.elements = [];
    }

    // Collect elements to move
    const elementsToMove = [];
    selectedElements.forEach(path => {
      const element = get().getElementByPath(currentPage, path);
      if (element) {
        elementsToMove.push({ element, path });
      }
    });

    // Remove from source (in reverse order to avoid index issues)
    const sortedPaths = [...selectedElements].sort((a, b) => {
      if (a.zoneId !== b.zoneId) return 0;
      if (a.rowIndex !== b.rowIndex) return 0;
      if (a.columnIndex !== b.columnIndex) return 0;
      return b.elementIndex - a.elementIndex;
    });

    sortedPaths.forEach(path => {
      const { zoneId, rowIndex, columnIndex, elementIndex } = path;
      const zone = currentPage.zones.find(z => z.id === zoneId);
      if (zone?.rows[rowIndex]?.columns[columnIndex]?.elements) {
        zone.rows[rowIndex].columns[columnIndex].elements.splice(elementIndex, 1);
      }
    });

    // Add to target
    elementsToMove.forEach(({ element }) => {
      targetColumn.elements.push(element);
    });

    set({ currentPage, selectedElements: [] });
    get().addToHistory(currentPage);
  },

  // Clipboard operations
  clipboard: null,

  // Copy selected elements to clipboard
  copyToClipboard: () => {
    const { currentPage, selectedElements } = get();
    const elementsToCopy = selectedElements.map(path => ({
      element: get().getElementByPath(currentPage, path),
      path
    })).filter(item => item.element !== undefined);

    if (elementsToCopy.length > 0) {
      set({ clipboard: elementsToCopy.map(item => item.element) });
    }
  },

  // Paste from clipboard
  pasteFromClipboard: () => {
    const { clipboard, selectedElements, currentPage } = get();
    if (!clipboard || clipboard.length === 0) return;

    // Paste to the same location as first selected element, or to first column
    let targetPath = selectedElements.length > 0
      ? selectedElements[0]
      : {
          zoneId: currentPage.zones[0]?.id || 'main-content',
          rowIndex: 0,
          columnIndex: 0
        };

    const newPage = JSON.parse(JSON.stringify(currentPage));
    const zone = newPage.zones.find(z => z.id === targetPath.zoneId);

    if (!zone) return;

    // Ensure row exists
    if (!zone.rows[targetPath.rowIndex]) {
      zone.rows[targetPath.rowIndex] = { columns: [] };
    }

    // Ensure column exists
    if (!zone.rows[targetPath.rowIndex].columns[targetPath.columnIndex]) {
      zone.rows[targetPath.rowIndex].columns[targetPath.columnIndex] = {
        width: 'full',
        elements: []
      };
    }

    // Add clipboard elements
    const targetColumn = zone.rows[targetPath.rowIndex].columns[targetPath.columnIndex];
    clipboard.forEach(element => {
      targetColumn.elements.push(JSON.parse(JSON.stringify(element)));
    });

    set({ currentPage: newPage });
    get().addToHistory(newPage);
  },

  // Element movement within column
  moveElementUp: (path) => {
    const { currentPage } = get();
    const { zoneId, rowIndex, columnIndex, elementIndex } = path;

    const newPage = JSON.parse(JSON.stringify(currentPage));
    const zone = newPage.zones.find(z => z.id === zoneId);
    const elements = zone?.rows[rowIndex]?.columns[columnIndex]?.elements;

    if (!elements || elementIndex === 0) return;

    // Swap with previous element
    [elements[elementIndex - 1], elements[elementIndex]] = [elements[elementIndex], elements[elementIndex - 1]];

    set({ currentPage: newPage });
    get().addToHistory(newPage);

    // Update selection to follow the moved element
    get().selectElement({
      zoneId,
      rowIndex,
      columnIndex,
      elementIndex: elementIndex - 1
    });
  },

  moveElementDown: (path) => {
    const { currentPage } = get();
    const { zoneId, rowIndex, columnIndex, elementIndex } = path;

    const newPage = JSON.parse(JSON.stringify(currentPage));
    const zone = newPage.zones.find(z => z.id === zoneId);
    const elements = zone?.rows[rowIndex]?.columns[columnIndex]?.elements;

    if (!elements || elementIndex === elements.length - 1) return;

    // Swap with next element
    [elements[elementIndex], elements[elementIndex + 1]] = [elements[elementIndex + 1], elements[elementIndex]];

    set({ currentPage: newPage });
    get().addToHistory(newPage);

    // Update selection to follow the moved element
    get().selectElement({
      zoneId,
      rowIndex,
      columnIndex,
      elementIndex: elementIndex + 1
    });
  },

  canMoveUp: (path) => {
    return path.elementIndex > 0;
  },

  canMoveDown: (path) => {
    const { currentPage } = get();
    const { zoneId, rowIndex, columnIndex, elementIndex } = path;
    const zone = currentPage.zones.find(z => z.id === zoneId);
    const elements = zone?.rows[rowIndex]?.columns[columnIndex]?.elements;
    return elements && elementIndex < elements.length - 1;
  },

  // Parent navigation
  selectParent: (path) => {
    // In a flat structure, parent would be the column
    // For now, just clear selection
    get().clearSelection();
  },

  hasParent: (path) => {
    // Elements always have a parent (column), but for simplicity return false for now
    return false;
  },

  // Type converter
  openTypeConverter: (path) => {
    // TODO: Implement type converter modal
    console.log('Opening type converter for', path);
  },

  // JSON editor management
  openJsonEditor: () => {
    set({ jsonEditorOpen: true });
  },

  closeJsonEditor: () => {
    set({ jsonEditorOpen: false });
  },

  toggleJsonEditor: () => {
    set((state) => ({ jsonEditorOpen: !state.jsonEditorOpen }));
  },

  // Theme customizer management
  openThemeCustomizer: () => {
    set({ themeCustomizerOpen: true });
  },

  closeThemeCustomizer: () => {
    set({ themeCustomizerOpen: false });
  },

  toggleThemeCustomizer: () => {
    set((state) => ({ themeCustomizerOpen: !state.themeCustomizerOpen }));
  },

  // Locale manager management
  openLocaleManager: () => {
    set({ localeManagerOpen: true });
  },

  closeLocaleManager: () => {
    set({ localeManagerOpen: false });
  },

  toggleLocaleManager: () => {
    set((state) => ({ localeManagerOpen: !state.localeManagerOpen }));
  },

  // Alignment guides management

  // Set alignment guides
  setAlignmentGuides: (guides) => {
    set({ alignmentGuides: guides });
  },

  // Clear alignment guides
  clearAlignmentGuides: () => {
    set({ alignmentGuides: null });
  },

  // Toggle alignment guides visibility
  toggleAlignmentGuides: () => {
    set((state) => ({ showAlignmentGuides: !state.showAlignmentGuides }));
  },

  // Canvas zoom controls
  setCanvasZoom: (zoom) => {
    const clampedZoom = Math.min(Math.max(zoom, 0.25), 2);
    set({ canvasZoom: clampedZoom });
  },

  zoomIn: () => {
    const { canvasZoom } = get();
    const newZoom = Math.min(canvasZoom + 0.1, 2);
    set({ canvasZoom: newZoom });
  },

  zoomOut: () => {
    const { canvasZoom } = get();
    const newZoom = Math.max(canvasZoom - 0.1, 0.25);
    set({ canvasZoom: newZoom });
  },

  zoomToFit: () => {
    set({ canvasZoom: 0.75 });
  },

  zoomTo100: () => {
    set({ canvasZoom: 1 });
  },

  // Drag state management for auto-zoom
  startDrag: (element) => {
    const { canvasZoom } = get();
    set({
      isDragging: true,
      draggedElement: element,
      canvasZoomBeforeDrag: canvasZoom,
      canvasZoom: Math.min(canvasZoom, 0.75) // Auto-zoom out to 75% max during drag
    });
  },

  endDrag: () => {
    const { canvasZoomBeforeDrag } = get();
    set({
      isDragging: false,
      draggedElement: null,
      canvasZoom: canvasZoomBeforeDrag || 1,
      canvasZoomBeforeDrag: null
    });
  },

  // Clear last dropped element ID
  clearLastDroppedElementId: () => {
    set({ lastDroppedElementId: null });
  },

  // Set last dropped element ID manually (for palette drops)
  setLastDroppedElementId: (id) => {
    set({ lastDroppedElementId: id });
  }
}));
