/**
 * Form Page Template Generator
 * Generates create/edit form pages from schema
 */

import { mapTypeToComponent } from '../schemaDetector';

/**
 * Generate form page structure
 * @param {Object} schema - Data schema
 * @param {string} entityName - Name of the entity (singular)
 * @param {string} mode - 'create' or 'edit'
 * @returns {Object} Page structure
 */
export function generateFormPage(schema, entityName = 'Record', mode = 'create') {
  const pageId = `${entityName.toLowerCase()}-${mode}`;
  const title = mode === 'create' ? `Create ${entityName}` : `Edit ${entityName}`;

  return {
    id: pageId,
    name: title,
    description: `${mode === 'create' ? 'Create a new' : 'Edit an existing'} ${entityName.toLowerCase()}`,
    type: 'Custom',
    layout: 'centered',
    icon: mode === 'create' ? 'Plus' : 'Edit',
    zones: [
      {
        id: 'main-content',
        rows: [
          // Header row
          {
            id: `${pageId}-header-row`,
            columns: [
              {
                id: `${pageId}-header-col`,
                span: 12,
                elements: [
                  {
                    id: `${pageId}-title`,
                    type: 'Heading',
                    props: {
                      text: title,
                      level: 'h1',
                      style: 'default'
                    }
                  }
                ]
              }
            ]
          },
          // Form row
          {
            id: `${pageId}-form-row`,
            columns: [
              {
                id: `${pageId}-form-col`,
                span: 12,
                elements: [
                  {
                    id: `${pageId}-form`,
                    type: 'Form',
                    props: {
                      mode,
                      dataSource: entityName.toLowerCase(),
                      fields: schema.fields.map(field => generateFormField(field)),
                      submitLabel: mode === 'create' ? 'Create' : 'Save Changes',
                      cancelLabel: 'Cancel',
                      onSubmit: mode === 'create' ? 'createRecord' : 'updateRecord',
                      onCancel: 'goBack'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Generate form field configuration from schema field
 */
function generateFormField(field) {
  const componentType = mapTypeToComponent(field.type);

  const formField = {
    name: field.name,
    label: formatFieldName(field.name),
    type: componentType,
    required: !field.nullable,
    placeholder: `Enter ${formatFieldName(field.name).toLowerCase()}`
  };

  // Add type-specific props
  switch (field.type) {
    case 'number':
    case 'integer':
      if (field.min !== undefined) formField.min = field.min;
      if (field.max !== undefined) formField.max = field.max;
      break;

    case 'text':
      if (field.maxLength) formField.maxLength = field.maxLength;
      break;

    case 'select':
      if (field.options) formField.options = field.options;
      break;

    case 'email':
      formField.validation = 'email';
      break;

    case 'url':
      formField.validation = 'url';
      break;

    case 'tel':
      formField.validation = 'phone';
      break;
  }

  return formField;
}

/**
 * Format field name for display
 */
function formatFieldName(fieldName) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

export default generateFormPage;
