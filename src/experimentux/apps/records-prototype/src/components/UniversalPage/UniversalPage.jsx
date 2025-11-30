import React, { useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { arrayMove } from '@dnd-kit/sortable';
import ZoneRenderer from './ZoneRenderer';
import { PageDragDropContext } from '../../contexts/DragDropContext';
import { getElementDefinition } from '../elements/registry';

/**
 * Helper: Get default data for element type
 *
 * Returns appropriate default data based on element type.
 */
const getDefaultData = (elementType) => {
  const defaults = {
    'text': { content: 'Enter text...' },
    'title': { content: 'Page Title' },
    'heading': { content: 'Section Heading' },
    'description': { content: 'Description text...' },
    'button': { label: 'Button', url: '#' },
    'image': { url: '', alt: '', caption: '' },
    'cover-image': { url: '', position: 50 },
    'page-icon': { emoji: '📄', size: 'lg' },
    'breadcrumb': { items: [] },
    'data-grid': { data: [], columns: [] },
    'metadata-bar': { items: [] },
    'form-field': { label: 'Field', value: '', fieldType: 'text' },
    'content-card': { title: '', content: '', variant: 'info' }
  };

  return defaults[elementType] || {};
};

/**
 * UniversalPage Component
 *
 * Main component for the unified page system. Renders a page using
 * a configurable zone-based architecture.
 *
 * This component replaces both Database Pages and Data Record Pages
 * with a single, flexible system that supports any zone configuration.
 *
 * @param {string} pageId - Unique page identifier
 * @param {Object} config - Page configuration (zones, features, etc.)
 * @param {string} containerContext - Context ('page' or 'frame')
 * @param {Function} onUpdate - Callback for page updates
 */
const UniversalPage = ({
  pageId,
  config,
  containerContext = 'page',
  onUpdate
}) => {
  const startTime = performance.now();

  // Memoize zones to prevent unnecessary re-renders
  const memoizedZones = useMemo(() => config.zones || [], [config.zones]);

  // Memoize features
  const memoizedFeatures = useMemo(() => config.features || {}, [config.features]);

  // Handle zone updates
  const handleZoneUpdate = (zoneId, updates) => {
    const updatedZones = memoizedZones.map(zone =>
      zone.id === zoneId ? { ...zone, ...updates } : zone
    );

    if (onUpdate) {
      onUpdate({
        ...config,
        zones: updatedZones
      });
    }
  };

  // Handle element insertion from drag-and-drop
  const handleElementInsert = (zoneId, rowId, columnId, elementType, insertIndex) => {
    const elementDef = getElementDefinition(elementType);
    if (!elementDef) return;

    // Create new element with default settings
    const newElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: elementType,
      settings: elementDef.defaultSettings || {},
      data: getDefaultData(elementType)
    };

    // Find and update the column
    const updatedZones = memoizedZones.map(zone => {
      if (zone.id !== zoneId) return zone;

      return {
        ...zone,
        rows: zone.rows.map(row => {
          if (row.id !== rowId) return row;

          return {
            ...row,
            columns: row.columns.map(column => {
              if (column.id !== columnId) return column;

              const newElements = [...(column.elements || [])];
              newElements.splice(insertIndex, 0, newElement);

              return {
                ...column,
                elements: newElements
              };
            })
          };
        })
      };
    });

    if (onUpdate) {
      onUpdate({
        ...config,
        zones: updatedZones
      });
    }
  };

  // Handle element reordering within a column
  const handleElementReorder = (zoneId, rowId, columnId, oldIndex, newIndex) => {
    const updatedZones = memoizedZones.map(zone => {
      if (zone.id !== zoneId) return zone;

      return {
        ...zone,
        rows: zone.rows.map(row => {
          if (row.id !== rowId) return row;

          return {
            ...row,
            columns: row.columns.map(column => {
              if (column.id !== columnId) return column;

              const reorderedElements = arrayMove(column.elements || [], oldIndex, newIndex);

              return {
                ...column,
                elements: reorderedElements
              };
            })
          };
        })
      };
    });

    if (onUpdate) {
      onUpdate({
        ...config,
        zones: updatedZones
      });
    }
  };

  // Auto-focus on specified element when page loads
  useEffect(() => {
    const focusElementId = memoizedFeatures.focusOnLoad;
    if (focusElementId) {
      // Delay to ensure DOM is fully rendered
      setTimeout(() => {
        // Find all title elements (they have the class 'title-element')
        const titleElements = document.querySelectorAll('.title-element');
        titleElements.forEach(el => {
          // Check if this element's parent contains our target element ID
          const elementContainer = el.closest('[data-element-id]');
          if (elementContainer?.dataset?.elementId === focusElementId) {
            // Trigger double-click to enter edit mode
            el.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
          }
        });
      }, 100);
    }
  }, [pageId, memoizedFeatures.focusOnLoad]);

  // Performance monitoring
  useEffect(() => {
    const renderTime = performance.now() - startTime;

    // Log slow renders (> 1 second)
    if (renderTime > 1000) {
      console.warn(`Slow page render: ${renderTime}ms`, {
        pageId,
        zoneCount: memoizedZones.length,
        elementCount: countElements(memoizedZones)
      });
    }
  }, [pageId, memoizedZones, startTime]);

  return (
    <PageDragDropContext
      onElementInsert={handleElementInsert}
      onElementReorder={handleElementReorder}
    >
      <div
        className="universal-page"
        data-page-id={pageId}
        data-layout-preset-id={config.layoutPresetId || 'custom'}
        data-container-context={containerContext}
      >
        {memoizedZones.length > 0 ? (
          memoizedZones.map((zone) => (
            <ZoneRenderer
              key={zone.id}
              zone={zone}
              containerContext={containerContext}
              onUpdate={handleZoneUpdate}
            />
          ))
        ) : (
          // Empty state - shown when page has no zones
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="text-2xl font-semibold text-gray-700 mb-2">
                Empty Page
              </div>
              <div className="text-gray-500 mb-4">
                This page has no zones configured.
              </div>
              <div className="text-sm text-gray-400">
                Add zones through page settings or select a layout preset.
              </div>
            </div>
          </div>
        )}
      </div>
    </PageDragDropContext>
  );
};

/**
 * Helper: Count total elements in zones
 *
 * Used for performance monitoring.
 */
const countElements = (zones) => {
  let count = 0;
  zones.forEach(zone => {
    zone.rows?.forEach(row => {
      row.columns?.forEach(column => {
        count += column.elements?.length || 0;
      });
    });
  });
  return count;
};

UniversalPage.propTypes = {
  pageId: PropTypes.string.isRequired,
  config: PropTypes.shape({
    layoutPresetId: PropTypes.string,
    zones: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      visible: PropTypes.bool.isRequired,
      containerWidth: PropTypes.string.isRequired,
      padding: PropTypes.object,
      background: PropTypes.string,
      border: PropTypes.bool,
      rows: PropTypes.array
    })).isRequired,
    features: PropTypes.shape({
      insertMethod: PropTypes.oneOf(['slash', 'panel', 'both']),
      showSlashHint: PropTypes.bool,
      allowZoneToggle: PropTypes.bool,
      enableDragReorder: PropTypes.bool,
      focusOnLoad: PropTypes.string
    })
  }).isRequired,
  containerContext: PropTypes.oneOf(['page', 'frame']),
  onUpdate: PropTypes.func
};

export default UniversalPage;
