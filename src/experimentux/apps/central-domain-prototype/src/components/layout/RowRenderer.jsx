/**
 * RowRenderer Component
 * Renders a row within a zone using 12-column grid system
 * Reference: records-prototype RowRenderer.jsx
 */

import React from 'react';
import PropTypes from 'prop-types';
import { ColumnRenderer } from './ColumnRenderer';

export const RowRenderer = ({ row, rowIndex, zoneId, onUpdate, isEditMode = false }) => {
  // Handle column updates
  const handleColumnUpdate = (columnId, updates) => {
    if (onUpdate) {
      onUpdate(row.id, {
        columns: row.columns.map(col =>
          col.id === columnId ? { ...col, ...updates } : col
        )
      });
    }
  };

  return (
    <div
      className="zone-row grid grid-cols-12 gap-4 mb-4 last:mb-0"
      data-row-id={row.id}
      data-row-index={rowIndex}
    >
      {row.columns && row.columns.length > 0 ? (
        row.columns.map((column, columnIndex) => (
          <ColumnRenderer
            key={column.id || `column-${columnIndex}`}
            column={column}
            columnIndex={columnIndex}
            zoneId={zoneId}
            rowIndex={rowIndex}
            onUpdate={handleColumnUpdate}
            isEditMode={isEditMode}
          />
        ))
      ) : (
        // Empty state - shown when row has no columns
        <div className="col-span-12 p-4 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400">
          <div className="text-sm">Empty row</div>
          <div className="text-xs mt-1">Add columns to this row</div>
        </div>
      )}
    </div>
  );
};

RowRenderer.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      span: PropTypes.number.isRequired,
      elements: PropTypes.array
    }))
  }).isRequired,
  rowIndex: PropTypes.number.isRequired,
  zoneId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
  isEditMode: PropTypes.bool
};

export default RowRenderer;
