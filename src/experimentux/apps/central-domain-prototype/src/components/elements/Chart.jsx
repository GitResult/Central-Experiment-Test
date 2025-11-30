/**
 * Chart Element
 * Wrapper for Recharts with enterprise styling
 */

import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { theme } from '../../config/theme';

export function Chart({ data, settings }) {
  const { chartData = [], dataKeys = [] } = data;
  const {
    type = 'bar',
    height = 300,
    showGrid = true,
    showLegend = true,
    colors
  } = settings.chart || {};

  // Default color palette
  const defaultColors = [
    theme.colors.charts.primary,
    theme.colors.charts.accent1,
    theme.colors.charts.accent2,
    theme.colors.charts.accent3,
    theme.colors.charts.secondary,
    theme.colors.charts.tertiary
  ];

  const chartColors = colors || defaultColors;

  const containerStyle = {
    width: '100%',
    height: `${height}px`,
    padding: theme.spacing[4],
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.border.default}`
  };

  const commonProps = {
    data: chartData,
    margin: { top: 10, right: 30, left: 0, bottom: 0 }
  };

  const gridProps = showGrid
    ? {
        stroke: theme.colors.border.subtle,
        strokeDasharray: '3 3'
      }
    : null;

  const axisStyle = {
    fontSize: theme.typography.fontSize.xs,
    fill: theme.colors.text.tertiary
  };

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: theme.colors.background.elevated,
      border: `1px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius.md,
      boxShadow: theme.shadows.lg,
      fontSize: theme.typography.fontSize.sm,
      color: theme.colors.text.primary
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey="name" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip {...tooltipStyle} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={chartColors[index % chartColors.length]}
                strokeWidth={2}
                dot={{ fill: chartColors[index % chartColors.length], r: 4 }}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey="name" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip {...tooltipStyle} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={chartColors[index % chartColors.length]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            {showGrid && <CartesianGrid {...gridProps} />}
            <XAxis dataKey="name" tick={axisStyle} />
            <YAxis tick={axisStyle} />
            <Tooltip {...tooltipStyle} />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={chartColors[index % chartColors.length]}
                fill={chartColors[index % chartColors.length]}
                fillOpacity={0.6}
              />
            ))}
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              dataKey={dataKeys[0] || 'value'}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip {...tooltipStyle} />
            {showLegend && <Legend />}
          </PieChart>
        );

      default:
        return <div>Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div style={containerStyle}>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}

Chart.propTypes = {
  data: PropTypes.shape({
    chartData: PropTypes.arrayOf(PropTypes.object).isRequired,
    dataKeys: PropTypes.arrayOf(PropTypes.string).isRequired
  }).isRequired,
  settings: PropTypes.shape({
    chart: PropTypes.shape({
      type: PropTypes.oneOf(['line', 'bar', 'area', 'pie']),
      height: PropTypes.number,
      showGrid: PropTypes.bool,
      showLegend: PropTypes.bool,
      colors: PropTypes.arrayOf(PropTypes.string)
    })
  }).isRequired
};
