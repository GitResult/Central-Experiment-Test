/**
 * usePanelResize Hook
 * Manages panel resizing functionality
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import { usePanelStore } from '../../../store/panelStore';

/**
 * Hook for panel resize functionality
 * @param {string} panelId - Panel ID
 * @param {Object} options - Resize options
 * @returns {Object} Resize state and handlers
 */
export function usePanelResize(panelId, {
  minWidth = 200,
  minHeight = 150,
  maxWidth = window.innerWidth - 100,
  maxHeight = window.innerHeight - 100,
  snapToGrid = false,
  gridSize = 10
} = {}) {
  const { setPanelSize, getPanel } = usePanelStore();
  const panel = usePanelStore(state => state.panels[panelId]);

  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState(null); // 'n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'

  const startPosRef = useRef({ x: 0, y: 0 });
  const startSizeRef = useRef({ width: 0, height: 0 });

  const snapToGridIfEnabled = useCallback((value) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  }, [snapToGrid, gridSize]);

  const handleResizeStart = useCallback((handle, event) => {
    if (!panel?.resizable) return;

    event.preventDefault();
    event.stopPropagation();

    setIsResizing(true);
    setResizeHandle(handle);

    startPosRef.current = {
      x: event.clientX,
      y: event.clientY
    };

    startSizeRef.current = {
      width: panel.size.width,
      height: panel.size.height
    };
  }, [panel]);

  const handleResizeMove = useCallback((event) => {
    if (!isResizing || !panel) return;

    const deltaX = event.clientX - startPosRef.current.x;
    const deltaY = event.clientY - startPosRef.current.y;

    let newWidth = startSizeRef.current.width;
    let newHeight = startSizeRef.current.height;

    // Calculate new size based on handle
    if (resizeHandle.includes('e')) {
      newWidth = startSizeRef.current.width + deltaX;
    } else if (resizeHandle.includes('w')) {
      newWidth = startSizeRef.current.width - deltaX;
    }

    if (resizeHandle.includes('s')) {
      newHeight = startSizeRef.current.height + deltaY;
    } else if (resizeHandle.includes('n')) {
      newHeight = startSizeRef.current.height - deltaY;
    }

    // Apply constraints
    newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
    newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

    // Snap to grid
    newWidth = snapToGridIfEnabled(newWidth);
    newHeight = snapToGridIfEnabled(newHeight);

    setPanelSize(panelId, { width: newWidth, height: newHeight });
  }, [isResizing, resizeHandle, panel, panelId, setPanelSize, minWidth, minHeight, maxWidth, maxHeight, snapToGridIfEnabled]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeHandle(null);
  }, []);

  // Add/remove event listeners
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);

      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return {
    isResizing,
    resizeHandle,
    handleResizeStart,
    canResize: panel?.resizable || false
  };
}

export default usePanelResize;
