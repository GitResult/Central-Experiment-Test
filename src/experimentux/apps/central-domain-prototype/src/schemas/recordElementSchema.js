/**
 * Record Element Schema
 * Type: record (data domain - persisted to database)
 * Purpose: Complex data structures - media, entities, visualizations
 * Reference: GENERIC_ELEMENT_TYPES.md § 2. Record Element
 */

import { baseElementSettings } from './baseElementSettings';

export const recordTypes = [
  // Media records
  'image', 'video', 'audio', 'file',
  // Data display records
  'metadata', 'data-table', 'chart', 'timeline',
  // Entity records
  'person', 'organization', 'product', 'event', 'address', 'contact'
];

export const layoutTypes = ['link', 'list', 'card', 'grid', 'visualizations', 'custom'];

export const recordSpecificSettings = {
  recordType: 'image',
  layoutType: 'card'
};

export const createRecordElement = (recordType = 'image', overrides = {}) => {
  return {
    id: `record-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type: 'record',
    data: overrides.data || {},
    settings: {
      layout: { ...baseElementSettings.layout, ...overrides.layout },
      appearance: { ...baseElementSettings.appearance, ...overrides.appearance },
      data: { ...baseElementSettings.data, ...overrides.data },
      typography: { ...baseElementSettings.typography, ...overrides.typography },
      businessRules: { ...baseElementSettings.businessRules, ...overrides.businessRules },
      record: { ...recordSpecificSettings, recordType, ...overrides.record }
    }
  };
};

export const validateRecordElement = (element) => {
  const errors = [];
  if (element.type !== 'record') errors.push(`Invalid type: expected 'record', got '${element.type}'`);
  if (!element.settings?.record) errors.push('Missing required settings.record');
  if (!element.settings?.record?.recordType) errors.push('Missing required settings.record.recordType');
  if (element.settings?.record?.recordType && !recordTypes.includes(element.settings.record.recordType)) {
    errors.push(`Invalid recordType: '${element.settings.record.recordType}'`);
  }
  return { valid: errors.length === 0, errors };
};

export default { recordTypes, layoutTypes, recordSpecificSettings, createRecordElement, validateRecordElement };
