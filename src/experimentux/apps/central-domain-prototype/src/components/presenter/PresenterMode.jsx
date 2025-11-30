/**
 * PresenterMode
 * Main presenter mode controller
 */

import { useState } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import { usePresenterMode } from './hooks/usePresenterMode';
import PresenterEditor from './PresenterEditor';
import PresenterView from './PresenterView';
import PresenterAudienceView from './PresenterAudienceView';
import PresenterToolbar from './PresenterToolbar';
import PresenterNavigator from './PresenterNavigator';
import PresenterExport from './PresenterExport';

export function PresenterMode({ isOpen = false, onClose }) {
  const {
    markdown,
    updateMarkdown,
    frontmatter,
    slides,
    totalSlides,
    currentSlide,
    currentSlideData,
    nextSlideData,
    nextSlide,
    previousSlide,
    goToSlide,
    isPresenting,
    startPresenting,
    stopPresenting,
    presenterView,
    togglePresenterView,
    controls,
    toggleLaserPointer,
    toggleDrawing,
    toggleBlackout
  } = usePresenterMode();

  const [showNavigator, setShowNavigator] = useState(false);
  const [showExport, setShowExport] = useState(false);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.background.secondary,
      zIndex: theme.zIndex.modal,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Toolbar */}
      <PresenterToolbar
        currentSlide={currentSlide}
        totalSlides={totalSlides}
        isPresenting={isPresenting}
        onPrevious={previousSlide}
        onNext={nextSlide}
        onStart={startPresenting}
        onStop={stopPresenting}
        onOpenNavigator={() => setShowNavigator(true)}
        onOpenExport={() => setShowExport(true)}
        onToggleLaser={toggleLaserPointer}
        onToggleDrawing={toggleDrawing}
        onToggleBlackout={toggleBlackout}
        laserActive={controls.laserPointer}
        drawingActive={controls.drawing}
        blackoutActive={controls.blackout}
      />

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {isPresenting ? (
          presenterView.enabled ? (
            <PresenterView
              currentSlide={currentSlideData}
              nextSlide={nextSlideData}
              presenterView={presenterView}
              blackout={controls.blackout}
              targetDuration={1800}
            />
          ) : (
            <PresenterAudienceView
              slide={currentSlideData}
              blackout={controls.blackout}
            />
          )
        ) : (
          <PresenterEditor
            markdown={markdown}
            slides={slides}
            currentSlide={currentSlide}
            onChange={updateMarkdown}
            onSlideChange={goToSlide}
          />
        )}
      </div>

      {/* Navigator Modal */}
      {showNavigator && (
        <PresenterNavigator
          slides={slides}
          currentSlide={currentSlide}
          onSelectSlide={goToSlide}
          onClose={() => setShowNavigator(false)}
        />
      )}

      {/* Export Modal */}
      {showExport && (
        <PresenterExport
          frontmatter={frontmatter}
          slides={slides}
          onClose={() => setShowExport(false)}
        />
      )}

      {/* Close Button (top-right) */}
      {!isPresenting && (
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: theme.spacing[4],
            right: theme.spacing[4],
            padding: theme.spacing[2],
            backgroundColor: theme.colors.background.elevated,
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            cursor: 'pointer',
            color: theme.colors.text.primary,
            fontSize: theme.typography.fontSize.xl,
            zIndex: 10
          }}
          title="Close Presenter Mode"
        >
          ×
        </button>
      )}
    </div>
  );
}

PresenterMode.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired
};

export default PresenterMode;
