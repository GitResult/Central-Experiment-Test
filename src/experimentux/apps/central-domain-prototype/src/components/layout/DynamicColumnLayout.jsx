/**
 * DynamicColumnLayout Component
 * Renders columns dynamically based on page settings
 */

import React, { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../store/editorStore';
import { useShallow } from 'zustand/shallow';
import { EditableElement } from '../editor/EditableElement';
import { useDroppable } from '@dnd-kit/core';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';

// Enhanced drop indicator with progressive highlighting and animations
function DropIndicator({ zoneId, rowIndex, columnIndex, elementIndex, pageKey }) {
  const mode = useEditorStore((state) => state.mode);
  const isDragging = useEditorStore((state) => state.isDragging);
  const canvasZoom = useEditorStore((state) => state.canvasZoom);
  const isEditMode = mode === 'edit';

  const { setNodeRef, isOver, active } = useDroppable({
    id: `drop-${zoneId}-${rowIndex}-${columnIndex}-${elementIndex}`,
    data: {
      zoneId,
      rowIndex,
      columnIndex,
      elementIndex,
      pageKey
    },
    disabled: !isEditMode
  });

  // Show expanded drop zone when dragging
  const showExpanded = isDragging && isEditMode;

  // Scale drop zone size inversely to zoom for easier targeting when zoomed out
  // At 75% zoom, multiply sizes by ~1.33 to maintain usability
  const zoomCompensation = canvasZoom < 1 ? 1 / canvasZoom : 1;
  const baseExpandedHeight = 32 * zoomCompensation;
  const baseOverHeight = 60 * zoomCompensation;
  const baseNormalHeight = 8;

  return (
    <motion.div
      ref={setNodeRef}
      initial={false}
      animate={{
        height: isOver ? baseOverHeight : (showExpanded ? baseExpandedHeight : (isEditMode ? baseNormalHeight : 0)),
        opacity: isOver ? 1 : (showExpanded ? 0.8 : (isEditMode ? 0.4 : 0)),
        scale: isOver ? 1.02 : 1
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 30
      }}
      style={{
        margin: isEditMode ? '4px 0' : '0',
        padding: isOver ? '8px' : '4px',
        borderRadius: '8px',
        border: isOver
          ? '2px solid #3b82f6'
          : (showExpanded ? '2px dashed #94a3b8' : (isEditMode ? '1px dashed #cbd5e1' : 'none')),
        backgroundColor: isOver
          ? 'rgba(59, 130, 246, 0.12)'
          : (showExpanded ? 'rgba(148, 163, 184, 0.08)' : 'transparent'),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: isOver ? '0 0 20px rgba(59, 130, 246, 0.2)' : 'none'
      }}
    >
      <AnimatePresence>
        {isOver && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {/* Animated pulse indicator */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#3b82f6'
              }}
            />
            <span style={{
              fontSize: '12px',
              color: '#3b82f6',
              fontWeight: 600,
              fontFamily: theme.typography.fontFamily.sans
            }}>
              Drop here
            </span>
          </motion.div>
        )}
        {showExpanded && !isOver && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            style={{
              fontSize: '10px',
              color: '#94a3b8',
              fontWeight: 500,
              fontFamily: theme.typography.fontFamily.sans
            }}
          >
            ···
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

DropIndicator.propTypes = {
  zoneId: PropTypes.string.isRequired,
  rowIndex: PropTypes.number.isRequired,
  columnIndex: PropTypes.number.isRequired,
  elementIndex: PropTypes.number.isRequired,
  pageKey: PropTypes.string.isRequired
};

const DropIndicatorMemo = memo(DropIndicator);

/**
 * DynamicColumnLayout renders columns dynamically based on store configuration
 */
export function DynamicColumnLayout({
  zoneId,
  rowIndex = 0,
  pageKey,
  columnGap = 24,
  elementsVerticalGap = 16,
  containerStyle = {},
  columnStyle = {}
}) {
  // Use useShallow to ensure proper shallow comparison of the selected state
  const { pages, pagesVersion, isAdjustingColumns, columnDragWidths } = useEditorStore(
    useShallow((state) => ({
      pages: state.pages,
      pagesVersion: state.pagesVersion,
      isAdjustingColumns: state.isAdjustingColumns,
      columnDragWidths: state.columnDragWidths
    }))
  );

  const page = pages[pageKey];
  const [containerWidth, setContainerWidth] = React.useState(0);
  const containerRef = React.useRef(null);

  // Get the zone and row - dereference fully to avoid stale closures
  const zone = page?.zones?.find(z => z.id === zoneId);
  const row = zone?.rows?.[rowIndex];
  const columns = row?.columns || [];

  // Measure container width for pixel calculations
  React.useEffect(() => {
    if (containerRef.current) {
      const updateWidth = () => {
        setContainerWidth(containerRef.current.offsetWidth);
      };
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }
  }, []);

  // If no columns, return null
  if (columns.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{
        display: 'flex',
        gap: `${columnGap}px`,
        width: '100%',
        ...containerStyle
      }}
    >
      {columns.map((column, columnIndex) => {
        const elements = column.elements || [];
        const baseWidth = column.width || (100 / columns.length);

        // Use drag widths during adjustment for real-time updates
        const displayWidth = isAdjustingColumns && columnDragWidths && columnDragWidths[columnIndex] !== undefined
          ? columnDragWidths[columnIndex]
          : baseWidth;

        // Calculate pixel width for overlay
        const pixelWidth = containerWidth > 0
          ? Math.round((containerWidth * displayWidth) / 100)
          : 0;

        return (
          <div
            key={`column-${columnIndex}`}
            style={{
              flex: `0 0 ${displayWidth}%`,
              minWidth: 0,
              position: 'relative',
              ...columnStyle
            }}
          >
            {/* Overlay when adjusting columns */}
            {isAdjustingColumns && columnDragWidths && columnDragWidths[columnIndex] !== undefined && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(92, 124, 250, 0.04)',
                  border: `1px solid ${theme.colors.primary[200]}`,
                  borderRadius: theme.borderRadius.lg,
                  pointerEvents: 'none',
                  zIndex: 1000,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  paddingTop: theme.spacing[6]
                }}
              >
                {/* Floating label */}
                <div
                  style={{
                    position: 'sticky',
                    top: theme.spacing[6],
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                    borderRadius: theme.borderRadius.lg,
                    boxShadow: theme.shadows.elevated,
                    border: `1px solid ${theme.colors.border.medium}`,
                    fontSize: '14px',
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    fontFamily: theme.typography.fontFamily.sans,
                    whiteSpace: 'nowrap'
                  }}
                >
                  Column {columnIndex + 1}: {Math.round(columnDragWidths[columnIndex])}% ({pixelWidth}px)
                </div>
              </div>
            )}

            {/* Drop indicator before first element */}
            <DropIndicatorMemo
              zoneId={zoneId}
              rowIndex={rowIndex}
              columnIndex={columnIndex}
              elementIndex={0}
              pageKey={pageKey}
            />

            {/* Render all elements with drop indicators between them */}
            {/* Using AnimatePresence and motion.div for FLIP-like animations */}
            <AnimatePresence mode="popLayout">
              {elements.flatMap((element, idx) => {
                // Generate a stable key based on element identity (not position)
                // Priority: element.id > content hash > fallback with type
                const elementKey = element.id ||
                  `${element.type}-${JSON.stringify(element.data?.content || element.data || '').slice(0, 100)}`;
                return [
                  <motion.div
                    key={elementKey}
                    layout
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -20 }}
                    transition={{
                      layout: {
                        type: 'spring',
                        stiffness: 350,
                        damping: 30
                      },
                      opacity: { duration: 0.2 },
                      scale: { duration: 0.2 }
                    }}
                  >
                    <EditableElement
                      element={element}
                      path={{
                        zoneId,
                        rowIndex,
                        columnIndex,
                        elementIndex: idx
                      }}
                      pageKey={pageKey}
                      verticalGap={elementsVerticalGap}
                    />
                  </motion.div>,
                  <DropIndicatorMemo
                    key={`drop-after-${elementKey}`}
                    zoneId={zoneId}
                    rowIndex={rowIndex}
                    columnIndex={columnIndex}
                    elementIndex={idx + 1}
                    pageKey={pageKey}
                  />
                ];
              })}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

DynamicColumnLayout.propTypes = {
  zoneId: PropTypes.string.isRequired,
  rowIndex: PropTypes.number,
  pageKey: PropTypes.string.isRequired,
  columnGap: PropTypes.number,
  elementsVerticalGap: PropTypes.number,
  containerStyle: PropTypes.object,
  columnStyle: PropTypes.object
};
