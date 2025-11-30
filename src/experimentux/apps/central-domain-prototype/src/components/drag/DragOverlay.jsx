/**
 * DragOverlay Component
 * Visual preview shown during element dragging
 * Uses @dnd-kit/core DragOverlay for smooth animations
 */

import { DragOverlay as DndKitOverlay } from '@dnd-kit/core';
import { useTheme } from '../theme/ThemeProvider';
import PropTypes from 'prop-types';

export function DragOverlay({ activeElement, children }) {
  const { resolveToken } = useTheme();

  if (!activeElement) {
    return (
      <DndKitOverlay>
        {null}
      </DndKitOverlay>
    );
  }

  return (
    <DndKitOverlay
      dropAnimation={{
        duration: 200,
        easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
      }}
    >
      <div
        style={{
          cursor: 'grabbing',
          opacity: 0.9,
          transform: 'rotate(3deg)',
          boxShadow: resolveToken('{{theme.shadows.xl}}'),
          borderRadius: resolveToken('{{theme.borderRadius.lg}}'),
          background: resolveToken('{{theme.colors.background.primary}}'),
          border: `2px solid ${resolveToken('{{theme.colors.primary.500}}')}`,
          padding: resolveToken('{{theme.spacing.4}}'),
          minWidth: '200px',
          maxWidth: '400px',
        }}
      >
        {children || (
          <div
            style={{
              fontSize: resolveToken('{{theme.typography.fontSize.sm}}'),
              color: resolveToken('{{theme.colors.text.secondary}}'),
              fontWeight: resolveToken('{{theme.typography.fontWeight.medium}}'),
            }}
          >
            {activeElement.type} Element
          </div>
        )}
      </div>
    </DndKitOverlay>
  );
}

DragOverlay.propTypes = {
  activeElement: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.string,
    data: PropTypes.object,
    settings: PropTypes.object,
  }),
  children: PropTypes.node,
};
