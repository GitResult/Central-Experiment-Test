/**
 * Template Registry
 *
 * Central registry for all record type templates.
 * Provides utilities for template discovery, instantiation, and management.
 */

import executiveContact from './executive-contact';
import conferenceEvent from './conference-event';
import enterpriseDashboard from './enterprise-dashboard';
import editorialArticle from './editorial-article';

/**
 * Template Registry
 * Maps template IDs to their configurations
 */
export const templateRegistry = {
  'executive-contact': executiveContact,
  'conference-event': conferenceEvent,
  'enterprise-dashboard': enterpriseDashboard,
  'editorial-article': editorialArticle
};

/**
 * Get a specific template by ID
 * @param {string} templateId - The template identifier
 * @returns {object|null} Template configuration or null if not found
 */
export const getTemplate = (templateId) => {
  return templateRegistry[templateId] || null;
};

/**
 * Get all available templates
 * @returns {array} Array of all template configurations
 */
export const getAllTemplates = () => {
  return Object.values(templateRegistry);
};

/**
 * Get templates filtered by category
 * @param {string} category - Category name (e.g., 'CRM', 'Events', 'Analytics')
 * @returns {array} Array of templates in the specified category
 */
export const getTemplatesByCategory = (category) => {
  return Object.values(templateRegistry)
    .filter(template => template.category === category);
};

/**
 * Get all unique categories
 * @returns {array} Array of category names
 */
export const getAllCategories = () => {
  const categories = new Set(
    Object.values(templateRegistry).map(template => template.category)
  );
  return Array.from(categories).sort();
};

/**
 * Create a new record from a template
 * @param {string} templateId - The template to use
 * @param {object} initialData - Initial data for the record
 * @param {string} currentUserId - ID of the user creating the record
 * @returns {object} New record instance
 */
export const createRecordFromTemplate = (templateId, initialData = {}, currentUserId = null) => {
  const template = getTemplate(templateId);

  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  // Generate unique ID (simplified - in production use UUID)
  const generateId = () => `REC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: generateId(),
    templateId,
    title: initialData.title || 'Untitled',
    customData: {
      ...template.defaultData,
      ...initialData
    },
    pageConfig: JSON.parse(JSON.stringify(template.config)), // Deep clone
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: currentUserId,
      version: 1
    }
  };
};

/**
 * Create a record with sample data (for demos)
 * @param {string} templateId - The template to use
 * @param {string} title - Title for the record
 * @returns {object} New record instance with sample data
 */
export const createSampleRecord = (templateId, title = null) => {
  const template = getTemplate(templateId);

  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  const generateId = () => `SAMPLE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  return {
    id: generateId(),
    templateId,
    title: title || template.name,
    customData: {
      ...template.sampleData
    },
    pageConfig: JSON.parse(JSON.stringify(template.config)),
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'demo-user',
      version: 1,
      isSample: true
    }
  };
};

/**
 * Validate a template configuration
 * @param {object} template - Template to validate
 * @returns {object} Validation result { valid: boolean, errors: array }
 */
export const validateTemplate = (template) => {
  const errors = [];

  // Required fields
  if (!template.templateId) errors.push('Missing templateId');
  if (!template.name) errors.push('Missing name');
  if (!template.category) errors.push('Missing category');
  if (!template.config) errors.push('Missing config');

  // Config validation
  if (template.config) {
    if (!template.config.zones || !Array.isArray(template.config.zones)) {
      errors.push('Config must have zones array');
    }

    if (!template.config.features) {
      errors.push('Config must have features object');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Get template statistics
 * @returns {object} Statistics about the template library
 */
export const getTemplateStats = () => {
  const templates = getAllTemplates();
  const categories = getAllCategories();

  return {
    totalTemplates: templates.length,
    categories: categories.length,
    templatesByCategory: categories.reduce((acc, category) => {
      acc[category] = getTemplatesByCategory(category).length;
      return acc;
    }, {}),
    avgElementsPerTemplate: templates.reduce((sum, t) => {
      const elementCount = t.config.zones.reduce((zoneSum, zone) => {
        return zoneSum + (zone.elements?.length || 0);
      }, 0);
      return sum + elementCount;
    }, 0) / templates.length
  };
};

/**
 * Search templates by keyword
 * @param {string} query - Search query
 * @returns {array} Matching templates
 */
export const searchTemplates = (query) => {
  if (!query || query.trim() === '') {
    return getAllTemplates();
  }

  const searchTerm = query.toLowerCase().trim();

  return getAllTemplates().filter(template => {
    return (
      template.name.toLowerCase().includes(searchTerm) ||
      template.description.toLowerCase().includes(searchTerm) ||
      template.category.toLowerCase().includes(searchTerm) ||
      template.templateId.toLowerCase().includes(searchTerm)
    );
  });
};

/**
 * Clone a template with a new ID
 * @param {string} templateId - Template to clone
 * @param {object} overrides - Properties to override
 * @returns {object} Cloned template
 */
export const cloneTemplate = (templateId, overrides = {}) => {
  const template = getTemplate(templateId);

  if (!template) {
    throw new Error(`Template not found: ${templateId}`);
  }

  return {
    ...JSON.parse(JSON.stringify(template)), // Deep clone
    templateId: overrides.templateId || `${template.templateId}-copy`,
    name: overrides.name || `${template.name} (Copy)`,
    ...overrides
  };
};

// Export template registry as default
export default templateRegistry;
