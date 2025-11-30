import React from 'react';
import PropTypes from 'prop-types';

const WIDGET_ICONS = {
  chart: '📊',
  table: '📋',
  metric: '🔢'
};

/**
 * DataPill Component
 *
 * Visual widget placeholder in the left panel content editor.
 * System-generated (not typed by user) after successful modal configuration.
 * Clickable to edit, deletable with [×] button.
 *
 * Key features:
 * - Visual label with icon + data source name + widget type
 * - No syntax errors (created by system after structured modal config)
 * - Click to edit → Opens DataSourcePickerModal with current settings
 * - Delete button to remove widget
 */
export function DataPill({ widget, onClick, onDelete }) {
  const icon = WIDGET_ICONS[widget.widgetType] || '📦';
  const label = widget.config.title ||
                (widget.config.dataViewId ?
                 `${widget.widgetType} widget` :
                 `Unconfigured ${widget.widgetType}`);

  return (
    <div className="inline-flex items-center space-x-1 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2 my-1">
      {/* Widget Icon */}
      <span className="text-lg">{icon}</span>

      {/* Clickable Label */}
      <button
        onClick={onClick}
        onKeyPress={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            onClick();
          }
        }}
        className="text-sm font-medium text-blue-900 hover:text-blue-700 focus:outline-none"
        aria-label={`Edit ${label}`}
      >
        {label}
      </button>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-blue-400 hover:text-blue-600 focus:outline-none"
        aria-label="Delete widget"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
}

DataPill.propTypes = {
  widget: PropTypes.shape({
    widgetType: PropTypes.oneOf(['chart', 'table', 'metric']).isRequired,
    config: PropTypes.object.isRequired
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
