import React from 'react';
import PropTypes from 'prop-types';
import ColumnRenderer from './ColumnRenderer';

/**
 * RowRenderer Component
 *
 * Renders a row within a zone, containing one or more columns.
 * Uses Tailwind's 12-column grid system.
 *
 * @param {Object} row - Row configuration
 * @param {string} zoneId - Parent zone ID
 * @param {Function} onUpdate - Callback for updates
 */
const RowRenderer = React.memo(({ row, zoneId, onUpdate }) => {
  // Handle column updates
  const handleColumnUpdate = (columnId, updates) => {
    if (onUpdate) {
      onUpdate(row.id, {
        columns: row.columns.map(col =>
          col.id === columnId
            ? { ...col, ...updates }
            : col
        )
      });
    }
  };

  return (
    <div
      className="zone-row grid grid-cols-12 gap-4 mb-4 last:mb-0"
      data-row-id={row.id}
    >
      {row.columns && row.columns.length > 0 ? (
        row.columns.map((column) => (
          <ColumnRenderer
            key={column.id}
            column={column}
            zoneId={zoneId}
            rowId={row.id}
            onUpdate={handleColumnUpdate}
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
}, (prevProps, nextProps) => {
  // Memoization: only re-render if row data changed
  return (
    prevProps.row.id === nextProps.row.id &&
    prevProps.zoneId === nextProps.zoneId &&
    JSON.stringify(prevProps.row.columns) === JSON.stringify(nextProps.row.columns)
  );
});

RowRenderer.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      span: PropTypes.number.isRequired,
      elements: PropTypes.array
    }))
  }).isRequired,
  zoneId: PropTypes.string.isRequired,
  onUpdate: PropTypes.func
};

RowRenderer.displayName = 'RowRenderer';

export default RowRenderer;
