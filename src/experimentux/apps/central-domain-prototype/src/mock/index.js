/**
 * Mock Data System
 * Central export for all mock data functionality
 */

// Provider
export { default as mockDataProvider } from './mockDataProvider';

// Generators
export { BaseGenerator } from './generators/baseGenerator';
export { UserGenerator } from './generators/userGenerator';
export { ProjectGenerator } from './generators/projectGenerator';
export { RecordGenerator } from './generators/recordGenerator';

// Fixtures
export { userFixtures } from './fixtures/users';
export { projectFixtures } from './fixtures/projects';
