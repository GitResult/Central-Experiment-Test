/**
 * useCursorAnimation Hook
 * Smooth cursor movement animations for interactive guides
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Easing function for smooth movement
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased value
 */
function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Hook for animating cursor movement
 * @param {number} speed - Animation speed multiplier (0.5x - 3x)
 * @returns {Object} Cursor state and controls
 */
export function useCursorAnimation(speed = 1) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef(null);
  const startTime = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const targetPos = useRef({ x: 0, y: 0 });
  const duration = useRef(1000);

  /**
   * Move cursor to target position
   * @param {number} x - Target X coordinate
   * @param {number} y - Target Y coordinate
   * @param {number} moveDuration - Duration in milliseconds
   */
  const moveTo = useCallback((x, y, moveDuration = 1000) => {
    // Cancel any ongoing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    startPos.current = { ...position };
    targetPos.current = { x, y };
    duration.current = moveDuration / speed; // Adjust for speed
    startTime.current = performance.now();
    setIsMoving(true);
    setIsVisible(true);

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime.current;
      const progress = Math.min(elapsed / duration.current, 1);
      const easedProgress = easeInOutCubic(progress);

      const newX = startPos.current.x + (targetPos.current.x - startPos.current.x) * easedProgress;
      const newY = startPos.current.y + (targetPos.current.y - startPos.current.y) * easedProgress;

      setPosition({ x: newX, y: newY });

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsMoving(false);
        animationRef.current = null;
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [position, speed]);

  /**
   * Move cursor to a DOM element
   * @param {string|Element} selector - CSS selector or DOM element
   * @param {number} moveDuration - Duration in milliseconds
   */
  const moveToElement = useCallback((selector, moveDuration = 1000) => {
    const element = typeof selector === 'string'
      ? document.querySelector(selector)
      : selector;

    if (!element) {
      console.warn('Element not found:', selector);
      return;
    }

    const rect = element.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;

    moveTo(x, y, moveDuration);
  }, [moveTo]);

  /**
   * Show cursor at current position
   */
  const show = useCallback(() => {
    setIsVisible(true);
  }, []);

  /**
   * Hide cursor
   */
  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  /**
   * Reset cursor to origin
   */
  const reset = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setPosition({ x: 0, y: 0 });
    setIsMoving(false);
    setIsVisible(false);
  }, []);

  /**
   * Teleport cursor instantly (no animation)
   */
  const teleport = useCallback((x, y) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    setPosition({ x, y });
    setIsMoving(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    // State
    position,
    isMoving,
    isVisible,

    // Controls
    moveTo,
    moveToElement,
    show,
    hide,
    reset,
    teleport
  };
}

export default useCursorAnimation;
