/**
 * useGridLayout Hook
 * Grid layout calculations and utilities
 */

import { useCallback, useMemo } from 'react';

/**
 * Hook for grid layout calculations
 * @param {Object} options - Grid options
 * @returns {Object} Grid layout utilities
 */
export function useGridLayout(options = {}) {
  const {
    columns = 24,
    rowHeight = 50,
    margin = [10, 10],
    containerPadding = [10, 10],
    containerWidth = 1200
  } = options;

  // Calculate column width
  const columnWidth = useMemo(() => {
    const totalMargin = margin[0] * (columns - 1);
    const totalPadding = containerPadding[0] * 2;
    return (containerWidth - totalMargin - totalPadding) / columns;
  }, [columns, margin, containerPadding, containerWidth]);

  // Convert grid position to pixels
  const gridToPixels = useCallback((gridPosition) => {
    const { x, y, w, h } = gridPosition;

    const pixelX = x * (columnWidth + margin[0]) + containerPadding[0];
    const pixelY = y * (rowHeight + margin[1]) + containerPadding[1];
    const pixelWidth = w * columnWidth + (w - 1) * margin[0];
    const pixelHeight = h * rowHeight + (h - 1) * margin[1];

    return {
      x: pixelX,
      y: pixelY,
      width: pixelWidth,
      height: pixelHeight
    };
  }, [columnWidth, rowHeight, margin, containerPadding]);

  // Convert pixels to grid position
  const pixelsToGrid = useCallback((pixelPosition) => {
    const { x, y, width, height } = pixelPosition;

    const gridX = Math.round((x - containerPadding[0]) / (columnWidth + margin[0]));
    const gridY = Math.round((y - containerPadding[1]) / (rowHeight + margin[1]));
    const gridW = Math.max(1, Math.round(width / (columnWidth + margin[0])));
    const gridH = Math.max(1, Math.round(height / (rowHeight + margin[1])));

    return {
      x: Math.max(0, gridX),
      y: Math.max(0, gridY),
      w: Math.min(columns - gridX, gridW),
      h: gridH
    };
  }, [columnWidth, rowHeight, margin, containerPadding, columns]);

  // Check if grid position is valid
  const isValidGridPosition = useCallback((gridPosition) => {
    const { x, y, w, h } = gridPosition;

    return (
      x >= 0 &&
      y >= 0 &&
      w > 0 &&
      h > 0 &&
      x + w <= columns
    );
  }, [columns]);

  // Check if two grid items collide
  const checkCollision = useCallback((item1, item2) => {
    return !(
      item1.x + item1.w <= item2.x ||
      item2.x + item2.w <= item1.x ||
      item1.y + item1.h <= item2.y ||
      item2.y + item2.h <= item1.y
    );
  }, []);

  // Find available space in grid
  const findAvailableSpace = useCallback((items, width = 1, height = 1) => {
    const occupied = new Set();

    // Mark occupied cells
    items.forEach(item => {
      for (let x = item.x; x < item.x + item.w; x++) {
        for (let y = item.y; y < item.y + item.h; y++) {
          occupied.add(`${x},${y}`);
        }
      }
    });

    // Find first available space
    for (let y = 0; y < 1000; y++) { // Max rows
      for (let x = 0; x <= columns - width; x++) {
        let canFit = true;

        for (let dx = 0; dx < width; dx++) {
          for (let dy = 0; dy < height; dy++) {
            if (occupied.has(`${x + dx},${y + dy}`)) {
              canFit = false;
              break;
            }
          }
          if (!canFit) break;
        }

        if (canFit) {
          return { x, y, w: width, h: height };
        }
      }
    }

    return { x: 0, y: 0, w: width, h: height };
  }, [columns]);

  // Compact layout vertically
  const compactLayout = useCallback((items) => {
    const sorted = [...items].sort((a, b) => a.y - b.y || a.x - b.x);
    const compacted = [];

    sorted.forEach(item => {
      let newY = 0;

      // Find lowest y position without collision
      while (true) {
        const testItem = { ...item, y: newY };
        const hasCollision = compacted.some(other => checkCollision(testItem, other));

        if (!hasCollision) {
          compacted.push(testItem);
          break;
        }

        newY++;
      }
    });

    return compacted;
  }, [checkCollision]);

  return {
    columns,
    rowHeight,
    columnWidth,
    margin,
    containerPadding,
    gridToPixels,
    pixelsToGrid,
    isValidGridPosition,
    checkCollision,
    findAvailableSpace,
    compactLayout
  };
}

export default useGridLayout;
