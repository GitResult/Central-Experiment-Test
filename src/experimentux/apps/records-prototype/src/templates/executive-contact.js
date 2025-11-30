/**
 * Executive Contact Template
 *
 * Professional CRM contact management with deal pipeline and activity timeline.
 * Optimized for B2B sales teams tracking high-value relationships.
 *
 * Layout: 3-column hybrid (Profile | Timeline | Deals)
 * Container Width: 1200px (wide)
 */

export default {
  templateId: 'executive-contact',
  name: 'Executive Contact',
  description: 'Professional CRM contact with deal pipeline and activity timeline',
  category: 'CRM',
  icon: '👤',
  thumbnail: '/templates/executive-contact.png',

  // Default data structure for this template
  defaultData: {
    avatar: null,
    email: '',
    phone: '',
    company: '',
    position: '',
    lifecycleStage: 'Lead',
    engagementScore: 0,
    lastContactDate: null,
    deals: [],
    tasks: [],
    timeline: [],
    tags: []
  },

  // Sample data for demonstration
  sampleData: {
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    email: 'sarah.chen@techcorp.com',
    phone: '(555) 123-4567',
    company: 'TechCorp Industries',
    position: 'Senior Director, Engineering',
    lifecycleStage: 'Customer',
    engagementScore: 87,
    lastContactDate: '2025-11-15',
    deals: [
      {
        id: 'DEAL-001',
        name: 'Enterprise License Upgrade',
        amount: 250000,
        stage: 'Negotiation',
        probability: 75,
        closeDate: '2025-12-15'
      },
      {
        id: 'DEAL-002',
        name: 'Q1 Expansion Package',
        amount: 150000,
        stage: 'Proposal',
        probability: 60,
        closeDate: '2026-01-30'
      },
      {
        id: 'DEAL-003',
        name: 'Consulting Services',
        amount: 85000,
        stage: 'Qualified',
        probability: 40,
        closeDate: '2026-02-28'
      }
    ],
    tasks: [
      {
        id: 'TASK-001',
        title: 'Follow up on enterprise license terms',
        dueDate: '2025-11-25',
        priority: 'High',
        status: 'In Progress'
      },
      {
        id: 'TASK-002',
        title: 'Schedule Q1 planning meeting',
        dueDate: '2025-11-28',
        priority: 'Medium',
        status: 'Not Started'
      },
      {
        id: 'TASK-003',
        title: 'Send technical documentation',
        dueDate: '2025-12-01',
        priority: 'Low',
        status: 'Not Started'
      }
    ],
    timeline: [
      {
        id: 'TL-001',
        date: '2025-11-15',
        time: '2:30 PM',
        type: 'Email',
        description: 'Sent enterprise license proposal with custom pricing',
        icon: '📧'
      },
      {
        id: 'TL-002',
        date: '2025-11-12',
        time: '10:00 AM',
        type: 'Call',
        description: 'Discovery call - discussed Q1 expansion plans and budget',
        icon: '📞'
      },
      {
        id: 'TL-003',
        date: '2025-11-08',
        time: '3:00 PM',
        type: 'Meeting',
        description: 'In-person kickoff meeting with engineering team',
        icon: '🤝'
      },
      {
        id: 'TL-004',
        date: '2025-11-01',
        time: '9:15 AM',
        type: 'Email',
        description: 'Initial outreach - introduction and value proposition',
        icon: '📧'
      }
    ],
    tags: ['Enterprise', 'Technology', 'Decision Maker']
  },

  // UniversalPage configuration
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
            id: 'breadcrumb-1',
            type: 'breadcrumb',
            data: {
              items: [
                { label: 'Contacts', href: '/contacts' },
                { label: '{{title}}', current: true }
              ]
            },
            settings: {}
          },
          {
            id: 'page-icon-1',
            type: 'page-icon',
            data: {
              icon: '👤',
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
              content: '{{position}} at {{company}}',
              editable: false
            },
            settings: {
              color: 'muted'
            }
          },
          {
            id: 'metadata-1',
            type: 'metadata-bar',
            data: {
              items: [
                {
                  label: 'Stage',
                  value: '{{lifecycleStage}}',
                  color: 'blue',
                  icon: '🎯'
                },
                {
                  label: 'Engagement Score',
                  value: '{{engagementScore}}',
                  color: 'green',
                  icon: '📊'
                },
                {
                  label: 'Last Contact',
                  value: '{{lastContactDate}}',
                  icon: '📅'
                }
              ]
            },
            settings: {}
          }
        ]
      },

      // Body Zone - 3 Column Layout
      {
        id: 'body',
        type: 'zone',
        visible: true,
        padding: { x: 8, y: 8 },
        rows: [
          {
            id: 'main-row',
            gap: 6,
            columns: [
              // Column 1: Profile & Contact Info (33%)
              {
                span: 4,
                elements: [
                  {
                    id: 'profile-card',
                    type: 'content-card',
                    data: {
                      variant: 'info',
                      title: 'Contact Information',
                      icon: '📇',
                      fields: [
                        {
                          label: 'Email',
                          value: '{{email}}',
                          icon: '📧',
                          link: true,
                          linkType: 'email'
                        },
                        {
                          label: 'Phone',
                          value: '{{phone}}',
                          icon: '📱',
                          link: true,
                          linkType: 'tel'
                        },
                        {
                          label: 'Company',
                          value: '{{company}}',
                          icon: '🏢'
                        },
                        {
                          label: 'Position',
                          value: '{{position}}',
                          icon: '💼'
                        }
                      ]
                    },
                    settings: {
                      padding: 'lg',
                      shadow: 'sm'
                    }
                  },
                  {
                    id: 'quick-actions',
                    type: 'button',
                    data: {
                      label: 'Schedule Meeting',
                      icon: '📅',
                      action: 'schedule-meeting'
                    },
                    settings: {
                      variant: 'primary',
                      size: 'lg',
                      fullWidth: true
                    }
                  },
                  {
                    id: 'secondary-action',
                    type: 'button',
                    data: {
                      label: 'Send Email',
                      icon: '✉️',
                      action: 'send-email'
                    },
                    settings: {
                      variant: 'outline',
                      size: 'lg',
                      fullWidth: true
                    }
                  }
                ]
              },

              // Column 2: Activity Timeline (33%)
              {
                span: 4,
                elements: [
                  {
                    id: 'timeline-section',
                    type: 'heading',
                    data: {
                      content: 'Activity Timeline',
                      level: 3
                    },
                    settings: {
                      marginBottom: 'sm'
                    }
                  },
                  {
                    id: 'timeline-grid',
                    type: 'data-grid',
                    data: {
                      columns: [
                        {
                          id: 'date',
                          name: 'Date',
                          width: '80px',
                          format: 'date-short'
                        },
                        {
                          id: 'type',
                          name: 'Type',
                          width: '80px'
                        },
                        {
                          id: 'description',
                          name: 'Activity'
                        }
                      ],
                      dataSource: '{{timeline}}',
                      sortable: true,
                      sortBy: 'date',
                      sortDirection: 'desc',
                      rowsPerPage: 10,
                      emptyState: 'No activity recorded yet'
                    },
                    settings: {
                      maxHeight: '500px',
                      striped: true
                    }
                  }
                ]
              },

              // Column 3: Deals & Tasks (33%)
              {
                span: 4,
                elements: [
                  {
                    id: 'deals-section',
                    type: 'heading',
                    data: {
                      content: 'Active Deals',
                      level: 3
                    },
                    settings: {
                      marginBottom: 'sm'
                    }
                  },
                  {
                    id: 'deals-grid',
                    type: 'data-grid',
                    data: {
                      columns: [
                        {
                          id: 'name',
                          name: 'Deal'
                        },
                        {
                          id: 'amount',
                          name: 'Value',
                          width: '100px',
                          format: 'currency'
                        },
                        {
                          id: 'stage',
                          name: 'Stage',
                          width: '120px'
                        }
                      ],
                      dataSource: '{{deals}}',
                      sortable: true,
                      emptyState: 'No active deals'
                    },
                    settings: {
                      maxHeight: '250px',
                      hover: true
                    }
                  },
                  {
                    id: 'tasks-section',
                    type: 'heading',
                    data: {
                      content: 'Upcoming Tasks',
                      level: 3
                    },
                    settings: {
                      marginTop: 'lg',
                      marginBottom: 'sm'
                    }
                  },
                  {
                    id: 'tasks-summary',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      title: 'Task Summary',
                      description: '{{tasks.length}} tasks pending',
                      icon: '✓',
                      actionLabel: 'View All Tasks',
                      actionLink: '/tasks'
                    },
                    settings: {
                      padding: 'md',
                      border: true
                    }
                  }
                ]
              }
            ]
          }
        ]
      },

      // Footer Zone (optional, hidden by default)
      {
        id: 'footer',
        type: 'zone',
        visible: false,
        padding: { x: 8, y: 4 },
        elements: [
          {
            id: 'footer-metadata',
            type: 'text',
            data: {
              content: 'Created {{createdAt}} • Last updated {{updatedAt}}'
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

    // Drag-and-drop features
    features: {
      insertMethod: 'both',        // Slash commands + panel
      showSlashHint: true,
      allowZoneToggle: true,
      enableDragReorder: true,
      allowColumnResize: false      // Fixed 3-column layout
    }
  }
};
