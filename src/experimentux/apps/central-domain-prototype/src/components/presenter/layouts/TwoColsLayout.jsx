/**
 * TwoColsLayout
 * Two-column layout
 */

import PropTypes from 'prop-types';
import { theme } from '../../../config/theme';

export function TwoColsLayout({ html }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing[12],
      backgroundColor: theme.colors.background.elevated,
      color: theme.colors.text.primary
    }}>
      <div
        className="slide-content two-cols"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: theme.typography.fontSize.xl,
          lineHeight: '1.6',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%'
        }}
      />
    </div>
  );
}

TwoColsLayout.propTypes = {
  html: PropTypes.string.isRequired
};

export default TwoColsLayout;
