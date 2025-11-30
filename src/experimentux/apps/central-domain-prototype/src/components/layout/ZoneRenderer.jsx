/**
 * ZoneRenderer Component
 * Renders a zone with configured width, padding, background, and rows
 * Supports full zone configuration from approved architecture
 * Reference: ELEMENT_SETTINGS_ARCHITECTURE.md & records-prototype ZoneRenderer
 */

import React from 'react';
import PropTypes from 'prop-types';
import { RowRenderer } from './RowRenderer';
import { useTheme } from '../theme/ThemeProvider';

/**
 * Get container width based on context
 * @param {string} width - Container width setting
 * @param {string} context - Container context ('page' or 'frame')
 * @returns {string} CSS width value
 */
const getContainerWidth = (width, context) => {
  if (context === 'frame') {
    const frameWidths = {
      'full': '100%',
      'wide': '90%',
      'standard': '80%',
      'narrow': '60%',
      'notion': '75%'
    };
    return frameWidths[width] || '80%';
  } else {
    const pageWidths = {
      'full': '100vw',
      'wide': '1200px',
      'standard': '900px',
      'narrow': '600px',
      'notion': '700px'
    };
    return pageWidths[width] || '900px';
  }
};

export const ZoneRenderer = ({ zone, containerContext = 'page', onUpdate, isEditMode = false }) => {
  const { resolveToken } = useTheme();

  // Don't render if zone is not visible
  if (!zone.visible) {
    return null;
  }

  // Calculate container width based on context
  const containerWidth = getContainerWidth(zone.containerWidth, containerContext);

  // Calculate padding (multiplied by 4px for Tailwind compatibility if numeric)
  const paddingX = zone.padding?.x ? (typeof zone.padding.x === 'number' ? zone.padding.x * 4 : resolveToken(zone.padding.x)) : 0;
  const paddingY = zone.padding?.y ? (typeof zone.padding.y === 'number' ? zone.padding.y * 4 : resolveToken(zone.padding.y)) : 0;

  // Resolve background color
  const backgroundColor = zone.background ? resolveToken(zone.background) : 'transparent';

  // Handle row updates
  const handleRowUpdate = (rowId, updates) => {
    if (onUpdate) {
      onUpdate(zone.id, {
        rows: zone.rows.map(row =>
          row.id === rowId ? { ...row, ...updates } : row
        )
      });
    }
  };

  const zoneStyle = {
    width: containerWidth,
    margin: '0 auto',
    padding: `${paddingY}px ${paddingX}px`,
    background: backgroundColor,
    border: zone.border ? `1px solid ${resolveToken('{{theme.colors.border.default}}')}` : 'none',
    borderRadius: zone.border ? resolveToken('{{theme.borderRadius.lg}}') : '0'
  };

  return (
    <div
      className={`zone zone-${zone.type}`}
      data-zone-id={zone.id}
      data-zone-type={zone.type}
      style={zoneStyle}
    >
      {zone.rows && zone.rows.length > 0 ? (
        zone.rows.map((row, rowIndex) => (
          <RowRenderer
            key={row.id || `row-${rowIndex}`}
            row={row}
            rowIndex={rowIndex}
            zoneId={zone.id}
            onUpdate={handleRowUpdate}
            isEditMode={isEditMode}
          />
        ))
      ) : (
        // Empty state - shown when zone has no rows
        <div
          className="p-8 border-2 border-dashed rounded-lg text-center"
          style={{
            borderColor: resolveToken('{{theme.colors.border.default}}'),
            color: resolveToken('{{theme.colors.text.tertiary}}')
          }}
        >
          <div className="text-sm font-medium">Empty zone</div>
          <div className="text-xs mt-1">Add content using drag-and-drop or the element picker</div>
        </div>
      )}
    </div>
  );
};

ZoneRenderer.propTypes = {
  zone: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    containerWidth: PropTypes.oneOf(['full', 'wide', 'standard', 'narrow', 'notion']).isRequired,
    padding: PropTypes.shape({
      x: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      y: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
    }),
    background: PropTypes.string,
    border: PropTypes.bool,
    rows: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      columns: PropTypes.array
    }))
  }).isRequired,
  containerContext: PropTypes.oneOf(['page', 'frame']),
  onUpdate: PropTypes.func,
  isEditMode: PropTypes.bool
};

export default ZoneRenderer;
