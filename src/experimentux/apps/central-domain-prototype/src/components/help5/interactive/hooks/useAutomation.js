/**
 * useAutomation Hook
 * Executes automation steps with narration and field interactions
 */

import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * Replace template variables in text
 * @param {string} text - Text with {{variable}} placeholders
 * @param {Object} inputs - User inputs object
 * @returns {string} Text with variables replaced
 */
function replaceVariables(text, inputs = {}) {
  if (!text) return '';
  return text.replace(/\{\{(\w+\.?\w*)\}\}/g, (match, path) => {
    const keys = path.split('.');
    let value = inputs;
    for (const key of keys) {
      value = value?.[key];
      if (value === undefined) return match;
    }
    return value ?? match;
  });
}

/**
 * Hook for executing automation steps
 * @param {Object} automationRecord - Automation record with steps and sections
 * @param {Object} userInputs - User-provided inputs for template variables
 * @returns {Object} Automation state and controls
 */
export function useAutomation(automationRecord, userInputs = {}) {
  const steps = automationRecord?.content?.steps || [];
  const sections = automationRecord?.content?.sections || [];

  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [isExecuting, setIsExecuting] = useState(false);
  const [executedSteps, setExecutedSteps] = useState([]);
  const [currentNarration, setCurrentNarration] = useState('');
  const [currentSection, setCurrentSection] = useState(null);
  const timeoutRef = useRef(null);

  /**
   * Execute a single automation step
   * @param {Object} step - Automation step to execute
   * @param {number} speed - Speed multiplier (0.5x - 3x)
   */
  const executeStep = useCallback((step, speed = 1) => {
    if (!step) return Promise.resolve();

    return new Promise((resolve) => {
      const { action, field, value, narration, duration = 1000, section, itemIndex } = step;

      // Update current narration
      const processedNarration = replaceVariables(narration, userInputs);
      setCurrentNarration(processedNarration);

      // Update current section
      const sectionData = sections.find(s => s.id === section);
      setCurrentSection(sectionData);

      // Execute action based on type
      switch (action) {
        case 'narrate':
          // Just show narration, no interaction
          break;

        case 'move':
          // Move cursor to field (handled by AutomationEngine)
          break;

        case 'type': {
          // Fill text input
          const processedValue = replaceVariables(value, userInputs);
          const element = document.querySelector(`[name="${field}"]`) ||
                         document.querySelector(`#${field}`);
          if (element) {
            // Simulate typing character by character
            let charIndex = 0;
            const typeInterval = setInterval(() => {
              if (charIndex < processedValue.length) {
                element.value = processedValue.substring(0, charIndex + 1);
                element.dispatchEvent(new Event('input', { bubbles: true }));
                charIndex++;
              } else {
                clearInterval(typeInterval);
              }
            }, (duration / processedValue.length / speed));
          }
          break;
        }

        case 'click': {
          // Click radio/checkbox/button
          const processedValue = replaceVariables(value, userInputs);
          const element = document.querySelector(`[name="${field}"][value="${processedValue}"]`) ||
                         document.querySelector(`[name="${field}"]`) ||
                         document.querySelector(`#${field}`);
          if (element) {
            setTimeout(() => {
              element.click();
              element.dispatchEvent(new Event('change', { bubbles: true }));
            }, (duration / 2) / speed);
          }
          break;
        }

        case 'wait':
          // Just wait for duration
          break;

        default:
          console.warn('Unknown automation action:', action);
      }

      // Mark item as completed in section
      if (sectionData && itemIndex !== undefined) {
        const item = sectionData.items[itemIndex];
        if (item) {
          item.completed = true;
        }
      }

      // Resolve after duration (adjusted for speed)
      timeoutRef.current = setTimeout(() => {
        setExecutedSteps(prev => [...prev, step]);
        resolve();
      }, duration / speed);
    });
  }, [userInputs, sections]);

  /**
   * Start automation from beginning
   * @param {number} speed - Speed multiplier (0.5x - 3x)
   */
  const start = useCallback(async (speed = 1) => {
    setIsExecuting(true);
    setCurrentStepIndex(0);
    setExecutedSteps([]);

    // Reset all section items to incomplete
    sections.forEach(section => {
      section.items?.forEach(item => {
        item.completed = false;
      });
    });

    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      await executeStep(steps[i], speed);
    }

    setIsExecuting(false);
    setCurrentNarration('');
  }, [steps, executeStep, sections]);

  /**
   * Pause automation
   */
  const pause = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsExecuting(false);
  }, []);

  /**
   * Resume automation from current step
   * @param {number} speed - Speed multiplier (0.5x - 3x)
   */
  const resume = useCallback(async (speed = 1) => {
    setIsExecuting(true);

    for (let i = currentStepIndex; i < steps.length; i++) {
      setCurrentStepIndex(i);
      await executeStep(steps[i], speed);
    }

    setIsExecuting(false);
    setCurrentNarration('');
  }, [currentStepIndex, steps, executeStep]);

  /**
   * Stop automation completely
   */
  const stop = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsExecuting(false);
    setCurrentStepIndex(-1);
    setExecutedSteps([]);
    setCurrentNarration('');
    setCurrentSection(null);
  }, []);

  /**
   * Execute a single step by index
   * @param {number} index - Step index
   * @param {number} speed - Speed multiplier
   */
  const executeStepByIndex = useCallback(async (index, speed = 1) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
      await executeStep(steps[index], speed);
    }
  }, [steps, executeStep]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const currentStep = steps[currentStepIndex] || null;
  const progress = steps.length > 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return {
    // State
    currentStep,
    currentStepIndex,
    currentNarration,
    currentSection,
    isExecuting,
    executedSteps,
    progress,
    totalSteps: steps.length,
    sections,

    // Controls
    start,
    pause,
    resume,
    stop,
    executeStepByIndex,

    // Helpers
    isComplete: currentStepIndex >= steps.length - 1 && !isExecuting,
    hasStarted: currentStepIndex >= 0
  };
}

export default useAutomation;
