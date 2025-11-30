/**
 * DefaultLayout
 * Standard content slide layout
 */

import PropTypes from 'prop-types';
import { theme } from '../../../config/theme';

export function DefaultLayout({ html }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing[12],
      backgroundColor: theme.colors.background.elevated,
      color: theme.colors.text.primary,
      fontSize: theme.typography.fontSize['2xl'],
      lineHeight: '1.6'
    }}>
      <div
        className="slide-content"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      />
    </div>
  );
}

DefaultLayout.propTypes = {
  html: PropTypes.string.isRequired
};

export default DefaultLayout;
