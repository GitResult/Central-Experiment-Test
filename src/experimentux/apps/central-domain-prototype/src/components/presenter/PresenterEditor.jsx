/**
 * PresenterEditor
 * Markdown editor with live preview
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import PresenterAudienceView from './PresenterAudienceView';

export function PresenterEditor({ markdown, slides, currentSlide, onChange, onSlideChange }) {
  const handleTextareaChange = (e) => {
    onChange(e.target.value);
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      gap: theme.spacing[4],
      backgroundColor: theme.colors.background.secondary,
      overflow: 'hidden'
    }}>
      {/* Markdown Editor */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }}>
        <div style={{
          padding: theme.spacing[3],
          backgroundColor: theme.colors.background.elevated,
          borderBottom: `1px solid ${theme.colors.border.default}`,
          fontSize: theme.typography.fontSize.sm,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary
        }}>
          Markdown Editor
        </div>
        <textarea
          value={markdown}
          onChange={handleTextareaChange}
          placeholder="Write your presentation in markdown...&#10;&#10;Use --- to separate slides&#10;Use <!-- ... --> for speaker notes"
          style={{
            flex: 1,
            padding: theme.spacing[4],
            fontSize: theme.typography.fontSize.sm,
            fontFamily: 'monospace',
            lineHeight: '1.6',
            color: theme.colors.text.primary,
            backgroundColor: theme.colors.background.elevated,
            border: 'none',
            resize: 'none',
            outline: 'none'
          }}
        />
      </div>

      {/* Live Preview */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0
      }}>
        <div style={{
          padding: theme.spacing[3],
          backgroundColor: theme.colors.background.elevated,
          borderBottom: `1px solid ${theme.colors.border.default}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span style={{
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary
          }}>
            Live Preview
          </span>
          <div style={{
            display: 'flex',
            gap: theme.spacing[2],
            alignItems: 'center'
          }}>
            <button
              onClick={() => onSlideChange(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              style={{
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                fontSize: theme.typography.fontSize.xs,
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                opacity: currentSlide === 0 ? 0.5 : 1,
                color: theme.colors.text.primary
              }}
            >
              ◀
            </button>
            <span style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.secondary,
              fontFamily: 'monospace'
            }}>
              {slides.length > 0 ? `${currentSlide + 1} / ${slides.length}` : '0 / 0'}
            </span>
            <button
              onClick={() => onSlideChange(Math.min(slides.length - 1, currentSlide + 1))}
              disabled={currentSlide >= slides.length - 1}
              style={{
                padding: `${theme.spacing[1]} ${theme.spacing[2]}`,
                fontSize: theme.typography.fontSize.xs,
                backgroundColor: 'transparent',
                border: `1px solid ${theme.colors.border.default}`,
                borderRadius: theme.borderRadius.md,
                cursor: currentSlide >= slides.length - 1 ? 'not-allowed' : 'pointer',
                opacity: currentSlide >= slides.length - 1 ? 0.5 : 1,
                color: theme.colors.text.primary
              }}
            >
              ▶
            </button>
          </div>
        </div>
        <div style={{
          flex: 1,
          backgroundColor: theme.colors.background.elevated,
          overflow: 'hidden',
          border: `2px solid ${theme.colors.border.default}`,
          borderTop: 'none'
        }}>
          {slides.length > 0 && slides[currentSlide] ? (
            <PresenterAudienceView slide={slides[currentSlide]} />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.text.tertiary,
              fontSize: theme.typography.fontSize.sm
            }}>
              No slides yet. Start writing markdown!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

PresenterEditor.propTypes = {
  markdown: PropTypes.string.isRequired,
  slides: PropTypes.array.isRequired,
  currentSlide: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onSlideChange: PropTypes.func.isRequired
};

export default PresenterEditor;
