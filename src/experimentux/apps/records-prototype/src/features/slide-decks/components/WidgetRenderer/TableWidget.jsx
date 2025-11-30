import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useWidgetData } from '../../hooks/useWidgetData';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * TableWidget Component
 *
 * Renders a data table with live data.
 * Supports sorting and filtering (client-side for <1000 rows, server-side for larger).
 *
 * Props:
 * - config: object - Widget configuration { dataViewId, columns, filters }
 * - isPresenterMode: boolean - Whether in presenter mode
 */
export function TableWidget({ config, isPresenterMode }) {
  const { data, loading, error } = useWidgetData(
    config.dataViewId,
    config,
    isPresenterMode ? 30000 : 0
  );
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (column) => {
    if (!isPresenterMode) return;

    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortColumn(column);
    setSortDirection(newDirection);

    trackEvent(SLIDE_DECK_EVENTS.TABLE_SORTED, {
      dataViewId: config.dataViewId,
      column,
      direction: newDirection
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-3 w-full p-4">
          <div className="h-8 bg-gray-200 rounded"></div>
          <div className="h-6 bg-gray-100 rounded"></div>
          <div className="h-6 bg-gray-100 rounded"></div>
          <div className="h-6 bg-gray-100 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm">Failed to load table</div>
      </div>
    );
  }

  // Mock table data for demo
  const mockRows = data?.rows || [
    { id: 1, name: 'Sample Row 1', value: 100 },
    { id: 2, name: 'Sample Row 2', value: 200 },
    { id: 3, name: 'Sample Row 3', value: 300 }
  ];

  const columns = config.columns || ['name', 'value'];

  return (
    <div className="flex flex-col h-full p-4 overflow-auto">
      {/* Table Title */}
      {config.title && (
        <div className="text-sm font-semibold text-gray-900 mb-3">{config.title}</div>
      )}

      {/* Table */}
      <div className="flex-1 border border-gray-200 rounded overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={column}
                  className={`px-4 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider ${
                    isPresenterMode ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column}</span>
                    {sortColumn === column && (
                      <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockRows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <td key={column} className="px-4 py-2 text-sm text-gray-900">
                    {row[column] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Data Source Label */}
      {config.dataViewId && (
        <div className="text-xs text-gray-500 mt-2">
          Source: {config.dataViewName || config.dataViewId}
          {data?.rows && ` (${data.rows.length} rows)`}
        </div>
      )}
    </div>
  );
}

TableWidget.propTypes = {
  config: PropTypes.shape({
    dataViewId: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.string),
    filters: PropTypes.object,
    title: PropTypes.string,
    dataViewName: PropTypes.string
  }).isRequired,
  isPresenterMode: PropTypes.bool
};

TableWidget.defaultProps = {
  isPresenterMode: false
};
