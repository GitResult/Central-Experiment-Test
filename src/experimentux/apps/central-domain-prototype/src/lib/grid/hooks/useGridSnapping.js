/**
 * useGridSnapping Hook
 * Hook for snap-to-grid functionality
 */

import { useCallback, useState } from 'react';
import { snapToGrid, snapPointToGrid, snapRectToGrid, calculateSnapGuides, applySnapGuides } from '../GridSnapping';

/**
 * Hook for grid snapping functionality
 * @param {Object} options - Snapping options
 * @returns {Object} Snapping functions and state
 */
export function useGridSnapping(options = {}) {
  const {
    gridSize = 20,
    enabled = true,
    snapToGuides = true,
    guideThreshold = 5
  } = options;

  const [snapGuides, setSnapGuides] = useState({ vertical: [], horizontal: [] });

  const snapValue = useCallback((value) => {
    if (!enabled) return value;
    return snapToGrid(value, gridSize);
  }, [enabled, gridSize]);

  const snapPoint = useCallback((point) => {
    if (!enabled) return point;
    return snapPointToGrid(point, gridSize);
  }, [enabled, gridSize]);

  const snapRect = useCallback((rect, mode = 'both') => {
    if (!enabled) return rect;
    return snapRectToGrid(rect, gridSize, mode);
  }, [enabled, gridSize]);

  const calculateGuides = useCallback((element, otherElements) => {
    if (!enabled || !snapToGuides) return { vertical: [], horizontal: [] };

    const guides = calculateSnapGuides(element, otherElements, guideThreshold);
    setSnapGuides(guides);
    return guides;
  }, [enabled, snapToGuides, guideThreshold]);

  const snapWithGuides = useCallback((element, otherElements) => {
    if (!enabled) return element;

    if (snapToGuides && otherElements && otherElements.length > 0) {
      const guides = calculateGuides(element, otherElements);
      return applySnapGuides(element, guides);
    }

    return snapRect(element);
  }, [enabled, snapToGuides, calculateGuides, snapRect]);

  const clearGuides = useCallback(() => {
    setSnapGuides({ vertical: [], horizontal: [] });
  }, []);

  return {
    snapValue,
    snapPoint,
    snapRect,
    snapWithGuides,
    calculateGuides,
    clearGuides,
    snapGuides,
    enabled,
    gridSize
  };
}

export default useGridSnapping;
