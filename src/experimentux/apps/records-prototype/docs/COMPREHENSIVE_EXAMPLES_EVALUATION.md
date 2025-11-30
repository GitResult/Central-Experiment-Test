# Comprehensive Examples Evaluation

**Date:** 2025-11-21
**Version:** 2.0
**Purpose:** Evaluate 8 comprehensive examples that showcase platform breadth and depth
**Context:** All examples built from ground up using domain-based architecture (no porting)

---

## Executive Summary

**Goal:** Create 8 exemplar pages that collectively demonstrate every aspect of the enterprise platform's capabilities.

**Approach:** Each example showcases unique layout patterns, data interactions, and use cases spanning all major verticals (CRM, Events, Applications, Analytics, Content Management, Design, Email Marketing).

**Architecture:** All examples use the 4-type domain architecture (field, record, markup, structure) with JSON-driven configuration.

**Coverage Matrix:**

| Example | Layout Pattern | Primary Vertical | Key Features | Complexity |
|---------|---------------|------------------|--------------|------------|
| **1. HubSpot CRM Contact** | 3-col fixed-fluid-fixed | CRM | Tabs, timeline, associations | 🟠 Medium-High |
| **2. Event Landing Page** | Full-width + constrained | Marketing/CMS | Hero, registration, speakers | 🟡 Medium |
| **3. Application Submission** | 3-col + canvas | HR/Admissions | Form in canvas, field discussions | 🔴 Very High |
| **4. Dashboard** | Grid-based | Analytics/BI | Charts, KPIs, react-grid-layout | 🔴 High |
| **5. New Page (Notion)** | Single-column fluid | CMS/Docs | Block editor, slash commands | 🔴 High |
| **6. New Canvas (Figma)** | Infinite canvas | Design/Diagramming | Free positioning, zoom, pan | 🔴 Very High |
| **7. Article (Magazine)** | Article layout | Editorial/Publishing | Typography, images, TOC | 🟡 Medium |
| **8. Renewal Email** | Email template | Email Marketing | Hero image, CTA, responsive | 🟢 Low |

---

## Example 1: HubSpot CRM Contact Page

### Overview
**Use Case:** Enterprise CRM contact management with comprehensive 360° view
**Layout:** Full-width 3-column (left sidebar 280px fixed, center fluid, right sidebar 320px fixed)
**Primary Vertical:** CRM, Sales
**Inspiration:** HubSpot Contacts, Salesforce Lead View

### Unique Features
1. **Fixed-Fluid-Fixed Layout** - Demonstrates responsive multi-column patterns
2. **Tab Navigation** - Center content organized into tabs (Overview, Activity, Emails, etc.)
3. **Left Nav with Sections** - About, Timeline, Deals, etc. in left sidebar
4. **Timeline/Activity Feed** - Real-time updates with bound data
5. **Associated Records** - Show related deals, companies, tickets
6. **Inline Editing** - Click-to-edit fields with bidirectional binding
7. **Action Panel** - Context-sensitive actions (call, email, task)

### Layout Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│ Global Bar (workspace, search, notifications)                   │
├────────┬──────────────────────────────────────────┬─────────────┤
│ Left   │ Center Content (Fluid)                   │ Right       │
│ Nav    │                                          │ Actions     │
│ 280px  │  ┌──────────────────────────────────┐   │ 320px       │
│ Fixed  │  │ Contact Header                   │   │ Fixed       │
│        │  │ John Doe                         │   │             │
│ • About│  │ Senior Engineer, Acme Corp       │   │ Quick       │
│ • Activity│ └──────────────────────────────────┘ │ Actions:    │
│ • Emails │                                        │ - Call      │
│ • Deals│  ┌──────────────────────────────────┐   │ - Email     │
│ • Companies│[ Overview | Activity | Emails ]│   │ - Task      │
│ • Tickets│  └──────────────────────────────────┘ │ - Note      │
│        │                                          │             │
│        │  ┌──────────────────────────────────┐   │ Associated  │
│        │  │ Overview Tab Content             │   │ Records:    │
│        │  │                                  │   │ - Deals (3) │
│        │  │ Recent Activities:               │   │ - Companies │
│        │  │ • Email sent - 2 hours ago       │   │ - Tickets   │
│        │  │ • Call logged - 1 day ago        │   │             │
│        │  │ • Deal updated - 3 days ago      │   │ Tags:       │
│        │  │                                  │   │ #enterprise │
│        │  │ Upcoming Tasks:                  │   │ #hot-lead   │
│        │  │ • Follow-up call - Tomorrow      │   │             │
│        │  │ • Send proposal - This week      │   │ Owner:      │
│        │  │                                  │   │ Sarah Jones │
│        │  └──────────────────────────────────┘   │             │
└────────┴──────────────────────────────────────────┴─────────────┘

When "About" is clicked in left nav:
- Left nav shows "About" section with editable fields:
  • Email: john@acme.com (inline edit)
  • Phone: (555) 123-4567 (inline edit)
  • Lifecycle Stage: Opportunity (dropdown)
  • Lead Status: Qualified (dropdown)
