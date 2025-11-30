import React from 'react';
import PropTypes from 'prop-types';
import { ChartWidget } from './ChartWidget';
import { TableWidget } from './TableWidget';
import { MetricWidget } from './MetricWidget';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * WidgetRenderer Component
 *
 * Renders Chart/Table/Metric with live data.
 * Shows skeleton loader during fetch. Error boundary for widget crashes.
 *
 * Props:
 * - widget: object - Widget configuration { widgetType, config }
 * - isPresenterMode: boolean - Whether in presenter mode (enables interactivity)
 */
export function WidgetRenderer({ widget, isPresenterMode = false }) {
  if (!widget || !widget.widgetType) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400">
        No widget configured
      </div>
    );
  }

  try {
    const commonProps = {
      config: widget.config,
      isPresenterMode
    };

    switch (widget.widgetType) {
      case 'chart':
        return <ChartWidget {...commonProps} />;
      case 'table':
        return <TableWidget {...commonProps} />;
      case 'metric':
        return <MetricWidget {...commonProps} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-red-500">
            Unknown widget type: {widget.widgetType}
          </div>
        );
    }
  } catch (error) {
    trackEvent(SLIDE_DECK_EVENTS.WIDGET_LOAD_FAILED, {
      widgetType: widget.widgetType,
      error: error.message
    });

    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500 p-4">
        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="text-sm font-medium">Widget Error</div>
        <div className="text-xs text-gray-500 mt-1">{error.message}</div>
      </div>
    );
  }
}

WidgetRenderer.propTypes = {
  widget: PropTypes.shape({
    widgetType: PropTypes.oneOf(['chart', 'table', 'metric']).isRequired,
    config: PropTypes.object.isRequired
  }),
  isPresenterMode: PropTypes.bool
};
