import React from 'react';
import PropTypes from 'prop-types';
import RowRenderer from './RowRenderer';

/**
 * Container Width Helper
 *
 * Returns appropriate width based on container context and width setting.
 * Adapts container widths for page vs frame contexts.
 *
 * @param {string} width - Container width setting
 * @param {string} context - Container context ('page' or 'frame')
 * @returns {string} CSS width value
 */
const getContainerWidth = (width, context) => {
  if (context === 'frame') {
    // Frame context: Use percentages of frame width
    const frameWidths = {
      'full': '100%',
      'wide': '90%',
      'standard': '80%',
      'narrow': '60%',
      'notion': '75%'
    };
    return frameWidths[width] || '80%';
  } else {
    // Page context: Use fixed pixel widths
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

/**
 * ZoneRenderer Component
 *
 * Renders a zone with its configured width, padding, background, and rows.
 * Zones are the top-level containers within a page (e.g., header, body, footer).
 *
 * @param {Object} zone - Zone configuration
 * @param {string} containerContext - Context ('page' or 'frame')
 * @param {Function} onUpdate - Callback for updates
 */
const ZoneRenderer = React.memo(({ zone, containerContext = 'page', onUpdate }) => {
  // Don't render if zone is not visible
  if (!zone.visible) {
    return null;
  }

  // Calculate container width based on context
  const containerWidth = getContainerWidth(zone.containerWidth, containerContext);

  // Calculate padding (multiplied by 4px for Tailwind compatibility)
  const paddingX = (zone.padding?.x || 0) * 4;
  const paddingY = (zone.padding?.y || 0) * 4;

  // Handle row updates
  const handleRowUpdate = (rowId, updates) => {
    if (onUpdate) {
      onUpdate(zone.id, {
        rows: zone.rows.map(row =>
          row.id === rowId
            ? { ...row, ...updates }
            : row
        )
      });
    }
  };

  return (
    <div
      className={`zone zone-${zone.type}`}
      data-zone-id={zone.id}
      data-zone-type={zone.type}
      style={{
        width: containerWidth,
        margin: '0 auto',
        padding: `${paddingY}px ${paddingX}px`,
        background: zone.background || 'transparent',
        border: zone.border ? '1px solid rgb(229 231 235)' : 'none',
        borderRadius: zone.border ? '8px' : '0'
      }}
    >
      {zone.rows && zone.rows.length > 0 ? (
        zone.rows.map((row) => (
          <RowRenderer
            key={row.id}
            row={row}
            zoneId={zone.id}
            onUpdate={handleRowUpdate}
          />
        ))
      ) : (
        // Empty state - shown when zone has no rows
        <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center text-gray-400">
          <div className="text-sm font-medium">Empty zone</div>
          <div className="text-xs mt-1">Add content using / commands or drag elements here</div>
        </div>
      )}
    </div>
  );
}, (prevProps, nextProps) => {
  // Memoization: only re-render if zone data changed
  return (
    prevProps.zone.id === nextProps.zone.id &&
    prevProps.zone.visible === nextProps.zone.visible &&
    prevProps.zone.containerWidth === nextProps.zone.containerWidth &&
    JSON.stringify(prevProps.zone.padding) === JSON.stringify(nextProps.zone.padding) &&
    prevProps.zone.background === nextProps.zone.background &&
    prevProps.zone.border === nextProps.zone.border &&
    JSON.stringify(prevProps.zone.rows) === JSON.stringify(nextProps.zone.rows) &&
    prevProps.containerContext === nextProps.containerContext
  );
});

ZoneRenderer.propTypes = {
  zone: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    containerWidth: PropTypes.oneOf(['full', 'wide', 'standard', 'narrow', 'notion']).isRequired,
    padding: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    background: PropTypes.string,
    border: PropTypes.bool,
    rows: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      columns: PropTypes.array
    }))
  }).isRequired,
  containerContext: PropTypes.oneOf(['page', 'frame']),
  onUpdate: PropTypes.func
};

ZoneRenderer.displayName = 'ZoneRenderer';

export default ZoneRenderer;
