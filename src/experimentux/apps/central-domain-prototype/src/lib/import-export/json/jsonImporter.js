/**
 * JSON Importer
 * Import and validate JSON data
 */

/**
 * Parse JSON string with error handling
 * @param {string} jsonString - JSON string
 * @returns {Object} Parsed data or error
 */
export function importJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
}

/**
 * Validate JSON against schema
 * @param {Object} data - Parsed JSON data
 * @param {Object} schema - Validation schema
 * @returns {Object} Validation result
 */
export function validateJSON(data, schema) {
  const errors = [];

  // Check required fields
  if (schema.required) {
    schema.required.forEach(field => {
      if (!(field in data)) {
        errors.push(`Missing required field: ${field}`);
      }
    });
  }

  // Check field types
  if (schema.properties) {
    Object.entries(schema.properties).forEach(([field, fieldSchema]) => {
      if (field in data) {
        const value = data[field];
        const expectedType = fieldSchema.type;

        if (expectedType && typeof value !== expectedType) {
          errors.push(`Field "${field}" should be of type ${expectedType}`);
        }
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Import JSON with metadata extraction
 * @param {string} jsonString - JSON string
 * @returns {Object} Data and metadata
 */
export function importJSONWithMetadata(jsonString) {
  const result = importJSON(jsonString);

  if (!result.success) {
    return result;
  }

  const { metadata, data } = result.data;

  return {
    success: true,
    metadata: metadata || null,
    data: data || result.data
  };
}

export default importJSON;
