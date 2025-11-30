/**
 * PresenterToolbar
 * Presentation controls toolbar
 */

import PropTypes from 'prop-types';
import { ChevronLeft, ChevronRight, Play, Square, Maximize, Grid, Download, Mouse, Pencil, Monitor } from 'lucide-react';
import { theme } from '../../config/theme';

export function PresenterToolbar({
  currentSlide,
  totalSlides,
  isPresenting,
  onPrevious,
  onNext,
  onStart,
  onStop,
  onOpenNavigator,
  onOpenExport,
  onToggleLaser,
  onToggleDrawing,
  onToggleBlackout,
  laserActive,
  drawingActive,
  blackoutActive
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing[2],
      padding: theme.spacing[3],
      backgroundColor: theme.colors.background.elevated,
      borderBottom: `1px solid ${theme.colors.border.default}`
    }}>
      {/* Left: Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
        <button
          onClick={onPrevious}
          disabled={currentSlide === 0}
          style={{
            padding: theme.spacing[2],
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
            opacity: currentSlide === 0 ? 0.5 : 1,
            color: theme.colors.text.primary,
            display: 'flex',
            alignItems: 'center'
          }}
          title="Previous Slide"
        >
          <ChevronLeft size={18} />
        </button>

        <span style={{
          padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
          fontSize: theme.typography.fontSize.sm,
          color: theme.colors.text.secondary,
          fontFamily: 'monospace',
          minWidth: '80px',
          textAlign: 'center'
        }}>
          {currentSlide + 1} / {totalSlides}
        </span>

        <button
          onClick={onNext}
          disabled={currentSlide >= totalSlides - 1}
          style={{
            padding: theme.spacing[2],
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            cursor: currentSlide >= totalSlides - 1 ? 'not-allowed' : 'pointer',
            opacity: currentSlide >= totalSlides - 1 ? 0.5 : 1,
            color: theme.colors.text.primary,
            display: 'flex',
            alignItems: 'center'
          }}
          title="Next Slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Center: Presentation Controls */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: theme.spacing[2] }}>
        {!isPresenting ? (
          <button
            onClick={onStart}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: theme.spacing[2],
              padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
              backgroundColor: theme.colors.primary[500],
              color: theme.colors.text.inverse,
              border: 'none',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              cursor: 'pointer'
            }}
          >
            <Play size={16} />
            Start Presenting
          </button>
        ) : (
          <>
            <button
              onClick={onStop}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: theme.spacing[2],
                padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
                backgroundColor: theme.colors.error[500],
                color: theme.colors.text.inverse,
                border: 'none',
                borderRadius: theme.borderRadius.md,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium,
                cursor: 'pointer'
              }}
            >
              <Square size={16} />
              Stop
            </button>

            <div style={{
              width: '1px',
              height: '24px',
              backgroundColor: theme.colors.border.default,
              margin: `0 ${theme.spacing[2]}`
            }} />

            <button
              onClick={onToggleLaser}
              style={{
                padding: theme.spacing[2],
                backgroundColor: laserActive ? theme.colors.primary[100] : 'transparent',
                border: `1px solid ${laserActive ? theme.colors.primary[500] : theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                color: laserActive ? theme.colors.primary[700] : theme.colors.text.primary,
                display: 'flex',
                alignItems: 'center'
              }}
              title="Laser Pointer (L)"
            >
              <Mouse size={16} />
            </button>

            <button
              onClick={onToggleDrawing}
              style={{
                padding: theme.spacing[2],
                backgroundColor: drawingActive ? theme.colors.primary[100] : 'transparent',
                border: `1px solid ${drawingActive ? theme.colors.primary[500] : theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                color: drawingActive ? theme.colors.primary[700] : theme.colors.text.primary,
                display: 'flex',
                alignItems: 'center'
              }}
              title="Drawing Mode (D)"
            >
              <Pencil size={16} />
            </button>

            <button
              onClick={onToggleBlackout}
              style={{
                padding: theme.spacing[2],
                backgroundColor: blackoutActive ? theme.colors.neutral[900] : 'transparent',
                border: `1px solid ${blackoutActive ? theme.colors.neutral[700] : theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                color: blackoutActive ? theme.colors.text.inverse : theme.colors.text.primary,
                display: 'flex',
                alignItems: 'center'
              }}
              title="Blackout Screen (B)"
            >
              <Monitor size={16} />
            </button>
          </>
        )}
      </div>

      {/* Right: Utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[1] }}>
        <button
          onClick={onOpenNavigator}
          style={{
            padding: theme.spacing[2],
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            color: theme.colors.text.primary,
            display: 'flex',
            alignItems: 'center'
          }}
          title="Slide Navigator"
        >
          <Grid size={18} />
        </button>

        <button
          onClick={onOpenExport}
          style={{
            padding: theme.spacing[2],
            backgroundColor: 'transparent',
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            color: theme.colors.text.primary,
            display: 'flex',
            alignItems: 'center'
          }}
          title="Export Presentation"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
}

PresenterToolbar.propTypes = {
  currentSlide: PropTypes.number.isRequired,
  totalSlides: PropTypes.number.isRequired,
  isPresenting: PropTypes.bool.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired,
  onStop: PropTypes.func.isRequired,
  onOpenNavigator: PropTypes.func.isRequired,
  onOpenExport: PropTypes.func.isRequired,
  onToggleLaser: PropTypes.func.isRequired,
  onToggleDrawing: PropTypes.func.isRequired,
  onToggleBlackout: PropTypes.func.isRequired,
  laserActive: PropTypes.bool,
  drawingActive: PropTypes.bool,
  blackoutActive: PropTypes.bool
};

export default PresenterToolbar;
