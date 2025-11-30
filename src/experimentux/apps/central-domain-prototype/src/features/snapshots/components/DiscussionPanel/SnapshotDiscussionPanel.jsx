/**
 * SnapshotDiscussionPanel
 * Discussion panel for snapshots (extends existing discussion components)
 */

import { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { X, Send, ExternalLink, Minimize2, Maximize2 } from 'lucide-react';
import { theme } from '../../../../config/theme';
import { useSnapshotStore } from '../../../../store/snapshotStore';

export function SnapshotDiscussionPanel() {
  const {
    discussionPanelOpen,
    discussionPanelSnapshot,
    closeDiscussionPanel,
  } = useSnapshotStore();

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Auto-focus input when panel opens
  useEffect(() => {
    if (discussionPanelOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [discussionPanelOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load existing messages for snapshot
  useEffect(() => {
    if (discussionPanelSnapshot?.discussions) {
      setMessages(discussionPanelSnapshot.discussions);
    }
  }, [discussionPanelSnapshot]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      author: 'Current User',
      content: message,
      timestamp: new Date().toISOString(),
    };

    setMessages([...messages, newMessage]);
    setMessage('');

    // In production: Save to API
    console.log('Message sent:', newMessage);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSendMessage();
    }
  };

  if (!discussionPanelOpen || !discussionPanelSnapshot) return null;

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 0,
        width: isCollapsed ? '48px' : '400px',
        height: '100vh',
        backgroundColor: theme.colors.background.primary,
        boxShadow: '-4px 0 12px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease-out',
        animation: 'slideInRight 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Header */}
      <div style={{
        padding: theme.spacing[4],
        borderBottom: `1px solid ${theme.colors.border.default}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        {!isCollapsed && (
          <h3 style={{
            fontSize: theme.typography.fontSize.lg,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            margin: 0,
          }}>
            Discussion
          </h3>
        )}

        <div style={{ display: 'flex', gap: theme.spacing[2] }}>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.text.secondary,
              cursor: 'pointer',
              padding: theme.spacing[1],
              display: 'flex',
              alignItems: 'center',
            }}
            title={isCollapsed ? 'Expand' : 'Collapse'}
          >
            {isCollapsed ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>

          <button
            onClick={closeDiscussionPanel}
            style={{
              background: 'none',
              border: 'none',
              color: theme.colors.text.secondary,
              cursor: 'pointer',
              padding: theme.spacing[1],
              display: 'flex',
              alignItems: 'center',
            }}
            title="Close"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Snapshot Preview */}
          <div style={{
            padding: theme.spacing[4],
            borderBottom: `1px solid ${theme.colors.border.default}`,
          }}>
            <div style={{
              width: '100%',
              height: '160px',
              backgroundColor: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.md,
              overflow: 'hidden',
              cursor: 'pointer',
            }}
            onClick={() => window.location.href = `/snapshots/${discussionPanelSnapshot.id}`}
            >
              <img
                src={discussionPanelSnapshot.thumbnailUrl}
                alt="Snapshot"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>

            <div style={{
              marginTop: theme.spacing[2],
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
            }}>
              {new Date(discussionPanelSnapshot.createdAt).toLocaleString()}
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: theme.spacing[4],
          }}>
            {messages.length === 0 ? (
              <div style={{
                textAlign: 'center',
                color: theme.colors.text.tertiary,
                fontSize: theme.typography.fontSize.sm,
                padding: theme.spacing[8],
              }}>
                No messages yet. Start the discussion!
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: theme.spacing[4],
                    padding: theme.spacing[3],
                    backgroundColor: theme.colors.background.secondary,
                    borderRadius: theme.borderRadius.md,
                  }}
                >
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.secondary,
                    marginBottom: theme.spacing[1],
                    fontWeight: theme.typography.fontWeight.medium,
                  }}>
                    {msg.author}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.primary,
                  }}>
                    {msg.content}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                    marginTop: theme.spacing[1],
                  }}>
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: theme.spacing[4],
            borderTop: `1px solid ${theme.colors.border.default}`,
            backgroundColor: theme.colors.background.secondary,
          }}>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: theme.spacing[2],
            }}>
              <textarea
                ref={inputRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message... (Cmd/Ctrl+Enter to send)"
                style={{
                  width: '100%',
                  minHeight: '60px',
                  padding: theme.spacing[2],
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm,
                  fontFamily: 'inherit',
                  resize: 'vertical',
                }}
              />

              <div style={{
                display: 'flex',
                gap: theme.spacing[2],
                justifyContent: 'space-between',
              }}>
                <button
                  onClick={() => window.location.href = `/snapshots/${discussionPanelSnapshot.id}`}
                  style={{
                    padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                    backgroundColor: 'transparent',
                    color: theme.colors.text.secondary,
                    border: `1px solid ${theme.colors.border.default}`,
                    borderRadius: theme.borderRadius.md,
                    cursor: 'pointer',
                    fontSize: theme.typography.fontSize.xs,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[1],
                  }}
                  title="View full snapshot"
                >
                  <ExternalLink size={12} />
                  View
                </button>

                <button
                  onClick={handleSendMessage}
                  disabled={!message.trim()}
                  style={{
                    padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                    backgroundColor: message.trim() ? '#0066FF' : theme.colors.background.tertiary,
                    color: 'white',
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    cursor: message.trim() ? 'pointer' : 'not-allowed',
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing[1],
                  }}
                >
                  <Send size={14} />
                  Send
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
