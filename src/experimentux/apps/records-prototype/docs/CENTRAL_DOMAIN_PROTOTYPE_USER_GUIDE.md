# Central: Domain-Based Workspace Platform
## User Guide

**Date:** 2025-11-21
**Version:** 1.0
**Branch:** `claude/prototype-drag-drop-015wNpJGKT2xLTeY9SkKwSgD`
**Status:** Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Workspace Navigator](#workspace-navigator)
4. [Core Features](#core-features)
5. [Element System](#element-system)
6. [Sitemap](#sitemap)
7. [Sample Data](#sample-data)

---

## Overview

**Central** is an enterprise workspace platform that demonstrates domain-based architecture for building flexible, data-driven applications. It combines CRM, task management, content management, and collaboration tools in a unified interface powered by a sophisticated page builder.

### What Makes Central Different

**Domain-Based Architecture:**
Central uses a unique 4-element type system organized into 2 domains:
- **Data Domain** (persisted to database): `field` and `record` elements
- **UI Domain** (ephemeral presentation): `markup` and `structure` elements

**JSON-Driven Configuration:**
All pages, elements, and settings are stored as JSON configurations, enabling:
- Runtime flexibility without code changes
- Database-friendly storage (PostgreSQL JSONB)
- Visual page builder + manual JSON editing
- Theme token system for consistent design

**Enterprise-Ready:**
- Multi-workspace support
- Hierarchical organization (Lists, Channels)
- Activity tracking and Recently Viewed
- Extensible app ecosystem

---

## Getting Started

### First Launch

When you first open Central, you'll see the **Home** page designed for new users:

![Central Home Page - New User](/html-prototypes/sample-central-home-page-new-user.png)

**What You'll See:**

1. **Global Bar** (top)
   - Workspace selector: "Central" dropdown
   - Global search: "Search Central"
   - User profile: "JD" avatar
   - Notifications icon

2. **Welcome Card**
   - Personalized greeting: "Good Morning, Wednesday, July 8"
   - Suggested next step: "Introduce yourself" button
   - Weather illustration (sunny)

3. **Journey Card** (blue, prominent)
   - "Your first journey with Central"
   - "A guided start to help you set up and explore"
   - "Start Journey" call-to-action button
   - Team meeting illustration

4. **Insights Card**
   - Chart illustration
   - Placeholder: "As you start using Central, your workspace insights will appear here"

5. **Quick Links Panel** (right sidebar)
   - 🎨 New Canvas → Create blank Figma-style canvas
   - 📄 New Page → Create blank Notion-style page
   - 👁 View Showcase → Browse all 8 sample pages

6. **Upcoming Tasks Panel** (right sidebar)
   - Introduce yourself • 2 min (Start here)
   - Meet your team • 2 min
   - Invite a colleague • 1 min

### Your First Steps

**1. Start the Guided Journey**
Click "Start Journey" on the welcome card to begin a step-by-step tour of Central's features.

**2. Explore Quick Links**
Try creating your first canvas or page, or browse the showcase examples.

**3. Complete Upcoming Tasks**
Work through the suggested tasks to set up your workspace.

**4. Browse the Workspace Navigator**
Open the left sidebar (☰ menu) to explore all available features.

---

## Workspace Navigator

The **Workspace Navigator** is the left sidebar that provides access to all Central features. It's organized into five main sections:

### Section 1: Core Pages

```
🏠 Home
   Default landing page with personalized dashboard

👥 Contacts
   Manage contacts and relationships (CRM-style)

✅ Tasks
   Track tasks, to-dos, and projects
```

### Section 2: Apps

```
📦 Apps
├─ 📄 Pages         Page builder for custom layouts
├─ 💬 Messages      Team communication (Coming Soon)
├─ 📁 Files         Document management (Coming Soon)
├─ 📅 Calendar      Event scheduling (Coming Soon)
├─ 📊 Reports       Analytics and insights (Coming Soon)
└─ ➕ Add App       Install additional applications
```

### Section 3: Recently Viewed

```
🕐 Recently Viewed
├─ Dashboard                 Viewed 2 hours ago
├─ Annual Conference         Viewed 5 hours ago
└─ Renewal Email            Viewed 1 day ago
```

Automatically populated with your last 5 viewed pages from the Showcase examples.

### Section 4: Lists

```
📋 Lists
└─ 📁 Showcase
   └─ 📄 All Examples (8 pages)
      └─ 📂 By Type
         ├─ 💼 CRM
         │  └─ HubSpot CRM Contact
         ├─ 📢 Marketing
         │  ├─ Annual Conference
         │  └─ Renewal Email
         ├─ 🎓 HR/Admissions
         │  └─ Application Submission
         ├─ 📊 Analytics
         │  └─ Dashboard
         ├─ 📝 CMS/Docs
         │  ├─ New Page (Notion-style)
         │  └─ Magazine Article
         └─ 🎨 Design
            └─ New Canvas (Figma-style)
```

Hierarchical organization for pages, documents, and collections.

### Section 5: Channels

```
💬 Channels
├─ #Staff          Company-wide communication (Coming Soon)
├─ #Events         Event planning coordination (Coming Soon)
└─ #Finance        Financial discussions (Coming Soon)
```

Team collaboration spaces inspired by Slack/Teams.

---

## Core Features

### 1. Home

**Purpose:** Personalized dashboard for new users

**What's Included:**
- Welcome card with personalized greeting and date
- Suggested next steps based on onboarding progress
- Guided journey card with "Start Journey" CTA
- Workspace insights placeholder (populated as you use Central)
- Quick Links panel for fast actions
- Upcoming Tasks with time estimates

**Key Actions:**
- Start Journey → Begin onboarding tour
- Introduce yourself → Create your profile
- New Canvas → Create blank Figma-style canvas
- New Page → Create blank Notion-style page
- View Showcase → Browse all 8 sample pages

**URL:** `/`

---

### 2. Contacts

**Purpose:** Manage contacts and relationships (CRM-style)

**Features:**
- **List View:** Grid or table display of all contacts
- **Detail View:** Full contact record based on HubSpot CRM example
  - Left sidebar: About section with editable fields
  - Center content: Tabbed interface (Overview, Activity, Emails)
  - Right sidebar: Quick Actions and Associated Records
- **Create/Edit:** Form-based contact management
- **Custom Fields:** Extend contact records with additional fields
- **Tags:** Organize contacts with labels (enterprise, hot-lead, qualified, etc.)

**Pre-Seeded Data:**
10 sample contacts including:
- John Doe (Acme Corp, Senior Engineer)
- Sarah Johnson (TechStart, Founder & CEO)
- Michael Chen (GlobalSoft, VP Engineering)
- And 7 more diverse contacts

**URL:** `/contacts`

---

### 3. Tasks

**Purpose:** Track tasks, to-dos, and projects

**Features:**
- **List View:** Kanban board or table view
- **Task Details:** Title, description, status, priority, due date, assignee
- **Statuses:** To Do, In Progress, Done
- **Priorities:** Low, Medium, High
- **Filtering:** By status, priority, assignee, due date
- **Tags:** Organize tasks with custom labels

**Pre-Seeded Data:**
15 sample tasks including:
- Follow up with John Doe (High priority, due tomorrow)
- Send proposal to Sarah Johnson (In Progress)
- Schedule demo with Michael Chen (Medium priority)
- And 12 more tasks in various statuses

**URL:** `/tasks`

---

### 4. Pages (Page Builder)

**Purpose:** Build custom pages with drag-and-drop editor

**Features:**
- **Create from Templates:** 8 comprehensive examples to start from
- **Drag-and-Drop Editor:** Visual page composition
- **4 Element Types:** field, record, markup, structure
- **JSON Configuration:** Manual editing for advanced users
- **Theme Tokens:** Consistent styling with design system
- **Responsive Design:** Mobile, tablet, desktop layouts
- **Save & Publish:** Version control and publishing workflow

**Pre-Seeded Data:**
8 comprehensive example pages (read-only):
1. HubSpot CRM Contact (3-column CRM layout)
2. Annual Conference (full-width marketing page for events)
3. Application Submission (canvas-based form with discussions)
4. Analytics Dashboard (charts and KPIs with react-grid-layout)
5. New Page (Notion-style block editor)
6. New Canvas (Figma-style infinite canvas)
7. Magazine Article (editorial typography and layout)
8. Renewal Email (marketing email template)

**URL:** `/pages`

---

### 5. Showcase

**Purpose:** Explore example pages and learn Central's capabilities

**Features:**
- **Gallery View:** 8 comprehensive examples with screenshots
- **Filter by Type:** CRM, Marketing, HR, Analytics, CMS, Design, Email
- **View Examples:** Open read-only versions to explore
- **Duplicate to Edit:** Create editable copies of any example
- **Learn by Reverse-Engineering:** Inspect JSON configurations

**Quick Access:**
Available via Quick Links panel ("👁 View Showcase") and Lists section in Workspace Navigator.

**URL:** `/showcase`

---

### 6. Recently Viewed

**Purpose:** Quick access to recently accessed items

**How It Works:**
- Automatically tracks when you view contacts, tasks, pages, events, etc.
- Shows last 5 items in Workspace Navigator
- Click any item to navigate directly to it
- Mixed types: contacts, pages, emails, events

**Example Entries:**
- John Doe (Contact) - 2 hours ago
- Q4 Planning (Event) - 5 hours ago
- CRM Contact Example (Page) - 1 day ago

---

### 7. Lists

**Purpose:** Hierarchical organization of pages and documents

**Features:**
- **Folders:** Create nested folder structures
- **Collections:** Group related pages
- **Pre-Seeded Showcase:** All 8 example pages organized by type
- **Drag-and-Drop:** Reorder and reorganize
- **Sharing:** Share lists with team members (future)

**Default Structure:**
```
📁 Showcase
   └─ 📄 All Examples
      └─ 📂 By Type
         ├─ CRM (1 page)
         ├─ Marketing (2 pages)
         ├─ HR/Admissions (1 page)
         ├─ Analytics (1 page)
         ├─ CMS/Docs (2 pages)
         └─ Design (1 page)
```

---

### 8. Apps Ecosystem

**Current Apps:**
- ✅ **Pages** - Fully functional page builder
- ⏸️ **Messages** - Coming Soon (team communication)
- ⏸️ **Files** - Coming Soon (document management)
- ⏸️ **Calendar** - Coming Soon (event scheduling)
- ⏸️ **Reports** - Coming Soon (analytics and insights)

**Add App:**
Placeholder for future extensibility (install third-party apps)

---

### 9. Channels

**Purpose:** Team collaboration spaces (Slack/Teams-inspired)

**Pre-Seeded Channels:**
- **#Staff** - Company-wide announcements and discussions
- **#Events** - Event planning and coordination
- **#Finance** - Financial discussions and reports

**Status:** Coming Soon (stubbed in navigation)

**Features (Future):**
- Message threading
- Real-time updates (WebSocket)
- File attachments
- Reactions and mentions
- Channel search and history

---

## Element System

Central's page builder is powered by a sophisticated element system organized into **2 domains** and **4 types**.

### Domain-Based Architecture

**Philosophy:**
Storage intent is fundamental. The domain tells you whether an element's data is persisted to the database or is purely for presentation.

**Two Domains:**

1. **data** - Persisted to database, queryable, part of page data
2. **ui** - Ephemeral presentation, not stored, purely visual

**Four Element Types:**

1. **field** (data domain) - Atomic data inputs
2. **record** (data domain) - Complex data structures
3. **markup** (ui domain) - Content presentation
4. **structure** (ui domain) - Layout containers

---

### Complete Element Reference

Below is a comprehensive list of all element types, subtypes, and their classifications.

---

## 1. Field Elements (Data Domain)

**Type:** `field`
**Domain:** `data` (persisted to database)
**Purpose:** Atomic data inputs that store user-entered values

### Field Subtypes

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **text** | Single-line text input | Name, title, short answers |
| **textarea** | Multi-line text input | Descriptions, comments, long-form text |
| **email** | Email input with validation | Email addresses |
| **number** | Numeric input | Quantities, prices, ages |
| **date** | Date picker | Birthdates, deadlines, event dates |
| **time** | Time picker | Meeting times, hours |
| **selectSingle** | Single option selection | Country, status, category |
| **selectMulti** | Multiple option selection | Tags, interests, permissions |
| **checkbox** | Boolean checkbox | Agree to terms, opt-in, yes/no |
| **tel** | Phone number input | Phone numbers |
| **url** | URL input with validation | Website links |
| **file** | File upload | Documents, attachments |
| **color** | Color picker | Brand colors, theme customization |
| **range** | Slider | Volume, rating, percentage |

### Input Type Variants (for selectSingle/selectMulti)

| Input Type | Description | Works With |
|------------|-------------|------------|
| **dropdown** | Standard dropdown menu | selectSingle, selectMulti |
| **radio** | Radio button group | selectSingle |
| **pill** | Pill/tag selector | selectMulti |
| **checkbox-group** | Checkbox group | selectMulti |
| **toggle** | Toggle switches | selectSingle, selectMulti |
| **button-group** | Button group selector | selectSingle, selectMulti |

### Example JSON Configuration

```javascript
{
  type: 'field',
  data: { value: '' },
  settings: {
    layout: { width: 'full' },
    appearance: {
      border: {
        width: '1px',
        style: 'solid',
        color: '{{theme.colors.border.default}}'
      }
    },
    data: {
      bindingMode: 'bound-write',
      binding: {
        source: 'form.contact',
        property: 'email',
        mode: 'write'
      },
      validation: {
        required: true,
        pattern: '^[^@]+@[^@]+\\.[^@]+$'
      }
    },
    field: {
      fieldType: 'email',  // ← Subtype
      label: 'Email Address',
      placeholder: 'you@example.com',
      required: true
    }
  }
}
```

---

## 2. Record Elements (Data Domain)

**Type:** `record`
**Domain:** `data` (persisted to database)
**Purpose:** Complex data structures - media, entities, visualizations

### Record Subtypes

#### Media Records

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **image** | Image with metadata | Photos, illustrations, diagrams |
| **video** | Video embed/upload | Demos, tutorials, promotional videos |
| **audio** | Audio player | Podcasts, music, voice notes |
| **file** | File download link | PDFs, documents, downloads |

#### Data Display Records

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **metadata** | Metadata bar display | Created date, author, status |
| **data-table** | Data grid/table | Contact lists, orders, inventory |
| **chart** | Data visualizations | Revenue charts, analytics, KPIs |
| **timeline** | Activity feed/history | Audit logs, activity streams |

#### Entity Records

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **person** | Person/profile information | Team members, authors, users |
| **organization** | Company/organization | Clients, partners, vendors |
| **product** | Product/service information | E-commerce, catalogs, inventory |
| **event** | Event/meeting information | Conferences, meetings, webinars |
| **address** | Address block | Locations, shipping addresses |
| **contact** | Contact information | Contact cards, directories |

### Layout Type Variants (for Records)

| Layout Type | Description | Works With |
|-------------|-------------|------------|
| **link** | Single actionable link | All record types |
| **list** | Vertical item list | timeline, metadata |
| **card** | Grouped block of information | person, organization, product, event |
| **grid** | Tabular data view | data-table |
| **visualizations** | Charts and graphs | chart |
| **custom** | User-defined template | All record types |

### Example JSON Configuration

```javascript
{
  type: 'record',
  data: {
    name: 'Jane Smith',
    title: 'Senior Engineer',
    photo: 'https://example.com/jane.jpg',
    email: 'jane@example.com',
    bio: 'Passionate about building great software'
  },
  settings: {
    layout: { width: '1/3' },
    appearance: {
      background: '{{theme.colors.surface}}',
      border: {
        radius: '{{theme.borderRadius.lg}}'
      }
    },
    record: {
      recordType: 'person',  // ← Subtype
      layoutType: 'card',
      showPhoto: true,
      showContact: true,
      showBio: true
    }
  }
}
```

---

## 3. Markup Elements (UI Domain)

**Type:** `markup`
**Domain:** `ui` (ephemeral, not persisted)
**Purpose:** Content presentation elements - text, buttons, icons

### Markup Subtypes

#### Text Elements

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **title** | Page titles (h1) | Main page heading |
| **heading** | Section headings (h2-h6) | Section titles, subsections |
| **paragraph** | Body text | Content paragraphs, descriptions |
| **subtitle** | Descriptions, captions | Subheadings, taglines |
| **label** | Small labels, tags | Field labels, status badges |
| **quote** | Blockquote | Testimonials, quotes, callouts |
| **code** | Code block | Code snippets, technical docs |

#### Interactive Elements

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **button** | CTA button (navigation only) | Call-to-action, navigation |
| **link** | Text hyperlink | Inline links, references |

#### Decorative Elements

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **icon** | Icon/emoji | Visual indicators, decorations |
| **divider** | Horizontal rule separator | Section dividers |
| **spacer** | Vertical spacing block | Layout spacing, breathing room |

### Button Variants

| Variant | Description | Use Case |
|---------|-------------|----------|
| **primary** | Primary action button | Main CTA, submit forms |
| **secondary** | Secondary action button | Cancel, back, alternative actions |
| **outline** | Outlined button | Tertiary actions, less emphasis |
| **ghost** | Text-only button | Subtle actions, minimal UI |
| **danger** | Destructive action button | Delete, remove, danger actions |

### Heading Levels

| Level | HTML Tag | Use Case |
|-------|----------|----------|
| **1** | h1 | Page title (use sparingly, one per page) |
| **2** | h2 | Major section headings |
| **3** | h3 | Subsection headings |
| **4** | h4 | Minor subsection headings |
| **5** | h5 | Sub-subsection headings |
| **6** | h6 | Deepest heading level |

### Example JSON Configuration

```javascript
{
  type: 'markup',
  data: { content: 'Welcome to Central' },
  settings: {
    typography: {
      fontSize: '{{theme.typography.fontSize.3xl}}',
      fontWeight: '{{theme.typography.fontWeight.bold}}',
      lineHeight: '{{theme.typography.lineHeight.tight}}'
    },
    appearance: {
      color: '{{theme.colors.text.primary}}'
    },
    markup: {
      markupType: 'title',  // ← Subtype
      editMode: 'always',
      placeholder: 'Untitled Page'
    }
  }
}
```

---

## 4. Structure Elements (UI Domain)

**Type:** `structure`
**Domain:** `ui` (ephemeral, not persisted)
**Purpose:** Layout containers and structural elements

**Key Characteristic:** Structure elements can contain child elements including other structures (max nesting depth: 3)

### Structure Subtypes

#### Basic Containers

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **div** | Generic block container | General-purpose wrapper |
| **stack** | Vertical spacing between children | Content stacking, forms |

#### Layout Containers

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **grid** | CSS Grid layout | Product grids, image galleries |
| **flex** | Flexbox layout | Navigation bars, toolbars |

#### Styled Containers

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **card** | Card styling (padding + border + shadow) | Content cards, product cards |
| **panel** | Panel with optional header | Settings panels, info boxes |

#### Interactive Containers

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **tabs** | Tabbed interface | Organize content into tabs |
| **accordion** | Collapsible sections | FAQs, expandable content |
| **modal** | Overlay dialog | Confirmations, forms, details |
| **drawer** | Slide-out panel | Navigation menus, filters |
| **carousel** | Horizontal slider | Image galleries, testimonials |

#### Advanced

| Subtype | Description | Use Case |
|---------|-------------|----------|
| **canvas** | Free-form positioning | Figma-style infinite canvas, diagrams |

### Semantic Roles

| Role | Description | Use Case |
|------|-------------|----------|
| **content-group** | Generic content grouping | Default role |
| **hero** | Hero section | Above-the-fold banner |
| **navigation** | Navigation structure | Nav bars, menus |
| **footer** | Page footer | Footer content |
| **sidebar** | Sidebar content | Side panels, supplementary content |
| **header** | Page header | Top-level header |

### Example JSON Configuration

```javascript
{
  type: 'structure',
  settings: {
    layout: {
      width: 'full',
      spacing: {
        padding: {
          top: '{{theme.spacing.lg}}',
          bottom: '{{theme.spacing.lg}}'
        }
      }
    },
    appearance: {
      background: '{{theme.colors.surface}}',
      border: {
        width: '1px',
        style: 'solid',
        color: '{{theme.colors.border.default}}',
        radius: '{{theme.borderRadius.lg}}'
      },
      shadow: '{{theme.shadows.md}}'
    },
    structure: {
      structureType: 'card',  // ← Subtype
      semanticRole: 'content-group'
    }
  },
  elements: [
    {
      type: 'markup',
      data: { content: 'Product Name' },
      settings: { markup: { markupType: 'heading', level: 3 } }
    },
    {
      type: 'record',
      data: { src: 'product.jpg' },
      settings: { record: { recordType: 'image' } }
    },
    {
      type: 'markup',
      data: { content: 'Add to Cart' },
      settings: { markup: { markupType: 'button', variant: 'primary' } }
    }
  ]
}
```

---

## Element Settings Architecture

All elements share **5 common setting groups** that provide consistent configuration:

### 1. Layout Settings

Controls position, dimensions, alignment, and spacing.

```javascript
layout: {
  // Dimensions
  width: 'full' | '1/2' | '1/3' | '2/3' | '1/4' | '3/4' | 'auto',
  height: string,  // e.g., '200px', '50vh', 'auto'
  minWidth: string,
  maxWidth: string,
  minHeight: string,
  maxHeight: string,

  // Spacing (uses theme tokens)
  spacing: {
    margin: {
      top: '{{theme.spacing.md}}',
      right: '{{theme.spacing.md}}',
      bottom: '{{theme.spacing.md}}',
      left: '{{theme.spacing.md}}'
    },
    padding: {
      top: '{{theme.spacing.lg}}',
      right: '{{theme.spacing.lg}}',
      bottom: '{{theme.spacing.lg}}',
      left: '{{theme.spacing.lg}}'
    }
  },

  // Alignment
  textAlign: 'left' | 'center' | 'right' | 'justify',
  verticalAlign: 'top' | 'middle' | 'bottom',

  // Display
  display: 'block' | 'inline-block' | 'flex' | 'grid' | 'none'
}
```

### 2. Appearance Settings

Controls colors, borders, shadows (all theme-based).

```javascript
appearance: {
  // Colors (uses theme tokens)
  background: '{{theme.colors.surface}}',
  color: '{{theme.colors.text.primary}}',

  // Borders
  border: {
    width: '1px',
    style: 'solid' | 'dashed' | 'dotted' | 'none',
    color: '{{theme.colors.border.default}}',
    radius: '{{theme.borderRadius.md}}'
  },

  // Shadow
  shadow: '{{theme.shadows.sm}}' | '{{theme.shadows.md}}' | '{{theme.shadows.lg}}',

  // Opacity
  opacity: 1.0
}
```

### 3. Data Settings

Controls data binding, formatting, and validation.

```javascript
data: {
  // Binding mode
  bindingMode: 'static' | 'bound-read' | 'bound-write' | 'bound-bidirectional',

  // Binding configuration
  binding: {
    source: 'form.contact',      // Data source
    property: 'email',            // Property to bind
    mode: 'read' | 'write' | 'bidirectional'
  },

  // Validation (for field elements)
  validation: {
    required: boolean,
    pattern: string,              // Regex pattern
    minLength: number,
    maxLength: number,
    min: number,                  // For numeric fields
    max: number,
    errorMessage: string
  },

  // Formatting
  format: {
    type: 'date' | 'number' | 'currency' | 'percentage',
    locale: 'en-US',
    options: object              // Intl.DateTimeFormat or Intl.NumberFormat options
  },

  // Slash commands (for markup elements)
  slashCommands: {
    enabled: boolean,
    commands: ['heading', 'bullet-list', 'numbered-list', 'quote', 'code']
  }
}
```

### 4. Typography Settings

Controls fonts and text styling.

```javascript
typography: {
  // Font family (uses theme tokens)
  fontFamily: '{{theme.typography.fontFamily.sans}}',

  // Font size
  fontSize: '{{theme.typography.fontSize.base}}',

  // Font weight
  fontWeight: '{{theme.typography.fontWeight.normal}}',

  // Line height
  lineHeight: '{{theme.typography.lineHeight.normal}}',

  // Text transform
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize',

  // Letter spacing
  letterSpacing: 'normal' | '{{theme.letterSpacing.wide}}',

  // Text decoration
  textDecoration: 'none' | 'underline' | 'line-through'
}
```

### 5. Business Rules Settings

Controls visibility, permissions, conditional logic, and animation.

```javascript
businessRules: {
  // Visibility
  visibility: {
    hidden: boolean,
    condition: {
      field: 'status',
      operator: 'equals' | 'not-equals' | 'contains' | 'greater-than' | 'less-than',
      value: any
    }
  },

  // Permissions
  permissions: {
    roles: ['admin', 'editor', 'viewer'],
    requiresAuth: boolean
  },

  // Conditional logic
  conditional: {
    if: { field: 'accountType', equals: 'premium' },
    then: { show: true },
    else: { show: false }
  },

  // Animation
  animation: {
    type: 'fade-in' | 'slide-in' | 'scale-in' | 'none',
    duration: number,  // milliseconds
    delay: number,
    easing: 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  }
}
```

---

## Theme System

Central uses a **theme token system** for consistent styling across all pages and elements.

### Theme Token Categories

**Colors:**
- `{{theme.colors.primary}}` - Primary brand color
- `{{theme.colors.secondary}}` - Secondary brand color
- `{{theme.colors.accent}}` - Accent color
- `{{theme.colors.background}}` - Background color
- `{{theme.colors.surface}}` - Surface color (cards, panels)
- `{{theme.colors.text.primary}}` - Primary text color
- `{{theme.colors.text.secondary}}` - Secondary text color
- `{{theme.colors.border.default}}` - Default border color
- `{{theme.colors.status.success}}` - Success state color
- `{{theme.colors.status.warning}}` - Warning state color
- `{{theme.colors.status.error}}` - Error state color

**Typography:**
- `{{theme.typography.fontFamily.sans}}` - Sans-serif font
- `{{theme.typography.fontFamily.serif}}` - Serif font
- `{{theme.typography.fontFamily.mono}}` - Monospace font
- `{{theme.typography.fontSize.xs}}` through `{{theme.typography.fontSize.5xl}}`
- `{{theme.typography.fontWeight.normal}}`, `bold`, `semibold`, etc.
- `{{theme.typography.lineHeight.tight}}`, `normal`, `relaxed`, etc.

**Spacing:**
- `{{theme.spacing.xs}}` through `{{theme.spacing.5xl}}`
- Consistent 8px scale: xs=4px, sm=8px, md=16px, lg=24px, xl=32px, etc.

**Borders:**
- `{{theme.borderRadius.sm}}` through `{{theme.borderRadius.full}}`
- `{{theme.borderWidth.thin}}`, `normal`, `thick`

**Shadows:**
- `{{theme.shadows.sm}}`, `md`, `lg`, `xl`, `2xl`

---

## Sitemap

Complete URL structure for Central:

### Core Navigation

```
/                                    Home (onboarding dashboard)

/contacts                            Contacts list
├─ /contacts/new                     Create new contact
└─ /contacts/:contactId              Contact detail (CRM-style)

/tasks                               Tasks list
├─ /tasks/new                        Create new task
└─ /tasks/:taskId                    Task detail

/pages                               Pages list (page builder)
├─ /pages/new                        Create new page (template selector)
└─ /pages/:pageId                    Page detail/editor
   ├─ /pages/:pageId/edit            Edit mode (drag-and-drop)
   └─ /pages/:pageId/preview         Preview mode
```

### Apps

```
/apps                                Apps hub

/apps/pages                          Pages app (redirects to /pages)

/apps/messages                       Messages app (Coming Soon)
/apps/files                          Files app (Coming Soon)
/apps/calendar                       Calendar app (Coming Soon)
/apps/reports                        Reports app (Coming Soon)
```

### Organization

```
/showcase                            Showcase gallery (8 examples)
├─ /showcase/crm                     CRM examples
├─ /showcase/marketing               Marketing examples
├─ /showcase/hr                      HR/Admissions examples
├─ /showcase/analytics               Analytics examples
├─ /showcase/cms                     CMS/Docs examples
├─ /showcase/design                  Design examples
└─ /showcase/:exampleId              Example detail (read-only)

/lists                               Lists overview
└─ /lists/:listId                    List detail (hierarchical view)

/channels                            Channels overview (Coming Soon)
└─ /channels/:channelId              Channel detail (Coming Soon)
```

### System

```
/settings                            App settings
├─ /settings/profile                 User profile
├─ /settings/workspace               Workspace settings
├─ /settings/theme                   Theme customization
└─ /settings/preferences             User preferences

/help                                Help documentation
/search                              Global search results
```

---

## Sample Data

Central comes pre-populated with realistic sample data to help you explore features:

### Pages (8 Examples)

1. **HubSpot CRM Contact** - 3-column fixed-fluid-fixed layout with tabs, timeline, and associations
2. **Annual Conference** - Full-width hero with registration form and speaker grid
3. **Application Submission** - Canvas-based form with field-level discussions
4. **Analytics Dashboard** - Charts, KPIs, and draggable widgets (react-grid-layout)
5. **New Page (Notion-style)** - Block editor with slash commands
6. **New Canvas (Figma-style)** - Infinite canvas with free positioning
7. **Magazine Article** - Editorial typography and layout
8. **Renewal Email** - Marketing email template with hero and CTA

### Contacts (10 Samples)

- John Doe (Acme Corp, Senior Engineer) - #enterprise #hot-lead
- Sarah Johnson (TechStart, Founder & CEO) - #startup #qualified
- Michael Chen (GlobalSoft, VP Engineering) - #enterprise #decision-maker
- Emily Rodriguez (Innovate Labs, Product Manager) - #mid-market #champion
- David Kim (FastGrow Inc, CTO) - #growth-stage #technical
- Lisa Wang (DesignCo, Creative Director) - #agency #interested
- Robert Martinez (Ventures VC, Partner) - #investor #warm
- Jennifer Lee (EduTech, Director of IT) - #education #evaluation
- Tom Anderson (HealthPlus, Operations Manager) - #healthcare #pilot
- Maria Garcia (RetailMax, VP Marketing) - #retail #cold

### Tasks (15 Samples)

**To Do:**
- Follow up with John Doe (High priority, due tomorrow)
- Schedule demo with Michael Chen (Medium, due in 3 days)
- Test application form (Low, due in 5 days)
- Set up renewal email campaign (High, due in 6 days)
- Review competitor analysis (Medium, due in 8 days)
- Prepare team meeting agenda (Low, due in 9 days)
- Test new canvas features (Medium, due in 11 days)

**In Progress:**
- Send proposal to Sarah Johnson (High, due in 2 days)
- Review Q4 report (High, due in 3 days)
- Design dashboard mockup (Medium, due in 4 days)
- Update showcase examples (Low, due in 7 days)
- Update documentation (Low, due in 10 days)

**Done:**
- Update CRM fields (completed 1 day ago)
- Create event landing page (completed 2 days ago)
- Write article content (completed 3 days ago)

### Lists (Pre-Seeded Hierarchy)

```
📁 Showcase
   ├─ 📄 All Examples (8 pages)
   └─ 📂 By Type
      ├─ 💼 CRM (1 page)
      │  └─ HubSpot CRM Contact
      ├─ 📢 Marketing (2 pages)
      │  ├─ Annual Conference
      │  └─ Renewal Email
      ├─ 🎓 HR/Admissions (1 page)
      │  └─ Application Submission
      ├─ 📊 Analytics (1 page)
      │  └─ Dashboard
      ├─ 📝 CMS/Docs (2 pages)
      │  ├─ New Page (Notion-style)
      │  └─ Magazine Article
      └─ 🎨 Design (1 page)
         └─ New Canvas (Figma-style)
```

### Channels (Stubbed)

- **#Staff** - 0 messages
- **#Events** - 0 messages
- **#Finance** - 0 messages

---

## Quick Reference

### Navigation Keyboard Shortcuts (Future)

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K` | Global search |
| `Cmd/Ctrl + N` | New page |
| `Cmd/Ctrl + ,` | Settings |
| `Cmd/Ctrl + /` | Show keyboard shortcuts |
| `Cmd/Ctrl + B` | Toggle workspace navigator |

### Element Type Quick Reference

| Type | Domain | Persisted? | Can Contain Children? |
|------|--------|------------|----------------------|
| **field** | data | ✅ Yes | ❌ No |
| **record** | data | ✅ Yes | ❌ No |
| **markup** | ui | ❌ No | ❌ No |
| **structure** | ui | ❌ No | ✅ Yes (max depth 3) |

### Common Element Subtypes

| Type | Common Subtypes |
|------|----------------|
| **field** | text, email, number, date, selectSingle, selectMulti, checkbox |
| **record** | image, video, person, organization, product, event, chart, data-table |
| **markup** | title, heading, paragraph, button, link, icon, divider |
| **structure** | div, stack, grid, flex, card, panel, tabs, accordion, modal, canvas |

---

## Support & Documentation

### Additional Resources

- **Architecture Docs:**
  - `GENERIC_ELEMENT_TYPES.md` - Complete element type specifications
  - `ELEMENT_SETTINGS_ARCHITECTURE.md` - Settings groups and theme system
  - `COMPREHENSIVE_EXAMPLES_EVALUATION.md` - All 8 example pages with JSON
  - `WORKSPACE_NAVIGATOR_APPROACH_EVALUATION.md` - Navigation structure
  - `INITIAL_USER_EXPERIENCE.md` - UX design and onboarding

### Getting Help

- **In-App Help:** Click the help icon (?) in the Global Bar
- **Guided Journey:** Start the onboarding tour from the Home page
- **Example Pages:** Explore the Showcase to learn by example
- **JSON Inspection:** View element JSON in the page editor

---

**Document Version:** 1.0
**Last Updated:** 2025-11-21
**Status:** Ready for Implementation
