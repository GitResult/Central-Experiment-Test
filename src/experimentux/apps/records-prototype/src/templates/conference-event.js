/**
 * Conference Event Template
 *
 * Full-width marketing page for conferences, webinars, and events.
 * Optimized for event promotion with hero section, speakers, and schedule.
 *
 * Layout: Full-width sections with hero + 3-column content
 * Container Width: Full (100vw)
 */

export default {
  templateId: 'conference-event',
  name: 'Conference Event',
  description: 'Event registration & promotion with speakers, schedule, and testimonials',
  category: 'Events',
  icon: '🎉',
  thumbnail: '/templates/conference-event.png',

  defaultData: {
    eventDate: null,
    eventTime: null,
    eventLocation: '',
    eventType: 'Conference',
    capacity: 0,
    registered: 0,
    price: 0,
    currency: 'USD',
    coverImage: null,
    speakers: [],
    schedule: [],
    sponsors: [],
    testimonials: []
  },

  sampleData: {
    eventDate: '2026-03-15',
    eventTime: '9:00 AM - 5:00 PM PST',
    eventLocation: 'Moscone Center, San Francisco',
    eventType: 'Technology Conference',
    capacity: 500,
    registered: 287,
    price: 399,
    currency: 'USD',
    coverImage: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200',
    speakers: [
      {
        id: 'SP-001',
        name: 'Dr. Emily Rodriguez',
        title: 'Chief AI Officer',
        company: 'TechFuture Labs',
        bio: 'Leading expert in machine learning and neural networks',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        topic: 'The Future of AI in Enterprise'
      },
      {
        id: 'SP-002',
        name: 'Marcus Thompson',
        title: 'VP of Engineering',
        company: 'CloudScale Inc',
        bio: 'Pioneer in distributed systems and cloud architecture',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus',
        topic: 'Building Resilient Cloud Infrastructure'
      },
      {
        id: 'SP-003',
        name: 'Aisha Patel',
        title: 'Head of Product',
        company: 'InnovateCo',
        bio: 'Product strategist with 15 years in SaaS',
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aisha',
        topic: 'Product-Led Growth Strategies'
      }
    ],
    schedule: [
      {
        id: 'SCH-001',
        time: '9:00 AM',
        duration: '30 min',
        title: 'Registration & Welcome Coffee',
        type: 'Break',
        speaker: null
      },
      {
        id: 'SCH-002',
        time: '9:30 AM',
        duration: '45 min',
        title: 'Opening Keynote: The Future of AI in Enterprise',
        type: 'Keynote',
        speaker: 'Dr. Emily Rodriguez',
        track: 'Main Stage'
      },
      {
        id: 'SCH-003',
        time: '10:30 AM',
        duration: '60 min',
        title: 'Building Resilient Cloud Infrastructure',
        type: 'Workshop',
        speaker: 'Marcus Thompson',
        track: 'Technical Track'
      },
      {
        id: 'SCH-004',
        time: '12:00 PM',
        duration: '60 min',
        title: 'Networking Lunch',
        type: 'Break',
        speaker: null
      },
      {
        id: 'SCH-005',
        time: '1:00 PM',
        duration: '45 min',
        title: 'Product-Led Growth Strategies',
        type: 'Talk',
        speaker: 'Aisha Patel',
        track: 'Business Track'
      },
      {
        id: 'SCH-006',
        time: '2:00 PM',
        duration: '90 min',
        title: 'Interactive Panel: Future of Work',
        type: 'Panel',
        speaker: 'All Speakers',
        track: 'Main Stage'
      }
    ],
    testimonials: [
      {
        id: 'TEST-001',
        name: 'Sarah Johnson',
        title: 'Engineering Manager',
        company: 'TechStartup',
        quote: 'Best tech conference I\'ve attended in years. The speaker lineup was incredible and I made valuable connections.',
        rating: 5,
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
      },
      {
        id: 'TEST-002',
        name: 'David Chen',
        title: 'CTO',
        company: 'ScaleUp Inc',
        quote: 'Highly actionable content and excellent organization. Already implementing insights from the workshops.',
        rating: 5,
        photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
      }
    ],
    sponsors: ['Google Cloud', 'Microsoft Azure', 'AWS', 'MongoDB']
  },

  config: {
    layoutPresetId: 'full-width',
    containerWidth: 'full',  // 100vw

    zones: [
      // Hero Zone (Full-width cover)
      {
        id: 'hero',
        type: 'zone',
        visible: true,
        padding: { x: 0, y: 0 },
        elements: [
          {
            id: 'cover-image-1',
            type: 'cover-image',
            data: {
              imageUrl: '{{coverImage}}',
              height: '500px',
              overlay: true,
              overlayOpacity: 0.4
            },
            settings: {}
          },
          {
            id: 'hero-content',
            type: 'text',
            data: {
              content: ''  // Will be overlaid on cover
            },
            settings: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'white',
              textAlign: 'center',
              zIndex: 10
            }
          }
        ]
      },

      // Header Zone (Centered content)
      {
        id: 'header',
        type: 'zone',
        visible: true,
        padding: { x: 8, y: 12 },
        containerWidth: 'standard',  // 900px centered
        elements: [
          {
            id: 'event-icon',
            type: 'page-icon',
            data: {
              icon: '🎉',
              editable: true
            },
            settings: {
              size: 'xl',
              align: 'center'
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
              size: '5xl',
              weight: 'bold',
              align: 'center'
            }
          },
          {
            id: 'description-1',
            type: 'description',
            data: {
              content: '{{eventType}} • {{eventLocation}}',
              editable: false
            },
            settings: {
              size: 'xl',
              color: 'muted',
              align: 'center'
            }
          },
          {
            id: 'event-metadata',
            type: 'metadata-bar',
            data: {
              items: [
                {
                  label: 'Date',
                  value: '{{eventDate}}',
                  icon: '📅',
                  color: 'blue'
                },
                {
                  label: 'Time',
                  value: '{{eventTime}}',
                  icon: '🕐'
                },
                {
                  label: 'Registered',
                  value: '{{registered}}/{{capacity}}',
                  icon: '👥',
                  color: 'green'
                },
                {
                  label: 'Price',
                  value: '${{price}}',
                  icon: '💰'
                }
              ]
            },
            settings: {
              justify: 'center',
              wrap: true
            }
          },
          {
            id: 'cta-button',
            type: 'button',
            data: {
              label: 'Register Now',
              icon: '🎟️',
              action: 'register'
            },
            settings: {
              variant: 'primary',
              size: 'xl',
              align: 'center',
              marginTop: 'lg'
            }
          }
        ]
      },

      // Body Zone - Speakers Section
      {
        id: 'body',
        type: 'zone',
        visible: true,
        padding: { x: 8, y: 12 },
        containerWidth: 'wide',  // 1200px
        rows: [
          {
            id: 'speakers-header-row',
            columns: [
              {
                span: 12,
                elements: [
                  {
                    id: 'speakers-heading',
                    type: 'heading',
                    data: {
                      content: 'Featured Speakers',
                      level: 2
                    },
                    settings: {
                      size: '3xl',
                      weight: 'bold',
                      align: 'center',
                      marginBottom: 'xl'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'speakers-row',
            gap: 6,
            columns: [
              {
                span: 4,
                elements: [
                  {
                    id: 'speaker-1',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      image: '{{speakers[0].photo}}',
                      title: '{{speakers[0].name}}',
                      subtitle: '{{speakers[0].title}} at {{speakers[0].company}}',
                      description: '{{speakers[0].topic}}',
                      icon: '🎤'
                    },
                    settings: {
                      imagePosition: 'top',
                      padding: 'lg',
                      textAlign: 'center'
                    }
                  }
                ]
              },
              {
                span: 4,
                elements: [
                  {
                    id: 'speaker-2',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      image: '{{speakers[1].photo}}',
                      title: '{{speakers[1].name}}',
                      subtitle: '{{speakers[1].title}} at {{speakers[1].company}}',
                      description: '{{speakers[1].topic}}',
                      icon: '🎤'
                    },
                    settings: {
                      imagePosition: 'top',
                      padding: 'lg',
                      textAlign: 'center'
                    }
                  }
                ]
              },
              {
                span: 4,
                elements: [
                  {
                    id: 'speaker-3',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      image: '{{speakers[2].photo}}',
                      title: '{{speakers[2].name}}',
                      subtitle: '{{speakers[2].title}} at {{speakers[2].company}}',
                      description: '{{speakers[2].topic}}',
                      icon: '🎤'
                    },
                    settings: {
                      imagePosition: 'top',
                      padding: 'lg',
                      textAlign: 'center'
                    }
                  }
                ]
              }
            ]
          },

          // Schedule Section
          {
            id: 'schedule-header-row',
            columns: [
              {
                span: 12,
                elements: [
                  {
                    id: 'schedule-heading',
                    type: 'heading',
                    data: {
                      content: 'Event Schedule',
                      level: 2
                    },
                    settings: {
                      size: '3xl',
                      weight: 'bold',
                      align: 'center',
                      marginTop: 'xl',
                      marginBottom: 'lg'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'schedule-row',
            columns: [
              {
                span: 12,
                elements: [
                  {
                    id: 'schedule-grid',
                    type: 'data-grid',
                    data: {
                      columns: [
                        {
                          id: 'time',
                          name: 'Time',
                          width: '120px'
                        },
                        {
                          id: 'title',
                          name: 'Session'
                        },
                        {
                          id: 'speaker',
                          name: 'Speaker',
                          width: '200px'
                        },
                        {
                          id: 'track',
                          name: 'Track',
                          width: '150px'
                        }
                      ],
                      dataSource: '{{schedule}}',
                      sortable: false,
                      striped: true
                    },
                    settings: {
                      maxWidth: '900px',
                      margin: '0 auto'
                    }
                  }
                ]
              }
            ]
          },

          // Testimonials Section
          {
            id: 'testimonials-header-row',
            columns: [
              {
                span: 12,
                elements: [
                  {
                    id: 'testimonials-heading',
                    type: 'heading',
                    data: {
                      content: 'What Attendees Say',
                      level: 2
                    },
                    settings: {
                      size: '3xl',
                      weight: 'bold',
                      align: 'center',
                      marginTop: 'xl',
                      marginBottom: 'lg'
                    }
                  }
                ]
              }
            ]
          },
          {
            id: 'testimonials-row',
            gap: 6,
            columns: [
              {
                span: 6,
                elements: [
                  {
                    id: 'testimonial-1',
                    type: 'content-card',
                    data: {
                      variant: 'info',
                      title: '{{testimonials[0].name}}',
                      subtitle: '{{testimonials[0].title}} at {{testimonials[0].company}}',
                      description: '"{{testimonials[0].quote}}"',
                      icon: '⭐'
                    },
                    settings: {
                      padding: 'xl',
                      border: true
                    }
                  }
                ]
              },
              {
                span: 6,
                elements: [
                  {
                    id: 'testimonial-2',
                    type: 'content-card',
                    data: {
                      variant: 'info',
                      title: '{{testimonials[1].name}}',
                      subtitle: '{{testimonials[1].title}} at {{testimonials[1].company}}',
                      description: '"{{testimonials[1].quote}}"',
                      icon: '⭐'
                    },
                    settings: {
                      padding: 'xl',
                      border: true
                    }
                  }
                ]
              }
            ]
          }
        ]
      },

      // Footer CTA Zone
      {
        id: 'footer',
        type: 'zone',
        visible: true,
        padding: { x: 8, y: 12 },
        containerWidth: 'standard',
        backgroundColor: 'neutral-50',
        elements: [
          {
            id: 'footer-cta-heading',
            type: 'heading',
            data: {
              content: 'Ready to Join Us?',
              level: 2
            },
            settings: {
              size: '3xl',
              weight: 'bold',
              align: 'center',
              marginBottom: 'md'
            }
          },
          {
            id: 'footer-cta-description',
            type: 'text',
            data: {
              content: 'Spaces are filling fast. Register today to secure your spot at the premier technology conference of 2026.'
            },
            settings: {
              size: 'lg',
              align: 'center',
              color: 'muted',
              marginBottom: 'lg'
            }
          },
          {
            id: 'footer-cta-button',
            type: 'button',
            data: {
              label: 'Reserve Your Seat',
              icon: '🎟️',
              action: 'register'
            },
            settings: {
              variant: 'primary',
              size: 'xl',
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
      allowColumnResize: false
    }
  }
};
