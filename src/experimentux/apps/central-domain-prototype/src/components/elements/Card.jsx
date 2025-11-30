/**
 * Card Element
 * Content container with optional header, footer, and hover effects
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import { resolveThemeToken } from '../../utils/themeResolver';

export function Card({ data, settings, elements, renderElement }) {
  const { title, subtitle } = data;
  const {
    padding = 'md',
    border = true,
    shadow = 'sm',
    hover = false,
    interactive = false
  } = settings.card || {};

  const paddingMap = {
    none: '0',
    sm: theme.spacing[3],
    md: theme.spacing[4],
    lg: theme.spacing[6]
  };

  const cardStyle = {
    backgroundColor: theme.colors.background.elevated,
    border: border ? `1px solid ${theme.colors.border.default}` : 'none',
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows[shadow] || theme.shadows.sm,
    transition: `all ${theme.transitions.base}`,
    cursor: interactive ? 'pointer' : 'default',
    ...(hover && {
      ':hover': {
        boxShadow: theme.shadows.md,
        borderColor: theme.colors.border.strong
      }
    })
  };

  const headerStyle = {
    padding: paddingMap[padding],
    borderBottom: `1px solid ${theme.colors.border.default}`
  };

  const bodyStyle = {
    padding: paddingMap[padding]
  };

  const titleStyle = {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: subtitle ? theme.spacing[1] : '0'
  };

  const subtitleStyle = {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary
  };

  return (
    <div style={cardStyle} className={hover ? 'card-hover' : ''}>
      {(title || subtitle) && (
        <div style={headerStyle}>
          {title && <div style={titleStyle}>{title}</div>}
          {subtitle && <div style={subtitleStyle}>{subtitle}</div>}
        </div>
      )}
      <div style={bodyStyle}>
        {elements?.map((element, index) => renderElement?.(element, index))}
      </div>
    </div>
  );
}

Card.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string
  }).isRequired,
  settings: PropTypes.shape({
    card: PropTypes.shape({
      padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
      border: PropTypes.bool,
      shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
      hover: PropTypes.bool,
      interactive: PropTypes.bool
    })
  }).isRequired,
  elements: PropTypes.array,
  renderElement: PropTypes.func
};
