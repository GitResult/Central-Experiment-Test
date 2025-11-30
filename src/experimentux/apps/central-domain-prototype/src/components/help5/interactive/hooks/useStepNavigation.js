/**
 * useStepNavigation Hook
 * Manages play/pause/skip controls for interactive guides
 */

import { useState, useCallback } from 'react';

/**
 * Hook for managing step navigation controls
 * @param {Array} steps - Array of automation steps
 * @param {Function} onComplete - Callback when automation completes
 * @returns {Object} Navigation state and controls
 */
export function useStepNavigation(steps = [], onComplete) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1); // 0.5x, 1x, 2x, 3x
  const [isPaused, setIsPaused] = useState(false);

  const play = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(true);
  }, []);

  const resume = useCallback(() => {
    setIsPlaying(true);
    setIsPaused(false);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentStepIndex(0);
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStepIndex((current) => {
      const next = current + 1;
      if (next >= steps.length) {
        setIsPlaying(false);
        onComplete?.();
        return current;
      }
      return next;
    });
  }, [steps.length, onComplete]);

  const previousStep = useCallback(() => {
    setCurrentStepIndex((current) => Math.max(0, current - 1));
  }, []);

  const skipToStep = useCallback((index) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
    }
  }, [steps.length]);

  const skipToReview = useCallback(() => {
    setCurrentStepIndex(steps.length - 1);
    setIsPlaying(false);
    setIsPaused(false);
  }, [steps.length]);

  const changeSpeed = useCallback((newSpeed) => {
    // Speed options: 0.5, 1, 2, 3
    const validSpeeds = [0.5, 1, 2, 3];
    if (validSpeeds.includes(newSpeed)) {
      setSpeed(newSpeed);
    }
  }, []);

  const cycleSpeed = useCallback(() => {
    setSpeed((current) => {
      const speeds = [0.5, 1, 2, 3];
      const currentIndex = speeds.indexOf(current);
      const nextIndex = (currentIndex + 1) % speeds.length;
      return speeds[nextIndex];
    });
  }, []);

  const currentStep = steps[currentStepIndex] || null;
  const isComplete = currentStepIndex >= steps.length - 1 && !isPlaying;
  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return {
    // State
    currentStep,
    currentStepIndex,
    isPlaying,
    isPaused,
    speed,
    isComplete,
    progress,
    totalSteps: steps.length,

    // Controls
    play,
    pause,
    resume,
    stop,
    nextStep,
    previousStep,
    skipToStep,
    skipToReview,
    changeSpeed,
    cycleSpeed,

    // Helpers
    canGoNext: currentStepIndex < steps.length - 1,
    canGoPrevious: currentStepIndex > 0,
    isFirstStep: currentStepIndex === 0,
    isLastStep: currentStepIndex >= steps.length - 1
  };
}

export default useStepNavigation;
