/**
 * Automation Step Generator
 * Auto-generates automation steps for Blueprint-generated forms
 */

/**
 * Map schema field type to automation action
 * @param {Object} field - Schema field
 * @returns {string} Action type ('type' or 'click')
 */
function getActionForField(field) {
  const clickTypes = ['boolean', 'select', 'radio'];
  return clickTypes.includes(field.type) ? 'click' : 'type';
}

/**
 * Generate duration based on field type and value length
 * @param {string} action - Action type
 * @param {*} value - Field value
 * @returns {number} Duration in milliseconds
 */
function getDuration(action, value = '') {
  if (action === 'click') return 600;
  if (action === 'wait') return 2000;
  if (action === 'narrate') return 3000;

  // For typing, estimate based on string length
  const length = String(value).length || 10;
  return Math.min(Math.max(length * 80, 800), 2000); // 80ms per char, min 800ms, max 2s
}

/**
 * Generate narration for a step
 * @param {Object} field - Schema field
 * @param {string} action - Action type
 * @param {Object} help5 - Help5 content for this page
 * @returns {string} Narration text
 */
function generateNarration(field, action, help5) {
  const fieldLabel = field.label || field.name;

  if (action === 'type') {
    return `I'm entering {{input.${field.name}}} for ${fieldLabel}. ${help5?.why || 'This helps organize your data.'}`;
  }

  if (action === 'click') {
    return `I'm selecting {{input.${field.name}}} for ${fieldLabel}. ${help5?.why || ''}`;
  }

  return `Now working on ${fieldLabel}...`;
}

/**
 * Group fields into logical sections (5W framework)
 * @param {Array} fields - Schema fields
 * @returns {Array} Sections with grouped fields
 */
function groupFieldsIntoSections(fields) {
  // Simple heuristic: group every 3-4 fields into a section
  const sections = [];
  const itemsPerSection = 3;

  for (let i = 0; i < fields.length; i += itemsPerSection) {
    const sectionFields = fields.slice(i, i + itemsPerSection);
    const sectionNumber = Math.floor(i / itemsPerSection) + 1;

    sections.push({
      id: sectionNumber,
      title: `Section ${sectionNumber}`,
      items: sectionFields.map(field => ({
        label: field.label || field.name,
        completed: false
      }))
    });
  }

  return sections;
}

/**
 * Generate automation steps for a form page
 * @param {Object} page - Generated page object (create or edit form)
 * @param {Object} schema - CSV schema
 * @param {Object} help5 - Help5 record for this page
 * @param {string} entityName - Entity name
 * @returns {Object|null} Automation record or null if not a form
 */
export function generateAutomationSteps(page, schema, help5, entityName) {
  // Only generate for create and edit forms
  const pageType = page.id.split('-').pop();
  if (pageType !== 'create' && pageType !== 'edit') {
    return null;
  }

  const fields = schema.fields.filter(field => {
    // Exclude auto-generated fields like ID
    return !['id', '_id', 'created_at', 'updated_at'].includes(field.name.toLowerCase());
  });

  // Group fields into sections
  const sections = groupFieldsIntoSections(fields);

  // Generate automation steps
  const steps = [];
  let stepIndex = 0;

  // Opening narration
  steps.push({
    action: 'narrate',
    section: 1,
    itemIndex: 0,
    narration: `Let's ${pageType === 'create' ? 'create' : 'edit'} a ${entityName} record. I'll fill in the form using the information you provided.`,
    duration: 4000,
    help5_ref: help5?.record_id
  });

  // Generate steps for each field
  fields.forEach((field, fieldIndex) => {
    const sectionIndex = Math.floor(fieldIndex / 3);
    const itemIndex = fieldIndex % 3;
    const action = getActionForField(field);
    const value = `{{input.${field.name}}}`;

    steps.push({
      action,
      section: sectionIndex + 1,
      itemIndex,
      field: field.name,
      value,
      narration: generateNarration(field, action, help5?.content),
      duration: getDuration(action, value),
      help5_ref: `help_field_${field.name}`
    });

    stepIndex++;
  });

  // Closing narration
  steps.push({
    action: 'narrate',
    section: sections.length,
    itemIndex: sections[sections.length - 1]?.items.length || 0,
    narration: `All done! Review the form and click Save when ready.`,
    duration: 3000,
    help5_ref: help5?.record_id
  });

  // Map fields to inputs_required
  const inputs_required = {};
  fields.forEach(field => {
    const config = {
      type: field.type === 'number' || field.type === 'integer' ? 'number' : field.type === 'select' ? 'enum' : 'string',
      label: field.label || field.name
    };

    if (field.type === 'select' && field.options) {
      config.values = field.options;
    }

    inputs_required[field.name] = config;
  });

  return {
    record_id: `auto_${page.id}`,
    record_type: 'automation_step',
    parent_id: help5?.record_id || page.id,
    title: `${page.title} - Interactive Guide`,
    content: {
      steps,
      sections,
      inputs_required
    },
    created_at: new Date().toISOString()
  };
}

/**
 * Generate automation steps for all Blueprint form pages
 * @param {Array} pages - Array of generated pages
 * @param {Object} schema - CSV schema
 * @param {Array} help5Records - Help5 records for pages
 * @param {string} entityName - Entity name
 * @returns {Array} Array of automation records
 */
export function generateAutomationStepsForPages(pages, schema, help5Records, entityName) {
  return pages
    .map((page, index) => {
      const help5 = help5Records[index];
      return generateAutomationSteps(page, schema, help5, entityName);
    })
    .filter(Boolean); // Remove nulls (non-form pages)
}

export default {
  generateAutomationSteps,
  generateAutomationStepsForPages
};
