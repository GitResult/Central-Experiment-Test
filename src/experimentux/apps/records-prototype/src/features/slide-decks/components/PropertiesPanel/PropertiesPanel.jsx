import React from 'react';
import PropTypes from 'prop-types';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * PropertiesPanel Component
 *
 * Sidebar panel for selected element properties.
 * Shows position (X, Y), size (Width, Height), and layer order controls.
 *
 * Props:
 * - selectedElement: object - Currently selected element
 * - onUpdate: function - Callback when properties are updated
 */
export function PropertiesPanel({ selectedElement, onUpdate }) {
  if (!selectedElement) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-4 text-center">
          <div className="text-gray-500">
            <div className="text-4xl mb-2">👆</div>
            <p className="text-sm">Select an element to edit its properties</p>
          </div>
        </div>
      </div>
    );
  }

  const handlePropertyChange = (property, value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return;

    onUpdate({ [property]: numValue });
    trackEvent(SLIDE_DECK_EVENTS.PROPERTY_CHANGED, {
      elementId: selectedElement.id,
      property,
      value: numValue
    });
  };

  const handleLayerChange = (direction) => {
    // In a full implementation, this would change z-index/layer order
    trackEvent(SLIDE_DECK_EVENTS.LAYER_CHANGED, {
      elementId: selectedElement.id,
      direction
    });
    // For now, just log
    console.log(`Move ${direction}`, selectedElement.id);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Properties</h3>
        <p className="text-xs text-gray-500 mt-1">
          {selectedElement.type === 'text' ? 'Text Element' : `${selectedElement.widgetType} Widget`}
        </p>
      </div>

      {/* Properties Form */}
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {/* Position */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Position</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="prop-x" className="block text-xs text-gray-600 mb-1">
                X
              </label>
              <input
                id="prop-x"
                type="number"
                value={selectedElement.x}
                onChange={(e) => handlePropertyChange('x', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="8"
              />
            </div>
            <div>
              <label htmlFor="prop-y" className="block text-xs text-gray-600 mb-1">
                Y
              </label>
              <input
                id="prop-y"
                type="number"
                value={selectedElement.y}
                onChange={(e) => handlePropertyChange('y', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                step="8"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Size</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="prop-width" className="block text-xs text-gray-600 mb-1">
                Width
              </label>
              <input
                id="prop-width"
                type="number"
                value={selectedElement.width}
                onChange={(e) => handlePropertyChange('width', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="50"
                step="8"
              />
            </div>
            <div>
              <label htmlFor="prop-height" className="block text-xs text-gray-600 mb-1">
                Height
              </label>
              <input
                id="prop-height"
                type="number"
                value={selectedElement.height}
                onChange={(e) => handlePropertyChange('height', e.target.value)}
                className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="50"
                step="8"
              />
            </div>
          </div>
        </div>

        {/* Layer Order */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">Layer Order</label>
          <div className="flex space-x-2">
            <button
              onClick={() => handleLayerChange('front')}
              className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Bring to Front
            </button>
            <button
              onClick={() => handleLayerChange('back')}
              className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
            >
              Send to Back
            </button>
          </div>
        </div>

        {/* Element Type Info */}
        <div className="pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-600">
            <div className="mb-1">
              <strong>ID:</strong> {selectedElement.id}
            </div>
            <div className="mb-1">
              <strong>Type:</strong> {selectedElement.type}
            </div>
            {selectedElement.widgetType && (
              <div>
                <strong>Widget:</strong> {selectedElement.widgetType}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

PropertiesPanel.propTypes = {
  selectedElement: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['text', 'widget']).isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    widgetType: PropTypes.oneOf(['chart', 'table', 'metric'])
  }),
  onUpdate: PropTypes.func.isRequired
};
