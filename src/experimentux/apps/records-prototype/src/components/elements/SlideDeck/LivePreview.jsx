import React, { useState } from 'react';
import SlideRenderer from './SlideRenderer';
import { parseMarkdownToSlides } from './utils/markdownParser';

/**
 * LivePreview Component
 *
 * Displays live preview of slides with navigation.
 * Shows slides in a carousel-style view.
 */
const LivePreview = ({ markdown, theme, className = '' }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Parse markdown into slides
  const slides = parseMarkdownToSlides(markdown);
  const currentSlide = slides[currentSlideIndex] || null;

  const handlePrevious = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleSlideClick = (index) => {
    setCurrentSlideIndex(index);
  };

  return (
    <div className={`live-preview ${className}`} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Preview Area */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#F5F5F7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          overflow: 'auto'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '960px',
            aspectRatio: '16 / 9',
            backgroundColor: theme.colors.background,
            borderRadius: '8px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.12)',
            overflow: 'hidden'
          }}
        >
          {currentSlide ? (
            <SlideRenderer slide={currentSlide} theme={theme} isActive={true} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <p style={{ color: '#86868B' }}>No slides yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div
        style={{
          borderTop: '1px solid #D2D2D7',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* Slide Counter */}
        <div style={{ fontSize: '14px', color: '#86868B' }}>
          {slides.length > 0 ? `${currentSlideIndex + 1} / ${slides.length}` : '0 / 0'}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handlePrevious}
            disabled={currentSlideIndex === 0}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #D2D2D7',
              backgroundColor: currentSlideIndex === 0 ? '#F5F5F7' : '#FFFFFF',
              color: currentSlideIndex === 0 ? '#86868B' : '#1D1D1F',
              cursor: currentSlideIndex === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            ← Previous
          </button>
          <button
            onClick={handleNext}
            disabled={currentSlideIndex === slides.length - 1}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #D2D2D7',
              backgroundColor: currentSlideIndex === slides.length - 1 ? '#F5F5F7' : '#FFFFFF',
              color: currentSlideIndex === slides.length - 1 ? '#86868B' : '#1D1D1F',
              cursor: currentSlideIndex === slides.length - 1 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Slide Thumbnails */}
      <div
        style={{
          borderTop: '1px solid #D2D2D7',
          padding: '16px 24px',
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          backgroundColor: '#FAFAFA'
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            onClick={() => handleSlideClick(index)}
            style={{
              minWidth: '120px',
              height: '68px',
              backgroundColor: index === currentSlideIndex ? '#0071E3' : '#FFFFFF',
              border: index === currentSlideIndex ? '2px solid #0071E3' : '1px solid #D2D2D7',
              borderRadius: '4px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: index === currentSlideIndex ? '#FFFFFF' : '#86868B',
              padding: '8px',
              textAlign: 'center',
              overflow: 'hidden'
            }}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LivePreview;
