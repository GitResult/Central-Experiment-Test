/**
 * Icon Element
 * Wrapper for lucide-react icons with consistent sizing and styling
 */

import PropTypes from 'prop-types';
import * as Icons from 'lucide-react';
import { theme } from '../../config/theme';
import { resolveThemeToken } from '../../utils/themeResolver';

export function Icon({ data, settings }) {
  const { iconName = 'CircleHelp' } = data;
  const {
    size = 'md',
    color,
    strokeWidth = '2'
  } = settings.icon || {};

  // Size mapping
  const sizeMap = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
    '2xl': 40
  };

  const IconComponent = Icons[iconName] || Icons.CircleHelp;
  const iconSize = typeof size === 'number' ? size : (sizeMap[size] || sizeMap.md);
  const resolvedColor = resolveThemeToken(color) || theme.colors.text.secondary;

  return (
    <IconComponent
      size={iconSize}
      strokeWidth={strokeWidth}
      color={resolvedColor}
      style={{
        flexShrink: 0,
        display: 'inline-block',
        verticalAlign: 'middle'
      }}
    />
  );
}

Icon.propTypes = {
  data: PropTypes.shape({
    iconName: PropTypes.string
  }).isRequired,
  settings: PropTypes.shape({
    icon: PropTypes.shape({
      size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      color: PropTypes.string,
      strokeWidth: PropTypes.string
    })
  }).isRequired
};
