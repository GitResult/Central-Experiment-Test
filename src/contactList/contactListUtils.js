/**
 * Contact List Utility Functions
 *
 * Contains utility functions for contact list operations,
 * including date calculations, field value retrieval, and filter evaluation.
 */

import { FIELD_NAME_MAP } from './contactListConstants';

/**
 * Calculate years between two dates (for tenure calculation)
 * @param {Date|string} startDate - Start date
 * @param {Date} endDate - End date (defaults to current date)
 * @returns {number} Number of years (floored)
 */
export const calculateYears = (startDate, endDate = new Date()) => {
  if (!startDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const years = (end - start) / (1000 * 60 * 60 * 24 * 365.25);
  return Math.floor(years);
};

/**
 * Get field value from contact (handles both display names and data field names)
 * @param {Object} contact - Contact object
 * @param {string} fieldPath - Field path (can be display name or data field name)
 * @returns {*} Field value or null
 */
export const getFieldValue = (contact, fieldPath) => {
  if (!fieldPath) return null;

  // Try to map display name to data field name
  const mappedField = FIELD_NAME_MAP[fieldPath] || fieldPath;

  // Handle nested paths
  const parts = mappedField.split('.');
  let value = contact;
  for (const part of parts) {
    if (value == null) return null;
    value = value[part];
  }
  return value;
};

/**
 * Evaluate a single filter condition against a contact
 * @param {Object} contact - Contact object to evaluate
 * @param {Object} filter - Filter configuration with field, operator, and value
 * @returns {boolean} True if contact matches the filter
 */
export const evaluateFilter = (contact, filter) => {
  const value = getFieldValue(contact, filter.field);
  const filterValue = filter.value;

  // Handle null/undefined values
  if (value == null) return false;

  switch (filter.operator) {
    case 'eq':
      return String(value).toLowerCase() === String(filterValue).toLowerCase();
    case 'neq':
      return String(value).toLowerCase() !== String(filterValue).toLowerCase();
    case 'gte':
      return Number(value) >= Number(filterValue);
    case 'lte':
      return Number(value) <= Number(filterValue);
    case 'gt':
      return Number(value) > Number(filterValue);
    case 'lt':
      return Number(value) < Number(filterValue);
    case 'between':
      return Number(value) >= Number(filterValue[0]) && Number(value) <= Number(filterValue[1]);
    case 'in':
      return Array.isArray(filterValue) && filterValue.includes(value);
    case 'contains':
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    default:
      return false;
  }
};
