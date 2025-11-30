/**
 * DiscussionThread
 * Displays a complete discussion thread with messages
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Send, MessageSquare } from 'lucide-react';
import { theme } from '../../config/theme';
import DiscussionMessage from './DiscussionMessage';
import Help5ContextCard from './Help5ContextCard';

export function DiscussionThread({
  thread,
  currentUser,
  help5Context,
  onAddMessage,
  onEditMessage,
  onDeleteMessage,
  onEditHelp5,
  showHelp5 = true
}) {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.messages?.length]);

  if (!thread) {
    return (
      <div style={{
        padding: theme.spacing[8],
        textAlign: 'center',
        color: theme.colors.text.tertiary
      }}>
        <MessageSquare size={48} style={{ margin: '0 auto', marginBottom: theme.spacing[4] }} />
        <p style={{
          fontSize: theme.typography.fontSize.base,
          margin: 0
        }}>
          Select a discussion to view messages
        </p>
      </div>
    );
  }

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      onAddMessage(newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const isResolved = thread.status === 'resolved';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      backgroundColor: theme.colors.background.elevated
    }}>
      {/* Thread Header */}
      <div style={{
        padding: theme.spacing[4],
        borderBottom: `1px solid ${theme.colors.border.default}`,
        backgroundColor: theme.colors.background.secondary
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: theme.spacing[2]
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            margin: 0
          }}>
            {thread.elementName}
          </h2>
          <span style={{
            padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
            backgroundColor: isResolved ? theme.colors.success[100] : theme.colors.primary[100],
            color: isResolved ? theme.colors.success[700] : theme.colors.primary[700],
            borderRadius: theme.borderRadius.full,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium
          }}>
            {isResolved ? 'Resolved' : 'Open'}
          </span>
        </div>
        <div style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary
        }}>
          <span>{thread.messages.length} message{thread.messages.length !== 1 ? 's' : ''}</span>
          <span style={{ margin: `0 ${theme.spacing[2]}` }}>•</span>
          <span>Created {formatTimestamp(thread.createdAt)}</span>
          {thread.updatedAt !== thread.createdAt && (
            <>
              <span style={{ margin: `0 ${theme.spacing[2]}` }}>•</span>
              <span>Updated {formatTimestamp(thread.updatedAt)}</span>
            </>
          )}
        </div>
      </div>

      {/* Help5 Context */}
      {showHelp5 && (
        <div style={{
          padding: theme.spacing[4],
          borderBottom: `1px solid ${theme.colors.border.default}`
        }}>
          <Help5ContextCard
            help5={help5Context}
            onEdit={onEditHelp5}
            compact={false}
          />
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: theme.spacing[4],
        display: 'flex',
        flexDirection: 'column',
        gap: theme.spacing[3]
      }}>
        {thread.messages.length === 0 ? (
          <div style={{
            padding: theme.spacing[8],
            textAlign: 'center',
            color: theme.colors.text.tertiary
          }}>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              margin: 0
            }}>
              No messages yet. Start the discussion below.
            </p>
          </div>
        ) : (
          <>
            {thread.messages.map((message, index) => (
              <DiscussionMessage
                key={message.id}
                message={message}
                currentUserId={currentUser?.id || ''}
                onEdit={(messageId, content) => onEditMessage(messageId, content)}
                onDelete={(messageId) => onDeleteMessage(messageId)}
                isResolution={isResolved && index === thread.messages.length - 1}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input (disabled if resolved) */}
      {!isResolved && (
        <div style={{
          padding: theme.spacing[4],
          borderTop: `1px solid ${theme.colors.border.default}`,
          backgroundColor: theme.colors.background.secondary
        }}>
          <div style={{
            display: 'flex',
            gap: theme.spacing[2],
            alignItems: 'flex-end'
          }}>
            <div style={{ flex: 1 }}>
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message... (Shift+Enter for new line)"
                style={{
                  width: '100%',
                  minHeight: '60px',
                  maxHeight: '150px',
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
            <button
              onClick={handleSendMessage}
              disabled={newMessage.trim() === ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                backgroundColor: newMessage.trim() === '' ? theme.colors.background.tertiary : theme.colors.primary[500],
                color: newMessage.trim() === '' ? theme.colors.text.disabled : theme.colors.text.inverse,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                cursor: newMessage.trim() === '' ? 'not-allowed' : 'pointer',
                transition: `all ${theme.transitions.fast}`,
                height: '44px'
              }}
            >
              <Send size={16} />
              Send
            </button>
          </div>
          <p style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            margin: 0,
            marginTop: theme.spacing[2]
          }}>
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      )}

      {isResolved && (
        <div style={{
          padding: theme.spacing[4],
          borderTop: `1px solid ${theme.colors.border.default}`,
          backgroundColor: theme.colors.success[50],
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.success[700],
            margin: 0,
            fontWeight: theme.typography.fontWeight.medium
          }}>
            This discussion has been resolved
          </p>
        </div>
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
  if (diffMins < 1) return 'just now';

  // Less than 1 hour
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;

  // Less than 24 hours
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  // Less than 7 days
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  // More than 7 days - show date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}

DiscussionThread.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    elementId: PropTypes.string.isRequired,
    elementName: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['open', 'resolved']).isRequired,
    messages: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string.isRequired,
      userId: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      content: PropTypes.string.isRequired,
      timestamp: PropTypes.string.isRequired
    })).isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired
  }),
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  help5Context: PropTypes.object,
  onAddMessage: PropTypes.func.isRequired,
  onEditMessage: PropTypes.func.isRequired,
  onDeleteMessage: PropTypes.func.isRequired,
  onEditHelp5: PropTypes.func,
  showHelp5: PropTypes.bool
};

export default DiscussionThread;
