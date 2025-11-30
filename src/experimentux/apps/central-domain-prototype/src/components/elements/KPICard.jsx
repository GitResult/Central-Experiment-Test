/**
 * KPI Card Element
 * Key Performance Indicator card for dashboards
 */

import PropTypes from 'prop-types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { theme } from '../../config/theme';

export function KPICard({ data, settings }) {
  const { label, value, change, changeType = 'neutral', suffix, prefix } = data;
  const { size = 'md' } = settings.kpi || {};

  const sizeStyles = {
    sm: {
      padding: theme.spacing[4],
      valueFontSize: theme.typography.fontSize['2xl'],
      labelFontSize: theme.typography.fontSize.sm
    },
    md: {
      padding: theme.spacing[6],
      valueFontSize: theme.typography.fontSize['4xl'],
      labelFontSize: theme.typography.fontSize.base
    },
    lg: {
      padding: theme.spacing[8],
      valueFontSize: theme.typography.fontSize['5xl'],
      labelFontSize: theme.typography.fontSize.lg
    }
  };

  const changeTypeStyles = {
    positive: {
      color: theme.colors.success[600],
      icon: TrendingUp,
      bg: theme.colors.success[50]
    },
    negative: {
      color: theme.colors.error[600],
      icon: TrendingDown,
      bg: theme.colors.error[50]
    },
    neutral: {
      color: theme.colors.neutral[600],
      icon: Minus,
      bg: theme.colors.neutral[100]
    }
  };

  const sizing = sizeStyles[size] || sizeStyles.md;
  const changeStyle = changeTypeStyles[changeType] || changeTypeStyles.neutral;
  const ChangeIcon = changeStyle.icon;

  const cardStyle = {
    backgroundColor: theme.colors.background.elevated,
    border: `1px solid ${theme.colors.border.default}`,
    borderRadius: theme.borderRadius.lg,
    padding: sizing.padding,
    boxShadow: theme.shadows.sm,
    transition: `all ${theme.transitions.base}`
  };

  const labelStyle = {
    fontSize: sizing.labelFontSize,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[2]
  };

  const valueContainerStyle = {
    display: 'flex',
    alignItems: 'baseline',
    gap: theme.spacing[1],
    marginBottom: theme.spacing[2]
  };

  const valueStyle = {
    fontSize: sizing.valueFontSize,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    lineHeight: theme.typography.lineHeight.tight
  };

  const affixStyle = {
    fontSize: `calc(${sizing.valueFontSize} * 0.6)`,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary
  };

  const changeContainerStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing[1],
    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
    backgroundColor: changeStyle.bg,
    borderRadius: theme.borderRadius.md,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: changeStyle.color
  };

  return (
    <div style={cardStyle}>
      <div style={labelStyle}>{label}</div>
      <div style={valueContainerStyle}>
        {prefix && <span style={affixStyle}>{prefix}</span>}
        <span style={valueStyle}>{value?.toLocaleString()}</span>
        {suffix && <span style={affixStyle}>{suffix}</span>}
      </div>
      {change !== undefined && (
        <div style={changeContainerStyle}>
          <ChangeIcon size={14} strokeWidth={2.5} />
          <span>{Math.abs(change)}%</span>
        </div>
      )}
    </div>
  );
}

KPICard.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    change: PropTypes.number,
    changeType: PropTypes.oneOf(['positive', 'negative', 'neutral']),
    suffix: PropTypes.string,
    prefix: PropTypes.string
  }).isRequired,
  settings: PropTypes.shape({
    kpi: PropTypes.shape({
      size: PropTypes.oneOf(['sm', 'md', 'lg'])
    })
  }).isRequired
};