```

### Domain Architecture Mapping

```javascript
// Page Configuration (JSON)
{
  "id": "page-crm-contact",
  "type": "page",
  "meta": {
    "title": "Contact: {{record.contact.name}}",
    "layout": "three-column-fixed-fluid-fixed"
  },
  "zones": [
    {
      "id": "zone-left-sidebar",
      "name": "Left Sidebar",
      "width": "280px",
      "position": "fixed",
      "rows": [
        {
          "id": "row-nav",
          "columns": [
            {
              "id": "col-nav",
              "elements": [
                {
                  "id": "contact-nav",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "nav",
                      "semanticRole": "navigation"
                    }
                  },
                  "elements": [
                    {
                      "id": "nav-overview",
                      "type": "markup",
                      "data": { "content": "Overview", "active": true },
                      "settings": {
                        "markup": { "markupType": "nav-item" }
                      }
                    },
                    {
                      "id": "nav-activity",
                      "type": "markup",
                      "data": { "content": "Activity" },
                      "settings": {
                        "markup": { "markupType": "nav-item" }
                      }
                    },
                    {
                      "id": "nav-emails",
                      "type": "markup",
                      "data": { "content": "Emails" },
                      "settings": {
                        "markup": { "markupType": "nav-item" }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "zone-center",
      "name": "Center Content",
      "width": "fluid",
      "minWidth": "600px",
      "rows": [
        {
          "id": "row-header",
          "columns": [
            {
              "id": "col-header",
              "elements": [
                {
                  "id": "contact-header",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "header",
                      "semanticRole": "content-group"
                    },
                    "layout": {
                      "direction": "horizontal",
                      "gap": "{{theme.spacing.lg}}",
                      "align": "start"
                    }
                  },
                  "elements": [
                    {
                      "id": "contact-avatar",
                      "type": "record",
                      "settings": {
                        "record": { "recordType": "avatar", "size": "xl" },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "record.contact",
                            "property": "avatarUrl",
                            "mode": "read"
                          }
                        }
                      }
                    },
                    {
                      "id": "contact-info",
                      "type": "structure",
                      "settings": {
                        "structure": { "structureType": "flex" },
                        "layout": { "direction": "vertical", "gap": "{{theme.spacing.xs}}" }
                      },
                      "elements": [
                        {
                          "id": "contact-name",
                          "type": "field",
                          "data": { "value": "" },
                          "settings": {
                            "field": {
                              "fieldType": "text",
                              "label": null,
                              "inlineEdit": true,
                              "size": "2xl"
                            },
                            "data": {
                              "bindingMode": "bound-bidirectional",
                              "binding": {
                                "source": "record.contact",
                                "property": "name",
                                "mode": "bidirectional"
                              }
                            },
                            "typography": {
                              "fontSize": "{{theme.typography.sizes.2xl}}",
                              "fontWeight": "{{theme.typography.weights.bold}}"
                            }
                          }
                        },
                        {
                          "id": "contact-title",
                          "type": "field",
                          "data": { "value": "" },
                          "settings": {
                            "field": {
                              "fieldType": "text",
                              "inlineEdit": true
                            },
                            "data": {
                              "bindingMode": "bound-bidirectional",
                              "binding": {
                                "source": "record.contact",
                                "property": "title"
                              }
                            },
                            "appearance": {
                              "color": "{{theme.colors.text.secondary}}"
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "row-about",
          "columns": [
            {
              "id": "col-about",
              "elements": [
                {
                  "id": "about-section",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "card",
                      "semanticRole": "content-group"
                    },
                    "layout": {
                      "padding": "{{theme.spacing.lg}}",
                      "gap": "{{theme.spacing.md}}"
                    },
                    "appearance": {
                      "background": "{{theme.colors.surface.primary}}",
                      "border": "{{theme.borders.width.sm}} solid {{theme.colors.border.default}}",
                      "borderRadius": "{{theme.borders.radius.lg}}"
                    }
                  },
                  "elements": [
                    {
                      "id": "about-heading",
                      "type": "markup",
                      "data": { "content": "About" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 3 },
                        "typography": {
                          "fontSize": "{{theme.typography.sizes.lg}}",
                          "fontWeight": "{{theme.typography.weights.semibold}}"
                        }
                      }
                    },
                    {
                      "id": "field-email",
                      "type": "field",
                      "data": { "value": "" },
                      "settings": {
                        "field": {
                          "fieldType": "email",
                          "label": "Email",
                          "inlineEdit": true
                        },
                        "data": {
                          "bindingMode": "bound-bidirectional",
                          "binding": {
                            "source": "record.contact",
                            "property": "email"
                          },
                          "validation": {
                            "required": true,
                            "pattern": "^[^@]+@[^@]+\\.[^@]+$"
                          }
                        }
                      }
                    },
                    {
                      "id": "field-phone",
                      "type": "field",
                      "data": { "value": "" },
                      "settings": {
                        "field": {
                          "fieldType": "tel",
                          "label": "Phone",
                          "inlineEdit": true
                        },
                        "data": {
                          "bindingMode": "bound-bidirectional",
                          "binding": {
                            "source": "record.contact",
                            "property": "phone"
                          }
                        }
                      }
                    },
                    {
                      "id": "field-lifecycle-stage",
                      "type": "field",
                      "data": { "value": "" },
                      "settings": {
                        "field": {
                          "fieldType": "select",
                          "label": "Lifecycle Stage",
                          "options": [
                            { "value": "lead", "label": "Lead" },
                            { "value": "mql", "label": "Marketing Qualified Lead" },
                            { "value": "sql", "label": "Sales Qualified Lead" },
                            { "value": "opportunity", "label": "Opportunity" },
                            { "value": "customer", "label": "Customer" }
                          ]
                        },
                        "data": {
                          "bindingMode": "bound-bidirectional",
                          "binding": {
                            "source": "record.contact",
                            "property": "lifecycleStage"
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "row-timeline",
          "columns": [
            {
              "id": "col-timeline",
              "elements": [
                {
                  "id": "timeline-section",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "card",
                      "semanticRole": "content-group"
                    }
                  },
                  "elements": [
                    {
                      "id": "timeline-heading",
                      "type": "markup",
                      "data": { "content": "Activity Timeline" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 3 }
                      }
                    },
                    {
                      "id": "timeline-feed",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "timeline",
                          "itemsPerPage": 20,
                          "realtime": true
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "collection.activities",
                            "filter": "contactId == {{record.contact.id}}",
                            "sort": "timestamp:desc",
                            "mode": "read"
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "zone-right-sidebar",
      "name": "Right Sidebar",
      "width": "320px",
      "position": "fixed",
      "rows": [
        {
          "id": "row-actions",
          "columns": [
            {
              "id": "col-actions",
              "elements": [
                {
                  "id": "quick-actions",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "card",
                      "semanticRole": "content-group"
                    }
                  },
                  "elements": [
                    {
                      "id": "actions-heading",
                      "type": "markup",
                      "data": { "content": "Quick Actions" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 4 }
                      }
                    },
                    {
                      "id": "action-call",
                      "type": "markup",
                      "data": { "content": "Call", "icon": "phone" },
                      "settings": {
                        "markup": { "markupType": "button", "variant": "secondary" },
                        "layout": { "width": "100%" }
                      }
                    },
                    {
                      "id": "action-email",
                      "type": "markup",
                      "data": { "content": "Email", "icon": "mail" },
                      "settings": {
                        "markup": { "markupType": "button", "variant": "secondary" },
                        "layout": { "width": "100%" }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "row-associations",
          "columns": [
            {
              "id": "col-associations",
              "elements": [
                {
                  "id": "associated-records",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "card"
                    }
                  },
                  "elements": [
                    {
                      "id": "assoc-heading",
                      "type": "markup",
                      "data": { "content": "Associated Records" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 4 }
                      }
                    },
                    {
                      "id": "assoc-deals",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "association-list",
                          "targetType": "deal",
                          "displayLimit": 5
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "associations.deals",
                            "filter": "contactId == {{record.contact.id}}"
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Key Capabilities Demonstrated
1. ✅ **Fixed-Fluid-Fixed Layout** - Responsive multi-column
2. ✅ **Bidirectional Data Binding** - Inline editing with auto-save
3. ✅ **Associated Records** - Cross-record relationships
4. ✅ **Real-time Updates** - Timeline feed with live data
5. ✅ **Conditional Rendering** - Show/hide based on state
6. ✅ **Form Validation** - Email, phone patterns

### Technical Challenges
- **Layout Management:** CSS Grid with fixed sidebars and fluid center
- **Data Synchronization:** Bidirectional binding with conflict resolution
- **Performance:** Timeline with 1000+ activities needs virtualization
- **Responsive:** Collapsible sidebars on tablet/mobile

---

## Example 2: Event Landing Page

### Overview
**Use Case:** Marketing landing page for conference/event registration
**Layout:** Full-width hero + constrained content (max-width: 1280px)
**Primary Vertical:** Marketing, Events, CMS
**Inspiration:** Notion Conf, GitHub Universe, Vercel Ship

### Unique Features
1. **Full-Width Hero** - Edge-to-edge image with overlay
2. **Constrained Content Width** - Fixed max-width for readability
3. **Registration Form** - Multi-step with validation
4. **Speaker Grid** - Collection rendering with filters
5. **Schedule Timeline** - Time-based display
6. **Social Proof** - Testimonials, sponsors, attendance count

### Layout Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│ FULL WIDTH HERO (edge-to-edge)                                  │
│ Background Image + Gradient Overlay                             │
│                                                                  │
│          Event Title (Conference 2025)                          │
│          Date & Location                                        │
│          [Register Now Button]                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    (Constrained: max-width 1280px)              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ About the Event                                          │  │
│  │ Paragraph text describing the conference...              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Featured Speakers                                        │  │
│  │ ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐         │  │
│  │ │ Photo  │  │ Photo  │  │ Photo  │  │ Photo  │         │  │
│  │ │ Name   │  │ Name   │  │ Name   │  │ Name   │         │  │
│  │ │ Title  │  │ Title  │  │ Title  │  │ Title  │         │  │
│  │ └────────┘  └────────┘  └────────┘  └────────┘         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Schedule (Day 1 | Day 2 | Day 3)                        │  │
│  │ 9:00 AM  - Keynote: The Future of AI                    │  │
│  │ 10:30 AM - Workshop: Building with React                │  │
│  │ 12:00 PM - Lunch Break                                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│ FULL WIDTH CTA SECTION (colored background)                     │
│                                                                  │
│          Ready to Join?                                         │
│          [Register Now]                                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Domain Architecture Mapping

```javascript
{
  "id": "page-event-landing",
  "type": "page",
  "meta": {
    "title": "Conference 2025 - Join Us",
    "layout": "full-width-constrained"
  },
  "zones": [
    {
      "id": "zone-hero",
      "name": "Hero",
      "width": "100vw",
      "containerWidth": "full",
      "rows": [
        {
          "id": "row-hero",
          "columns": [
            {
              "id": "col-hero",
              "elements": [
                {
                  "id": "hero-structure",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "hero",
                      "semanticRole": "hero",
                      "fullWidth": true,
                      "height": "80vh"
                    },
                    "layout": {
                      "display": "flex",
                      "direction": "vertical",
                      "align": "center",
                      "justify": "center",
                      "padding": "{{theme.spacing.4xl}} {{theme.spacing.lg}}",
                      "position": "relative"
                    },
                    "appearance": {
                      "backgroundImage": "url({{record.event.heroImage}})",
                      "backgroundSize": "cover",
                      "backgroundPosition": "center",
                      "overlay": "linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6))"
                    }
                  },
                  "elements": [
                    {
                      "id": "hero-title",
                      "type": "markup",
                      "data": { "content": "Conference 2025" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 1 },
                        "typography": {
                          "fontSize": "{{theme.typography.sizes.6xl}}",
                          "fontWeight": "{{theme.typography.weights.bold}}",
                          "textAlign": "center",
                          "color": "{{theme.colors.white}}"
                        },
                        "layout": {
                          "maxWidth": "800px"
                        }
                      }
                    },
                    {
                      "id": "hero-subtitle",
                      "type": "markup",
                      "data": { "content": "June 15-17, 2025 • San Francisco, CA" },
                      "settings": {
                        "markup": { "markupType": "text" },
                        "typography": {
                          "fontSize": "{{theme.typography.sizes.2xl}}",
                          "textAlign": "center",
                          "color": "{{theme.colors.white}}"
                        },
                        "layout": {
                          "margin": "{{theme.spacing.md}} 0"
                        }
                      }
                    },
                    {
                      "id": "hero-cta",
                      "type": "markup",
                      "data": { "content": "Register Now" },
                      "settings": {
                        "markup": {
                          "markupType": "button",
                          "variant": "primary",
                          "size": "lg"
                        },
                        "appearance": {
                          "background": "{{theme.colors.primary.500}}",
                          "color": "{{theme.colors.white}}",
                          "padding": "{{theme.spacing.lg}} {{theme.spacing.2xl}}",
                          "borderRadius": "{{theme.borders.radius.lg}}"
                        },
                        "layout": {
                          "margin": "{{theme.spacing.xl}} 0 0 0"
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "zone-content",
      "name": "Content",
      "containerWidth": "1280px",
      "centerAlign": true,
      "rows": [
        {
          "id": "row-about",
          "columns": [
            {
              "id": "col-about",
              "elements": [
                {
                  "id": "about-section",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "section" },
                    "layout": {
                      "padding": "{{theme.spacing.4xl}} 0"
                    }
                  },
                  "elements": [
                    {
                      "id": "about-heading",
                      "type": "markup",
                      "data": { "content": "About the Event" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 2 },
                        "typography": {
                          "fontSize": "{{theme.typography.sizes.4xl}}",
                          "fontWeight": "{{theme.typography.weights.bold}}",
                          "textAlign": "center"
                        }
                      }
                    },
                    {
                      "id": "about-description",
                      "type": "markup",
                      "data": {
                        "content": "Join 5,000+ developers, designers, and product leaders for three days of workshops, talks, and networking."
                      },
                      "settings": {
                        "markup": { "markupType": "text" },
                        "typography": {
                          "fontSize": "{{theme.typography.sizes.xl}}",
                          "textAlign": "center",
                          "lineHeight": "1.6"
                        },
                        "layout": {
                          "maxWidth": "800px",
                          "margin": "{{theme.spacing.lg}} auto"
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "row-speakers",
          "columns": [
            {
              "id": "col-speakers",
              "elements": [
                {
                  "id": "speakers-section",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "section" }
                  },
                  "elements": [
                    {
                      "id": "speakers-heading",
                      "type": "markup",
                      "data": { "content": "Featured Speakers" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 2 }
                      }
                    },
                    {
                      "id": "speakers-grid",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "grid",
                          "columns": 4,
                          "gap": "{{theme.spacing.xl}}"
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "collection.speakers",
                            "filter": "featured == true",
                            "sort": "displayOrder:asc",
                            "mode": "read"
                          }
                        },
                        "itemTemplate": {
                          "type": "structure",
                          "settings": {
                            "structure": { "structureType": "card" }
                          },
                          "elements": [
                            {
                              "type": "record",
                              "settings": {
                                "record": { "recordType": "image", "aspectRatio": "1/1" },
                                "data": {
                                  "binding": {
                                    "property": "photo"
                                  }
                                }
                              }
                            },
                            {
                              "type": "markup",
                              "settings": {
                                "markup": { "markupType": "heading", "level": 4 },
                                "data": {
                                  "binding": { "property": "name" }
                                }
                              }
                            },
                            {
                              "type": "markup",
                              "settings": {
                                "markup": { "markupType": "text" },
                                "data": {
                                  "binding": { "property": "title" }
                                }
                              }
                            }
                          ]
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "row-schedule",
          "columns": [
            {
              "id": "col-schedule",
              "elements": [
                {
                  "id": "schedule-section",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "section" }
                  },
                  "elements": [
                    {
                      "id": "schedule-heading",
                      "type": "markup",
                      "data": { "content": "Schedule" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 2 }
                      }
                    },
                    {
                      "id": "schedule-tabs",
                      "type": "structure",
                      "settings": {
                        "structure": { "structureType": "tabs" }
                      },
                      "elements": [
                        {
                          "id": "tab-day1",
                          "type": "record",
                          "settings": {
                            "record": {
                              "recordType": "timeline",
                              "timeFormat": "h:mm A",
                              "groupBy": "time"
                            },
                            "data": {
                              "bindingMode": "bound-read",
                              "binding": {
                                "source": "collection.schedule",
                                "filter": "day == 1",
                                "sort": "startTime:asc"
                              }
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "zone-cta",
      "name": "CTA",
      "width": "100vw",
      "containerWidth": "full",
      "rows": [
        {
          "id": "row-cta",
          "columns": [
            {
              "id": "col-cta",
              "elements": [
                {
                  "id": "cta-structure",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "section",
                      "fullWidth": true
                    },
                    "layout": {
                      "padding": "{{theme.spacing.4xl}} {{theme.spacing.lg}}",
                      "textAlign": "center"
                    },
                    "appearance": {
                      "background": "{{theme.colors.primary.500}}"
                    }
                  },
                  "elements": [
                    {
                      "id": "cta-heading",
                      "type": "markup",
                      "data": { "content": "Ready to Join?" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 2 },
                        "typography": {
                          "fontSize": "{{theme.typography.sizes.4xl}}",
                          "color": "{{theme.colors.white}}"
                        }
                      }
                    },
                    {
                      "id": "cta-button",
                      "type": "markup",
                      "data": { "content": "Register Now" },
                      "settings": {
                        "markup": { "markupType": "button", "variant": "secondary", "size": "lg" },
                        "appearance": {
                          "background": "{{theme.colors.white}}",
                          "color": "{{theme.colors.primary.500}}"
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Key Capabilities Demonstrated
1. ✅ **Full-Width Sections** - Edge-to-edge layouts
2. ✅ **Constrained Content** - Max-width for readability
3. ✅ **Collection Rendering** - Speaker grid from database
4. ✅ **Item Templates** - Reusable card layouts
5. ✅ **Tabs/Multi-State** - Schedule by day
6. ✅ **Background Images** - Hero with overlay

### Technical Challenges
- **Responsive Images:** Srcset for different screen sizes
- **Performance:** Lazy load images below fold
- **Animations:** Scroll-triggered fade-ins
- **Forms:** Multi-step registration with progress

---

## Example 3: Application Submission

### Overview
**Use Case:** HR/Admissions application submission with canvas-based form and field-level discussions
**Layout:** Full-width 3-column (left nav 240px, center fluid with canvas, right details 360px)
**Primary Vertical:** HR, Admissions, Recruiting
**Inspiration:** Greenhouse, Lever, Workday, Typeform

### Unique Features
1. **Canvas-Based Form** - Application form rendered in canvas element (like Figma/Miro)
2. **Field-Level Discussions** - Comments and threads attached to specific form fields
3. **Visual Form Builder** - Drag-and-drop form design with live preview
4. **Application Status** - Workflow stages with history
5. **Payment Integration** - View invoices, process application fees
6. **Collaborative Review** - Multiple reviewers can comment on specific fields
7. **Form Validation** - Real-time validation with visual feedback

### Layout Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│ Global Bar                                                       │
├────────┬──────────────────────────────────────────┬─────────────┤
│ Left   │ Center (Fluid) - CANVAS VIEW             │ Right       │
│ Nav    │                                          │ Details     │
│ 240px  │  ┌──────────────────────────────────┐   │ 360px       │
│        │  │ Application Form                 │   │             │
│ • Form │  │ Position: Senior Engineer        │   │ Status:     │
│ • Resume │ Applicant: John Doe              │   │ ● Draft     │
│ • Review │  └──────────────────────────────────┘ │             │
│ • Discuss│                                        │ Progress:   │
│ • History│  ┌─────────────────────────────────┐  │ 60% (3/5)   │
│        │  │ CANVAS (Form in Canvas Element)  │  │             │
│        │  │                                  │  │ Required:   │
│        │  │ ┌──────────────────────────┐    │  │ ✓ Name      │
│        │  │ │ Full Name *              │ 💬 │  │ ✓ Email     │
│        │  │ │ [John Doe___________]    │    │  │ ✓ Phone     │
│        │  │ └──────────────────────────┘    │  │ ⬜ Resume   │
│        │  │ [2 comments]                    │  │ ⬜ Cover    │
│        │  │                                  │  │             │
│        │  │ ┌──────────────────────────┐    │  │ Comments:   │
│        │  │ │ Email Address *          │ 💬 │  │ 8 total     │
│        │  │ │ [john@example.com____]   │    │  │ 3 unread    │
│        │  │ └──────────────────────────┘    │  │             │
│        │  │ [1 comment]                     │  │ Fee:        │
│        │  │                                  │  │ $50.00      │
│        │  │ ┌──────────────────────────┐    │  │ ⬜ Unpaid   │
│        │  │ │ Phone *                  │ 💬 │  │             │
│        │  │ │ [(555) 123-4567______]   │    │  │ Actions:    │
│        │  │ └──────────────────────────┘    │  │ [Save       │
│        │  │ [0 comments]                    │  │  Draft]     │
│        │  │                                  │  │ [Submit]    │
│        │  │ ┌──────────────────────────┐    │  │ [Preview]   │
│        │  │ │ Resume Upload *          │ 💬 │  │             │
│        │  │ │ [Drop file or click___]  │    │  │             │
│        │  │ └──────────────────────────┘    │  │             │
│        │  │ [3 comments - @sarah: Need  │  │             │
│        │  │  updated format]                │  │             │
│        │  │                                  │  │             │
│        │  │ [Pan & Zoom: 100%]              │  │             │
│        │  └─────────────────────────────────┘  │             │
└────────┴──────────────────────────────────────────┴─────────────┘

When clicking 💬 on a field:
- Discussion panel slides in from right showing field-specific comments
- Can @mention reviewers
- Comments are anchored to that specific field
- Real-time updates via WebSocket
```

### Key Capabilities Demonstrated
1. ✅ **Canvas-Based Form Rendering** - Form displayed in canvas element for flexibility
2. ✅ **Field-Level Discussions** - Comments attached to specific fields (💬 icons)
3. ✅ **Collaborative Review** - Multiple reviewers comment on specific fields
4. ✅ **Real-time Validation** - Visual feedback on field completion
5. ✅ **Status Workflow** - Draft → Submitted → Under Review → Approved
6. ✅ **Payment Integration** - Application fee tracking
7. ✅ **Pan/Zoom Canvas** - Navigate large forms easily
8. ✅ **Progress Tracking** - % complete, required fields checklist

### Technical Challenges
- **Canvas Integration:** Render form fields within canvas element (HTML5 Canvas or SVG)
- **Field-Level Comments:** Anchor discussions to specific fields with coordinates
- **Real-time Sync:** WebSocket for live comments and form updates
- **Form State Management:** Track field values, validation, discussions
- **Responsive Canvas:** Handle zoom/pan while maintaining field interactivity
- **Comment Threading:** Nested replies for field discussions

---

## Example 4: Dashboard

### Overview
**Use Case:** Business intelligence dashboard with draggable/resizable widgets
**Layout:** Grid-based with react-grid-layout
**Primary Vertical:** Analytics, BI, Reporting
**Inspiration:** Tableau, Looker, Metabase

### Unique Features
1. **Draggable Widgets** - react-grid-layout integration
2. **Resizable Panels** - Adjust widget dimensions
3. **Chart Types** - Line, bar, pie, area, scatter
4. **Real-time Data** - Live updates via WebSocket
5. **Date Range Picker** - Global filter for all widgets
6. **Export/Share** - PDF, PNG, shareable links

### Layout Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│ Dashboard: Sales Overview                [Date Picker] [Export] │
├─────────────────────────────────────────────────────────────────┤
│ ┌────────────────┬────────────────┬────────────────┐            │
│ │ Revenue        │ New Customers  │ Conversion     │            │
│ │ $245,000       │ 1,234          │ 3.4%           │            │
│ │ +12% ↑         │ +8% ↑          │ -0.2% ↓        │            │
│ └────────────────┴────────────────┴────────────────┘            │
│                                                                  │
│ ┌───────────────────────────────────────┬─────────────────────┐ │
│ │ Revenue Over Time (Line Chart)        │ Top Products (Pie)  │ │
│ │                                       │                     │ │
│ │     $                                 │      ╱╲             │ │
│ │  250k│      ╱╲                        │     ╱  ╲            │ │
│ │  200k│     ╱  ╲       ╱╲              │    │    │  Product A│ │
│ │  150k│    ╱    ╲     ╱  ╲             │     ╲  ╱   Product B│ │
│ │  100k│___╱______╲___╱____╲___         │      ╲╱    Product C│ │
│ │      Jan Feb Mar Apr May Jun          │                     │ │
│ │ [Drag handle]                         │ [Drag handle]       │ │
│ └───────────────────────────────────────┴─────────────────────┘ │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ Recent Orders (Data Grid)                                  │  │
│ │ Order ID   Customer      Amount    Status       Date       │  │
│ │ #12345     Acme Corp     $5,200    Shipped      Nov 20     │  │
│ │ #12346     Smith LLC     $3,100    Processing   Nov 20     │  │
│ │ #12347     Jones Inc     $8,900    Delivered    Nov 19     │  │
│ │ [Drag handle]                                              │  │
│ └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Domain Architecture Mapping

```javascript
{
  "id": "page-dashboard",
  "type": "page",
  "meta": {
    "title": "Sales Dashboard",
    "layout": "dashboard-grid"
  },
  "zones": [
    {
      "id": "zone-dashboard",
      "name": "Dashboard",
      "layoutEngine": "react-grid-layout",
      "rows": [
        {
          "id": "row-grid",
          "columns": [
            {
              "id": "col-grid",
              "elements": [
                {
                  "id": "dashboard-grid",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "dashboard-grid",
                      "cols": 12,
                      "rowHeight": 60,
                      "draggable": true,
                      "resizable": true,
                      "compactType": "vertical"
                    }
                  },
                  "elements": [
                    {
                      "id": "widget-revenue",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "kpi-card",
                          "metricType": "currency"
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "metrics.revenue",
                            "aggregation": "sum",
                            "dateRange": "{{global.dateRange}}",
                            "realtime": true
                          }
                        },
                        "grid": {
                          "x": 0,
                          "y": 0,
                          "w": 4,
                          "h": 2,
                          "minW": 3,
                          "minH": 2
                        }
                      }
                    },
                    {
                      "id": "widget-customers",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "kpi-card",
                          "metricType": "number"
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "metrics.newCustomers",
                            "aggregation": "count",
                            "dateRange": "{{global.dateRange}}"
                          }
                        },
                        "grid": {
                          "x": 4,
                          "y": 0,
                          "w": 4,
                          "h": 2
                        }
                      }
                    },
                    {
                      "id": "widget-conversion",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "kpi-card",
                          "metricType": "percentage"
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "metrics.conversionRate",
                            "dateRange": "{{global.dateRange}}"
                          }
                        },
                        "grid": {
                          "x": 8,
                          "y": 0,
                          "w": 4,
                          "h": 2
                        }
                      }
                    },
                    {
                      "id": "widget-revenue-chart",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "chart",
                          "chartType": "line",
                          "xAxis": "date",
                          "yAxis": "revenue",
                          "title": "Revenue Over Time"
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "timeseries.revenue",
                            "groupBy": "day",
                            "dateRange": "{{global.dateRange}}",
                            "realtime": true
                          }
                        },
                        "grid": {
                          "x": 0,
                          "y": 2,
                          "w": 8,
                          "h": 6,
                          "minW": 6,
                          "minH": 4
                        }
                      }
                    },
                    {
                      "id": "widget-products-pie",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "chart",
                          "chartType": "pie",
                          "title": "Top Products"
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "metrics.topProducts",
                            "groupBy": "productName",
                            "aggregation": "sum:revenue",
                            "limit": 5,
                            "dateRange": "{{global.dateRange}}"
                          }
                        },
                        "grid": {
                          "x": 8,
                          "y": 2,
                          "w": 4,
                          "h": 6
                        }
                      }
                    },
                    {
                      "id": "widget-orders-grid",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "data-grid",
                          "columns": [
                            { "field": "orderId", "header": "Order ID", "width": 120 },
                            { "field": "customer", "header": "Customer", "width": 200 },
                            { "field": "amount", "header": "Amount", "width": 120, "format": "currency" },
                            { "field": "status", "header": "Status", "width": 120 },
                            { "field": "date", "header": "Date", "width": 120, "format": "date" }
                          ],
                          "pageSize": 10,
                          "sortable": true,
                          "title": "Recent Orders"
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "collection.orders",
                            "sort": "date:desc",
                            "limit": 10,
                            "realtime": true
                          }
                        },
                        "grid": {
                          "x": 0,
                          "y": 8,
                          "w": 12,
                          "h": 6,
                          "minW": 8,
                          "minH": 4
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "globalState": {
    "dateRange": {
      "start": "2025-11-01",
      "end": "2025-11-30"
    }
  }
}
```

### Key Capabilities Demonstrated
1. ✅ **Grid Layout Engine** - react-grid-layout integration
2. ✅ **Draggable/Resizable** - User-customizable dashboards
3. ✅ **Multiple Chart Types** - Line, pie, bar, area
4. ✅ **Real-time Data** - Live updates for metrics
5. ✅ **Global Filters** - Date range affects all widgets
6. ✅ **Aggregations** - Sum, count, average, group by

### Technical Challenges
- **react-grid-layout Integration:** Wrap structure element with RGL
- **Chart Library:** Recharts or Victory for React charts
- **Performance:** Virtualize large datasets, debounce updates
- **State Persistence:** Save layout to database

---

## Example 5: New Page (Notion Style)

### Overview
**Use Case:** Block-based document editor with slash commands
**Layout:** Single-column fluid (max-width: 900px for readability)
**Primary Vertical:** CMS, Documentation, Knowledge Base
**Inspiration:** Notion, Coda, Confluence

### Unique Features
1. **Block-Based Editor** - Each paragraph/image/table is a block
2. **Slash Commands** - Type "/" to insert blocks
3. **Nested Blocks** - Indent/outdent for hierarchy
4. **Live Collaboration** - See other users' cursors
5. **@Mentions** - Reference people, pages, dates
6. **Templates** - Pre-built page layouts
7. **Databases** - Embedded tables, boards, galleries

### Layout Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│ [< Back]  [Share] [•••]                                         │
├─────────────────────────────────────────────────────────────────┤
│                   (Constrained: max-width 900px)                │
│                                                                  │
│  📄 Product Roadmap Q1 2025                                     │
│     ───────────────────────────                                 │
│                                                                  │
│     [Type "/" for commands...]                                  │
│                                                                  │
│     ┌─ Heading 1 ──────────────────────────────────────┐       │
│     │ Overview                                          │       │
│     └───────────────────────────────────────────────────┘       │
│                                                                  │
│     ┌─ Text Block ────────────────────────────────────┐        │
│     │ This quarter we're focusing on three key         │        │
│     │ initiatives to improve our product...             │        │
│     └───────────────────────────────────────────────────┘       │
│                                                                  │
│     ┌─ Bulleted List ─────────────────────────────────┐        │
│     │ • Initiative 1: Improve performance               │        │
│     │ • Initiative 2: Add collaboration features        │        │
│     │ • Initiative 3: Mobile app launch                 │        │
│     └───────────────────────────────────────────────────┘       │
│                                                                  │
│     ┌─ Heading 2 ──────────────────────────────────────┐       │
│     │ Timeline                                          │       │
│     └───────────────────────────────────────────────────┘       │
│                                                                  │
│     ┌─ Database (Table View) ─────────────────────────┐        │
│     │ Task                | Owner    | Status | Due    │        │
│     │ ────────────────────|──────────|────────|────────│        │
│     │ Performance audit   | Sarah    | Done   | Jan 15 │        │
│     │ Collab UI design    | Mike     | In Prog| Jan 30 │        │
│     │ Mobile prototype    | Emma     | Todo   | Feb 15 │        │
│     │ [+ New]                                          │        │
│     └───────────────────────────────────────────────────┘       │
│                                                                  │
│     ┌─ Callout Block ─────────────────────────────────┐        │
│     │ 💡 Note: We'll need to hire 2 mobile engineers   │        │
│     │    before we can start the mobile app work.      │        │
│     └───────────────────────────────────────────────────┘       │
│                                                                  │
│     ┌─ Image Block ───────────────────────────────────┐        │
│     │ [Uploaded Image]                                 │        │
│     │ Caption: Design mockup for mobile app            │        │
│     └───────────────────────────────────────────────────┘       │
│                                                                  │
│     [+]  Type "/" for commands                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Domain Architecture Mapping

```javascript
{
  "id": "page-notion-style",
  "type": "page",
  "meta": {
    "title": "Product Roadmap Q1 2025",
    "icon": "📄",
    "layout": "document",
    "collaborative": true
  },
  "zones": [
    {
      "id": "zone-document",
      "name": "Document",
      "containerWidth": "900px",
      "centerAlign": true,
      "rows": [
        {
          "id": "row-title",
          "columns": [
            {
              "id": "col-title",
              "elements": [
                {
                  "id": "page-title",
                  "type": "field",
                  "data": { "value": "Product Roadmap Q1 2025" },
                  "settings": {
                    "field": {
                      "fieldType": "text",
                      "label": null,
                      "placeholder": "Untitled",
                      "inlineEdit": true,
                      "singleLine": true
                    },
                    "data": {
                      "bindingMode": "bound-bidirectional",
                      "binding": {
                        "source": "page.current",
                        "property": "title",
                        "mode": "bidirectional",
                        "debounce": 500
                      }
                    },
                    "typography": {
                      "fontSize": "{{theme.typography.sizes.4xl}}",
                      "fontWeight": "{{theme.typography.weights.bold}}"
                    },
                    "layout": {
                      "margin": "{{theme.spacing.xl}} 0"
                    }
                  }
                }
              ]
            }
          ]
        },
        {
          "id": "row-blocks",
          "columns": [
            {
              "id": "col-blocks",
              "elements": [
                {
                  "id": "block-editor",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "block-editor",
                      "allowedBlocks": [
                        "heading",
                        "text",
                        "bulleted-list",
                        "numbered-list",
                        "todo-list",
                        "toggle",
                        "quote",
                        "callout",
                        "code",
                        "image",
                        "video",
                        "divider",
                        "table",
                        "database"
                      ],
                      "slashCommands": true,
                      "markdown": true,
                      "dragHandle": true
                    },
                    "data": {
                      "bindingMode": "bound-bidirectional",
                      "binding": {
                        "source": "page.current",
                        "property": "blocks",
                        "mode": "bidirectional",
                        "autosave": true,
                        "debounce": 1000
                      }
                    }
                  },
                  "elements": [
                    {
                      "id": "block-1",
                      "type": "markup",
                      "data": { "content": "Overview" },
                      "settings": {
                        "markup": {
                          "markupType": "heading",
                          "level": 1,
                          "blockType": "heading"
                        },
                        "block": {
                          "id": "block-1",
                          "type": "heading1",
                          "order": 1,
                          "indent": 0
                        }
                      }
                    },
                    {
                      "id": "block-2",
                      "type": "field",
                      "data": { "value": "This quarter we're focusing on three key initiatives to improve our product..." },
                      "settings": {
                        "field": {
                          "fieldType": "textarea",
                          "label": null,
                          "placeholder": "Type something or type '/' for commands",
                          "autosize": true,
                          "inlineEdit": true
                        },
                        "block": {
                          "id": "block-2",
                          "type": "text",
                          "order": 2,
                          "indent": 0
                        },
                        "data": {
                          "bindingMode": "bound-write",
                          "binding": {
                            "source": "page.current.blocks",
                            "property": "block-2.content"
                          }
                        }
                      }
                    },
                    {
                      "id": "block-3",
                      "type": "structure",
                      "settings": {
                        "structure": {
                          "structureType": "list",
                          "listType": "bulleted"
                        },
                        "block": {
                          "id": "block-3",
                          "type": "bulleted-list",
                          "order": 3,
                          "indent": 0
                        }
                      },
                      "elements": [
                        {
                          "id": "block-3-1",
                          "type": "markup",
                          "data": { "content": "Initiative 1: Improve performance" },
                          "settings": {
                            "markup": { "markupType": "list-item" }
                          }
                        },
                        {
                          "id": "block-3-2",
                          "type": "markup",
                          "data": { "content": "Initiative 2: Add collaboration features" },
                          "settings": {
                            "markup": { "markupType": "list-item" }
                          }
                        },
                        {
                          "id": "block-3-3",
                          "type": "markup",
                          "data": { "content": "Initiative 3: Mobile app launch" },
                          "settings": {
                            "markup": { "markupType": "list-item" }
                          }
                        }
                      ]
                    },
                    {
                      "id": "block-4",
                      "type": "markup",
                      "data": { "content": "Timeline" },
                      "settings": {
                        "markup": {
                          "markupType": "heading",
                          "level": 2,
                          "blockType": "heading"
                        },
                        "block": {
                          "id": "block-4",
                          "type": "heading2",
                          "order": 4,
                          "indent": 0
                        }
                      }
                    },
                    {
                      "id": "block-5",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "database",
                          "databaseType": "table",
                          "columns": [
                            { "id": "col-task", "name": "Task", "type": "text" },
                            { "id": "col-owner", "name": "Owner", "type": "person" },
                            { "id": "col-status", "name": "Status", "type": "select", "options": ["Todo", "In Progress", "Done"] },
                            { "id": "col-due", "name": "Due Date", "type": "date" }
                          ],
                          "views": [
                            { "id": "view-table", "name": "Table", "type": "table" },
                            { "id": "view-board", "name": "Board", "type": "kanban", "groupBy": "col-status" },
                            { "id": "view-timeline", "name": "Timeline", "type": "timeline", "dateField": "col-due" }
                          ],
                          "allowAdd": true,
                          "allowDelete": true
                        },
                        "data": {
                          "bindingMode": "bound-bidirectional",
                          "binding": {
                            "source": "database.tasks",
                            "filter": "project == 'Q1 Roadmap'"
                          }
                        },
                        "block": {
                          "id": "block-5",
                          "type": "database",
                          "order": 5,
                          "indent": 0
                        }
                      }
                    },
                    {
                      "id": "block-6",
                      "type": "structure",
                      "settings": {
                        "structure": {
                          "structureType": "callout",
                          "icon": "💡"
                        },
                        "appearance": {
                          "background": "{{theme.colors.info.50}}",
                          "border": "1px solid {{theme.colors.info.200}}",
                          "borderRadius": "{{theme.borders.radius.md}}",
                          "padding": "{{theme.spacing.md}}"
                        },
                        "block": {
                          "id": "block-6",
                          "type": "callout",
                          "order": 6,
                          "indent": 0
                        }
                      },
                      "elements": [
                        {
                          "id": "callout-text",
                          "type": "markup",
                          "data": { "content": "Note: We'll need to hire 2 mobile engineers before we can start the mobile app work." },
                          "settings": {
                            "markup": { "markupType": "text" }
                          }
                        }
                      ]
                    },
                    {
                      "id": "block-7",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "image",
                          "caption": "Design mockup for mobile app",
                          "aspectRatio": "16/9"
                        },
                        "data": {
                          "bindingMode": "static",
                          "value": "/uploads/mobile-mockup.png"
                        },
                        "block": {
                          "id": "block-7",
                          "type": "image",
                          "order": 7,
                          "indent": 0
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Key Capabilities Demonstrated
1. ✅ **Block-Based Editor** - Modular content blocks
2. ✅ **Slash Commands** - Type "/" to insert blocks
3. ✅ **Nested Blocks** - Hierarchy with indent/outdent
4. ✅ **Inline Editing** - Click to edit text
5. ✅ **Embedded Databases** - Tables, boards, timelines
6. ✅ **Autosave** - Debounced bidirectional binding
7. ✅ **Drag to Reorder** - Move blocks up/down

### Technical Challenges
- **Block Management:** Add, delete, reorder, indent/outdent
- **Slash Commands:** Autocomplete menu with fuzzy search
- **Collaborative Editing:** Operational Transform or CRDT
- **Performance:** Virtualize long documents

---

## Example 6: New Canvas (Figma Style)

### Overview
**Use Case:** Infinite canvas for diagramming, wireframing, mind mapping
**Layout:** Infinite canvas with pan/zoom
**Primary Vertical:** Design, Diagramming, Whiteboard
**Inspiration:** Figma, Miro, TLDraw

### Unique Features
1. **Infinite Canvas** - Pan and zoom with mouse/trackpad
2. **Shapes & Objects** - Rectangles, circles, arrows, text
3. **Free Positioning** - Absolute X/Y coordinates
4. **Layers & Groups** - Z-index management
5. **Connectors** - Auto-routing lines between objects
6. **Templates** - Flowchart, wireframe, mind map
7. **Collaborative Cursors** - See other users in real-time

### Layout Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│ [Tools: ▢ ○ ─ ✎ T] [Zoom: 100%] [Share] [Export]              │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│            INFINITE CANVAS (pan/zoom)                           │
│                                                                  │
│                ┌──────────────┐                                 │
│                │ Start        │                                 │
│                └──────┬───────┘                                 │
│                       │                                         │
│                       ↓                                         │
│                ┌──────────────┐                                 │
│                │ Process Data │                                 │
│                └──────┬───────┘                                 │
│                       │                                         │
│                  ┌────┴────┐                                    │
│                  │         │                                    │
│                  ↓         ↓                                    │
│           ┌──────────┐ ┌──────────┐                            │
│           │ Valid?   │ │ Error    │                            │
│           └─────┬────┘ └──────────┘                            │
│                 │                                               │
│                 ↓                                               │
│           ┌──────────────┐                                      │
│           │ End          │                                      │
│           └──────────────┘                                      │
│                                                                  │
│                                                                  │
│    [Minimap]                                                    │
│    ┌─────┐                                                      │
│    │  •  │                                                      │
│    └─────┘                                                      │
└─────────────────────────────────────────────────────────────────┘
```

### Domain Architecture Mapping

```javascript
{
  "id": "page-canvas",
  "type": "page",
  "meta": {
    "title": "User Flow Diagram",
    "layout": "infinite-canvas"
  },
  "zones": [
    {
      "id": "zone-canvas",
      "name": "Canvas",
      "layoutEngine": "canvas",
      "rows": [
        {
          "id": "row-canvas",
          "columns": [
            {
              "id": "col-canvas",
              "elements": [
                {
                  "id": "canvas",
                  "type": "structure",
                  "settings": {
                    "structure": {
                      "structureType": "canvas",
                      "infinite": true,
                      "pan": true,
                      "zoom": true,
                      "zoomRange": [0.1, 5.0],
                      "grid": true,
                      "gridSize": 20,
                      "snapToGrid": true,
                      "collaborative": true
                    },
                    "data": {
                      "bindingMode": "bound-bidirectional",
                      "binding": {
                        "source": "canvas.current",
                        "property": "objects",
                        "mode": "bidirectional",
                        "autosave": true
                      }
                    }
                  },
                  "elements": [
                    {
                      "id": "shape-start",
                      "type": "structure",
                      "settings": {
                        "structure": {
                          "structureType": "canvas-object",
                          "objectType": "rectangle",
                          "rounded": true
                        },
                        "canvas": {
                          "x": 400,
                          "y": 100,
                          "width": 150,
                          "height": 60,
                          "rotation": 0,
                          "zIndex": 1,
                          "locked": false,
                          "draggable": true,
                          "resizable": true
                        },
                        "appearance": {
                          "background": "{{theme.colors.primary.100}}",
                          "border": "2px solid {{theme.colors.primary.500}}",
                          "borderRadius": "{{theme.borders.radius.lg}}"
                        }
                      },
                      "elements": [
                        {
                          "id": "text-start",
                          "type": "markup",
                          "data": { "content": "Start" },
                          "settings": {
                            "markup": { "markupType": "text" },
                            "typography": {
                              "fontSize": "{{theme.typography.sizes.lg}}",
                              "fontWeight": "{{theme.typography.weights.semibold}}",
                              "textAlign": "center"
                            },
                            "layout": {
                              "display": "flex",
                              "alignItems": "center",
                              "justifyContent": "center",
                              "width": "100%",
                              "height": "100%"
                            }
                          }
                        }
                      ]
                    },
                    {
                      "id": "connector-1",
                      "type": "structure",
                      "settings": {
                        "structure": {
                          "structureType": "canvas-connector",
                          "connectorType": "arrow",
                          "from": "shape-start",
                          "to": "shape-process",
                          "fromAnchor": "bottom",
                          "toAnchor": "top",
                          "autoRoute": true
                        },
                        "appearance": {
                          "stroke": "{{theme.colors.gray.400}}",
                          "strokeWidth": 2,
                          "arrowHead": "filled"
                        },
                        "canvas": {
                          "zIndex": 0
                        }
                      }
                    },
                    {
                      "id": "shape-process",
                      "type": "structure",
                      "settings": {
                        "structure": {
                          "structureType": "canvas-object",
                          "objectType": "rectangle"
                        },
                        "canvas": {
                          "x": 400,
                          "y": 200,
                          "width": 150,
                          "height": 60,
                          "zIndex": 1
                        },
                        "appearance": {
                          "background": "{{theme.colors.blue.100}}",
                          "border": "2px solid {{theme.colors.blue.500}}"
                        }
                      },
                      "elements": [
                        {
                          "id": "text-process",
                          "type": "markup",
                          "data": { "content": "Process Data" },
                          "settings": {
                            "markup": { "markupType": "text" },
                            "typography": {
                              "textAlign": "center"
                            }
                          }
                        }
                      ]
                    },
                    {
                      "id": "shape-decision",
                      "type": "structure",
                      "settings": {
                        "structure": {
                          "structureType": "canvas-object",
                          "objectType": "diamond"
                        },
                        "canvas": {
                          "x": 400,
                          "y": 300,
                          "width": 150,
                          "height": 80,
                          "zIndex": 1
                        },
                        "appearance": {
                          "background": "{{theme.colors.yellow.100}}",
                          "border": "2px solid {{theme.colors.yellow.500}}"
                        }
                      },
                      "elements": [
                        {
                          "id": "text-decision",
                          "type": "markup",
                          "data": { "content": "Valid?" },
                          "settings": {
                            "markup": { "markupType": "text" }
                          }
                        }
                      ]
                    },
                    {
                      "id": "shape-end",
                      "type": "structure",
                      "settings": {
                        "structure": {
                          "structureType": "canvas-object",
                          "objectType": "rectangle",
                          "rounded": true
                        },
                        "canvas": {
                          "x": 300,
                          "y": 450,
                          "width": 150,
                          "height": 60,
                          "zIndex": 1
                        },
                        "appearance": {
                          "background": "{{theme.colors.green.100}}",
                          "border": "2px solid {{theme.colors.green.500}}",
                          "borderRadius": "{{theme.borders.radius.lg}}"
                        }
                      },
                      "elements": [
                        {
                          "id": "text-end",
                          "type": "markup",
                          "data": { "content": "End" },
                          "settings": {
                            "markup": { "markupType": "text" }
                          }
                        }
                      ]
                    },
                    {
                      "id": "shape-error",
                      "type": "structure",
                      "settings": {
                        "structure": {
                          "structureType": "canvas-object",
                          "objectType": "rectangle"
                        },
                        "canvas": {
                          "x": 600,
                          "y": 300,
                          "width": 150,
                          "height": 60,
                          "zIndex": 1
                        },
                        "appearance": {
                          "background": "{{theme.colors.red.100}}",
                          "border": "2px solid {{theme.colors.red.500}}"
                        }
                      },
                      "elements": [
                        {
                          "id": "text-error",
                          "type": "markup",
                          "data": { "content": "Error" },
                          "settings": {
                            "markup": { "markupType": "text" }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Key Capabilities Demonstrated
1. ✅ **Infinite Canvas** - Pan and zoom
2. ✅ **Absolute Positioning** - X/Y coordinates
3. ✅ **Shapes & Objects** - Rectangles, diamonds, circles
4. ✅ **Connectors** - Auto-routing arrows between objects
5. ✅ **Z-Index Management** - Layer ordering
6. ✅ **Drag & Drop** - Move objects freely
7. ✅ **Collaborative Cursors** - Real-time multiplayer

### Technical Challenges
- **Canvas Rendering:** Use HTML5 Canvas or SVG
- **Pan/Zoom:** Transform matrix for viewport
- **Collision Detection:** Snap to grid, align guides
- **Connectors:** Path-finding algorithms (A*)
- **Performance:** Virtual canvas for 1000+ objects

---

## Example 7: Article (Magazine Style)

### Overview
**Use Case:** Long-form editorial content with rich typography
**Layout:** Article layout with sidebar (TOC, related articles)
**Primary Vertical:** Publishing, Editorial, Blogging
**Inspiration:** Medium, Substack, New York Times

### Unique Features
1. **Article Layout** - Optimized for readability (line length, spacing)
2. **Drop Cap** - Large first letter
3. **Pull Quotes** - Highlighted quotes in sidebar
4. **Table of Contents** - Auto-generated from headings
5. **Related Articles** - Algorithmically suggested
6. **Reading Time** - Estimated time to read
7. **Social Sharing** - Twitter, LinkedIn, copy link

### Layout Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│ [Site Header: Logo, Nav]                                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────┬────────────────┐ │
│  │ Article Content (max-width 720px)        │ Sidebar        │ │
│  │                                           │ (320px fixed)  │ │
│  │ ┌───────────────────────────────────────┐│                │ │
│  │ │ Hero Image (full-bleed)               ││ ┌────────────┐ │ │
│  │ │ [Large featured image]                ││ │ TOC        │ │ │
│  │ └───────────────────────────────────────┘│ │ • Intro    │ │ │
│  │                                           │ │ • History  │ │ │
│  │ The Future of AI                         │ │ • Present  │ │ │
│  │ ═══════════════════════                  │ │ • Future   │ │ │
│  │                                           │ └────────────┘ │ │
│  │ By Sarah Johnson • 12 min read • Nov 21  │                │ │
│  │                                           │ ┌────────────┐ │ │
│  │ Lorem ipsum dolor sit amet, consectetur  │ │ Share      │ │ │
│  │ adipiscing elit. Sed do eiusmod tempor   │ │ [Twitter]  │ │ │
│  │ incididunt ut labore et dolore magna     │ │ [LinkedIn] │ │ │
│  │ aliqua.                                   │ │ [Copy]     │ │ │
│  │                                           │ └────────────┘ │ │
│  │ Heading: The Early Days                  │                │ │
│  │ ─────────────────────                    │ ┌────────────┐ │ │
│  │                                           │ │ Related    │ │ │
│  │ Ut enim ad minim veniam, quis nostrud    │ │            │ │ │
│  │ exercitation ullamco laboris nisi ut     │ │ • Article 1│ │ │
│  │ aliquip ex ea commodo consequat.         │ │ • Article 2│ │ │
│  │                                           │ │ • Article 3│ │ │
│  │ [Inline Image]                           │ └────────────┘ │ │
│  │ Caption: AI through the years            │                │ │
│  │                                           │                │ │
│  │ Duis aute irure dolor in reprehenderit  │                │ │
│  │ in voluptate velit esse cillum dolore    │                │ │
│  │ eu fugiat nulla pariatur.                │                │ │
│  │                                           │                │ │
│  │ ┌────────────────────────────────────┐   │                │ │
│  │ │ "The future is already here — it's  │   │                │ │
│  │ │  just not very evenly distributed."  │   │                │ │
│  │ │           - William Gibson           │   │                │ │
│  │ └────────────────────────────────────┘   │                │ │
│  │                                           │                │ │
│  └───────────────────────────────────────────┴────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Domain Architecture Mapping

```javascript
{
  "id": "page-article",
  "type": "page",
  "meta": {
    "title": "The Future of AI",
    "author": "Sarah Johnson",
    "publishDate": "2025-11-21",
    "readingTime": 12,
    "layout": "article"
  },
  "zones": [
    {
      "id": "zone-hero",
      "name": "Hero",
      "width": "100vw",
      "containerWidth": "full",
      "rows": [
        {
          "id": "row-hero",
          "columns": [
            {
              "id": "col-hero",
              "elements": [
                {
                  "id": "hero-image",
                  "type": "record",
                  "settings": {
                    "record": {
                      "recordType": "image",
                      "aspectRatio": "21/9",
                      "fullWidth": true
                    },
                    "data": {
                      "bindingMode": "bound-read",
                      "binding": {
                        "source": "record.article",
                        "property": "heroImage"
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "zone-content",
      "name": "Content",
      "containerWidth": "1280px",
      "centerAlign": true,
      "rows": [
        {
          "id": "row-main",
          "columns": [
            {
              "id": "col-article",
              "width": "720px",
              "elements": [
                {
                  "id": "article-header",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "section" },
                    "layout": {
                      "padding": "{{theme.spacing.2xl}} 0"
                    }
                  },
                  "elements": [
                    {
                      "id": "article-title",
                      "type": "markup",
                      "data": { "content": "The Future of AI" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 1 },
                        "typography": {
                          "fontSize": "{{theme.typography.sizes.5xl}}",
                          "fontWeight": "{{theme.typography.weights.bold}}",
                          "lineHeight": "1.2",
                          "fontFamily": "{{theme.typography.fonts.serif}}"
                        }
                      }
                    },
                    {
                      "id": "article-meta",
                      "type": "structure",
                      "settings": {
                        "structure": { "structureType": "flex" },
                        "layout": {
                          "direction": "horizontal",
                          "gap": "{{theme.spacing.md}}",
                          "alignItems": "center"
                        },
                        "appearance": {
                          "color": "{{theme.colors.text.secondary}}"
                        }
                      },
                      "elements": [
                        {
                          "id": "author",
                          "type": "markup",
                          "data": { "content": "By Sarah Johnson" },
                          "settings": {
                            "markup": { "markupType": "text" }
                          }
                        },
                        {
                          "id": "reading-time",
                          "type": "markup",
                          "data": { "content": "12 min read" },
                          "settings": {
                            "markup": { "markupType": "text" }
                          }
                        },
                        {
                          "id": "publish-date",
                          "type": "markup",
                          "data": { "content": "Nov 21, 2025" },
                          "settings": {
                            "markup": { "markupType": "text" }
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "article-body",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "article" },
                    "typography": {
                      "fontSize": "{{theme.typography.sizes.lg}}",
                      "lineHeight": "1.7",
                      "fontFamily": "{{theme.typography.fonts.serif}}"
                    }
                  },
                  "elements": [
                    {
                      "id": "paragraph-1",
                      "type": "markup",
                      "data": {
                        "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                      },
                      "settings": {
                        "markup": {
                          "markupType": "text",
                          "dropCap": true
                        },
                        "layout": {
                          "margin": "{{theme.spacing.lg}} 0"
                        }
                      }
                    },
                    {
                      "id": "heading-1",
                      "type": "markup",
                      "data": { "content": "The Early Days" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 2 },
                        "typography": {
                          "fontSize": "{{theme.typography.sizes.3xl}}",
                          "fontWeight": "{{theme.typography.weights.bold}}",
                          "fontFamily": "{{theme.typography.fonts.serif}}"
                        },
                        "layout": {
                          "margin": "{{theme.spacing.2xl}} 0 {{theme.spacing.lg}} 0"
                        }
                      }
                    },
                    {
                      "id": "paragraph-2",
                      "type": "markup",
                      "data": {
                        "content": "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
                      },
                      "settings": {
                        "markup": { "markupType": "text" },
                        "layout": {
                          "margin": "{{theme.spacing.lg}} 0"
                        }
                      }
                    },
                    {
                      "id": "inline-image",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "image",
                          "caption": "AI through the years",
                          "aspectRatio": "16/9"
                        },
                        "layout": {
                          "margin": "{{theme.spacing.2xl}} 0"
                        }
                      }
                    },
                    {
                      "id": "blockquote",
                      "type": "structure",
                      "settings": {
                        "structure": { "structureType": "blockquote" },
                        "appearance": {
                          "borderLeft": "4px solid {{theme.colors.primary.500}}",
                          "background": "{{theme.colors.gray.50}}",
                          "padding": "{{theme.spacing.lg}} {{theme.spacing.xl}}"
                        },
                        "layout": {
                          "margin": "{{theme.spacing.2xl}} 0"
                        }
                      },
                      "elements": [
                        {
                          "id": "quote-text",
                          "type": "markup",
                          "data": {
                            "content": "The future is already here — it's just not very evenly distributed."
                          },
                          "settings": {
                            "markup": { "markupType": "text" },
                            "typography": {
                              "fontSize": "{{theme.typography.sizes.xl}}",
                              "fontStyle": "italic",
                              "fontFamily": "{{theme.typography.fonts.serif}}"
                            }
                          }
                        },
                        {
                          "id": "quote-attribution",
                          "type": "markup",
                          "data": { "content": "— William Gibson" },
                          "settings": {
                            "markup": { "markupType": "text" },
                            "typography": {
                              "fontSize": "{{theme.typography.sizes.base}}",
                              "textAlign": "right"
                            },
                            "appearance": {
                              "color": "{{theme.colors.text.secondary}}"
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              "id": "col-sidebar",
              "width": "320px",
              "position": "sticky",
              "top": "80px",
              "elements": [
                {
                  "id": "toc-card",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "card" },
                    "appearance": {
                      "background": "{{theme.colors.surface.secondary}}",
                      "border": "1px solid {{theme.colors.border.default}}",
                      "borderRadius": "{{theme.borders.radius.lg}}",
                      "padding": "{{theme.spacing.lg}}"
                    },
                    "layout": {
                      "margin": "0 0 {{theme.spacing.xl}} 0"
                    }
                  },
                  "elements": [
                    {
                      "id": "toc-heading",
                      "type": "markup",
                      "data": { "content": "Table of Contents" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 4 },
                        "typography": {
                          "fontSize": "{{theme.typography.sizes.sm}}",
                          "fontWeight": "{{theme.typography.weights.semibold}}",
                          "textTransform": "uppercase",
                          "letterSpacing": "0.05em"
                        }
                      }
                    },
                    {
                      "id": "toc-list",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "table-of-contents",
                          "auto": true,
                          "minLevel": 2,
                          "maxLevel": 3
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "page.current",
                            "property": "headings"
                          }
                        }
                      }
                    }
                  ]
                },
                {
                  "id": "share-card",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "card" }
                  },
                  "elements": [
                    {
                      "id": "share-heading",
                      "type": "markup",
                      "data": { "content": "Share" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 4 }
                      }
                    },
                    {
                      "id": "share-buttons",
                      "type": "structure",
                      "settings": {
                        "structure": { "structureType": "flex" },
                        "layout": {
                          "direction": "vertical",
                          "gap": "{{theme.spacing.sm}}"
                        }
                      },
                      "elements": [
                        {
                          "id": "share-twitter",
                          "type": "markup",
                          "data": { "content": "Share on Twitter", "icon": "twitter" },
                          "settings": {
                            "markup": { "markupType": "button", "variant": "secondary" }
                          }
                        },
                        {
                          "id": "share-linkedin",
                          "type": "markup",
                          "data": { "content": "Share on LinkedIn", "icon": "linkedin" },
                          "settings": {
                            "markup": { "markupType": "button", "variant": "secondary" }
                          }
                        },
                        {
                          "id": "share-copy",
                          "type": "markup",
                          "data": { "content": "Copy Link", "icon": "link" },
                          "settings": {
                            "markup": { "markupType": "button", "variant": "secondary" }
                          }
                        }
                      ]
                    }
                  ]
                },
                {
                  "id": "related-card",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "card" }
                  },
                  "elements": [
                    {
                      "id": "related-heading",
                      "type": "markup",
                      "data": { "content": "Related Articles" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 4 }
                      }
                    },
                    {
                      "id": "related-list",
                      "type": "record",
                      "settings": {
                        "record": {
                          "recordType": "article-list",
                          "layout": "compact",
                          "limit": 3
                        },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": {
                            "source": "collection.articles",
                            "filter": "tags ~~ {{record.article.tags}} AND id != {{record.article.id}}",
                            "sort": "relevance:desc",
                            "limit": 3
                          }
                        }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Key Capabilities Demonstrated
1. ✅ **Article Layout** - Optimized typography for readability
2. ✅ **Sticky Sidebar** - TOC stays in view on scroll
3. ✅ **Auto-TOC** - Generated from heading elements
4. ✅ **Drop Cap** - Large first letter styling
5. ✅ **Blockquotes** - Pull quotes with attribution
6. ✅ **Related Content** - Algorithmic suggestions
7. ✅ **Social Sharing** - Twitter, LinkedIn, copy link

### Technical Challenges
- **Reading Time:** Calculate from word count
- **TOC Generation:** Parse headings, generate anchor links
- **Sticky Positioning:** CSS `position: sticky` with fallback
- **Related Articles:** Content similarity algorithm

---

## Example 8: Modern Renewal Email

### Overview
**Use Case:** Email marketing campaign for subscription renewal
**Layout:** Email template (responsive, mobile-first)
**Primary Vertical:** Email Marketing, SaaS, Subscriptions
**Inspiration:** Really Good Emails, Stripe emails, Notion renewal emails

### Unique Features
1. **Hero Image** - Large, compelling visual at top
2. **Minimal Design** - Clean, focused on single CTA
3. **Responsive Email** - Works on desktop and mobile
4. **Email-Safe CSS** - Inline styles, table-based layout
5. **Dynamic Content** - Personalization tokens
6. **A/B Testing Ready** - Multiple variants for testing

### Layout Breakdown

```
┌─────────────────────────────────────────────────────────────────┐
│ EMAIL (max-width: 600px, centered)                              │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [Logo]                                       [View in Web]│  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │                    HERO IMAGE                            │  │
│  │            (Full-width, high-quality)                    │  │
│  │          [Subscription renewal visual]                   │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Hi {{firstName}},                                       │  │
│  │                                                          │  │
│  │  Your subscription to {{productName}} is about to       │  │
│  │  expire on {{expirationDate}}.                          │  │
│  │                                                          │  │
│  │  Don't miss out! Renew today to continue enjoying:      │  │
│  │                                                          │  │
│  │  ✓ Unlimited access to all features                     │  │
│  │  ✓ Priority customer support                            │  │
│  │  ✓ Advanced analytics and reporting                     │  │
│  │  ✓ Exclusive updates and new features                   │  │
│  │                                                          │  │
│  │          ┌─────────────────────────────┐                │  │
│  │          │   Renew Now - $99/year      │                │  │
│  │          └─────────────────────────────┘                │  │
│  │          [Large, prominent CTA button]                  │  │
│  │                                                          │  │
│  │  Questions? We're here to help.                         │  │
│  │  Reply to this email or visit our help center.          │  │
│  │                                                          │  │
│  │  Thanks,                                                │  │
│  │  The {{companyName}} Team                               │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Footer:                                                 │  │
│  │  [Facebook] [Twitter] [LinkedIn]                        │  │
│  │                                                          │  │
│  │  {{companyAddress}}                                     │  │
│  │  Unsubscribe | Update Preferences                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Domain Architecture Mapping

```javascript
{
  "id": "email-renewal-reminder",
  "type": "email",
  "meta": {
    "subject": "{{firstName}}, your {{productName}} subscription expires soon",
    "preheader": "Renew today to keep your access",
    "layout": "email-template",
    "maxWidth": "600px"
  },
  "zones": [
    {
      "id": "zone-header",
      "name": "Header",
      "rows": [
        {
          "id": "row-header",
          "columns": [
            {
              "id": "col-header",
              "elements": [
                {
                  "id": "header-structure",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "email-header" },
                    "layout": {
                      "display": "table",
                      "width": "100%",
                      "padding": "20px"
                    },
                    "appearance": {
                      "background": "#ffffff"
                    }
                  },
                  "elements": [
                    {
                      "id": "logo",
                      "type": "record",
                      "settings": {
                        "record": { "recordType": "image", "alt": "Company Logo" },
                        "data": {
                          "bindingMode": "bound-read",
                          "binding": { "source": "company.logoUrl" }
                        },
                        "layout": { "width": "120px", "height": "auto" }
                      }
                    },
                    {
                      "id": "view-web",
                      "type": "markup",
                      "data": { "content": "View in browser" },
                      "settings": {
                        "markup": { "markupType": "link", "href": "{{webVersionUrl}}" },
                        "appearance": {
                          "color": "#666666",
                          "fontSize": "12px",
                          "textDecoration": "underline"
                        },
                        "layout": { "float": "right" }
                      }
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "zone-hero",
      "name": "Hero",
      "rows": [
        {
          "id": "row-hero",
          "columns": [
            {
              "id": "col-hero",
              "elements": [
                {
                  "id": "hero-image",
                  "type": "record",
                  "settings": {
                    "record": {
                      "recordType": "image",
                      "alt": "Renew your subscription",
                      "responsive": true
                    },
                    "data": {
                      "bindingMode": "static",
                      "value": "https://cdn.example.com/hero-renewal.jpg"
                    },
                    "layout": {
                      "width": "100%",
                      "height": "auto",
                      "display": "block"
                    }
                  }
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "zone-body",
      "name": "Body",
      "rows": [
        {
          "id": "row-body",
          "columns": [
            {
              "id": "col-body",
              "elements": [
                {
                  "id": "body-structure",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "email-body" },
                    "layout": {
                      "padding": "40px 30px"
                    },
                    "appearance": {
                      "background": "#ffffff"
                    }
                  },
                  "elements": [
                    {
                      "id": "greeting",
                      "type": "markup",
                      "data": { "content": "Hi {{user.firstName}}," },
                      "settings": {
                        "markup": { "markupType": "text" },
                        "typography": {
                          "fontSize": "16px",
                          "lineHeight": "24px",
                          "color": "#333333"
                        },
                        "layout": { "margin": "0 0 20px 0" }
                      }
                    },
                    {
                      "id": "main-message",
                      "type": "markup",
                      "data": {
                        "content": "Your subscription to {{subscription.productName}} is about to expire on {{subscription.expirationDate | date('MMMM d, yyyy')}}."
                      },
                      "settings": {
                        "markup": { "markupType": "text" },
                        "typography": {
                          "fontSize": "16px",
                          "lineHeight": "24px",
                          "color": "#333333"
                        },
                        "layout": { "margin": "0 0 20px 0" }
                      }
                    },
                    {
                      "id": "benefit-intro",
                      "type": "markup",
                      "data": { "content": "Don't miss out! Renew today to continue enjoying:" },
                      "settings": {
                        "markup": { "markupType": "text" },
                        "typography": {
                          "fontSize": "16px",
                          "fontWeight": "600",
                          "lineHeight": "24px",
                          "color": "#333333"
                        },
                        "layout": { "margin": "0 0 15px 0" }
                      }
                    },
                    {
                      "id": "benefits-list",
                      "type": "structure",
                      "settings": {
                        "structure": { "structureType": "list", "listType": "unordered" },
                        "layout": { "margin": "0 0 30px 0" }
                      },
                      "elements": [
                        {
                          "id": "benefit-1",
                          "type": "markup",
                          "data": { "content": "✓ Unlimited access to all features" },
                          "settings": {
                            "markup": { "markupType": "list-item" },
                            "typography": { "fontSize": "16px", "lineHeight": "28px" }
                          }
                        },
                        {
                          "id": "benefit-2",
                          "type": "markup",
                          "data": { "content": "✓ Priority customer support" },
                          "settings": {
                            "markup": { "markupType": "list-item" },
                            "typography": { "fontSize": "16px", "lineHeight": "28px" }
                          }
                        },
                        {
                          "id": "benefit-3",
                          "type": "markup",
                          "data": { "content": "✓ Advanced analytics and reporting" },
                          "settings": {
                            "markup": { "markupType": "list-item" },
                            "typography": { "fontSize": "16px", "lineHeight": "28px" }
                          }
                        },
                        {
                          "id": "benefit-4",
                          "type": "markup",
                          "data": { "content": "✓ Exclusive updates and new features" },
                          "settings": {
                            "markup": { "markupType": "list-item" },
                            "typography": { "fontSize": "16px", "lineHeight": "28px" }
                          }
                        }
                      ]
                    },
                    {
                      "id": "cta-button",
                      "type": "markup",
                      "data": { "content": "Renew Now - ${{subscription.price}}/year" },
                      "settings": {
                        "markup": {
                          "markupType": "button",
                          "href": "{{renewalUrl}}",
                          "variant": "primary"
                        },
                        "appearance": {
                          "background": "#0066FF",
                          "color": "#ffffff",
                          "padding": "16px 40px",
                          "borderRadius": "6px",
                          "fontSize": "18px",
                          "fontWeight": "600",
                          "textDecoration": "none",
                          "display": "inline-block"
                        },
                        "layout": {
                          "margin": "10px 0 30px 0",
                          "textAlign": "center"
                        }
                      }
                    },
                    {
                      "id": "help-text",
                      "type": "markup",
                      "data": {
                        "content": "Questions? We're here to help. Reply to this email or visit our help center."
                      },
                      "settings": {
                        "markup": { "markupType": "text" },
                        "typography": {
                          "fontSize": "14px",
                          "lineHeight": "21px",
                          "color": "#666666"
                        },
                        "layout": { "margin": "0 0 20px 0" }
                      }
                    },
                    {
                      "id": "signature",
                      "type": "structure",
                      "settings": {
                        "structure": { "structureType": "signature" }
                      },
                      "elements": [
                        {
                          "id": "sign-off",
                          "type": "markup",
                          "data": { "content": "Thanks," },
                          "settings": {
                            "markup": { "markupType": "text" },
                            "typography": { "fontSize": "16px", "lineHeight": "24px" }
                          }
                        },
                        {
                          "id": "team-name",
                          "type": "markup",
                          "data": { "content": "The {{company.name}} Team" },
                          "settings": {
                            "markup": { "markupType": "text" },
                            "typography": {
                              "fontSize": "16px",
                              "fontWeight": "600",
                              "lineHeight": "24px"
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "zone-footer",
      "name": "Footer",
      "rows": [
        {
          "id": "row-footer",
          "columns": [
            {
              "id": "col-footer",
              "elements": [
                {
                  "id": "footer-structure",
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "email-footer" },
                    "layout": {
                      "padding": "30px 20px",
                      "textAlign": "center"
                    },
                    "appearance": {
                      "background": "#f5f5f5",
                      "borderTop": "1px solid #dddddd"
                    }
                  },
                  "elements": [
                    {
                      "id": "social-links",
                      "type": "structure",
                      "settings": {
                        "structure": { "structureType": "flex" },
                        "layout": {
                          "direction": "horizontal",
                          "gap": "15px",
                          "justify": "center",
                          "margin": "0 0 20px 0"
                        }
                      },
                      "elements": [
                        {
                          "id": "social-facebook",
                          "type": "markup",
                          "settings": {
                            "markup": {
                              "markupType": "link",
                              "href": "{{company.socialLinks.facebook}}"
                            }
                          },
                          "data": { "content": "[Facebook Icon]" }
                        },
                        {
                          "id": "social-twitter",
                          "type": "markup",
                          "settings": {
                            "markup": {
                              "markupType": "link",
                              "href": "{{company.socialLinks.twitter}}"
                            }
                          },
                          "data": { "content": "[Twitter Icon]" }
                        },
                        {
                          "id": "social-linkedin",
                          "type": "markup",
                          "settings": {
                            "markup": {
                              "markupType": "link",
                              "href": "{{company.socialLinks.linkedin}}"
                            }
                          },
                          "data": { "content": "[LinkedIn Icon]" }
                        }
                      ]
                    },
                    {
                      "id": "company-address",
                      "type": "markup",
                      "data": { "content": "{{company.address}}" },
                      "settings": {
                        "markup": { "markupType": "text" },
                        "typography": {
                          "fontSize": "12px",
                          "lineHeight": "18px",
                          "color": "#999999"
                        },
                        "layout": { "margin": "0 0 10px 0" }
                      }
                    },
                    {
                      "id": "footer-links",
                      "type": "structure",
                      "settings": {
                        "structure": { "structureType": "flex" },
                        "layout": {
                          "direction": "horizontal",
                          "gap": "15px",
                          "justify": "center"
                        }
                      },
                      "elements": [
                        {
                          "id": "unsubscribe-link",
                          "type": "markup",
                          "data": { "content": "Unsubscribe" },
                          "settings": {
                            "markup": {
                              "markupType": "link",
                              "href": "{{unsubscribeUrl}}"
                            },
                            "typography": {
                              "fontSize": "12px",
                              "color": "#999999"
                            }
                          }
                        },
                        {
                          "id": "preferences-link",
                          "type": "markup",
                          "data": { "content": "Update Preferences" },
                          "settings": {
                            "markup": {
                              "markupType": "link",
                              "href": "{{preferencesUrl}}"
                            },
                            "typography": {
                              "fontSize": "12px",
                              "color": "#999999"
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

### Key Capabilities Demonstrated
1. ✅ **Email-Safe HTML** - Table-based layout with inline styles
2. ✅ **Responsive Design** - Mobile-first, works on all email clients
3. ✅ **Dynamic Personalization** - {{firstName}}, {{productName}}, {{expirationDate}}
4. ✅ **Hero Image** - Large, compelling visual
5. ✅ **Single CTA** - Clear, prominent call-to-action
6. ✅ **Minimal Design** - Focused, no distractions
7. ✅ **Social Links** - Footer with social icons
8. ✅ **Unsubscribe/Preferences** - Compliance links

### Technical Challenges
- **Email Client Compatibility:** Test across Gmail, Outlook, Apple Mail, etc.
- **Inline Styles:** All CSS must be inlined (no external stylesheets)
- **Table-Based Layout:** Use tables for layout (not CSS Grid/Flexbox)
- **Image Optimization:** Compress images, use alt text for accessibility
- **Personalization Tokens:** Replace {{variables}} with actual data
- **A/B Testing:** Create variants for subject lines, CTAs, images
- **Tracking:** Open tracking, click tracking (UTM parameters)

---

## Collective Platform Coverage

### Layout Patterns Covered

| Pattern | Examples Using It | Unique Aspects |
|---------|-------------------|----------------|
| **Fixed-Fluid-Fixed** | HubSpot CRM, Application Details | Left nav + center content + right sidebar |
| **Full-Width + Constrained** | Event Landing, Article | Hero edge-to-edge, content max-width |
| **Grid-Based** | Dashboard | Draggable/resizable with react-grid-layout |
| **Single-Column Fluid** | Notion Page, Article body | Optimized for reading, max-width 720-900px |
| **Infinite Canvas** | Figma Canvas | Pan/zoom, absolute positioning |

### Data Interaction Patterns

| Pattern | Examples | Use Cases |
|---------|----------|-----------|
| **Bidirectional Binding** | HubSpot (inline edit), Notion (autosave) | Live editing, auto-save |
| **Collection Rendering** | Event (speakers), Dashboard (orders) | Render lists/grids from database |
| **Real-time Updates** | HubSpot (timeline), Dashboard (metrics) | WebSocket updates |
| **File Management** | Application (PDF, uploads) | View, upload, download files |
| **Aggregations** | Dashboard (KPIs, charts) | Sum, count, group by |

### Element Type Usage

| Element Type | Usage Count | Examples |
|--------------|-------------|----------|
| **field** | High | HubSpot (forms), Notion (text blocks), Application (inputs) |
| **record** | Very High | Event (speakers), Dashboard (charts), Application (PDF), Article (images) |
| **markup** | Very High | All examples (headings, text, buttons) |
| **structure** | Very High | All examples (cards, sections, layouts) |

### Vertical Coverage

| Vertical | Examples | Features Demonstrated |
|----------|----------|----------------------|
| **CRM** | HubSpot Contact | Timeline, associations, inline edit |
| **Marketing** | Event Landing | Full-width hero, registration, speakers |
| **HR/Recruiting** | Application Details | PDF viewer, discussions, payments |
| **Analytics/BI** | Dashboard | Charts, KPIs, grid layout |
| **CMS/Docs** | Notion Page | Block editor, slash commands, databases |
| **Design** | Figma Canvas | Infinite canvas, shapes, connectors |
| **Publishing** | Article | Typography, TOC, related content |

---

## Implementation Priority

### Phase 1: Core Infrastructure (Weeks 1-3)
Build foundation to support all 8 examples:
1. **UniversalRenderer** - Render any element from JSON
2. **Layout System** - Fixed-fluid-fixed, full-width, constrained
3. **Theme System** - Token resolution, dark mode
4. **Data Binding** - Static, read, write, bidirectional
5. **Validation** - Zod schemas for all element types

**Deliverable:** Can render simple pages with fields, records, markup, structures

### Phase 2: Basic Examples (Weeks 4-5)
Implement 2 examples to validate architecture:
1. **Event Landing Page** (Medium complexity)
   - Full-width hero
   - Constrained content
   - Collection rendering (speakers)
2. **Article** (Medium complexity)
   - Article layout
   - Sticky sidebar
   - TOC generation

**Deliverable:** 2 working examples demonstrating different layout patterns

### Phase 3: Advanced Features (Weeks 6-7)
Implement features for complex examples:
1. **Fixed-Fluid-Fixed Layout** (for HubSpot, Application)
2. **Inline Editing** (bidirectional binding)
3. **Timeline Component** (activity feed)
4. **PDF Viewer** (react-pdf integration)
5. **Discussion Threads** (real-time comments)

**Deliverable:** Core features ready for HubSpot CRM and Application Details

### Phase 4: Complex Examples (Week 8)
Implement remaining examples:
1. **HubSpot CRM Contact** (High complexity)
2. **Application Details** (Very high complexity)

**Deliverable:** 4 working examples total

### Phase 5: Advanced Layouts (Weeks 9-10)
Implement most complex examples:
1. **Dashboard** (react-grid-layout integration)
   - Draggable widgets
   - Resizable panels
   - Chart library (Recharts)
2. **Notion Page** (block editor)
   - Slash commands
   - Drag to reorder
   - Embedded databases
3. **Figma Canvas** (infinite canvas)
   - Pan/zoom
   - Shape library
   - Connectors

**Deliverable:** All 8 examples complete

---

## Technical Architecture Decisions

### 1. Layout Engine Strategy

**Decision:** Support multiple layout engines via `layoutEngine` property

```javascript
{
  "structure": {
    "structureType": "dashboard-grid",
    "layoutEngine": "react-grid-layout"  // vs default CSS Grid/Flexbox
  }
}
```

**Layout Engines:**
- **default** - CSS Grid + Flexbox (90% of use cases)
- **react-grid-layout** - Dashboard example only
- **canvas** - Figma example only (HTML5 Canvas or SVG)

### 2. Component Library

**Core Components:**
```
src/components/
├─ elements/
│  ├─ FieldElement.jsx (text, email, tel, select, textarea, etc.)
│  ├─ RecordElement.jsx (avatar, image, chart, data-grid, timeline, pdf, etc.)
│  ├─ MarkupElement.jsx (heading, text, button, nav-item, list-item, etc.)
│  └─ StructureElement.jsx (card, section, flex, grid, hero, form, etc.)
├─ specialized/
│  ├─ DashboardGrid.jsx (wraps react-grid-layout)
│  ├─ BlockEditor.jsx (Notion-style block editor)
│  ├─ CanvasRenderer.jsx (Figma-style canvas)
│  ├─ PDFViewer.jsx (react-pdf wrapper)
│  ├─ Timeline.jsx (activity feed)
│  └─ TableOfContents.jsx (auto-generated TOC)
└─ UniversalRenderer.jsx (main renderer)
```

### 3. Data Binding Strategy

**Binding Modes:**
- `static` - No binding (hardcoded content)
- `bound-read` - Display data from database (read-only)
- `bound-write` - Capture user input to database (forms)
- `bound-bidirectional` - Two-way sync (inline editing, autosave)

**Real-time Updates:**
- WebSocket connection for `realtime: true` bindings
- Polling fallback for older browsers
- Optimistic UI updates

### 4. File Handling

**Upload Strategy:**
- Direct upload to S3/R2 with presigned URLs
- Progress tracking with XHR or Fetch API
- Image optimization (resize, compress) on server

**Preview Strategy:**
- Images: `<img>` tags with srcset
- PDFs: react-pdf (Canvas-based rendering)
- Videos: `<video>` tags with HLS for large files

### 5. Performance Optimizations

**Virtualization:**
- Use `react-window` for large lists (Timeline, DataGrid)
- Render only visible items + buffer

**Lazy Loading:**
- Code-split specialized components (Dashboard, Canvas, PDF)
- Load chart library only when needed
- Lazy load images below fold

**Caching:**
- Cache JSON configs in IndexedDB
- Service Worker for offline support
- React Query for server state

---

## Next Steps

### Immediate Actions
1. **Review 7 Examples** with stakeholders and team
2. **Prioritize** which examples to implement first
3. **Validate** JSON architecture with real use cases
4. **Design** specialized components (Dashboard, Canvas, BlockEditor)

### Week 1-2: Infrastructure
- Set up `central-domain-prototype` project
- Implement UniversalRenderer
- Build core element components (Field, Record, Markup, Structure)
- Create layout system (fixed-fluid-fixed, full-width, constrained)

### Week 3-4: First Examples
- Implement Event Landing Page
- Implement Article (Magazine Style)
- Validate architecture with 2 working examples

### Week 5+: Advanced Examples
- Implement remaining 5 examples based on priority
- Add specialized components as needed
- Optimize performance for production

---

## Conclusion

These 8 comprehensive examples collectively showcase:

✅ **Layout Diversity** - Fixed-fluid-fixed, full-width, constrained, grid, canvas, article, email
✅ **Data Patterns** - Static, read-only, forms, bidirectional, real-time, collections
✅ **Vertical Coverage** - CRM, Marketing, HR, Analytics, CMS, Design, Publishing, Email Marketing
✅ **Element Usage** - All 4 types (field, record, markup, structure) heavily used
✅ **Technical Depth** - Simple to very complex (email, forms, PDF, canvas, dashboards)
✅ **Platform Breadth** - Demonstrates capabilities for all major use cases

**Recommendation:** Start with Renewal Email and Event Landing Page (low to medium complexity) to validate architecture, then build up to the more complex examples (Article, Dashboard, Notion, Figma, Application, HubSpot).

---

## Related Documents

- [JSX + JSON Approach Evaluation](./JSX_JSON_APPROACH_EVALUATION.md)
- [Revamp Strategy Evaluation](./REVAMP_STRATEGY_EVALUATION.md)
- [Product Requirements Document](./PRODUCT_REQUIREMENTS_DOCUMENT.md)
- [Element Settings Architecture](./ELEMENT_SETTINGS_ARCHITECTURE.md)
- [Generic Element Types](./GENERIC_ELEMENT_TYPES.md)

---

**Document Owner:** CTO Evaluator
**Last Updated:** 2025-11-21
**Status:** ✅ Ready for Review
**Next Step:** Get stakeholder approval on which examples to prioritize
