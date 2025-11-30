/**
 * Template-Based Record Detail Component
 *
 * Renders record detail pages using the template system and UniversalPage.
 * Handles data binding from record customData to template placeholders.
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import UniversalPage from './UniversalPage/UniversalPage';
import { getTemplate } from '../templates/index';

/**
 * Process template string with data bindings
 * Replaces {{fieldName}} placeholders with actual data values
 *
 * Examples:
 * - {{title}} -> record.title
 * - {{email}} -> record.customData.email
 * - {{deals[0].amount}} -> record.customData.deals[0].amount
 * - {{metrics.revenue | number}} -> formatted number
 */
const interpolateData = (template, data) => {
  if (typeof template !== 'string') {
    return template;
  }

  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    // Handle filters (e.g., {{value | number}})
    const [fieldPath, filter] = path.split('|').map(s => s.trim());

    // Resolve nested path (e.g., "deals[0].amount")
    const value = fieldPath.split('.').reduce((obj, key) => {
      // Handle array access (e.g., "deals[0]")
      const arrayMatch = key.match(/([^\[]+)\[(\d+)\]/);
      if (arrayMatch) {
        const [, arrayKey, index] = arrayMatch;
        return obj?.[arrayKey]?.[parseInt(index)];
      }
      return obj?.[key];
    }, data);

    // Apply filter if specified
    if (filter && value !== undefined && value !== null) {
      switch (filter) {
        case 'number':
          return typeof value === 'number' ? value.toLocaleString() : value;
        case 'currency':
          return typeof value === 'number' ? `$${value.toLocaleString()}` : value;
        case 'date':
          return value instanceof Date ? value.toLocaleDateString() : value;
        case 'date-short':
          return value instanceof Date ? value.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : value;
        case 'join':
          return Array.isArray(value) ? value.join(', ') : value;
        default:
          return value;
      }
    }

    return value !== undefined && value !== null ? value : match;
  });
};

/**
 * Recursively process element data to replace template placeholders
 */
const processElementData = (element, recordData) => {
  if (!element || typeof element !== 'object') {
    return element;
  }

  if (Array.isArray(element)) {
    return element.map(item => processElementData(item, recordData));
  }

  const processed = {};
  for (const [key, value] of Object.entries(element)) {
    if (typeof value === 'string') {
      processed[key] = interpolateData(value, recordData);
    } else if (typeof value === 'object') {
      processed[key] = processElementData(value, recordData);
    } else {
      processed[key] = value;
    }
  }

  return processed;
};

/**
 * Process entire page config with record data
 */
const processPageConfig = (config, record) => {
  const recordData = {
    ...record,
    ...record.customData
  };

  return processElementData(config, recordData);
};

/**
 * TemplateBasedRecordDetail Component
 */
const TemplateBasedRecordDetail = ({
  record,
  onUpdate,
  onClose
}) => {
  // Get the template
  const template = useMemo(() => {
    return getTemplate(record.templateId);
  }, [record.templateId]);

  // Process the page config with record data
  const processedConfig = useMemo(() => {
    if (!template) return null;

    // Use record's pageConfig if it has customizations, otherwise use template config
    const baseConfig = record.pageConfig || template.config;

    // Process all template strings
    return processPageConfig(baseConfig, record);
  }, [template, record]);

  // Handle configuration updates
  const handleConfigUpdate = (newConfig) => {
    if (onUpdate) {
      onUpdate({
        ...record,
        pageConfig: newConfig,
        metadata: {
          ...record.metadata,
          updatedAt: new Date().toISOString()
        }
      });
    }
  };

  // Template not found
  if (!template) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-50">
        <div className="text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-neutral-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-neutral-700 mb-2">
            Template Not Found
          </h3>
          <p className="text-neutral-500 mb-4">
            The template &quot;{record.templateId}&quot; could not be loaded.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render UniversalPage with processed config
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Back Button */}
      {onClose && (
        <div className="sticky top-0 z-40 bg-white border-b border-neutral-200 px-6 py-3">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="font-medium">Back</span>
          </button>
        </div>
      )}

      {/* Universal Page */}
      <UniversalPage
        pageId={record.id}
        config={processedConfig}
        containerContext="page"
        onUpdate={handleConfigUpdate}
      />

      {/* Debug Panel (only in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-white border border-neutral-300 rounded-lg shadow-lg p-4 max-w-xs">
          <h4 className="font-semibold text-sm mb-2">Debug Info</h4>
          <div className="text-xs text-neutral-600 space-y-1">
            <div>
              <span className="font-medium">Template:</span> {template.name}
            </div>
            <div>
              <span className="font-medium">ID:</span> {record.id}
            </div>
            <div>
              <span className="font-medium">Zones:</span> {processedConfig.zones.length}
            </div>
            <div>
              <span className="font-medium">Updated:</span>{' '}
              {new Date(record.metadata.updatedAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

TemplateBasedRecordDetail.propTypes = {
  record: PropTypes.shape({
    id: PropTypes.string.isRequired,
    templateId: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    customData: PropTypes.object,
    pageConfig: PropTypes.object,
    metadata: PropTypes.shape({
      createdAt: PropTypes.string,
      updatedAt: PropTypes.string,
      createdBy: PropTypes.string
    })
  }).isRequired,
  onUpdate: PropTypes.func,
  onClose: PropTypes.func
};

export default TemplateBasedRecordDetail;
