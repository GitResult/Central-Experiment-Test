/**
 * QuoteLayout
 * Large quote with attribution
 */

import PropTypes from 'prop-types';
import { theme } from '../../../config/theme';

export function QuoteLayout({ html }) {
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
      backgroundColor: theme.colors.background.elevated,
      color: theme.colors.text.primary
    }}>
      <div
        className="slide-content quote-layout"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: theme.typography.fontSize['3xl'],
          fontStyle: 'italic',
          lineHeight: '1.5',
          maxWidth: '1000px',
          color: theme.colors.primary[600]
        }}
      />
    </div>
  );
}

QuoteLayout.propTypes = {
  html: PropTypes.string.isRequired
};

export default QuoteLayout;
