/**
 * DropZone Component
 * Droppable area for adding new elements
 */

import { useDroppable } from '@dnd-kit/core';
import { theme } from '../../config/theme';
import PropTypes from 'prop-types';

export function DropZone({ zoneId, rowIndex, columnIndex, compact = false, pageKey, elementIndex }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `dropzone-${zoneId}-${rowIndex}-${columnIndex}-${elementIndex ?? 'end'}`,
    data: { zoneId, rowIndex, columnIndex, pageKey, elementIndex }
  });

  return (
    <div
      ref={setNodeRef}
      className="rounded-lg border-2 border-dashed p-4 text-center transition-all"
      style={{
        borderColor: isOver ? theme.colors.primary[500] : theme.colors.border.default,
        backgroundColor: isOver ? `${theme.colors.primary[500]}10` : 'transparent',
        minHeight: compact ? '60px' : '120px',
        marginBottom: theme.spacing.md
      }}
    >
      <div
        style={{
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm
        }}
      >
        {isOver ? 'Drop element here' : compact ? 'Drop elements here' : 'Drop elements here to add content'}
      </div>
    </div>
  );
}

DropZone.propTypes = {
  zoneId: PropTypes.string.isRequired,
  rowIndex: PropTypes.number.isRequired,
  columnIndex: PropTypes.number.isRequired,
  compact: PropTypes.bool,
  pageKey: PropTypes.string,
  elementIndex: PropTypes.number
};
