/**
 * RecordDataGrid Component
 * Sortable and filterable data table for structured records
 * Type: record - data-grid
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '../../theme/ThemeProvider';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';

export const RecordDataGrid = ({ data, settings }) => {
  const { resolveAllTokens, theme } = useTheme();

  // Safety check for theme
  if (!theme) {
    return <div>Loading...</div>;
  }

  const resolvedSettings = resolveAllTokens(settings);

  // Extract settings
  const gridSettings = resolvedSettings?.record || {};
  const {
    columns = [],
    sortable = true,
    striped = true,
    compact = false,
    hoverable = true,
    bordered = true,
    stickyHeader = false,
    emptyMessage = 'No data available'
  } = gridSettings;

  // Extract data - expect array of row objects
  const rows = Array.isArray(data) ? data : [];

  // Sorting state
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  // Sort data
  const sortedRows = useMemo(() => {
    if (!sortConfig.key || !sortable) {
      return rows;
    }

    const sorted = [...rows].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Handle null/undefined
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle strings
      const aString = String(aValue).toLowerCase();
      const bString = String(bValue).toLowerCase();

      if (aString < bString) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aString > bString) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [rows, sortConfig, sortable]);

  // Handle sort
  const handleSort = (columnKey) => {
    if (!sortable) return;

    setSortConfig((prevConfig) => {
      if (prevConfig.key === columnKey) {
        // Cycle through: asc -> desc -> none
        if (prevConfig.direction === 'asc') {
          return { key: columnKey, direction: 'desc' };
        } else if (prevConfig.direction === 'desc') {
          return { key: null, direction: null };
        }
      }
      return { key: columnKey, direction: 'asc' };
    });
  };

  // Render sort icon
  const renderSortIcon = (columnKey) => {
    if (!sortable) return null;

    const iconSize = 14;
    const iconColor = theme.colors.text.tertiary;

    if (sortConfig.key === columnKey) {
      return sortConfig.direction === 'asc' ? (
        <ArrowUp size={iconSize} style={{ color: theme.colors.primary[500] }} />
      ) : (
        <ArrowDown size={iconSize} style={{ color: theme.colors.primary[500] }} />
      );
    }

    return <ArrowUpDown size={iconSize} style={{ color: iconColor, opacity: 0.3 }} />;
  };

  // Render cell content based on column type
  const renderCell = (row, column) => {
    const value = row[column.key];

    // Handle custom render function
    if (column.render) {
      return column.render(value, row);
    }

    // Handle status/badge type
    if (column.type === 'badge' || column.type === 'status') {
      const badgeColor = row[`${column.key}Color`] || theme.colors.neutral[500];
      return (
        <span
          style={{
            display: 'inline-block',
            padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            borderRadius: theme.borderRadius.sm,
            background: `${badgeColor}15`,
            color: badgeColor
          }}
        >
          {value}
        </span>
      );
    }

    // Handle number type
    if (column.type === 'number') {
      return (
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
      );
    }

    // Handle date type
    if (column.type === 'date' && value) {
      const date = new Date(value);
      return date.toLocaleDateString();
    }

    // Default text
    return value ?? '—';
  };

  if (!rows.length) {
    return (
      <div
        style={{
          padding: theme.spacing[8],
          textAlign: 'center',
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm,
          background: theme.colors.background.secondary,
          borderRadius: theme.borderRadius.lg,
          border: bordered ? `1px solid ${theme.colors.border.default}` : 'none'
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: compact ? theme.typography.fontSize.sm : theme.typography.fontSize.base,
    background: theme.colors.background.primary,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden'
  };

  const containerStyle = {
    width: '100%',
    overflowX: 'auto',
    border: bordered ? `1px solid ${theme.colors.border.default}` : 'none',
    borderRadius: theme.borderRadius.lg
  };

  return (
    <div style={containerStyle}>
      <table style={tableStyle}>
        <thead
          style={{
            background: theme.colors.background.secondary,
            position: stickyHeader ? 'sticky' : 'static',
            top: 0,
            zIndex: 10
          }}
        >
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable !== false && handleSort(column.key)}
                style={{
                  padding: compact ? theme.spacing[2] : theme.spacing[3],
                  textAlign: column.align || 'left',
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.semibold,
                  color: theme.colors.text.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: theme.typography.letterSpacing.wide,
                  borderBottom: `2px solid ${theme.colors.border.default}`,
                  cursor: sortable && column.sortable !== false ? 'pointer' : 'default',
                  userSelect: 'none',
                  whiteSpace: 'nowrap'
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent:
                      column.align === 'center'
                        ? 'center'
                        : column.align === 'right'
                        ? 'flex-end'
                        : 'flex-start',
                    gap: theme.spacing[2]
                  }}
                >
                  {column.label || column.key}
                  {column.sortable !== false && renderSortIcon(column.key)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedRows.map((row, rowIndex) => (
            <motion.tr
              key={row.id || rowIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: rowIndex * 0.02 }}
              style={{
                background:
                  striped && rowIndex % 2 === 1
                    ? theme.colors.background.secondary
                    : theme.colors.background.primary,
                cursor: row.onClick ? 'pointer' : 'default',
                transition: theme.transitions.base
              }}
              whileHover={
                hoverable && row.onClick
                  ? { backgroundColor: theme.colors.background.tertiary }
                  : {}
              }
              onClick={row.onClick}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    padding: compact ? theme.spacing[2] : theme.spacing[3],
                    textAlign: column.align || 'left',
                    color: theme.colors.text.primary,
                    borderBottom: `1px solid ${theme.colors.border.light}`,
                    verticalAlign: 'middle'
                  }}
                >
                  {renderCell(row, column)}
                </td>
              ))}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

RecordDataGrid.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  settings: PropTypes.shape({
    record: PropTypes.shape({
      columns: PropTypes.arrayOf(
        PropTypes.shape({
          key: PropTypes.string.isRequired,
          label: PropTypes.string,
          type: PropTypes.oneOf(['text', 'number', 'date', 'badge', 'status']),
          align: PropTypes.oneOf(['left', 'center', 'right']),
          sortable: PropTypes.bool,
          render: PropTypes.func
        })
      ),
      sortable: PropTypes.bool,
      striped: PropTypes.bool,
      compact: PropTypes.bool,
      hoverable: PropTypes.bool,
      bordered: PropTypes.bool,
      stickyHeader: PropTypes.bool,
      emptyMessage: PropTypes.string
    })
  })
};

export default RecordDataGrid;
