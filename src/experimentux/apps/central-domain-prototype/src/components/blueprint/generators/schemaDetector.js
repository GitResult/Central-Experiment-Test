/**
 * Schema Detector
 * Automatically detect field types from CSV data
 */

/**
 * Detect field type from sample values
 * @param {string} fieldName - Field name
 * @param {Array} values - Sample values from CSV
 * @returns {Object} Field schema with type and metadata
 */
export function detectFieldType(fieldName, values) {
  // Remove null/undefined/empty values for analysis
  const nonEmptyValues = values.filter(v => v !== null && v !== undefined && v !== '');

  if (nonEmptyValues.length === 0) {
    return {
      name: fieldName,
      type: 'text',
      nullable: true,
      unique: false
    };
  }

  const totalValues = values.length;
  const uniqueValues = new Set(nonEmptyValues);
  const isNullable = nonEmptyValues.length < totalValues;
  const isUnique = uniqueValues.size === nonEmptyValues.length;

  // Detect boolean
  const boolValues = ['true', 'false', 'yes', 'no', '1', '0', 'y', 'n'];
  if (nonEmptyValues.every(v =>
    typeof v === 'boolean' ||
    boolValues.includes(String(v).toLowerCase())
  )) {
    return {
      name: fieldName,
      type: 'boolean',
      nullable: isNullable,
      unique: isUnique
    };
  }

  // Detect email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (nonEmptyValues.every(v => emailRegex.test(String(v)))) {
    return {
      name: fieldName,
      type: 'email',
      nullable: isNullable,
      unique: isUnique
    };
  }

  // Detect URL
  if (nonEmptyValues.every(v => {
    const str = String(v);
    return str.startsWith('http://') || str.startsWith('https://');
  })) {
    return {
      name: fieldName,
      type: 'url',
      nullable: isNullable,
      unique: isUnique
    };
  }

  // Detect phone
  const phoneRegex = /^[\d\s\-\(\)\+\.]+$/;
  if (nonEmptyValues.some(v => phoneRegex.test(String(v)) && String(v).length >= 10)) {
    return {
      name: fieldName,
      type: 'tel',
      nullable: isNullable,
      unique: isUnique
    };
  }

  // Detect number
  const numberValues = nonEmptyValues.filter(v => !isNaN(Number(v)));
  if (numberValues.length === nonEmptyValues.length) {
    const numbers = numberValues.map(v => Number(v));
    const isInteger = numbers.every(n => Number.isInteger(n));

    return {
      name: fieldName,
      type: isInteger ? 'integer' : 'number',
      nullable: isNullable,
      unique: isUnique,
      min: Math.min(...numbers),
      max: Math.max(...numbers),
      avg: numbers.reduce((a, b) => a + b, 0) / numbers.length
    };
  }

  // Detect date
  const dateValues = nonEmptyValues.filter(v => !isNaN(Date.parse(String(v))));
  if (dateValues.length === nonEmptyValues.length) {
    return {
      name: fieldName,
      type: 'date',
      nullable: isNullable,
      unique: isUnique
    };
  }

  // Detect select/enum (< 10 unique values)
  if (uniqueValues.size < 10 && uniqueValues.size > 1) {
    return {
      name: fieldName,
      type: 'select',
      nullable: isNullable,
      unique: isUnique,
      options: Array.from(uniqueValues).map(v => String(v))
    };
  }

  // Default to text
  return {
    name: fieldName,
    type: 'text',
    nullable: isNullable,
    unique: isUnique,
    maxLength: Math.max(...nonEmptyValues.map(v => String(v).length))
  };
}

/**
 * Detect schema from CSV data
 * @param {Array} data - Parsed CSV data (array of objects)
 * @returns {Object} Schema with fields array
 */
export function detectSchema(data) {
  if (!data || data.length === 0) {
    return { fields: [] };
  }

  const firstRow = data[0];
  const fieldNames = Object.keys(firstRow);

  const fields = fieldNames.map(fieldName => {
    // Sample up to 100 rows for detection
    const values = data.slice(0, 100).map(row => row[fieldName]);
    return detectFieldType(fieldName, values);
  });

  return {
    fields,
    rowCount: data.length,
    columnCount: fields.length
  };
}

/**
 * Validate schema
 * @param {Object} schema - Schema to validate
 * @returns {Object} Validation result
 */
export function validateSchema(schema) {
  const errors = [];
  const warnings = [];

  if (!schema.fields || schema.fields.length === 0) {
    errors.push('Schema must have at least one field');
    return { valid: false, errors, warnings };
  }

  schema.fields.forEach((field, index) => {
    if (!field.name || field.name.trim() === '') {
      errors.push(`Field ${index + 1}: Name is required`);
    }

    if (!field.type) {
      errors.push(`Field "${field.name}": Type is required`);
    }

    // Check for duplicate field names
    const duplicates = schema.fields.filter(f => f.name === field.name);
    if (duplicates.length > 1) {
      errors.push(`Duplicate field name: "${field.name}"`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Map field type to UI component type
 * @param {string} fieldType - Detected field type
 * @returns {string} UI component type
 */
export function mapTypeToComponent(fieldType) {
  const mapping = {
    'text': 'text',
    'email': 'email',
    'url': 'url',
    'tel': 'tel',
    'number': 'number',
    'integer': 'number',
    'date': 'date',
    'boolean': 'checkbox',
    'select': 'select'
  };

  return mapping[fieldType] || 'text';
}

export default {
  detectFieldType,
  detectSchema,
  validateSchema,
  mapTypeToComponent
};
