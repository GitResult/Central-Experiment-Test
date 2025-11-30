#!/usr/bin/env node

/**
 * Element Migration CLI Tool
 * Migrates elements from 3-type system to 4-type system
 *
 * 3-type system (old): Display, Input, Structure
 * 4-type system (new): Field, Record, Markup, Structure
 *
 * Usage:
 *   node scripts/migrate-elements.js <input-file> [output-file]
 *   node scripts/migrate-elements.js --help
 */

const fs = require('fs');
const path = require('path');

// Migration statistics
const stats = {
  totalElements: 0,
  migrated: 0,
  warnings: [],
  errors: [],
};

/**
 * Migrate a single element from 3-type to 4-type
 */
function migrateElement(element, context = {}) {
  stats.totalElements++;

  if (!element || typeof element !== 'object') {
    stats.errors.push(`Invalid element at ${context.path || 'unknown'}`);
    return element;
  }

  const oldType = element.type;
  let newType = oldType;
  let migrated = { ...element };

  // Migrate based on old type
  switch (oldType) {
    case 'display':
      // Display → Markup or Record
      migrated = migrateDisplayElement(element, context);
      break;

    case 'input':
      // Input → Field
      migrated = migrateInputElement(element, context);
      break;

    case 'structure':
      // Structure → Structure (already correct, but validate)
      migrated = migrateStructureElement(element, context);
      break;

    // If already using new types, keep as-is
    case 'field':
    case 'record':
    case 'markup':
      stats.warnings.push(`Element already using new type: ${oldType} at ${context.path}`);
      break;

    default:
      stats.errors.push(`Unknown element type: ${oldType} at ${context.path}`);
      return element;
  }

  stats.migrated++;
  return migrated;
}

/**
 * Migrate Display element to Markup or Record
 *
 * Display elements showing static content → Markup
 * Display elements showing dynamic data → Record
 */
function migrateDisplayElement(element, context) {
  const migrated = { ...element };

  // Check if element has data binding
  const hasDataBinding =
    element.data?.binding ||
    element.settings?.dataBinding ||
    element.data?.source;

  if (hasDataBinding) {
    // Display with data binding → Record
    migrated.type = 'record';

    // Migrate data binding to new format
    if (element.data?.binding) {
      migrated.data = {
        ...element.data,
        binding: migrateDataBinding(element.data.binding),
      };
    }

    // Migrate display settings to record settings
    migrated.settings = {
      ...element.settings,
      record: {
        recordType: element.settings?.displayType || 'display',
        fields: element.settings?.fields || [],
        ...(element.settings?.record || {}),
      },
    };

    // Remove old displayType
    if (migrated.settings.displayType) {
      delete migrated.settings.displayType;
    }
  } else {
    // Display with static content → Markup
    migrated.type = 'markup';

    // Determine markup type based on content
    const markupType = inferMarkupType(element);

    migrated.settings = {
      ...element.settings,
      markup: {
        markupType,
        ...(element.settings?.markup || {}),
      },
    };
  }

  return migrated;
}

/**
 * Migrate Input element to Field
 */
function migrateInputElement(element, context) {
  const migrated = { ...element };

  migrated.type = 'field';

  // Migrate input settings to field settings
  migrated.settings = {
    ...element.settings,
    field: {
      fieldType: element.settings?.inputType || 'text',
      label: element.settings?.label || '',
      placeholder: element.settings?.placeholder || '',
      required: element.settings?.required || false,
      ...(element.settings?.validation || {}),
      ...(element.settings?.field || {}),
    },
  };

  // Remove old inputType
  if (migrated.settings.inputType) {
    delete migrated.settings.inputType;
  }

  return migrated;
}

/**
 * Migrate Structure element
 * Structure type stays the same, but validate subtypes
 */
function migrateStructureElement(element, context) {
  const migrated = { ...element };

  // Ensure structure settings exist
  if (!migrated.settings) {
    migrated.settings = {};
  }

  if (!migrated.settings.structure) {
    migrated.settings.structure = {
      structureType: element.settings?.containerType || 'div',
    };
  }

  // Map old container types to new structure types
  const containerTypeMap = {
    container: 'div',
    section: 'div',
    hero: 'card',
    nav: 'stack',
    header: 'div',
    footer: 'div',
  };

  const oldContainerType = element.settings?.containerType;
  if (oldContainerType && containerTypeMap[oldContainerType]) {
    migrated.settings.structure.structureType =
      containerTypeMap[oldContainerType];
  }

  // Remove old containerType
  if (migrated.settings.containerType) {
    delete migrated.settings.containerType;
  }

  // Recursively migrate child elements
  if (migrated.elements && Array.isArray(migrated.elements)) {
    migrated.elements = migrated.elements.map((child, index) =>
      migrateElement(child, {
        ...context,
        path: `${context.path || 'element'}.elements[${index}]`,
      })
    );
  }

  return migrated;
}

/**
 * Migrate data binding to new format
 */
