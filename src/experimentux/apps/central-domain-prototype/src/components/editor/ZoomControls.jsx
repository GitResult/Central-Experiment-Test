/**
 * ZoomControls Component
 * Floating zoom controls for the canvas editor
 */

import { useEditorStore } from '../../store/editorStore';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import { theme } from '../../config/theme';

export function ZoomControls() {
  const canvasZoom = useEditorStore((state) => state.canvasZoom);
  const setCanvasZoom = useEditorStore((state) => state.setCanvasZoom);
  const zoomIn = useEditorStore((state) => state.zoomIn);
  const zoomOut = useEditorStore((state) => state.zoomOut);
  const zoomToFit = useEditorStore((state) => state.zoomToFit);
  const zoomTo100 = useEditorStore((state) => state.zoomTo100);
  const mode = useEditorStore((state) => state.mode);

  // Only show in edit mode
  if (mode !== 'edit') return null;

  const zoomPercent = Math.round(canvasZoom * 100);

  const buttonStyle = {
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    backgroundColor: 'transparent',
    color: theme.colors.text.secondary,
    cursor: 'pointer',
    borderRadius: theme.borderRadius.md,
    transition: 'all 150ms ease'
  };

  const handleSliderChange = (e) => {
    const value = parseFloat(e.target.value);
    setCanvasZoom(value);
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '6px 12px',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.elevated,
        border: `1px solid ${theme.colors.border.default}`,
        zIndex: 1000,
        fontFamily: theme.typography.fontFamily.sans
      }}
    >
      {/* Zoom Out */}
      <button
        onClick={zoomOut}
        style={buttonStyle}
        title="Zoom out (Cmd -)"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
          e.currentTarget.style.color = theme.colors.text.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = theme.colors.text.secondary;
        }}
      >
        <ZoomOut size={16} />
      </button>

      {/* Zoom Slider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="range"
          min="0.25"
          max="2"
          step="0.05"
          value={canvasZoom}
          onChange={handleSliderChange}
          style={{
            width: '80px',
            height: '4px',
            appearance: 'none',
            background: `linear-gradient(to right, ${theme.colors.primary[500]} 0%, ${theme.colors.primary[500]} ${((canvasZoom - 0.25) / 1.75) * 100}%, ${theme.colors.border.default} ${((canvasZoom - 0.25) / 1.75) * 100}%, ${theme.colors.border.default} 100%)`,
            borderRadius: '2px',
            cursor: 'pointer'
          }}
        />
        <span
          style={{
            minWidth: '40px',
            fontSize: theme.typography.fontSize.xs,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.secondary,
            textAlign: 'center'
          }}
        >
          {zoomPercent}%
        </span>
      </div>

      {/* Zoom In */}
      <button
        onClick={zoomIn}
        style={buttonStyle}
        title="Zoom in (Cmd +)"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
          e.currentTarget.style.color = theme.colors.text.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = theme.colors.text.secondary;
        }}
      >
        <ZoomIn size={16} />
      </button>

      {/* Divider */}
      <div
        style={{
          width: '1px',
          height: '20px',
          backgroundColor: theme.colors.border.default,
          margin: '0 4px'
        }}
      />

      {/* Fit to View */}
      <button
        onClick={zoomToFit}
        style={buttonStyle}
        title="Fit to view"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
          e.currentTarget.style.color = theme.colors.text.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = theme.colors.text.secondary;
        }}
      >
        <Maximize2 size={16} />
      </button>

      {/* Reset to 100% */}
      <button
        onClick={zoomTo100}
        style={{
          ...buttonStyle,
          width: 'auto',
          padding: '0 8px',
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.medium
        }}
        title="Reset to 100%"
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
          e.currentTarget.style.color = theme.colors.text.primary;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = theme.colors.text.secondary;
        }}
      >
        <RotateCcw size={14} style={{ marginRight: '4px' }} />
        100%
      </button>
    </div>
  );
}
