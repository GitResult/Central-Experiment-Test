/**
 * Interaction Modes Menu Component
 * A popover panel for selecting interaction modes
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Scale,
  BarChart3,
  Palette,
  Pencil,
  Filter,
  Target,
  HelpCircle,
  Camera,
  Clock,
  Eye,
  MousePointer2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { theme } from '../../config/theme';

// Interaction modes grouped by category
const INTERACTION_MODES = {
  default: [
    { id: 'balanced', label: 'Balanced', icon: MousePointer2, description: 'Default balanced mode' }
  ],
  create: [
    { id: 'edit', label: 'Edit', icon: Pencil, description: 'Edit mode' },
    { id: 'design', label: 'Design', icon: Palette, description: 'Design mode' },
    { id: 'help', label: 'Help', icon: HelpCircle, description: 'Help mode' }
  ],
  data: [
    { id: 'chart', label: 'Chart', icon: BarChart3, description: 'Chart mode' },
    { id: 'filter', label: 'Filter', icon: Filter, description: 'Filter mode' },
    { id: 'view', label: 'View', icon: Eye, description: 'View mode' }
  ],
  navigate: [
    { id: 'focus', label: 'Focus', icon: Target, description: 'Focus mode' },
    { id: 'snapshot', label: 'Snapshot', icon: Camera, description: 'Snapshot mode' },
    { id: 'timeline', label: 'Timeline', icon: Clock, description: 'Timeline mode' }
  ]
};

// Flatten modes for easy access
const ALL_MODES = [
  ...INTERACTION_MODES.default,
  ...INTERACTION_MODES.create,
  ...INTERACTION_MODES.data,
  ...INTERACTION_MODES.navigate
];

// Group labels for display
const GROUP_LABELS = {
  default: 'Default',
  create: 'Create',
  data: 'Data',
  navigate: 'Navigate'
};

export function InteractionModesMenu({
  isOpen,
  onClose,
  onSelectMode,
  currentMode = 'balanced',
  snappedEdge = 'right',
  isHorizontal = false,
  anchorPosition = { x: 0, y: 0 },
  isExpanded = false,
  onToggleExpand
}) {
  const menuRef = useRef(null);
  const [hoveredMode, setHoveredMode] = useState(null);

  // Close on click outside - with delay to prevent immediate close
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Small delay to prevent the opening click from triggering close
    const timeoutId = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 10);
    document.addEventListener('keydown', handleEsc);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  const handleModeSelect = (modeId) => {
    onSelectMode(modeId);
    if (!isExpanded) {
      onClose();
    }
  };

  // Calculate popover position based on snapped edge - using fixed positioning
  const getPopoverPosition = () => {
    const popoverWidth = 200;
    const popoverHeight = 400; // approximate
    const offset = 12;

    switch (snappedEdge) {
      case 'right':
        return {
          position: 'fixed',
          left: anchorPosition.x - popoverWidth - offset - 20,
          top: anchorPosition.y - popoverHeight / 2
        };
      case 'left':
        return {
          position: 'fixed',
          left: anchorPosition.x + offset + 20,
          top: anchorPosition.y - popoverHeight / 2
        };
      case 'top':
        return {
          position: 'fixed',
          left: anchorPosition.x - popoverWidth / 2,
          top: anchorPosition.y + offset + 20
        };
      case 'bottom':
        return {
          position: 'fixed',
          left: anchorPosition.x - popoverWidth / 2,
          top: anchorPosition.y - popoverHeight - offset - 20
        };
      default:
        // Floating - position based on orientation
        if (isHorizontal) {
          return {
            position: 'fixed',
            left: anchorPosition.x - popoverWidth / 2,
            top: anchorPosition.y - popoverHeight - offset - 20
          };
        }
        return {
          position: 'fixed',
          left: anchorPosition.x - popoverWidth - offset - 20,
          top: anchorPosition.y - popoverHeight / 2
        };
    }
  };

  // Render a mode button
  const renderModeButton = (mode, showLabel = true) => {
    const Icon = mode.icon;
    const isActive = currentMode === mode.id;
    const isHovered = hoveredMode === mode.id;

    return (
      <motion.button
        key={mode.id}
        whileHover={{ background: theme.colors.interactive.hover }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleModeSelect(mode.id)}
        onMouseEnter={() => setHoveredMode(mode.id)}
        onMouseLeave={() => setHoveredMode(null)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '100%',
          padding: '8px 12px',
          background: isActive ? theme.colors.primary[50] : 'transparent',
          border: 'none',
          borderRadius: theme.borderRadius.md,
          cursor: 'pointer',
          color: isActive ? theme.colors.primary[600] : theme.colors.text.primary,
          textAlign: 'left'
        }}
      >
        <div style={{
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isActive ? theme.colors.primary[100] : theme.colors.background.tertiary,
          borderRadius: theme.borderRadius.md
        }}>
          <Icon size={16} strokeWidth={1.5} />
        </div>
        {showLabel && (
          <span style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: isActive ? theme.typography.fontWeight.medium : theme.typography.fontWeight.regular
          }}>
            {mode.label}
          </span>
        )}
        {isActive && (
          <span style={{
            marginLeft: 'auto',
            color: theme.colors.primary[500],
            fontSize: theme.typography.fontSize.xs
          }}>
            ✓
          </span>
        )}
      </motion.button>
    );
  };

  // Render inline expanded view
  if (isExpanded) {
    return (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        style={{
          display: 'flex',
          flexDirection: isHorizontal ? 'row' : 'column',
          gap: '2px',
          padding: '4px',
          overflow: 'hidden'
        }}
      >
        {/* Collapse button */}
        <motion.button
          whileHover={{ background: theme.colors.interactive.hover }}
          whileTap={{ scale: 0.95 }}
          onClick={onToggleExpand}
          style={{
            width: '40px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.colors.background.tertiary,
            border: 'none',
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            color: theme.colors.text.tertiary
          }}
        >
          {isHorizontal ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
        </motion.button>

        {/* All modes inline */}
        {ALL_MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = currentMode === mode.id;
          return (
            <motion.button
              key={mode.id}
              whileHover={{ background: isActive ? theme.colors.primary[100] : theme.colors.interactive.hover }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleModeSelect(mode.id)}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: isActive ? theme.colors.primary[50] : 'transparent',
                border: isActive ? `2px solid ${theme.colors.primary[500]}` : 'none',
                borderRadius: theme.borderRadius.lg,
                cursor: 'pointer',
                color: isActive ? theme.colors.primary[600] : theme.colors.text.secondary
              }}
              title={mode.label}
            >
              <Icon size={18} strokeWidth={1.5} />
            </motion.button>
          );
        })}
      </motion.div>
    );
  }

  // Render popover panel
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 4 }}
          transition={{ duration: 0.15 }}
          style={{
            ...getPopoverPosition(),
            width: '200px',
            background: theme.colors.background.elevated,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border.default}`,
            boxShadow: theme.shadows.lg,
            zIndex: theme.zIndex.modal + 1,
            maxHeight: '80vh',
            overflowY: 'auto'
          }}
        >
          {/* Header */}
          <div style={{
            padding: '12px 12px 8px',
            borderBottom: `1px solid ${theme.colors.border.subtle}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.secondary,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}>
              Interaction Mode
            </span>
          </div>

          {/* Mode groups */}
          <div style={{ padding: '8px' }}>
            {/* Default group */}
            {INTERACTION_MODES.default.map(mode => renderModeButton(mode))}

            {/* Separator */}
            <div style={{
              height: '1px',
              background: theme.colors.border.subtle,
              margin: '8px 0'
            }} />

            {/* Create group */}
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              padding: '4px 12px',
              marginBottom: '4px'
            }}>
              Create
            </div>
            {INTERACTION_MODES.create.map(mode => renderModeButton(mode))}

            {/* Separator */}
            <div style={{
              height: '1px',
              background: theme.colors.border.subtle,
              margin: '8px 0'
            }} />

            {/* Data group */}
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              padding: '4px 12px',
              marginBottom: '4px'
            }}>
              Data
            </div>
            {INTERACTION_MODES.data.map(mode => renderModeButton(mode))}

            {/* Separator */}
            <div style={{
              height: '1px',
              background: theme.colors.border.subtle,
              margin: '8px 0'
            }} />

            {/* Navigate group */}
            <div style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              padding: '4px 12px',
              marginBottom: '4px'
            }}>
              Navigate
            </div>
            {INTERACTION_MODES.navigate.map(mode => renderModeButton(mode))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export { INTERACTION_MODES, ALL_MODES };
