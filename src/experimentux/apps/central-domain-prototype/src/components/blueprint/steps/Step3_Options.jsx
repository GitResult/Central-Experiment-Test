/**
 * Step 3: Page Selection
 * Choose which pages to generate
 */

import PropTypes from 'prop-types';
import { List, FileText, Plus, Edit, BarChart3 } from 'lucide-react';
import { theme } from '../../../config/theme';

const PAGE_OPTIONS = [
  { key: 'list', label: 'List Page', icon: List, description: 'Table view with search and filters' },
  { key: 'detail', label: 'Detail Page', icon: FileText, description: 'Read-only view of single record' },
  { key: 'create', label: 'Create Form', icon: Plus, description: 'Form to create new records' },
  { key: 'edit', label: 'Edit Form', icon: Edit, description: 'Form to update existing records' },
  { key: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Overview with charts and stats' }
];

export function Step3_Options({ selectedPages, onSelectionChange }) {
  const handleToggle = (pageKey) => {
    onSelectionChange({
      ...selectedPages,
      [pageKey]: !selectedPages[pageKey]
    });
  };

  const selectedCount = Object.values(selectedPages).filter(Boolean).length;

  return (
    <div style={{ padding: theme.spacing[6] }}>
      <h2 style={{
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.semibold,
        marginBottom: theme.spacing[2],
        color: theme.colors.text.primary
      }}>
        Select Pages to Generate
      </h2>
      <p style={{
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.secondary,
        marginBottom: theme.spacing[6]
      }}>
        Choose which pages you want to create ({selectedCount} selected)
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: theme.spacing[4]
      }}>
        {PAGE_OPTIONS.map(({ key, label, icon: Icon, description }) => (
          <div
            key={key}
            onClick={() => handleToggle(key)}
            style={{
              border: `2px solid ${selectedPages[key] ? theme.colors.primary[500] : theme.colors.border.default}`,
              borderRadius: theme.borderRadius.lg,
              padding: theme.spacing[4],
              cursor: 'pointer',
              backgroundColor: selectedPages[key] ? theme.colors.primary[50] : theme.colors.background.elevated,
              transition: `all ${theme.transitions.base}`
            }}
            onMouseEnter={(e) => {
              if (!selectedPages[key]) {
                e.currentTarget.style.borderColor = theme.colors.border.medium;
              }
            }}
            onMouseLeave={(e) => {
              if (!selectedPages[key]) {
                e.currentTarget.style.borderColor = theme.colors.border.default;
              }
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3], marginBottom: theme.spacing[2] }}>
              <input
                type="checkbox"
                checked={selectedPages[key]}
                onChange={() => {}}
                style={{
                  width: '18px',
                  height: '18px',
                  accentColor: theme.colors.primary[500]
                }}
              />
              <Icon size={24} color={selectedPages[key] ? theme.colors.primary[600] : theme.colors.text.secondary} />
              <h3 style={{
                fontSize: theme.typography.fontSize.base,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                margin: 0
              }}>
                {label}
              </h3>
            </div>
            <p style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.tertiary,
              marginLeft: `calc(18px + ${theme.spacing[3]})`,
              marginTop: theme.spacing[2]
            }}>
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

Step3_Options.propTypes = {
  selectedPages: PropTypes.object.isRequired,
  onSelectionChange: PropTypes.func.isRequired
};

export default Step3_Options;
