/**
 * CanvasViewport Component
 * Figma-like canvas viewport for page editing with zoom/pan support
 *
 * Architecture:
 * - Viewport - fixed size container that clips content
 * - Stage - transformed layer that moves/scales based on zoom/pan
 * - Frame - the actual page content rendered at 100% scale
 *
 * This solves the zoom/scroll issues by:
 * 1. Keeping page content at 100% scale (no transform on content)
 * 2. Applying zoom/pan to the stage (camera movement, not content scaling)
 * 3. Managing scroll via pan, not browser scroll
 * 4. Drop zones work naturally without compensation
 */

import { useRef, useState, useCallback, useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { theme } from '../../config/theme';
import { Home, Hand, MousePointer2, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';
import PropTypes from 'prop-types';

export function CanvasViewport({ children, frameWidth = 1400 }) {
  const viewportRef = useRef(null);
  const frameRef = useRef(null);

  // Canvas state from store
  const canvasZoom = useEditorStore((state) => state.canvasZoom);
  const setCanvasZoom = useEditorStore((state) => state.setCanvasZoom);
  const isDragging = useEditorStore((state) => state.isDragging);
  const mode = useEditorStore((state) => state.mode);
  const canvasPanLimit = useEditorStore((state) => state.canvasPanLimit);
  const canvasInteractionMode = useEditorStore((state) => state.canvasInteractionMode);
  const setCanvasInteractionMode = useEditorStore((state) => state.setCanvasInteractionMode);
  const isEditMode = mode === 'edit';

  // Local pan state (offset in pixels)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);
  const [frameHeight, setFrameHeight] = useState(800);
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 });

  // Determine if panning is active (hand mode or space pressed)
  const isPanMode = canvasInteractionMode === 'pan' || spacePressed;

  // Measure frame height for proper centering
  useEffect(() => {
    if (!frameRef.current) return;

    const updateHeight = () => {
      if (frameRef.current) {
        setFrameHeight(frameRef.current.scrollHeight);
      }
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(frameRef.current);

    return () => resizeObserver.disconnect();
  }, [children]);

  // Measure viewport size for pan limits
  useEffect(() => {
    if (!viewportRef.current) return;

    const updateViewportSize = () => {
      if (viewportRef.current) {
        const rect = viewportRef.current.getBoundingClientRect();
        setViewportSize({ width: rect.width, height: rect.height });
      }
    };

    updateViewportSize();

    const resizeObserver = new ResizeObserver(updateViewportSize);
    resizeObserver.observe(viewportRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  // Clamp pan to keep minimum frame visibility
  // canvasPanLimit = 0.3 means 30% of frame must stay visible
  const clampPan = useCallback((newPan) => {
    if (!viewportSize.width || !viewportSize.height) return newPan;

    const scaledFrameWidth = frameWidth * canvasZoom;
    const scaledFrameHeight = frameHeight * canvasZoom;

    // Calculate max pan distance: viewport edge to (frame edge - minVisible portion)
    // When pan = maxPan, the frame's visible portion equals canvasPanLimit
    const maxPanX = (viewportSize.width / 2) + (scaledFrameWidth / 2) - (scaledFrameWidth * canvasPanLimit);
    const maxPanY = (viewportSize.height / 2) + (scaledFrameHeight / 2) - (scaledFrameHeight * canvasPanLimit);

    return {
      x: Math.max(-maxPanX, Math.min(maxPanX, newPan.x)),
      y: Math.max(-maxPanY, Math.min(maxPanY, newPan.y))
    };
  }, [viewportSize, frameWidth, frameHeight, canvasZoom, canvasPanLimit]);

  // Recenter the canvas (reset pan to origin)
  const recenter = useCallback(() => {
    setPan({ x: 0, y: 0 });
  }, []);

  // Fit frame to viewport
  const fitToView = useCallback(() => {
    if (!viewportSize.width || !viewportSize.height) return;

    const padding = 48; // Padding around frame
    const scaleX = (viewportSize.width - padding * 2) / frameWidth;
    const scaleY = (viewportSize.height - padding * 2) / frameHeight;
    const newZoom = Math.min(scaleX, scaleY, 1); // Don't zoom past 100%

    setCanvasZoom(newZoom);
    setPan({ x: 0, y: 0 });
  }, [viewportSize, frameWidth, frameHeight, setCanvasZoom]);

  // Zoom in/out functions
  const zoomIn = useCallback(() => {
    const newZoom = Math.min(canvasZoom + 0.1, 3);
    setCanvasZoom(newZoom);
  }, [canvasZoom, setCanvasZoom]);

  const zoomOut = useCallback(() => {
    const newZoom = Math.max(canvasZoom - 0.1, 0.1);
    setCanvasZoom(newZoom);
  }, [canvasZoom, setCanvasZoom]);

  // Handle mouse wheel - zoom with Ctrl, pan otherwise
  const handleWheel = useCallback((e) => {
    if (!viewportRef.current) return;

    // Zoom with Ctrl/Cmd + scroll
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();

      const rect = viewportRef.current.getBoundingClientRect();
      const delta = -e.deltaY * 0.002;
      const newZoom = Math.min(Math.max(canvasZoom + delta * canvasZoom, 0.1), 3);

      // Zoom towards mouse position
      const mouseX = e.clientX - rect.left - rect.width / 2;
      const mouseY = e.clientY - rect.top - rect.height / 2;

      const zoomRatio = newZoom / canvasZoom;
      const newPanX = pan.x * zoomRatio - mouseX * (zoomRatio - 1);
      const newPanY = pan.y * zoomRatio - mouseY * (zoomRatio - 1);

      setPan(clampPan({ x: newPanX, y: newPanY }));
      setCanvasZoom(newZoom);
    } else {
      // Pan with scroll
      e.preventDefault();
      setPan(prev => clampPan({
        x: prev.x - (e.shiftKey ? e.deltaY : e.deltaX),
        y: prev.y - (e.shiftKey ? e.deltaX : e.deltaY)
      }));
    }
  }, [canvasZoom, pan, setCanvasZoom, clampPan]);

  // Handle pan with middle mouse, space+drag, or hand tool
  const handleMouseDown = useCallback((e) => {
    if (e.button === 1 || (e.button === 0 && isPanMode)) {
      e.preventDefault();
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  }, [pan, isPanMode]);

  const handleMouseMove = useCallback((e) => {
    if (!isPanning) return;
    setPan(clampPan({
      x: e.clientX - panStart.x,
      y: e.clientY - panStart.y
    }));
  }, [isPanning, panStart, clampPan]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Space key for pan mode, Home/0 for recenter
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore when typing in inputs
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        setSpacePressed(true);
      }

      // Recenter with Home or 0 key
      if (e.code === 'Home' || e.key === '0') {
        e.preventDefault();
        recenter();
      }

      // V for select mode, H for hand/pan mode
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        setCanvasInteractionMode('select');
      }
      if (e.key === 'h' || e.key === 'H') {
        e.preventDefault();
        setCanvasInteractionMode('pan');
      }
    };

    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        setIsPanning(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseUp, recenter]);

  // Reset pan when zoom changes to 100%
  useEffect(() => {
    if (canvasZoom === 1) {
      setPan({ x: 0, y: 0 });
    }
  }, [canvasZoom]);

  // Calculate stage position - frame is centered in viewport
  const stageStyle = {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: `translate(${pan.x}px, ${pan.y}px) translate(-50%, -50%) scale(${canvasZoom})`,
    transformOrigin: 'center center',
    transition: isPanning ? 'none' : 'transform 150ms ease-out',
    pointerEvents: isPanning ? 'none' : 'auto'
  };

  // Frame style - the actual page
  const frameStyle = {
    width: `${frameWidth}px`,
    minHeight: '100vh',
    backgroundColor: '#ffffff',
    boxShadow: isEditMode
      ? '0 4px 32px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(0, 0, 0, 0.05)'
      : 'none',
    borderRadius: isEditMode ? '8px' : '0',
    overflow: 'visible',
    position: 'relative'
  };

  return (
    <div
      ref={viewportRef}
      className="canvas-viewport"
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onContextMenu={(e) => isPanning && e.preventDefault()}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        backgroundColor: isEditMode ? '#f0f0f3' : '#ffffff',
        cursor: isPanning ? 'grabbing' : (isPanMode ? 'grab' : 'default'),
        // Subtle grid pattern in edit mode
        ...(isEditMode && {
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: `${24 * canvasZoom}px ${24 * canvasZoom}px`,
          backgroundPosition: `calc(50% + ${pan.x}px) calc(50% + ${pan.y}px)`
        })
      }}
    >
      {/* Stage - transformed container */}
      <div className="canvas-stage" style={stageStyle}>
        {/* Frame - the actual page content at 100% scale */}
        <div ref={frameRef} className="canvas-frame" style={frameStyle}>
          {/* Frame label in edit mode */}
          {isEditMode && (
            <div
              style={{
                position: 'absolute',
                top: '-32px',
                left: '0',
                fontSize: '12px',
                fontWeight: 600,
                color: '#6b7280',
                fontFamily: theme.typography.fontFamily.sans,
                userSelect: 'none',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '2px',
                backgroundColor: theme.colors.primary[500]
              }} />
              Page Frame · {frameWidth}×{frameHeight}px
            </div>
          )}

          {children}
        </div>
      </div>

      {/* Viewport controls overlay */}
      {isEditMode && (
        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '4px 8px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            fontSize: '12px',
            color: theme.colors.text.primary,
            fontFamily: theme.typography.fontFamily.sans,
            userSelect: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: theme.shadows.elevated,
            border: `1px solid ${theme.colors.border.default}`
          }}
        >
          {/* Interaction mode toggle */}
          <div style={{ display: 'flex', backgroundColor: theme.colors.background.secondary, borderRadius: '8px', padding: '2px' }}>
            <button
              onClick={() => setCanvasInteractionMode('select')}
              title="Select mode (V)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: canvasInteractionMode === 'select' ? '#fff' : 'transparent',
                color: canvasInteractionMode === 'select' ? theme.colors.primary[500] : theme.colors.text.secondary,
                cursor: 'pointer',
                boxShadow: canvasInteractionMode === 'select' ? theme.shadows.sm : 'none',
                transition: 'all 150ms'
              }}
            >
              <MousePointer2 size={14} />
            </button>
            <button
              onClick={() => setCanvasInteractionMode('pan')}
              title="Pan mode (H)"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '28px',
                height: '28px',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: canvasInteractionMode === 'pan' ? '#fff' : 'transparent',
                color: canvasInteractionMode === 'pan' ? theme.colors.primary[500] : theme.colors.text.secondary,
                cursor: 'pointer',
                boxShadow: canvasInteractionMode === 'pan' ? theme.shadows.sm : 'none',
                transition: 'all 150ms'
              }}
            >
              <Hand size={14} />
            </button>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', backgroundColor: theme.colors.border.default, margin: '0 4px' }} />

          {/* Zoom controls */}
          <button
            onClick={zoomOut}
            title="Zoom out"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: theme.colors.text.secondary,
              cursor: 'pointer',
              transition: 'all 150ms'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.colors.background.secondary; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <ZoomOut size={14} />
          </button>

          <span style={{ minWidth: '40px', textAlign: 'center', fontSize: '11px', fontWeight: 500 }}>
            {Math.round(canvasZoom * 100)}%
          </span>

          <button
            onClick={zoomIn}
            title="Zoom in"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: theme.colors.text.secondary,
              cursor: 'pointer',
              transition: 'all 150ms'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.colors.background.secondary; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <ZoomIn size={14} />
          </button>

          {/* Divider */}
          <div style={{ width: '1px', height: '20px', backgroundColor: theme.colors.border.default, margin: '0 4px' }} />

          {/* Fit to view */}
          <button
            onClick={fitToView}
            title="Fit to view"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: theme.colors.text.secondary,
              cursor: 'pointer',
              transition: 'all 150ms'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.colors.background.secondary; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Maximize2 size={14} />
          </button>

          {/* Recenter */}
          <button
            onClick={recenter}
            title="Recenter (Home or 0)"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: theme.colors.text.secondary,
              cursor: 'pointer',
              transition: 'all 150ms'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = theme.colors.background.secondary; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Home size={14} />
          </button>
        </div>
      )}

      {/* Drag mode indicator */}
      {isDragging && isEditMode && (
        <div
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '10px 20px',
            backgroundColor: theme.colors.primary[500],
            borderRadius: '24px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#fff',
            fontFamily: theme.typography.fontFamily.sans,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          Drop element on the page
        </div>
      )}
    </div>
  );
}

CanvasViewport.propTypes = {
  children: PropTypes.node,
  frameWidth: PropTypes.number
};

export default CanvasViewport;
