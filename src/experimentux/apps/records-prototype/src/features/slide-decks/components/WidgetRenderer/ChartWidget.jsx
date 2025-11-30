import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetData } from '../../hooks/useWidgetData';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * ChartWidget Component
 *
 * Renders a chart with live data binding.
 * Fetches data on mount + auto-refresh (configurable interval).
 *
 * Props:
 * - config: object - Widget configuration { dataViewId, chartType, title }
 * - isPresenterMode: boolean - Whether in presenter mode
 */
export function ChartWidget({ config, isPresenterMode }) {
  const { data, loading, error } = useWidgetData(
    config.dataViewId,
    config,
    isPresenterMode ? 30000 : 0 // Auto-refresh in presenter mode only
  );

  const handleChartClick = () => {
    if (isPresenterMode && data) {
      trackEvent(SLIDE_DECK_EVENTS.CHART_INTERACTED, {
        dataViewId: config.dataViewId,
        chartType: config.chartType
      });
      // In a real implementation, open drill-down modal
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-4 w-full p-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm">Failed to load chart</div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full p-4 ${isPresenterMode ? 'cursor-pointer hover:bg-gray-50' : ''}`}
      onClick={handleChartClick}
    >
      {/* Chart Title */}
      {config.title && (
        <div className="text-sm font-semibold text-gray-900 mb-3">{config.title}</div>
      )}

      {/* Chart Visualization */}
      <div className="flex-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-gradient-to-br from-blue-50 to-white">
        <div className="text-center">
          <div className="text-6xl mb-2">📊</div>
          <div className="text-sm font-medium text-gray-700">
            {config.chartType ? config.chartType.toUpperCase() : 'CHART'}
          </div>
          {data && (
            <div className="text-xs text-gray-500 mt-2">
              {data.dataPoints ? `${data.dataPoints.length} data points` : 'Live data loaded'}
            </div>
          )}
          {isPresenterMode && (
            <div className="text-xs text-blue-600 mt-2">Click to drill down</div>
          )}
        </div>
      </div>

      {/* Data Source Label */}
      {config.dataViewId && (
        <div className="text-xs text-gray-500 mt-2">
          Source: {config.dataViewName || config.dataViewId}
        </div>
      )}
    </div>
  );
}

ChartWidget.propTypes = {
  config: PropTypes.shape({
    dataViewId: PropTypes.string,
    chartType: PropTypes.string,
    title: PropTypes.string,
    dataViewName: PropTypes.string
  }).isRequired,
  isPresenterMode: PropTypes.bool
};

ChartWidget.defaultProps = {
  isPresenterMode: false
};
