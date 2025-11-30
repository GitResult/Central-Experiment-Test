import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * ZoneManager
 *
 * UI for managing page zones: add, remove, reorder, and configure zones.
 * Shows zone visibility toggles and configuration options.
 */
const ZoneManager = ({ zones, onUpdate }) => {
  const [expandedZoneId, setExpandedZoneId] = useState(null);

  const handleToggleZone = (zoneId) => {
    const updatedZones = zones.map(zone =>
      zone.id === zoneId ? { ...zone, visible: !zone.visible } : zone
    );
    onUpdate(updatedZones);
  };

  const handleUpdateZone = (zoneId, updates) => {
    const updatedZones = zones.map(zone =>
      zone.id === zoneId ? { ...zone, ...updates } : zone
    );
    onUpdate(updatedZones);
  };

  const handleMoveZone = (zoneId, direction) => {
    const currentIndex = zones.findIndex(z => z.id === zoneId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= zones.length) return;

    const newZones = [...zones];
    [newZones[currentIndex], newZones[newIndex]] = [newZones[newIndex], newZones[currentIndex]];
    onUpdate(newZones);
  };

  const handleRemoveZone = (zoneId) => {
    const updatedZones = zones.filter(zone => zone.id !== zoneId);
    onUpdate(updatedZones);
  };

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
    onUpdate([...zones, newZone]);
  };

  return (
    <div className="zone-manager bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Page Zones</h3>
        <button
          onClick={handleAddZone}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Zone
        </button>
      </div>

      {/* Zones list */}
      <div className="divide-y divide-gray-200">
        {zones.map((zone, index) => {
          const isExpanded = expandedZoneId === zone.id;

          return (
            <div key={zone.id} className={`${zone.visible ? 'bg-white' : 'bg-gray-50'}`}>
              {/* Zone header */}
              <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  {/* Visibility toggle */}
                  <button
                    onClick={() => handleToggleZone(zone.id)}
                    className={`p-1 rounded transition-colors ${
                      zone.visible ? 'text-gray-400 hover:text-gray-600' : 'text-gray-300 hover:text-gray-400'
                    }`}
                    title={zone.visible ? 'Hide zone' : 'Show zone'}
                  >
                    {zone.visible ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    )}
                  </button>

                  {/* Zone name */}
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${zone.visible ? 'text-gray-900' : 'text-gray-400'}`}>
                      {zone.type.charAt(0).toUpperCase() + zone.type.slice(1)} Zone
                    </div>
                    <div className="text-xs text-gray-500">
                      {zone.rows.length} {zone.rows.length === 1 ? 'row' : 'rows'}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {/* Move up */}
                  <button
                    onClick={() => handleMoveZone(zone.id, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>

                  {/* Move down */}
                  <button
                    onClick={() => handleMoveZone(zone.id, 'down')}
                    disabled={index === zones.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Configure */}
                  <button
                    onClick={() => setExpandedZoneId(isExpanded ? null : zone.id)}
                    className="p-1 text-gray-400 hover:text-gray-600"
                    title="Configure zone"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleRemoveZone(zone.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Remove zone"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Zone configuration */}
              {isExpanded && (
                <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 space-y-3">
                  {/* Container width */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Container Width
                    </label>
                    <select
                      value={zone.containerWidth}
                      onChange={(e) => handleUpdateZone(zone.id, { containerWidth: e.target.value })}
                      className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="full">Full Width</option>
                      <option value="wide">Wide (1200px)</option>
                      <option value="standard">Standard (900px)</option>
                      <option value="narrow">Narrow (600px)</option>
                      <option value="notion">Notion (700px)</option>
                    </select>
                  </div>

                  {/* Padding */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Padding (4px units)
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        value={zone.padding.x}
                        onChange={(e) => handleUpdateZone(zone.id, {
                          padding: { ...zone.padding, x: parseInt(e.target.value) || 0 }
                        })}
                        placeholder="Horizontal"
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        value={zone.padding.y}
                        onChange={(e) => handleUpdateZone(zone.id, {
                          padding: { ...zone.padding, y: parseInt(e.target.value) || 0 }
                        })}
                        placeholder="Vertical"
                        className="px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Border */}
                  <div>
                    <label className="flex items-center gap-2 text-xs font-medium text-gray-700">
                      <input
                        type="checkbox"
                        checked={zone.border}
                        onChange={(e) => handleUpdateZone(zone.id, { border: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      Show border
                    </label>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {zones.length === 0 && (
        <div className="p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3z" />
          </svg>
          <p className="text-sm text-gray-500">No zones yet</p>
          <p className="text-xs text-gray-400 mt-1">Click "Add Zone" to get started</p>
        </div>
      )}
    </div>
  );
};

ZoneManager.propTypes = {
  zones: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      visible: PropTypes.bool.isRequired,
      containerWidth: PropTypes.string.isRequired,
      padding: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
      }).isRequired,
      background: PropTypes.string,
      border: PropTypes.bool,
      rows: PropTypes.array.isRequired
    })
  ).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default ZoneManager;
