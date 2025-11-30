/**
 * EndLayout
 * Thank you / contact slide
 */

import PropTypes from 'prop-types';
import { theme } from '../../../config/theme';

export function EndLayout({ html }) {
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
      backgroundColor: theme.colors.success[500],
      color: theme.colors.text.inverse
    }}>
      <div
        className="slide-content"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: theme.typography.fontSize['4xl'],
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: '1.3',
          maxWidth: '900px'
        }}
      />
    </div>
  );
}

EndLayout.propTypes = {
  html: PropTypes.string.isRequired
};

export default EndLayout;
