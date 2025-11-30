/**
 * AnimatedCursor
 * Visual AI cursor with "AI" label for interactive guides
 */

import PropTypes from 'prop-types';
import { MousePointer2 } from 'lucide-react';
import { theme } from '../../../config/theme';

export function AnimatedCursor({ position, isVisible, isMoving }) {
  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: theme.zIndex.modal + 10,
        transition: isMoving ? 'none' : `all ${theme.transitions.base}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing[2]
      }}
    >
      {/* AI Label */}
      <div
        style={{
          backgroundColor: theme.colors.primary[500],
          color: theme.colors.neutral[0],
          padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.xs,
          fontWeight: theme.typography.fontWeight.semibold,
          boxShadow: theme.shadows.lg,
          animation: isMoving ? 'none' : 'pulse 2s infinite'
        }}
      >
        AI
      </div>

      {/* Cursor Icon */}
      <div
        style={{
          backgroundColor: theme.colors.primary[500],
          borderRadius: theme.borderRadius.full,
          padding: theme.spacing[2],
          boxShadow: theme.shadows.xl,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <MousePointer2
          size={20}
          color={theme.colors.neutral[0]}
          style={{
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
          }}
        />
      </div>

      {/* Glow effect */}
      {!isMoving && (
        <div
          style={{
            position: 'absolute',
            width: '40px',
            height: '40px',
            backgroundColor: theme.colors.primary[500],
            borderRadius: theme.borderRadius.full,
            opacity: 0.2,
            animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
            zIndex: -1
          }}
        />
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 0.2;
          }
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

AnimatedCursor.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  isVisible: PropTypes.bool,
  isMoving: PropTypes.bool
};

AnimatedCursor.defaultProps = {
  isVisible: true,
  isMoving: false
};

export default AnimatedCursor;
