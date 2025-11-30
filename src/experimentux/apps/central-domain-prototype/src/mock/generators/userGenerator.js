/**
 * User Generator
 * Generate mock user data
 */

import { BaseGenerator } from './baseGenerator';

export class UserGenerator extends BaseGenerator {
  generateOne(index) {
    const name = this.generatePersonName();
    const roles = ['admin', 'editor', 'viewer'];
    const departments = ['Engineering', 'Product', 'Design', 'Marketing', 'Sales', 'Support'];

    return {
      id: this.generateId(),
      firstName: name.first,
      lastName: name.last,
      fullName: name.full,
      email: this.generateEmail(),
      phone: this.generatePhone(),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${index}`,
      role: this.pickRandom(roles),
      department: this.pickRandom(departments),
      status: this.generateStatus(['active', 'inactive', 'away']),
      joinedAt: this.generateDate(365).toISOString(),
      lastActive: this.generateDate(7).toISOString(),
      isOnline: this.generateBoolean(0.3)
    };
  }
}

export default UserGenerator;
