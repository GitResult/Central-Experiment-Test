/**
 * DragOverlayContent Component
 * Renders a visual preview of the element being dragged
 */

import { motion } from 'framer-motion';
import { GripVertical, Type, Image, Layout, List, Box } from 'lucide-react';
import { theme } from '../../config/theme';

// Icon mapping for element types
const ELEMENT_ICONS = {
  markup: Type,
  structure: Layout,
  field: Box,
  image: Image,
  list: List,
  'welcome-card': Layout,
  'journey-card': Layout,
  'insights-card': Layout,
  'quick-links': List,
  'upcoming-tasks': List,
  default: Box
};

// Friendly names for element types
const ELEMENT_NAMES = {
  markup: 'Text Block',
  structure: 'Container',
  field: 'Form Field',
  image: 'Image',
  list: 'List',
  'welcome-card': 'Welcome Card',
  'journey-card': 'Journey Card',
  'insights-card': 'Insights Card',
  'quick-links': 'Quick Links',
  'upcoming-tasks': 'Upcoming Tasks',
  default: 'Element'
};

export function DragOverlayContent({ element, isDragging }) {
  if (!element) return null;

  const elementType = element.type || 'default';
  const Icon = ELEMENT_ICONS[elementType] || ELEMENT_ICONS.default;
  const name = ELEMENT_NAMES[elementType] || ELEMENT_NAMES.default;

  return (
    <motion.div
      initial={{ scale: 1, rotate: 0 }}
      animate={{
        scale: 1.02,
        rotate: isDragging ? 2 : 0,
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15), 0 8px 16px rgba(0, 0, 0, 0.1)'
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        backgroundColor: 'white',
        borderRadius: theme.borderRadius.lg,
        border: `2px solid ${theme.colors.primary[500]}`,
        minWidth: '180px',
        maxWidth: '300px',
        cursor: 'grabbing',
        fontFamily: theme.typography.fontFamily.sans
      }}
    >
      {/* Drag handle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '28px',
          height: '28px',
          backgroundColor: theme.colors.primary[50],
          borderRadius: theme.borderRadius.md,
          color: theme.colors.primary[600]
        }}
      >
        <GripVertical size={16} />
      </div>

      {/* Element info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '2px'
          }}
        >
          <Icon size={14} color={theme.colors.text.secondary} />
          <span
            style={{
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.primary
            }}
          >
            {name}
          </span>
        </div>
        {element.data?.content && (
          <p
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary,
              margin: 0,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {typeof element.data.content === 'string'
              ? element.data.content.slice(0, 40) + (element.data.content.length > 40 ? '...' : '')
              : ''}
          </p>
        )}
      </div>

      {/* Drag indicator */}
      <motion.div
        animate={{
          y: [0, -3, 0]
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: theme.colors.primary[500]
        }}
      />
    </motion.div>
  );
}

/**
 * Simple drag preview for palette elements
 */
export function PaletteDragPreview({ elementType, elementSubtype }) {
  const Icon = ELEMENT_ICONS[elementType] || ELEMENT_ICONS.default;
  const name = elementSubtype || ELEMENT_NAMES[elementType] || ELEMENT_NAMES.default;

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '10px 14px',
        backgroundColor: theme.colors.primary[50],
        borderRadius: theme.borderRadius.lg,
        border: `2px dashed ${theme.colors.primary[400]}`,
        fontFamily: theme.typography.fontFamily.sans,
        boxShadow: theme.shadows.lg
      }}
    >
      <Icon size={18} color={theme.colors.primary[600]} />
      <span
        style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.medium,
          color: theme.colors.primary[700]
        }}
      >
        + Add {name}
      </span>
    </motion.div>
  );
}
