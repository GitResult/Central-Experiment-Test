/**
 * Help5ContextCard
 * Displays Help5 context (5W) for a discussion element
 */

import PropTypes from 'prop-types';
import { HelpCircle, Clock, AlertCircle } from 'lucide-react';
import { theme } from '../../config/theme';

export function Help5ContextCard({ help5, onEdit, compact = false }) {
  if (!help5) {
    return (
      <div style={{
        padding: theme.spacing[4],
        backgroundColor: theme.colors.background.secondary,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius.md,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[3]
      }}>
        <AlertCircle size={20} color={theme.colors.warning[500]} />
        <div>
          <p style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            margin: 0
          }}>
            No Help5 context available for this element
          </p>
          {onEdit && (
            <button
              onClick={onEdit}
              style={{
                marginTop: theme.spacing[2],
                padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                backgroundColor: theme.colors.primary[500],
                color: theme.colors.text.inverse,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                cursor: 'pointer'
              }}
            >
              Create Help5
            </button>
          )}
        </div>
      </div>
    );
  }

  const content = help5.content || {};
  const isComplete = content.what && content.who && content.where && content.when && content.why;
  const completionScore = help5.completionScore || 0;

  // Check if outdated (>6 months)
  const isOutdated = help5.updated_at
    ? new Date() - new Date(help5.updated_at) > 180 * 24 * 60 * 60 * 1000
    : false;

  if (compact) {
    return (
      <div style={{
        padding: theme.spacing[3],
        backgroundColor: theme.colors.background.elevated,
        border: `1px solid ${isComplete ? theme.colors.success[500] : theme.colors.warning[500]}`,
        borderRadius: theme.borderRadius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing[3]
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <HelpCircle size={16} color={isComplete ? theme.colors.success[500] : theme.colors.warning[500]} />
          <span style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.medium
          }}>
            Help5 Context
          </span>
          <span style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            backgroundColor: theme.colors.background.secondary,
            padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
            borderRadius: theme.borderRadius.full
          }}>
            {completionScore}% complete
          </span>
          {isOutdated && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[1],
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.warning[500]
            }}>
              <Clock size={12} />
              <span>Outdated</span>
            </div>
          )}
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
              backgroundColor: 'transparent',
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              cursor: 'pointer',
              transition: `all ${theme.transitions.fast}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Edit
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{
      padding: theme.spacing[4],
      backgroundColor: theme.colors.background.elevated,
      border: `1px solid ${isComplete ? theme.colors.success[500] : theme.colors.warning[500]}`,
      borderRadius: theme.borderRadius.md
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing[3],
        paddingBottom: theme.spacing[3],
        borderBottom: `1px solid ${theme.colors.border.default}`
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <HelpCircle size={20} color={isComplete ? theme.colors.success[500] : theme.colors.warning[500]} />
          <h3 style={{
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            margin: 0
          }}>
            Help5 Context
          </h3>
          <span style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            backgroundColor: theme.colors.background.secondary,
            padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
            borderRadius: theme.borderRadius.full
          }}>
            {completionScore}% complete
          </span>
          {isOutdated && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[1],
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.warning[500],
              backgroundColor: theme.colors.warning[50],
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              borderRadius: theme.borderRadius.full
            }}>
              <Clock size={12} />
              <span>Outdated ({getTimeAgo(help5.updated_at)})</span>
            </div>
          )}
        </div>
        {onEdit && (
          <button
            onClick={onEdit}
            style={{
              padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
              backgroundColor: theme.colors.primary[500],
              color: theme.colors.text.inverse,
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              cursor: 'pointer',
              fontWeight: theme.typography.fontWeight.medium
            }}
          >
            Edit Context
          </button>
        )}
      </div>

      {/* 5W Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[3] }}>
        <Help5Field label="What" value={content.what} />
        <Help5Field label="Who" value={content.who} />
        <Help5Field label="Where" value={content.where} />
        <Help5Field label="When" value={content.when} />
        <Help5Field label="Why" value={content.why} isRequired />
      </div>
    </div>
  );
}

function Help5Field({ label, value, isRequired }) {
  const isEmpty = !value || value.trim() === '';

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1], marginBottom: theme.spacing[1] }}>
        <span style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary
        }}>
          {label}
        </span>
        {isRequired && (
          <span style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.error[500],
            fontWeight: theme.typography.fontWeight.medium
          }}>
            *
          </span>
        )}
      </div>
      <p style={{
        fontSize: theme.typography.fontSize.sm,
        color: isEmpty ? theme.colors.text.tertiary : theme.colors.text.secondary,
        margin: 0,
        fontStyle: isEmpty ? 'italic' : 'normal',
        lineHeight: '1.5'
      }}>
        {isEmpty ? `No ${label.toLowerCase()} information provided` : value}
      </p>
    </div>
  );
}

function getTimeAgo(dateString) {
  if (!dateString) return 'unknown';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths > 12) {
    const years = Math.floor(diffMonths / 12);
    return `${years} year${years > 1 ? 's' : ''} ago`;
  }
  if (diffMonths > 0) {
    return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  }
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  }
  return 'today';
}

Help5ContextCard.propTypes = {
  help5: PropTypes.shape({
    record_id: PropTypes.string,
    record_type: PropTypes.string,
    parent_id: PropTypes.string,
    content: PropTypes.shape({
      what: PropTypes.string,
      who: PropTypes.string,
      where: PropTypes.string,
      when: PropTypes.string,
      why: PropTypes.string
    }),
    completionScore: PropTypes.number,
    updated_at: PropTypes.string
  }),
  onEdit: PropTypes.func,
  compact: PropTypes.bool
};

Help5Field.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  isRequired: PropTypes.bool
};

export default Help5ContextCard;
