/**
 * Panel Controls
 * Minimize, maximize, dock, float, close buttons for panels
 */

import PropTypes from 'prop-types';
import { Minimize2, Maximize2, Pin, X, Square } from 'lucide-react';
import { theme } from '../../config/theme';

export function PanelControls({
  mode,
  minimizable = true,
  closable = true,
  onMinimize,
  onDockFloat,
  onClose
}) {
  const buttonStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: theme.spacing[1.5],
    borderRadius: theme.borderRadius.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: theme.colors.text.secondary,
    transition: `all ${theme.transitions.fast}`
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
      {/* Dock/Float toggle */}
      <button
        onClick={onDockFloat}
        style={buttonStyle}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
          e.currentTarget.style.color = theme.colors.text.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = theme.colors.text.secondary;
        }}
        title={mode === 'floating' ? 'Dock panel' : 'Float panel'}
        aria-label={mode === 'floating' ? 'Dock panel' : 'Float panel'}
      >
        {mode === 'floating' ? <Pin size={14} /> : <Square size={14} />}
      </button>

      {/* Minimize */}
      {minimizable && (
        <button
          onClick={onMinimize}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.interactive.hover;
            e.currentTarget.style.color = theme.colors.text.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.colors.text.secondary;
          }}
          title="Minimize panel"
          aria-label="Minimize panel"
        >
          <Minimize2 size={14} />
        </button>
      )}

      {/* Close */}
      {closable && (
        <button
          onClick={onClose}
          style={buttonStyle}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.error[50];
            e.currentTarget.style.color = theme.colors.error[600];
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = theme.colors.text.secondary;
          }}
          title="Close panel"
          aria-label="Close panel"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

PanelControls.propTypes = {
  mode: PropTypes.oneOf(['docked', 'floating', 'minimized']).isRequired,
  minimizable: PropTypes.bool,
  closable: PropTypes.bool,
  onMinimize: PropTypes.func.isRequired,
  onDockFloat: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PanelControls;
