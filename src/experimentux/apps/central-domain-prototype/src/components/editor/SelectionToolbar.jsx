/**
 * SelectionToolbar Component
 * Floating toolbar that appears when elements are selected
 * Provides quick access to bulk operations
 */

import { Copy, Trash2, X } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { theme } from '../../config/theme';

export function SelectionToolbar() {
  const selectedElements = useEditorStore((state) => state.selectedElements);
  const duplicateSelected = useEditorStore((state) => state.duplicateSelected);
  const deleteSelected = useEditorStore((state) => state.deleteSelected);
  const clearSelection = useEditorStore((state) => state.clearSelection);

  // Don't show toolbar if nothing is selected
  if (selectedElements.length === 0) {
    return null;
  }

  const handleDuplicate = () => {
    duplicateSelected();
  };

  const handleDelete = () => {
    if (window.confirm(`Delete ${selectedElements.length} element${selectedElements.length > 1 ? 's' : ''}?`)) {
      deleteSelected();
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Selection actions"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: theme.spacing['6'],
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing['2'],
        padding: theme.spacing['3'],
        background: theme.colors.background.primary,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.xl,
      }}
    >
      {/* Selection count */}
      <div
        role="status"
        aria-label={`${selectedElements.length} element${selectedElements.length > 1 ? 's' : ''} selected`}
        style={{
          padding: `${theme.spacing['1']} ${theme.spacing['3']}`,
          background: theme.colors.primary[50],
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.primary[700],
        }}
      >
        {selectedElements.length} selected
      </div>

      {/* Divider */}
      <div
        style={{
          width: '1px',
          height: '24px',
          background: theme.colors.border.default,
        }}
      />

      {/* Actions */}
      <button
        onClick={handleDuplicate}
        className="toolbar-btn"
        aria-label={`Duplicate ${selectedElements.length} selected element${selectedElements.length > 1 ? 's' : ''}`}
        title="Duplicate selected elements (Ctrl+D)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing['2'],
          padding: `${theme.spacing['2']} ${theme.spacing['3']}`,
          background: 'transparent',
          border: 'none',
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.text.primary,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = theme.colors.neutral[100];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Copy size={16} aria-hidden="true" />
        <span>Duplicate</span>
      </button>

      <button
        onClick={handleDelete}
        className="toolbar-btn"
        aria-label={`Delete ${selectedElements.length} selected element${selectedElements.length > 1 ? 's' : ''}`}
        title="Delete selected elements (Delete key)"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing['2'],
          padding: `${theme.spacing['2']} ${theme.spacing['3']}`,
          background: 'transparent',
          border: 'none',
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.error[600],
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = theme.colors.error[50];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <Trash2 size={16} aria-hidden="true" />
        <span>Delete</span>
      </button>

      {/* Divider */}
      <div
        role="separator"
        aria-orientation="vertical"
        style={{
          width: '1px',
          height: '24px',
          background: theme.colors.border.default,
        }}
      />

      {/* Clear selection */}
      <button
        onClick={clearSelection}
        className="toolbar-btn"
        aria-label="Clear selection"
        title="Clear selection (Esc)"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: theme.spacing['2'],
          background: 'transparent',
          border: 'none',
          borderRadius: theme.borderRadius.md,
          color: theme.colors.text.secondary,
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = theme.colors.neutral[100];
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
        }}
      >
        <X size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
