/**
 * Grid Overlay
 * Visual grid lines overlay component
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';

export function GridOverlay({
  gridSize = 20,
  visible = true,
  color = theme.colors.border.subtle,
  opacity = 0.3,
  majorGridMultiple = 5,
  majorColor = theme.colors.border.default,
  style = {}
}) {
  if (!visible) return null;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        ...style
      }}
    >
      <defs>
        <pattern
          id="grid-pattern"
          width={gridSize}
          height={gridSize}
          patternUnits="userSpaceOnUse"
        >
          {/* Minor grid lines */}
          <path
            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity={opacity}
          />
        </pattern>

        <pattern
          id="major-grid-pattern"
          width={gridSize * majorGridMultiple}
          height={gridSize * majorGridMultiple}
          patternUnits="userSpaceOnUse"
        >
          {/* Major grid lines */}
          <path
            d={`M ${gridSize * majorGridMultiple} 0 L 0 0 0 ${gridSize * majorGridMultiple}`}
            fill="none"
            stroke={majorColor}
            strokeWidth="1"
            opacity={opacity * 1.5}
          />
        </pattern>
      </defs>

      {/* Render minor grid */}
      <rect width="100%" height="100%" fill="url(#grid-pattern)" />

      {/* Render major grid */}
      <rect width="100%" height="100%" fill="url(#major-grid-pattern)" />
    </svg>
  );
}

GridOverlay.propTypes = {
  gridSize: PropTypes.number,
  visible: PropTypes.bool,
  color: PropTypes.string,
  opacity: PropTypes.number,
  majorGridMultiple: PropTypes.number,
  majorColor: PropTypes.string,
  style: PropTypes.object
};

export default GridOverlay;
