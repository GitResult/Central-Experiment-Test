/**
 * Base Generator
 * Base class for mock data generators
 */

import { faker } from '@faker-js/faker';

export class BaseGenerator {
  constructor(options = {}) {
    this.options = options;
    this.seed = options.seed || null;

    // Set seed for reproducible data
    if (this.seed) {
      faker.seed(this.seed);
    }
  }

  /**
   * Generate a single item
   * Override this method in subclasses
   */
  generateOne() {
    throw new Error('generateOne() must be implemented by subclass');
  }

  /**
   * Generate multiple items
   * @param {number} count - Number of items to generate
   * @returns {Array} Generated items
   */
  generate(count = 10) {
    const items = [];
    for (let i = 0; i < count; i++) {
      items.push(this.generateOne(i));
    }
    return items;
  }

  /**
   * Generate a unique ID
   */
  generateId() {
    return faker.string.uuid();
  }

  /**
   * Generate a timestamp
   */
  generateTimestamp() {
    return faker.date.recent({ days: 30 }).toISOString();
  }

  /**
   * Generate a person name
   */
  generatePersonName() {
    return {
      first: faker.person.firstName(),
      last: faker.person.lastName(),
      full: faker.person.fullName()
    };
  }

  /**
   * Generate an email
   */
  generateEmail() {
    return faker.internet.email();
  }

  /**
   * Generate a phone number
   */
  generatePhone() {
    return faker.phone.number();
  }

  /**
   * Generate an address
   */
  generateAddress() {
    return {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zip: faker.location.zipCode(),
      country: faker.location.country()
    };
  }

  /**
   * Generate a company name
   */
  generateCompany() {
    return faker.company.name();
  }

  /**
   * Generate a status
   */
  generateStatus(statuses = ['active', 'inactive', 'pending']) {
    return faker.helpers.arrayElement(statuses);
  }

  /**
   * Generate a priority
   */
  generatePriority(priorities = ['low', 'medium', 'high']) {
    return faker.helpers.arrayElement(priorities);
  }

  /**
   * Generate a random boolean
   */
  generateBoolean(probability = 0.5) {
    return faker.datatype.boolean(probability);
  }

  /**
   * Generate a random number
   */
  generateNumber(min = 0, max = 100) {
    return faker.number.int({ min, max });
  }

  /**
   * Generate a random amount (money)
   */
  generateAmount(min = 0, max = 10000) {
    return faker.number.float({ min, max, precision: 0.01 });
  }

  /**
   * Generate random text
   */
  generateText(sentences = 3) {
    return faker.lorem.sentences(sentences);
  }

  /**
   * Generate a random date
   */
  generateDate(daysAgo = 30) {
    return faker.date.recent({ days: daysAgo });
  }

  /**
   * Pick random item from array
   */
  pickRandom(array) {
    return faker.helpers.arrayElement(array);
  }

  /**
   * Pick multiple random items from array
   */
  pickRandomMultiple(array, count = 1) {
    return faker.helpers.arrayElements(array, count);
  }
}

export default BaseGenerator;
