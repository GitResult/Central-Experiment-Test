/**
 * Data View Service
 *
 * Handles fetching Central views and fields for widget data binding
 * Currently uses mock data, to be replaced with real Central API calls
 */

// Mock data views (simulating Central's data views)
const mockDataViews = [
  {
    id: 'view-revenue-trend',
    name: 'Revenue Trend',
    description: 'Monthly revenue by region',
    type: 'chart',
    module: 'Finance',
    lastUpdated: new Date(Date.now() - 7200000).toISOString(),
    fields: ['month', 'region', 'revenue']
  },
  {
    id: 'view-customer-growth',
    name: 'Customer Growth',
    description: 'Customer acquisition over time',
    type: 'chart',
    module: 'CRM',
    lastUpdated: new Date(Date.now() - 18000000).toISOString(),
    fields: ['month', 'customers', 'churn']
  },
  {
    id: 'view-sales-pipeline',
    name: 'Sales Pipeline',
    description: 'All open deals with close dates',
    type: 'table',
    module: 'CRM',
    lastUpdated: new Date(Date.now() - 1800000).toISOString(),
    fields: ['deal_name', 'amount', 'close_date', 'probability']
  },
  {
    id: 'metric-total-revenue',
    name: 'Total Revenue',
    description: 'Sum of all closed deals',
    type: 'metric',
    module: 'Finance',
    lastUpdated: new Date(Date.now() - 3600000).toISOString(),
    formula: 'SUM(deals.amount)'
  },
  {
    id: 'view-inventory-levels',
    name: 'Inventory Levels',
    description: 'Current stock by product category',
    type: 'table',
    module: 'Inventory',
    lastUpdated: new Date(Date.now() - 900000).toISOString(),
    fields: ['category', 'product', 'quantity', 'reorder_point']
  },
  {
    id: 'metric-customer-count',
    name: 'Total Customers',
    description: 'Count of active customers',
    type: 'metric',
    module: 'CRM',
    lastUpdated: new Date(Date.now() - 1200000).toISOString(),
    formula: 'COUNT(customers.id)'
  }
];

/**
 * List all available data views
 *
 * @param {Object} options - Filter options
 * @param {string} options.type - Filter by type: 'chart', 'table', 'metric'
 * @param {string} options.module - Filter by module: 'CRM', 'Finance', 'Inventory', etc.
 * @param {string} options.search - Search query
 * @returns {Promise<Array>} Array of data view objects
 */
export const listViews = async (options = {}) => {
  await new Promise(resolve => setTimeout(resolve, 200));

  let views = [...mockDataViews];

  // Filter by type
  if (options.type) {
    views = views.filter(view => view.type === options.type);
  }

  // Filter by module
  if (options.module) {
    views = views.filter(view => view.module === options.module);
  }

  // Search
  if (options.search) {
    const query = options.search.toLowerCase();
    views = views.filter(view =>
      view.name.toLowerCase().includes(query) ||
      view.description.toLowerCase().includes(query)
    );
  }

  return views;
};

/**
 * Get a specific data view by ID
 *
 * @param {string} viewId - View ID
 * @returns {Promise<Object>} Data view object
 */
export const getView = async (viewId) => {
  await new Promise(resolve => setTimeout(resolve, 100));

  const view = mockDataViews.find(v => v.id === viewId);
  if (!view) {
    throw new Error(`Data view not found: ${viewId}`);
  }

  return { ...view };
};

/**
 * Fetch data for a specific view (for widget rendering)
 *
 * @param {string} viewId - View ID
 * @param {Object} options - Query options (filters, sorting, etc.)
 * @returns {Promise<Object>} Data result with rows and metadata
 */
export const fetchViewData = async (viewId, options = {}) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const view = mockDataViews.find(v => v.id === viewId);
  if (!view) {
    throw new Error(`Data view not found: ${viewId}`);
  }

  // Mock data based on view type
  let data;
  let metadata;

  switch (view.type) {
    case 'chart':
      if (viewId === 'view-revenue-trend') {
        data = [
          { month: 'Jan', region: 'NA', revenue: 120000 },
          { month: 'Feb', region: 'NA', revenue: 135000 },
          { month: 'Mar', region: 'NA', revenue: 142000 },
          { month: 'Jan', region: 'EMEA', revenue: 95000 },
          { month: 'Feb', region: 'EMEA', revenue: 108000 },
          { month: 'Mar', region: 'EMEA', revenue: 125000 }
        ];
      } else {
        data = [
          { month: 'Jan', customers: 1200 },
          { month: 'Feb', customers: 1350 },
          { month: 'Mar', customers: 1480 }
        ];
      }
      metadata = {
        rowCount: data.length,
        lastUpdated: view.lastUpdated,
        cached: true
      };
      break;

    case 'table':
      if (viewId === 'view-sales-pipeline') {
        data = [
          { deal_name: 'Acme Corp', amount: 125000, close_date: '2024-12-15', probability: 75 },
          { deal_name: 'TechStart Inc', amount: 85000, close_date: '2024-11-30', probability: 60 },
          { deal_name: 'Global Industries', amount: 240000, close_date: '2025-01-10', probability: 85 }
        ];
      } else {
        data = [
          { category: 'Electronics', product: 'Laptop', quantity: 45, reorder_point: 20 },
          { category: 'Electronics', product: 'Monitor', quantity: 12, reorder_point: 15 },
          { category: 'Furniture', product: 'Desk', quantity: 8, reorder_point: 10 }
        ];
      }
      metadata = {
        rowCount: data.length,
        lastUpdated: view.lastUpdated,
        cached: true
      };
      break;

    case 'metric':
      if (viewId === 'metric-total-revenue') {
        data = 12500000; // $12.5M
      } else {
        data = 1480; // 1,480 customers
      }
      metadata = {
        lastUpdated: view.lastUpdated,
        cached: true,
        formula: view.formula
      };
      break;

    default:
      data = [];
      metadata = {};
  }

  return {
    data,
    metadata
  };
};

export const dataViewService = {
  listViews,
  getView,
  fetchViewData
};
