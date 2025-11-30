/**
 * Step 4: Preview
 * Preview generated pages before finalizing
 */

import PropTypes from 'prop-types';
import { FileText, CheckCircle } from 'lucide-react';
import { theme } from '../../../config/theme';

export function Step4_Preview({ generatedPages, entityName }) {
  if (!generatedPages || generatedPages.length === 0) {
    return (
      <div style={{ padding: theme.spacing[6], textAlign: 'center' }}>
        <p style={{ color: theme.colors.text.tertiary }}>No pages generated</p>
      </div>
    );
  }

  return (
    <div style={{ padding: theme.spacing[6] }}>
      <h2 style={{
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
        marginBottom: theme.spacing[2],
        color: theme.colors.text.primary
      }}>
        Preview Generated Pages
      </h2>
      <p style={{
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing[6]
      }}>
        {generatedPages.length} page{generatedPages.length > 1 ? 's' : ''} ready to be created
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: theme.spacing[4]
      }}>
        {generatedPages.map((page, index) => (
          <div
            key={index}
            style={{
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[4],
              backgroundColor: theme.colors.background.elevated,
              transition: `all ${theme.transitions.base}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = theme.shadows.md;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2], marginBottom: theme.spacing[3] }}>
              <CheckCircle size={20} color={theme.colors.success[500]} />
              <h3 style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                margin: 0
              }}>
                {page.name}
              </h3>
            </div>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.tertiary,
              marginBottom: theme.spacing[3]
            }}>
              {page.description}
            </p>
            <div style={{
              padding: theme.spacing[2],
              backgroundColor: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.sm,
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.secondary
            }}>
              {page.zones[0]?.rows?.length || 0} sections
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: theme.spacing[6],
        padding: theme.spacing[4],
        backgroundColor: theme.colors.success[50],
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${theme.colors.success[200]}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <CheckCircle size={20} color={theme.colors.success[600]} />
          <span style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.success[700]
          }}>
            Ready to generate! Click "Finalize" to create these pages.
          </span>
        </div>
      </div>
    </div>
  );
}

Step4_Preview.propTypes = {
  generatedPages: PropTypes.array.isRequired,
  entityName: PropTypes.string.isRequired
};

export default Step4_Preview;
