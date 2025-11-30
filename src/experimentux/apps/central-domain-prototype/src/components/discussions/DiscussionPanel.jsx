/**
 * DiscussionPanel
 * Main panel for managing discussions with sidebar and thread view
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { MessageSquare, Plus, Filter, Search, Clock, CheckCircle } from 'lucide-react';
import { theme } from '../../config/theme';
import { useDiscussions } from './hooks/useDiscussions';
import DiscussionThread from './DiscussionThread';
import ResolutionActions from './ResolutionActions';

export function DiscussionPanel({
  initialThreads = [],
  help5Records = [],
  currentUser,
  onHelp5Edit,
  isOpen = true,
  onClose
}) {
  const {
    threads,
    activeThreadId,
    activeThread,
    activeThreadHelp5,
    stats,
    createThread,
    addMessage,
    resolveThread,
    reopenThread,
    deleteMessage,
    editMessage,
    setActiveThreadId,
    generateHelp5Suggestion
  } = useDiscussions(initialThreads, help5Records);

  const [filterStatus, setFilterStatus] = useState('all'); // 'all', 'open', 'resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewThreadForm, setShowNewThreadForm] = useState(false);

  // Filter threads
  const filteredThreads = threads.filter(thread => {
    // Status filter
    if (filterStatus === 'open' && thread.status !== 'open') return false;
    if (filterStatus === 'resolved' && thread.status !== 'resolved') return false;

    // Search filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      const matchesName = thread.elementName.toLowerCase().includes(query);
      const matchesContent = thread.messages.some(m =>
        m.content.toLowerCase().includes(query) ||
        m.userName.toLowerCase().includes(query)
      );
      if (!matchesName && !matchesContent) return false;
    }

    return true;
  });

  const handleAddMessage = (content) => {
    if (activeThreadId && currentUser) {
      addMessage(activeThreadId, content, currentUser.id, currentUser.name);
    }
  };

  const handleEditMessage = (messageId, content) => {
    if (activeThreadId) {
      editMessage(activeThreadId, messageId, content);
    }
  };

  const handleDeleteMessage = (messageId) => {
    if (activeThreadId) {
      deleteMessage(activeThreadId, messageId);
    }
  };

  const handleResolve = (help5Update) => {
    if (activeThreadId) {
      resolveThread(activeThreadId, help5Update);
    }
  };

  const handleReopen = () => {
    if (activeThreadId) {
      reopenThread(activeThreadId);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '900px',
      maxWidth: '90vw',
      backgroundColor: theme.colors.background.elevated,
      boxShadow: theme.shadows['2xl'],
      display: 'flex',
      zIndex: theme.zIndex.modal
    }}>
      {/* Sidebar - Thread List */}
      <div style={{
        width: '320px',
        borderRight: `1px solid ${theme.colors.border.default}`,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: theme.colors.background.secondary
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: theme.spacing[4],
          borderBottom: `1px solid ${theme.colors.border.default}`
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: theme.spacing[3]
          }}>
            <h2 style={{
              fontSize: theme.typography.fontSize.xl,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              margin: 0
            }}>
              Discussions
            </h2>
            <button
              onClick={onClose}
              style={{
                padding: theme.spacing[2],
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                color: theme.colors.text.tertiary,
                fontSize: theme.typography.fontSize.xl
              }}
            >
              ×
            </button>
          </div>

          {/* Stats */}
          <div style={{
            display: 'flex',
            gap: theme.spacing[3],
            marginBottom: theme.spacing[3]
          }}>
            <div style={{
              flex: 1,
              padding: theme.spacing[2],
              backgroundColor: theme.colors.background.elevated,
              borderRadius: theme.borderRadius.md
            }}>
              <div style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary,
                marginBottom: theme.spacing[1]
              }}>
                Open
              </div>
              <div style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.primary[600]
              }}>
                {stats.open}
              </div>
            </div>
            <div style={{
              flex: 1,
              padding: theme.spacing[2],
              backgroundColor: theme.colors.background.elevated,
              borderRadius: theme.borderRadius.md
            }}>
              <div style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary,
                marginBottom: theme.spacing[1]
              }}>
                Resolved
              </div>
              <div style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.success[600]
              }}>
                {stats.resolved}
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{ position: 'relative', marginBottom: theme.spacing[2] }}>
            <Search
              size={16}
              style={{
                position: 'absolute',
                left: theme.spacing[3],
                top: '50%',
                transform: 'translateY(-50%)',
                color: theme.colors.text.tertiary
              }}
            />
            <input
              type="text"
              placeholder="Search discussions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: `${theme.spacing[2]} ${theme.spacing[3]} ${theme.spacing[2]} ${theme.spacing[8]}`,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.background.elevated,
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md
              }}
            />
          </div>

          {/* Filter */}
          <div style={{ display: 'flex', gap: theme.spacing[2] }}>
            <button
              onClick={() => setFilterStatus('all')}
              style={{
                flex: 1,
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                backgroundColor: filterStatus === 'all' ? theme.colors.primary[100] : 'transparent',
                border: `1px solid ${filterStatus === 'all' ? theme.colors.primary[500] : theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.xs,
                color: filterStatus === 'all' ? theme.colors.primary[700] : theme.colors.text.secondary,
                cursor: 'pointer',
                fontWeight: theme.typography.fontWeight.medium
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('open')}
              style={{
                flex: 1,
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                backgroundColor: filterStatus === 'open' ? theme.colors.primary[100] : 'transparent',
                border: `1px solid ${filterStatus === 'open' ? theme.colors.primary[500] : theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.xs,
                color: filterStatus === 'open' ? theme.colors.primary[700] : theme.colors.text.secondary,
                cursor: 'pointer',
                fontWeight: theme.typography.fontWeight.medium
              }}
            >
              Open
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              style={{
                flex: 1,
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                backgroundColor: filterStatus === 'resolved' ? theme.colors.primary[100] : 'transparent',
                border: `1px solid ${filterStatus === 'resolved' ? theme.colors.primary[500] : theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.xs,
                color: filterStatus === 'resolved' ? theme.colors.primary[700] : theme.colors.text.secondary,
                cursor: 'pointer',
                fontWeight: theme.typography.fontWeight.medium
              }}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Thread List */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredThreads.length === 0 ? (
            <div style={{
              padding: theme.spacing[6],
              textAlign: 'center',
              color: theme.colors.text.tertiary
            }}>
              <MessageSquare size={32} style={{ margin: '0 auto', marginBottom: theme.spacing[3] }} />
              <p style={{ fontSize: theme.typography.fontSize.sm, margin: 0 }}>
                {searchQuery ? 'No discussions match your search' : 'No discussions yet'}
              </p>
            </div>
          ) : (
            filteredThreads.map(thread => (
              <ThreadListItem
                key={thread.id}
                thread={thread}
                isActive={thread.id === activeThreadId}
                onClick={() => setActiveThreadId(thread.id)}
              />
            ))
          )}
        </div>
      </div>

      {/* Main Content - Thread View */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {activeThread ? (
          <>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <DiscussionThread
                thread={activeThread}
                currentUser={currentUser}
                help5Context={activeThreadHelp5}
                onAddMessage={handleAddMessage}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
                onEditHelp5={onHelp5Edit}
                showHelp5={true}
              />
            </div>
            <div style={{ padding: theme.spacing[4], borderTop: `1px solid ${theme.colors.border.default}` }}>
              <ResolutionActions
                thread={activeThread}
                help5Context={activeThreadHelp5}
                onResolve={handleResolve}
                onReopen={handleReopen}
                generateHelp5Suggestion={generateHelp5Suggestion}
              />
            </div>
          </>
        ) : (
          <div style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: theme.colors.text.tertiary
          }}>
            <div style={{ textAlign: 'center' }}>
              <MessageSquare size={64} style={{ margin: '0 auto', marginBottom: theme.spacing[4] }} />
              <p style={{ fontSize: theme.typography.fontSize.base, margin: 0 }}>
                Select a discussion to view
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ThreadListItem({ thread, isActive, onClick }) {
  const lastMessage = thread.messages[thread.messages.length - 1];
  const isResolved = thread.status === 'resolved';

  return (
    <div
      onClick={onClick}
      style={{
        padding: theme.spacing[3],
        borderBottom: `1px solid ${theme.colors.border.default}`,
        backgroundColor: isActive ? theme.colors.primary[50] : 'transparent',
        cursor: 'pointer',
        transition: `all ${theme.transitions.fast}`,
        borderLeft: isActive ? `3px solid ${theme.colors.primary[500]}` : '3px solid transparent'
      }}
      onMouseEnter={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = theme.colors.background.elevated;
        }
      }}
      onMouseLeave={(e) => {
        if (!isActive) {
          e.currentTarget.style.backgroundColor = 'transparent';
        }
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: theme.spacing[1]
      }}>
        <h3 style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary,
          margin: 0,
          flex: 1,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {thread.elementName}
        </h3>
        {isResolved && <CheckCircle size={14} color={theme.colors.success[600]} />}
      </div>

      {lastMessage && (
        <p style={{
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.secondary,
          margin: 0,
          marginBottom: theme.spacing[1],
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {lastMessage.userName}: {lastMessage.content}
        </p>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[2],
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.text.tertiary
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
          <MessageSquare size={12} />
          <span>{thread.messages.length}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
          <Clock size={12} />
          <span>{formatTimestamp(thread.updatedAt)}</span>
        </div>
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

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

DiscussionPanel.propTypes = {
  initialThreads: PropTypes.array,
  help5Records: PropTypes.array,
  currentUser: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  onHelp5Edit: PropTypes.func,
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

ThreadListItem.propTypes = {
  thread: PropTypes.shape({
    id: PropTypes.string.isRequired,
    elementName: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    messages: PropTypes.array.isRequired,
    updatedAt: PropTypes.string.isRequired
  }).isRequired,
  isActive: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};

export default DiscussionPanel;