function migrateDataBinding(binding) {
  if (typeof binding === 'string') {
    // Old format: simple string path
    return {
      mode: 'direct',
      source: 'page',
      path: binding,
    };
  }

  if (typeof binding === 'object') {
    // Already in object format, just ensure it has mode
    return {
      mode: binding.mode || 'direct',
      source: binding.source || 'page',
      path: binding.path || binding.field,
      ...(binding.transform && { transform: binding.transform }),
    };
  }

  return binding;
}

/**
 * Infer markup type from display element
 */
function inferMarkupType(element) {
  const content = element.data?.content || '';
  const settings = element.settings || {};

  // Check for specific indicators
  if (settings.isButton || settings.action) return 'button';
  if (settings.isLink || settings.href) return 'link';
  if (settings.src || content.includes('<img')) return 'image';
  if (settings.iconName) return 'icon';
  if (settings.isDivider) return 'divider';

  // Check for heading indicators
  if (settings.level || settings.heading) {
    const level = settings.level || settings.heading;
    if (level === 1) return 'title';
    return 'heading';
  }

  // Default to paragraph
  return 'paragraph';
}

/**
 * Migrate entire page structure
 */
function migratePage(page) {
  if (!page || typeof page !== 'object') {
    console.error('Invalid page object');
    return page;
  }

  const migrated = { ...page };

  if (!migrated.zones || !Array.isArray(migrated.zones)) {
    console.error('Page must have zones array');
    return page;
  }

  // Migrate all zones
  migrated.zones = migrated.zones.map((zone, zoneIndex) => {
    const migratedZone = { ...zone };

    if (migratedZone.rows && Array.isArray(migratedZone.rows)) {
      migratedZone.rows = migratedZone.rows.map((row, rowIndex) => {
        const migratedRow = { ...row };

        if (migratedRow.columns && Array.isArray(migratedRow.columns)) {
          migratedRow.columns = migratedRow.columns.map((column, columnIndex) => {
            const migratedColumn = { ...column };

            if (migratedColumn.elements && Array.isArray(migratedColumn.elements)) {
              migratedColumn.elements = migratedColumn.elements.map((element, elementIndex) =>
                migrateElement(element, {
                  path: `zones[${zoneIndex}].rows[${rowIndex}].columns[${columnIndex}].elements[${elementIndex}]`,
                })
              );
            }

            return migratedColumn;
          });
        }

        return migratedRow;
      });
    }

    return migratedZone;
  });

  return migrated;
}

/**
 * Print migration statistics
 */
function printStats() {
  console.log('\n' + '='.repeat(60));
  console.log('Migration Statistics');
  console.log('='.repeat(60));
  console.log(`Total elements processed: ${stats.totalElements}`);
  console.log(`Successfully migrated: ${stats.migrated}`);
  console.log(`Warnings: ${stats.warnings.length}`);
  console.log(`Errors: ${stats.errors.length}`);

  if (stats.warnings.length > 0) {
    console.log('\nWarnings:');
    stats.warnings.forEach((warning, index) => {
      console.log(`  ${index + 1}. ${warning}`);
    });
  }

  if (stats.errors.length > 0) {
    console.log('\nErrors:');
    stats.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
  }

  console.log('='.repeat(60) + '\n');
}

/**
 * Main CLI function
 */
function main() {
  const args = process.argv.slice(2);

  // Show help
  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    console.log(`
Element Migration CLI Tool
Migrates elements from 3-type system to 4-type system

Usage:
  node scripts/migrate-elements.js <input-file> [output-file]
  node scripts/migrate-elements.js --help

Arguments:
  input-file   Path to JSON file containing page data (required)
  output-file  Path to save migrated data (optional, defaults to input-file.migrated.json)

Options:
  --help, -h   Show this help message

Examples:
  node scripts/migrate-elements.js data/page.json
  node scripts/migrate-elements.js data/page.json data/page-new.json
  node scripts/migrate-elements.js data/*.json

3-type system (old):
  - Display: Static content and data display
  - Input: Form fields and user input
  - Structure: Containers and layouts

4-type system (new):
  - Markup: Static content (text, buttons, images, etc.)
  - Field: Form inputs with validation
  - Record: Dynamic data display with bindings
  - Structure: Containers with subtypes (tabs, accordion, etc.)
    `);
    process.exit(0);
  }

  const inputFile = args[0];
  const outputFile = args[1] || inputFile.replace(/\.json$/, '.migrated.json');

  // Validate input file
  if (!fs.existsSync(inputFile)) {
    console.error(`Error: Input file not found: ${inputFile}`);
    process.exit(1);
  }

  console.log(`Reading input file: ${inputFile}`);

  try {
    // Read input file
    const inputData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));

    console.log('Starting migration...\n');

    // Migrate the page
    const migratedData = migratePage(inputData);

    // Write output file
    fs.writeFileSync(outputFile, JSON.stringify(migratedData, null, 2), 'utf8');

    console.log(`\nMigrated data written to: ${outputFile}`);

    // Print statistics
    printStats();

    // Exit with error code if there were errors
    if (stats.errors.length > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error during migration: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run CLI
if (require.main === module) {
  main();
}

// Export for testing
module.exports = {
  migrateElement,
  migratePage,
  migrateDisplayElement,
  migrateInputElement,
  migrateStructureElement,
};
