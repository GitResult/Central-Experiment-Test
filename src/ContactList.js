import React, { useState, useMemo } from 'react';
import { Filter, Search, Download, Users, Mail, Phone, Calendar, TrendingUp } from 'lucide-react';
import ContactListChart from './ContactListChart';
import './ContactList.css';

const ContactList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [showCharts, setShowCharts] = useState(false);
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  // Sample contact data with comprehensive fields
  const [contacts] = useState([
    { id: 1, name: 'Jennifer Walsh', email: 'jennifer.walsh@email.com', phone: '555-0123', type: 'MEMBER', status: 'Active', joinDate: '2022-03-15', engagement: 82, revenue: 250 },
    { id: 2, name: 'Marcus Chen', email: 'marcus.chen@email.com', phone: '555-0124', type: 'STUDENT', status: 'Active', joinDate: '2024-01-20', engagement: 45, revenue: 75 },
    { id: 3, name: 'Sarah Kim', email: 'sarah.kim@email.com', phone: '555-0125', type: 'MEMBER', status: 'Expired', joinDate: '2019-06-10', engagement: 28, revenue: 0 },
    { id: 4, name: 'David Rodriguez', email: 'david.r@email.com', phone: '555-0126', type: 'PROFESSIONAL', status: 'Active', joinDate: '2021-08-05', engagement: 95, revenue: 500 },
    { id: 5, name: 'Emily Johnson', email: 'emily.j@email.com', phone: '555-0127', type: 'MEMBER', status: 'Active', joinDate: '2023-02-14', engagement: 67, revenue: 250 },
    { id: 6, name: 'Michael Brown', email: 'michael.b@email.com', phone: '555-0128', type: 'PROFESSIONAL', status: 'Inactive', joinDate: '2020-11-30', engagement: 12, revenue: 0 },
    { id: 7, name: 'Lisa Anderson', email: 'lisa.a@email.com', phone: '555-0129', type: 'MEMBER', status: 'Active', joinDate: '2022-09-22', engagement: 73, revenue: 250 },
    { id: 8, name: 'James Wilson', email: 'james.w@email.com', phone: '555-0130', type: 'STUDENT', status: 'Active', joinDate: '2024-03-10', engagement: 52, revenue: 75 },
    { id: 9, name: 'Patricia Martinez', email: 'patricia.m@email.com', phone: '555-0131', type: 'PROFESSIONAL', status: 'Active', joinDate: '2021-05-18', engagement: 88, revenue: 500 },
    { id: 10, name: 'Robert Taylor', email: 'robert.t@email.com', phone: '555-0132', type: 'MEMBER', status: 'Expired', joinDate: '2019-12-01', engagement: 15, revenue: 0 },
  ]);

  // Filtered and sorted contacts
  const filteredContacts = useMemo(() => {
    let result = contacts.filter(contact => {
      const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          contact.phone.includes(searchTerm);
      const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
      const matchesType = filterType === 'all' || contact.type === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });

    // Sort results
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [contacts, searchTerm, filterStatus, filterType, sortField, sortOrder]);

  // Statistics
  const stats = useMemo(() => {
    const activeCount = contacts.filter(c => c.status === 'Active').length;
    const totalRevenue = contacts.reduce((sum, c) => sum + c.revenue, 0);
    const avgEngagement = contacts.reduce((sum, c) => sum + c.engagement, 0) / contacts.length;

    return {
      total: contacts.length,
      active: activeCount,
      inactive: contacts.filter(c => c.status === 'Inactive').length,
      expired: contacts.filter(c => c.status === 'Expired').length,
      totalRevenue,
      avgEngagement: avgEngagement.toFixed(1),
    };
  }, [contacts]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Type', 'Status', 'Join Date', 'Engagement', 'Revenue'];
    const csvContent = [
      headers.join(','),
      ...filteredContacts.map(contact =>
        [contact.name, contact.email, contact.phone, contact.type, contact.status, contact.joinDate, contact.engagement, contact.revenue].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.csv';
    a.click();
  };

  return (
    <div className="contact-list-container">
      {/* Header */}
      <div className="contact-header">
        <div className="header-title">
          <Users className="header-icon" />
          <h1>Contact List</h1>
        </div>
        <button
          className="btn-chart-toggle"
          onClick={() => setShowCharts(!showCharts)}
        >
          <TrendingUp size={18} />
          {showCharts ? 'Hide Charts' : 'Show Charts'}
        </button>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Total Contacts</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card stat-active">
          <div className="stat-label">Active</div>
          <div className="stat-value">{stats.active}</div>
        </div>
        <div className="stat-card stat-inactive">
          <div className="stat-label">Inactive</div>
          <div className="stat-value">{stats.inactive}</div>
        </div>
        <div className="stat-card stat-expired">
          <div className="stat-label">Expired</div>
          <div className="stat-value">{stats.expired}</div>
        </div>
        <div className="stat-card stat-revenue">
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${stats.totalRevenue}</div>
        </div>
        <div className="stat-card stat-engagement">
          <div className="stat-label">Avg Engagement</div>
          <div className="stat-value">{stats.avgEngagement}%</div>
        </div>
      </div>

      {/* Charts Section */}
      {showCharts && (
        <ContactListChart contacts={filteredContacts} stats={stats} />
      )}

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <Filter size={18} />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="Expired">Expired</option>
          </select>

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="MEMBER">Member</option>
            <option value="STUDENT">Student</option>
            <option value="PROFESSIONAL">Professional</option>
          </select>

          <button className="btn-export" onClick={exportToCSV}>
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-info">
        Showing {filteredContacts.length} of {contacts.length} contacts
      </div>

      {/* Contact Table */}
      <div className="contact-table-wrapper">
        <table className="contact-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className="sortable">
                Name {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('email')} className="sortable">
                Email {sortField === 'email' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('phone')} className="sortable">
                Phone {sortField === 'phone' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('type')} className="sortable">
                Type {sortField === 'type' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('status')} className="sortable">
                Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('joinDate')} className="sortable">
                Join Date {sortField === 'joinDate' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('engagement')} className="sortable">
                Engagement {sortField === 'engagement' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
              <th onClick={() => handleSort('revenue')} className="sortable">
                Revenue {sortField === 'revenue' && (sortOrder === 'asc' ? '↑' : '↓')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(contact => (
              <tr key={contact.id}>
                <td className="contact-name">
                  <div className="name-cell">
                    <div className="avatar">{contact.name.charAt(0)}</div>
                    {contact.name}
                  </div>
                </td>
                <td>
                  <div className="email-cell">
                    <Mail size={14} />
                    {contact.email}
                  </div>
                </td>
                <td>
                  <div className="phone-cell">
                    <Phone size={14} />
                    {contact.phone}
                  </div>
                </td>
                <td>
                  <span className={`badge badge-${contact.type.toLowerCase()}`}>
                    {contact.type}
                  </span>
                </td>
                <td>
                  <span className={`status-badge status-${contact.status.toLowerCase()}`}>
                    {contact.status}
                  </span>
                </td>
                <td>
                  <div className="date-cell">
                    <Calendar size={14} />
                    {contact.joinDate}
                  </div>
                </td>
                <td>
                  <div className="engagement-cell">
                    <div className="engagement-bar">
                      <div
                        className="engagement-fill"
                        style={{ width: `${contact.engagement}%` }}
                      />
                    </div>
                    <span>{contact.engagement}%</span>
                  </div>
                </td>
                <td className="revenue-cell">${contact.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredContacts.length === 0 && (
        <div className="no-results">
          <Users size={48} />
          <p>No contacts found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ContactList;
