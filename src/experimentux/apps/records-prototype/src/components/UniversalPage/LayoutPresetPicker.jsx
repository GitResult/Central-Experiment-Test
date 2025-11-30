import React from 'react';
import PropTypes from 'prop-types';
import { LAYOUT_PRESETS } from '../layouts/presets';

/**
 * LayoutPresetPicker
 *
 * UI for selecting layout presets for pages or canvas frames.
 * Shows all available presets with previews and descriptions.
 *
 * Can be used as a modal, dropdown, or inline component.
 */
const LayoutPresetPicker = ({
  onSelect,
  onCancel,
  currentPresetId = null,
  context = 'page', // 'page' | 'frame'
  showTitle = true
}) => {
  const presets = Object.values(LAYOUT_PRESETS);

  return (
    <div className="layout-preset-picker">
      {/* Title */}
      {showTitle && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose a Layout
          </h2>
          <p className="text-sm text-gray-600">
            {context === 'frame'
              ? 'Select a layout for this frame. You can customize it after creation.'
              : 'Select a layout preset to get started. You can customize it after creation.'}
          </p>
        </div>
      )}

      {/* Preset grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {presets.map((preset) => {
          const isSelected = preset.id === currentPresetId;

          return (
            <button
              key={preset.id}
              onClick={() => onSelect(preset)}
              className={`
                relative p-6 rounded-lg border-2 transition-all text-left
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-md'
                }
              `}
            >
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-3 right-3">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}

              {/* Icon */}
              <div className={`mb-4 ${isSelected ? 'text-blue-600' : 'text-gray-400'}`}>
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={preset.icon} />
                </svg>
              </div>

              {/* Name */}
              <h3 className={`text-lg font-semibold mb-2 ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                {preset.name}
              </h3>

              {/* Description */}
              <p className={`text-sm ${isSelected ? 'text-blue-700' : 'text-gray-600'}`}>
                {preset.description}
              </p>

              {/* Zone preview */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Zones:</div>
                <div className="flex flex-wrap gap-1">
                  {preset.zones.map((zone) => (
                    <span
                      key={zone.id}
                      className={`
                        inline-flex items-center px-2 py-1 rounded text-xs font-medium
                        ${isSelected
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      {zone.type}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          );
        })}

        {/* Custom/Blank option */}
        <button
          onClick={() => onSelect(LAYOUT_PRESETS['blank'])}
          className="relative p-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
        >
          {/* Icon */}
          <div className="mb-4 text-gray-400 group-hover:text-blue-500">
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
            </svg>
          </div>

          {/* Name */}
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-900 mb-2">
            Start from Scratch
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 group-hover:text-blue-700">
            Begin with a blank page and build your own custom layout
          </p>
        </button>
      </div>

      {/* Actions */}
      {onCancel && (
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * LayoutPresetPickerModal
 *
 * Modal wrapper for LayoutPresetPicker
 */
export const LayoutPresetPickerModal = ({
  isOpen,
  onSelect,
  onCancel,
  currentPresetId,
  context
}) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <LayoutPresetPicker
            onSelect={(preset) => {
              onSelect(preset);
              onCancel();
            }}
            onCancel={onCancel}
            currentPresetId={currentPresetId}
            context={context}
            showTitle={true}
          />
        </div>
      </div>
    </>
  );
};

LayoutPresetPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  currentPresetId: PropTypes.string,
  context: PropTypes.oneOf(['page', 'frame']),
  showTitle: PropTypes.bool
};

LayoutPresetPicker.defaultProps = {
  onCancel: null,
  currentPresetId: null,
  context: 'page',
  showTitle: true
};

LayoutPresetPickerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  currentPresetId: PropTypes.string,
  context: PropTypes.oneOf(['page', 'frame'])
};

LayoutPresetPickerModal.defaultProps = {
  currentPresetId: null,
  context: 'page'
};

export default LayoutPresetPicker;
