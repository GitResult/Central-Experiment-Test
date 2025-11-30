/**
 * Page Generator
 * Main generator that orchestrates page creation from schema
 */

import { generateListPage } from './templates/listPageTemplate';
import { generateFormPage } from './templates/formPageTemplate';

/**
 * Generate all pages from schema
 * @param {Object} schema - Data schema
 * @param {string} entityName - Name of the entity
 * @param {Object} options - Generation options
 * @returns {Array} Array of generated pages
 */
export function generatePages(schema, entityName, options = {}) {
  const {
    includeList = true,
    includeDetail = true,
    includeCreate = true,
    includeEdit = true,
    includeDashboard = false
  } = options;

  const pages = [];

  if (includeList) {
    pages.push(generateListPage(schema, entityName));
  }

  if (includeDetail) {
    pages.push(generateDetailPage(schema, entityName));
  }

  if (includeCreate) {
    pages.push(generateFormPage(schema, entityName, 'create'));
  }

  if (includeEdit) {
    pages.push(generateFormPage(schema, entityName, 'edit'));
  }

  if (includeDashboard) {
    pages.push(generateDashboardPage(schema, entityName));
  }

  return pages;
}

/**
 * Generate detail page (simplified version)
 */
function generateDetailPage(schema, entityName) {
  const pageId = `${entityName.toLowerCase()}-detail`;

  return {
    id: pageId,
    name: `${entityName} Details`,
    description: `View ${entityName.toLowerCase()} details`,
    type: 'Custom',
    layout: 'centered',
    icon: 'FileText',
    zones: [
      {
        id: 'main-content',
        rows: [
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
                      text: `${entityName} Details`,
                      level: 'h1'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: `${pageId}-content-row`,
            columns: [
              {
                id: `${pageId}-content-col`,
                span: 12,
                elements: schema.fields.map((field, index) => ({
                  id: `${pageId}-field-${index}`,
                  type: 'Text',
                  props: {
                    label: formatFieldName(field.name),
                    value: `{{${field.name}}}`,
                    style: 'label-value'
                  }
                }))
              }
            ]
          }
        ]
      }
    ]
  };
}

/**
 * Generate dashboard page (simplified version)
 */
function generateDashboardPage(schema, entityName) {
  const pageId = `${entityName.toLowerCase()}-dashboard`;

  return {
    id: pageId,
    name: `${entityName} Dashboard`,
    description: `Overview of ${entityName.toLowerCase()} data`,
    type: 'Custom',
    layout: 'wide',
    icon: 'BarChart3',
    zones: [
      {
        id: 'main-content',
        rows: [
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
                      text: `${entityName} Dashboard`,
                      level: 'h1'
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

function formatFieldName(fieldName) {
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
    .trim();
}

export default generatePages;
