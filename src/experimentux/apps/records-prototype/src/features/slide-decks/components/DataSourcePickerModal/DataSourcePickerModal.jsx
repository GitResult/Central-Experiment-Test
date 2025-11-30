import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDataViews } from '../../hooks/useDataViews';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'pie', label: 'Pie Chart' },
  { value: 'area', label: 'Area Chart' }
];

const METRIC_FUNCTIONS = [
  { value: 'sum', label: 'SUM' },
  { value: 'avg', label: 'AVERAGE' },
  { value: 'count', label: 'COUNT' },
  { value: 'min', label: 'MIN' },
  { value: 'max', label: 'MAX' }
];

/**
 * DataSourcePickerModal Component
 *
 * Structured modal for configuring data widgets (Chart, Table, Metric).
 * Uses ONLY dropdowns - NO free-form text entry for data references.
 * This prevents syntax errors and ensures valid configuration.
 */
export function DataSourcePickerModal({
  isOpen,
  widgetType,
  currentConfig,
  onSave,
  onClose
}) {
  const { dataViews, loading } = useDataViews();
  const [config, setConfig] = useState(currentConfig || {});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      trackEvent(SLIDE_DECK_EVENTS.DATA_SOURCE_PICKER_OPENED, { widgetType });
    }
  }, [isOpen, widgetType]);

  if (!isOpen) return null;

  const filteredViews = dataViews.filter((view) =>
    view.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (widgetType === 'table' ? view.type === 'table' :
     widgetType === 'metric' ? view.type === 'metric' :
     view.type === 'chart')
  );

  const handleSave = () => {
    trackEvent(SLIDE_DECK_EVENTS.DATA_SOURCE_CONFIGURED, {
      widgetType,
      dataViewId: config.dataViewId
    });
    onSave(config);
  };

  const isValid = config.dataViewId && (
    widgetType === 'table' ||
    (widgetType === 'chart' && config.chartType) ||
    (widgetType === 'metric' && config.metricFunction)
  );

  const selectedView = dataViews.find(v => v.id === config.dataViewId);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Configure {widgetType.charAt(0).toUpperCase() + widgetType.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-4 space-y-4">
          {/* Data Source Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data Source
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search views..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
            />

            {/* Data Source Dropdown */}
            <div className="border border-gray-300 rounded-lg max-h-48 overflow-auto">
              {loading ? (
                <div className="px-4 py-3 text-gray-500">Loading views...</div>
              ) : filteredViews.length === 0 ? (
                <div className="px-4 py-3 text-gray-500">No views found</div>
              ) : (
                filteredViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => {
                      setConfig({ ...config, dataViewId: view.id });
                      trackEvent(SLIDE_DECK_EVENTS.DATA_SOURCE_SELECTED, { dataViewId: view.id });
                    }}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      config.dataViewId === view.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="text-2xl">
                        {view.type === 'chart' ? '📊' : view.type === 'table' ? '📋' : '🔢'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{view.name}</div>
                        <div className="text-sm text-gray-600 truncate">{view.description}</div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <span>{view.module}</span>
                          <span>•</span>
                          <span>{view.type}</span>
                        </div>
                      </div>
                      {config.dataViewId === view.id && (
                        <div className="text-blue-600">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chart Type Dropdown (for charts only) */}
          {widgetType === 'chart' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chart Type
              </label>
              <select
                value={config.chartType || ''}
                onChange={(e) => {
                  setConfig({ ...config, chartType: e.target.value });
                  trackEvent(SLIDE_DECK_EVENTS.CHART_TYPE_CHANGED, { chartType: e.target.value });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select chart type...</option>
                {CHART_TYPES.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Metric Function Dropdown (for metrics only) */}
          {widgetType === 'metric' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Function
              </label>
              <select
                value={config.metricFunction || ''}
                onChange={(e) => {
                  setConfig({ ...config, metricFunction: e.target.value });
                  trackEvent(SLIDE_DECK_EVENTS.METRIC_FUNCTION_CHANGED, { metricFunction: e.target.value });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select function...</option>
                {METRIC_FUNCTIONS.map(func => (
                  <option key={func.value} value={func.value}>{func.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Selected View Info */}
          {selectedView && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="text-sm text-blue-900">
                <strong>Selected:</strong> {selectedView.name}
              </div>
              <div className="text-xs text-blue-700 mt-1">
                {selectedView.description}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!isValid}
            className={`px-4 py-2 rounded-lg ${
              isValid
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentConfig ? 'Update' : 'Insert'}
          </button>
        </div>
      </div>
    </div>
  );
}

DataSourcePickerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  widgetType: PropTypes.oneOf(['chart', 'table', 'metric']).isRequired,
  currentConfig: PropTypes.object,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
