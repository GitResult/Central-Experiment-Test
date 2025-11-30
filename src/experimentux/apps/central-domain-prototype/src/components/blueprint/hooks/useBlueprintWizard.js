/**
 * Blueprint Wizard Hook
 * Manages wizard state and flow
 */

import { useState, useCallback, useEffect } from 'react';
import { parseCSV } from '../../../lib/import-export';
import { detectSchema, validateSchema } from '../generators/schemaDetector';
import { generatePages } from '../generators/pageGenerator';
import { generateHelp5Stubs } from '../generators/help5Generator';
import { generateAutomationStepsForPages } from '../generators/automationStepGenerator';

/**
 * Hook for Blueprint Wizard state management
 */
export function useBlueprintWizard() {
  const [currentStep, setCurrentStep] = useState(0);
  const [csvData, setCsvData] = useState(null);
  const [schema, setSchema] = useState(null);
  const [entityName, setEntityName] = useState('Record');
  const [selectedPages, setSelectedPages] = useState({
    list: true,
    detail: true,
    create: true,
    edit: true,
    dashboard: false
  });
  const [generatedPages, setGeneratedPages] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [csvFilename, setCsvFilename] = useState('data.csv');

  // Help5 state
  const [help5Records, setHelp5Records] = useState([]);
  const [automationRecords, setAutomationRecords] = useState([]);
  const [currentHelp5Index, setCurrentHelp5Index] = useState(0);

  // Step 1: Upload and parse CSV
  const uploadCSV = useCallback(async (file) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = await parseCSV(file);

      if (result.errors && result.errors.length > 0) {
        setError(`CSV parsing errors: ${result.errors.map(e => e.message).join(', ')}`);
        setIsProcessing(false);
        return false;
      }

      setCsvData(result.data);
      setCsvFilename(file.name || 'data.csv');

      // Auto-detect schema
      const detectedSchema = detectSchema(result.data);
      setSchema(detectedSchema);

      // Try to infer entity name from filename
      if (file.name) {
        const name = file.name
          .replace('.csv', '')
          .replace(/[-_]/g, ' ')
          .split(' ')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
        setEntityName(name.endsWith('s') ? name.slice(0, -1) : name);
      }

      setIsProcessing(false);
      return true;
    } catch (err) {
      setError(`Failed to parse CSV: ${err.message}`);
      setIsProcessing(false);
      return false;
    }
  }, []);

  // Step 2: Update schema
  const updateSchema = useCallback((newSchema) => {
    setSchema(newSchema);
  }, []);

  // Step 3: Update selected pages
  const updateSelectedPages = useCallback((pages) => {
    setSelectedPages(pages);
  }, []);

  // Step 4: Generate pages and Help5 stubs
  const generatePreview = useCallback(() => {
    if (!schema) {
      setError('No schema available');
      return false;
    }

    const validation = validateSchema(schema);
    if (!validation.valid) {
      setError(`Schema validation failed: ${validation.errors.join(', ')}`);
      return false;
    }

    try {
      const pages = generatePages(schema, entityName, {
        includeList: selectedPages.list,
        includeDetail: selectedPages.detail,
        includeCreate: selectedPages.create,
        includeEdit: selectedPages.edit,
        includeDashboard: selectedPages.dashboard
      });

      setGeneratedPages(pages);

      // Generate Help5 stubs
      const help5Stubs = generateHelp5Stubs(pages, schema, entityName, csvFilename);
      setHelp5Records(help5Stubs);

      // Generate automation steps
      const automations = generateAutomationStepsForPages(pages, schema, help5Stubs, entityName);
      setAutomationRecords(automations);

      setCurrentHelp5Index(0);
      return true;
    } catch (err) {
      setError(`Failed to generate pages: ${err.message}`);
      return false;
    }
  }, [schema, entityName, selectedPages, csvFilename]);

  // Step 5: Help5 management
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
        const { calculateHelp5Completion } = require('../generators/help5Generator');
        updated[pageIndex].completionScore = calculateHelp5Completion(updated[pageIndex].content);
      }
      return updated;
    });
  }, []);

  const nextHelp5Page = useCallback(() => {
    setCurrentHelp5Index(prev => Math.min(prev + 1, help5Records.length - 1));
  }, [help5Records.length]);

  const prevHelp5Page = useCallback(() => {
    setCurrentHelp5Index(prev => Math.max(prev - 1, 0));
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step) => {
    setCurrentStep(step);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setCsvData(null);
    setSchema(null);
    setEntityName('Record');
    setSelectedPages({
      list: true,
      detail: true,
      create: true,
      edit: true,
      dashboard: false
    });
    setGeneratedPages([]);
    setHelp5Records([]);
    setAutomationRecords([]);
    setCurrentHelp5Index(0);
    setCsvFilename('data.csv');
    setError(null);
  }, []);

  // Calculate Help5 statistics
  const help5Stats = {
    overallCompletion: help5Records.length > 0
      ? Math.round(help5Records.reduce((sum, h5) => sum + (h5.completionScore || 0), 0) / help5Records.length)
      : 0,
    completeCount: help5Records.filter(h5 => h5.completionScore >= 100).length,
    totalPages: help5Records.length,
    currentPage: generatedPages[currentHelp5Index] || null,
    currentHelp5: help5Records[currentHelp5Index] || null
  };

  return {
    // State
    currentStep,
    csvData,
    schema,
    entityName,
    selectedPages,
    generatedPages,
    isProcessing,
    error,

    // Help5 State
    help5Records,
    automationRecords,
    currentHelp5Index,
    help5Stats,

    // Actions
    uploadCSV,
    updateSchema,
    setEntityName,
    updateSelectedPages,
    generatePreview,
    updateHelp5,
    nextHelp5Page,
    prevHelp5Page,
    nextStep,
    prevStep,
    goToStep,
    reset
  };
}

export default useBlueprintWizard;
