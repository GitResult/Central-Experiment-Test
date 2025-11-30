/**
 * Help5List Page
 * List view of all Help5 contexts
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Filter, Plus, BarChart3 } from 'lucide-react';
import { theme } from '../../../config/theme';

// Mock data - in real app, this would come from a store or API
const mockHelp5Records = [
  {
    record_id: 'help_contacts_list',
    parent_id: 'contacts-list',
    elementName: 'Contacts List Page',
    content: {
      what: 'Displays all contact records in a sortable, filterable table',
      who: 'Sales team, Customer service representatives',
      where: 'Main contacts module',
      when: 'When viewing or managing contact records',
      why: 'Centralizes contact management for efficient customer relationship tracking'
    },
    completionScore: 95,
    updated_at: '2025-11-20T10:30:00Z'
  },
  {
    record_id: 'help_tasks_detail',
    parent_id: 'tasks-detail',
    elementName: 'Task Detail Page',
    content: {
      what: 'Shows detailed information for a single task record',
      who: 'Project managers, Team members',
      where: 'Tasks module detail view',
      when: 'When viewing or editing task details',
      why: ''
    },
    completionScore: 65,
    updated_at: '2025-11-15T14:20:00Z'
  }
];

export function Help5List() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState('all'); // all, complete, incomplete

  const filteredRecords = mockHelp5Records.filter(record => {
    const matchesSearch = record.elementName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         record.content.what?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterBy === 'all' ||
                         (filterBy === 'complete' && record.completionScore >= 90) ||
                         (filterBy === 'incomplete' && record.completionScore < 90);
    return matchesSearch && matchesFilter;
  });

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
            Help5 Contexts
          </h1>
          <p style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary,
            margin: 0
          }}>
            Self-documenting system with 5W framework (What, Who, Where, When, Why)
          </p>
        </div>
        <div style={{ display: 'flex', gap: theme.spacing[3] }}>
          <button
            onClick={() => navigate('/help5/coverage')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2],
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: 'transparent',
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              cursor: 'pointer'
            }}
          >
            <BarChart3 size={18} />
            Coverage Dashboard
          </button>
          <button
            onClick={() => navigate('/help5/new')}
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
            New Help5
          </button>
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
            placeholder="Search Help5 contexts..."
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
          {['all', 'complete', 'incomplete'].map(filter => (
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

      {/* Help5 List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[4] }}>
        {filteredRecords.length === 0 ? (
          <div style={{
            padding: theme.spacing[12],
            textAlign: 'center',
            backgroundColor: theme.colors.background.elevated,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border.default}`
          }}>
            <BookOpen size={48} style={{ margin: '0 auto', marginBottom: theme.spacing[4], color: theme.colors.text.tertiary }} />
            <h3 style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              marginBottom: theme.spacing[2]
            }}>
              No Help5 contexts found
            </h3>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary,
              margin: 0
            }}>
              Create your first Help5 context to start documenting your application
            </p>
          </div>
        ) : (
          filteredRecords.map(record => (
            <div
              key={record.record_id}
              onClick={() => navigate(`/help5/${record.record_id}`)}
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
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing[2]
                  }}>
                    {record.elementName}
                  </h3>
                  <p style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary,
                    marginBottom: theme.spacing[3],
                    lineHeight: '1.6'
                  }}>
                    <strong>What:</strong> {record.content.what || 'Not documented'}
                  </p>
                  <div style={{ display: 'flex', gap: theme.spacing[4], fontSize: theme.typography.fontSize.xs, color: theme.colors.text.tertiary }}>
                    <span>Updated: {new Date(record.updated_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <div style={{
                  padding: `${theme.spacing[1]} ${theme.spacing[3]}`,
                  backgroundColor: record.completionScore >= 90 ? theme.colors.success[100] : theme.colors.warning[100],
                  color: record.completionScore >= 90 ? theme.colors.success[700] : theme.colors.warning[700],
                  borderRadius: theme.borderRadius.full,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.semibold
                }}>
                  {record.completionScore}%
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Help5List;
