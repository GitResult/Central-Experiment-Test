/**
 * useHelp5Generation Hook
 * Manages Help5 stub generation and editing for Blueprint wizard
 */

import { useState, useCallback, useMemo } from 'react';
import {
  generateHelp5Stubs,
  calculateHelp5Completion,
  validateHelp5Content
} from '../generators/help5Generator';
import { generateAutomationStepsForPages } from '../generators/automationStepGenerator';

export function useHelp5Generation(pages, schema, entityName, csvFilename) {
  // State for Help5 records
  const [help5Records, setHelp5Records] = useState([]);

  // State for automation records
  const [automationRecords, setAutomationRecords] = useState([]);

  // State for current page being edited in wizard
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  /**
   * Initialize Help5 stubs when pages are generated
   */
  const initializeHelp5 = useCallback(() => {
    if (!pages || pages.length === 0) return;

    const stubs = generateHelp5Stubs(pages, schema, entityName, csvFilename);
    setHelp5Records(stubs);

    // Also generate automation steps
    const automations = generateAutomationStepsForPages(pages, schema, stubs, entityName);
    setAutomationRecords(automations);

    setCurrentPageIndex(0);
  }, [pages, schema, entityName, csvFilename]);

  /**
   * Update Help5 content for a specific page
   */
  const updateHelp5 = useCallback((pageIndex, field, value) => {
    setHelp5Records(prev => {
      const updated = [...prev];
      if (updated[pageIndex]) {
        updated[pageIndex] = {
          ...updated[pageIndex],
          content: {
            ...updated[pageIndex].content,
            [field]: value
          }
        };
        // Recalculate completion score
        updated[pageIndex].completionScore = calculateHelp5Completion(updated[pageIndex].content);
      }
      return updated;
    });

    // Regenerate automation steps if narration depends on Help5
    if (field === 'why') {
      regenerateAutomation(pageIndex);
    }
  }, []);

  /**
   * Regenerate automation steps for a page when Help5 changes
   */
  const regenerateAutomation = useCallback((pageIndex) => {
    if (!pages || !pages[pageIndex] || !help5Records[pageIndex]) return;

    const { generateAutomationSteps } = require('../generators/automationStepGenerator');
    const automation = generateAutomationSteps(
      pages[pageIndex],
      schema,
      help5Records[pageIndex],
      entityName
    );

    if (automation) {
      setAutomationRecords(prev => {
        const updated = [...prev];
        const autoIndex = updated.findIndex(a => a.record_id === automation.record_id);
        if (autoIndex >= 0) {
          updated[autoIndex] = automation;
        } else {
          updated.push(automation);
        }
        return updated;
      });
    }
  }, [pages, schema, help5Records, entityName]);

  /**
   * Navigate to next page in wizard
   */
  const nextPage = useCallback(() => {
    setCurrentPageIndex(prev => Math.min(prev + 1, (pages?.length || 1) - 1));
  }, [pages]);

  /**
   * Navigate to previous page in wizard
   */
  const previousPage = useCallback(() => {
    setCurrentPageIndex(prev => Math.max(prev - 1, 0));
  }, []);

  /**
   * Skip Help5 editing (use auto-generated stubs)
   */
  const skipHelp5 = useCallback(() => {
    // Keep auto-generated stubs as-is
    return { help5Records, automationRecords };
  }, [help5Records, automationRecords]);

  /**
   * Validate all Help5 records meet minimum quality
   */
  const validateAllHelp5 = useCallback(() => {
    const errors = [];
    help5Records.forEach((help5, index) => {
      const validation = validateHelp5Content(help5.content);
      if (!validation.isValid) {
        errors.push({
          pageIndex: index,
          pageTitle: pages[index]?.title,
          errors: validation.errors
        });
      }
    });
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [help5Records, pages]);

  // Current page data
  const currentPage = pages?.[currentPageIndex] || null;
  const currentHelp5 = help5Records[currentPageIndex] || null;
  const currentAutomation = automationRecords.find(
    a => a.parent_id === currentHelp5?.record_id
  ) || null;

  // Overall completion stats
  const overallCompletion = useMemo(() => {
    if (help5Records.length === 0) return 0;
    const total = help5Records.reduce((sum, h5) => sum + (h5.completionScore || 0), 0);
    return Math.round(total / help5Records.length);
  }, [help5Records]);

  const completeCount = help5Records.filter(h5 => h5.completionScore >= 100).length;

  return {
    // State
    help5Records,
    automationRecords,
    currentPageIndex,
    currentPage,
    currentHelp5,
    currentAutomation,

    // Stats
    overallCompletion,
    completeCount,
    totalPages: pages?.length || 0,

    // Actions
    initializeHelp5,
    updateHelp5,
    nextPage,
    previousPage,
    skipHelp5,
    validateAllHelp5,

    // Helpers
    canGoNext: currentPageIndex < (pages?.length || 1) - 1,
    canGoPrevious: currentPageIndex > 0,
    isLastPage: currentPageIndex >= (pages?.length || 1) - 1
  };
}

export default useHelp5Generation;
