/**
 * CSV Parser
 * Parse CSV files using PapaParse
 */

import Papa from 'papaparse';

/**
 * Parse CSV string or file
 * @param {string|File} input - CSV string or File object
 * @param {Object} options - Parse options
 * @returns {Promise} Promise resolving to parsed data
 */
export function parseCSV(input, options = {}) {
  return new Promise((resolve, reject) => {
    const config = {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      transformHeader: (header) => header.trim(),
      ...options,
      complete: (results) => {
        if (results.errors.length > 0) {
          console.warn('CSV parsing warnings:', results.errors);
        }
        resolve({
          data: results.data,
          meta: results.meta,
          errors: results.errors
        });
      },
      error: (error) => {
        reject(new Error(`CSV parsing failed: ${error.message}`));
      }
    };

    if (input instanceof File) {
      Papa.parse(input, config);
    } else if (typeof input === 'string') {
      Papa.parse(input, config);
    } else {
      reject(new Error('Invalid input: expected string or File'));
    }
  });
}

/**
 * Detect CSV schema from parsed data
 * @param {Array} data - Parsed CSV data
 * @returns {Object} Schema with field types
 */
export function detectCSVSchema(data) {
  if (!data || data.length === 0) {
    return { fields: [] };
  }

  const firstRow = data[0];
  const fields = Object.keys(firstRow).map(key => {
    const values = data.slice(0, 100).map(row => row[key]); // Sample first 100 rows
    const type = inferFieldType(values);

    return {
      name: key,
      type,
      nullable: values.some(v => v === null || v === undefined || v === ''),
      unique: new Set(values).size === values.length
    };
  });

  return { fields };
}

/**
 * Infer field type from sample values
 * @param {Array} values - Sample values
 * @returns {string} Inferred type
 */
function inferFieldType(values) {
  const nonNullValues = values.filter(v => v !== null && v !== undefined && v !== '');

  if (nonNullValues.length === 0) return 'string';

  // Check for boolean
  const booleanValues = nonNullValues.filter(v =>
    v === true || v === false ||
    (typeof v === 'string' && ['true', 'false', 'yes', 'no'].includes(v.toLowerCase()))
  );
  if (booleanValues.length === nonNullValues.length) return 'boolean';

  // Check for number
  const numberValues = nonNullValues.filter(v => typeof v === 'number' || !isNaN(Number(v)));
  if (numberValues.length === nonNullValues.length) {
    // Check for integer
    const integerValues = numberValues.filter(v => Number.isInteger(Number(v)));
    return integerValues.length === numberValues.length ? 'integer' : 'number';
  }

  // Check for date
  const dateValues = nonNullValues.filter(v => !isNaN(Date.parse(v)));
  if (dateValues.length === nonNullValues.length) return 'date';

  // Default to string
  return 'string';
}

/**
 * Validate CSV structure
 * @param {Array} data - Parsed CSV data
 * @param {Object} schema - Expected schema
 * @returns {Object} Validation result
 */
export function validateCSV(data, schema) {
  const errors = [];
  const warnings = [];

  if (!data || data.length === 0) {
    errors.push('CSV data is empty');
    return { valid: false, errors, warnings };
  }

  // Check required fields
  if (schema?.requiredFields) {
    const firstRow = data[0];
    const actualFields = Object.keys(firstRow);

    schema.requiredFields.forEach(field => {
      if (!actualFields.includes(field)) {
        errors.push(`Missing required field: ${field}`);
      }
    });
  }

  // Check field types
  if (schema?.fields) {
    data.forEach((row, index) => {
      schema.fields.forEach(fieldSchema => {
        const value = row[fieldSchema.name];

        if (fieldSchema.required && (value === null || value === undefined || value === '')) {
          errors.push(`Row ${index + 1}: Field "${fieldSchema.name}" is required`);
        }

        if (value && fieldSchema.type) {
          const actualType = typeof value;
          if (fieldSchema.type === 'number' && actualType !== 'number') {
            warnings.push(`Row ${index + 1}: Field "${fieldSchema.name}" should be a number`);
          }
        }
      });
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

export default parseCSV;
