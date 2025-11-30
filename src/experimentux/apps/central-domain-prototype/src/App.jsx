/**
 * Main App Component
 * Root application with routing and chrome
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, pointerWithin } from '@dnd-kit/core';
import { PanelRight } from 'lucide-react';
import { DragOverlayContent, PaletteDragPreview } from './components/editor/DragOverlayContent';
import { Minimap } from './components/editor/Minimap';
import { CanvasViewport } from './components/editor/CanvasViewport';
import { useNavigationStore } from './store/navigationStore';
import { useEditorStore } from './store/editorStore';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { ThemeProvider } from './components/theme/ThemeProvider';
import { DataProvidersProvider } from './contexts/DataProvidersContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { GlobalBar } from './components/chrome/GlobalBar';
import { WorkspaceNavigator } from './components/chrome/WorkspaceNavigator';
import { RightSidebar } from './components/editor/RightSidebar';
import { theme } from './config/theme';
import { SelectionToolbar } from './components/editor/SelectionToolbar';
import { SlashPalette } from './components/editor/SlashPalette';
import { ContextMenu } from './components/editor/ContextMenu';
import { JsonEditor } from './components/editor/JsonEditor';
import { ThemeCustomizer } from './components/editor/ThemeCustomizer';
import { LocaleManager } from './components/editor/LocaleManager';
import { Home } from './components/pages/Home';
import { ContactsList } from './components/pages/ContactsList';
import { ContactDetail } from './components/pages/ContactDetail';
import { TasksList } from './components/pages/TasksList';
import { TaskDetail } from './components/pages/TaskDetail';
import { Showcase } from './components/pages/Showcase';
import { ShowcaseDetail } from './components/pages/ShowcaseDetail';
import { PageEditor } from './components/pages/PageEditor';
import { CollectionFacetsPage } from './components/pages/CollectionFacetsPage';
import { CalendarPage } from './components/pages/CalendarPage';
import { EventProfilePage } from './components/pages/EventProfilePage';

// Studio Pages
import { StudioHome } from './components/pages/studio/StudioHome';
import { BlueprintWizard } from './components/blueprint/BlueprintWizard';
import { DepthCanvas } from './components/depth/DepthCanvas';
import { PresenterMode } from './components/presenter/PresenterMode';

// Help5 Pages
import { Help5List } from './components/pages/help5/Help5List';

// Discussions Pages
import { DiscussionsList } from './components/pages/discussions/DiscussionsList';
import { DiscussionPanel } from './components/discussions/DiscussionPanel';

// Studio Dock
import { StudioDock } from './components/studio/StudioDock';
import { TimelinePanel } from './components/studio/TimelinePanel';
import { StudioOptionsBar } from './components/studio/StudioOptionsBar';
import { PagesPanel } from './components/studio/PagesPanel';
import { PageCanvas } from './components/studio/PageCanvas';

// Snapshots
import { CaptureOverlay } from './features/snapshots/components/CaptureOverlay/CaptureOverlay';
import { PreCaptureMarkup } from './features/snapshots/components/PreCaptureMarkup/PreCaptureMarkup';
import { SnapshotGallery } from './features/snapshots/components/SnapshotGallery/SnapshotGallery';
import { SnapshotViewer } from './features/snapshots/components/SnapshotViewer/SnapshotViewer';
import { SnapshotDiscussionPanel } from './features/snapshots/components/DiscussionPanel/SnapshotDiscussionPanel';
import { SnapshotToolbar } from './features/snapshots/components/SnapshotToolbar/SnapshotToolbar';
import { Toast } from './features/snapshots/components/Toast';
import { useCapture } from './features/snapshots/hooks/useCapture';
import { useGlobalHotkey } from './features/snapshots/hooks/useGlobalHotkey';
import { useStudioDockStore } from './store/studioDockStore';
import { useSnapshotStore } from './store/snapshotStore';

// Wrapper to detect event pages and apply transparent GlobalBar
function GlobalBarWrapper({ onMenuClick, isEditMode, sidebarOpen }) {
  const location = useLocation();
  const isEventPage = location.pathname.startsWith('/events/');
  return <GlobalBar onMenuClick={onMenuClick} isEditMode={isEditMode} sidebarOpen={sidebarOpen} transparent={isEventPage} />;
}

function App() {
  const { isNavigatorOpen, toggleNavigator, closeNavigator } = useNavigationStore();
  const sidebarOpen = useEditorStore((state) => state.sidebarOpen);
  const snapshotsPanel = useStudioDockStore((state) => state.panels.snapshots);
  const timelinePanel = useStudioDockStore((state) => state.panels.timeline);
  const studioOptionsBarPanel = useStudioDockStore((state) => state.panels.studioOptionsBar);
  const pagesPanel = useStudioDockStore((state) => state.panels.pages);
  const closePanel = useStudioDockStore((state) => state.closePanel);
  const toggleSidebar = useEditorStore((state) => state.toggleSidebar);
  const jsonEditorOpen = useEditorStore((state) => state.jsonEditorOpen);
  const closeJsonEditor = useEditorStore((state) => state.closeJsonEditor);
  const themeCustomizerOpen = useEditorStore((state) => state.themeCustomizerOpen);
  const closeThemeCustomizer = useEditorStore((state) => state.closeThemeCustomizer);
  const localeManagerOpen = useEditorStore((state) => state.localeManagerOpen);
  const closeLocaleManager = useEditorStore((state) => state.closeLocaleManager);
  const mode = useEditorStore((state) => state.mode);
  const addElement = useEditorStore((state) => state.addElement);
  const moveElement = useEditorStore((state) => state.moveElement);
  const canvasZoom = useEditorStore((state) => state.canvasZoom);
  const startDrag = useEditorStore((state) => state.startDrag);
  const endDrag = useEditorStore((state) => state.endDrag);
  const lastDroppedElementId = useEditorStore((state) => state.lastDroppedElementId);
  const clearLastDroppedElementId = useEditorStore((state) => state.clearLastDroppedElementId);

  // Ref for edge scrolling
  const mainContentRef = useRef(null);
  const edgeScrollIntervalRef = useRef(null);

  // Scroll to dropped element after drop completes
  useEffect(() => {
    if (lastDroppedElementId) {
      // Small delay to allow DOM to update after state change
      const timeoutId = setTimeout(() => {
        const droppedElement = document.querySelector(`[data-element-id="${lastDroppedElementId}"]`);
        if (droppedElement) {
          droppedElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'nearest'
          });
        }
        clearLastDroppedElementId();
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [lastDroppedElementId, clearLastDroppedElementId]);

  // Enable keyboard shortcuts
  useKeyboardShortcuts();

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === '=' || e.key === '+')) {
        e.preventDefault();
        useEditorStore.getState().zoomIn();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault();
        useEditorStore.getState().zoomOut();
      } else if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault();
        useEditorStore.getState().zoomTo100();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Edge auto-scroll during drag
  const handleEdgeScroll = useCallback((e) => {
    if (!mainContentRef.current) return;

    const scrollContainer = document.documentElement;
    const edgeThreshold = 80; // pixels from edge to start scrolling
    const maxScrollSpeed = 15; // max pixels per frame

    const mouseY = e.clientY;
    const windowHeight = window.innerHeight;

    // Clear existing interval
    if (edgeScrollIntervalRef.current) {
      cancelAnimationFrame(edgeScrollIntervalRef.current);
      edgeScrollIntervalRef.current = null;
    }

    // Check if near top or bottom edge
    let scrollDirection = 0;
    let scrollSpeed = 0;

    if (mouseY < edgeThreshold) {
      // Near top - scroll up
      scrollDirection = -1;
      scrollSpeed = ((edgeThreshold - mouseY) / edgeThreshold) * maxScrollSpeed;
    } else if (mouseY > windowHeight - edgeThreshold) {
      // Near bottom - scroll down
      scrollDirection = 1;
      scrollSpeed = ((mouseY - (windowHeight - edgeThreshold)) / edgeThreshold) * maxScrollSpeed;
    }

    if (scrollDirection !== 0) {
      const scroll = () => {
        scrollContainer.scrollTop += scrollDirection * scrollSpeed;
        edgeScrollIntervalRef.current = requestAnimationFrame(scroll);
      };
      edgeScrollIntervalRef.current = requestAnimationFrame(scroll);
    }
  }, []);

  // Snapshots
  const {
    isCapturing,
    isUploading,
    startCapture,
    cancelCapture,
    completeCapture,
  } = useCapture();

  const captureMode = useSnapshotStore((state) => state.captureMode);
  const preMarkupAnnotations = useSnapshotStore((state) => state.preMarkupAnnotations);
  const setPreMarkupAnnotations = useSnapshotStore((state) => state.setPreMarkupAnnotations);

  const [toastMessage, setToastMessage] = useState(null);

  // Register global snapshot hotkey (Cmd/Ctrl+Shift+S)
  useGlobalHotkey('cmd+shift+s', () => startCapture('region'), { enabled: !isCapturing });

  // Handle pre-capture markup completion (transitions to region selection)
  const handlePreCaptureComplete = async (annotations) => {
    setPreMarkupAnnotations(annotations);
    // Switch from pre-markup mode to region selection mode
    startCapture('region');
  };

  // Handle snapshot capture completion
  const handleCaptureComplete = async (region) => {
    try {
      await completeCapture(region, {}, preMarkupAnnotations);
      setToastMessage({ message: 'Snapshot created successfully!', type: 'success' });
      setPreMarkupAnnotations(null); // Clear annotations after successful capture
      cancelCapture(); // Close the capture overlay
    } catch (error) {
      setToastMessage({ message: `Snapshot failed: ${error.message}`, type: 'error' });
      setPreMarkupAnnotations(null);
      cancelCapture(); // Close the capture overlay even on error
    }
  };

  // Determine if we're in edit mode
  const isEditMode = mode === 'edit';

  // Track active drag
  const [activeDragId, setActiveDragId] = useState(null);
  const [activeDragData, setActiveDragData] = useState(null);

  // Configure drag sensors with activation constraints
  // This requires a small movement before drag starts to prevent accidental drags
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required to start drag
      },
    })
  );

  // Drag start handler with auto-zoom
  const handleDragStart = (event) => {
    const activeData = event.active.data.current;
    setActiveDragId(event.active.id);
    setActiveDragData(activeData);

    // Start drag state (triggers auto-zoom)
    if (activeData?.element) {
      startDrag(activeData.element);
    } else if (activeData?.type === 'palette-element') {
      startDrag({ type: activeData.elementType, subtype: activeData.elementSubtype });
    }

    // Add edge scroll listener
    window.addEventListener('mousemove', handleEdgeScroll);
  };

  // Drag move handler for edge scrolling
  const handleDragMove = (event) => {
    // Edge scrolling is handled by the mousemove listener
  };

  // Global drag handler for palette elements being dropped on pages
  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Clean up drag state
    setActiveDragId(null);
    setActiveDragData(null);
    endDrag(); // Restore zoom level

    // Remove edge scroll listener
    window.removeEventListener('mousemove', handleEdgeScroll);
    if (edgeScrollIntervalRef.current) {
      cancelAnimationFrame(edgeScrollIntervalRef.current);
      edgeScrollIntervalRef.current = null;
    }

    if (!over) return;

    const activeData = active.data.current;
    const dropData = over.data.current;

    if (!dropData) return;

    // Check if dropping a palette element (adding new element)
    if (activeData?.type === 'palette-element') {
      const elementType = activeData.elementType;
      const elementSubtype = activeData.elementSubtype;

      if (dropData) {
        // Create new element based on type and subtype
        const newElement = {
          type: elementType,
          subtype: elementSubtype,
          data: activeData.defaultData || {},
          settings: activeData.defaultSettings || {}
        };

        // If it's a structure element, initialize elements array
        if (elementType === 'structure') {
          newElement.elements = activeData.elements || [];
        }

        // Add element to the appropriate page
        const pageKey = dropData.pageKey || 'home';
        const elementIndex = dropData.elementIndex ?? null;
        addElement(dropData.zoneId, dropData.rowIndex, dropData.columnIndex, newElement, pageKey, elementIndex);
      }
    }
    // Check if reordering an existing page element
    else if (activeData?.type === 'page-element') {
      if (dropData && activeData.path) {
        const fromPath = activeData.path;
        const toZoneId = dropData.zoneId;
        const toRowIndex = dropData.rowIndex;
        const toColumnIndex = dropData.columnIndex;
        const toElementIndex = dropData.elementIndex ?? 0;
        const pageKey = dropData.pageKey || activeData.pageKey || 'home';

        // Check if same position - skip if no actual move
        const samePosition =
          fromPath.zoneId === toZoneId &&
          fromPath.rowIndex === toRowIndex &&
          fromPath.columnIndex === toColumnIndex &&
          (toElementIndex === fromPath.elementIndex || toElementIndex === fromPath.elementIndex + 1);

        if (samePosition) return;

        // Use atomic move operation
        moveElement(fromPath, toZoneId, toRowIndex, toColumnIndex, toElementIndex, pageKey);
      }
    }
  };

  return (
    <ErrorBoundary errorMessage="The application encountered an unexpected error. Please refresh the page to continue.">
      <ThemeProvider>
        <DataProvidersProvider>
          <BrowserRouter>
            <div className="min-h-screen" style={{ backgroundColor: '#F8F9FC' }}>
              {/* Studio Options Bar - pushes content down when open */}
              <StudioOptionsBar
                isOpen={studioOptionsBarPanel}
                onClose={() => closePanel('studioOptionsBar')}
              />

              {/* Content wrapper - pushes down when Studio Options Bar is open */}
              <div
                style={{
                  paddingTop: studioOptionsBarPanel ? '40px' : '0',
                  transition: 'padding-top 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
              <WorkspaceNavigator
                isOpen={isNavigatorOpen}
                onClose={closeNavigator}
              />

              <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragMove={handleDragMove}
                onDragEnd={handleDragEnd}
              >
                {/* Global bar - fixed at top, outside canvas */}
                <GlobalBarWrapper onMenuClick={toggleNavigator} isEditMode={isEditMode} sidebarOpen={sidebarOpen} />

                <div className="flex" style={{ paddingTop: '56px' }}> {/* Account for GlobalBar height */}
                  {/* Main content */}
                  <main
                    ref={mainContentRef}
                    className="transition-all duration-300"
                    role="main"
                    aria-label="Main content"
                    style={{
                      width: (() => {
                        let width = '100%';
                        if (pagesPanel && sidebarOpen && isEditMode) {
                          width = 'calc(100% - 280px - 360px)';
                        } else if (pagesPanel) {
                          width = 'calc(100% - 280px)';
                        } else if (sidebarOpen && isEditMode) {
                          width = 'calc(100% - 360px)';
                        }
                        return width;
                      })(),
                      marginLeft: pagesPanel ? '280px' : '0',
                      marginRight: sidebarOpen && isEditMode ? '360px' : '0',
                      minHeight: 'calc(100vh - 56px)',
                      position: 'relative'
                    }}
                  >
                    <ErrorBoundary errorMessage="This page encountered an error. Please try navigating to a different page.">
                      <Routes>
                        {/* Regular pages - no canvas viewport */}
                        <Route path="/" element={<Home />} />
                        <Route path="/contacts" element={<ContactsList />} />
                        <Route path="/contacts/:id" element={<ContactDetail />} />
                        <Route path="/tasks" element={<TasksList />} />
                        <Route path="/tasks/new" element={<TaskDetail />} />
                        <Route path="/tasks/:id" element={<TaskDetail />} />
                        <Route path="/showcase" element={<Showcase />} />
                        <Route path="/showcase/:id" element={<ShowcaseDetail />} />
                        <Route path="/studio" element={<StudioHome />} />
                        <Route path="/studio/blueprint" element={<BlueprintWizard isOpen={true} onClose={() => window.history.back()} />} />
                        <Route path="/studio/depth" element={<DepthCanvas />} />
                        <Route path="/studio/presenter" element={<PresenterMode isOpen={true} onClose={() => window.history.back()} />} />
                        <Route path="/help5" element={<Help5List />} />
                        <Route path="/help5/new" element={<div className="p-6">Create New Help5 (Coming Soon)</div>} />
                        <Route path="/help5/:id" element={<div className="p-6">Help5 Detail (Coming Soon)</div>} />
                        <Route path="/help5/guides" element={<div className="p-6">Interactive Guides (Coming Soon)</div>} />
                        <Route path="/help5/guides/new" element={<div className="p-6">New Interactive Guide (Coming Soon)</div>} />
                        <Route path="/help5/coverage" element={<div className="p-6">Help5 Coverage Dashboard (Coming Soon)</div>} />
                        <Route path="/discussions" element={<DiscussionsList />} />
                        <Route path="/discussions/new" element={<div className="p-6">New Discussion (Coming Soon)</div>} />
                        <Route path="/discussions/:id" element={<div className="p-6">Discussion Detail (Coming Soon)</div>} />
                        <Route path="/snapshots" element={<SnapshotGallery />} />
                        <Route path="/snapshots/:id" element={<SnapshotViewer />} />
                        <Route path="/collections" element={<CollectionFacetsPage />} />
                        <Route path="/calendar" element={<CalendarPage />} />
                        <Route path="/events/:id/profile" element={<EventProfilePage />} />
                        <Route path="/pages" element={<div className="p-6">Pages (Coming Soon)</div>} />

                        {/* Editor pages - use CanvasViewport for Figma-like zoom/pan */}
                        <Route
                          path="/editor"
                          element={
                            <CanvasViewport frameWidth={1400}>
                              <PageEditor />
                            </CanvasViewport>
                          }
                        />
                        <Route
                          path="/canvas/new"
                          element={
                            <CanvasViewport frameWidth={1400}>
                              <PageEditor />
                            </CanvasViewport>
                          }
                        />
                        <Route
                          path="/page/new"
                          element={
                            <CanvasViewport frameWidth={1400}>
                              <PageEditor />
                            </CanvasViewport>
                          }
                        />
                        <Route
                          path="/pages/:slug/edit"
                          element={
                            <CanvasViewport frameWidth={1400}>
                              <PageCanvas />
                            </CanvasViewport>
                          }
                        />
                      </Routes>
                    </ErrorBoundary>
                </main>

                {/* Global Right Sidebar - available on all pages in edit mode */}
                {isEditMode && (
                  <aside role="complementary" aria-label="Editor sidebar">
                    <RightSidebar />
                  </aside>
                )}
              </div>

              {/* Fixed sidebar toggle button - stays in place when sidebar opens */}
              {isEditMode && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 hover:bg-gray-100 rounded transition-colors"
                  aria-label="Toggle editor sidebar"
                  style={{
                    position: 'fixed',
                    top: studioOptionsBarPanel ? '51px' : '11px', // Push down when Studio Options Bar is open
                    right: '16px',
                    color: sidebarOpen ? theme.colors.primary[500] : theme.colors.text.primary,
                    backgroundColor: sidebarOpen ? theme.colors.primary[50] : theme.colors.background,
                    zIndex: 60, // Above everything including sidebar
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'top 200ms cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <PanelRight size={20} />
                </button>
              )}


              {/* Enhanced Drag Overlay with element preview */}
              <DragOverlay dropAnimation={{
                duration: 200,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)'
              }}>
                {activeDragId && activeDragData ? (
                  activeDragData.type === 'page-element' ? (
                    <DragOverlayContent
                      element={activeDragData.element}
                      isDragging={true}
                    />
                  ) : activeDragData.type === 'palette-element' ? (
                    <PaletteDragPreview
                      elementType={activeDragData.elementType}
                      elementSubtype={activeDragData.elementSubtype}
                    />
                  ) : (
                    <div style={{
                      opacity: 0.9,
                      backgroundColor: '#fff',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: '2px solid #3b82f6',
                      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                    }}>
                      Moving element...
                    </div>
                  )
                ) : null}
              </DragOverlay>

              {/* Minimap during drag */}
              <Minimap containerRef={mainContentRef} />
            </DndContext>


            {/* Global Selection Toolbar - appears when elements are selected in edit mode */}
            {isEditMode && <SelectionToolbar />}

            {/* Global Slash Palette - appears when "/" is pressed */}
            <SlashPalette />

            {/* Global Context Menu - appears on right-click in edit mode */}
            {isEditMode && <ContextMenu />}

            {/* Global JSON Editor - modal for editing page as JSON */}
            <JsonEditor isOpen={jsonEditorOpen} onClose={closeJsonEditor} />

            {/* Global Theme Customizer - modal for customizing theme */}
            <ThemeCustomizer isOpen={themeCustomizerOpen} onClose={closeThemeCustomizer} />

            {/* Global Locale Manager - modal for managing translations */}
            <LocaleManager isOpen={localeManagerOpen} onClose={closeLocaleManager} />

            {/* Studio Dock - global floating action button for studio tools */}
            <StudioDock />

            {/* Pre-Capture Markup - annotate before capturing */}
            <PreCaptureMarkup
              isActive={isCapturing && captureMode === 'pre-markup'}
              onCapture={handlePreCaptureComplete}
              onCancel={cancelCapture}
            />

            {/* Snapshot Capture Overlay - full-screen capture mode */}
            <CaptureOverlay
              isActive={isCapturing && captureMode === 'region'}
              onCapture={handleCaptureComplete}
              onCancel={cancelCapture}
              preMarkupAnnotations={preMarkupAnnotations}
            />

            {/* Loading Overlay - shown during snapshot capture processing */}
            {isUploading && (
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 10002,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '32px 48px',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '16px',
                }}>
                  {/* Spinner */}
                  <div style={{
                    width: '48px',
                    height: '48px',
                    border: '4px solid #E5E7EB',
                    borderTop: '4px solid #0066FF',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                  }} />
                  <style>{`
                    @keyframes spin {
                      0% { transform: rotate(0deg); }
                      100% { transform: rotate(360deg); }
                    }
                  `}</style>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#1F2937',
                  }}>
                    Processing snapshot...
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#6B7280',
                  }}>
                    This may take a few seconds
                  </div>
                </div>
              </div>
            )}

            {/* Toast Notifications */}
            {toastMessage && (
              <Toast
                message={toastMessage.message}
                type={toastMessage.type}
                onClose={() => setToastMessage(null)}
              />
            )}

            {/* Snapshot Discussion Panel */}
            <SnapshotDiscussionPanel />

            {/* Snapshot Toolbar - Floating bar with options and filmstrip */}
            <SnapshotToolbar
              isOpen={snapshotsPanel}
              onClose={() => closePanel('snapshots')}
            />

            {/* Timeline Panel - Registrations by week with range filter */}
            <TimelinePanel
              isOpen={timelinePanel}
              onClose={() => closePanel('timeline')}
            />

            {/* Pages Panel - Left-docked panel for page navigation, layers, and lists */}
            <PagesPanel
              isOpen={pagesPanel}
              onClose={() => closePanel('pages')}
            />
            </div>{/* End content wrapper */}
          </div>
        </BrowserRouter>
      </DataProvidersProvider>
    </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
