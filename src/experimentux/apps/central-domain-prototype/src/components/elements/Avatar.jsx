/**
 * Avatar Element
 * Professional avatar with image, initials fallback, and status indicator
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import { resolveThemeToken } from '../../utils/themeResolver';

export function Avatar({ data, settings }) {
  const { src, alt, initials, name } = data;
  const {
    size = 'md',
    shape = 'circle',
    status,
    statusPosition = 'bottom-right'
  } = settings.avatar || {};

  // Size mapping
  const sizeMap = {
    xs: '1.5rem',    // 24px
    sm: '2rem',      // 32px
    md: '2.5rem',    // 40px
    lg: '3rem',      // 48px
    xl: '4rem',      // 64px
    '2xl': '5rem'    // 80px
  };

  const statusSizeMap = {
    xs: '0.375rem',
    sm: '0.5rem',
    md: '0.625rem',
    lg: '0.75rem',
    xl: '0.875rem',
    '2xl': '1rem'
  };

  const statusColorMap = {
    online: theme.colors.success[500],
    busy: theme.colors.error[500],
    away: theme.colors.warning[500],
    offline: theme.colors.neutral[400]
  };

  const avatarSize = sizeMap[size] || sizeMap.md;
  const statusSize = statusSizeMap[size] || statusSizeMap.md;

  // Generate initials from name if not provided
  const displayInitials = initials || (name
    ? name
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : '?');

  const containerStyle = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: avatarSize,
    height: avatarSize,
    borderRadius: shape === 'circle' ? theme.borderRadius.full : theme.borderRadius.md,
    backgroundColor: theme.colors.primary[100],
    color: theme.colors.primary[700],
    fontSize: `calc(${avatarSize} * 0.4)`,
    fontWeight: theme.typography.fontWeight.medium,
    overflow: 'hidden',
    flexShrink: 0
  };

  const imgStyle = {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  };

  const statusIndicatorStyle = {
    position: 'absolute',
    width: statusSize,
    height: statusSize,
    borderRadius: theme.borderRadius.full,
    backgroundColor: statusColorMap[status] || statusColorMap.offline,
    border: `2px solid ${theme.colors.background.primary}`,
    ...getStatusPosition(statusPosition)
  };

  function getStatusPosition(position) {
    const offset = '-0.125rem';
    const positions = {
      'top-left': { top: offset, left: offset },
      'top-right': { top: offset, right: offset },
      'bottom-left': { bottom: offset, left: offset },
      'bottom-right': { bottom: offset, right: offset }
    };
    return positions[position] || positions['bottom-right'];
  }

  return (
    <div style={containerStyle}>
      {src ? (
        <img src={src} alt={alt || name || 'Avatar'} style={imgStyle} />
      ) : (
        <span>{displayInitials}</span>
      )}
      {status && <div style={statusIndicatorStyle} />}
    </div>
  );
}

Avatar.propTypes = {
  data: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
    initials: PropTypes.string,
    name: PropTypes.string
  }).isRequired,
  settings: PropTypes.shape({
    avatar: PropTypes.shape({
      size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
      shape: PropTypes.oneOf(['circle', 'square']),
      status: PropTypes.oneOf(['online', 'busy', 'away', 'offline']),
      statusPosition: PropTypes.oneOf(['top-left', 'top-right', 'bottom-left', 'bottom-right'])
    })
  }).isRequired
};
