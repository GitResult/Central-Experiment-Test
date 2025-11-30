/**
 * Shortcut Help Modal
 * Displays all registered keyboard shortcuts organized by category
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { X, Search, Keyboard } from 'lucide-react';
import { theme } from '../../config/theme';
import useShortcutHelp from './hooks/useShortcutHelp';
import useKeyboardShortcut from './hooks/useKeyboardShortcut';

export function ShortcutHelpModal({ isOpen, onClose }) {
  const {
    categories,
    formatShortcut,
    getShortcutsByCategory,
    searchShortcuts
  } = useShortcutHelp();

  const [searchQuery, setSearchQuery] = useState('');

  // Close with Escape key
  useKeyboardShortcut('Escape', onClose, {
    description: 'Close shortcut help',
    enabled: isOpen
  });

  if (!isOpen) return null;

  const shortcutsByCategory = getShortcutsByCategory();
  const hasSearch = searchQuery.trim().length > 0;
  const searchResults = hasSearch ? searchShortcuts(searchQuery) : [];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: theme.colors.background.overlay,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: theme.zIndex.modal,
        padding: theme.spacing[4]
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: theme.colors.background.elevated,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows['2xl'],
          width: '100%',
          maxWidth: '800px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: theme.spacing[6],
            borderBottom: `1px solid ${theme.colors.border.default}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
            <Keyboard size={24} color={theme.colors.text.primary} />
            <h2
              style={{
                fontSize: theme.typography.fontSize.xl,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                margin: 0
              }}
            >
              Keyboard Shortcuts
            </h2>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.text.secondary,
              transition: `background-color ${theme.transitions.fast}`
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div
          style={{
            padding: theme.spacing[6],
            paddingBottom: theme.spacing[4],
            borderBottom: `1px solid ${theme.colors.border.default}`
          }}
        >
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search
              size={18}
              color={theme.colors.text.tertiary}
              style={{
                position: 'absolute',
                left: theme.spacing[3]
              }}
            />
            <input
              type="text"
              placeholder="Search shortcuts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                height: theme.components.input.height.md,
                paddingLeft: `calc(${theme.spacing[3]} + 18px + ${theme.spacing[2]})`,
                paddingRight: theme.spacing[3],
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary,
                backgroundColor: theme.colors.background.primary,
                outline: 'none',
                transition: `border-color ${theme.transitions.fast}`
              }}
              onFocus={(e) => {
                e.target.style.borderColor = theme.colors.border.focus;
                e.target.style.boxShadow = theme.shadows.focus;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = theme.colors.border.default;
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>

        {/* Shortcuts List */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: theme.spacing[6]
          }}
        >
          {hasSearch ? (
            // Search Results
            <div>
              {searchResults.length === 0 ? (
                <p
                  style={{
                    textAlign: 'center',
                    color: theme.colors.text.tertiary,
                    fontSize: theme.typography.fontSize.sm
                  }}
                >
                  No shortcuts found matching "{searchQuery}"
                </p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
                  {searchResults.map((shortcut, index) => (
                    <ShortcutRow
                      key={index}
                      shortcut={shortcut}
                      formatShortcut={formatShortcut}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            // Grouped by Category
            <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[8] }}>
              {categories.map(category => (
                <div key={category}>
                  <h3
                    style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.secondary,
                      textTransform: 'uppercase',
                      letterSpacing: theme.typography.letterSpacing.wide,
                      marginBottom: theme.spacing[3],
                      marginTop: 0
                    }}
                  >
                    {category}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing[2] }}>
                    {shortcutsByCategory[category]?.map((shortcut, index) => (
                      <ShortcutRow
                        key={index}
                        shortcut={shortcut}
                        formatShortcut={formatShortcut}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

ShortcutHelpModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

function ShortcutRow({ shortcut, formatShortcut }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.background.secondary
      }}
    >
      <span
        style={{
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.primary
        }}
      >
        {shortcut.description}
      </span>
      <kbd
        style={{
          fontSize: theme.typography.fontSize.xs,
          fontFamily: theme.typography.fontFamily.mono,
          color: theme.colors.text.secondary,
          backgroundColor: theme.colors.background.tertiary,
          padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
          borderRadius: theme.borderRadius.sm,
          border: `1px solid ${theme.colors.border.default}`,
          whiteSpace: 'nowrap'
        }}
      >
        {formatShortcut(shortcut.shortcut)}
      </kbd>
    </div>
  );
}

ShortcutRow.propTypes = {
  shortcut: PropTypes.shape({
    shortcut: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired
  }).isRequired,
  formatShortcut: PropTypes.func.isRequired
};

export default ShortcutHelpModal;
