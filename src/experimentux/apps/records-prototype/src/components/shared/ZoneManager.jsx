import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ZoneManager Component
 *
 * A side panel or modal for managing page zones:
 * - Toggle zone visibility
 * - Reorder zones (drag and drop)
 * - Add new zones
 * - Remove zones
 *
 * @param {boolean} isOpen - Whether the manager is visible
 * @param {Function} onClose - Callback when manager should close
 * @param {Array} zones - Current zones configuration
 * @param {Function} onUpdateZones - Callback when zones change (newZones) => void
 */
const ZoneManager = ({
  isOpen,
  onClose,
  zones = [],
  onUpdateZones
}) => {
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Handle zone visibility toggle
  const handleToggleVisibility = (zoneId) => {
    const updatedZones = zones.map(zone =>
      zone.id === zoneId
        ? { ...zone, visible: !zone.visible }
        : zone
    );
    onUpdateZones(updatedZones);
  };

  // Handle zone removal
  const handleRemoveZone = (zoneId) => {
    const updatedZones = zones.filter(zone => zone.id !== zoneId);
    onUpdateZones(updatedZones);
  };

  // Handle adding a new zone
  const handleAddZone = () => {
    const newZone = {
      id: `zone-${Date.now()}`,
      type: 'body',
      visible: true,
      containerWidth: 'standard',
      padding: { x: 8, y: 8 },
      background: '',
      border: false,
      rows: []
    };
    onUpdateZones([...zones, newZone]);
  };

  // Drag and drop handlers
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;

    const newZones = [...zones];
    const draggedZone = newZones[draggedIndex];
    newZones.splice(draggedIndex, 1);
    newZones.splice(index, 0, draggedZone);

    onUpdateZones(newZones);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  // Get zone type icon
  const getZoneIcon = (type) => {
    const icons = {
      'cover': 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      'header': 'M4 6h16M4 12h10M4 18h7',
      'hero': 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01',
      'body': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      'footer': 'M4 6h16M4 12h16M4 18h16'
    };
    return icons[type] || icons['body'];
  };

  // Get zone type label
  const getZoneLabel = (type) => {
    const labels = {
      'cover': 'Cover',
      'header': 'Header',
      'hero': 'Hero',
      'body': 'Body',
      'footer': 'Footer'
    };
    return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-30 z-[200]"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-2xl z-[201] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-neutral-900">Manage Zones</h3>
              <p className="text-sm text-neutral-500 mt-1">
                {zones.length} zone{zones.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Zone List */}
        <div className="flex-1 overflow-y-auto p-4">
          {zones.length > 0 ? (
            <div className="space-y-2">
              {zones.map((zone, index) => (
                <div
                  key={zone.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`
                    p-4 border-2 rounded-lg transition-all cursor-move
                    ${zone.visible
                      ? 'border-neutral-200 bg-white hover:border-blue-300 hover:shadow-sm'
                      : 'border-neutral-100 bg-neutral-50 opacity-60'
                    }
                    ${draggedIndex === index ? 'opacity-50' : ''}
                  `}
                >
                  <div className="flex items-start gap-3">
                    {/* Drag Handle */}
                    <div className="mt-1 text-neutral-400">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M10 4h4v4h-4V4zm0 6h4v4h-4v-4zm0 6h4v4h-4v-4z" />
                      </svg>
                    </div>

                    {/* Zone Icon */}
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${zone.visible ? 'bg-blue-50' : 'bg-neutral-100'}
                    `}>
                      <svg
                        className={`w-5 h-5 ${zone.visible ? 'text-blue-600' : 'text-neutral-400'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d={getZoneIcon(zone.type)}
                        />
                      </svg>
                    </div>

                    {/* Zone Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-neutral-900">
                          {getZoneLabel(zone.type)}
                        </h4>
                        {!zone.visible && (
                          <span className="text-xs px-2 py-0.5 bg-neutral-200 text-neutral-600 rounded">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-neutral-500">
                        {zone.rows?.length || 0} row{zone.rows?.length !== 1 ? 's' : ''} • {zone.containerWidth}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1">
                      {/* Toggle Visibility */}
                      <button
                        onClick={() => handleToggleVisibility(zone.id)}
                        className="p-1.5 rounded hover:bg-neutral-100 transition-colors"
                        title={zone.visible ? 'Hide zone' : 'Show zone'}
                      >
                        <svg
                          className="w-4 h-4 text-neutral-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {zone.visible ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          )}
                        </svg>
                      </button>

                      {/* Remove Zone */}
                      {zones.length > 1 && (
                        <button
                          onClick={() => handleRemoveZone(zone.id)}
                          className="p-1.5 rounded hover:bg-red-50 transition-colors"
                          title="Remove zone"
                        >
                          <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-400">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-sm">No zones</div>
              <div className="text-xs mt-1">Add a zone to get started</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-200">
          <button
            onClick={handleAddZone}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Zone
          </button>
        </div>
      </div>
    </>
  );
};

ZoneManager.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
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
  onUpdateZones: PropTypes.func.isRequired
};

export default ZoneManager;
