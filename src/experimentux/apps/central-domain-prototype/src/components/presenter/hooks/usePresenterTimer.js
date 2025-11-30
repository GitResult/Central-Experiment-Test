/**
 * usePresenterTimer Hook
 * Manages presentation timer with pause/resume
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook for managing presentation timer
 * @param {number} targetDuration - Target duration in seconds (default: 1800 = 30 minutes)
 * @param {boolean} autoStart - Auto-start timer when hook mounts
 */
export function usePresenterTimer(targetDuration = 1800, autoStart = false) {
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [startTime, setStartTime] = useState(autoStart ? Date.now() : null);
  const [pausedTime, setPausedTime] = useState(0);
  const intervalRef = useRef(null);

  // Start timer
  const start = useCallback(() => {
    if (!isRunning) {
      setStartTime(Date.now() - elapsed * 1000);
      setIsRunning(true);
    }
  }, [isRunning, elapsed]);

  // Pause timer
  const pause = useCallback(() => {
    if (isRunning) {
      setPausedTime(elapsed);
      setIsRunning(false);
    }
  }, [isRunning, elapsed]);

  // Resume timer
  const resume = useCallback(() => {
    if (!isRunning) {
      start();
    }
  }, [isRunning, start]);

  // Reset timer
  const reset = useCallback(() => {
    setElapsed(0);
    setPausedTime(0);
    setStartTime(null);
    setIsRunning(false);
  }, []);

  // Restart timer
  const restart = useCallback(() => {
    setElapsed(0);
    setPausedTime(0);
    setStartTime(Date.now());
    setIsRunning(true);
  }, []);

  // Update elapsed time
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const newElapsed = Math.floor((now - startTime) / 1000);
        setElapsed(newElapsed);
      }, 100); // Update every 100ms for smooth display

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [isRunning, startTime]);

  // Calculate time stats
  const remaining = Math.max(0, targetDuration - elapsed);
  const progress = Math.min(100, (elapsed / targetDuration) * 100);
  const isOvertime = elapsed > targetDuration;
  const isWarning = progress >= 80 && progress < 100; // Yellow at 80%
  const isCritical = progress >= 100; // Red at 100%

  // Format time as HH:MM:SS or MM:SS
  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }, []);

  const formattedElapsed = formatTime(elapsed);
  const formattedRemaining = formatTime(remaining);
  const formattedTarget = formatTime(targetDuration);

  return {
    // State
    elapsed,
    remaining,
    progress,
    isRunning,
    isOvertime,
    isWarning,
    isCritical,

    // Formatted times
    formattedElapsed,
    formattedRemaining,
    formattedTarget,

    // Controls
    start,
    pause,
    resume,
    reset,
    restart
  };
}

export default usePresenterTimer;
