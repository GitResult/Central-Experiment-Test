/**
 * CreateNewMenu Component
 * Dropdown menu for creating new items (shown when Plus button is clicked)
 */

import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  Presentation,
  Network,
  MessageSquare,
  BookOpen,
  Zap,
  Layers,
  User,
  CheckSquare
} from 'lucide-react';
import { theme } from '../../config/theme';

export function CreateNewMenu({ isOpen, onClose, anchorRef }) {
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  const handleItemClick = (item) => {
    if (item.path) {
      navigate(item.path);
    }
    if (item.action) {
      // Handle custom actions
      console.log('Action:', item.action);
    }
    onClose();
  };

  const menuSections = [
    {
      section: 'Pages & Content',
      icon: FileText,
      items: [
        {
          icon: FileText,
          label: 'Page (from scratch)',
          path: '/page/new',
          description: 'Create a new page with drag-and-drop editor'
        },
        {
          icon: Layers,
          label: 'Canvas (visual design)',
          path: '/canvas/new',
          description: 'Visual canvas for custom designs'
        },
        {
          icon: Zap,
          label: 'Blueprint (CSV → Pages)',
          path: '/studio/blueprint',
          highlight: true,
          description: 'Auto-generate CRUD pages from CSV'
        },
      ]
    },
    {
      section: 'Presentations',
      icon: Presentation,
      items: [
        {
          icon: Presentation,
          label: 'Presenter Mode (Markdown)',
          path: '/studio/presenter',
          highlight: true,
          description: 'Create slides from markdown'
        },
        {
          icon: Layers,
          label: 'Canvas Presentation',
          path: '/canvas/new?type=presentation',
          description: 'Custom-designed presentation'
        },
      ]
    },
    {
      section: 'Enterprise Tools',
      icon: Network,
      items: [
        {
          icon: Network,
          label: 'DEPTH View (strategy)',
          path: '/studio/depth',
          highlight: true,
          description: 'Enterprise strategy canvas'
        },
        {
          icon: MessageSquare,
          label: 'Discussion Thread',
          path: '/discussions/new',
          highlight: true,
          description: 'Start a new discussion'
        },
      ]
    },
    {
      section: 'Documentation',
      icon: BookOpen,
      items: [
        {
          icon: BookOpen,
          label: 'Help5 Context (5W)',
          path: '/help5/new',
          highlight: true,
          description: 'Document with 5W framework'
        },
        {
          icon: Zap,
          label: 'Interactive Guide',
          path: '/help5/guides/new',
          highlight: true,
          description: 'Create automated walkthrough'
        },
      ]
    },
    {
      section: 'Records',
      icon: FileText,
      items: [
        {
          icon: User,
          label: 'Contact',
          path: '/contacts/new',
          description: 'Add a new contact'
        },
        {
          icon: CheckSquare,
          label: 'Task',
          path: '/tasks/new',
          description: 'Create a new task'
        },
      ]
    }
  ];

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: '48px',
        left: '0',
        width: '380px',
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows['2xl'],
        border: `1px solid ${theme.colors.border.default}`,
        zIndex: 1000,
        maxHeight: '600px',
        overflowY: 'auto'
      }}
    >
      {/* Header */}
      <div style={{
        padding: theme.spacing[4],
        borderBottom: `1px solid ${theme.colors.border.default}`,
        position: 'sticky',
        top: 0,
        backgroundColor: theme.colors.background.elevated,
        zIndex: 1
      }}>
        <h3 style={{
          fontSize: theme.typography.fontSize.base,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary,
          margin: 0
        }}>
          Create New
        </h3>
      </div>

      {/* Menu Sections */}
      {menuSections.map((section, sectionIdx) => (
        <div key={sectionIdx} style={{ padding: theme.spacing[2] }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.tertiary,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            <section.icon size={14} />
            {section.section}
          </div>

          {section.items.map((item, itemIdx) => (
            <button
              key={itemIdx}
              onClick={() => handleItemClick(item)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'flex-start',
                gap: theme.spacing[3],
                padding: theme.spacing[3],
                borderRadius: theme.borderRadius.md,
                border: 'none',
                backgroundColor: item.highlight ? theme.colors.primary[50] : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                transition: `all ${theme.transitions.fast}`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = item.highlight
                  ? theme.colors.primary[100]
                  : theme.colors.background.secondary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = item.highlight
                  ? theme.colors.primary[50]
                  : 'transparent';
              }}
            >
              <item.icon
                size={20}
                style={{
                  marginTop: '2px',
                  color: item.highlight ? theme.colors.primary[600] : theme.colors.text.secondary,
                  flexShrink: 0
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  marginBottom: theme.spacing[1]
                }}>
                  <span style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: item.highlight ? theme.colors.primary[700] : theme.colors.text.primary
                  }}>
                    {item.label}
                  </span>
                  {item.highlight && (
                    <span style={{
                      padding: `${theme.spacing[0.5]} ${theme.spacing[2]}`,
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.primary[700],
                      backgroundColor: theme.colors.primary[100],
                      borderRadius: theme.borderRadius.full
                    }}>
                      NEW
                    </span>
                  )}
                </div>
                {item.description && (
                  <p style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                    margin: 0,
                    lineHeight: '1.4'
                  }}>
                    {item.description}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

CreateNewMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  anchorRef: PropTypes.object
};

export default CreateNewMenu;
