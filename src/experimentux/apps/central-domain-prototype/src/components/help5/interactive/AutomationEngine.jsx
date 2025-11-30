/**
 * AutomationEngine
 * Executes automation steps with cursor animation and narration
 */

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import AnimatedCursor from './AnimatedCursor';
import NarrationPanel from './NarrationPanel';
import ProgressSidebar from './ProgressSidebar';
import { useAutomation } from './hooks/useAutomation';
import { useCursorAnimation } from './hooks/useCursorAnimation';
import { useStepNavigation } from './hooks/useStepNavigation';

export function AutomationEngine({
  automationRecord,
  userInputs,
  isActive,
  onComplete,
  onClose
}) {
  const automation = useAutomation(automationRecord, userInputs);
  const cursor = useCursorAnimation(automation.speed || 1);
  const navigation = useStepNavigation(
    automationRecord?.content?.steps || [],
    onComplete
  );

  const hasStarted = useRef(false);

  // Start automation when active
  useEffect(() => {
    if (isActive && !hasStarted.current && automation.totalSteps > 0) {
      hasStarted.current = true;
      handlePlay();
    }
  }, [isActive]);

  // Sync cursor position with current step
  useEffect(() => {
    if (automation.currentStep && navigation.isPlaying) {
      const { action, field } = automation.currentStep;

      // Move cursor to field if action requires it
      if ((action === 'type' || action === 'click' || action === 'move') && field) {
        const element = document.querySelector(`[name="${field}"]`) ||
                       document.querySelector(`#${field}`);
        if (element) {
          cursor.moveToElement(element, 800);
        }
      }
    }
  }, [automation.currentStep, navigation.isPlaying]);

  const handlePlay = async () => {
    navigation.play();
    cursor.show();
    await automation.start(navigation.speed);
    navigation.pause();
  };

  const handlePause = () => {
    navigation.pause();
    automation.pause();
  };

  const handleResume = async () => {
    navigation.resume();
    await automation.resume(navigation.speed);
    navigation.pause();
  };

  const handlePrevious = () => {
    navigation.previousStep();
    if (navigation.canGoPrevious) {
      automation.executeStepByIndex(navigation.currentStepIndex - 1, navigation.speed);
    }
  };

  const handleNext = () => {
    navigation.nextStep();
    if (navigation.canGoNext) {
      automation.executeStepByIndex(navigation.currentStepIndex + 1, navigation.speed);
    }
  };

  const handleSkip = () => {
    navigation.skipToReview();
    automation.pause();
  };

  const handleSpeedChange = () => {
    navigation.cycleSpeed();
  };

  if (!isActive) return null;

  return (
    <>
      {/* Animated AI Cursor */}
      <AnimatedCursor
        position={cursor.position}
        isVisible={cursor.isVisible}
        isMoving={cursor.isMoving}
      />

      {/* Narration Panel */}
      <NarrationPanel
        narration={automation.currentNarration}
        isPlaying={navigation.isPlaying}
        isPaused={navigation.isPaused}
        speed={navigation.speed}
        currentStep={navigation.currentStepIndex}
        totalSteps={navigation.totalSteps}
        onPlay={handlePlay}
        onPause={handlePause}
        onResume={handleResume}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSkip={handleSkip}
        onSpeedChange={handleSpeedChange}
        canGoPrevious={navigation.canGoPrevious}
        canGoNext={navigation.canGoNext}
      />

      {/* Progress Sidebar */}
      <ProgressSidebar
        sections={automation.sections}
        currentSection={automation.currentSection}
        progress={automation.progress}
      />
    </>
  );
}

AutomationEngine.propTypes = {
  automationRecord: PropTypes.shape({
    record_id: PropTypes.string,
    record_type: PropTypes.string,
    parent_id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.shape({
      steps: PropTypes.arrayOf(
        PropTypes.shape({
          action: PropTypes.oneOf(['narrate', 'move', 'type', 'click', 'wait']).isRequired,
          section: PropTypes.number,
          itemIndex: PropTypes.number,
          field: PropTypes.string,
          value: PropTypes.string,
          narration: PropTypes.string,
          duration: PropTypes.number,
          help5_ref: PropTypes.string
        })
      ),
      sections: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number.isRequired,
          title: PropTypes.string.isRequired,
          items: PropTypes.arrayOf(
            PropTypes.shape({
              label: PropTypes.string.isRequired,
              completed: PropTypes.bool
            })
          )
        })
      ),
      inputs_required: PropTypes.object
    })
  }).isRequired,
  userInputs: PropTypes.object,
  isActive: PropTypes.bool,
  onComplete: PropTypes.func,
  onClose: PropTypes.func
};

AutomationEngine.defaultProps = {
  userInputs: {},
  isActive: false,
  onComplete: () => {},
  onClose: () => {}
};

export default AutomationEngine;
