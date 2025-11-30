/**
 * Element Validation System
 * Type-specific validation rules for field, record, markup, and structure elements
 * Validates settings, data, and nesting according to element type requirements
 */

/**
 * Validation result structure
 */
export function createValidationResult(isValid = true, errors = [], warnings = []) {
  return {
    isValid,
    errors,
    warnings,
  };
}

/**
 * Field element validation
 * Validates field-specific settings and data
 */
export function validateFieldElement(element, context = {}) {
  const errors = [];
  const warnings = [];

  const fieldType = element.settings?.field?.fieldType;
  const label = element.settings?.field?.label;
  const required = element.settings?.field?.required;

  // Required field type
  if (!fieldType) {
    errors.push('Field type is required');
  }

  // Valid field types
  const validFieldTypes = [
    'text',
    'email',
    'password',
    'number',
    'tel',
    'url',
    'textarea',
    'select',
    'checkbox',
    'radio',
    'date',
    'time',
    'datetime',
    'file',
  ];

  if (fieldType && !validFieldTypes.includes(fieldType)) {
    errors.push(`Invalid field type: ${fieldType}`);
  }

  // Label should be provided for accessibility
  if (!label || label.trim().length === 0) {
    warnings.push('Field label is recommended for accessibility');
  }

  // Select/Radio specific validation
  if (fieldType === 'select' || fieldType === 'radio') {
    const options = element.settings?.field?.options;
    if (!options || !Array.isArray(options) || options.length === 0) {
      errors.push(`${fieldType} field requires options array`);
    }
  }

  // Email validation pattern
  if (fieldType === 'email') {
    const pattern = element.settings?.field?.pattern;
    if (pattern && !isValidRegex(pattern)) {
      errors.push('Invalid email validation pattern');
    }
  }

  // Number validation
  if (fieldType === 'number') {
    const min = element.settings?.field?.min;
    const max = element.settings?.field?.max;
    if (min !== undefined && max !== undefined && min > max) {
      errors.push('Minimum value cannot be greater than maximum value');
    }
  }

  // File validation
  if (fieldType === 'file') {
    const accept = element.settings?.field?.accept;
    const maxSize = element.settings?.field?.maxSize;
    if (accept && typeof accept !== 'string') {
      errors.push('File accept attribute must be a string');
    }
    if (maxSize && typeof maxSize !== 'number') {
      errors.push('Max file size must be a number');
    }
  }

  return createValidationResult(errors.length === 0, errors, warnings);
}

/**
 * Record element validation
 * Validates record-specific settings and data bindings
 */
export function validateRecordElement(element, context = {}) {
  const errors = [];
  const warnings = [];

  const recordType = element.settings?.record?.recordType;
  const dataSource = element.data?.binding;

  // Record type validation
  const validRecordTypes = ['display', 'card', 'table', 'list'];
  if (recordType && !validRecordTypes.includes(recordType)) {
    errors.push(`Invalid record type: ${recordType}`);
  }

  // Data binding validation
  if (dataSource) {
    if (typeof dataSource !== 'object') {
      errors.push('Record data binding must be an object');
    } else {
      const { mode, source } = dataSource;

      // Validate binding mode
      const validModes = ['static', 'direct', 'expression', 'context', 'api', 'store'];
      if (mode && !validModes.includes(mode)) {
        errors.push(`Invalid binding mode: ${mode}`);
      }

      // API binding specific validation
      if (mode === 'api' && !source) {
        errors.push('API binding requires endpoint source');
      }

      // Store binding specific validation
      if (mode === 'store' && !source) {
        errors.push('Store binding requires store key');
      }
    }
  } else {
    warnings.push('Record element has no data binding');
  }

  // Fields array validation for table/list types
  if ((recordType === 'table' || recordType === 'list') && !element.settings?.record?.fields) {
    warnings.push(`${recordType} record type should specify fields array`);
  }

  return createValidationResult(errors.length === 0, errors, warnings);
}

/**
 * Markup element validation
 * Validates markup-specific settings and content
 */
