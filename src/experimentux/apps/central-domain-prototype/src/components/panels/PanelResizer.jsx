/**
 * Panel Resizer
 * Unified resize handle system for panels
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';

const HANDLE_SIZE = 8;
const HANDLE_ACTIVE_AREA = 16;

const CURSORS = {
  n: 'ns-resize',
  s: 'ns-resize',
  e: 'ew-resize',
  w: 'ew-resize',
  ne: 'nesw-resize',
  nw: 'nwse-resize',
  se: 'nwse-resize',
  sw: 'nesw-resize'
};

export function PanelResizer({ handle, onResizeStart, isResizing }) {
  const getHandleStyle = () => {
    const baseStyle = {
      position: 'absolute',
      zIndex: 10,
      cursor: CURSORS[handle],
      backgroundColor: isResizing ? theme.colors.primary[500] : 'transparent',
      transition: `background-color ${theme.transitions.fast}`
    };

    switch (handle) {
      case 'n':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          right: 0,
          height: `${HANDLE_ACTIVE_AREA}px`,
          cursor: 'ns-resize'
        };
      case 's':
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          right: 0,
          height: `${HANDLE_ACTIVE_AREA}px`,
          cursor: 'ns-resize'
        };
      case 'e':
        return {
          ...baseStyle,
          top: 0,
          bottom: 0,
          right: 0,
          width: `${HANDLE_ACTIVE_AREA}px`,
          cursor: 'ew-resize'
        };
      case 'w':
        return {
          ...baseStyle,
          top: 0,
          bottom: 0,
          left: 0,
          width: `${HANDLE_ACTIVE_AREA}px`,
          cursor: 'ew-resize'
        };
      case 'ne':
        return {
          ...baseStyle,
          top: 0,
          right: 0,
          width: `${HANDLE_ACTIVE_AREA}px`,
          height: `${HANDLE_ACTIVE_AREA}px`,
          cursor: 'nesw-resize'
        };
      case 'nw':
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          width: `${HANDLE_ACTIVE_AREA}px`,
          height: `${HANDLE_ACTIVE_AREA}px`,
          cursor: 'nwse-resize'
        };
      case 'se':
        return {
          ...baseStyle,
          bottom: 0,
          right: 0,
          width: `${HANDLE_ACTIVE_AREA}px`,
          height: `${HANDLE_ACTIVE_AREA}px`,
          cursor: 'nwse-resize'
        };
      case 'sw':
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          width: `${HANDLE_ACTIVE_AREA}px`,
          height: `${HANDLE_ACTIVE_AREA}px`,
          cursor: 'nesw-resize'
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      style={getHandleStyle()}
      onMouseDown={(e) => onResizeStart(handle, e)}
      onMouseEnter={(e) => {
        if (!isResizing) {
          e.currentTarget.style.backgroundColor = `${theme.colors.primary[500]}20`;
        }
      }}
      onMouseLeave={(e) => {
        if (!isResizing) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    />
  );
}

PanelResizer.propTypes = {
  handle: PropTypes.oneOf(['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw']).isRequired,
  onResizeStart: PropTypes.func.isRequired,
  isResizing: PropTypes.bool
};

export default PanelResizer;
