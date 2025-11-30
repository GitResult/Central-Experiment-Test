import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PresenterModeToolbar } from './PresenterModeToolbar';
import { WidgetRenderer } from '../WidgetRenderer/WidgetRenderer';
import { useDeckState } from '../../hooks/useDeckState';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * PresenterMode Component
 *
 * Full-screen slide viewer with keyboard navigation.
 * Supports arrows, page up/down, home/end keys.
 * Shows progress indicator and enables widget interactivity.
 *
 * Props:
 * - deckId: string - ID of the deck to present
 * - startSlide: number - Index of slide to start on (default: 0)
 * - onExit: function - Callback when exiting presenter mode
 */
export function PresenterMode({ deckId, startSlide = 0, onExit }) {
  const { deckState, loading } = useDeckState(deckId);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(startSlide);

  useEffect(() => {
    trackEvent(SLIDE_DECK_EVENTS.PRESENTER_MODE_STARTED, {
      deckId,
      startSlide
    });
  }, [deckId, startSlide]);

  const handleNavigate = useCallback((direction) => {
    if (!deckState?.slides) return;

    let newIndex = currentSlideIndex;

    switch (direction) {
      case 'next':
        newIndex = Math.min(currentSlideIndex + 1, deckState.slides.length - 1);
        break;
      case 'prev':
        newIndex = Math.max(currentSlideIndex - 1, 0);
        break;
      case 'first':
        newIndex = 0;
        break;
      case 'last':
        newIndex = deckState.slides.length - 1;
        break;
      default:
        if (typeof direction === 'number') {
          newIndex = Math.max(0, Math.min(direction, deckState.slides.length - 1));
        }
    }

    if (newIndex !== currentSlideIndex) {
      setCurrentSlideIndex(newIndex);
      trackEvent(SLIDE_DECK_EVENTS.SLIDE_NAVIGATED, {
        deckId,
        fromSlide: currentSlideIndex,
        toSlide: newIndex
      });
    }
  }, [deckState, currentSlideIndex, deckId]);

  const handleExit = useCallback(() => {
    trackEvent(SLIDE_DECK_EVENTS.PRESENTER_MODE_EXITED, {
      deckId,
      finalSlide: currentSlideIndex
    });
    onExit();
  }, [deckId, currentSlideIndex, onExit]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case ' ': // Spacebar
          e.preventDefault();
          handleNavigate('next');
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
          e.preventDefault();
          handleNavigate('prev');
          break;
        case 'Home':
          e.preventDefault();
          handleNavigate('first');
          break;
        case 'End':
          e.preventDefault();
          handleNavigate('last');
          break;
        case 'Escape':
          e.preventDefault();
          handleExit();
          break;
        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleNavigate, handleExit]);

  if (loading || !deckState) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading presentation...</div>
      </div>
    );
  }

  const currentSlide = deckState.slides[currentSlideIndex];

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Slide Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl bg-white rounded-lg shadow-2xl p-12">
          {/* Render slide content blocks */}
          {currentSlide?.contentBlocks?.map((block, index) => (
            <div key={block.id || index} className="mb-6">
              {block.type === 'text' ? (
                <p
                  className={`${
                    index === 0
                      ? 'text-4xl font-bold text-gray-900 mb-4'
                      : 'text-lg text-gray-700'
                  }`}
                >
                  {block.content}
                </p>
              ) : (
                <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ minHeight: '300px' }}>
                  <WidgetRenderer widget={block} isPresenterMode={true} />
                </div>
              )}
            </div>
          ))}

          {/* Empty slide message */}
          {(!currentSlide?.contentBlocks || currentSlide.contentBlocks.length === 0) && (
            <div className="text-center text-gray-400 py-20">
              <div className="text-6xl mb-4">📄</div>
              <p className="text-xl">Empty Slide</p>
            </div>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <PresenterModeToolbar
        currentSlide={currentSlideIndex + 1}
        totalSlides={deckState.slides.length}
        onNavigate={handleNavigate}
        onExit={handleExit}
      />
    </div>
  );
}

PresenterMode.propTypes = {
  deckId: PropTypes.string.isRequired,
  startSlide: PropTypes.number,
  onExit: PropTypes.func.isRequired
};
