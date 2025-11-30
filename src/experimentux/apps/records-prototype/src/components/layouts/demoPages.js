/**
 * Demo Page Configurations
 *
 * Pre-built demo pages showcasing the Unified Page System.
 * These can be viewed by enabling the feature flag and selecting a demo.
 */

/**
 * Simple Demo: Basic Page with Text Elements
 */
export const simpleDemoPage = {
  id: 'demo-simple',
  name: 'Simple Demo',
  layoutPresetId: 'database-page',
  zones: [
    {
      id: 'header',
      type: 'header',
      visible: true,
      containerWidth: 'notion',
      padding: { x: 12, y: 6 },
      background: '',
      border: false,
      rows: [
        {
          id: 'icon-row',
          columns: [
            {
              id: 'icon-col',
              span: 12,
              elements: [
                {
                  id: 'page-icon',
                  type: 'page-icon',
                  settings: { size: 'lg' },
                  data: { icon: '🚀' }
                }
              ]
            }
          ]
        },
        {
          id: 'title-row',
          columns: [
            {
              id: 'title-col',
              span: 12,
              elements: [
                {
                  id: 'title',
                  type: 'title',
                  settings: { fontSize: '4xl', fontWeight: 'bold' },
                  data: { content: 'Welcome to Universal Page System' }
                },
                {
                  id: 'description',
                  type: 'description',
                  settings: {},
                  data: { content: 'A unified, flexible zone-based architecture for all page types' }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'body',
      type: 'body',
      visible: true,
      containerWidth: 'notion',
      padding: { x: 12, y: 8 },
      background: '',
      border: false,
      rows: [
        {
          id: 'content-row-1',
          columns: [
            {
              id: 'content-col-1',
              span: 12,
              elements: [
                {
                  id: 'heading-1',
                  type: 'heading',
                  settings: { level: 2 },
                  data: { content: 'Key Features' }
                },
                {
                  id: 'text-1',
                  type: 'text',
                  settings: {},
                  data: { content: 'The Unified Page System eliminates ~1,500 lines of duplicated code by unifying Database Pages and Data Record Pages into a single, flexible architecture.' }
                }
              ]
            }
          ]
        },
        {
          id: 'content-row-2',
          columns: [
            {
              id: 'content-col-2',
              span: 12,
              elements: [
                {
                  id: 'heading-2',
                  type: 'heading',
                  settings: { level: 2 },
                  data: { content: 'How It Works' }
                },
                {
                  id: 'text-2',
                  type: 'text',
                  settings: {},
                  data: { content: 'Pages are composed of zones, which contain rows, which contain columns, which contain elements. All elements are registered in a central registry and lazy-loaded for performance.' }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  features: {
    insertMethod: 'slash',
    showSlashHint: true,
    allowZoneToggle: true
  }
};

/**
 * Event Landing Demo: Marketing page with hero and content cards
 */
export const eventLandingDemoPage = {
  id: 'demo-event-landing',
  name: 'Event Landing Demo',
  layoutPresetId: 'event-landing',
  zones: [
    {
      id: 'hero',
      type: 'hero',
      visible: true,
      containerWidth: 'full',
      padding: { x: 16, y: 20 },
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      border: false,
      rows: [
        {
          id: 'hero-content',
          columns: [
            {
              id: 'hero-text-col',
              span: 7,
              elements: [
                {
                  id: 'hero-title',
                  type: 'title',
                  settings: { fontSize: '5xl', fontWeight: 'bold', color: 'text-white' },
                  data: { content: 'Tech Summit 2025' }
                },
                {
                  id: 'hero-description',
                  type: 'text',
                  settings: { fontSize: 'lg', color: 'text-blue-100' },
                  data: { content: 'Join industry leaders for three days of innovation, networking, and insights into the future of technology.' }
                },
                {
                  id: 'hero-button',
                  type: 'button',
                  settings: { variant: 'primary', size: 'lg' },
                  data: { text: 'Register Now', url: '#register' }
                }
              ]
            },
            {
              id: 'hero-image-col',
              span: 5,
              elements: [
                {
                  id: 'hero-image',
                  type: 'image',
                  settings: { height: '400px', objectFit: 'contain' },
                  data: {
                    src: 'https://via.placeholder.com/600x400/3b82f6/ffffff?text=Hero+Image',
                    alt: 'Tech Summit Hero'
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'content',
      type: 'body',
      visible: true,
      containerWidth: 'wide',
      padding: { x: 8, y: 12 },
      background: '#ffffff',
      border: false,
      rows: [
        {
          id: 'section-header',
          columns: [
            {
              id: 'section-header-col',
              span: 12,
              elements: [
                {
                  id: 'section-heading',
                  type: 'heading',
                  settings: { level: 2 },
                  data: { content: 'What to Expect' }
                },
                {
                  id: 'section-text',
                  type: 'text',
                  settings: { align: 'center', color: 'text-gray-600' },
                  data: { content: 'Explore the latest innovations and connect with industry experts' }
                }
              ]
            }
          ]
        },
        {
          id: 'cards-row',
          columns: [
            {
              id: 'card-1-col',
              span: 4,
              elements: [
                {
                  id: 'card-1',
                  type: 'content-card',
                  settings: { variant: 'feature', background: 'light' },
                  data: {
                    title: 'Keynote Speakers',
                    description: 'Hear from visionary leaders shaping the future of technology and innovation.',
                    media: {
                      type: 'image',
                      src: 'https://via.placeholder.com/400x300/3b82f6/ffffff?text=Speakers'
                    },
                    cta: { text: 'View lineup', url: '#speakers' }
                  }
                }
              ]
            },
            {
              id: 'card-2-col',
              span: 4,
              elements: [
                {
                  id: 'card-2',
                  type: 'content-card',
                  settings: { variant: 'info', background: 'light' },
                  data: {
                    title: 'Hands-on Workshops',
                    description: 'Gain practical skills through interactive sessions led by industry experts.',
                    media: {
                      type: 'image',
                      src: 'https://via.placeholder.com/400x300/10b981/ffffff?text=Workshops'
                    },
                    cta: { text: 'Browse sessions', url: '#workshops' }
                  }
                }
              ]
            },
            {
              id: 'card-3-col',
              span: 4,
              elements: [
                {
                  id: 'card-3',
                  type: 'content-card',
                  settings: { variant: 'video', background: 'dark' },
                  data: {
                    title: 'Networking Events',
                    description: 'Connect with peers, mentors, and potential collaborators in exclusive networking sessions.',
                    media: {
                      type: 'video',
                      src: '#'
                    },
                    cta: { text: 'Learn more', url: '#networking' }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'cta',
      type: 'body',
      visible: true,
      containerWidth: 'standard',
      padding: { x: 8, y: 12 },
      background: '#f9fafb',
      border: false,
      rows: [
        {
          id: 'cta-row',
          columns: [
            {
              id: 'cta-col',
              span: 12,
              elements: [
                {
                  id: 'cta-heading',
                  type: 'heading',
                  settings: { level: 2 },
                  data: { content: 'Ready to Join Us?' }
                },
                {
                  id: 'cta-text',
                  type: 'text',
                  settings: { align: 'center' },
                  data: { content: 'Register now to secure your spot and get early-bird pricing.' }
                },
                {
                  id: 'cta-button',
                  type: 'button',
                  settings: { variant: 'primary', size: 'lg', align: 'center' },
                  data: { text: 'Register for $299', url: '#register' }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  features: {
    insertMethod: 'both',
    showSlashHint: false,
    allowZoneToggle: true
  }
};

/**
 * Multi-column Demo: Showcasing flexible layouts
 */
export const multiColumnDemoPage = {
  id: 'demo-multi-column',
  name: 'Multi-Column Demo',
  layoutPresetId: 'blank',
  zones: [
    {
      id: 'body',
      type: 'body',
      visible: true,
      containerWidth: 'wide',
      padding: { x: 8, y: 8 },
      background: '',
      border: false,
      rows: [
        {
          id: 'title-row',
          columns: [
            {
              id: 'title-col',
              span: 12,
              elements: [
                {
                  id: 'title',
                  type: 'title',
                  settings: {},
                  data: { content: 'Flexible Multi-Column Layouts' }
                },
                {
                  id: 'description',
                  type: 'description',
                  settings: {},
                  data: { content: 'The 12-column grid system supports any layout combination' }
                }
              ]
            }
          ]
        },
        {
          id: 'two-column-row',
          columns: [
            {
              id: 'col-6-1',
              span: 6,
              elements: [
                {
                  id: 'heading-left',
                  type: 'heading',
                  settings: { level: 3 },
                  data: { content: 'Left Column (6/12)' }
                },
                {
                  id: 'text-left',
                  type: 'text',
                  settings: {},
                  data: { content: 'This column takes up half the width. Perfect for two-column layouts.' }
                }
              ]
            },
            {
              id: 'col-6-2',
              span: 6,
              elements: [
                {
                  id: 'heading-right',
                  type: 'heading',
                  settings: { level: 3 },
                  data: { content: 'Right Column (6/12)' }
                },
                {
                  id: 'text-right',
                  type: 'text',
                  settings: {},
                  data: { content: 'Columns can contain any mix of element types, creating infinitely flexible layouts.' }
                }
              ]
            }
          ]
        },
        {
          id: 'three-column-row',
          columns: [
            {
              id: 'col-4-1',
              span: 4,
              elements: [
                {
                  id: 'heading-1',
                  type: 'heading',
                  settings: { level: 3 },
                  data: { content: 'Column 1 (4/12)' }
                },
                {
                  id: 'text-1',
                  type: 'text',
                  settings: {},
                  data: { content: 'Three equal columns.' }
                }
              ]
            },
            {
              id: 'col-4-2',
              span: 4,
              elements: [
                {
                  id: 'heading-2',
                  type: 'heading',
                  settings: { level: 3 },
                  data: { content: 'Column 2 (4/12)' }
                },
                {
                  id: 'text-2',
                  type: 'text',
                  settings: {},
                  data: { content: 'Great for feature grids.' }
                }
              ]
            },
            {
              id: 'col-4-3',
              span: 4,
              elements: [
                {
                  id: 'heading-3',
                  type: 'heading',
                  settings: { level: 3 },
                  data: { content: 'Column 3 (4/12)' }
                },
                {
                  id: 'text-3',
                  type: 'text',
                  settings: {},
                  data: { content: 'Or card layouts.' }
                }
              ]
            }
          ]
        },
        {
          id: 'asymmetric-row',
          columns: [
            {
              id: 'col-8',
              span: 8,
              elements: [
                {
                  id: 'heading-main',
                  type: 'heading',
                  settings: { level: 3 },
                  data: { content: 'Main Content (8/12)' }
                },
                {
                  id: 'text-main',
                  type: 'text',
                  settings: {},
                  data: { content: 'Asymmetric layouts work great for blog posts with sidebars, or content with supplementary information.' }
                }
              ]
            },
            {
              id: 'col-4',
              span: 4,
              elements: [
                {
                  id: 'heading-sidebar',
                  type: 'heading',
                  settings: { level: 3 },
                  data: { content: 'Sidebar (4/12)' }
                },
                {
                  id: 'text-sidebar',
                  type: 'text',
                  settings: {},
                  data: { content: 'Smaller column for secondary content.' }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  features: {
    insertMethod: 'both',
    showSlashHint: true,
    allowZoneToggle: true
  }
};

/**
 * Get all demo pages
 */
export const getAllDemoPages = () => [
  simpleDemoPage,
  eventLandingDemoPage,
  multiColumnDemoPage
];

/**
 * Get demo page by ID
 */
export const getDemoPageById = (id) => {
  return getAllDemoPages().find(page => page.id === id);
};
