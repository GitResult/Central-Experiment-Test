/**
 * AlignmentGuides Component
 * Displays visual alignment guides when dragging elements
 * Snaps elements to horizontal and vertical alignment with nearby elements
 */

import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';

/**
 * Calculate alignment guides based on dragging element and nearby elements
 * @param {DOMRect} dragRect - Bounding rect of element being dragged
 * @param {DOMRect[]} targetRects - Bounding rects of other elements
 * @param {number} snapThreshold - Distance threshold for snapping (default: 5px)
 * @returns {Object} Alignment guides { vertical: [], horizontal: [], snapOffset: { x, y } }
 */
export function calculateAlignmentGuides(dragRect, targetRects, snapThreshold = 5) {
  const guides = {
    vertical: [], // { position: number, type: 'left' | 'center' | 'right' }
    horizontal: [], // { position: number, type: 'top' | 'middle' | 'bottom' }
    snapOffset: { x: 0, y: 0 }
  };

  if (!dragRect || !targetRects || targetRects.length === 0) {
    return guides;
  }

  // Calculate drag element key positions
  const dragLeft = dragRect.left;
  const dragRight = dragRect.right;
  const dragCenterX = dragRect.left + dragRect.width / 2;
  const dragTop = dragRect.top;
  const dragBottom = dragRect.bottom;
  const dragCenterY = dragRect.top + dragRect.height / 2;

  let closestVertical = null;
  let closestHorizontal = null;
  let minVerticalDistance = snapThreshold;
  let minHorizontalDistance = snapThreshold;

  targetRects.forEach(targetRect => {
    // Skip if same element
    if (targetRect === dragRect) return;

    // Calculate target element key positions
    const targetLeft = targetRect.left;
    const targetRight = targetRect.right;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetTop = targetRect.top;
    const targetBottom = targetRect.bottom;
    const targetCenterY = targetRect.top + targetRect.height / 2;

    // Check vertical alignments (left, center, right)
    const verticalAlignments = [
      { position: targetLeft, type: 'left', dragPos: dragLeft },
      { position: targetCenterX, type: 'center', dragPos: dragCenterX },
      { position: targetRight, type: 'right', dragPos: dragRight }
    ];

    verticalAlignments.forEach(({ position, type, dragPos }) => {
      const distance = Math.abs(dragPos - position);
      if (distance < minVerticalDistance) {
        minVerticalDistance = distance;
        closestVertical = { position, type, offset: position - dragPos };
      }
    });

    // Check horizontal alignments (top, middle, bottom)
    const horizontalAlignments = [
      { position: targetTop, type: 'top', dragPos: dragTop },
      { position: targetCenterY, type: 'middle', dragPos: dragCenterY },
      { position: targetBottom, type: 'bottom', dragPos: dragBottom }
    ];

    horizontalAlignments.forEach(({ position, type, dragPos }) => {
      const distance = Math.abs(dragPos - position);
      if (distance < minHorizontalDistance) {
        minHorizontalDistance = distance;
        closestHorizontal = { position, type, offset: position - dragPos };
      }
    });
  });

  // Add guides for closest alignments
  if (closestVertical) {
    guides.vertical.push(closestVertical);
    guides.snapOffset.x = closestVertical.offset;
  }

  if (closestHorizontal) {
    guides.horizontal.push(closestHorizontal);
    guides.snapOffset.y = closestHorizontal.offset;
  }

  return guides;
}

/**
 * AlignmentGuides Component
 * Renders visual guide lines when active
 */
export function AlignmentGuides({ guides, containerRef }) {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    if (containerRef?.current) {
      setContainer(containerRef.current);
    }
  }, [containerRef]);

  if (!guides || (!guides.vertical?.length && !guides.horizontal?.length)) {
    return null;
  }

  const containerRect = container?.getBoundingClientRect();
  if (!containerRect) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 9999,
      }}
    >
      {/* Vertical guides */}
      {guides.vertical?.map((guide, index) => (
        <div
          key={`v-${index}`}
          style={{
            position: 'absolute',
            left: `${guide.position}px`,
            top: 0,
            bottom: 0,
            width: '1px',
            background: theme.colors.primary[500],
            boxShadow: '0 0 4px rgba(59, 130, 246, 0.5)',
          }}
        >
          {/* Label */}
          <div
            style={{
              position: 'absolute',
              top: '10px',
              left: '4px',
              padding: '2px 6px',
              background: theme.colors.primary[500],
              color: '#ffffff',
              fontSize: theme.typography.fontSize.xs,
              borderRadius: theme.borderRadius.sm,
              whiteSpace: 'nowrap',
              fontWeight: theme.typography.fontWeight.medium,
            }}
          >
            {guide.type}
          </div>
        </div>
      ))}

      {/* Horizontal guides */}
      {guides.horizontal?.map((guide, index) => (
        <div
          key={`h-${index}`}
          style={{
            position: 'absolute',
            top: `${guide.position}px`,
            left: 0,
            right: 0,
            height: '1px',
            background: theme.colors.primary[500],
            boxShadow: '0 0 4px rgba(59, 130, 246, 0.5)',
          }}
        >
          {/* Label */}
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '4px',
              padding: '2px 6px',
              background: theme.colors.primary[500],
              color: '#ffffff',
              fontSize: theme.typography.fontSize.xs,
              borderRadius: theme.borderRadius.sm,
              whiteSpace: 'nowrap',
              fontWeight: theme.typography.fontWeight.medium,
            }}
          >
            {guide.type}
          </div>
        </div>
      ))}
    </div>
  );
}

AlignmentGuides.propTypes = {
  guides: PropTypes.shape({
    vertical: PropTypes.arrayOf(
      PropTypes.shape({
        position: PropTypes.number.isRequired,
        type: PropTypes.oneOf(['left', 'center', 'right']).isRequired,
      })
    ),
    horizontal: PropTypes.arrayOf(
      PropTypes.shape({
        position: PropTypes.number.isRequired,
        type: PropTypes.oneOf(['top', 'middle', 'bottom']).isRequired,
      })
    ),
    snapOffset: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
  }),
  containerRef: PropTypes.object,
};

/**
 * Hook to manage alignment guides during drag operations
 * @param {boolean} isDragging - Whether currently dragging
 * @param {DOMRect} dragRect - Bounding rect of element being dragged
 * @param {DOMRect[]} targetRects - Bounding rects of other elements
 * @param {Object} options - Configuration options
 * @returns {Object} { guides, snapOffset }
 */
export function useAlignmentGuides(isDragging, dragRect, targetRects, options = {}) {
  const { snapThreshold = 5, enabled = true } = options;
  const [guides, setGuides] = useState(null);

  useEffect(() => {
    if (!enabled || !isDragging || !dragRect) {
      setGuides(null);
      return;
    }

    const calculatedGuides = calculateAlignmentGuides(dragRect, targetRects, snapThreshold);
    setGuides(calculatedGuides);
  }, [isDragging, dragRect, targetRects, snapThreshold, enabled]);

  return {
    guides,
    snapOffset: guides?.snapOffset || { x: 0, y: 0 },
  };
}
