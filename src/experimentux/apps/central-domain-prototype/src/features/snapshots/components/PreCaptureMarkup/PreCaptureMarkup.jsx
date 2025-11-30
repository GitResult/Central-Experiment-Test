import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { X, Circle, Square, ArrowRight, Minus, Type, Check } from 'lucide-react';
import './PreCaptureMarkup.css';

/**
 * PreCaptureMarkup - Allows users to annotate the screen before capturing
 *
 * Features:
 * - Full-screen canvas overlay
 * - Drawing tools (arrow, rectangle, circle, line, text)
 * - Color picker (8 colors)
 * - Semi-transparent overlay to see content underneath
 * - Capture with annotations included
 */
export function PreCaptureMarkup({ isActive, onCapture, onCancel }) {
  const [tool, setTool] = useState('arrow');
  const [color, setColor] = useState('#FF0000');
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [currentShape, setCurrentShape] = useState(null);

  // Toolbar dragging
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const overlayRef = useRef(null);
  const toolbarRef = useRef(null);

  // Clear canvas and shapes on mount/unmount
  useEffect(() => {
    if (!isActive) {
      setShapes([]);
      setCurrentShape(null);
    }
  }, [isActive]);

  // Render all shapes on canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw all completed shapes
    shapes.forEach(shape => drawShape(ctx, shape));

    // Draw current shape being drawn
    if (currentShape) {
      drawShape(ctx, currentShape);
    }
  }, [shapes, currentShape]);

  // Resize canvas to window size
  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive]);

  const drawShape = (ctx, shape) => {
    ctx.strokeStyle = shape.color;
    ctx.fillStyle = shape.color;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const { startX, startY, endX, endY } = shape;

    switch (shape.tool) {
      case 'arrow': {
        // Draw line
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Draw arrowhead
        const angle = Math.atan2(endY - startY, endX - startX);
        const headLength = 15;
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headLength * Math.cos(angle - Math.PI / 6),
          endY - headLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(endX, endY);
        ctx.lineTo(
          endX - headLength * Math.cos(angle + Math.PI / 6),
          endY - headLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        break;
      }

      case 'rectangle': {
        const width = endX - startX;
        const height = endY - startY;
        ctx.strokeRect(startX, startY, width, height);
        break;
      }

      case 'circle': {
        const radius = Math.sqrt(
          Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)
        );
        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      }

      case 'line': {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;
      }

      case 'text': {
        ctx.font = '24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(shape.text || 'Text', startX, startY);
        break;
      }
    }
  };

  const handleMouseDown = useCallback((e) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentShape({
      tool,
      color,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
    });
  }, [tool, color]);

  const handleMouseMove = useCallback((e) => {
    if (!isDrawing || !currentShape || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentShape(prev => ({
      ...prev,
      endX: x,
      endY: y,
    }));
  }, [isDrawing, currentShape]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !currentShape) return;

    // Add completed shape to shapes array
    setShapes(prev => [...prev, currentShape]);
    setCurrentShape(null);
    setIsDrawing(false);
  }, [isDrawing, currentShape]);

  const handleTextAdd = useCallback((e) => {
    if (tool !== 'text') return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const text = prompt('Enter text:');
    if (!text) return;

    setShapes(prev => [...prev, {
      tool: 'text',
      color,
      startX: x,
      startY: y,
      endX: x,
      endY: y,
      text,
    }]);
  }, [tool, color]);

  const handleCapture = useCallback(async () => {
    if (!canvasRef.current) return;

    // Export canvas as data URL
    const annotationsDataUrl = canvasRef.current.toDataURL('image/png');

    // Pass annotations to parent for merging with screenshot
    onCapture({
      annotationsDataUrl,
      shapes,
    });
  }, [shapes, onCapture]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  }, [onCancel]);

  // Toolbar drag handlers
  const handleToolbarMouseDown = useCallback((e) => {
    // Only drag if clicking on toolbar background (not buttons)
    if (e.target.closest('button')) return;

    setIsDraggingToolbar(true);
    setDragStart({
      x: e.clientX - toolbarPosition.x,
      y: e.clientY - toolbarPosition.y,
    });
    e.stopPropagation();
  }, [toolbarPosition]);

  const handleToolbarMouseMove = useCallback((e) => {
    if (!isDraggingToolbar) return;

    setToolbarPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDraggingToolbar, dragStart]);

  const handleToolbarMouseUp = useCallback(() => {
    setIsDraggingToolbar(false);
  }, []);

  useEffect(() => {
    if (!isActive) return;

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isActive, handleKeyDown]);

  useEffect(() => {
    if (!isDraggingToolbar) return;

    window.addEventListener('mousemove', handleToolbarMouseMove);
    window.addEventListener('mouseup', handleToolbarMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleToolbarMouseMove);
      window.removeEventListener('mouseup', handleToolbarMouseUp);
    };
  }, [isDraggingToolbar, handleToolbarMouseMove, handleToolbarMouseUp]);

  if (!isActive) return null;

  const TOOLS = [
    { id: 'arrow', icon: ArrowRight, label: 'Arrow' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'text', icon: Type, label: 'Text' },
  ];

  const COLORS = [
    { name: 'Red', value: '#FF0000' },
    { name: 'Blue', value: '#0066FF' },
    { name: 'Green', value: '#00CC00' },
    { name: 'Yellow', value: '#FFD700' },
    { name: 'Purple', value: '#9966FF' },
    { name: 'Orange', value: '#FF8800' },
    { name: 'Pink', value: '#FF69B4' },
    { name: 'Black', value: '#000000' },
  ];

  return (
    <div className="pre-capture-markup" ref={overlayRef}>
      {/* Semi-transparent overlay */}
      <div className="pre-capture-markup__backdrop" />

      {/* Canvas for drawing */}
      <canvas
        ref={canvasRef}
        className="pre-capture-markup__canvas"
        onMouseDown={tool === 'text' ? handleTextAdd : handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{ cursor: tool === 'text' ? 'text' : 'crosshair' }}
      />

      {/* Toolbar */}
      <div
        ref={toolbarRef}
        className="pre-capture-markup__toolbar"
        onMouseDown={handleToolbarMouseDown}
        style={{
          transform: `translate(calc(-50% + ${toolbarPosition.x}px), ${toolbarPosition.y}px)`,
        }}
      >
        <div className="pre-capture-markup__toolbar-section">
          <span className="pre-capture-markup__toolbar-label">Draw annotations, then capture</span>
        </div>

        {/* Tools */}
        <div className="pre-capture-markup__toolbar-section">
          {TOOLS.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTool(id)}
              className={`pre-capture-markup__tool-button ${tool === id ? 'active' : ''}`}
              title={label}
            >
              <Icon size={20} />
            </button>
          ))}
        </div>

        {/* Colors */}
        <div className="pre-capture-markup__toolbar-section">
          {COLORS.map(({ name, value }) => (
            <button
              key={value}
              onClick={() => setColor(value)}
              className={`pre-capture-markup__color-button ${color === value ? 'active' : ''}`}
              title={name}
              style={{ backgroundColor: value }}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="pre-capture-markup__toolbar-section">
          <button
            onClick={handleCapture}
            className="pre-capture-markup__action-button pre-capture-markup__action-button--primary"
          >
            <Check size={20} />
            Capture with Annotations
          </button>
          <button
            onClick={onCancel}
            className="pre-capture-markup__action-button pre-capture-markup__action-button--secondary"
          >
            <X size={20} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

PreCaptureMarkup.propTypes = {
  isActive: PropTypes.bool.isRequired,
  onCapture: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
