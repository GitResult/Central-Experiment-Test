/**
 * ColumnRenderer Component
 * Renders a column within a row using span system (1-12)
 * Supports drag-and-drop element reordering
 * Reference: records-prototype ColumnRenderer.jsx
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { ElementWrapper } from '../editor/ElementWrapper';
import { MarkupElement } from '../elements/markup/MarkupElement';
import { FieldElement } from '../elements/field/FieldElement';
import { RecordElement } from '../elements/record/RecordElement';
import { StructureElement } from '../elements/structure/StructureElement';

export const ColumnRenderer = ({ column, columnIndex, zoneId, rowIndex, onUpdate, isEditMode = false }) => {
  // Determine column span class (Tailwind grid, 1-12 columns)
  const span = Math.min(12, Math.max(1, column.span || 12));
  const spanClass = `col-span-${span}`;

  // Create droppable for this column
  const { setNodeRef, isOver } = useDroppable({
    id: `column-${zoneId}-${rowIndex}-${columnIndex}`,
    data: { zoneId, rowIndex, columnIndex }
  });

  // Generate sortable IDs for elements in this column
  const sortableIds = column.elements?.map((el, idx) =>
    `${zoneId}-${rowIndex}-${columnIndex}-${idx}`
  ) || [];

  // Render element based on type
  const renderElement = (element, elementIndex) => {
    const elementPath = { zoneId, rowIndex, columnIndex, elementIndex };
    const commonProps = {
      data: element.data || {},
      settings: element.settings || {}
    };

    let elementComponent;
    switch (element.type) {
      case 'markup':
        elementComponent = <MarkupElement {...commonProps} />;
        break;
      case 'field':
        elementComponent = <FieldElement {...commonProps} />;
        break;
      case 'record':
        elementComponent = <RecordElement {...commonProps} />;
        break;
      case 'structure':
        elementComponent = (
          <StructureElement
            {...commonProps}
            elements={element.elements}
            renderElement={(el, idx) => renderElement(el, idx)}
          />
        );
        break;
      default:
        elementComponent = <div>Unknown element type: {element.type}</div>;
    }

    // Wrap with ElementWrapper if in edit mode
    if (isEditMode) {
      return (
        <ElementWrapper key={element.id || `element-${elementIndex}`} elementPath={elementPath}>
          {elementComponent}
        </ElementWrapper>
      );
    }

    return <div key={element.id || `element-${elementIndex}`}>{elementComponent}</div>;
  };

  const dropZoneStyle = {
    borderColor: isOver ? '#3B82F6' : '#E5E7EB',
    backgroundColor: isOver ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
    minHeight: column.elements?.length > 0 ? 'auto' : '120px'
  };

  return (
    <div
      ref={setNodeRef}
      className={`zone-column ${spanClass}`}
      data-column-id={column.id}
      data-column-index={columnIndex}
      data-span={span}
      style={dropZoneStyle}
    >
      {column.elements && column.elements.length > 0 ? (
        isEditMode ? (
          <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {column.elements.map((element, elementIndex) =>
                renderElement(element, elementIndex)
              )}
            </div>
          </SortableContext>
        ) : (
          <div className="space-y-4">
            {column.elements.map((element, elementIndex) =>
              renderElement(element, elementIndex)
            )}
          </div>
        )
      ) : (
        // Empty state with drop zone indicator
        isEditMode && (
          <div className="p-8 border-2 border-dashed rounded-lg text-center text-gray-400 transition-all">
            <div className="text-sm">Drop elements here</div>
          </div>
        )
      )}
    </div>
  );
};

ColumnRenderer.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    span: PropTypes.number.isRequired,
    elements: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      type: PropTypes.string.isRequired,
      settings: PropTypes.object,
      data: PropTypes.any
    }))
  }).isRequired,
  columnIndex: PropTypes.number.isRequired,
  zoneId: PropTypes.string.isRequired,
  rowIndex: PropTypes.number.isRequired,
  onUpdate: PropTypes.func,
  isEditMode: PropTypes.bool
};

export default ColumnRenderer;
