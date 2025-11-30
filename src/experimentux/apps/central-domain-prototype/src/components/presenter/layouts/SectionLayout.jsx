/**
 * SectionLayout
 * Section divider (minimal, just title)
 */

import PropTypes from 'prop-types';
import { theme } from '../../../config/theme';

export function SectionLayout({ html }) {
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
      backgroundColor: theme.colors.primary[600],
      color: theme.colors.text.inverse
    }}>
      <div
        className="slide-content"
        dangerouslySetInnerHTML={{ __html: html }}
        style={{
          fontSize: theme.typography.fontSize['4xl'],
          fontWeight: theme.typography.fontWeight.bold,
          lineHeight: '1.2',
          maxWidth: '900px',
          borderLeft: `8px solid ${theme.colors.text.inverse}`,
          paddingLeft: theme.spacing[8]
        }}
      />
    </div>
  );
}

SectionLayout.propTypes = {
  html: PropTypes.string.isRequired
};

export default SectionLayout;
