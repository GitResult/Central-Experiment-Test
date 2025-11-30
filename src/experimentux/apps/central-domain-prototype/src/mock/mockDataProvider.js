/**
 * Mock Data Provider
 * Unified interface for accessing mock data
 */

import { UserGenerator } from './generators/userGenerator';
import { ProjectGenerator } from './generators/projectGenerator';
import { RecordGenerator } from './generators/recordGenerator';

class MockDataProvider {
  constructor() {
    this.generators = {
      user: new UserGenerator(),
      project: new ProjectGenerator()
    };

    this.cache = {};
    this.cacheEnabled = true;
  }

  /**
   * Get mock data for a type
   * @param {string} type - Data type (user, project, etc.)
   * @param {number} count - Number of items
   * @param {boolean} useCache - Whether to use cached data
   * @returns {Array} Mock data
   */
  get(type, count = 10, useCache = true) {
    const cacheKey = `${type}-${count}`;

    // Return cached data if available
    if (useCache && this.cacheEnabled && this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    // Generate new data
    const generator = this.generators[type];

    if (!generator) {
      console.warn(`No generator found for type: ${type}`);
      return [];
    }

    const data = generator.generate(count);

    // Cache data
    if (this.cacheEnabled) {
      this.cache[cacheKey] = data;
    }

    return data;
  }

  /**
   * Get users
   */
  getUsers(count = 10, useCache = true) {
    return this.get('user', count, useCache);
  }

  /**
   * Get projects
   */
  getProjects(count = 10, useCache = true) {
    return this.get('project', count, useCache);
  }

  /**
   * Get records based on schema
   */
  getRecords(schema, count = 10) {
    const generator = new RecordGenerator(schema);
    return generator.generate(count);
  }

  /**
   * Register a custom generator
   */
  registerGenerator(type, generator) {
    this.generators[type] = generator;
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {};
  }

  /**
   * Enable/disable caching
   */
  setCacheEnabled(enabled) {
    this.cacheEnabled = enabled;
  }

  /**
   * Generate single item
   */
  getOne(type) {
    const generator = this.generators[type];

    if (!generator) {
      console.warn(`No generator found for type: ${type}`);
      return null;
    }

    return generator.generateOne(0);
  }

  /**
   * Seed the generators for reproducible data
   */
  setSeed(seed) {
    Object.values(this.generators).forEach(generator => {
      if (generator.seed !== undefined) {
        generator.seed = seed;
      }
    });
    this.clearCache();
  }
}

// Singleton instance
export const mockDataProvider = new MockDataProvider();

export default mockDataProvider;
