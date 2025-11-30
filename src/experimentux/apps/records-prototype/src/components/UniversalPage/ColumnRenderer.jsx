import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import ElementRenderer from './ElementRenderer';
import EmptyElementSlot from '../shared/EmptyElementSlot';

/**
 * SortableElement - Wrapper for sortable elements
 */
const SortableElement = ({ element, index, zoneId, rowId, columnId, onUpdate }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: element.id,
    data: {
      type: 'existing-element',
      elementType: element.type,
      zoneId,
      rowId,
      columnId,
      index
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div ref={setNodeRef} style={style} className="mb-4 last:mb-0 group relative">
      {/* Drag handle - only visible on hover in edit mode */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      >
        <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 3h2v2H9V3zm0 4h2v2H9V7zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm0 4h2v2H9v-2zm4-16h2v2h-2V3zm0 4h2v2h-2V7zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2zm0 4h2v2h-2v-2z" />
        </svg>
      </div>
      <ElementRenderer
        element={element}
        onUpdate={(elementId, updates) => onUpdate(elementId, updates)}
      />
    </div>
  );
};

SortableElement.propTypes = {
  element: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  zoneId: PropTypes.string.isRequired,
  rowId: PropTypes.string.isRequired,
  columnId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func
};

/**
 * ColumnRenderer Component
 *
 * Renders a column within a row, containing one or more elements.
 * Uses Tailwind's grid system for responsive layouts.
 * Supports drag-and-drop for element insertion and reordering.
 *
 * @param {Object} column - Column configuration
 * @param {string} zoneId - Parent zone ID
 * @param {string} rowId - Parent row ID
 * @param {Function} onUpdate - Callback for updates
 */
const ColumnRenderer = React.memo(({ column, zoneId, rowId, onUpdate }) => {
  // Determine column span class (Tailwind grid)
  const spanClass = `col-span-${Math.min(12, Math.max(1, column.span || 12))}`;

  // Handle element updates
  const handleElementUpdate = (elementId, updates) => {
    if (onUpdate) {
      onUpdate(column.id, {
        elements: column.elements.map(el =>
          el.id === elementId
            ? { ...el, ...updates }
            : el
        )
      });
    }
  };

  // Handle inserting new elements
  const handleInsertElement = (newElement) => {
    if (onUpdate) {
      onUpdate(column.id, {
        elements: [...(column.elements || []), newElement]
      });
    }
  };

  // Set up droppable zone for this column
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${column.id}`,
    data: {
      type: 'droppable-column',
      zoneId,
      rowId,
      columnId: column.id,
      insertIndex: column.elements?.length || 0
    }
  });

  // Get element IDs for sortable context
  const elementIds = (column.elements || []).map(el => el.id);

  return (
    <div
      ref={setNodeRef}
      className={`zone-column ${spanClass} ${isOver ? 'ring-2 ring-blue-400 ring-inset' : ''} min-h-[100px] transition-all`}
      data-column-id={column.id}
    >
      {column.elements && column.elements.length > 0 ? (
        <SortableContext items={elementIds} strategy={verticalListSortingStrategy}>
          {column.elements.map((element, index) => (
            <SortableElement
              key={element.id}
              element={element}
              index={index}
              zoneId={zoneId}
              rowId={rowId}
              columnId={column.id}
              onUpdate={handleElementUpdate}
            />
          ))}
        </SortableContext>
      ) : (
        // Empty state with slash command support
        <EmptyElementSlot
          onInsertElement={handleInsertElement}
          placeholder="Type '/' for commands or press Enter to add text..."
          showSlashHint={true}
        />
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Memoization: only re-render if column data changed
  return (
    prevProps.column.id === nextProps.column.id &&
    prevProps.zoneId === nextProps.zoneId &&
    prevProps.rowId === nextProps.rowId &&
    JSON.stringify(prevProps.column.elements) === JSON.stringify(nextProps.column.elements) &&
    prevProps.column.span === nextProps.column.span
  );
});

ColumnRenderer.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    span: PropTypes.number.isRequired,
    elements: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      settings: PropTypes.object,
      data: PropTypes.any
    }))
  }).isRequired,
  zoneId: PropTypes.string.isRequired,
  rowId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func
};

ColumnRenderer.displayName = 'ColumnRenderer';

export default ColumnRenderer;
