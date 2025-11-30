/**
 * DiscussionMessage
 * Displays a single message in a discussion thread
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { User, Edit2, Trash2, Check, X } from 'lucide-react';
import { theme } from '../../config/theme';

export function DiscussionMessage({ message, currentUserId, onEdit, onDelete, isResolution = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const isOwner = message.userId === currentUserId;
  const formattedTime = formatTimestamp(message.timestamp);

  const handleSaveEdit = () => {
    if (editedContent.trim() !== '' && editedContent !== message.content) {
      onEdit(message.id, editedContent);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      onDelete(message.id);
    }
  };

  return (
    <div style={{
      padding: theme.spacing[3],
      backgroundColor: isResolution ? theme.colors.success[50] : theme.colors.background.secondary,
      border: isResolution ? `1px solid ${theme.colors.success[500]}` : 'none',
      borderRadius: theme.borderRadius.md,
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing[2]
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: theme.colors.primary[500],
            color: theme.colors.text.inverse,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold
          }}>
            {message.userName ? message.userName.charAt(0).toUpperCase() : <User size={16} />}
          </div>
          <div>
            <div style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary
            }}>
              {message.userName || 'Unknown User'}
              {isResolution && (
                <span style={{
                  marginLeft: theme.spacing[2],
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.success[600],
                  backgroundColor: theme.colors.success[100],
                  padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                  borderRadius: theme.borderRadius.full,
                  fontWeight: theme.typography.fontWeight.semibold
                }}>
                  Resolution
                </span>
              )}
            </div>
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary
            }}>
              {formattedTime}
              {message.edited && (
                <span style={{ marginLeft: theme.spacing[1], fontStyle: 'italic' }}>
                  (edited {message.editedAt ? formatTimestamp(message.editedAt) : ''})
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions (only for message owner and not in edit mode) */}
        {isOwner && !isEditing && !isResolution && (
          <div style={{ display: 'flex', gap: theme.spacing[1] }}>
            <button
              onClick={() => setIsEditing(true)}
              style={{
                padding: theme.spacing[1],
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                color: theme.colors.text.tertiary,
                display: 'flex',
                alignItems: 'center',
                transition: `all ${theme.transitions.fast}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
                e.currentTarget.style.color = theme.colors.text.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.text.tertiary;
              }}
              title="Edit message"
            >
              <Edit2 size={14} />
            </button>
            <button
              onClick={handleDelete}
              style={{
                padding: theme.spacing[1],
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                color: theme.colors.text.tertiary,
                display: 'flex',
                alignItems: 'center',
                transition: `all ${theme.transitions.fast}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = theme.colors.error[50];
                e.currentTarget.style.color = theme.colors.error[500];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = theme.colors.text.tertiary;
              }}
              title="Delete message"
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {isEditing ? (
        <div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            style={{
              width: '100%',
              minHeight: '80px',
              padding: theme.spacing[2],
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              backgroundColor: theme.colors.background.elevated,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            autoFocus
          />
          <div style={{
            display: 'flex',
            gap: theme.spacing[2],
            marginTop: theme.spacing[2]
          }}>
            <button
              onClick={handleSaveEdit}
              disabled={editedContent.trim() === ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[1],
                padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                backgroundColor: theme.colors.primary[500],
                color: theme.colors.text.inverse,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                cursor: editedContent.trim() === '' ? 'not-allowed' : 'pointer',
                opacity: editedContent.trim() === '' ? 0.5 : 1,
                fontWeight: theme.typography.fontWeight.medium
              }}
            >
              <Check size={14} />
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[1],
                padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary,
                cursor: 'pointer'
              }}
            >
              <X size={14} />
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.primary,
          margin: 0,
          lineHeight: '1.5',
          whiteSpace: 'pre-wrap'
        }}>
          {message.content}
        </p>
      )}
    </div>
  );
}

function formatTimestamp(timestamp) {
  if (!timestamp) return '';

  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // Less than 1 minute
  if (diffMins < 1) return 'Just now';

  // Less than 1 hour
  if (diffMins < 60) return `${diffMins}m ago`;

  // Less than 24 hours
  if (diffHours < 24) return `${diffHours}h ago`;

  // Less than 7 days
  if (diffDays < 7) return `${diffDays}d ago`;

  // More than 7 days - show date
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

DiscussionMessage.propTypes = {
  message: PropTypes.shape({
    id: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    timestamp: PropTypes.string.isRequired,
    edited: PropTypes.bool,
    editedAt: PropTypes.string
  }).isRequired,
  currentUserId: PropTypes.string.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isResolution: PropTypes.bool
};

export default DiscussionMessage;
