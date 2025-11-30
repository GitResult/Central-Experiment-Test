import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

/**
 * PageDragDropContext
 *
 * Provides drag-and-drop functionality for the UniversalPage system.
 * Handles:
 * - Element insertion from ComponentPanel
 * - Element reordering within columns
 * - Visual drag overlay
 *
 * @param {ReactNode} children - Child components
 * @param {Function} onElementInsert - Callback when element is dropped (zoneId, rowId, columnId, elementType, insertIndex)
 * @param {Function} onElementReorder - Callback when element is reordered (zoneId, rowId, columnId, oldIndex, newIndex)
 */
export const PageDragDropContext = ({ children, onElementInsert, onElementReorder }) => {
  const [activeId, setActiveId] = useState(null);
  const [activeType, setActiveType] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);

    // Check if dragging from component panel or reordering existing element
    if (active.data.current?.type === 'component-panel-item') {
      setActiveType(active.data.current.elementType);
    } else if (active.data.current?.type === 'existing-element') {
      setActiveType(active.data.current.elementType);
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      setActiveType(null);
      return;
    }

    const activeData = active.data.current;
    const overData = over.data.current;

    // Case 1: Inserting new element from component panel
    if (activeData?.type === 'component-panel-item' && overData?.type === 'droppable-column') {
      if (onElementInsert) {
        onElementInsert(
          overData.zoneId,
          overData.rowId,
          overData.columnId,
          activeData.elementType,
          overData.insertIndex || 0
        );
      }
    }
    // Case 2: Reordering existing elements within a column
    else if (activeData?.type === 'existing-element' && overData?.type === 'existing-element') {
      // Check if both elements are in the same column
      if (
        activeData.zoneId === overData.zoneId &&
        activeData.rowId === overData.rowId &&
        activeData.columnId === overData.columnId
      ) {
        const oldIndex = activeData.index;
        const newIndex = overData.index;

        if (oldIndex !== newIndex && onElementReorder) {
          onElementReorder(
            activeData.zoneId,
            activeData.rowId,
            activeData.columnId,
            oldIndex,
            newIndex
          );
        }
      }
    }

    setActiveId(null);
    setActiveType(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveType(null);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      {children}
      <DragOverlay dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}>
        {activeId && activeType ? (
          <div className="bg-white shadow-lg border-2 border-blue-500 rounded-lg p-3 cursor-grabbing opacity-90">
            <div className="text-sm font-medium text-gray-900 capitalize">
              {activeType.replace(/-/g, ' ')}
            </div>
            <div className="text-xs text-gray-500 mt-1">Drop to insert</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

PageDragDropContext.propTypes = {
  children: PropTypes.node.isRequired,
  onElementInsert: PropTypes.func,
  onElementReorder: PropTypes.func
};

export default PageDragDropContext;
