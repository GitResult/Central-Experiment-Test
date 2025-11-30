/**
 * Taskbar Component
 * Displays minimized panels at the bottom of the screen
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import { usePanelStore } from '../../store/panelStore';

export function Taskbar() {
  const minimizedPanels = usePanelStore(state => state.getMinimizedPanels());
  const restorePanel = usePanelStore(state => state.restorePanel);

  if (minimizedPanels.length === 0) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '48px',
        backgroundColor: theme.colors.background.tertiary,
        borderTop: `1px solid ${theme.colors.border.default}`,
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[2],
        padding: `0 ${theme.spacing[4]}`,
        zIndex: theme.zIndex.fixed,
        boxShadow: theme.shadows.md
      }}
    >
      {minimizedPanels.map((panel) => (
        <TaskbarItem
          key={panel.id}
          panel={panel}
          onRestore={() => restorePanel(panel.id)}
        />
      ))}
    </div>
  );
}

function TaskbarItem({ panel, onRestore }) {
  return (
    <button
      onClick={onRestore}
      style={{
        backgroundColor: theme.colors.background.elevated,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius.md,
        padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.text.primary,
        cursor: 'pointer',
        transition: `all ${theme.transitions.fast}`,
        maxWidth: '200px',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
        e.currentTarget.style.borderColor = theme.colors.border.medium;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = theme.colors.background.elevated;
        e.currentTarget.style.borderColor = theme.colors.border.default;
      }}
      title={panel.title}
    >
      {panel.title}
    </button>
  );
}

TaskbarItem.propTypes = {
  panel: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  onRestore: PropTypes.func.isRequired
};

export default Taskbar;
