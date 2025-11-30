/**
 * useDragAndDrop Hook
 * Manages drag-and-drop functionality with alignment guides and snapping
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { calculateAlignmentGuides } from '../components/editor/AlignmentGuides';

/**
 * Hook to enable drag-and-drop with alignment guides
 * @param {Object} elementPath - Path to element in page structure
 * @param {Object} options - Configuration options
 * @returns {Object} Drag handlers and state
 */
export function useDragAndDrop(elementPath, options = {}) {
  const {
    snapThreshold = 5,
    enableAlignment = true,
    onDragStart,
    onDragEnd,
    onDrop,
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [alignmentGuides, setAlignmentGuides] = useState(null);

  const dragRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: 0, y: 0 });

  const selectElement = useEditorStore((state) => state.selectElement);
  const isElementSelected = useEditorStore((state) => state.isElementSelected);

  // Get all draggable elements for alignment calculation
  const getAllDraggableRects = useCallback(() => {
    const draggables = document.querySelectorAll('[data-draggable="true"]');
    return Array.from(draggables)
      .filter(el => el !== dragRef.current)
      .map(el => el.getBoundingClientRect());
  }, []);

  // Handle drag start
  const handleDragStart = useCallback((e) => {
    e.stopPropagation();

    const rect = e.currentTarget.getBoundingClientRect();
    const startX = e.clientX || e.touches?.[0]?.clientX;
    const startY = e.clientY || e.touches?.[0]?.clientY;

    // Store initial positions
    dragStartPos.current = { x: startX, y: startY };
    elementStartPos.current = { x: rect.left, y: rect.top };
    setDragOffset({
      x: startX - rect.left,
      y: startY - rect.top,
    });

    setIsDragging(true);
    dragRef.current = e.currentTarget;

    // Select element if not already selected
    if (elementPath && !isElementSelected(elementPath)) {
      // Check for Ctrl/Cmd key for multi-selection
      const modKey = e.ctrlKey || e.metaKey;
      selectElement(elementPath, modKey ? 'add' : 'replace');
    }

    onDragStart?.(e, elementPath);
  }, [elementPath, selectElement, isElementSelected, onDragStart]);

  // Handle drag move
  const handleDragMove = useCallback((e) => {
    if (!isDragging || !dragRef.current) return;

    e.preventDefault();

    const currentX = e.clientX || e.touches?.[0]?.clientX;
    const currentY = e.clientY || e.touches?.[0]?.clientY;

    // Calculate new position
    let newX = currentX - dragOffset.x;
    let newY = currentY - dragOffset.y;

    // Calculate alignment guides if enabled
    if (enableAlignment) {
      const dragRect = {
        left: newX,
        top: newY,
        right: newX + dragRef.current.offsetWidth,
        bottom: newY + dragRef.current.offsetHeight,
        width: dragRef.current.offsetWidth,
        height: dragRef.current.offsetHeight,
      };

      const targetRects = getAllDraggableRects();
      const guides = calculateAlignmentGuides(dragRect, targetRects, snapThreshold);

      // Apply snapping
      if (guides.snapOffset.x !== 0) {
        newX += guides.snapOffset.x;
      }
      if (guides.snapOffset.y !== 0) {
        newY += guides.snapOffset.y;
      }

      setAlignmentGuides(guides);
    }

    setCurrentPosition({ x: newX, y: newY });
  }, [isDragging, dragOffset, enableAlignment, snapThreshold, getAllDraggableRects]);

  // Handle drag end
  const handleDragEnd = useCallback((e) => {
    if (!isDragging) return;

    e.stopPropagation();

    setIsDragging(false);
    setAlignmentGuides(null);
    dragRef.current = null;

    onDragEnd?.(e, elementPath, currentPosition);
    onDrop?.(elementPath, currentPosition);
  }, [isDragging, elementPath, currentPosition, onDragEnd, onDrop]);

  // Set up event listeners
  useEffect(() => {
    if (isDragging) {
      const handleMouseMove = (e) => handleDragMove(e);
      const handleMouseUp = (e) => handleDragEnd(e);

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove);
      document.addEventListener('touchend', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleDragMove, handleDragEnd]);

  return {
    isDragging,
    dragHandlers: {
      onMouseDown: handleDragStart,
      onTouchStart: handleDragStart,
    },
    dragStyle: isDragging
      ? {
          position: 'fixed',
          left: `${currentPosition.x}px`,
          top: `${currentPosition.y}px`,
          cursor: 'grabbing',
          zIndex: 1000,
          opacity: 0.8,
        }
      : {
          cursor: 'grab',
        },
    alignmentGuides,
  };
}

/**
 * Hook to create a drop zone
 * @param {Function} onDrop - Callback when element is dropped
 * @returns {Object} Drop zone handlers
 */
export function useDropZone(onDrop) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.stopPropagation();
    setIsOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOver(false);
    onDrop?.(e);
  }, [onDrop]);

  return {
    isOver,
    dropHandlers: {
      onDragOver: handleDragOver,
      onDragLeave: handleDragLeave,
      onDrop: handleDrop,
    },
    dropStyle: isOver
      ? {
          background: 'rgba(59, 130, 246, 0.1)',
          borderColor: '#3b82f6',
        }
      : {},
  };
}
