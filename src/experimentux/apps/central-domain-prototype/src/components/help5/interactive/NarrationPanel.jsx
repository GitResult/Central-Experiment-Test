/**
 * NarrationPanel
 * Speech bubble with playback controls for interactive guides
 */

import PropTypes from 'prop-types';
import { Play, Pause, SkipForward, ChevronLeft, ChevronRight } from 'lucide-react';
import { theme } from '../../../config/theme';

export function NarrationPanel({
  narration,
  isPlaying,
  isPaused,
  speed,
  currentStep,
  totalSteps,
  onPlay,
  onPause,
  onResume,
  onPrevious,
  onNext,
  onSkip,
  onSpeedChange,
  canGoPrevious,
  canGoNext
}) {
  const handlePlayPause = () => {
    if (isPlaying) {
      onPause?.();
    } else if (isPaused) {
      onResume?.();
    } else {
      onPlay?.();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: theme.spacing[6],
        left: '50%',
        transform: 'translateX(-50%)',
        maxWidth: '600px',
        width: '90%',
        backgroundColor: theme.colors.background.elevated,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows['2xl'],
        zIndex: theme.zIndex.modal + 5,
        overflow: 'hidden'
      }}
    >
      {/* Speech Bubble Pointer */}
      <div
        style={{
          position: 'absolute',
          top: '-10px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0,
          height: 0,
          borderLeft: '10px solid transparent',
          borderRight: '10px solid transparent',
          borderBottom: `10px solid ${theme.colors.background.elevated}`
        }}
      />

      {/* Narration Text */}
      <div
        style={{
          padding: theme.spacing[4],
          borderBottom: `1px solid ${theme.colors.border.default}`,
          minHeight: '60px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <p
          style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.primary,
            margin: 0,
            lineHeight: theme.typography.lineHeight.relaxed
          }}
        >
          {narration || 'Ready to start the interactive guide...'}
        </p>
      </div>

      {/* Controls */}
      <div
        style={{
          padding: theme.spacing[3],
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: theme.spacing[3],
          backgroundColor: theme.colors.background.secondary
        }}
      >
        {/* Step Counter */}
        <div
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontWeight: theme.typography.fontWeight.medium,
            minWidth: '80px'
          }}
        >
          {currentStep + 1} / {totalSteps}
        </div>

        {/* Playback Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2]
          }}
        >
          {/* Previous */}
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            style={{
              ...controlButtonStyle,
              opacity: canGoPrevious ? 1 : 0.4,
              cursor: canGoPrevious ? 'pointer' : 'not-allowed'
            }}
            title="Previous step"
          >
            <ChevronLeft size={18} />
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            style={{
              ...controlButtonStyle,
              backgroundColor: theme.colors.primary[500],
              color: theme.colors.neutral[0],
              padding: theme.spacing[3]
            }}
            title={isPlaying ? 'Pause' : isPaused ? 'Resume' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          {/* Next */}
          <button
            onClick={onNext}
            disabled={!canGoNext}
            style={{
              ...controlButtonStyle,
              opacity: canGoNext ? 1 : 0.4,
              cursor: canGoNext ? 'pointer' : 'not-allowed'
            }}
            title="Next step"
          >
            <ChevronRight size={18} />
          </button>

          {/* Skip to Review */}
          <button
            onClick={onSkip}
            style={controlButtonStyle}
            title="Skip to review"
          >
            <SkipForward size={18} />
          </button>
        </div>

        {/* Speed Control */}
        <button
          onClick={onSpeedChange}
          style={{
            padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
            backgroundColor: theme.colors.background.elevated,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            color: theme.colors.text.primary,
            cursor: 'pointer',
            minWidth: '60px',
            transition: `all ${theme.transitions.fast}`
          }}
          title="Change playback speed"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.background.tertiary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = theme.colors.background.elevated;
          }}
        >
          {speed}x
        </button>
      </div>
    </div>
  );
}

const controlButtonStyle = {
  padding: theme.spacing[2],
  backgroundColor: theme.colors.background.elevated,
  border: `1px solid ${theme.colors.border.default}`,
  borderRadius: theme.borderRadius.md,
  color: theme.colors.text.primary,
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: `all ${theme.transitions.fast}`
};

NarrationPanel.propTypes = {
  narration: PropTypes.string,
  isPlaying: PropTypes.bool,
  isPaused: PropTypes.bool,
  speed: PropTypes.number,
  currentStep: PropTypes.number,
  totalSteps: PropTypes.number,
  onPlay: PropTypes.func,
  onPause: PropTypes.func,
  onResume: PropTypes.func,
  onPrevious: PropTypes.func,
  onNext: PropTypes.func,
  onSkip: PropTypes.func,
  onSpeedChange: PropTypes.func,
  canGoPrevious: PropTypes.bool,
  canGoNext: PropTypes.bool
};

NarrationPanel.defaultProps = {
  narration: '',
  isPlaying: false,
  isPaused: false,
  speed: 1,
  currentStep: 0,
  totalSteps: 0,
  canGoPrevious: false,
  canGoNext: true
};

export default NarrationPanel;
