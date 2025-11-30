/**
 * Record Generator
 * Generate generic record/form data
 */

import { faker } from '@faker-js/faker';
import { BaseGenerator } from './baseGenerator';

export class RecordGenerator extends BaseGenerator {
  constructor(schema, options = {}) {
    super(options);
    this.schema = schema;
  }

  generateOne() {
    const record = {
      id: this.generateId(),
      createdAt: this.generateDate(90).toISOString(),
      updatedAt: this.generateDate(7).toISOString()
    };

    // Generate fields based on schema
    if (this.schema?.fields) {
      this.schema.fields.forEach(field => {
        record[field.name] = this.generateFieldValue(field);
      });
    }

    return record;
  }

  generateFieldValue(field) {
    const { type, options = {} } = field;

    switch (type) {
      case 'text':
      case 'string':
        return options.multiline ? this.generateText(2) : faker.lorem.words(3);

      case 'number':
      case 'integer':
        return this.generateNumber(options.min || 0, options.max || 1000);

      case 'email':
        return this.generateEmail();

      case 'phone':
        return this.generatePhone();

      case 'date':
        return this.generateDate(options.daysAgo || 30).toISOString();

      case 'boolean':
        return this.generateBoolean(options.probability || 0.5);

      case 'select':
      case 'dropdown':
        return this.pickRandom(options.choices || ['Option 1', 'Option 2', 'Option 3']);

      case 'multiselect':
        return this.pickRandomMultiple(
          options.choices || ['Option 1', 'Option 2', 'Option 3'],
          this.generateNumber(1, 3)
        );

      case 'url':
        return faker.internet.url();

      case 'color':
        return faker.internet.color();

      case 'currency':
      case 'money':
        return this.generateAmount(options.min || 0, options.max || 10000);

      case 'percentage':
        return this.generateNumber(0, 100);

      default:
        return faker.lorem.word();
    }
  }
}

export default RecordGenerator;
