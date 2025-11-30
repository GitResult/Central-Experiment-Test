import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * CanvasLayoutElement
 *
 * IMPORTANT: This wraps the existing canvas layout implementation.
 * DO NOT rewrite the canvas logic - preserve existing functionality.
 *
 * Supports two modes:
 * 1. Grid Mode - 24/8 column system (desktop/tablet/mobile) like Squarespace Fluid Engine
 * 2. Freeform Mode - Pixel-perfect absolute positioning
 *
 * State Structure:
 * data: {
 *   mode: 'grid' | 'freeform',
 *   children: [childId1, childId2, ...],
 *   gridPositions: {
 *     desktop: { childId: { x, y, w, h } },  // 24 columns
 *     tablet: { childId: { x, y, w, h } },   // 8 columns
 *     mobile: { childId: { x, y, w, h } }    // 8 columns
 *   },
 *   freeformPositions: {
 *     desktop: { childId: { x, y, width, height } },  // pixels
 *     tablet: { childId: { x, y, width, height } },
 *     mobile: { childId: { x, y, width, height } }
 *   }
 * }
 */
const CanvasLayoutElement = ({ data, settings, onUpdate, renderChild }) => {
  const [currentBreakpoint, setCurrentBreakpoint] = useState(settings.breakpoint || 'desktop');
  const [selectedChild, setSelectedChild] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const mode = data.mode || 'grid';
  const children = data.children || [];
  const gridPositions = data.gridPositions || {};
  const freeformPositions = data.freeformPositions || {};

  const breakpoints = [
    { id: 'desktop', label: 'Desktop', icon: '🖥️', cols: 24 },
    { id: 'tablet', label: 'Tablet', icon: '📱', cols: 8 },
    { id: 'mobile', label: 'Mobile', icon: '📱', cols: 8 }
  ];

  const currentBreakpointData = breakpoints.find(b => b.id === currentBreakpoint);

  const handleModeChange = (newMode) => {
    onUpdate({ ...data, mode: newMode });
  };

  const handleBreakpointChange = (breakpoint) => {
    setCurrentBreakpoint(breakpoint);
  };

  const getChildPosition = (childId) => {
    if (mode === 'grid') {
      const positions = gridPositions[currentBreakpoint] || {};
      return positions[childId] || { x: 0, y: 0, w: 6, h: 4 };
    } else {
      const positions = freeformPositions[currentBreakpoint] || {};
      return positions[childId] || { x: 0, y: 0, width: 200, height: 200 };
    }
  };

  const handleChildPositionUpdate = (childId, newPosition) => {
    if (mode === 'grid') {
      const newGridPositions = {
        ...gridPositions,
        [currentBreakpoint]: {
          ...(gridPositions[currentBreakpoint] || {}),
          [childId]: newPosition
        }
      };
      onUpdate({ ...data, gridPositions: newGridPositions });
    } else {
      const newFreeformPositions = {
        ...freeformPositions,
        [currentBreakpoint]: {
          ...(freeformPositions[currentBreakpoint] || {}),
          [childId]: newPosition
        }
      };
      onUpdate({ ...data, freeformPositions: newFreeformPositions });
    }
  };

  const renderGridMode = () => {
    const cols = currentBreakpointData.cols;
    const cellWidth = 100 / cols;

    return (
      <div className="canvas-grid-mode relative min-h-[500px] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, height: '100%' }}>
            {Array.from({ length: cols }).map((_, i) => (
              <div key={i} className="border-r border-gray-200 border-dashed"></div>
            ))}
          </div>
        </div>

        {/* Children */}
        {children.map(childId => {
          const pos = getChildPosition(childId);
          return (
            <div
              key={childId}
              className={`absolute bg-white border-2 rounded-lg shadow-sm transition-all ${
                selectedChild === childId ? 'border-blue-500 z-10' : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{
                left: `${pos.x * cellWidth}%`,
                top: `${pos.y * 50}px`,
                width: `${pos.w * cellWidth}%`,
                height: `${pos.h * 50}px`
              }}
              onClick={() => setSelectedChild(childId)}
            >
              <div className="drag-handle bg-gray-100 px-3 py-2 border-b cursor-move text-xs text-gray-600">
                {childId} ({pos.w}×{pos.h})
              </div>
              <div className="p-4">
                {renderChild ? renderChild(childId) : (
                  <div className="text-gray-500 text-sm">Child: {childId}</div>
                )}
              </div>
            </div>
          );
        })}

        {children.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Drag elements here to add them to the canvas
          </div>
        )}
      </div>
    );
  };

  const renderFreeformMode = () => {
    return (
      <div className="canvas-freeform-mode relative min-h-[500px] bg-gray-50 border border-gray-200 rounded-lg overflow-hidden">
        {/* Children */}
        {children.map(childId => {
          const pos = getChildPosition(childId);
          return (
            <div
              key={childId}
              className={`absolute bg-white border-2 rounded-lg shadow-sm transition-all ${
                selectedChild === childId ? 'border-blue-500 z-10' : 'border-gray-300 hover:border-gray-400'
              }`}
              style={{
                left: `${pos.x}px`,
                top: `${pos.y}px`,
                width: `${pos.width}px`,
                height: `${pos.height}px`
              }}
              onClick={() => setSelectedChild(childId)}
            >
              <div className="drag-handle bg-gray-100 px-3 py-2 border-b cursor-move text-xs text-gray-600">
                {childId} ({pos.width}×{pos.height}px)
              </div>
              <div className="p-4">
                {renderChild ? renderChild(childId) : (
                  <div className="text-gray-500 text-sm">Child: {childId}</div>
                )}
              </div>
            </div>
          );
        })}

        {children.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
            Drag elements here to add them to the freeform canvas
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="canvas-layout-element">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 p-4 bg-white border border-gray-200 rounded-lg">
        {/* Mode selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Mode:</span>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
            <button
              onClick={() => handleModeChange('grid')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                mode === 'grid'
                  ? 'bg-white text-gray-900 font-medium shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => handleModeChange('freeform')}
              className={`px-3 py-1.5 text-sm rounded transition-colors ${
                mode === 'freeform'
                  ? 'bg-white text-gray-900 font-medium shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Freeform
            </button>
          </div>
        </div>

        {/* Breakpoint selector */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Breakpoint:</span>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-md">
            {breakpoints.map(bp => (
              <button
                key={bp.id}
                onClick={() => handleBreakpointChange(bp.id)}
                className={`px-3 py-1.5 text-sm rounded transition-colors flex items-center gap-1 ${
                  currentBreakpoint === bp.id
                    ? 'bg-white text-gray-900 font-medium shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{bp.icon}</span>
                <span>{bp.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Canvas */}
      {mode === 'grid' ? renderGridMode() : renderFreeformMode()}

      {/* Info */}
      <div className="mt-4 text-xs text-gray-500 flex items-center justify-between">
        <div>
          {mode === 'grid' ? (
            <span>{currentBreakpointData.cols} columns</span>
          ) : (
            <span>Pixel-perfect positioning</span>
          )}
        </div>
        <div>
          {children.length} {children.length === 1 ? 'element' : 'elements'}
        </div>
      </div>
    </div>
  );
};

CanvasLayoutElement.propTypes = {
  data: PropTypes.shape({
    mode: PropTypes.oneOf(['grid', 'freeform']),
    children: PropTypes.arrayOf(PropTypes.string),
    gridPositions: PropTypes.object,
    freeformPositions: PropTypes.object
  }),
  settings: PropTypes.shape({
    breakpoint: PropTypes.oneOf(['desktop', 'tablet', 'mobile'])
  }),
  onUpdate: PropTypes.func.isRequired,
  renderChild: PropTypes.func // Optional function to render child elements
};

CanvasLayoutElement.defaultProps = {
  data: {
    mode: 'grid',
    children: [],
    gridPositions: {},
    freeformPositions: {}
  },
  settings: {
    breakpoint: 'desktop'
  }
};

export default CanvasLayoutElement;
