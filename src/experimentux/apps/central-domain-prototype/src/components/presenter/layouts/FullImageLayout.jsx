/**
 * FullImageLayout
 * Background image with overlay text
 */

import PropTypes from 'prop-types';
import { theme } from '../../../config/theme';

export function FullImageLayout({ html, backgroundImage }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      padding: theme.spacing[16],
      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundColor: theme.colors.background.secondary,
      color: theme.colors.text.inverse,
      position: 'relative'
    }}>
      {/* Dark overlay for better text readability */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 1
      }} />

      <div
        className="slide-content"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: theme.typography.fontSize['3xl'],
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: '1.4',
          maxWidth: '1000px',
          position: 'relative',
          zIndex: 2,
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)'
        }}
      />
    </div>
  );
}

FullImageLayout.propTypes = {
  html: PropTypes.string.isRequired,
  backgroundImage: PropTypes.string
};

export default FullImageLayout;
