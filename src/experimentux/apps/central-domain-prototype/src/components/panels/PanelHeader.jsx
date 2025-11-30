/**
 * Panel Header
 * Common header with title, actions, and controls
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import PanelControls from './PanelControls';

export function PanelHeader({
  title,
  icon: Icon,
  mode,
  minimizable,
  closable,
  onMinimize,
  onDockFloat,
  onClose,
  actions,
  isDraggable = false,
  onDragStart
}) {
  const handleMouseDown = (e) => {
    if (isDraggable && mode === 'floating') {
      onDragStart?.(e);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: `${theme.spacing[3]} ${theme.spacing[4]}`,
        borderBottom: `1px solid ${theme.colors.border.default}`,
        backgroundColor: theme.colors.background.tertiary,
        cursor: isDraggable && mode === 'floating' ? 'move' : 'default',
        userSelect: 'none'
      }}
      onMouseDown={handleMouseDown}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
        {Icon && <Icon size={16} color={theme.colors.text.secondary} />}
        <h3
          style={{
            margin: 0,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary
          }}
        >
          {title}
        </h3>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[3] }}>
        {/* Custom actions */}
        {actions && (
          <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
            {actions}
          </div>
        )}

        {/* Panel controls */}
        <PanelControls
          mode={mode}
          minimizable={minimizable}
          closable={closable}
          onMinimize={onMinimize}
          onDockFloat={onDockFloat}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

PanelHeader.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.elementType,
  mode: PropTypes.oneOf(['docked', 'floating', 'minimized']).isRequired,
  minimizable: PropTypes.bool,
  closable: PropTypes.bool,
  onMinimize: PropTypes.func.isRequired,
  onDockFloat: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  actions: PropTypes.node,
  isDraggable: PropTypes.bool,
  onDragStart: PropTypes.func
};

export default PanelHeader;
