/**
 * ResizeHandles Component
 * Provides interactive resize handles for elements
 * Supports 8-point resizing (corners and edges) with aspect ratio lock
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';

/**
 * Resize handle positions
 */
const HANDLE_POSITIONS = {
  // Corners
  'top-left': { cursor: 'nwse-resize', isCorner: true },
  'top-right': { cursor: 'nesw-resize', isCorner: true },
  'bottom-left': { cursor: 'nesw-resize', isCorner: true },
  'bottom-right': { cursor: 'nwse-resize', isCorner: true },
  // Edges
  'top': { cursor: 'ns-resize', isCorner: false },
  'right': { cursor: 'ew-resize', isCorner: false },
  'bottom': { cursor: 'ns-resize', isCorner: false },
  'left': { cursor: 'ew-resize', isCorner: false },
};

/**
 * Calculate new dimensions based on resize handle drag
 */
function calculateNewDimensions(
  position,
  startRect,
  deltaX,
  deltaY,
  lockAspectRatio = false,
  minWidth = 50,
  minHeight = 50
) {
  let newWidth = startRect.width;
  let newHeight = startRect.height;
  let newX = startRect.x;
  let newY = startRect.y;

  const aspectRatio = startRect.width / startRect.height;

  switch (position) {
    case 'top-left':
      newWidth = startRect.width - deltaX;
      newHeight = startRect.height - deltaY;
      newX = startRect.x + deltaX;
      newY = startRect.y + deltaY;
      if (lockAspectRatio) {
        const avgDelta = (deltaX + deltaY) / 2;
        newWidth = startRect.width - avgDelta;
        newHeight = newWidth / aspectRatio;
        newX = startRect.x + avgDelta;
        newY = startRect.y + (startRect.height - newHeight);
      }
      break;

    case 'top-right':
      newWidth = startRect.width + deltaX;
      newHeight = startRect.height - deltaY;
      newY = startRect.y + deltaY;
      if (lockAspectRatio) {
        const avgDelta = (deltaX - deltaY) / 2;
        newWidth = startRect.width + avgDelta;
        newHeight = newWidth / aspectRatio;
        newY = startRect.y + (startRect.height - newHeight);
      }
      break;

    case 'bottom-left':
      newWidth = startRect.width - deltaX;
      newHeight = startRect.height + deltaY;
      newX = startRect.x + deltaX;
      if (lockAspectRatio) {
        const avgDelta = (-deltaX + deltaY) / 2;
        newWidth = startRect.width + avgDelta;
        newHeight = newWidth / aspectRatio;
        newX = startRect.x - avgDelta;
      }
      break;

    case 'bottom-right':
      newWidth = startRect.width + deltaX;
      newHeight = startRect.height + deltaY;
      if (lockAspectRatio) {
        const avgDelta = (deltaX + deltaY) / 2;
        newWidth = startRect.width + avgDelta;
        newHeight = newWidth / aspectRatio;
      }
      break;

    case 'top':
      newHeight = startRect.height - deltaY;
      newY = startRect.y + deltaY;
      if (lockAspectRatio) {
        newWidth = newHeight * aspectRatio;
        newX = startRect.x + (startRect.width - newWidth) / 2;
      }
      break;

    case 'bottom':
      newHeight = startRect.height + deltaY;
      if (lockAspectRatio) {
        newWidth = newHeight * aspectRatio;
        newX = startRect.x + (startRect.width - newWidth) / 2;
      }
      break;

    case 'left':
      newWidth = startRect.width - deltaX;
      newX = startRect.x + deltaX;
      if (lockAspectRatio) {
        newHeight = newWidth / aspectRatio;
        newY = startRect.y + (startRect.height - newHeight) / 2;
      }
      break;

    case 'right':
      newWidth = startRect.width + deltaX;
      if (lockAspectRatio) {
        newHeight = newWidth / aspectRatio;
        newY = startRect.y + (startRect.height - newHeight) / 2;
      }
      break;

    default:
      break;
  }

  // Apply minimum constraints
  if (newWidth < minWidth) {
    newWidth = minWidth;
    newX = startRect.x + (startRect.width - minWidth);
  }
  if (newHeight < minHeight) {
    newHeight = minHeight;
    newY = startRect.y + (startRect.height - minHeight);
  }

  return {
    width: Math.max(newWidth, minWidth),
    height: Math.max(newHeight, minHeight),
    x: newX,
    y: newY,
  };
}

/**
 * ResizeHandle Component
 * Single resize handle at a specific position
 */
