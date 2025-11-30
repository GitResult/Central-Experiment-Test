import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ContentBlockEditor } from '../ContentBlockEditor/ContentBlockEditor';
import { SlideCanvas } from '../SlideCanvas/SlideCanvas';
import { ComponentPalette } from '../ComponentPalette/ComponentPalette';
import { PropertiesPanel } from '../PropertiesPanel/PropertiesPanel';
import { AutoSaveIndicator } from '../AutoSaveIndicator/AutoSaveIndicator';
import { PresenterMode } from '../PresenterMode/PresenterMode';
import { ShareModal } from '../ShareModal/ShareModal';
import { useDeckState } from '../../hooks/useDeckState';
import { useAutoSave } from '../../hooks/useAutoSave';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * DeckEditor Component
 *
 * Full three-panel deck editor with:
 * - Left Panel: Content editor with text blocks and data pills
 * - Right Panel: Visual canvas with drag-drop positioning
 * - Sidebar: Component palette and properties panel
 *
 * Features:
 * - Auto-save (2s debounce)
 * - Real-time preview
 * - Presenter mode
 * - Share modal
 *
 * Props:
 * - deckId: string - ID of deck to edit
 */
export function DeckEditor({ deckId }) {
  const { deckState, updateDeck, loading, error } = useDeckState(deckId);
  const { saveState, triggerSave, lastSaved } = useAutoSave(deckId, deckState);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState(null);
  const [isPresenterMode, setIsPresenterMode] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (deckId) {
      trackEvent(SLIDE_DECK_EVENTS.DECK_OPENED, { deckId });
    }
  }, [deckId]);

  useEffect(() => {
    // Trigger auto-save when deck state changes
    if (deckState) {
      triggerSave();
    }
  }, [deckState, triggerSave]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Loading deck...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <svg className="w-12 h-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-xl font-semibold mb-2">Failed to load deck</div>
        <div className="text-sm">{error.message}</div>
      </div>
    );
  }

  if (!deckState || !deckState.slides) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <div>No deck data available</div>
      </div>
    );
  }

  const currentSlide = deckState.slides[currentSlideIndex] || {
    id: 'slide_1',
    contentBlocks: [],
    layout: { elements: [] }
  };

  // Convert content blocks to layout elements for canvas
  const layoutElements = currentSlide.layout?.elements || [];
  const selectedElement = layoutElements.find(el => el.id === selectedElementId);

  const handleContentChange = (newBlocks) => {
    const updatedSlides = deckState.slides.map((slide, i) =>
      i === currentSlideIndex ? { ...slide, contentBlocks: newBlocks } : slide
    );
    updateDeck({ ...deckState, slides: updatedSlides });
    trackEvent(SLIDE_DECK_EVENTS.TEXT_EDITED, { slideIndex: currentSlideIndex });
  };

  const handleLayoutChange = (newElements) => {
    const updatedSlides = deckState.slides.map((slide, i) =>
      i === currentSlideIndex
        ? { ...slide, layout: { ...slide.layout, elements: newElements } }
        : slide
    );
    updateDeck({ ...deckState, slides: updatedSlides });
    trackEvent(SLIDE_DECK_EVENTS.LAYOUT_CHANGED, { slideIndex: currentSlideIndex });
  };

  const handleAddComponent = (type) => {
    // Add component to canvas
    const newElement = {
      id: `element_${Date.now()}`,
      type: type === 'text' ? 'text' : 'widget',
      x: 100,
      y: 100,
      width: type === 'text' ? 300 : 400,
      height: type === 'text' ? 100 : 300,
      content: type === 'text' ? 'New Text' : '',
      widgetType: type !== 'text' ? type : undefined
    };

    handleLayoutChange([...layoutElements, newElement]);
    setSelectedElementId(newElement.id);
  };

  const handleElementUpdate = (updates) => {
    const updatedElements = layoutElements.map(el =>
      el.id === selectedElementId ? { ...el, ...updates } : el
    );
    handleLayoutChange(updatedElements);
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: `slide_${Date.now()}`,
      contentBlocks: [],
      layout: { elements: [] }
    };
    const updatedSlides = [...deckState.slides, newSlide];
    updateDeck({ ...deckState, slides: updatedSlides });
    setCurrentSlideIndex(updatedSlides.length - 1);
    trackEvent(SLIDE_DECK_EVENTS.SLIDE_ADDED);
  };

  const handlePresent = () => {
    setIsPresenterMode(true);
    trackEvent(SLIDE_DECK_EVENTS.PRESENT_CLICKED, { deckId });
  };

  if (isPresenterMode) {
    return (
      <PresenterMode
        deckId={deckId}
        startSlide={currentSlideIndex}
        onExit={() => setIsPresenterMode(false)}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">
            {deckState.name || 'Untitled Deck'}
          </h1>
          <AutoSaveIndicator saveState={saveState} lastSaved={lastSaved} />
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowShareModal(true)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>Share</span>
            </div>
          </button>
          <button
            onClick={handlePresent}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Present</span>
            </div>
          </button>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Content Editor */}
        <div className="w-1/4 border-r border-gray-200 flex flex-col">
          <ContentBlockEditor
            blocks={currentSlide.contentBlocks}
            onChange={handleContentChange}
          />

          {/* Slide Navigation */}
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">
                Slide {currentSlideIndex + 1} of {deckState.slides.length}
              </span>
              <button
                onClick={handleAddSlide}
                className="px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded"
              >
                + Add Slide
              </button>
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
                disabled={currentSlideIndex === 0}
                className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50"
              >
                ← Prev
              </button>
              <button
                onClick={() => setCurrentSlideIndex(Math.min(deckState.slides.length - 1, currentSlideIndex + 1))}
                disabled={currentSlideIndex === deckState.slides.length - 1}
                className="flex-1 px-2 py-1 text-xs bg-white border border-gray-300 rounded disabled:opacity-50"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Visual Canvas */}
        <div className="flex-1 flex flex-col">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700">Visual Preview</h2>
            <p className="text-xs text-gray-500 mt-1">
              Drag and resize elements on the canvas
            </p>
          </div>
          <div className="flex-1 overflow-hidden">
            <SlideCanvas
              elements={layoutElements}
              onLayoutChange={handleLayoutChange}
              selectedElementId={selectedElementId}
              onSelectElement={setSelectedElementId}
            />
          </div>
        </div>

        {/* Sidebar: Components + Properties */}
        <div className="w-1/5 border-l border-gray-200 flex flex-col">
          <div className="flex-1 overflow-hidden">
            {selectedElement ? (
              <PropertiesPanel
                selectedElement={selectedElement}
                onUpdate={handleElementUpdate}
              />
            ) : (
              <ComponentPalette onAddComponent={handleAddComponent} />
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          deckId={deckId}
          currentPermissions={deckState.permissions || []}
          onClose={() => setShowShareModal(false)}
          onSave={(permissions) => {
            updateDeck({ ...deckState, permissions });
          }}
        />
      )}
    </div>
  );
}

DeckEditor.propTypes = {
  deckId: PropTypes.string.isRequired
};
