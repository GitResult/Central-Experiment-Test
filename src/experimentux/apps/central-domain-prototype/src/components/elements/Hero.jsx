/**
 * Hero Element
 * Hero section for landing pages with background image/gradient
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import { resolveThemeToken } from '../../utils/themeResolver';

export function Hero({ data, settings, elements, renderElement }) {
  const { title, subtitle, backgroundImage } = data;
  const {
    height = 'md',
    align = 'center',
    overlay = 'gradient',
    textColor = 'white'
  } = settings.hero || {};

  const heightMap = {
    sm: '20rem',
    md: '28rem',
    lg: '36rem',
    xl: '44rem',
    full: '100vh'
  };

  const alignMap = {
    left: 'flex-start',
    center: 'center',
    right: 'flex-end'
  };

  const overlayStyles = {
    none: 'none',
    dark: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6))',
    gradient: 'linear-gradient(135deg, rgba(97, 114, 243, 0.9), rgba(155, 138, 251, 0.9))',
    light: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))'
  };

  const heroStyle = {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: alignMap[align],
    height: heightMap[height],
    padding: `${theme.spacing[12]} ${theme.spacing[6]}`,
    backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    color: textColor === 'white' ? theme.colors.neutral[0] : theme.colors.text.primary,
    textAlign: align,
    overflow: 'hidden'
  };

  const overlayStyle = {
    position: 'absolute',
    inset: '0',
    background: overlayStyles[overlay] || overlayStyles.gradient,
    zIndex: 1
  };

  const contentStyle = {
    position: 'relative',
    zIndex: 2,
    maxWidth: theme.layout.maxWidth.lg,
    width: '100%'
  };

  const titleStyle = {
    fontSize: theme.typography.fontSize['5xl'],
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: theme.typography.lineHeight.tight,
    marginBottom: theme.spacing[4]
  };

  const subtitleStyle = {
    fontSize: theme.typography.fontSize.xl,
    lineHeight: theme.typography.lineHeight.relaxed,
    opacity: 0.9,
    marginBottom: theme.spacing[8]
  };

  return (
    <div style={heroStyle}>
      {overlay !== 'none' && <div style={overlayStyle} />}
      <div style={contentStyle}>
        {title && <h1 style={titleStyle}>{title}</h1>}
        {subtitle && <p style={subtitleStyle}>{subtitle}</p>}
        <div style={{ display: 'flex', gap: theme.spacing[4], justifyContent: align }}>
          {elements?.map((element, index) => renderElement?.(element, index))}
        </div>
      </div>
    </div>
  );
}

Hero.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string,
    subtitle: PropTypes.string,
    backgroundImage: PropTypes.string
  }).isRequired,
  settings: PropTypes.shape({
    hero: PropTypes.shape({
      height: PropTypes.oneOf(['sm', 'md', 'lg', 'xl', 'full']),
      align: PropTypes.oneOf(['left', 'center', 'right']),
      overlay: PropTypes.oneOf(['none', 'dark', 'gradient', 'light']),
      textColor: PropTypes.oneOf(['white', 'dark'])
    })
  }).isRequired,
  elements: PropTypes.array,
  renderElement: PropTypes.func
};
