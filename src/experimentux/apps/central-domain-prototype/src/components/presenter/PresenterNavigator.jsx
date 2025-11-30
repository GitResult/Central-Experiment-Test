/**
 * PresenterNavigator
 * Slide thumbnail navigator for jumping to slides
 */

import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { theme } from '../../config/theme';

export function PresenterNavigator({ slides, currentSlide, onSelectSlide, onClose }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background.overlay,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: theme.zIndex.modal,
      padding: theme.spacing[8]
    }}>
      <div style={{
        backgroundColor: theme.colors.background.elevated,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows['2xl'],
        width: '100%',
        maxWidth: '1400px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: theme.spacing[4],
          borderBottom: `1px solid ${theme.colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            margin: 0
          }}>
            Slide Navigator
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: theme.spacing[2],
              borderRadius: theme.borderRadius.md,
              color: theme.colors.text.secondary
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Slide Grid */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: theme.spacing[6]
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: theme.spacing[4]
          }}>
            {slides.map((slide, index) => (
              <div
                key={index}
                onClick={() => {
                  onSelectSlide(index);
                  onClose();
                }}
                style={{
                  cursor: 'pointer',
                  borderRadius: theme.borderRadius.md,
                  overflow: 'hidden',
                  border: index === currentSlide
                    ? `3px solid ${theme.colors.primary[500]}`
                    : `1px solid ${theme.colors.border.default}`,
                  transition: `all ${theme.transitions.fast}`,
                  backgroundColor: theme.colors.background.secondary
                }}
                onMouseEnter={(e) => {
                  if (index !== currentSlide) {
                    e.currentTarget.style.boxShadow = theme.shadows.md;
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Thumbnail */}
                <div style={{
                  aspectRatio: '16 / 9',
                  backgroundColor: theme.colors.background.elevated,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: theme.spacing[4],
                  position: 'relative'
                }}>
                  <div
                    dangerouslySetInnerHTML={{ __html: slide.html }}
                    style={{
                      fontSize: '0.5rem',
                      lineHeight: '1.2',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxHeight: '100%',
                      color: theme.colors.text.primary
                    }}
                  />
                  {index === currentSlide && (
                    <div style={{
                      position: 'absolute',
                      top: theme.spacing[2],
                      right: theme.spacing[2],
                      padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                      backgroundColor: theme.colors.primary[500],
                      color: theme.colors.text.inverse,
                      borderRadius: theme.borderRadius.full,
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.semibold
                    }}>
                      Current
                    </div>
                  )}
                </div>

                {/* Slide Info */}
                <div style={{
                  padding: theme.spacing[3],
                  borderTop: `1px solid ${theme.colors.border.default}`
                }}>
                  <div style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    color: theme.colors.text.primary,
                    marginBottom: theme.spacing[1]
                  }}>
                    Slide {index + 1}
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary
                  }}>
                    {slide.layout} layout
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

PresenterNavigator.propTypes = {
  slides: PropTypes.arrayOf(PropTypes.shape({
    index: PropTypes.number.isRequired,
    content: PropTypes.string.isRequired,
    html: PropTypes.string.isRequired,
    layout: PropTypes.string.isRequired
  })).isRequired,
  currentSlide: PropTypes.number.isRequired,
  onSelectSlide: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

export default PresenterNavigator;
