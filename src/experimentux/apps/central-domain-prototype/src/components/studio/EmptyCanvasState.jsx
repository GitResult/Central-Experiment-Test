/**
 * EmptyCanvasState Component
 * Displayed when a new page has no content yet
 * Provides quick-start options to add first elements
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Square,
  Type,
  Image,
  ListOrdered,
  Diamond,
  Layout,
  FileText,
  Table,
  FormInput
} from 'lucide-react';
import { theme } from '../../config/theme';
import { usePagesStore } from '../../store/pagesStore';

// Quick start element types
const QUICK_START_ELEMENTS = [
  { id: 'frame', label: 'Frame', icon: Layout, description: 'Container for layout' },
  { id: 'text', label: 'Text', icon: Type, description: 'Add text content' },
  { id: 'image', label: 'Image', icon: Image, description: 'Add an image' },
  { id: 'list', label: 'List', icon: ListOrdered, description: 'Create a list' },
  { id: 'shape', label: 'Shape', icon: Diamond, description: 'Add a shape' }
];

// Element button component
function ElementButton({ element, onClick, delay }) {
  const Icon = element.icon;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.05 + 0.2, type: 'spring', stiffness: 400, damping: 25 }}
      onClick={() => onClick(element.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: theme.spacing[2],
        padding: theme.spacing[4],
        width: '80px',
        background: isHovered ? theme.colors.background.elevated : theme.colors.background.tertiary,
        border: `1px solid ${isHovered ? theme.colors.border.medium : theme.colors.border.subtle}`,
        borderRadius: theme.borderRadius.lg,
        cursor: 'pointer',
        transition: `all ${theme.transitions.fast}`,
        boxShadow: isHovered ? theme.shadows.md : theme.shadows.none
      }}
    >
      <Icon
        size={24}
        strokeWidth={1.5}
        color={isHovered ? theme.colors.primary[500] : theme.colors.text.secondary}
        style={{ transition: `color ${theme.transitions.fast}` }}
      />
      <span
        style={{
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium,
          color: isHovered ? theme.colors.text.primary : theme.colors.text.secondary,
          transition: `color ${theme.transitions.fast}`
        }}
      >
        {element.label}
      </span>
    </motion.button>
  );
}

export function EmptyCanvasState({ onAddElement, onOpenCommandPalette }) {
  const { getActivePage, markPageHasContent } = usePagesStore();
  const activePage = getActivePage();

  const handleElementClick = (elementType) => {
    // Mark the page as having content
    if (activePage) {
      markPageHasContent(activePage.id);
    }
    // Trigger the add element callback
    if (onAddElement) {
      onAddElement(elementType);
    }
  };

  const handleCenterButtonClick = () => {
    // Could open an element browser or command palette
    if (onOpenCommandPalette) {
      onOpenCommandPalette();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: theme.typography.fontFamily.sans,
        pointerEvents: 'none'
      }}
    >
      {/* Content container - enables pointer events */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: theme.spacing[8],
          pointerEvents: 'auto'
        }}
      >
        {/* Center plus button */}
        <motion.button
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
          onClick={handleCenterButtonClick}
          whileHover={{ scale: 1.08, boxShadow: theme.shadows.lg }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: '64px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.colors.background.elevated,
            border: `2px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.xl,
            cursor: 'pointer',
            boxShadow: theme.shadows.md,
            transition: `all ${theme.transitions.fast}`
          }}
        >
          <Plus size={28} strokeWidth={1.5} color={theme.colors.text.secondary} />
        </motion.button>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            textAlign: 'center'
          }}
        >
          <h2
            style={{
              fontSize: theme.typography.fontSize.lg,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.text.primary,
              margin: 0,
              marginBottom: theme.spacing[2]
            }}
          >
            Start building your page
          </h2>
          <p
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.tertiary,
              margin: 0
            }}
          >
            Choose an element to begin
          </p>
        </motion.div>

        {/* Quick start elements */}
        <div
          style={{
            display: 'flex',
            gap: theme.spacing[3],
            flexWrap: 'wrap',
            justifyContent: 'center',
            maxWidth: '500px'
          }}
        >
          {QUICK_START_ELEMENTS.map((element, index) => (
            <ElementButton
              key={element.id}
              element={element}
              onClick={handleElementClick}
              delay={index}
            />
          ))}
        </div>

        {/* Keyboard hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[4],
            marginTop: theme.spacing[4]
          }}
        >
          <span
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.disabled,
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[1.5]
            }}
          >
            Press
            <kbd
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: `${theme.spacing[0.5]} ${theme.spacing[1.5]}`,
                backgroundColor: theme.colors.background.tertiary,
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.sm,
                fontSize: theme.typography.fontSize.xs,
                fontFamily: theme.typography.fontFamily.mono,
                color: theme.colors.text.tertiary,
                minWidth: '20px'
              }}
            >
              /
            </kbd>
            for commands
          </span>
          <span
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.disabled
            }}
          >
            •
          </span>
          <span
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.disabled
            }}
          >
            Drag from dock
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}
