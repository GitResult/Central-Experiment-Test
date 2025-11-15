import React from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const ContactListChart = ({ contacts, stats }) => {
  // Data for Status Distribution (Pie Chart)
  const statusData = [
    { name: 'Active', value: stats.active, color: '#10b981' },
    { name: 'Inactive', value: stats.inactive, color: '#f59e0b' },
    { name: 'Expired', value: stats.expired, color: '#ef4444' },
  ];

  // Data for Type Distribution (Pie Chart)
  const typeDistribution = contacts.reduce((acc, contact) => {
    acc[contact.type] = (acc[contact.type] || 0) + 1;
    return acc;
  }, {});

  const typeData = Object.entries(typeDistribution).map(([name, value]) => ({
    name,
    value,
  }));

  const typeColors = {
    'MEMBER': '#3b82f6',
    'STUDENT': '#8b5cf6',
    'PROFESSIONAL': '#ec4899',
  };

  // Data for Revenue by Type (Bar Chart)
  const revenueByType = contacts.reduce((acc, contact) => {
    if (!acc[contact.type]) {
      acc[contact.type] = { type: contact.type, revenue: 0, count: 0 };
    }
    acc[contact.type].revenue += contact.revenue;
    acc[contact.type].count += 1;
    return acc;
  }, {});

  const revenueData = Object.values(revenueByType).map(item => ({
    type: item.type,
    revenue: item.revenue,
    avgRevenue: Math.round(item.revenue / item.count),
  }));

  // Data for Engagement Distribution (Bar Chart)
  const engagementRanges = {
    '0-20': 0,
    '21-40': 0,
    '41-60': 0,
    '61-80': 0,
    '81-100': 0,
  };

  contacts.forEach(contact => {
    if (contact.engagement <= 20) engagementRanges['0-20']++;
    else if (contact.engagement <= 40) engagementRanges['21-40']++;
    else if (contact.engagement <= 60) engagementRanges['41-60']++;
    else if (contact.engagement <= 80) engagementRanges['61-80']++;
    else engagementRanges['81-100']++;
  });

  const engagementData = Object.entries(engagementRanges).map(([range, count]) => ({
    range,
    count,
  }));

  // Monthly Join Trend (Line Chart)
  const monthlyJoins = contacts.reduce((acc, contact) => {
    const month = contact.joinDate.substring(0, 7); // YYYY-MM
    acc[month] = (acc[month] || 0) + 1;
    return acc;
  }, {});

  const trendData = Object.entries(monthlyJoins)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12) // Last 12 months
    .map(([month, count]) => ({
      month: month,
      joins: count,
    }));

  return (
    <div className="charts-container">
      <div className="chart-grid">
        {/* Status Distribution */}
        <div className="chart-card">
          <h3>Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Type Distribution */}
        <div className="chart-card">
          <h3>Contact Type Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={typeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {typeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={typeColors[entry.name] || '#94a3b8'} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Type */}
        <div className="chart-card">
          <h3>Revenue by Contact Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" name="Total Revenue" />
              <Bar dataKey="avgRevenue" fill="#8b5cf6" name="Avg Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Distribution */}
        <div className="chart-card">
          <h3>Engagement Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={engagementData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10b981" name="Number of Contacts" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Join Trend */}
        <div className="chart-card chart-wide">
          <h3>Monthly Join Trend (Last 12 Months)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="joins"
                stroke="#ec4899"
                strokeWidth={2}
                name="New Contacts"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ContactListChart;
