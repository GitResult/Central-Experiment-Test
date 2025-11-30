/**
 * Badge Element
 * Status badges, tags, and labels with variants
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import { resolveThemeToken } from '../../utils/themeResolver';

export function Badge({ data, settings }) {
  const { label } = data;
  const {
    variant = 'neutral',
    size = 'md',
    dot = false
  } = settings.badge || {};

  // Variant color mapping
  const variantStyles = {
    neutral: {
      bg: theme.colors.neutral[100],
      text: theme.colors.neutral[700],
      border: theme.colors.neutral[200]
    },
    primary: {
      bg: theme.colors.primary[50],
      text: theme.colors.primary[700],
      border: theme.colors.primary[200]
    },
    success: {
      bg: theme.colors.success[50],
      text: theme.colors.success[700],
      border: theme.colors.success[200]
    },
    warning: {
      bg: theme.colors.warning[50],
      text: theme.colors.warning[700],
      border: theme.colors.warning[200]
    },
    error: {
      bg: theme.colors.error[50],
      text: theme.colors.error[700],
      border: theme.colors.error[200]
    },
    info: {
      bg: theme.colors.primary[50],
      text: theme.colors.primary[700],
      border: theme.colors.primary[200]
    }
  };

  // Size mapping
  const sizeStyles = {
    sm: {
      fontSize: theme.typography.fontSize.xs,
      padding: `${theme.spacing[0.5]} ${theme.spacing[2]}`,
      height: '1.25rem'
    },
    md: {
      fontSize: theme.typography.fontSize.sm,
      padding: `${theme.spacing[1]} ${theme.spacing[2.5]}`,
      height: '1.5rem'
    },
    lg: {
      fontSize: theme.typography.fontSize.base,
      padding: `${theme.spacing[1.5]} ${theme.spacing[3]}`,
      height: '1.75rem'
    }
  };

  const colors = variantStyles[variant] || variantStyles.neutral;
  const sizing = sizeStyles[size] || sizeStyles.md;

  const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing[1.5],
    backgroundColor: colors.bg,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: theme.borderRadius.full,
    fontWeight: theme.typography.fontWeight.medium,
    lineHeight: theme.typography.lineHeight.none,
    whiteSpace: 'nowrap',
    transition: `all ${theme.transitions.fast}`,
    ...sizing
  };

  const dotStyle = {
    width: '0.375rem',
    height: '0.375rem',
    borderRadius: theme.borderRadius.full,
    backgroundColor: colors.text,
    flexShrink: 0
  };

  return (
    <span style={badgeStyle}>
      {dot && <span style={dotStyle} />}
      {label}
    </span>
  );
}

Badge.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired
  }).isRequired,
  settings: PropTypes.shape({
    badge: PropTypes.shape({
      variant: PropTypes.oneOf(['neutral', 'primary', 'success', 'warning', 'error', 'info']),
      size: PropTypes.oneOf(['sm', 'md', 'lg']),
      dot: PropTypes.bool
    })
  }).isRequired
};
