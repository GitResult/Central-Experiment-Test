/**
 * PresenterTimer
 * Timer component for presentations
 */

import PropTypes from 'prop-types';
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';
import { theme } from '../../config/theme';
import { usePresenterTimer } from './hooks/usePresenterTimer';

export function PresenterTimer({ targetDuration = 1800, autoStart = false, compact = false }) {
  const {
    elapsed,
    remaining,
    progress,
    isRunning,
    isOvertime,
    isWarning,
    isCritical,
    formattedElapsed,
    formattedRemaining,
    formattedTarget,
    start,
    pause,
    resume,
    reset
  } = usePresenterTimer(targetDuration, autoStart);

  const getTimerColor = () => {
    if (isCritical) return theme.colors.error[500];
    if (isWarning) return theme.colors.warning[500];
    return theme.colors.success[500];
  };

  if (compact) {
    return (
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: theme.spacing[2],
        padding: `${theme.spacing[2]} ${theme.spacing[3]}`,
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.md,
        border: `1px solid ${getTimerColor()}`
      }}>
        <Clock size={16} color={getTimerColor()} />
        <span style={{
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.semibold,
          color: getTimerColor(),
          fontFamily: 'monospace'
        }}>
          {formattedElapsed} / {formattedTarget}
        </span>
      </div>
    );
  }

  return (
    <div style={{
      padding: theme.spacing[4],
      backgroundColor: theme.colors.background.elevated,
      borderRadius: theme.borderRadius.lg,
      border: `2px solid ${getTimerColor()}`
    }}>
      {/* Timer Display */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing[3]
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: theme.spacing[2] }}>
          <Clock size={20} color={getTimerColor()} />
          <span style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary,
            fontWeight: theme.typography.fontWeight.medium
          }}>
            Presentation Timer
          </span>
        </div>
        <div style={{ display: 'flex', gap: theme.spacing[2] }}>
          {!isRunning ? (
            <button
              onClick={elapsed === 0 ? start : resume}
              style={{
                padding: theme.spacing[2],
                backgroundColor: theme.colors.success[500],
                border: 'none',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                color: theme.colors.text.inverse,
                display: 'flex',
                alignItems: 'center'
              }}
              title={elapsed === 0 ? 'Start' : 'Resume'}
            >
              <Play size={16} />
            </button>
          ) : (
            <button
              onClick={pause}
              style={{
                padding: theme.spacing[2],
                backgroundColor: theme.colors.warning[500],
                border: 'none',
                borderRadius: theme.borderRadius.md,
                cursor: 'pointer',
                color: theme.colors.text.inverse,
                display: 'flex',
                alignItems: 'center'
              }}
              title="Pause"
            >
              <Pause size={16} />
            </button>
          )}
          <button
            onClick={reset}
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
            title="Reset"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Time Display */}
      <div style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'center',
        gap: theme.spacing[2],
        marginBottom: theme.spacing[3]
      }}>
        <span style={{
          fontSize: theme.typography.fontSize['3xl'],
          fontWeight: theme.typography.fontWeight.bold,
          color: getTimerColor(),
          fontFamily: 'monospace'
        }}>
          {formattedElapsed}
        </span>
        <span style={{
          fontSize: theme.typography.fontSize.base,
          color: theme.colors.text.tertiary
        }}>
          / {formattedTarget}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '8px',
        backgroundColor: theme.colors.background.secondary,
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
        marginBottom: theme.spacing[2]
      }}>
        <div style={{
          width: `${Math.min(progress, 100)}%`,
          height: '100%',
          backgroundColor: getTimerColor(),
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Remaining Time */}
      <div style={{
        textAlign: 'center',
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.text.tertiary
      }}>
        {isOvertime ? (
          <span style={{ color: theme.colors.error[500], fontWeight: theme.typography.fontWeight.semibold }}>
            Overtime!
          </span>
        ) : (
          <span>{formattedRemaining} remaining</span>
        )}
      </div>
    </div>
  );
}

PresenterTimer.propTypes = {
  targetDuration: PropTypes.number,
  autoStart: PropTypes.bool,
  compact: PropTypes.bool
};

export default PresenterTimer;
