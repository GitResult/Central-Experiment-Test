/**
 * SlashPalette Component
 * Command palette triggered by "/" key for quick access to editor actions
 * Fuzzy search, keyboard navigation, and categorized commands
 */

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useEditorStore } from '../../store/editorStore';
import { theme } from '../../config/theme';
import {
  Plus,
  Copy,
  Trash2,
  Undo,
  Redo,
  Save,
  Eye,
  Settings,
  Layout,
  Palette,
  Code,
  Globe,
} from 'lucide-react';

/**
 * Available commands in the slash palette
 */
const commands = [
  // Element commands
  {
    id: 'add-markup',
    label: 'Add Markup Element',
    description: 'Add text, button, link, or other markup',
    icon: Plus,
    category: 'element',
    keywords: ['add', 'create', 'markup', 'text', 'button'],
    action: (store) => store.openSidebar('elements'),
  },
  {
    id: 'add-field',
    label: 'Add Field Element',
    description: 'Add form input field',
    icon: Plus,
    category: 'element',
    keywords: ['add', 'create', 'field', 'input', 'form'],
    action: (store) => store.openSidebar('elements'),
  },
  {
    id: 'add-structure',
    label: 'Add Structure Element',
    description: 'Add container, card, tabs, etc.',
    icon: Plus,
    category: 'element',
    keywords: ['add', 'create', 'structure', 'container', 'card'],
    action: (store) => store.openSidebar('elements'),
  },
  {
    id: 'add-record',
    label: 'Add Record Element',
    description: 'Add data-bound display element',
    icon: Plus,
    category: 'element',
    keywords: ['add', 'create', 'record', 'data', 'list'],
    action: (store) => store.openSidebar('elements'),
  },

  // Edit commands
  {
    id: 'duplicate',
    label: 'Duplicate Selected',
    description: 'Duplicate selected elements',
    icon: Copy,
    category: 'edit',
    keywords: ['duplicate', 'copy', 'clone'],
    action: (store) => store.duplicateSelected(),
  },
  {
    id: 'delete',
    label: 'Delete Selected',
    description: 'Delete selected elements',
    icon: Trash2,
    category: 'edit',
    keywords: ['delete', 'remove', 'trash'],
    action: (store) => store.deleteSelected(),
  },
  {
    id: 'undo',
    label: 'Undo',
    description: 'Undo last action',
    icon: Undo,
    category: 'edit',
    keywords: ['undo', 'revert'],
    action: (store) => store.undo(),
  },
  {
    id: 'redo',
    label: 'Redo',
    description: 'Redo last undone action',
    icon: Redo,
    category: 'edit',
    keywords: ['redo', 'repeat'],
    action: (store) => store.redo(),
  },
  {
    id: 'clear-selection',
    label: 'Clear Selection',
    description: 'Deselect all elements',
    icon: Settings,
    category: 'edit',
    keywords: ['clear', 'deselect', 'unselect'],
    action: (store) => store.clearSelection(),
  },

  // View commands
  {
    id: 'toggle-preview',
    label: 'Toggle Preview Mode',
    description: 'Switch between edit and preview mode',
    icon: Eye,
    category: 'view',
    keywords: ['preview', 'view', 'mode', 'edit'],
    action: (store) => store.toggleMode(),
  },
  {
    id: 'toggle-sidebar',
    label: 'Toggle Sidebar',
    description: 'Show/hide right sidebar',
    icon: Settings,
    category: 'view',
    keywords: ['sidebar', 'panel', 'toggle'],
    action: (store) => store.toggleSidebar(),
  },
  {
    id: 'toggle-alignment',
    label: 'Toggle Alignment Guides',
    description: 'Show/hide alignment guides',
    icon: Layout,
    category: 'view',
    keywords: ['alignment', 'guides', 'grid', 'toggle'],
    action: (store) => store.toggleAlignmentGuides(),
  },

  // Page commands
  {
    id: 'new-page',
    label: 'New Page',
    description: 'Create a new blank page',
    icon: Plus,
    category: 'page',
    keywords: ['new', 'create', 'page', 'blank'],
    action: (store) => {
      if (confirm('Create new page? Unsaved changes will be lost.')) {
        store.createNewPage();
      }
    },
  },
  {
    id: 'layout-preset',
    label: 'Choose Layout Preset',
    description: 'Start with a pre-configured layout',
    icon: Layout,
    category: 'page',
    keywords: ['layout', 'preset', 'template', 'choose'],
    action: () => {
      // This would open the LayoutPresetPicker
      console.log('Open layout preset picker');
    },
  },

  // Theme commands
  {
    id: 'theme-customize',
    label: 'Customize Theme',
    description: 'Edit theme colors and styles',
    icon: Palette,
    category: 'theme',
    keywords: ['theme', 'colors', 'customize', 'style'],
    action: (store) => store.openThemeCustomizer(),
  },
  {
    id: 'view-json',
    label: 'View Page JSON',
    description: 'View and edit page as JSON',
    icon: Code,
    category: 'advanced',
    keywords: ['json', 'code', 'view', 'edit', 'advanced'],
    action: (store) => store.openJsonEditor(),
  },
  {
    id: 'manage-locales',
    label: 'Manage Locales',
    description: 'Configure translations and languages',
    icon: Globe,
    category: 'advanced',
    keywords: ['locale', 'language', 'translation', 'i18n', 'internationalization'],
    action: (store) => store.openLocaleManager(),
  },
];

/**
 * Calculate fuzzy match score
 */
