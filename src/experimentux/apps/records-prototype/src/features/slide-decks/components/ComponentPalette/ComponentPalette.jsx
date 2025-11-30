import React from 'react';
import PropTypes from 'prop-types';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * ComponentPalette Component
 *
 * Sidebar with draggable components (Text, Chart, Table, Metric).
 * Users drag components to the SlideCanvas to add them.
 *
 * Props:
 * - onAddComponent: function - Callback when component is added (type)
 */

const COMPONENTS = [
  {
    type: 'text',
    label: 'Text',
    icon: '📝',
    description: 'Add text content'
  },
  {
    type: 'chart',
    label: 'Chart',
    icon: '📊',
    description: 'Add chart widget'
  },
  {
    type: 'table',
    label: 'Table',
    icon: '📋',
    description: 'Add table widget'
  },
  {
    type: 'metric',
    label: 'Metric',
    icon: '🔢',
    description: 'Add metric widget'
  }
];

export function ComponentPalette({ onAddComponent }) {
  const handleAddComponent = (type) => {
    trackEvent(SLIDE_DECK_EVENTS.COMPONENT_ADDED, { type });
    onAddComponent(type);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">Components</h3>
        <p className="text-xs text-gray-500 mt-1">Click to add to slide</p>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {COMPONENTS.map((component) => (
          <button
            key={component.type}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
            onClick={() => handleAddComponent(component.type)}
            title={component.description}
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{component.icon}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{component.label}</div>
                <div className="text-xs text-gray-500">{component.description}</div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Help Text */}
      <div className="px-4 py-3 bg-blue-50 border-t border-blue-200">
        <div className="text-xs text-blue-900">
          <strong>Tip:</strong> Click a component to add it to your slide, then position and resize it on the canvas.
        </div>
      </div>
    </div>
  );
}

ComponentPalette.propTypes = {
  onAddComponent: PropTypes.func.isRequired
};
