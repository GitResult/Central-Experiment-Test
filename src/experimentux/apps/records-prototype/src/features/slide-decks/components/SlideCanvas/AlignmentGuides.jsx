import React from 'react';
import PropTypes from 'prop-types';

/**
 * AlignmentGuides Component
 *
 * Visual snap-to-grid guides that appear when dragging elements.
 * Shows dashed lines when element aligns with others (±4px tolerance).
 *
 * Props:
 * - lines: array - Array of guide lines { type: 'horizontal'|'vertical', position: number }
 */
export function AlignmentGuides({ lines }) {
  if (!lines || lines.length === 0) return null;

  return (
    <>
      {lines.map((line, index) => (
        <div
          key={`${line.type}-${line.position}-${index}`}
          className="absolute pointer-events-none z-50"
          style={
            line.type === 'horizontal'
              ? {
                  top: line.position,
                  left: 0,
                  right: 0,
                  height: 1,
                  borderTop: '2px dashed #3b82f6'
                }
              : {
                  left: line.position,
                  top: 0,
                  bottom: 0,
                  width: 1,
                  borderLeft: '2px dashed #3b82f6'
                }
          }
        />
      ))}
    </>
  );
}

AlignmentGuides.propTypes = {
  lines: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
      position: PropTypes.number.isRequired
    })
  )
};

AlignmentGuides.defaultProps = {
  lines: []
};
