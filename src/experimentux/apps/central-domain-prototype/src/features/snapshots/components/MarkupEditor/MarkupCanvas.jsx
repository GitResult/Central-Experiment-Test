/**
 * MarkupCanvas
 * Canvas-based markup editor using fabric.js
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fabric } from 'fabric';
import { Undo, Redo, Save, X } from 'lucide-react';
import { theme } from '../../../../config/theme';
import { DrawingTools } from './DrawingTools';

export function MarkupCanvas({ imageUrl, initialMarkup = [], onSave, onCancel }) {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const toolbarRef = useRef(null);
  const [activeTool, setActiveTool] = useState('select'); // Default to select tool
  const [activeColor, setActiveColor] = useState('#FF0000');
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const history = useRef({ past: [], future: [] });
  const [isLoading, setIsLoading] = useState(true);
  const isUndoRedoRef = useRef(false); // Flag to prevent saving history during undo/redo

  // Use refs to track active tool and color without causing re-renders
  const activeToolRef = useRef(activeTool);
  const activeColorRef = useRef(activeColor);

  // Drawing state - use refs to avoid closure issues
  const isDrawingRef = useRef(false);
  const drawingObjectRef = useRef(null);
  const drawingStartRef = useRef(null);

  // Update refs when state changes
  useEffect(() => {
    activeToolRef.current = activeTool;
  }, [activeTool]);

  useEffect(() => {
    activeColorRef.current = activeColor;
  }, [activeColor]);

  // Toolbar dragging
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 });
  const [isDraggingToolbar, setIsDraggingToolbar] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Initialize fabric.js canvas
  useEffect(() => {
    if (!canvasRef.current || fabricRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      backgroundColor: '#f0f0f0',
    });

    fabricRef.current = canvas;

    // Load background image
    fabric.Image.fromURL(imageUrl, (img) => {
      // Set canvas dimensions to match image
      canvas.setWidth(img.width);
      canvas.setHeight(img.height);

      // Set image as background (no scaling needed, 1:1 match)
      img.selectable = false;
      img.evented = false;
      canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas));

      // Load initial markup if provided (after canvas is sized)
      if (initialMarkup && initialMarkup.length > 0) {
        canvas.loadFromJSON({ objects: initialMarkup }, () => {
          canvas.renderAll();

          // Save initial state to history
          const json = JSON.stringify(canvas.toJSON(['selectable']));
          history.current.past.push(json);
          setCanUndo(true);
        });
      } else {
        // Save initial empty state to history
        const json = JSON.stringify(canvas.toJSON(['selectable']));
        history.current.past.push(json);
      }

      setIsLoading(false);
    }, { crossOrigin: 'anonymous' });

    // Track changes for undo/redo
    canvas.on('object:added', () => saveToHistory());
    canvas.on('object:modified', () => saveToHistory());
    canvas.on('object:removed', () => saveToHistory());

    // Add canvas mouse event handlers for drawing
    canvas.on('mouse:down', (opt) => {
      const tool = activeToolRef.current;
      const color = activeColorRef.current;

      // If select tool is active, don't draw - just allow selection/movement
      if (!tool || tool === 'select') return;

      const pointer = canvas.getPointer(opt.e);
      drawingStartRef.current = pointer;
      isDrawingRef.current = true;

      // Disable canvas selection while drawing
      canvas.selection = false;

      // For text tool, add editable text directly on canvas
      if (tool === 'text') {
        const textObj = new fabric.IText('Type here...', {
          left: pointer.x,
          top: pointer.y,
          fill: color,
          fontSize: 20,
          fontFamily: 'Arial',
          selectable: true,
          editable: true,
        });

        canvas.add(textObj);
        canvas.setActiveObject(textObj);

        // Enter editing mode immediately so user can type
        textObj.enterEditing();
        textObj.selectAll();

        canvas.renderAll();
        isDrawingRef.current = false;

        // Re-enable selection after text is added
        canvas.selection = true;
        return;
      }

      // Create initial shape for other tools
      let shape;
      const options = {
        left: pointer.x,
        top: pointer.y,
        stroke: color,
        strokeWidth: 3,
        fill: 'transparent',
        selectable: false, // Not selectable during drawing
        hasControls: false, // Hide controls during drawing
        hasBorders: false, // Hide borders during drawing
      };

      switch (tool) {
        case 'arrow':
        case 'line':
          shape = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], options);
          break;

        case 'rectangle':
          shape = new fabric.Rect({ width: 0, height: 0, ...options });
          break;

        case 'circle':
          shape = new fabric.Circle({
            radius: 0,
            ...options,
            originX: 'center',
            originY: 'center',
          });
          break;

        case 'blur':
          shape = new fabric.Rect({
            width: 0,
            height: 0,
            left: pointer.x,
            top: pointer.y,
            fill: 'rgba(255, 255, 255, 0.7)',
            stroke: '#FBBF24',
            strokeWidth: 2,
            strokeDashArray: [5, 5],
            selectable: false,
            hasControls: false,
            hasBorders: false,
            redactionType: 'blur',
          });
          break;

        case 'blackbox':
          shape = new fabric.Rect({
            width: 0,
            height: 0,
            left: pointer.x,
            top: pointer.y,
            fill: '#000000',
            stroke: '#DC2626',
            strokeWidth: 3,
            selectable: false,
            hasControls: false,
            hasBorders: false,
            redactionType: 'blackbox',
          });
          break;
      }

      if (shape) {
        canvas.add(shape);
        drawingObjectRef.current = shape;
      }
    });

    canvas.on('mouse:move', (opt) => {
      if (!isDrawingRef.current || !drawingObjectRef.current || !drawingStartRef.current) return;

      const tool = activeToolRef.current;
      const pointer = canvas.getPointer(opt.e);
      const shape = drawingObjectRef.current;

      switch (tool) {
        case 'arrow':
        case 'line': {
          shape.set({
            x2: pointer.x,
            y2: pointer.y,
          });
          break;
        }

        case 'rectangle':
        case 'blur':
        case 'blackbox': {
          const width = pointer.x - drawingStartRef.current.x;
          const height = pointer.y - drawingStartRef.current.y;
          shape.set({
            width: Math.abs(width),
            height: Math.abs(height),
            left: width > 0 ? drawingStartRef.current.x : pointer.x,
            top: height > 0 ? drawingStartRef.current.y : pointer.y,
          });
          break;
        }

        case 'circle': {
          const radius = Math.sqrt(
            Math.pow(pointer.x - drawingStartRef.current.x, 2) +
            Math.pow(pointer.y - drawingStartRef.current.y, 2)
          );
          shape.set({
            radius: radius,
            left: drawingStartRef.current.x,
            top: drawingStartRef.current.y,
          });
          break;
        }
      }

      canvas.renderAll();
    });

    canvas.on('mouse:up', () => {
      if (!isDrawingRef.current) return;

      const tool = activeToolRef.current;
      const color = activeColorRef.current;

      isDrawingRef.current = false;

      if (drawingObjectRef.current) {
        // For arrow, add arrowhead
        if (tool === 'arrow') {
          const line = drawingObjectRef.current;
          const angle = Math.atan2(line.y2 - line.y1, line.x2 - line.x1);

          const triangle = new fabric.Triangle({
            left: line.x2,
            top: line.y2,
            width: 15,
            height: 15,
            fill: color,
            angle: (angle * 180 / Math.PI) + 90,
            originX: 'center',
            originY: 'center',
            selectable: false,
          });

          canvas.remove(line);
          const group = new fabric.Group([line, triangle], {
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          canvas.add(group);
          drawingObjectRef.current = null;
        } else {
          // Make object selectable after drawing
          drawingObjectRef.current.set({
            selectable: true,
            hasControls: true,
            hasBorders: true,
          });
          drawingObjectRef.current = null;
        }
      }

      drawingStartRef.current = null;

      // Re-enable canvas selection after drawing
      canvas.selection = true;

      canvas.renderAll();
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, [imageUrl, initialMarkup]); // Only re-initialize when image or initial markup changes

  // Save state to history
  const saveToHistory = useCallback(() => {
    if (!fabricRef.current) return;

    // Don't save history during undo/redo operations
    if (isUndoRedoRef.current) return;

    const json = JSON.stringify(fabricRef.current.toJSON(['selectable']));
    history.current.past.push(json);

    // Limit history to 10 items
    if (history.current.past.length > 10) {
      history.current.past.shift();
    }

    history.current.future = [];
    setCanUndo(true);
    setCanRedo(false);
  }, []);

  // Undo last action
  const handleUndo = useCallback(() => {
    if (!fabricRef.current || history.current.past.length === 0) return;

    // Set flag to prevent saving history during undo
    isUndoRedoRef.current = true;

    const currentState = JSON.stringify(fabricRef.current.toJSON(['selectable']));
    history.current.future.push(currentState);

    const previousState = history.current.past.pop();
    fabricRef.current.loadFromJSON(previousState, () => {
      fabricRef.current.renderAll();
      setCanUndo(history.current.past.length > 0);
      setCanRedo(true);

      // Clear flag after undo is complete
      isUndoRedoRef.current = false;
    });
  }, []);

  // Redo last undone action
  const handleRedo = useCallback(() => {
    if (!fabricRef.current || history.current.future.length === 0) return;

    // Set flag to prevent saving history during redo
    isUndoRedoRef.current = true;

    const currentState = JSON.stringify(fabricRef.current.toJSON(['selectable']));
    history.current.past.push(currentState);

    const nextState = history.current.future.pop();
    fabricRef.current.loadFromJSON(nextState, () => {
      fabricRef.current.renderAll();
      setCanRedo(history.current.future.length > 0);
      setCanUndo(true);

      // Clear flag after redo is complete
      isUndoRedoRef.current = false;
    });
  }, []);

  // Add shape to canvas
  const addShape = useCallback((type) => {
    if (!fabricRef.current) return;

    let shape;
    const options = {
      left: 100,
      top: 100,
      stroke: activeColor,
      strokeWidth: 3,
      fill: 'transparent',
      selectable: true,
    };

    switch (type) {
      case 'arrow':
        // Create line with arrow head
        const line = new fabric.Line([50, 50, 200, 50], {
          ...options,
          stroke: activeColor,
        });

        // Add arrow head (triangle)
        const triangle = new fabric.Triangle({
          left: 200,
          top: 50,
          width: 15,
          height: 15,
          fill: activeColor,
          angle: 90,
          originX: 'center',
          originY: 'center',
        });

        shape = new fabric.Group([line, triangle], {
          selectable: true,
        });
        break;

      case 'rectangle':
        shape = new fabric.Rect({ width: 100, height: 60, ...options });
        break;

      case 'circle':
        shape = new fabric.Circle({ radius: 50, ...options });
        break;

      case 'line':
        shape = new fabric.Line([50, 50, 200, 50], options);
        break;

      case 'text':
        shape = new fabric.IText('Text', {
          left: 100,
          top: 100,
          fill: activeColor,
          fontSize: 20,
          fontFamily: 'Arial',
          selectable: true,
        });
        break;

      case 'blur':
        // Create a semi-transparent white rectangle with blur effect
        shape = new fabric.Rect({
          width: 150,
          height: 100,
          left: 100,
          top: 100,
          fill: 'rgba(255, 255, 255, 0.7)',
          stroke: '#FBBF24',
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          selectable: true,
          redactionType: 'blur', // Custom property to identify redaction
        });
        break;

      case 'blackbox':
        // Create a solid black rectangle (permanent redaction)
        shape = new fabric.Rect({
          width: 150,
          height: 100,
          left: 100,
          top: 100,
          fill: '#000000',
          stroke: '#DC2626',
          strokeWidth: 3,
          selectable: true,
          redactionType: 'blackbox', // Custom property to identify redaction
        });
        break;

      default:
        return;
    }

    fabricRef.current.add(shape);
    fabricRef.current.setActiveObject(shape);
    fabricRef.current.renderAll();
  }, [activeColor]);

  // Handle tool selection - just select the tool, don't add shape yet
  const handleToolSelect = useCallback((tool) => {
    if (!fabricRef.current) return;

    setActiveTool(tool);

    // Enable canvas selection only for select tool
    if (tool === 'select' || tool === null) {
      fabricRef.current.selection = true;
    } else {
      fabricRef.current.selection = false;
    }
  }, []);

  // Save markup data and rendered image
  const handleSave = useCallback(() => {
    if (!fabricRef.current) return;

    // Get markup objects for future editing (optional)
    const objects = fabricRef.current.getObjects().filter(obj => obj.selectable !== false);
    const markupData = objects.map((obj) => obj.toJSON(['selectable']));

    // Export the entire canvas (background + markup) as an image
    const renderedImage = fabricRef.current.toDataURL({
      format: 'png',
      quality: 1.0,
      multiplier: 1 // Use 1 for original size, or higher for better quality
    });

    // Pass both the rendered image and markup data to the save handler
    onSave({
      imageUrl: renderedImage, // The complete image with markup burned in
      markup: markupData // The markup objects for future editing (optional)
    });
  }, [onSave]);

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
    if (!isDraggingToolbar) return;

    window.addEventListener('mousemove', handleToolbarMouseMove);
    window.addEventListener('mouseup', handleToolbarMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleToolbarMouseMove);
      window.removeEventListener('mouseup', handleToolbarMouseUp);
    };
  }, [isDraggingToolbar, handleToolbarMouseMove, handleToolbarMouseUp]);

  return (
    <>
      {/* Floating Toolbar */}
      <div
        ref={toolbarRef}
        onMouseDown={handleToolbarMouseDown}
        style={{
          position: 'fixed',
          bottom: '24px',
          left: '50%',
          transform: `translate(calc(-50% + ${toolbarPosition.x}px), ${toolbarPosition.y}px)`,
          zIndex: 10001,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: theme.spacing[4],
          borderRadius: theme.borderRadius.xl,
          display: 'flex',
          gap: theme.spacing[4],
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04), 0 4px 16px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.08)',
          cursor: 'move',
          userSelect: 'none',
        }}
      >
        <DrawingTools
          activeTool={activeTool}
          activeColor={activeColor}
          onSelectTool={handleToolSelect}
          onSelectColor={setActiveColor}
        />

        <div style={{
          borderLeft: `1px solid ${theme.colors.border.default}`,
          marginLeft: theme.spacing[2],
          marginRight: theme.spacing[2],
        }} />

        <button
          onClick={handleUndo}
          disabled={!canUndo}
          style={{
            background: 'none',
            border: 'none',
            color: canUndo ? theme.colors.text.primary : theme.colors.text.tertiary,
            cursor: canUndo ? 'pointer' : 'not-allowed',
            padding: theme.spacing[2],
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
          }}
          title="Undo (Cmd+Z)"
        >
          <Undo size={20} />
        </button>

        <button
          onClick={handleRedo}
          disabled={!canRedo}
          style={{
            background: 'none',
            border: 'none',
            color: canRedo ? theme.colors.text.primary : theme.colors.text.tertiary,
            cursor: canRedo ? 'pointer' : 'not-allowed',
            padding: theme.spacing[2],
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
          }}
          title="Redo (Cmd+Shift+Z)"
        >
          <Redo size={20} />
        </button>

        <div style={{
          borderLeft: `1px solid ${theme.colors.border.default}`,
          marginLeft: theme.spacing[2],
          marginRight: theme.spacing[2],
        }} />

        <button
          onClick={onCancel}
          style={{
            padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
            backgroundColor: 'transparent',
            color: theme.colors.text.secondary,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            fontSize: theme.typography.fontSize.sm,
          }}
        >
          <X size={16} />
          Cancel
        </button>

        <button
          onClick={handleSave}
          style={{
            padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
            backgroundColor: '#0066FF',
            color: 'white',
            border: 'none',
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
          }}
        >
          <Save size={16} />
          Save
        </button>
      </div>

      {/* Canvas Overlay */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        backgroundColor: theme.colors.background.primary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing[4],
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      }}>
        {isLoading && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: theme.colors.text.secondary,
          }}>
            Loading image...
          </div>
        )}
        <canvas ref={canvasRef} />
      </div>
    </>
  );
}

MarkupCanvas.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  initialMarkup: PropTypes.arrayOf(PropTypes.object),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};
