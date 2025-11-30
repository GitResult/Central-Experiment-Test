/**
 * PresenterNotes
 * Speaker notes panel (only visible in presenter view)
 */

import PropTypes from 'prop-types';
import { FileText } from 'lucide-react';
import { theme } from '../../config/theme';

export function PresenterNotes({ notes }) {
  const hasNotes = notes && notes.trim() !== '';

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.md,
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: theme.spacing[3],
        borderBottom: `1px solid ${theme.colors.border.default}`,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[2],
        backgroundColor: theme.colors.background.secondary
      }}>
        <FileText size={16} color={theme.colors.text.secondary} />
        <span style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary
        }}>
          Speaker Notes
        </span>
      </div>

      {/* Notes Content */}
      <div style={{
        flex: 1,
        padding: theme.spacing[4],
        overflowY: 'auto'
      }}>
        {hasNotes ? (
          <div style={{
            fontSize: theme.typography.fontSize.sm,
            lineHeight: '1.6',
            color: theme.colors.text.primary,
            whiteSpace: 'pre-wrap'
          }}>
            {notes}
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            color: theme.colors.text.tertiary,
            textAlign: 'center'
          }}>
            <FileText size={48} style={{ marginBottom: theme.spacing[3], opacity: 0.3 }} />
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              margin: 0
            }}>
              No speaker notes for this slide
            </p>
            <p style={{
              fontSize: theme.typography.fontSize.xs,
              margin: 0,
              marginTop: theme.spacing[2]
            }}>
              Add notes in markdown using &lt;!-- ... --&gt;
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

PresenterNotes.propTypes = {
  notes: PropTypes.string
};

export default PresenterNotes;
