/**
 * DragHandle Component
 * Notion-style drag handle that appears on element hover
 */

import PropTypes from 'prop-types';
import { GripVertical } from 'lucide-react';
import { theme } from '../../config/theme';

export function DragHandle({ onSelect, isSelected = false, dragListeners, dragAttributes }) {
  return (
    <button
      {...dragListeners}
      {...dragAttributes}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className="drag-handle opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
      style={{
        position: 'absolute',
        left: '-22px',
        top: '2px',
        width: '20px',
        height: '24px', // Increased height to match Notion
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: isSelected ? theme.colors.primary[500] : theme.colors.text.tertiary,
        backgroundColor: isSelected ? theme.colors.primary[50] : 'transparent',
        border: `1px solid ${isSelected ? theme.colors.primary[200] : theme.colors.border.default}`,
        borderRadius: theme.borderRadius.sm,
        padding: '2px',
        cursor: 'grab',
        zIndex: 10
      }}
      aria-label="Drag to reorder or click to select"
    >
      <GripVertical size={16} strokeWidth={2} />
    </button>
  );
}

DragHandle.propTypes = {
  onSelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool,
  dragListeners: PropTypes.object,
  dragAttributes: PropTypes.object
};
