/**
 * CodeLayout
 * Code-focused layout with syntax highlighting
 */

import PropTypes from 'prop-types';
import { theme } from '../../../config/theme';

export function CodeLayout({ html }) {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing[8],
      backgroundColor: theme.colors.background.secondary,
      color: theme.colors.text.primary
    }}>
      <div
        className="slide-content code-layout"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: theme.typography.fontSize.lg,
          lineHeight: '1.8',
          maxWidth: '1400px',
          margin: '0 auto',
          width: '100%',
          fontFamily: 'monospace'
        }}
      />
    </div>
  );
}

CodeLayout.propTypes = {
  html: PropTypes.string.isRequired
};

export default CodeLayout;
