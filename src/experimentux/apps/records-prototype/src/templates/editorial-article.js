/**
 * Editorial Article Template
 *
 * Content publishing page optimized for reading experience.
 * Features narrow single-column layout with typography focus.
 *
 * Layout: Narrow centered column (700px)
 * Container Width: Notion-style (700px)
 */

export default {
  templateId: 'editorial-article',
  name: 'Editorial Article',
  description: 'Content publishing with reading-optimized typography and author bio',
  category: 'Content',
  icon: '📝',
  thumbnail: '/templates/editorial-article.png',

  defaultData: {
    author: '',
    authorBio: '',
    authorPhoto: null,
    publishDate: null,
    readTime: 0,
    category: '',
    tags: [],
    featuredImage: null,
    content: '',
    relatedArticles: []
  },

  sampleData: {
    author: 'Dr. Maya Patel',
    authorBio: 'Technology journalist and author specializing in AI ethics and digital transformation. Former editor at Tech Review Magazine.',
    authorPhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    publishDate: '2025-11-18',
    readTime: 8,
    category: 'Technology',
    tags: ['AI', 'Ethics', 'Future of Work', 'Enterprise'],
    featuredImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
    content: `The landscape of enterprise AI is undergoing a profound transformation. What began as experimental projects in isolated departments has evolved into mission-critical infrastructure powering entire organizations.

## The Evolution of Enterprise AI

In 2025, we're witnessing the maturation of AI from a promising technology to an essential business capability. Companies that once approached AI with cautious optimism are now building entire strategies around it.

The shift is evident across industries. Manufacturing plants use computer vision for quality control. Financial institutions deploy machine learning for fraud detection. Healthcare providers leverage natural language processing to improve patient care.

### Key Trends Shaping the Landscape

**1. Democratization of AI Tools**

No longer confined to data science teams, AI capabilities are becoming accessible to business users across organizations. Low-code and no-code platforms enable employees without technical backgrounds to build and deploy models.

**2. Ethical AI Frameworks**

As AI systems make increasingly consequential decisions, organizations are establishing robust governance frameworks. Transparency, fairness, and accountability have moved from nice-to-have principles to regulatory requirements.

**3. Hybrid Intelligence Models**

The most successful implementations combine human expertise with machine capabilities. Rather than replacing humans, these systems augment human decision-making with data-driven insights.

## Real-World Impact

Consider the case of a global logistics company that implemented AI-powered route optimization. Within six months, they reduced fuel costs by 18% and improved on-time deliveries by 23%.

Or the healthcare network using AI to analyze medical imaging. Their system now detects anomalies with 94% accuracy, enabling earlier intervention and better patient outcomes.

## Looking Ahead

The next frontier involves more sophisticated applications: predictive maintenance preventing equipment failures before they occur, personalized customer experiences at unprecedented scale, and autonomous systems handling complex multi-step workflows.

Yet challenges remain. Organizations must navigate data privacy regulations, address algorithmic bias, and ensure AI systems remain explainable and trustworthy.

## The Path Forward

Success in enterprise AI requires more than technology. It demands cultural change, executive sponsorship, and a commitment to responsible innovation.

Companies leading this transformation share common traits:
- Clear AI strategies aligned with business objectives
- Investment in data infrastructure and governance
- Cross-functional teams bridging technical and domain expertise
- Continuous learning and adaptation

As we move further into 2025, the question is no longer whether to adopt AI, but how to do so thoughtfully and effectively.`,
    relatedArticles: [
      {
        id: 'REL-001',
        title: 'Building Ethical AI: A Practical Framework',
        category: 'AI Ethics',
        readTime: 6,
        thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400'
      },
      {
        id: 'REL-002',
        title: 'The ROI of Enterprise AI: Data-Driven Analysis',
        category: 'Business Strategy',
        readTime: 10,
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
      },
      {
        id: 'REL-003',
        title: 'Low-Code AI Platforms: A Comprehensive Review',
        category: 'Technology',
        readTime: 12,
        thumbnail: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400'
      }
    ]
  },

  config: {
    layoutPresetId: 'database-page',
    containerWidth: 'notion',  // 700px (optimal reading width)

    zones: [
      // Cover Image Zone
      {
        id: 'cover',
        type: 'zone',
        visible: true,
        padding: { x: 0, y: 0 },
        elements: [
          {
            id: 'cover-image-1',
            type: 'cover-image',
            data: {
              imageUrl: '{{featuredImage}}',
              height: '400px',
              overlay: false
            },
            settings: {}
          }
        ]
      },

      // Header Zone
      {
        id: 'header',
        type: 'zone',
        visible: true,
        padding: { x: 8, y: 8 },
        elements: [
          {
            id: 'breadcrumb-1',
            type: 'breadcrumb',
            data: {
              items: [
                { label: 'Articles', href: '/articles' },
                { label: '{{category}}', href: '/articles?category={{category}}' },
                { label: '{{title}}', current: true }
              ]
            },
            settings: {}
          },
          {
            id: 'category-badge',
            type: 'text',
            data: {
              content: '{{category}}'
            },
            settings: {
              size: 'sm',
              color: 'blue',
              fontWeight: 'semibold',
              marginTop: 'md',
              display: 'inline-block',
              padding: '4px 12px',
              backgroundColor: 'blue-50',
              borderRadius: 'full'
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
              size: '4xl',
              weight: 'bold',
              marginTop: 'md',
              lineHeight: 'tight'
            }
          },
          {
            id: 'article-metadata',
            type: 'metadata-bar',
            data: {
              items: [
                {
                  label: 'Published',
                  value: '{{publishDate}}',
                  icon: '📅'
                },
                {
                  label: 'Read Time',
                  value: '{{readTime}} min',
                  icon: '⏱️'
                },
                {
                  label: 'By',
                  value: '{{author}}',
                  icon: '✍️'
                }
              ]
            },
            settings: {
              size: 'sm',
              color: 'muted',
              marginTop: 'sm'
            }
          }
        ]
      },

      // Body Zone - Article Content
      {
        id: 'body',
        type: 'zone',
        visible: true,
        padding: { x: 8, y: 8 },
        elements: [
          {
            id: 'article-content',
            type: 'text',
            data: {
              content: '{{content}}',
              editable: true,
              format: 'markdown'
            },
            settings: {
              size: 'lg',
              lineHeight: 'relaxed',
              color: 'neutral-800',
              marginBottom: 'xl'
            }
          },

          // Divider
          {
            id: 'divider-1',
            type: 'text',
            data: {
              content: '---'
            },
            settings: {
              marginY: 'xl'
            }
          },

          // Author Bio Section
          {
            id: 'author-heading',
            type: 'heading',
            data: {
              content: 'About the Author',
              level: 3
            },
            settings: {
              size: 'xl',
              weight: 'semibold',
              marginBottom: 'md'
            }
          },
          {
            id: 'author-card',
            type: 'content-card',
            data: {
              variant: 'info',
              image: '{{authorPhoto}}',
              title: '{{author}}',
              description: '{{authorBio}}'
            },
            settings: {
              imagePosition: 'left',
              imageSize: '80px',
              padding: 'lg',
              border: true,
              marginBottom: 'xl'
            }
          },

          // Related Articles Section
          {
            id: 'related-heading',
            type: 'heading',
            data: {
              content: 'Related Articles',
              level: 3
            },
            settings: {
              size: 'xl',
              weight: 'semibold',
              marginTop: 'xl',
              marginBottom: 'md'
            }
          }
        ],
        rows: [
          {
            id: 'related-articles-row',
            gap: 4,
            columns: [
              {
                span: 4,
                elements: [
                  {
                    id: 'related-1',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      image: '{{relatedArticles[0].thumbnail}}',
                      title: '{{relatedArticles[0].title}}',
                      subtitle: '{{relatedArticles[0].category}} • {{relatedArticles[0].readTime}} min read',
                      actionLabel: 'Read More',
                      actionLink: '/articles/{{relatedArticles[0].id}}'
                    },
                    settings: {
                      imagePosition: 'top',
                      padding: 'md',
                      border: true,
                      hover: true
                    }
                  }
                ]
              },
              {
                span: 4,
                elements: [
                  {
                    id: 'related-2',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      image: '{{relatedArticles[1].thumbnail}}',
                      title: '{{relatedArticles[1].title}}',
                      subtitle: '{{relatedArticles[1].category}} • {{relatedArticles[1].readTime}} min read',
                      actionLabel: 'Read More',
                      actionLink: '/articles/{{relatedArticles[1].id}}'
                    },
                    settings: {
                      imagePosition: 'top',
                      padding: 'md',
                      border: true,
                      hover: true
                    }
                  }
                ]
              },
              {
                span: 4,
                elements: [
                  {
                    id: 'related-3',
                    type: 'content-card',
                    data: {
                      variant: 'feature',
                      image: '{{relatedArticles[2].thumbnail}}',
                      title: '{{relatedArticles[2].title}}',
                      subtitle: '{{relatedArticles[2].category}} • {{relatedArticles[2].readTime}} min read',
                      actionLabel: 'Read More',
                      actionLink: '/articles/{{relatedArticles[2].id}}'
                    },
                    settings: {
                      imagePosition: 'top',
                      padding: 'md',
                      border: true,
                      hover: true
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
        padding: { x: 8, y: 6 },
        backgroundColor: 'neutral-50',
        elements: [
          {
            id: 'tags-heading',
            type: 'text',
            data: {
              content: 'Tags:'
            },
            settings: {
              size: 'sm',
              weight: 'semibold',
              color: 'neutral-600',
              marginBottom: 'xs'
            }
          },
          {
            id: 'tags-list',
            type: 'text',
            data: {
              content: '{{tags | join(", ")}}'
            },
            settings: {
              size: 'sm',
              color: 'blue',
              marginBottom: 'md'
            }
          },
          {
            id: 'footer-metadata',
            type: 'text',
            data: {
              content: 'Published {{publishDate}} • Last updated {{updatedAt}}'
            },
            settings: {
              size: 'xs',
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
      allowColumnResize: false,
      typography: 'optimized'  // Optimized for reading
    }
  }
};
