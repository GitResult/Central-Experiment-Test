/**
 * FacetAnalytics Component
 *
 * Displays charts, trends, and pattern insights.
 */

import PropTypes from 'prop-types';
import { TrendingUp } from 'lucide-react';
import { theme } from '../../../config/theme';

export function FacetAnalytics({ data }) {
  const { chart } = data;

  if (!chart) {
    return (
      <div style={{
        height: '140px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.text.tertiary,
        fontSize: theme.typography.fontSize.sm
      }}>
        No analytics data available
      </div>
    );
  }

  const maxBar = Math.max(...chart.bars);

  return (
    <div>
      {/* Bar Chart */}
      <div style={{
        height: '80px',
        display: 'flex',
        alignItems: 'flex-end',
        gap: '4px',
        padding: '8px 0'
      }}>
        {chart.bars.map((value, index) => (
          <div
            key={index}
            style={{
              flex: 1,
              height: `${(value / maxBar) * 100}%`,
              minHeight: '4px',
              background: theme.colors.warning[500],
              borderRadius: '3px 3px 0 0',
              opacity: 0.75,
              cursor: 'pointer',
              transition: `all ${theme.transitions.fast}`,
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.transform = 'scaleY(1.02)';
              e.currentTarget.style.transformOrigin = 'bottom';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '0.75';
              e.currentTarget.style.transform = 'scaleY(1)';
            }}
            title={`${value}`}
          />
        ))}
      </div>

      {/* Chart Labels */}
      {chart.labels && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.tertiary,
          marginTop: '4px'
        }}>
          <span>{chart.labels[0]}</span>
          <span>{chart.labels[1]}</span>
        </div>
      )}

      {/* Insight */}
      {chart.insight && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginTop: '16px',
          padding: '10px 14px',
          background: `${theme.colors.warning[500]}0D`,
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary
        }}>
          <TrendingUp size={16} strokeWidth={1.5} style={{ color: theme.colors.warning[500] }} />
          <span>{chart.insight}</span>
        </div>
      )}
    </div>
  );
}

FacetAnalytics.propTypes = {
  data: PropTypes.shape({
    chart: PropTypes.shape({
      bars: PropTypes.arrayOf(PropTypes.number),
      labels: PropTypes.arrayOf(PropTypes.string),
      insight: PropTypes.string
    })
  }).isRequired
};
