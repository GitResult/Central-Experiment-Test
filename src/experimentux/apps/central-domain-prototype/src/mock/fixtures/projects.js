/**
 * Project Fixtures
 * Pre-defined project data for testing
 */

export const projectFixtures = [
  {
    id: 'project-1',
    name: 'Website Redesign',
    description: 'Complete overhaul of company website with modern design and improved UX',
    status: 'in-progress',
    priority: 'high',
    startDate: '2024-09-01T00:00:00Z',
    endDate: '2024-12-31T00:00:00Z',
    budget: 150000,
    completion: 65,
    teamSize: 8,
    owner: 'Jane Smith',
    tags: ['frontend', 'design', 'marketing'],
    createdAt: '2024-08-15T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z'
  },
  {
    id: 'project-2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms',
    status: 'planning',
    priority: 'critical',
    startDate: '2025-01-15T00:00:00Z',
    endDate: '2025-06-30T00:00:00Z',
    budget: 300000,
    completion: 15,
    teamSize: 12,
    owner: 'John Doe',
    tags: ['mobile', 'backend', 'infrastructure'],
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-22T00:00:00Z'
  },
  {
    id: 'project-3',
    name: 'API Integration',
    description: 'Integrate third-party APIs for enhanced functionality',
    status: 'completed',
    priority: 'medium',
    startDate: '2024-06-01T00:00:00Z',
    endDate: '2024-09-30T00:00:00Z',
    budget: 75000,
    completion: 100,
    teamSize: 4,
    owner: 'Bob Johnson',
    tags: ['backend', 'infrastructure'],
    createdAt: '2024-05-15T00:00:00Z',
    updatedAt: '2024-10-01T00:00:00Z'
  }
];

export default projectFixtures;
