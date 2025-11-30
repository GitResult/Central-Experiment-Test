/**
 * List Page Template Generator
 * Generates a list/table page from schema
 */

import { mapTypeToComponent } from '../schemaDetector';

/**
 * Generate list page structure
 * @param {Object} schema - Data schema
 * @param {string} entityName - Name of the entity (singular)
 * @returns {Object} Page structure
 */
export function generateListPage(schema, entityName = 'Record') {
  const entityNamePlural = `${entityName}s`;
  const pageId = `${entityName.toLowerCase()}-list`;

  return {
    id: pageId,
    name: `${entityNamePlural} List`,
    description: `View and manage all ${entityNamePlural.toLowerCase()}`,
    type: 'Custom',
    layout: 'wide',
    icon: 'List',
    zones: [
      {
        id: 'main-content',
        rows: [
          // Header row with title and actions
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
                      text: entityNamePlural,
                      level: 'h1',
                      style: 'default'
                    }
                  }
                ]
              }
            ]
          },
          // Data table row
          {
            id: `${pageId}-table-row`,
            columns: [
              {
                id: `${pageId}-table-col`,
                span: 12,
                elements: [
                  {
                    id: `${pageId}-table`,
                    type: 'DataTable',
                    props: {
                      dataSource: entityName.toLowerCase(),
                      columns: schema.fields.map(field => ({
                        key: field.name,
                        title: formatFieldName(field.name),
                        type: field.type,
                        sortable: true,
                        filterable: true
                      })),
                      pagination: true,
                      pageSize: 20,
                      searchable: true,
                      exportable: true,
                      actions: [
                        {
                          label: 'View',
                          type: 'navigate',
                          target: `${entityName.toLowerCase()}-detail`
                        },
                        {
                          label: 'Edit',
                          type: 'navigate',
                          target: `${entityName.toLowerCase()}-edit`
                        },
                        {
                          label: 'Delete',
                          type: 'delete',
                          confirm: true
                        }
                      ]
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
 * Format field name for display
 * Converts snake_case or camelCase to Title Case
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

export default generateListPage;
