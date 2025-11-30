/**
 * DiscussionsList Page
 * List view of all discussion threads
 */

import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MessageSquare, Search, Plus, User, Clock } from 'lucide-react';
import { theme } from '../../../config/theme';

// Mock data
const mockThreads = [
  {
    id: 'thread-1',
    elementId: 'hero-section',
    elementName: 'Hero Section Design',
    status: 'open',
    messages: [
      {
        id: 'msg-1',
        userId: 'user-1',
        userName: 'Jane Doe',
        content: 'Should we make the heading larger?',
        timestamp: '2025-11-22T10:30:00Z'
      },
      {
        id: 'msg-2',
        userId: 'user-2',
        userName: 'Mike Smith',
        content: 'I agree! Let\'s increase from 36px to 48px.',
        timestamp: '2025-11-22T11:00:00Z'
      }
    ],
    createdAt: '2025-11-22T10:30:00Z',
    updatedAt: '2025-11-22T11:00:00Z'
  },
  {
    id: 'thread-2',
    elementId: 'contact-form',
    elementName: 'Contact Form Validation',
    status: 'resolved',
    messages: [
      {
        id: 'msg-3',
        userId: 'user-3',
        userName: 'Sarah Johnson',
        content: 'We need to add email validation',
        timestamp: '2025-11-20T14:00:00Z'
      }
    ],
    createdAt: '2025-11-20T14:00:00Z',
    updatedAt: '2025-11-21T09:30:00Z'
  }
];

export function DiscussionsList() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterParam = searchParams.get('filter') || 'all';

  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState(filterParam);

  const filteredThreads = mockThreads.filter(thread => {
    const matchesSearch = thread.elementName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.messages.some(m => m.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterBy === 'all' ||
                         (filterBy === 'open' && thread.status === 'open') ||
                         (filterBy === 'resolved' && thread.status === 'resolved');
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: mockThreads.length,
    open: mockThreads.filter(t => t.status === 'open').length,
    resolved: mockThreads.filter(t => t.status === 'resolved').length
  };

  return (
    <div style={{ padding: theme.spacing[6] }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing[6]
      }}>
        <div>
          <h1 style={{
            fontSize: theme.typography.fontSize['3xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing[2]
          }}>
            Discussions
          </h1>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary,
            margin: 0
          }}>
            Thread-based discussions with Help5 integration
          </p>
        </div>
        <button
          onClick={() => navigate('/discussions/new')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            backgroundColor: theme.colors.primary[500],
            border: 'none',
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.inverse,
            cursor: 'pointer',
            fontWeight: theme.typography.fontWeight.medium
          }}
        >
          <Plus size={18} />
          New Discussion
        </button>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: theme.spacing[4],
        marginBottom: theme.spacing[6]
      }}>
        <div style={{
          padding: theme.spacing[4],
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.border.default}`
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            marginBottom: theme.spacing[2]
          }}>
            Total Discussions
          </div>
          <div style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.text.primary
          }}>
            {stats.total}
          </div>
        </div>
        <div style={{
          padding: theme.spacing[4],
          backgroundColor: theme.colors.primary[50],
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.primary[200]}`
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.primary[600],
            marginBottom: theme.spacing[2]
          }}>
            Open
          </div>
          <div style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.primary[700]
          }}>
            {stats.open}
          </div>
        </div>
        <div style={{
          padding: theme.spacing[4],
          backgroundColor: theme.colors.success[50],
          borderRadius: theme.borderRadius.md,
          border: `1px solid ${theme.colors.success[200]}`
        }}>
          <div style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.success[600],
            marginBottom: theme.spacing[2]
          }}>
            Resolved
          </div>
          <div style={{
            fontSize: theme.typography.fontSize['2xl'],
            fontWeight: theme.typography.fontWeight.bold,
            color: theme.colors.success[700]
          }}>
            {stats.resolved}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={{
        display: 'flex',
        gap: theme.spacing[4],
        marginBottom: theme.spacing[6]
      }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search
            size={18}
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
              padding: `${theme.spacing[2]} ${theme.spacing[3]} ${theme.spacing[2]} ${theme.spacing[10]}`,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              backgroundColor: theme.colors.background.elevated
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: theme.spacing[2] }}>
          {['all', 'open', 'resolved'].map(filter => (
            <button
              key={filter}
              onClick={() => setFilterBy(filter)}
              style={{
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                backgroundColor: filterBy === filter ? theme.colors.primary[100] : 'transparent',
                border: `1px solid ${filterBy === filter ? theme.colors.primary[500] : theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                color: filterBy === filter ? theme.colors.primary[700] : theme.colors.text.primary,
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Discussion Threads */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
        {filteredThreads.length === 0 ? (
          <div style={{
            padding: theme.spacing[12],
            textAlign: 'center',
            backgroundColor: theme.colors.background.elevated,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border.default}`
          }}>
            <MessageSquare size={48} style={{ margin: '0 auto', marginBottom: theme.spacing[4], color: theme.colors.text.tertiary }} />
            <h3 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[2]
            }}>
              No discussions found
            </h3>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              margin: 0
            }}>
              Start a new discussion to collaborate with your team
            </p>
          </div>
        ) : (
          filteredThreads.map(thread => {
            const lastMessage = thread.messages[thread.messages.length - 1];
            return (
              <div
                key={thread.id}
                onClick={() => navigate(`/discussions/${thread.id}`)}
                style={{
                  padding: theme.spacing[4],
                  backgroundColor: theme.colors.background.elevated,
                  border: `1px solid ${theme.colors.border.default}`,
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  transition: `all ${theme.transitions.fast}`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.primary[500];
                  e.currentTarget.style.boxShadow = theme.shadows.sm;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = theme.colors.border.default;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: theme.spacing[3] }}>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: theme.typography.fontSize.lg,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.primary,
                      marginBottom: theme.spacing[2]
                    }}>
                      {thread.elementName}
                    </h3>
                    {lastMessage && (
                      <p style={{
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.secondary,
                        margin: 0,
                        lineHeight: '1.6'
                      }}>
                        <strong>{lastMessage.userName}:</strong> {lastMessage.content}
                      </p>
                    )}
                  </div>
                  <div style={{
                    padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                    backgroundColor: thread.status === 'open' ? theme.colors.primary[100] : theme.colors.success[100],
                    color: thread.status === 'open' ? theme.colors.primary[700] : theme.colors.success[700],
                    borderRadius: theme.borderRadius.full,
                    fontSize: theme.typography.fontSize.xs,
                    fontWeight: theme.typography.fontWeight.semibold,
                    textTransform: 'capitalize'
                  }}>
                    {thread.status}
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  gap: theme.spacing[4],
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary
                }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
                    <MessageSquare size={14} />
                    {thread.messages.length} {thread.messages.length === 1 ? 'message' : 'messages'}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
                    <Clock size={14} />
                    Updated {new Date(thread.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default DiscussionsList;
