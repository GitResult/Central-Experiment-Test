/**
 * ElementWrapper Component
 * Wraps elements with drag handle and selection functionality
 */

import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DragHandle } from './DragHandle';
import { useEditorStore } from '../../store/editorStore';
import { theme } from '../../config/theme';

export function ElementWrapper({ elementPath, children, isAnyDragging = false }) {
  const selectedElement = useEditorStore((state) => state.selectedElement);
  const selectElement = useEditorStore((state) => state.selectElement);
  const openSidebar = useEditorStore((state) => state.openSidebar);

  // Create unique ID for this element
  const elementId = `${elementPath.zoneId}-${elementPath.rowIndex}-${elementPath.columnIndex}-${elementPath.elementIndex}`;

  // useSortable hook for drag and drop
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: elementId });

  // Check if this element is selected by comparing paths
  const isSelected = selectedElement &&
    selectedElement.zoneId === elementPath.zoneId &&
    selectedElement.rowIndex === elementPath.rowIndex &&
    selectedElement.columnIndex === elementPath.columnIndex &&
    selectedElement.elementIndex === elementPath.elementIndex;

  const handleSelect = () => {
    selectElement(elementPath);
    openSidebar('settings'); // Open sidebar on Settings tab when element is selected
  };

  const style = {
    // Disable transforms for ALL elements when ANY drag is active
    transform: isAnyDragging ? 'none' : CSS.Transform.toString(transform),
    transition: isAnyDragging ? 'none' : transition,
    outline: isSelected ? `2px solid ${theme.colors.primary[500]}` : 'none',
    outlineOffset: '2px',
    borderRadius: theme.borderRadius.sm,
    marginLeft: '24px', // Make room for the drag handle
    opacity: isDragging ? 0 : 1, // Hide original element completely during drag
    cursor: isDragging ? 'grabbing' : 'default'
  };

  return (
    <div
      ref={setNodeRef}
      className="group relative"
      style={style}
      onClick={handleSelect}
    >
      <DragHandle
        onSelect={handleSelect}
        isSelected={isSelected}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
      {children}
    </div>
  );
}

ElementWrapper.propTypes = {
  elementPath: PropTypes.shape({
    zoneId: PropTypes.string.isRequired,
    rowIndex: PropTypes.number.isRequired,
    columnIndex: PropTypes.number.isRequired,
    elementIndex: PropTypes.number.isRequired
  }).isRequired,
  children: PropTypes.node.isRequired,
  isAnyDragging: PropTypes.bool
};
