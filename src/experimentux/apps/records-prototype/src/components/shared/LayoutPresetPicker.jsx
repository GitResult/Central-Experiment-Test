import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { LAYOUT_PRESETS, createPageConfigFromPreset } from '../layouts/presets';

/**
 * LayoutPresetPicker Component
 *
 * A modal or panel for selecting a layout preset.
 * Can be used for both canvas frames and standalone pages.
 *
 * @param {boolean} isOpen - Whether the picker is visible
 * @param {Function} onClose - Callback when picker should close
 * @param {Function} onSelectPreset - Callback when preset is selected (presetId, config) => void
 * @param {string} context - Context ('frame' or 'page')
 * @param {string} title - Optional custom title
 */
const LayoutPresetPicker = ({
  isOpen,
  onClose,
  onSelectPreset,
  context = 'page',
  title = 'Choose a Layout'
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState(null);
  const [hoveredPresetId, setHoveredPresetId] = useState(null);

  // Get all presets
  const presets = Object.values(LAYOUT_PRESETS);

  // Filter presets based on context (optional)
  const filteredPresets = presets; // Can add filtering logic here if needed

  const handleSelectPreset = (presetId) => {
    const config = createPageConfigFromPreset(presetId);
    onSelectPreset(presetId, config);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-[200]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[201] p-4">
        <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-neutral-900">{title}</h2>
                <p className="text-sm text-neutral-500 mt-1">
                  Select a preset to start with, or choose blank to build from scratch
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-neutral-100 transition-colors"
                aria-label="Close"
              >
                <svg className="w-6 h-6 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Preset Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                const isHovered = hoveredPresetId === preset.id;

                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    onDoubleClick={() => handleSelectPreset(preset.id)}
                    onMouseEnter={() => setHoveredPresetId(preset.id)}
                    onMouseLeave={() => setHoveredPresetId(null)}
                    className={`
                      relative p-5 rounded-xl border-2 transition-all text-left
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-neutral-200 hover:border-blue-300 hover:shadow-sm'
                      }
                    `}
                  >
                    {/* Icon */}
                    <div className={`
                      w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors
                      ${isSelected ? 'bg-blue-500' : 'bg-neutral-100'}
                    `}>
                      <svg
                        className={`w-6 h-6 ${isSelected ? 'text-white' : 'text-neutral-600'}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d={preset.icon}
                        />
                      </svg>
                    </div>

                    {/* Preset Info */}
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-1">
                        {preset.name}
                      </h3>
                      <p className="text-sm text-neutral-500 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>

                    {/* Zone Count Badge */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5h16M4 12h16M4 19h16" />
                      </svg>
                      <span>{preset.zones.length} zones</span>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}

                    {/* Hover Effect */}
                    {isHovered && !isSelected && (
                      <div className="absolute inset-0 bg-blue-500 bg-opacity-5 rounded-xl pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredPresets.length === 0 && (
              <div className="py-16 text-center text-neutral-400">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div className="text-lg">No presets available</div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-200 flex items-center justify-between">
            <div className="text-sm text-neutral-500">
              {selectedPresetId ? (
                <>Selected: <span className="font-medium text-neutral-900">{LAYOUT_PRESETS[selectedPresetId]?.name}</span></>
              ) : (
                'Select a layout preset to continue'
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => selectedPresetId && handleSelectPreset(selectedPresetId)}
                disabled={!selectedPresetId}
                className={`
                  px-6 py-2 rounded-lg font-medium transition-all
                  ${selectedPresetId
                    ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                    : 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                  }
                `}
              >
                {context === 'frame' ? 'Apply to Frame' : 'Create Page'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

LayoutPresetPicker.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectPreset: PropTypes.func.isRequired,
  context: PropTypes.oneOf(['frame', 'page']),
  title: PropTypes.string
};

export default LayoutPresetPicker;
