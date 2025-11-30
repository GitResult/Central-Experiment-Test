/**
 * PresenterView
 * Dual-screen presenter view with notes, timer, and next slide preview
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import PresenterNotes from './PresenterNotes';
import PresenterTimer from './PresenterTimer';
import PresenterAudienceView from './PresenterAudienceView';

export function PresenterView({ currentSlide, nextSlide, presenterView, blackout, targetDuration = 1800 }) {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      backgroundColor: theme.colors.background.secondary,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      {/* Header with Timer */}
      <div style={{
        padding: theme.spacing[4],
        borderBottom: `1px solid ${theme.colors.border.default}`,
        backgroundColor: theme.colors.background.elevated
      }}>
        <PresenterTimer targetDuration={targetDuration} autoStart={true} compact={false} />
      </div>

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        gap: theme.spacing[4],
        padding: theme.spacing[4],
        overflow: 'hidden'
      }}>
        {/* Left: Current Slide + Next Slide */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: theme.spacing[4],
          minWidth: 0
        }}>
          {/* Current Slide */}
          <div style={{
            flex: 2,
            backgroundColor: theme.colors.background.elevated,
            borderRadius: theme.borderRadius.md,
            overflow: 'hidden',
            border: `2px solid ${theme.colors.primary[500]}`
          }}>
            <div style={{
              padding: theme.spacing[2],
              backgroundColor: theme.colors.primary[100],
              borderBottom: `1px solid ${theme.colors.primary[200]}`,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.semibold,
              color: theme.colors.primary[700]
            }}>
              Current Slide
            </div>
            <div style={{
              aspectRatio: '16 / 9',
              backgroundColor: theme.colors.background.secondary,
              overflow: 'hidden'
            }}>
              <div style={{ transform: 'scale(0.5)', transformOrigin: 'top left', width: '200%', height: '200%' }}>
                <PresenterAudienceView slide={currentSlide} blackout={blackout} />
              </div>
            </div>
          </div>

          {/* Next Slide Preview */}
          {presenterView.showNextSlide && nextSlide && (
            <div style={{
              flex: 1,
              backgroundColor: theme.colors.background.elevated,
              borderRadius: theme.borderRadius.md,
              overflow: 'hidden',
              border: `1px solid ${theme.colors.border.default}`
            }}>
              <div style={{
                padding: theme.spacing[2],
                backgroundColor: theme.colors.background.secondary,
                borderBottom: `1px solid ${theme.colors.border.default}`,
                fontSize: theme.typography.fontSize.xs,
                fontWeight: theme.typography.fontWeight.medium,
                color: theme.colors.text.secondary
              }}>
                Next Slide
              </div>
              <div style={{
                aspectRatio: '16 / 9',
                backgroundColor: theme.colors.background.secondary,
                overflow: 'hidden',
                opacity: 0.7
              }}>
                <div style={{ transform: 'scale(0.4)', transformOrigin: 'top left', width: '250%', height: '250%' }}>
                  <PresenterAudienceView slide={nextSlide} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Speaker Notes */}
        {presenterView.showNotes && (
          <div style={{
            width: '400px',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <PresenterNotes notes={currentSlide?.speakerNotes} />
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts Helper */}
      <div style={{
        padding: theme.spacing[3],
        borderTop: `1px solid ${theme.colors.border.default}`,
        backgroundColor: theme.colors.background.elevated,
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.text.tertiary,
        textAlign: 'center'
      }}>
        <strong>Shortcuts:</strong> Space/→ = Next | ←/Shift+Space = Previous | B = Blackout | L = Laser | D = Draw | Esc = Exit
      </div>
    </div>
  );
}

PresenterView.propTypes = {
  currentSlide: PropTypes.shape({
    html: PropTypes.string.isRequired,
    layout: PropTypes.string.isRequired,
    speakerNotes: PropTypes.string
  }),
  nextSlide: PropTypes.shape({
    html: PropTypes.string.isRequired,
    layout: PropTypes.string.isRequired
  }),
  presenterView: PropTypes.shape({
    enabled: PropTypes.bool,
    showNotes: PropTypes.bool,
    showTimer: PropTypes.bool,
    showNextSlide: PropTypes.bool
  }).isRequired,
  blackout: PropTypes.bool,
  targetDuration: PropTypes.number
};

export default PresenterView;
