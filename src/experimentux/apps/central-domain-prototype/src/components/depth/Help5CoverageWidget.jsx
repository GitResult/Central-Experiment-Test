/**
 * Help5CoverageWidget
 * Small widget showing Help5 coverage percentage for a container
 */

import PropTypes from 'prop-types';
import { HelpCircle, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { theme } from '../../config/theme';

export function Help5CoverageWidget({ coverage, trend, size = 'medium', onClick }) {
  const getTrendIcon = () => {
    const iconSize = size === 'small' ? 12 : 14;
    switch (trend) {
      case 'improving':
        return <TrendingUp size={iconSize} color={theme.colors.success[500]} />;
      case 'declining':
        return <TrendingDown size={iconSize} color={theme.colors.error[500]} />;
      default:
        return <Minus size={iconSize} color={theme.colors.neutral[500]} />;
    }
  };

  const getCoverageColor = () => {
    if (coverage >= 90) return theme.colors.success[500];
    if (coverage >= 70) return theme.colors.warning[500];
    return theme.colors.error[500];
  };

  const sizes = {
    small: {
      padding: theme.spacing[2],
      fontSize: theme.typography.fontSize.xs,
      iconSize: 14
    },
    medium: {
      padding: theme.spacing[3],
      fontSize: theme.typography.fontSize.sm,
      iconSize: 16
    },
    large: {
      padding: theme.spacing[4],
      fontSize: theme.typography.fontSize.base,
      iconSize: 20
    }
  };

  const sizeConfig = sizes[size];

  return (
    <div
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: theme.spacing[2],
        padding: sizeConfig.padding,
        backgroundColor: theme.colors.background.elevated,
        border: `1px solid ${getCoverageColor()}`,
        borderRadius: theme.borderRadius.md,
        cursor: onClick ? 'pointer' : 'default',
        transition: `all ${theme.transitions.fast}`,
        boxShadow: theme.shadows.sm
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = theme.shadows.md;
          e.currentTarget.style.transform = 'translateY(-1px)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.boxShadow = theme.shadows.sm;
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      <HelpCircle size={sizeConfig.iconSize} color={getCoverageColor()} />
      <span
        style={{
          fontSize: sizeConfig.fontSize,
          fontWeight: theme.typography.fontWeight.semibold,
          color: getCoverageColor()
        }}
      >
        {coverage}%
      </span>
      {trend && getTrendIcon()}
    </div>
  );
}

Help5CoverageWidget.propTypes = {
  coverage: PropTypes.number.isRequired,
  trend: PropTypes.oneOf(['improving', 'stable', 'declining']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  onClick: PropTypes.func
};

Help5CoverageWidget.defaultProps = {
  trend: 'stable',
  size: 'medium'
};

export default Help5CoverageWidget;
