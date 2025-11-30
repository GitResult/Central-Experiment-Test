/**
 * ResolutionActions
 * Actions for resolving/reopening discussions and updating Help5
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, RotateCcw, Lightbulb, AlertCircle } from 'lucide-react';
import { theme } from '../../config/theme';

export function ResolutionActions({
  thread,
  help5Context,
  onResolve,
  onReopen,
  generateHelp5Suggestion
}) {
  const [showHelp5Update, setShowHelp5Update] = useState(false);
  const [help5Update, setHelp5Update] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const isResolved = thread.status === 'resolved';

  const handleGenerateSuggestion = () => {
    setIsGenerating(true);
    try {
      const suggestion = generateHelp5Suggestion(thread.id);
      if (suggestion) {
        setHelp5Update({
          why: suggestion.why,
          confidence: suggestion.confidence
        });
        setShowHelp5Update(true);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleResolve = () => {
    if (showHelp5Update && help5Update) {
      // Resolve with Help5 update
      onResolve(help5Update);
    } else {
      // Resolve without Help5 update
      onResolve(null);
    }
    setShowHelp5Update(false);
    setHelp5Update(null);
  };

  const handleCancelHelp5 = () => {
    setShowHelp5Update(false);
    setHelp5Update(null);
  };

  if (isResolved) {
    return (
      <div style={{
        padding: theme.spacing[4],
        backgroundColor: theme.colors.success[50],
        border: `1px solid ${theme.colors.success[500]}`,
        borderRadius: theme.borderRadius.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <CheckCircle size={20} color={theme.colors.success[600]} />
          <div>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.success[700],
              margin: 0,
              marginBottom: theme.spacing[1]
            }}>
              Discussion Resolved
            </p>
            <p style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.success[600],
              margin: 0
            }}>
              {thread.resolvedAt ? `Resolved ${formatTimestamp(thread.resolvedAt)}` : 'Resolved'}
              {thread.help5Update && ' • Help5 context updated'}
            </p>
          </div>
        </div>
        <button
          onClick={onReopen}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            backgroundColor: theme.colors.background.elevated,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            cursor: 'pointer',
            fontWeight: theme.typography.fontWeight.medium,
            transition: `all ${theme.transitions.fast}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.background.elevated;
          }}
        >
          <RotateCcw size={16} />
          Reopen Discussion
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: theme.spacing[4],
      backgroundColor: theme.colors.background.secondary,
      border: `1px solid ${theme.colors.border.default}`,
      borderRadius: theme.borderRadius.md
    }}>
      {/* Help5 Update Section */}
      {showHelp5Update && help5Update ? (
        <div style={{
          marginBottom: theme.spacing[4],
          padding: theme.spacing[4],
          backgroundColor: theme.colors.primary[50],
          border: `1px solid ${theme.colors.primary[200]}`,
          borderRadius: theme.borderRadius.md
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            marginBottom: theme.spacing[3]
          }}>
            <Lightbulb size={20} color={theme.colors.primary[600]} />
            <h4 style={{
              fontSize: theme.typography.fontSize.base,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              margin: 0
            }}>
              Suggested Help5 Update
            </h4>
            <span style={{
              padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
              backgroundColor: theme.colors.background.elevated,
              borderRadius: theme.borderRadius.full,
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              fontWeight: theme.typography.fontWeight.medium
            }}>
              {help5Update.confidence} confidence
            </span>
          </div>

          <div style={{ marginBottom: theme.spacing[3] }}>
            <label style={{
              display: 'block',
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[2]
            }}>
              Why (Purpose/Rationale)
            </label>
            <textarea
              value={help5Update.why}
              onChange={(e) => setHelp5Update({ ...help5Update, why: e.target.value })}
              placeholder="Edit the suggested Why context..."
              style={{
                width: '100%',
                minHeight: '100px',
                padding: theme.spacing[3],
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.background.elevated,
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {!help5Context && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2],
              padding: theme.spacing[3],
              backgroundColor: theme.colors.warning[50],
              border: `1px solid ${theme.colors.warning[200]}`,
              borderRadius: theme.borderRadius.md,
              marginBottom: theme.spacing[3]
            }}>
              <AlertCircle size={16} color={theme.colors.warning[600]} />
              <p style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.warning[700],
                margin: 0
              }}>
                This will create a new Help5 record for this element
              </p>
            </div>
          )}

          <div style={{ display: 'flex', gap: theme.spacing[2] }}>
            <button
              onClick={handleCancelHelp5}
              style={{
                padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}

      {/* Action Buttons */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: theme.spacing[3]
      }}>
        <div style={{ display: 'flex', gap: theme.spacing[2] }}>
          {!showHelp5Update && (
            <button
              onClick={handleGenerateSuggestion}
              disabled={isGenerating || thread.messages.length === 0}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.primary[500]}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.primary[600],
                cursor: isGenerating || thread.messages.length === 0 ? 'not-allowed' : 'pointer',
                opacity: isGenerating || thread.messages.length === 0 ? 0.5 : 1,
                fontWeight: theme.typography.fontWeight.medium,
                transition: `all ${theme.transitions.fast}`
              }}
              onMouseEnter={(e) => {
                if (!isGenerating && thread.messages.length > 0) {
                  e.currentTarget.style.backgroundColor = theme.colors.primary[50];
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Lightbulb size={16} />
              {isGenerating ? 'Generating...' : 'Suggest Help5 Update'}
            </button>
          )}
        </div>

        <button
          onClick={handleResolve}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            backgroundColor: theme.colors.success[500],
            border: 'none',
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.inverse,
            cursor: 'pointer',
            fontWeight: theme.typography.fontWeight.medium,
            transition: `all ${theme.transitions.fast}`
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.success[600];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.success[500];
          }}
        >
          <CheckCircle size={16} />
          {showHelp5Update && help5Update ? 'Resolve & Update Help5' : 'Resolve Discussion'}
        </button>
      </div>
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

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

ResolutionActions.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['open', 'resolved']).isRequired,
    messages: PropTypes.array.isRequired,
    resolvedAt: PropTypes.string,
    help5Update: PropTypes.object
  }).isRequired,
  help5Context: PropTypes.object,
  onResolve: PropTypes.func.isRequired,
  onReopen: PropTypes.func.isRequired,
  generateHelp5Suggestion: PropTypes.func.isRequired
};

export default ResolutionActions;
