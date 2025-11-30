import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * PresenterModeToolbar Component
 *
 * Bottom toolbar in presenter mode with navigation controls.
 * Shows current slide number and allows jumping to specific slides.
 *
 * Props:
 * - currentSlide: number - Current slide number (1-indexed)
 * - totalSlides: number - Total number of slides
 * - onNavigate: function - Callback for navigation (direction or slide number)
 * - onExit: function - Callback to exit presenter mode
 */
export function PresenterModeToolbar({ currentSlide, totalSlides, onNavigate, onExit }) {
  const [showJumpInput, setShowJumpInput] = useState(false);
  const [jumpValue, setJumpValue] = useState('');

  const handleJumpToSlide = () => {
    const slideNum = parseInt(jumpValue, 10);
    if (!isNaN(slideNum) && slideNum >= 1 && slideNum <= totalSlides) {
      onNavigate(slideNum - 1); // Convert to 0-indexed
      setShowJumpInput(false);
      setJumpValue('');
      trackEvent(SLIDE_DECK_EVENTS.JUMP_TO_SLIDE, { slideNum });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleJumpToSlide();
    } else if (e.key === 'Escape') {
      setShowJumpInput(false);
      setJumpValue('');
    }
  };

  return (
    <div className="bg-gray-900 bg-opacity-90 backdrop-blur-sm px-6 py-4">
      <div className="flex items-center justify-between max-w-6xl mx-auto">
        {/* Left: Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onNavigate('prev')}
            disabled={currentSlide === 1}
            className="px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => onNavigate('next')}
            disabled={currentSlide === totalSlides}
            className="px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Center: Slide Counter */}
        <div className="flex items-center space-x-3">
          {showJumpInput ? (
            <div className="flex items-center space-x-2">
              <input
                type="number"
                value={jumpValue}
                onChange={(e) => setJumpValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`1-${totalSlides}`}
                className="w-20 px-2 py-1 text-sm bg-gray-800 text-white border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max={totalSlides}
                autoFocus
              />
              <button
                onClick={handleJumpToSlide}
                className="px-3 py-1 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Go
              </button>
              <button
                onClick={() => {
                  setShowJumpInput(false);
                  setJumpValue('');
                }}
                className="px-3 py-1 text-sm text-white bg-gray-700 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowJumpInput(true)}
              className="flex items-center space-x-2 px-4 py-2 text-white bg-gray-700 rounded hover:bg-gray-600"
              title="Click to jump to slide"
            >
              <span className="text-lg font-semibold">{currentSlide}</span>
              <span className="text-gray-400">/</span>
              <span className="text-gray-400">{totalSlides}</span>
            </button>
          )}

          {/* Progress Bar */}
          <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
            />
          </div>
        </div>

        {/* Right: Exit Button */}
        <button
          onClick={onExit}
          className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
          aria-label="Exit presenter mode"
        >
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            <span>Exit</span>
          </div>
        </button>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="text-center mt-2">
        <div className="text-xs text-gray-400">
          Use <kbd className="px-1 py-0.5 bg-gray-800 rounded">←</kbd> <kbd className="px-1 py-0.5 bg-gray-800 rounded">→</kbd> arrows or <kbd className="px-1 py-0.5 bg-gray-800 rounded">Space</kbd> to navigate • <kbd className="px-1 py-0.5 bg-gray-800 rounded">Esc</kbd> to exit
        </div>
      </div>
    </div>
  );
}

PresenterModeToolbar.propTypes = {
  currentSlide: PropTypes.number.isRequired,
  totalSlides: PropTypes.number.isRequired,
  onNavigate: PropTypes.func.isRequired,
  onExit: PropTypes.func.isRequired
};
