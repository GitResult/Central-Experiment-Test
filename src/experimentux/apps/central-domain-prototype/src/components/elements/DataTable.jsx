/**
 * DataTable Element
 * Professional data table with sorting and styling
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { theme } from '../../config/theme';

export function DataTable({ data, settings }) {
  const { columns = [], rows = [] } = data;
  const { sortable = false, striped = false, hover = true, compact = false } = settings.table || {};

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (columnId) => {
    if (!sortable) return;

    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const sortedRows = sortable && sortColumn
    ? [...rows].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        const direction = sortDirection === 'asc' ? 1 : -1;
        return aVal > bVal ? direction : -direction;
      })
    : rows;

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: theme.typography.fontSize.base,
    backgroundColor: theme.colors.background.primary
  };

  const thStyle = (columnId) => ({
    padding: compact ? theme.spacing[2] : theme.spacing[4],
    textAlign: 'left',
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    borderBottom: `2px solid ${theme.colors.border.default}`,
    backgroundColor: theme.colors.background.secondary,
    cursor: sortable ? 'pointer' : 'default',
    userSelect: 'none',
    transition: `all ${theme.transitions.fast}`,
    ':hover': {
      backgroundColor: sortable ? theme.colors.interactive.hover : undefined
    }
  });

  const tdStyle = {
    padding: compact ? theme.spacing[2] : theme.spacing[4],
    borderBottom: `1px solid ${theme.colors.border.default}`,
    color: theme.colors.text.primary
  };

  const rowStyle = (index) => ({
    backgroundColor: striped && index % 2 === 1 ? theme.colors.background.secondary : 'transparent',
    transition: `background-color ${theme.transitions.fast}`,
    ':hover': {
      backgroundColor: hover ? theme.colors.interactive.hover : undefined
    }
  });

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                style={thStyle(column.id)}
                onClick={() => handleSort(column.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
                  <span>{column.label}</span>
                  {sortable && sortColumn === column.id && (
                    sortDirection === 'asc'
                      ? <ChevronUp size={14} strokeWidth={2.5} />
                      : <ChevronDown size={14} strokeWidth={2.5} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <tr key={rowIndex} style={rowStyle(rowIndex)}>
              {columns.map((column) => (
                <td key={column.id} style={tdStyle}>
                  {row[column.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

DataTable.propTypes = {
  data: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object).isRequired
  }).isRequired,
  settings: PropTypes.shape({
    table: PropTypes.shape({
      sortable: PropTypes.bool,
      striped: PropTypes.bool,
      hover: PropTypes.bool,
      compact: PropTypes.bool
    })
  }).isRequired
};
