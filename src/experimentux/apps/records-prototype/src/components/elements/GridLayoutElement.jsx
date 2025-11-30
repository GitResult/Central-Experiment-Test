import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import RGL, { WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ReactGridLayout = WidthProvider(RGL);

/**
 * GridLayoutElement
 *
 * IMPORTANT: This wraps the existing react-grid-layout implementation.
 * DO NOT rewrite the grid logic - preserve existing functionality.
 *
 * This element provides a drag-and-drop grid layout system using react-grid-layout.
 * It maintains compatibility with the existing gridLayouts state structure.
 *
 * State Structure:
 * data: {
 *   children: [childId1, childId2, ...],  // Array of child element IDs
 *   positions: {                            // Layout positions for each child
 *     childId: { x, y, w, h, minW, minH, maxW, maxH }
 *   }
 * }
 *
 * settings: {
 *   cols: 12,           // Number of columns
 *   rowHeight: 60,      // Height of each row in pixels
 *   margin: [10, 10],   // [horizontal, vertical] margins
 *   compactType: 'vertical'  // Compaction type: 'vertical', 'horizontal', or null
 * }
 */
const GridLayoutElement = ({ data, settings, onUpdate, renderChild }) => {
  // Track if component is mounted to ignore initial layout changes from react-grid-layout
  const isMountedRef = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Get grid-specific settings or use defaults
  const cols = settings.cols || 12;
  const rowHeight = settings.rowHeight || 60;
  const margin = settings.margin || [10, 10];
  const compactType = settings.compactType || 'vertical';

  // Get children and positions from data
  const children = data.children || [];
  const positions = data.positions || {};

  // Convert positions object to layout array for react-grid-layout
  const layout = children.map(childId => {
    const pos = positions[childId] || { x: 0, y: 0, w: 4, h: 4 };
    return {
      i: childId,
      x: pos.x || 0,
      y: pos.y || 0,
      w: pos.w || 4,
      h: pos.h || 4,
      minW: pos.minW || 2,
      minH: pos.minH || 2,
      maxW: pos.maxW,
      maxH: pos.maxH
    };
  });

  const handleLayoutChange = (newLayout) => {
    // Ignore initial layout changes during mount
    if (!isMountedRef.current) return;

    // Convert layout array back to positions object
    const newPositions = {};
    newLayout.forEach(item => {
      newPositions[item.i] = {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
        minW: item.minW,
        minH: item.minH,
        maxW: item.maxW,
        maxH: item.maxH
      };
    });

    // Only update if positions actually changed
    if (JSON.stringify(newPositions) !== JSON.stringify(positions)) {
      onUpdate({
        ...data,
        positions: newPositions
      });
    }
  };

  if (children.length === 0) {
    return (
      <div className="grid-layout-empty min-h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-8 bg-gray-50">
        <svg
          className="h-12 w-12 text-gray-400 mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
          />
        </svg>
        <div className="text-gray-500 text-sm text-center">
          <p className="font-medium mb-1">Empty Grid Layout</p>
          <p className="text-xs">Drag elements here to add them to the grid</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid-layout-element">
      <ReactGridLayout
        className="layout"
        layout={layout}
        cols={cols}
        rowHeight={rowHeight}
        margin={margin}
        compactType={compactType}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        resizeHandles={['se', 'sw', 'ne', 'nw']}
        containerPadding={[0, 0]}
        useCSSTransforms={true}
        measureBeforeMount={false}
        preventCollision={false}
      >
        {children.map((childId) => (
          <div
            key={childId}
            className="grid-item bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            {/* Drag handle */}
            <div className="drag-handle bg-gray-50 px-3 py-2 border-b border-gray-200 cursor-move hover:bg-gray-100 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                </svg>
                <span className="text-xs text-gray-600 font-medium">Element {childId}</span>
              </div>
            </div>

            {/* Child content */}
            <div className="p-4">
              {renderChild ? renderChild(childId) : (
                <div className="text-gray-500 text-sm">
                  Child element: {childId}
                </div>
              )}
            </div>
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

GridLayoutElement.propTypes = {
  data: PropTypes.shape({
    children: PropTypes.arrayOf(PropTypes.string),
    positions: PropTypes.object
  }),
  settings: PropTypes.shape({
    cols: PropTypes.number,
    rowHeight: PropTypes.number,
    margin: PropTypes.arrayOf(PropTypes.number),
    compactType: PropTypes.oneOf(['vertical', 'horizontal', null])
  }),
  onUpdate: PropTypes.func.isRequired,
  renderChild: PropTypes.func // Optional function to render child elements
};

GridLayoutElement.defaultProps = {
  data: {
    children: [],
    positions: {}
  },
  settings: {
    cols: 12,
    rowHeight: 60,
    margin: [10, 10],
    compactType: 'vertical'
  }
};

export default GridLayoutElement;
