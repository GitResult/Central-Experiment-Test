/**
 * Project Generator
 * Generate mock project data
 */

import { faker } from '@faker-js/faker';
import { BaseGenerator } from './baseGenerator';

export class ProjectGenerator extends BaseGenerator {
  generateOne() {
    const statuses = ['planning', 'in-progress', 'on-hold', 'completed', 'cancelled'];
    const priorities = ['low', 'medium', 'high', 'critical'];

    return {
      id: this.generateId(),
      name: faker.company.catchPhrase(),
      description: this.generateText(2),
      status: this.pickRandom(statuses),
      priority: this.pickRandom(priorities),
      startDate: this.generateDate(90).toISOString(),
      endDate: faker.date.future().toISOString(),
      budget: this.generateAmount(10000, 500000),
      completion: this.generateNumber(0, 100),
      teamSize: this.generateNumber(2, 15),
      owner: this.generatePersonName().full,
      tags: this.pickRandomMultiple(
        ['frontend', 'backend', 'mobile', 'infrastructure', 'design', 'research'],
        this.generateNumber(1, 3)
      ),
      createdAt: this.generateDate(180).toISOString(),
      updatedAt: this.generateDate(7).toISOString()
    };
  }
}

export default ProjectGenerator;
