/**
 * TitleLayout
 * Full-screen title slide (centered, large text)
 */

import PropTypes from 'prop-types';
import { theme } from '../../../config/theme';

export function TitleLayout({ html }) {
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
      backgroundColor: theme.colors.primary[500],
      color: theme.colors.text.inverse
    }}>
      <div
        className="slide-content"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: theme.typography.fontSize['5xl'],
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: '1.2',
          maxWidth: '1000px'
        }}
      />
    </div>
  );
}

TitleLayout.propTypes = {
  html: PropTypes.string.isRequired
};

export default TitleLayout;
