/**
 * Grid Snapping Utilities
 * Calculations for snapping to grid
 */

/**
 * Snap a value to the nearest grid point
 * @param {number} value - Value to snap
 * @param {number} gridSize - Grid cell size
 * @returns {number} Snapped value
 */
export function snapToGrid(value, gridSize) {
  return Math.round(value / gridSize) * gridSize;
}

/**
 * Snap a point (x, y) to the nearest grid intersection
 * @param {Object} point - Point with x and y coordinates
 * @param {number} gridSize - Grid cell size
 * @returns {Object} Snapped point
 */
export function snapPointToGrid(point, gridSize) {
  return {
    x: snapToGrid(point.x, gridSize),
    y: snapToGrid(point.y, gridSize)
  };
}

/**
 * Snap a rectangle to grid
 * @param {Object} rect - Rectangle with x, y, width, height
 * @param {number} gridSize - Grid cell size
 * @param {string} mode - Snap mode: 'position', 'size', 'both'
 * @returns {Object} Snapped rectangle
 */
export function snapRectToGrid(rect, gridSize, mode = 'both') {
  const snapped = { ...rect };

  if (mode === 'position' || mode === 'both') {
    snapped.x = snapToGrid(rect.x, gridSize);
    snapped.y = snapToGrid(rect.y, gridSize);
  }

  if (mode === 'size' || mode === 'both') {
    snapped.width = snapToGrid(rect.width, gridSize);
    snapped.height = snapToGrid(rect.height, gridSize);
  }

  return snapped;
}

/**
 * Calculate snap guides for alignment
 * @param {Object} element - Element being moved/resized
 * @param {Array} otherElements - Other elements to snap to
 * @param {number} threshold - Snap distance threshold
 * @returns {Object} Snap guides { vertical: [], horizontal: [] }
 */
export function calculateSnapGuides(element, otherElements, threshold = 5) {
  const guides = {
    vertical: [], // x-axis guides
    horizontal: [] // y-axis guides
  };

  const elementEdges = {
    left: element.x,
    right: element.x + element.width,
    centerX: element.x + element.width / 2,
    top: element.y,
    bottom: element.y + element.height,
    centerY: element.y + element.height / 2
  };

  otherElements.forEach(other => {
    if (other === element) return;

    const otherEdges = {
      left: other.x,
      right: other.x + other.width,
      centerX: other.x + other.width / 2,
      top: other.y,
      bottom: other.y + other.height,
      centerY: other.y + other.height / 2
    };

    // Check vertical alignment (x-axis)
    ['left', 'right', 'centerX'].forEach(edge => {
      const distance = Math.abs(elementEdges[edge] - otherEdges[edge]);
      if (distance <= threshold) {
        guides.vertical.push({
          position: otherEdges[edge],
          type: edge,
          distance
        });
      }
    });

    // Check horizontal alignment (y-axis)
    ['top', 'bottom', 'centerY'].forEach(edge => {
      const distance = Math.abs(elementEdges[edge] - otherEdges[edge]);
      if (distance <= threshold) {
        guides.horizontal.push({
          position: otherEdges[edge],
          type: edge,
          distance
        });
      }
    });
  });

  // Sort by distance (closest first)
  guides.vertical.sort((a, b) => a.distance - b.distance);
  guides.horizontal.sort((a, b) => a.distance - b.distance);

  return guides;
}

/**
 * Apply snap guides to element position
 * @param {Object} element - Element to snap
 * @param {Object} guides - Snap guides from calculateSnapGuides
 * @returns {Object} Adjusted element position
 */
export function applySnapGuides(element, guides) {
  const adjusted = { ...element };

  // Apply vertical snap (x-axis)
  if (guides.vertical.length > 0) {
    const guide = guides.vertical[0];
    switch (guide.type) {
      case 'left':
        adjusted.x = guide.position;
        break;
      case 'right':
        adjusted.x = guide.position - element.width;
        break;
      case 'centerX':
        adjusted.x = guide.position - element.width / 2;
        break;
    }
  }

  // Apply horizontal snap (y-axis)
  if (guides.horizontal.length > 0) {
    const guide = guides.horizontal[0];
    switch (guide.type) {
      case 'top':
        adjusted.y = guide.position;
        break;
      case 'bottom':
        adjusted.y = guide.position - element.height;
        break;
      case 'centerY':
        adjusted.y = guide.position - element.height / 2;
        break;
    }
  }

  return adjusted;
}

/**
 * Check if point is near grid line
 * @param {number} value - Coordinate value
 * @param {number} gridSize - Grid cell size
 * @param {number} threshold - Distance threshold
 * @returns {boolean} True if near grid line
 */
export function isNearGridLine(value, gridSize, threshold = 3) {
  const remainder = value % gridSize;
  return remainder <= threshold || remainder >= gridSize - threshold;
}

export default {
  snapToGrid,
  snapPointToGrid,
  snapRectToGrid,
  calculateSnapGuides,
  applySnapGuides,
  isNearGridLine
};