export function validateMarkupElement(element, context = {}) {
  const errors = [];
  const warnings = [];

  const markupType = element.settings?.markup?.markupType;
  const content = element.data?.content;

  // Markup type validation
  const validMarkupTypes = [
    'title',
    'heading',
    'paragraph',
    'button',
    'link',
    'image',
    'icon',
    'nav-item',
    'divider',
  ];

  if (!markupType) {
    errors.push('Markup type is required');
  } else if (!validMarkupTypes.includes(markupType)) {
    errors.push(`Invalid markup type: ${markupType}`);
  }

  // Content validation
  if (!content || (typeof content === 'string' && content.trim().length === 0)) {
    if (markupType !== 'divider') {
      warnings.push('Markup element has no content');
    }
  }

  // Button/Link specific validation
  if (markupType === 'button' || markupType === 'link') {
    const action = element.settings?.markup?.action;
    if (!action) {
      warnings.push(`${markupType} should have an action defined`);
    } else {
      const validActions = ['navigate', 'submit', 'custom', 'download'];
      if (!validActions.includes(action)) {
        errors.push(`Invalid action type: ${action}`);
      }

      // Navigate action requires href
      if (action === 'navigate' && !element.settings?.markup?.href) {
        errors.push('Navigate action requires href');
      }
    }
  }

  // Image specific validation
  if (markupType === 'image') {
    const src = element.settings?.markup?.src;
    const alt = element.settings?.markup?.alt;

    if (!src) {
      errors.push('Image requires src attribute');
    }

    if (!alt) {
      warnings.push('Image should have alt text for accessibility');
    }
  }

  // Icon specific validation
  if (markupType === 'icon') {
    const iconName = element.settings?.markup?.iconName;
    if (!iconName) {
      errors.push('Icon requires iconName');
    }
  }

  return createValidationResult(errors.length === 0, errors, warnings);
}

/**
 * Structure element validation
 * Validates structure-specific settings, nesting depth, and children
 */
export function validateStructureElement(element, context = {}) {
  const errors = [];
  const warnings = [];

  const structureType = element.settings?.structure?.structureType;
  const elements = element.elements || [];
  const depth = context.depth || 0;

  // Structure type validation
  const validStructureTypes = [
    'div',
    'stack',
    'grid',
    'flex',
    'card',
    'panel',
    'tabs',
    'accordion',
    'modal',
    'drawer',
    'carousel',
    'canvas',
  ];

  if (!structureType) {
    errors.push('Structure type is required');
  } else if (!validStructureTypes.includes(structureType)) {
    errors.push(`Invalid structure type: ${structureType}`);
  }

  // Nesting depth validation
  const maxDepth = 3;
  if (depth > maxDepth) {
    errors.push(`Structure nesting depth ${depth} exceeds maximum of ${maxDepth}`);
  }

  // Children validation
  if (elements.length > 0) {
    // Nested structures increase depth
    const hasNestedStructures = elements.some((el) => el.type === 'structure');
    if (hasNestedStructures && depth >= maxDepth) {
      errors.push('Cannot nest structures beyond maximum depth');
    }
  }

  // Tabs/Accordion specific validation
  if (structureType === 'tabs' || structureType === 'accordion') {
    if (elements.length === 0) {
      warnings.push(`${structureType} structure has no child elements`);
    }

    // Tabs/Accordion children should have labels
    const childrenWithoutLabels = elements.filter(
      (el) => !el.settings?.structure?.label
    );
    if (childrenWithoutLabels.length > 0) {
      warnings.push(
        `${childrenWithoutLabels.length} ${structureType} children missing labels`
      );
    }
  }

  // Grid specific validation
  if (structureType === 'grid') {
    const columns = element.settings?.layout?.columns;
    if (!columns) {
      warnings.push('Grid structure should specify columns');
    }
  }

  // Flex specific validation
  if (structureType === 'flex') {
    const direction = element.settings?.layout?.direction;
    if (direction && !['row', 'column', 'row-reverse', 'column-reverse'].includes(direction)) {
      errors.push(`Invalid flex direction: ${direction}`);
    }
  }

  // Modal/Drawer specific validation
  if (structureType === 'modal' || structureType === 'drawer') {
    const visible = element.settings?.businessRules?.visible;
    if (visible === undefined) {
      warnings.push(`${structureType} should have visible business rule`);
    }
  }

  return createValidationResult(errors.length === 0, errors, warnings);
}

