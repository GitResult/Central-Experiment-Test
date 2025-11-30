import React from 'react';
import PropTypes from 'prop-types';
import { useWidgetData } from '../../hooks/useWidgetData';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * MetricWidget Component
 *
 * Renders a single metric with formula support.
 * Formulas: SUM, AVG, COUNT, MIN, MAX.
 *
 * Props:
 * - config: object - Widget configuration { dataViewId, metricFunction, title }
 * - isPresenterMode: boolean - Whether in presenter mode
 */
export function MetricWidget({ config, isPresenterMode }) {
  const { data, loading, error } = useWidgetData(
    config.dataViewId,
    config,
    isPresenterMode ? 30000 : 0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse space-y-2 text-center">
          <div className="h-12 bg-gray-200 rounded w-32 mx-auto"></div>
          <div className="h-4 bg-gray-100 rounded w-24 mx-auto"></div>
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
        <div className="text-sm">Failed to load metric</div>
      </div>
    );
  }

  // Calculate metric value based on function
  const calculateMetric = () => {
    if (!data?.values || data.values.length === 0) {
      return { value: '-', formattedValue: '-' };
    }

    const values = data.values.map(Number).filter(v => !isNaN(v));
    let value;

    switch (config.metricFunction) {
      case 'sum':
        value = values.reduce((sum, v) => sum + v, 0);
        break;
      case 'avg':
        value = values.reduce((sum, v) => sum + v, 0) / values.length;
        break;
      case 'count':
        value = values.length;
        break;
      case 'min':
        value = Math.min(...values);
        break;
      case 'max':
        value = Math.max(...values);
        break;
      default:
        value = values[0] || 0;
    }

    // Format value
    const formattedValue = typeof value === 'number'
      ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
      : value;

    return { value, formattedValue };
  };

  const metric = calculateMetric();

  // Mock metric for demo if no data
  const displayValue = data ? metric.formattedValue : '12,345';
  const displayTrend = data?.trend || '+15%';
  const trendPositive = !displayTrend.startsWith('-');

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* Metric Icon */}
      <div className="text-5xl mb-3">🔢</div>

      {/* Metric Value */}
      <div className="text-4xl font-bold text-gray-900 mb-2">{displayValue}</div>

      {/* Metric Title */}
      {config.title && (
        <div className="text-sm font-medium text-gray-700 mb-2">{config.title}</div>
      )}

      {/* Metric Function */}
      {config.metricFunction && (
        <div className="text-xs text-gray-500 uppercase tracking-wide mb-2">
          {config.metricFunction}
        </div>
      )}

      {/* Trend Indicator */}
      {data?.trend && (
        <div
          className={`flex items-center space-x-1 text-sm font-medium ${
            trendPositive ? 'text-green-600' : 'text-red-600'
          }`}
        >
          <span>{trendPositive ? '↑' : '↓'}</span>
          <span>{displayTrend}</span>
        </div>
      )}

      {/* Data Source Label */}
      {config.dataViewId && (
        <div className="text-xs text-gray-500 mt-4">
          Source: {config.dataViewName || config.dataViewId}
        </div>
      )}
    </div>
  );
}

MetricWidget.propTypes = {
  config: PropTypes.shape({
    dataViewId: PropTypes.string,
    metricFunction: PropTypes.oneOf(['sum', 'avg', 'count', 'min', 'max']),
    title: PropTypes.string,
    dataViewName: PropTypes.string
  }).isRequired,
  isPresenterMode: PropTypes.bool
};

MetricWidget.defaultProps = {
  isPresenterMode: false
};
