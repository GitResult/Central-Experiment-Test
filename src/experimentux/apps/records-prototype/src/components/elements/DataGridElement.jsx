import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * DataGridElement
 *
 * Interactive data table with sorting, filtering, and CSV export.
 * Supports inline editing of cell values.
 */
const DataGridElement = ({ data, settings, onUpdate }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [editingCell, setEditingCell] = useState(null);

  const columns = data.columns || [];
  const rows = data.rows || [];

  const handleSort = (columnId) => {
    if (sortColumn === columnId) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  const sortedRows = React.useMemo(() => {
    if (!sortColumn) return rows;

    return [...rows].sort((a, b) => {
      const aVal = a[sortColumn] || '';
      const bVal = b[sortColumn] || '';

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
  }, [rows, sortColumn, sortDirection]);

  const handleCellEdit = (rowIndex, columnId, value) => {
    const newRows = [...rows];
    newRows[rowIndex] = { ...newRows[rowIndex], [columnId]: value };
    onUpdate({ ...data, rows: newRows });
    setEditingCell(null);
  };

  const handleAddRow = () => {
    const newRow = {};
    columns.forEach(col => {
      newRow[col.id] = '';
    });
    onUpdate({ ...data, rows: [...rows, newRow] });
  };

  const handleDeleteRow = (rowIndex) => {
    const newRows = rows.filter((_, i) => i !== rowIndex);
    onUpdate({ ...data, rows: newRows });
  };

  const exportToCSV = () => {
    const csvContent = [
      columns.map(col => col.name).join(','),
      ...rows.map(row =>
        columns.map(col => `"${row[col.id] || ''}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data-export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (columns.length === 0) {
    return (
      <div className="data-grid-empty p-8 border-2 border-dashed border-gray-300 rounded-lg text-center">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <p className="mt-2 text-sm text-gray-500">
          No data grid configured. Add columns and rows to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="data-grid-element">
      {/* Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {rows.length} {rows.length === 1 ? 'row' : 'rows'}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddRow}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            + Add Row
          </button>
          <button
            onClick={exportToCSV}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.id}
                  onClick={() => handleSort(column.id)}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                >
                  <div className="flex items-center gap-2">
                    {column.name}
                    {sortColumn === column.id && (
                      <span className="text-gray-400">
                        {sortDirection === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50">
                {columns.map((column) => {
                  const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.columnId === column.id;

                  return (
                    <td
                      key={column.id}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      onDoubleClick={() => setEditingCell({ rowIndex, columnId: column.id })}
                    >
                      {isEditing ? (
                        <input
                          type="text"
                          defaultValue={row[column.id] || ''}
                          autoFocus
                          onBlur={(e) => handleCellEdit(rowIndex, column.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleCellEdit(rowIndex, column.id, e.target.value);
                            } else if (e.key === 'Escape') {
                              setEditingCell(null);
                            }
                          }}
                          className="w-full px-2 py-1 border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <span className="cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
                          {row[column.id] || '-'}
                        </span>
                      )}
                    </td>
                  );
                })}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows.length === 0 && (
        <div className="text-center py-8 text-gray-500 text-sm">
          No rows yet. Click "Add Row" to get started.
        </div>
      )}
    </div>
  );
};

DataGridElement.propTypes = {
  data: PropTypes.shape({
    columns: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string
      })
    ),
    rows: PropTypes.arrayOf(PropTypes.object)
  }),
  settings: PropTypes.object,
  onUpdate: PropTypes.func.isRequired
};

DataGridElement.defaultProps = {
  data: {
    columns: [],
    rows: []
  },
  settings: {}
};

export default DataGridElement;
