/**
 * Enterprise Dashboard Template
 *
 * Executive-level analytics dashboard with KPI cards, charts, and insights.
 * Optimized for data visualization and metrics tracking.
 *
 * Layout: Widget grid with flexible card placements
 * Container Width: 1200px (wide)
 */

export default {
  templateId: 'enterprise-dashboard',
  name: 'Enterprise Dashboard',
  description: 'Analytics & KPI tracking with charts, metrics cards, and insights',
  category: 'Analytics',
  icon: '📊',
  thumbnail: '/templates/enterprise-dashboard.png',

  defaultData: {
    dashboardType: 'Executive',
    dateRange: 'Last 30 Days',
    metrics: {
      revenue: 0,
      revenueChange: 0,
      users: 0,
      usersChange: 0,
      conversion: 0,
      conversionChange: 0,
      churn: 0,
      churnChange: 0
    },
    charts: [],
    insights: [],
    topPerformers: [],
    recentActivity: []
  },

  sampleData: {
    dashboardType: 'Executive Dashboard',
    dateRange: 'Last 30 Days',
    metrics: {
      revenue: 2847500,
      revenueChange: 12.5,
      users: 45821,
      usersChange: 8.3,
      conversion: 3.42,
      conversionChange: -1.2,
      churn: 2.1,
      churnChange: -0.5
    },
    charts: [
      {
        id: 'CHART-001',
        type: 'line',
        title: 'Revenue Trend',
        data: [
          { month: 'Jun', value: 2100000 },
          { month: 'Jul', value: 2250000 },
          { month: 'Aug', value: 2400000 },
          { month: 'Sep', value: 2600000 },
          { month: 'Oct', value: 2750000 },
          { month: 'Nov', value: 2847500 }
        ]
      },
      {
        id: 'CHART-002',
        type: 'bar',
        title: 'Users by Segment',
        data: [
          { segment: 'Enterprise', value: 15200 },
          { segment: 'Mid-Market', value: 18900 },
          { segment: 'SMB', value: 11721 }
        ]
      }
    ],
    insights: [
      {
        id: 'INS-001',
        type: 'positive',
        title: 'Revenue Growth Accelerating',
        description: 'Monthly recurring revenue up 12.5% driven by enterprise expansion',
        impact: 'high',
        icon: '📈'
      },
      {
        id: 'INS-002',
        type: 'warning',
        title: 'Conversion Rate Dip',
        description: 'Slight decrease in trial-to-paid conversion requires attention',
        impact: 'medium',
        icon: '⚠️'
      },
      {
        id: 'INS-003',
        type: 'positive',
        title: 'Churn Improvement',
        description: 'Customer retention initiatives showing positive results',
        impact: 'high',
        icon: '✓'
      }
    ],
    topPerformers: [
      {
        id: 'PERF-001',
        name: 'Enterprise Package',
        metric: '$1.2M Revenue',
        change: '+18%',
        rank: 1
      },
      {
        id: 'PERF-002',
        name: 'Mid-Market Plan',
        metric: '$890K Revenue',
        change: '+12%',
        rank: 2
      },
      {
        id: 'PERF-003',
        name: 'Professional Tier',
        metric: '$650K Revenue',
        change: '+9%',
        rank: 3
      }
    ],
    recentActivity: [
      {
        id: 'ACT-001',
        timestamp: '2025-11-21 09:15',
        type: 'Deal Closed',
        description: 'TechCorp Industries - Enterprise License',
        value: '$250,000',
        icon: '🎉'
      },
      {
        id: 'ACT-002',
        timestamp: '2025-11-21 08:45',
        type: 'New User',
        description: '3 new enterprise trial signups',
        icon: '👥'
      },
      {
        id: 'ACT-003',
        timestamp: '2025-11-20 16:30',
        type: 'Milestone',
        description: 'Reached 45,000 active users',
        icon: '🎯'
      }
    ]
  },

  config: {
    layoutPresetId: 'data-record',
    containerWidth: 'wide',  // 1200px

    zones: [
      // Header Zone
      {
        id: 'header',
        type: 'zone',
        visible: true,
        padding: { x: 8, y: 6 },
        elements: [
          {
            id: 'dashboard-icon',
            type: 'page-icon',
            data: {
              icon: '📊',
              editable: true
            },
            settings: {
              size: 'lg'
            }
          },
          {
            id: 'title-1',
            type: 'title',
            data: {
              content: '{{title}}',
              editable: true
            },
            settings: {
              size: '3xl',
              weight: 'bold'
            }
          },
          {
            id: 'description-1',
            type: 'description',
            data: {
              content: '{{dashboardType}} • {{dateRange}}',
              editable: false
            },
            settings: {
              color: 'muted'
            }
          },
          {
            id: 'dashboard-actions',
            type: 'metadata-bar',
            data: {
              items: [
                {
                  label: 'Export',
                  icon: '📥',
                  action: 'export-dashboard'
                },
                {
                  label: 'Share',
                  icon: '🔗',
                  action: 'share-dashboard'
                },
                {
                  label: 'Settings',
                  icon: '⚙️',
                  action: 'dashboard-settings'
                }
              ]
            },
            settings: {
              interactive: true
            }
          }
        ]
      },

      // Body Zone - KPI Cards Row
      {
        id: 'body',
        type: 'zone',
        visible: true,
        padding: { x: 8, y: 8 },
        rows: [
          {
            id: 'kpi-row',
            gap: 4,
            columns: [
              // Revenue KPI
              {
                span: 3,
                elements: [
                  {
                    id: 'revenue-kpi',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      title: 'Revenue',
                      subtitle: '${{metrics.revenue | number}}',
                      description: '{{metrics.revenueChange > 0 ? "+" : ""}}{{metrics.revenueChange}}% vs last month',
                      icon: '💰'
                    },
                    settings: {
                      padding: 'lg',
                      border: true,
                      highlight: 'green'
                    }
                  }
                ]
              },
              // Users KPI
              {
                span: 3,
                elements: [
                  {
                    id: 'users-kpi',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      title: 'Active Users',
                      subtitle: '{{metrics.users | number}}',
                      description: '{{metrics.usersChange > 0 ? "+" : ""}}{{metrics.usersChange}}% vs last month',
                      icon: '👥'
                    },
                    settings: {
                      padding: 'lg',
                      border: true,
                      highlight: 'blue'
                    }
                  }
                ]
              },
              // Conversion KPI
              {
                span: 3,
                elements: [
                  {
                    id: 'conversion-kpi',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      title: 'Conversion Rate',
                      subtitle: '{{metrics.conversion}}%',
                      description: '{{metrics.conversionChange > 0 ? "+" : ""}}{{metrics.conversionChange}}% vs last month',
                      icon: '📈'
                    },
                    settings: {
                      padding: 'lg',
                      border: true,
                      highlight: 'yellow'
                    }
                  }
                ]
              },
              // Churn KPI
              {
                span: 3,
                elements: [
                  {
                    id: 'churn-kpi',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      title: 'Churn Rate',
                      subtitle: '{{metrics.churn}}%',
                      description: '{{metrics.churnChange > 0 ? "+" : ""}}{{metrics.churnChange}}% vs last month',
                      icon: '📉'
                    },
                    settings: {
                      padding: 'lg',
                      border: true,
                      highlight: 'red'
                    }
                  }
                ]
              }
            ]
          },

          // Charts Row
          {
            id: 'charts-row',
            gap: 6,
            marginTop: 'lg',
            columns: [
              {
                span: 8,
                elements: [
                  {
                    id: 'revenue-chart-heading',
                    type: 'heading',
                    data: {
                      content: 'Revenue Trend',
                      level: 3
                    },
                    settings: {
                      marginBottom: 'sm'
                    }
                  },
                  {
                    id: 'revenue-chart',
                    type: 'content-card',
                    data: {
                      variant: 'info',
                      description: 'Monthly recurring revenue over the last 6 months showing consistent growth trajectory.',
                      chartType: 'line',
                      chartData: '{{charts[0].data}}'
                    },
                    settings: {
                      padding: 'lg',
                      minHeight: '300px'
                    }
                  }
                ]
              },
              {
                span: 4,
                elements: [
                  {
                    id: 'insights-heading',
                    type: 'heading',
                    data: {
                      content: 'Key Insights',
                      level: 3
                    },
                    settings: {
                      marginBottom: 'sm'
                    }
                  },
                  {
                    id: 'insight-1',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      title: '{{insights[0].title}}',
                      description: '{{insights[0].description}}',
                      icon: '{{insights[0].icon}}'
                    },
                    settings: {
                      padding: 'md',
                      border: true,
                      borderColor: 'green-200',
                      marginBottom: 'sm'
                    }
                  },
                  {
                    id: 'insight-2',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      title: '{{insights[1].title}}',
                      description: '{{insights[1].description}}',
                      icon: '{{insights[1].icon}}'
                    },
                    settings: {
                      padding: 'md',
                      border: true,
                      borderColor: 'yellow-200',
                      marginBottom: 'sm'
                    }
                  },
                  {
                    id: 'insight-3',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      title: '{{insights[2].title}}',
                      description: '{{insights[2].description}}',
                      icon: '{{insights[2].icon}}'
                    },
                    settings: {
                      padding: 'md',
                      border: true,
                      borderColor: 'green-200'
                    }
                  }
                ]
              }
            ]
          },

          // Performance & Activity Row
          {
            id: 'performance-row',
            gap: 6,
            marginTop: 'lg',
            columns: [
              {
                span: 6,
                elements: [
                  {
                    id: 'performers-heading',
                    type: 'heading',
                    data: {
                      content: 'Top Performers',
                      level: 3
                    },
                    settings: {
                      marginBottom: 'sm'
                    }
                  },
                  {
                    id: 'performers-grid',
                    type: 'data-grid',
                    data: {
                      columns: [
                        {
                          id: 'rank',
                          name: '#',
                          width: '50px'
                        },
                        {
                          id: 'name',
                          name: 'Product'
                        },
                        {
                          id: 'metric',
                          name: 'Revenue',
                          width: '120px'
                        },
                        {
                          id: 'change',
                          name: 'Growth',
                          width: '80px'
                        }
                      ],
                      dataSource: '{{topPerformers}}',
                      sortable: false,
                      striped: true
                    },
                    settings: {
                      maxHeight: '300px'
                    }
                  }
                ]
              },
              {
                span: 6,
                elements: [
                  {
                    id: 'activity-heading',
                    type: 'heading',
                    data: {
                      content: 'Recent Activity',
                      level: 3
                    },
                    settings: {
                      marginBottom: 'sm'
                    }
                  },
                  {
                    id: 'activity-grid',
                    type: 'data-grid',
                    data: {
                      columns: [
                        {
                          id: 'icon',
                          name: '',
                          width: '40px'
                        },
                        {
                          id: 'type',
                          name: 'Event',
                          width: '120px'
                        },
                        {
                          id: 'description',
                          name: 'Details'
                        }
                      ],
                      dataSource: '{{recentActivity}}',
                      sortable: false,
                      striped: true
                    },
                    settings: {
                      maxHeight: '300px'
                    }
                  }
                ]
              }
            ]
          }
        ]
      },

      // Footer Zone
      {
        id: 'footer',
        type: 'zone',
        visible: true,
        padding: { x: 8, y: 4 },
        backgroundColor: 'neutral-50',
        elements: [
          {
            id: 'footer-text',
            type: 'text',
            data: {
              content: 'Last updated: {{updatedAt}} • Auto-refresh every 5 minutes'
            },
            settings: {
              size: 'sm',
              color: 'muted',
              align: 'center'
            }
          }
        ]
      }
    ],

    features: {
      insertMethod: 'both',
      showSlashHint: true,
      allowZoneToggle: true,
      enableDragReorder: true,
      allowColumnResize: true,
      autoRefresh: true,
      refreshInterval: 300000  // 5 minutes
    }
  }
};
