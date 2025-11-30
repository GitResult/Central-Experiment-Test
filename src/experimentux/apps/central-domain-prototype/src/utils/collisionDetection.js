/**
 * Custom Collision Detection Algorithms
 * For precise drag-and-drop targeting in the page builder
 */

import {
  closestCenter,
  closestCorners,
  rectIntersection,
  pointerWithin,
} from '@dnd-kit/core';

/**
 * Hybrid collision detection strategy
 * Combines multiple strategies for optimal results:
 * 1. Pointer within (highest priority for dropzones)
 * 2. Rect intersection (for overlapping elements)
 * 3. Closest center (fallback for general positioning)
 */
export function hybridCollisionDetection(args) {
  // First, try pointer within - most accurate for dropzones
  const pointerCollisions = pointerWithin(args);
  if (pointerCollisions.length > 0) {
    return pointerCollisions;
  }

  // Next, try rectangle intersection - good for overlapping elements
  const rectCollisions = rectIntersection(args);
  if (rectCollisions.length > 0) {
    return rectCollisions;
  }

  // Fallback to closest center
  return closestCenter(args);
}

/**
 * Column-aware collision detection
 * Prioritizes targets in the same column as the dragged element
 */
export function columnAwareCollisionDetection(args) {
  const { active, droppableContainers } = args;

  // Extract column ID from active element
  const activeColumnId = active.data?.current?.columnId;

  // Filter droppable containers to same column first
  const sameColumnContainers = Array.from(droppableContainers).filter(
    ([id, container]) => {
      return container.data?.current?.columnId === activeColumnId;
    }
  );

  // If we have same-column containers, prioritize them
  if (sameColumnContainers.length > 0) {
    const sameColumnArgs = {
      ...args,
      droppableContainers: new Map(sameColumnContainers),
    };
    const collisions = closestCenter(sameColumnArgs);
    if (collisions.length > 0) {
      return collisions;
    }
  }

  // Otherwise, use hybrid detection for cross-column drops
  return hybridCollisionDetection(args);
}

/**
 * Smart collision detection with row awareness
 * Takes into account row boundaries and prevents unwanted cross-row drops
 */
export function smartCollisionDetection(args) {
  const { active, droppableContainers, collisionRect } = args;

  const activeRowId = active.data?.current?.rowId;
  const activeColumnId = active.data?.current?.columnId;

  // Group containers by row
  const containersByRow = new Map();
  droppableContainers.forEach((container, id) => {
    const rowId = container.data?.current?.rowId;
    if (rowId) {
      if (!containersByRow.has(rowId)) {
        containersByRow.set(rowId, new Map());
      }
      containersByRow.get(rowId).set(id, container);
    }
  });

  // Try same row first
  if (activeRowId && containersByRow.has(activeRowId)) {
    const sameRowArgs = {
      ...args,
      droppableContainers: containersByRow.get(activeRowId),
    };
    const collisions = columnAwareCollisionDetection(sameRowArgs);
    if (collisions.length > 0) {
      return collisions;
    }
  }

  // If no same-row collisions, check adjacent rows
  if (activeRowId && containersByRow.size > 0) {
    const rowIds = Array.from(containersByRow.keys()).sort();
    const activeRowIndex = rowIds.indexOf(activeRowId);

    // Check row above and below
    const adjacentRows = [
      rowIds[activeRowIndex - 1],
      rowIds[activeRowIndex + 1],
    ].filter(Boolean);

    for (const rowId of adjacentRows) {
      const adjacentRowArgs = {
        ...args,
        droppableContainers: containersByRow.get(rowId),
      };
      const collisions = columnAwareCollisionDetection(adjacentRowArgs);
      if (collisions.length > 0) {
        return collisions;
      }
    }
  }

  // Fallback to hybrid detection
  return hybridCollisionDetection(args);
}

/**
 * Get collision detection strategy based on context
 */
export function getCollisionDetection(mode = 'smart') {
  const strategies = {
    smart: smartCollisionDetection,
    hybrid: hybridCollisionDetection,
    columnAware: columnAwareCollisionDetection,
    closestCenter: closestCenter,
    closestCorners: closestCorners,
    rectIntersection: rectIntersection,
    pointerWithin: pointerWithin,
  };

  return strategies[mode] || smartCollisionDetection;
}