function ResizeHandle({ position, onResizeStart }) {
  const handleInfo = HANDLE_POSITIONS[position];

  const style = {
    position: 'absolute',
    width: handleInfo.isCorner ? '10px' : '6px',
    height: handleInfo.isCorner ? '10px' : '6px',
    background: theme.colors.primary[500],
    border: `2px solid ${theme.colors.background.primary}`,
    cursor: handleInfo.cursor,
    zIndex: 10,
    borderRadius: handleInfo.isCorner ? '50%' : '2px',
  };

  // Position the handle
  const positionStyle = {};
  if (position.includes('top')) {
    positionStyle.top = '-5px';
  }
  if (position.includes('bottom')) {
    positionStyle.bottom = '-5px';
  }
  if (position.includes('left')) {
    positionStyle.left = '-5px';
  }
  if (position.includes('right')) {
    positionStyle.right = '-5px';
  }

  // Center edge handles
  if (position === 'top' || position === 'bottom') {
    positionStyle.left = 'calc(50% - 3px)';
  }
  if (position === 'left' || position === 'right') {
    positionStyle.top = 'calc(50% - 3px)';
  }

  return (
    <div
      style={{ ...style, ...positionStyle }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onResizeStart(position, e);
      }}
      onTouchStart={(e) => {
        e.stopPropagation();
        onResizeStart(position, e);
      }}
    />
  );
}

ResizeHandle.propTypes = {
  position: PropTypes.string.isRequired,
  onResizeStart: PropTypes.func.isRequired,
};

/**
 * ResizeHandles Component
 * Wraps an element with resize handles
 */
export function ResizeHandles({
  children,
  isSelected,
  onResize,
  onResizeEnd,
  minWidth = 50,
  minHeight = 50,
  lockAspectRatio = false,
}) {
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState(null);
  const containerRef = useRef(null);
  const startRectRef = useRef(null);
  const startPosRef = useRef({ x: 0, y: 0 });

  const handleResizeStart = useCallback((position, e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const startX = e.clientX || e.touches?.[0]?.clientX;
    const startY = e.clientY || e.touches?.[0]?.clientY;

    startRectRef.current = {
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
    };

    startPosRef.current = { x: startX, y: startY };
    setActiveHandle(position);
    setIsResizing(true);
  }, []);

  const handleResizeMove = useCallback((e) => {
    if (!isResizing || !activeHandle || !startRectRef.current) return;

    e.preventDefault();

    const currentX = e.clientX || e.touches?.[0]?.clientX;
    const currentY = e.clientY || e.touches?.[0]?.clientY;

    const deltaX = currentX - startPosRef.current.x;
    const deltaY = currentY - startPosRef.current.y;

    // Check for Shift key to lock aspect ratio
    const shouldLockAspectRatio = lockAspectRatio || e.shiftKey;

    const newDimensions = calculateNewDimensions(
      activeHandle,
      startRectRef.current,
      deltaX,
      deltaY,
      shouldLockAspectRatio,
      minWidth,
      minHeight
    );

    onResize?.(newDimensions);
  }, [isResizing, activeHandle, lockAspectRatio, minWidth, minHeight, onResize]);

  const handleResizeEnd = useCallback(() => {
    if (!isResizing) return;

    setIsResizing(false);
    setActiveHandle(null);
    startRectRef.current = null;
    onResizeEnd?.();
  }, [isResizing, onResizeEnd]);

  // Set up event listeners
  useEffect(() => {
    if (isResizing) {
      const handleMouseMove = (e) => handleResizeMove(e);
      const handleMouseUp = () => handleResizeEnd();

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
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        outline: isSelected ? `2px solid ${theme.colors.primary[500]}` : 'none',
        outlineOffset: '2px',
      }}
    >
      {children}

      {/* Render resize handles when selected */}
      {isSelected && (
        <>
          {Object.keys(HANDLE_POSITIONS).map((position) => (
            <ResizeHandle
              key={position}
              position={position}
              onResizeStart={handleResizeStart}
            />
          ))}
        </>
      )}

      {/* Resize indicator */}
      {isResizing && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: `${theme.spacing['2']} ${theme.spacing['4']}`,
            background: theme.colors.background.primary,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            boxShadow: theme.shadows.lg,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            zIndex: 1000,
            pointerEvents: 'none',
          }}
        >
          {lockAspectRatio || activeHandle?.includes('-')
            ? 'Hold Shift to lock aspect ratio'
            : 'Resizing...'}
        </div>
      )}
    </div>
  );
}

ResizeHandles.propTypes = {
  children: PropTypes.node.isRequired,
  isSelected: PropTypes.bool,
  onResize: PropTypes.func,
  onResizeEnd: PropTypes.func,
  minWidth: PropTypes.number,
  minHeight: PropTypes.number,
  lockAspectRatio: PropTypes.bool,
};

/**
 * Hook to manage resize state and dimensions
 */
export function useResize(initialWidth, initialHeight) {
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight,
  });

  const handleResize = useCallback((newDimensions) => {
    setDimensions({
      width: newDimensions.width,
      height: newDimensions.height,
    });
  }, []);

  const handleResizeEnd = useCallback(() => {
    // Optional: Save dimensions to store
  }, []);

  return {
    dimensions,
    setDimensions,
    handleResize,
    handleResizeEnd,
  };
}
