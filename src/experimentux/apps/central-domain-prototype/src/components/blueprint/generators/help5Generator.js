/**
 * Help5 Generator
 * Auto-generates Help5 stubs for Blueprint-generated pages
 */

/**
 * Generate Help5 stub for a page
 * @param {Object} page - Generated page object
 * @param {Object} schema - CSV schema
 * @param {string} entityName - Entity name from CSV
 * @param {string} csvFilename - Original CSV filename
 * @returns {Object} Help5 record
 */
export function generateHelp5Stub(page, schema, entityName, csvFilename = 'data.csv') {
  const pageType = page.id.split('-').pop(); // Extract type from 'customer-list', 'customer-detail', etc.

  // Auto-generate "What" based on page type
  const whatDescriptions = {
    list: `Displays all ${entityName} records in a sortable, filterable table`,
    detail: `Shows detailed information for a single ${entityName} record`,
    create: `Form for creating a new ${entityName} record`,
    edit: `Form for editing an existing ${entityName} record`,
    dashboard: `Overview dashboard showing ${entityName} statistics and recent records`
  };

  // Auto-generate "Where" from CSV filename
  const where = `${csvFilename} data`;

  // Auto-generate "Who" with default roles
  const who = ['Admins']; // Default, can be customized by user

  // Auto-generate "When" with current date
  const when = `Created ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;

  return {
    record_id: `help_${page.id}`,
    record_type: 'help',
    parent_id: page.id,
    title: `Help5: ${page.title}`,
    content: {
      what: whatDescriptions[pageType] || `Page for managing ${entityName} records`,
      who: who.join(', '),
      where,
      when,
      why: '' // User must fill in
    },
    created_at: new Date().toISOString(),
    completionScore: 80 // 4 of 5 fields complete
  };
}

/**
 * Generate Help5 stubs for all Blueprint pages
 * @param {Array} pages - Array of generated pages
 * @param {Object} schema - CSV schema
 * @param {string} entityName - Entity name
 * @param {string} csvFilename - CSV filename
 * @returns {Array} Array of Help5 records
 */
export function generateHelp5Stubs(pages, schema, entityName, csvFilename) {
  return pages.map(page =>
    generateHelp5Stub(page, schema, entityName, csvFilename)
  );
}

/**
 * Calculate Help5 completion score
 * @param {Object} help5Content - Help5 content object
 * @returns {number} Completion percentage (0-100)
 */
export function calculateHelp5Completion(help5Content) {
  const fields = ['what', 'who', 'where', 'when', 'why'];
  const completed = fields.filter(field => {
    const value = help5Content[field];
    return value && value.length >= 10; // Minimum 10 characters
  });
  return (completed.length / fields.length) * 100;
}

/**
 * Validate Help5 content meets minimum quality
 * @param {Object} help5Content - Help5 content object
 * @returns {Object} { isValid, errors }
 */
export function validateHelp5Content(help5Content) {
  const errors = [];

  // Check "Why" field (required for Blueprint)
  if (!help5Content.why || help5Content.why.length < 30) {
    errors.push('Why field must be at least 30 characters');
  }

  // Check other fields have some content
  if (!help5Content.what || help5Content.what.length < 10) {
    errors.push('What field must be at least 10 characters');
  }

  if (!help5Content.who || help5Content.who.length < 3) {
    errors.push('Who field must specify at least one role');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

export default {
  generateHelp5Stub,
  generateHelp5Stubs,
  calculateHelp5Completion,
  validateHelp5Content
};
