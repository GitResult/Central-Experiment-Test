/**
 * User Fixtures
 * Pre-defined user data for testing
 */

export const userFixtures = [
  {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
    role: 'admin',
    department: 'Engineering',
    status: 'active',
    joinedAt: '2023-01-15T00:00:00Z',
    lastActive: '2024-11-23T10:30:00Z',
    isOnline: true
  },
  {
    id: 'user-2',
    firstName: 'Jane',
    lastName: 'Smith',
    fullName: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane',
    role: 'editor',
    department: 'Product',
    status: 'active',
    joinedAt: '2023-03-20T00:00:00Z',
    lastActive: '2024-11-23T09:15:00Z',
    isOnline: true
  },
  {
    id: 'user-3',
    firstName: 'Bob',
    lastName: 'Johnson',
    fullName: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    phone: '+1 (555) 345-6789',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    role: 'viewer',
    department: 'Design',
    status: 'away',
    joinedAt: '2023-06-10T00:00:00Z',
    lastActive: '2024-11-22T16:45:00Z',
    isOnline: false
  }
];

export default userFixtures;
