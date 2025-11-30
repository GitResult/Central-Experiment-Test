import React from 'react';
import PropTypes from 'prop-types';

/**
 * ResizeHandles Component
 *
 * Corner handles for element resizing.
 * Maintains aspect ratio with Shift key. Min size: 50x50px.
 *
 * Props:
 * - onResizeStart: function - Callback when resize starts (e, maintainAspectRatio)
 */
export function ResizeHandles({ onResizeStart }) {
  const handleMouseDown = (e, maintainAspectRatio) => {
    e.stopPropagation();
    onResizeStart(e, maintainAspectRatio || e.shiftKey);
  };

  return (
    <>
      {/* Bottom-right corner handle (primary) */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 bg-blue-600 border-2 border-white cursor-se-resize z-10"
        style={{ transform: 'translate(50%, 50%)' }}
        onMouseDown={(e) => handleMouseDown(e, false)}
        title="Drag to resize (hold Shift for aspect ratio)"
      />

      {/* Bottom-left corner handle */}
      <div
        className="absolute bottom-0 left-0 w-3 h-3 bg-blue-500 border border-white cursor-sw-resize z-10"
        style={{ transform: 'translate(-50%, 50%)' }}
        onMouseDown={(e) => handleMouseDown(e, false)}
      />

      {/* Top-right corner handle */}
      <div
        className="absolute top-0 right-0 w-3 h-3 bg-blue-500 border border-white cursor-ne-resize z-10"
        style={{ transform: 'translate(50%, -50%)' }}
        onMouseDown={(e) => handleMouseDown(e, false)}
      />

      {/* Top-left corner handle */}
      <div
        className="absolute top-0 left-0 w-3 h-3 bg-blue-500 border border-white cursor-nw-resize z-10"
        style={{ transform: 'translate(-50%, -50%)' }}
        onMouseDown={(e) => handleMouseDown(e, false)}
      />
    </>
  );
}

ResizeHandles.propTypes = {
  onResizeStart: PropTypes.func.isRequired
};
