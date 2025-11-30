/**
 * ContextMenu Component
 * Right-click context menu for quick element operations
 * Provides actions like duplicate, delete, move, copy/paste, etc.
 */

import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useEditorStore } from '../../store/editorStore';
import { theme } from '../../config/theme';
import {
  Copy,
  Clipboard,
  Trash2,
  ArrowUp,
  ArrowDown,
  MoveUp,
  MousePointer2,
  Settings,
  RefreshCw,
} from 'lucide-react';

/**
 * Context menu actions
 */
const createMenuActions = (element, store) => {
  const actions = [
    {
      id: 'duplicate',
      label: 'Duplicate',
      icon: Copy,
      shortcut: 'Ctrl+D',
      action: () => store.duplicateSelected(),
      divider: false,
    },
    {
      id: 'copy',
      label: 'Copy',
      icon: Copy,
      shortcut: 'Ctrl+C',
      action: () => store.copyToClipboard(),
      divider: false,
    },
    {
      id: 'paste',
      label: 'Paste',
      icon: Clipboard,
      shortcut: 'Ctrl+V',
      action: () => store.pasteFromClipboard(),
      disabled: !store.clipboard,
      divider: true,
    },
    {
      id: 'move-up',
      label: 'Move Up',
      icon: ArrowUp,
      shortcut: 'Alt+↑',
      action: () => store.moveElementUp(element?.path),
      disabled: !element || !store.canMoveUp(element.path),
      divider: false,
    },
    {
      id: 'move-down',
      label: 'Move Down',
      icon: ArrowDown,
      shortcut: 'Alt+↓',
      action: () => store.moveElementDown(element?.path),
      disabled: !element || !store.canMoveDown(element.path),
      divider: true,
    },
    {
      id: 'select-parent',
      label: 'Select Parent',
      icon: MousePointer2,
      shortcut: 'Esc',
      action: () => store.selectParent(element?.path),
      disabled: !element || !store.hasParent(element.path),
      divider: false,
    },
    {
      id: 'edit-settings',
      label: 'Edit Settings',
      icon: Settings,
      shortcut: '',
      action: () => {
        store.selectElement(element?.path);
        store.openSidebar('settings');
      },
      divider: false,
    },
    {
      id: 'convert-type',
      label: 'Convert Type...',
      icon: RefreshCw,
      shortcut: '',
      action: () => store.openTypeConverter(element?.path),
      disabled: !element,
      divider: true,
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: Trash2,
      shortcut: 'Del',
      action: () => store.deleteSelected(),
      danger: true,
      divider: false,
    },
  ];

  return actions;
};

/**
 * ContextMenu Component
 */
export function ContextMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetElement, setTargetElement] = useState(null);
  const menuRef = useRef(null);

  const store = useEditorStore();

  // Handle context menu opening
  useEffect(() => {
    const handleContextMenu = (e) => {
      // Check if target has element path data attribute
      const elementContainer = e.target.closest('[data-element-path]');

      if (elementContainer) {
        e.preventDefault();

        const elementPath = JSON.parse(elementContainer.getAttribute('data-element-path'));
        const element = store.getElement(elementPath);

        if (element) {
          // Select the element if not already selected
          if (!store.isElementSelected(elementPath)) {
            store.selectElement(elementPath);
          }

          setTargetElement({ ...element, path: elementPath });
          setPosition({ x: e.clientX, y: e.clientY });
          setIsOpen(true);
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    return () => document.removeEventListener('contextmenu', handleContextMenu);
  }, [store]);

  // Handle clicks outside menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isOpen) {
        if (e.key === 'Escape') {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Close menu when action is executed
  const handleAction = (action) => {
    if (!action.disabled) {
      action.action();
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;

  const actions = createMenuActions(targetElement, store);

  // Adjust position to keep menu on screen
  const adjustedPosition = { ...position };
  if (menuRef.current) {
    const menuRect = menuRef.current.getBoundingClientRect();
    if (adjustedPosition.x + menuRect.width > window.innerWidth) {
      adjustedPosition.x = window.innerWidth - menuRect.width - 10;
    }
    if (adjustedPosition.y + menuRect.height > window.innerHeight) {
      adjustedPosition.y = window.innerHeight - menuRect.height - 10;
    }
  }

  return (
    <div
      ref={menuRef}
      style={{
        position: 'fixed',
        top: adjustedPosition.y,
        left: adjustedPosition.x,
        background: theme.colors.background.primary,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius.md,
        boxShadow: theme.shadows.xl,
        minWidth: '220px',
        zIndex: 10000,
        overflow: 'hidden',
      }}
    >
      {/* Context info */}
      {targetElement && (
        <div
          style={{
            padding: `${theme.spacing['3']} ${theme.spacing['4']}`,
            borderBottom: `1px solid ${theme.colors.border.light}`,
            background: theme.colors.neutral[50],
          }}
        >
          <div
            style={{
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {targetElement.type} Element
          </div>
          <div
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary,
              marginTop: theme.spacing['1'],
              fontFamily: 'monospace',
            }}
          >
            {targetElement.id || 'Unnamed'}
          </div>
        </div>
      )}

      {/* Menu items */}
      <div style={{ padding: `${theme.spacing['2']} 0` }}>
        {actions.map((action) => (
          <div key={action.id}>
            <button
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              style={{
                width: '100%',
                padding: `${theme.spacing['2']} ${theme.spacing['4']}`,
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing['3'],
                background: 'transparent',
                border: 'none',
                cursor: action.disabled ? 'not-allowed' : 'pointer',
                fontSize: theme.typography.fontSize.sm,
                color: action.danger
                  ? theme.colors.error[500]
                  : action.disabled
                  ? theme.colors.text.disabled
                  : theme.colors.text.primary,
                textAlign: 'left',
                opacity: action.disabled ? 0.5 : 1,
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => {
                if (!action.disabled) {
                  e.currentTarget.style.background = action.danger
                    ? `${theme.colors.error[500]}10`
                    : theme.colors.neutral[100];
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              {/* Icon */}
              <action.icon
                size={16}
                style={{
                  flexShrink: 0,
                  color: action.danger
                    ? theme.colors.error[500]
                    : action.disabled
                    ? theme.colors.text.disabled
                    : theme.colors.text.secondary,
                }}
              />

              {/* Label */}
              <span style={{ flex: 1 }}>{action.label}</span>

              {/* Shortcut */}
              {action.shortcut && (
                <span
                  style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                    fontFamily: 'monospace',
                  }}
                >
                  {action.shortcut}
                </span>
              )}
            </button>

            {/* Divider */}
            {action.divider && (
              <div
                style={{
                  height: '1px',
                  background: theme.colors.border.light,
                  margin: `${theme.spacing['2']} ${theme.spacing['4']}`,
                }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

ContextMenu.propTypes = {};
