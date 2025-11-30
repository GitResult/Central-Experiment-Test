import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { AlignmentGuides } from './AlignmentGuides';
import { ResizeHandles } from './ResizeHandles';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * SlideCanvas Component
 *
 * Drag-drop canvas with resize + alignment guides for visual slide layout.
 * Allows users to position and resize elements (text, widgets) on the canvas.
 *
 * Props:
 * - elements: array - Layout elements with position/size
 * - onLayoutChange: function - Callback when layout changes
 * - selectedElementId: string - ID of currently selected element
 * - onSelectElement: function - Callback when element is selected
 */
export function SlideCanvas({ elements, onLayoutChange, selectedElementId, onSelectElement }) {
  const [dragging, setDragging] = useState(null);
  const [resizing, setResizing] = useState(null);
  const [alignmentLines, setAlignmentLines] = useState([]);
  const canvasRef = useRef(null);

  const GRID_SIZE = 8; // 8px grid for snapping
  const SNAP_THRESHOLD = 4; // pixels

  const snapToGrid = (value) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  };

  const findAlignmentLines = (element, allElements) => {
    const lines = [];
    const threshold = SNAP_THRESHOLD;

    allElements.forEach((other) => {
      if (other.id === element.id) return;

      // Check horizontal alignment (top, center, bottom)
      if (Math.abs(element.y - other.y) < threshold) {
        lines.push({ type: 'horizontal', position: other.y });
      }
      if (Math.abs((element.y + element.height / 2) - (other.y + other.height / 2)) < threshold) {
        lines.push({ type: 'horizontal', position: other.y + other.height / 2 });
      }
      if (Math.abs((element.y + element.height) - (other.y + other.height)) < threshold) {
        lines.push({ type: 'horizontal', position: other.y + other.height });
      }

      // Check vertical alignment (left, center, right)
      if (Math.abs(element.x - other.x) < threshold) {
        lines.push({ type: 'vertical', position: other.x });
      }
      if (Math.abs((element.x + element.width / 2) - (other.x + other.width / 2)) < threshold) {
        lines.push({ type: 'vertical', position: other.x + other.width / 2 });
      }
      if (Math.abs((element.x + element.width) - (other.x + other.width)) < threshold) {
        lines.push({ type: 'vertical', position: other.x + other.width });
      }
    });

    return lines;
  };

  const handleMouseDown = (e, element) => {
    if (e.button !== 0) return; // Only left click

    e.stopPropagation();
    onSelectElement(element.id);

    const canvas = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - canvas.left;
    const startY = e.clientY - canvas.top;

    setDragging({
      elementId: element.id,
      startX,
      startY,
      elementStartX: element.x,
      elementStartY: element.y
    });

    trackEvent(SLIDE_DECK_EVENTS.ELEMENT_DRAG_STARTED, { elementId: element.id });
  };

  const handleMouseMove = (e) => {
    if (!dragging && !resizing) return;

    const canvas = canvasRef.current.getBoundingClientRect();
    const currentX = e.clientX - canvas.left;
    const currentY = e.clientY - canvas.top;

    if (dragging) {
      const deltaX = currentX - dragging.startX;
      const deltaY = currentY - dragging.startY;

      let newX = snapToGrid(dragging.elementStartX + deltaX);
      let newY = snapToGrid(dragging.elementStartY + deltaY);

      // Constrain to canvas bounds
      newX = Math.max(0, Math.min(newX, canvas.width - 100));
      newY = Math.max(0, Math.min(newY, canvas.height - 50));

      const updatedElement = elements.find((el) => el.id === dragging.elementId);
      const tempElement = { ...updatedElement, x: newX, y: newY };
      const lines = findAlignmentLines(tempElement, elements);
      setAlignmentLines(lines);

      const updatedElements = elements.map((el) =>
        el.id === dragging.elementId ? { ...el, x: newX, y: newY } : el
      );
      onLayoutChange(updatedElements);
    } else if (resizing) {
      const deltaX = currentX - resizing.startX;
      const deltaY = currentY - resizing.startY;

      let newWidth = Math.max(50, snapToGrid(resizing.elementStartWidth + deltaX));
      let newHeight = Math.max(50, snapToGrid(resizing.elementStartHeight + deltaY));

      // Maintain aspect ratio if Shift is held
      if (resizing.maintainAspectRatio) {
        const aspectRatio = resizing.elementStartWidth / resizing.elementStartHeight;
        newHeight = newWidth / aspectRatio;
      }

      const updatedElements = elements.map((el) =>
        el.id === resizing.elementId
          ? { ...el, width: newWidth, height: newHeight }
          : el
      );
      onLayoutChange(updatedElements);
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      trackEvent(SLIDE_DECK_EVENTS.ELEMENT_DRAGGED, { elementId: dragging.elementId });
      setDragging(null);
      setAlignmentLines([]);
    }
    if (resizing) {
      trackEvent(SLIDE_DECK_EVENTS.ELEMENT_RESIZED, { elementId: resizing.elementId });
      setResizing(null);
    }
  };

  const handleResizeStart = (e, element, maintainAspectRatio = false) => {
    e.stopPropagation();

    const canvas = canvasRef.current.getBoundingClientRect();
    const startX = e.clientX - canvas.left;
    const startY = e.clientY - canvas.top;

    setResizing({
      elementId: element.id,
      startX,
      startY,
      elementStartWidth: element.width,
      elementStartHeight: element.height,
      maintainAspectRatio
    });

    trackEvent(SLIDE_DECK_EVENTS.ELEMENT_RESIZE_STARTED, { elementId: element.id });
  };

  const handleCanvasClick = () => {
    onSelectElement(null);
  };

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-auto">
      <div
        ref={canvasRef}
        className="relative mx-auto bg-white shadow-lg"
        style={{ width: '1024px', height: '768px' }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`
          }}
        />

        {/* Alignment Guides */}
        <AlignmentGuides lines={alignmentLines} />

        {/* Elements */}
        {elements.map((element) => (
          <div
            key={element.id}
            className={`absolute cursor-move border-2 ${
              selectedElementId === element.id
                ? 'border-blue-600 shadow-lg'
                : 'border-transparent hover:border-blue-300'
            }`}
            style={{
              left: element.x,
              top: element.y,
              width: element.width,
              height: element.height
            }}
            onMouseDown={(e) => handleMouseDown(e, element)}
          >
            {/* Element Content */}
            <div className="w-full h-full flex items-center justify-center bg-white p-2">
              {element.type === 'text' ? (
                <div className="text-sm text-gray-900">{element.content || 'Text Element'}</div>
              ) : (
                <div className="text-center">
                  <div className="text-2xl mb-1">
                    {element.widgetType === 'chart' ? '📊' :
                     element.widgetType === 'table' ? '📋' : '🔢'}
                  </div>
                  <div className="text-xs text-gray-600">{element.widgetType}</div>
                </div>
              )}
            </div>

            {/* Resize Handles */}
            {selectedElementId === element.id && (
              <ResizeHandles
                onResizeStart={(e, maintainAspectRatio) => handleResizeStart(e, element, maintainAspectRatio)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

SlideCanvas.propTypes = {
  elements: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'widget']).isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      height: PropTypes.number.isRequired,
      content: PropTypes.string,
      widgetType: PropTypes.oneOf(['chart', 'table', 'metric'])
    })
  ).isRequired,
  onLayoutChange: PropTypes.func.isRequired,
  selectedElementId: PropTypes.string,
  onSelectElement: PropTypes.func.isRequired
};