function fuzzyMatch(query, text) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();

  // Exact match
  if (t === q) return 1.0;

  // Starts with
  if (t.startsWith(q)) return 0.9;

  // Contains
  if (t.includes(q)) return 0.7;

  // Fuzzy character matching
  let score = 0;
  let queryIndex = 0;

  for (let i = 0; i < t.length && queryIndex < q.length; i++) {
    if (t[i] === q[queryIndex]) {
      score += 1;
      queryIndex++;
    }
  }

  return queryIndex === q.length ? score / q.length * 0.5 : 0;
}

/**
 * Filter and rank commands by search query
 */
function filterCommands(query) {
  if (!query.trim()) {
    return commands;
  }

  const matches = commands
    .map((cmd) => {
      // Calculate match score for label, description, and keywords
      const labelScore = fuzzyMatch(query, cmd.label);
      const descScore = fuzzyMatch(query, cmd.description);
      const keywordScore = Math.max(
        ...cmd.keywords.map((kw) => fuzzyMatch(query, kw)),
        0
      );

      const score = Math.max(labelScore, descScore, keywordScore);

      return { ...cmd, score };
    })
    .filter((cmd) => cmd.score > 0);

  // Sort by score descending
  matches.sort((a, b) => b.score - a.score);

  return matches;
}

/**
 * Command category metadata
 */
const categories = {
  element: { label: 'Elements', color: theme.colors.primary[500] },
  edit: { label: 'Edit', color: theme.colors.neutral[600] },
  view: { label: 'View', color: theme.colors.charts.accent2 },
  page: { label: 'Page', color: theme.colors.charts.accent1 },
  theme: { label: 'Theme', color: theme.colors.neutral[500] },
  advanced: { label: 'Advanced', color: theme.colors.neutral[500] },
};

/**
 * SlashPalette Component
 */
export function SlashPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const modalRef = useRef(null);

  // Get editor store instance
  const store = useEditorStore();

  // Filter commands based on query
  const filteredCommands = filterCommands(query);

  // Handle command execution
  const executeCommand = (command) => {
    try {
      command.action(store);
      closePalette();
    } catch (error) {
      console.error('Error executing command:', error);
    }
  };

  // Close palette
  const closePalette = () => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(0);
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Open palette with "/"
      if (e.key === '/' && !isOpen) {
        // Only if not in an input/textarea
        if (!['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
          e.preventDefault();
          setIsOpen(true);
        }
      }

      // Handle navigation when open
      if (isOpen) {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
            break;

          case 'ArrowUp':
            e.preventDefault();
            setSelectedIndex(
              (prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length
            );
            break;

          case 'Enter':
            e.preventDefault();
            if (filteredCommands[selectedIndex]) {
              executeCommand(filteredCommands[selectedIndex]);
            }
            break;

          case 'Escape':
            e.preventDefault();
            closePalette();
            break;

          default:
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        closePalette();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '20vh',
        zIndex: 9999,
      }}
    >
      <div
        ref={modalRef}
        style={{
          width: '600px',
          maxWidth: '90vw',
          background: theme.colors.background.primary,
          borderRadius: theme.borderRadius.lg,
          boxShadow: theme.shadows.xl,
          overflow: 'hidden',
        }}
      >
        {/* Search input */}
        <div
          style={{
            padding: theme.spacing['4'],
            borderBottom: `1px solid ${theme.colors.border.default}`,
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search commands..."
            style={{
              width: '100%',
              padding: `${theme.spacing['3']} ${theme.spacing['4']}`,
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.primary,
              background: theme.colors.background.secondary,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              outline: 'none',
            }}
          />
        </div>

        {/* Commands list */}
        <div
          style={{
            maxHeight: '400px',
            overflowY: 'auto',
          }}
        >
          {filteredCommands.length === 0 ? (
            <div
              style={{
                padding: theme.spacing['8'],
                textAlign: 'center',
                color: theme.colors.text.tertiary,
              }}
            >
              No commands found
            </div>
          ) : (
            filteredCommands.map((command, index) => {
              const Icon = command.icon;
              const category = categories[command.category];
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={command.id}
                  onClick={() => executeCommand(command)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  style={{
                    padding: theme.spacing['3'],
                    display: 'flex',
                    alignItems: 'center',
                    gap: theme.spacing['3'],
                    cursor: 'pointer',
                    background: isSelected
                      ? theme.colors.primary[50]
                      : 'transparent',
                    borderLeft: isSelected
                      ? `3px solid ${theme.colors.primary[500]}`
                      : '3px solid transparent',
                  }}
                >
                  {/* Icon */}
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isSelected
                        ? theme.colors.primary[100]
                        : theme.colors.neutral[100],
                      borderRadius: theme.borderRadius.md,
                      color: isSelected
                        ? theme.colors.primary[600]
                        : theme.colors.neutral[600],
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: theme.typography.fontSize.sm,
                        fontWeight: theme.typography.fontWeight.medium,
                        color: theme.colors.text.primary,
                      }}
                    >
                      {command.label}
                    </div>
                    <div
                      style={{
                        fontSize: theme.typography.fontSize.xs,
                        color: theme.colors.text.tertiary,
                        marginTop: theme.spacing['1'],
                      }}
                    >
                      {command.description}
                    </div>
                  </div>

                  {/* Category badge */}
                  <div
                    style={{
                      padding: `${theme.spacing['1']} ${theme.spacing['2']}`,
                      background: theme.colors.neutral[100],
                      borderRadius: theme.borderRadius.sm,
                      fontSize: theme.typography.fontSize.xs,
                      color: category.color,
                      fontWeight: theme.typography.fontWeight.medium,
                    }}
                  >
                    {category.label}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: theme.spacing['3'],
            borderTop: `1px solid ${theme.colors.border.default}`,
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
          }}
        >
          <span>↑↓ Navigate • Enter Select • Esc Close</span>
          <span>Press "/" to open</span>
        </div>
      </div>
    </div>
  );
}

SlashPalette.propTypes = {};
