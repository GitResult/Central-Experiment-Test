/**
 * CaptureOverlay
 * Full-screen overlay for selecting region to capture
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import './CaptureOverlay.css';

export function CaptureOverlay({ isActive, onCapture, onCancel, preMarkupAnnotations }) {
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const annotationsCanvasRef = useRef(null);

  // Render pre-markup annotations if provided
  useEffect(() => {
    if (!preMarkupAnnotations?.annotationsDataUrl || !annotationsCanvasRef.current) return;

    const canvas = annotationsCanvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
    };
    img.src = preMarkupAnnotations.annotationsDataUrl;
  }, [preMarkupAnnotations]);

  // Keyboard escape handler
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, onCancel]);

  // Mouse event handlers
  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0) return; // Only left click
    const point = { x: e.clientX, y: e.clientY };
    setSelectionStart(point);
    setSelectionEnd(point);
    setIsDragging(true);
  }, []);

  const rafRef = useRef(null);
  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;

    // Use requestAnimationFrame to throttle updates and reduce jitter
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      setSelectionEnd({ x: e.clientX, y: e.clientY });
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(async (e) => {
    if (!isDragging || !selectionStart) return;

    setIsDragging(false);

    const end = { x: e.clientX, y: e.clientY };
    const region = {
      x: Math.min(selectionStart.x, end.x),
      y: Math.min(selectionStart.y, end.y),
      width: Math.abs(end.x - selectionStart.x),
      height: Math.abs(end.y - selectionStart.y),
    };

    // Minimum selection size (prevent accidental single-pixel captures)
    if (region.width < 10 || region.height < 10) {
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    // Show capturing state immediately (provides instant feedback)
    setIsCapturing(true);

    // Small delay to allow DOM to update
    await new Promise(resolve => setTimeout(resolve, 10));

    onCapture(region);

    // Note: Don't reset isCapturing here - parent will control visibility
    // Reset selection state
    setSelectionStart(null);
    setSelectionEnd(null);
  }, [isDragging, selectionStart, onCapture]);

  // Calculate selection rectangle
  const selectionRect = selectionStart && selectionEnd ? {
    left: Math.min(selectionStart.x, selectionEnd.x),
    top: Math.min(selectionStart.y, selectionEnd.y),
    width: Math.abs(selectionEnd.x - selectionStart.x),
    height: Math.abs(selectionEnd.y - selectionStart.y),
  } : null;

  if (!isActive) return null;

  return (
    <>
      {/* Pre-markup annotations canvas (behind overlay) */}
      {preMarkupAnnotations && (
        <canvas
          ref={annotationsCanvasRef}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Overlay */}
      <div
        className="capture-overlay"
        data-capture-overlay="true"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          cursor: isDragging ? 'crosshair' : 'default',
          pointerEvents: isCapturing ? 'none' : 'auto',
        }}
        role="dialog"
        aria-label="Snapshot capture mode"
      >
        {/* Dimmed background (hidden during capture) */}
        <div
          className="capture-overlay__background"
          data-capture-overlay="true"
          style={{
            opacity: isCapturing ? 0 : 1,
          }}
        />

        {/* Selection rectangle */}
        {selectionRect && (
          <div
            className="capture-overlay__selection"
            data-capture-overlay="true"
            style={{
              left: `${selectionRect.left}px`,
              top: `${selectionRect.top}px`,
              width: `${selectionRect.width}px`,
              height: `${selectionRect.height}px`,
            }}
          >
            {/* Dimensions tooltip */}
            <div className="capture-overlay__dimensions" data-capture-overlay="true">
              {Math.round(selectionRect.width)} × {Math.round(selectionRect.height)}px
            </div>
          </div>
        )}

        {/* Instructions */}
        {!isDragging && !selectionRect && !isCapturing && (
          <div className="capture-overlay__instructions" data-capture-overlay="true">
            Drag to select region • ESC to cancel
          </div>
        )}

        {/* Capturing feedback */}
        {isCapturing && (
          <>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
            <div
              data-capture-overlay="true"
              style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '24px 32px',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px',
                zIndex: 10001,
              }}
            >
              {/* Spinner */}
              <div style={{
                width: '32px',
                height: '32px',
                border: '3px solid #E5E7EB',
                borderTop: '3px solid #0066FF',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <div style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#1F2937',
              }}>
                Capturing screenshot...
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

CaptureOverlay.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onCapture: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  preMarkupAnnotations: PropTypes.shape({
    annotationsDataUrl: PropTypes.string,
    shapes: PropTypes.array,
  }),
};