/**
 * Main element validation dispatcher
 * Routes to type-specific validation
 */
export function validateElement(element, context = {}) {
  if (!element || typeof element !== 'object') {
    return createValidationResult(false, ['Element is invalid or missing']);
  }

  if (!element.type) {
    return createValidationResult(false, ['Element type is required']);
  }

  // Route to type-specific validator
  switch (element.type) {
    case 'field':
      return validateFieldElement(element, context);

    case 'record':
      return validateRecordElement(element, context);

    case 'markup':
      return validateMarkupElement(element, context);

    case 'structure':
      return validateStructureElement(element, context);

    default:
      return createValidationResult(false, [`Unknown element type: ${element.type}`]);
  }
}

/**
 * Validate entire page structure
 * Recursively validates all elements
 */
export function validatePage(page) {
  const errors = [];
  const warnings = [];

  if (!page || typeof page !== 'object') {
    return createValidationResult(false, ['Page is invalid or missing']);
  }

  // Validate page metadata
  if (!page.zones || !Array.isArray(page.zones)) {
    errors.push('Page must have zones array');
    return createValidationResult(false, errors);
  }

  // Validate each zone
  page.zones.forEach((zone, zoneIndex) => {
    if (!zone.rows || !Array.isArray(zone.rows)) {
      errors.push(`Zone ${zoneIndex} must have rows array`);
      return;
    }

    zone.rows.forEach((row, rowIndex) => {
      if (!row.columns || !Array.isArray(row.columns)) {
        errors.push(`Zone ${zoneIndex}, Row ${rowIndex} must have columns array`);
        return;
      }

      row.columns.forEach((column, columnIndex) => {
        if (!column.elements || !Array.isArray(column.elements)) {
          warnings.push(
            `Zone ${zoneIndex}, Row ${rowIndex}, Column ${columnIndex} has no elements array`
          );
          return;
        }

        // Validate each element
        column.elements.forEach((element, elementIndex) => {
          const context = {
            depth: 0,
            zoneId: zone.id,
            rowIndex,
            columnIndex,
            elementIndex,
          };

          const result = validateElement(element, context);

          if (!result.isValid) {
            result.errors.forEach((error) => {
              errors.push(
                `Zone ${zoneIndex}, Row ${rowIndex}, Column ${columnIndex}, Element ${elementIndex}: ${error}`
              );
            });
          }

          result.warnings.forEach((warning) => {
            warnings.push(
              `Zone ${zoneIndex}, Row ${rowIndex}, Column ${columnIndex}, Element ${elementIndex}: ${warning}`
            );
          });

          // Recursively validate nested structure elements
          if (element.type === 'structure' && element.elements) {
            validateNestedElements(element.elements, context, errors, warnings, 1);
          }
        });
      });
    });
  });

  return createValidationResult(errors.length === 0, errors, warnings);
}

/**
 * Helper to validate nested elements recursively
 */
function validateNestedElements(elements, parentContext, errors, warnings, depth) {
  elements.forEach((element, index) => {
    const context = { ...parentContext, depth };
    const result = validateElement(element, context);

    if (!result.isValid) {
      result.errors.forEach((error) => {
        errors.push(`Nested element at depth ${depth}: ${error}`);
      });
    }

    result.warnings.forEach((warning) => {
      warnings.push(`Nested element at depth ${depth}: ${warning}`);
    });

    // Continue recursion
    if (element.type === 'structure' && element.elements) {
      validateNestedElements(element.elements, context, errors, warnings, depth + 1);
    }
  });
}

/**
 * Helper to validate regex pattern
 */
function isValidRegex(pattern) {
  try {
    new RegExp(pattern);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get validation severity
 */
export function getValidationSeverity(result) {
  if (result.errors.length > 0) return 'error';
  if (result.warnings.length > 0) return 'warning';
  return 'success';
}
