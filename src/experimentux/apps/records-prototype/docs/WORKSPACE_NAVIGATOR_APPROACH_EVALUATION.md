# Workspace Navigator Approach Evaluation

**Date:** 2025-11-21
**Version:** 1.0
**Branch:** `claude/prototype-drag-drop-015wNpJGKT2xLTeY9SkKwSgD`
**Evaluator:** CTO with Enterprise Platform Experience

---

## Executive Summary

**Evaluation Request:** Assess a new approach for the `central-domain-prototype` app that uses a **Workspace Navigator** structure with a **LinkedIn-style 2-column home feed** instead of the previously documented Gallery Home approach.

**Key Changes:**
1. Product name: **"Central"** (enterprise workspace platform)
2. Navigation: Comprehensive workspace navigator (Slack/Teams-inspired)
3. Home page: 2-column activity feed (LinkedIn-inspired)
4. Structure: Contacts, Tasks, Apps, Messages, Files, Calendar, Reports
5. Organization: Lists (hierarchical), Channels (team collaboration), Recently Viewed

**Recommendation:** ✅ **HYBRID APPROACH** - Combine best of both worlds

**Rationale:** The Workspace Navigator structure positions Central as a real enterprise platform, but we should preserve the Gallery/Showcase concept for demonstrating page builder capabilities. Start with workspace structure and seed with practical examples.

---

## Approach Comparison

### Previously Documented: Gallery Home

**Structure:**
```
/                     Gallery Home (landing page)
/examples/:id         Example detail pages (read-only)
/pages                User pages list
/pages/:id            Page editor
```

**Navigation:**
- Simple: Gallery | Pages | Settings
- Focus on showcasing 8 examples
- Educational/demo-first

**Strengths:**
- ✅ Clear demonstration of capabilities
- ✅ Simple to understand and implement
- ✅ Lower scope (6-8 weeks)
- ✅ Perfect for prototype/proof-of-concept

**Weaknesses:**
- ❌ Doesn't feel like a "real" application
- ❌ Limited navigation structure
- ❌ Unclear how examples fit into daily workflow
- ❌ No sense of collaboration or workspace

### Newly Proposed: Workspace Navigator

**Structure:**
```
/                     Home (2-column feed, default)
/contacts             Contacts list/detail
/tasks                Tasks list/detail
/messages             Messages (app)
/files                Files (app)
/calendar             Calendar (app)
/reports              Reports (app)
/lists/:id            Lists view (hierarchical organization)
/channels/:id         Channel detail (team collaboration)
```

**Navigation (Workspace Navigator):**
```
Home
Contacts
Tasks

Apps
├─ Messages
├─ Files
├─ Calendar
├─ Reports
└─ Add App

Recently Viewed
├─ [Contact sample]
├─ [Email sample]
└─ [Event landing sample]

Lists
└─ [📁 Demos]
   └─ [📄 All sample pages]
      └─ [By Type]
         ├─ [📐 Full-width fluid]
         ├─ [📐 Narrow]
         └─ ...

Channels
├─ #Staff
├─ #Events
└─ #Finance
```

**Strengths:**
- ✅ Feels like a real enterprise platform
- ✅ Familiar navigation (Slack/Teams/Notion-inspired)
- ✅ Shows how page builder fits into broader platform
- ✅ Demonstrates collaboration features (Channels)
- ✅ Hierarchical organization (Lists)
- ✅ Activity tracking (Recently Viewed)
- ✅ "Central" is a strong product name

**Weaknesses:**
- ❌ Significantly more scope (10-14 weeks vs 6-8 weeks)
- ❌ Requires implementing multiple "apps" (Messages, Files, Calendar)
- ❌ 2-column feed requires activity/content data
- ❌ Channels need message threading, real-time updates
- ❌ Lists need CRUD operations, drag-and-drop reordering
- ❌ Risk of becoming too complex for initial prototype

---

## Detailed Analysis

### 1. Navigation Structure

#### Workspace Navigator (Proposed)

**Sections:**

1. **Core Pages** (always visible)
   - Home (default landing)
   - Contacts
   - Tasks

2. **Apps** (expandable section)
   - Messages - Team communication
   - Files - Document management
   - Calendar - Events and scheduling
   - Reports - Analytics and insights
   - Add App - Extensibility (future)

3. **Recently Viewed** (dynamic)
   - Automatically populated based on user activity
   - Shows last 3-5 viewed items
   - Mixed types: contacts, pages, emails, etc.

4. **Lists** (hierarchical organization)
   - User-created folders and collections
   - Pre-seeded with "Demos" folder containing:
     - All sample pages
     - Organized by type (Full-width, Narrow, Canvas, etc.)

5. **Channels** (team collaboration)
   - #Staff - Company-wide communication
   - #Events - Event planning and coordination
   - #Finance - Financial discussions
   - Similar to Slack channels or Teams channels

**Complexity Assessment:**

| Section | Implementation Effort | Data Requirements | Real-time Needs |
|---------|----------------------|-------------------|-----------------|
| Core Pages | Medium (3 new list views) | Contacts, Tasks schemas | No |
| Apps | High (4 mini-apps) | Messages, Files, Events, Analytics | Yes (Messages) |
| Recently Viewed | Low (activity tracking) | User activity log | No |
| Lists | Medium (hierarchical CRUD) | Lists, Items schemas | No |
| Channels | High (threading, real-time) | Messages, Channels schemas | Yes |

**Estimated Timeline:** 10-14 weeks

#### Gallery Home (Previously Documented)

**Sections:**

1. **Gallery** - 8 example cards
2. **Pages** - User-created pages
3. **Settings** - App configuration

**Complexity Assessment:**

| Section | Implementation Effort | Data Requirements | Real-time Needs |
|---------|----------------------|-------------------|-----------------|
| Gallery | Low (static cards) | 8 example JSONs | No |
| Pages | Low (list + detail views) | Pages schema | No |
| Settings | Low (form) | User preferences | No |

**Estimated Timeline:** 6-8 weeks

---

### 2. Home Page Layout

#### LinkedIn-Style 2-Column Feed (Proposed)

**Typical LinkedIn Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Global Bar (workspace, search, notifications)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐│
│  │ Left Column (60%)    │  │ Right Column (40%)               ││
│  │ ═══════════════════  │  │ ═══════════════════              ││
│  │                      │  │                                  ││
│  │ Activity Feed:       │  │ Quick Links:                     ││
│  │                      │  │ ┌────────────────────────────┐  ││
│  │ ┌──────────────────┐ │  │ │ 🆕 New Page               │  ││
│  │ │ Post/Update 1    │ │  │ │ 🎨 New Canvas             │  ││
│  │ │ Sarah added a... │ │  │ │ 👁 View Showcase          │  ││
│  │ └──────────────────┘ │  │ └────────────────────────────┘  ││
│  │                      │  │                                  ││
│  │ ┌──────────────────┐ │  │ Recent Activity:                ││
│  │ │ Post/Update 2    │ │  │ • Contact updated (2h ago)      ││
│  │ │ John created...  │ │  │ • Event published (5h ago)      ││
│  │ └──────────────────┘ │  │ • Report generated (1d ago)     ││
│  │                      │  │                                  ││
│  │ ┌──────────────────┐ │  │ Channels:                       ││
│  │ │ Post/Update 3    │ │  │ #Staff (3 unread)               ││
│  │ │ Mike commented...│ │  │ #Events (0 unread)              ││
│  │ └──────────────────┘ │  │ #Finance (1 unread)             ││
│  │                      │  │                                  ││
│  │ ┌──────────────────┐ │  │ Upcoming:                       ││
│  │ │ Post/Update 4    │ │  │ • Team Meeting (Today 2pm)      ││
│  │ │ ...              │ │  │ • Q4 Review (Tomorrow)          ││
│  │ └──────────────────┘ │  │                                  ││
│  │                      │  │                                  ││
│  └──────────────────────┘  └──────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Left Column (60% width):**
- **Activity Feed** - Chronological updates
  - User actions (created page, updated contact, commented)
  - System events (report generated, task completed)
  - Team activity (channel messages, file uploads)
- **Post Types:**
  - Page published
  - Contact added/updated
  - Event created
  - Report shared
  - Channel message highlights
- **Interactions:** Like, comment, share (future)

**Right Column (40% width):**
- **Quick Links** (requested by user)
  - 🆕 New Page
  - 🎨 New Canvas
  - 👁 View Showcase
- **Recent Activity** - Last 5 actions
- **Channels** - Active channels with unread counts
- **Upcoming** - Calendar events, task due dates
- **Suggestions** - "People you may know", "Pages you might like" (future)

**Content Requirements:**

To make this feed valuable, we need:
1. ✅ Activity tracking system (log all user actions)
2. ✅ Activity feed data model (actor, action, object, timestamp)
3. ✅ Activity renderer (different card types for different actions)
4. ✅ Real-time updates (WebSocket or polling)
5. ❌ User posts/comments system (beyond prototype scope?)
6. ❌ Like/reaction system (beyond prototype scope?)

**Complexity:** Medium-High (activity tracking is straightforward, but feed rendering and real-time updates add complexity)

#### Gallery Home (Previously Documented)

**Layout:**

```
┌─────────────────────────────────────────────────────────────────┐
│ Global Bar                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Gallery: Explore Examples                                      │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                                 │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ Example 1      │  │ Example 2      │  │ Example 3      │   │
│  │ [Screenshot]   │  │ [Screenshot]   │  │ [Screenshot]   │   │
│  │ View Example → │  │ View Example → │  │ View Example → │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                  │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐   │
│  │ Example 4      │  │ Example 5      │  │ Example 6      │   │
│  │ [Screenshot]   │  │ [Screenshot]   │  │ [Screenshot]   │   │
│  │ View Example → │  │ View Example → │  │ View Example → │   │
│  └────────────────┘  └────────────────┘  └────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Complexity:** Low (static grid, no real-time updates)

---

### 3. Data Model Implications

#### Workspace Navigator Approach

**New Schemas Required:**

```javascript
// Contacts
{
  id: string,
  name: string,
  email: string,
  phone: string,
  company: string,
  tags: string[],
  customFields: object,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Tasks
{
  id: string,
  title: string,
  description: string,
  status: enum('todo', 'in-progress', 'done'),
  priority: enum('low', 'medium', 'high'),
  assignee: userId,
  dueDate: timestamp,
  tags: string[],
  createdAt: timestamp,
  updatedAt: timestamp
}

// Messages (for Messages app and Channels)
{
  id: string,
  channelId: string,
  userId: string,
  content: string,
  threadId: string (for replies),
  attachments: object[],
  reactions: object[],
  createdAt: timestamp,
  updatedAt: timestamp
}

// Files
{
  id: string,
  name: string,
  type: string,
  size: number,
  url: string,
  folderId: string,
  uploadedBy: userId,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Calendar Events
{
  id: string,
  title: string,
  description: string,
  startTime: timestamp,
  endTime: timestamp,
  attendees: userId[],
  location: string,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Lists (hierarchical organization)
{
  id: string,
  name: string,
  parentId: string (null for top-level),
  type: enum('folder', 'list'),
  items: itemId[],
  createdAt: timestamp,
  updatedAt: timestamp
}

// Channels
{
  id: string,
  name: string,
  slug: string (e.g., 'staff', 'events'),
  description: string,
  isPrivate: boolean,
  members: userId[],
  createdAt: timestamp,
  updatedAt: timestamp
}

// Activity Feed
{
  id: string,
  actorId: userId,
  action: enum('created', 'updated', 'deleted', 'commented', etc.),
  objectType: enum('page', 'contact', 'task', 'message', etc.),
  objectId: string,
  metadata: object,
  createdAt: timestamp
}

// Recently Viewed
{
  id: string,
  userId: string,
  objectType: string,
  objectId: string,
  viewedAt: timestamp
}
```

**Database Complexity:** High (9 new schemas + relationships)

#### Gallery Approach

**Schemas Required:**

```javascript
// Pages (already defined)
{
  id: string,
  name: string,
  type: string,
  zones: object,
  isExample: boolean,
  isReadOnly: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Workspaces (already defined)
{
  id: string,
  name: string,
  slug: string,
  ownerId: userId,
  createdAt: timestamp,
  updatedAt: timestamp
}

// Users (minimal)
{
  id: string,
  name: string,
  email: string,
  avatar: string,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

**Database Complexity:** Low (3 schemas)

---

### 4. Feature Scope Comparison

| Feature | Gallery Approach | Workspace Navigator | Effort Increase |
|---------|------------------|---------------------|-----------------|
| **Navigation** | Simple (3 items) | Complex (15+ items) | 5x |
| **Home Page** | Static gallery | Activity feed | 3x |
| **Core Data** | Pages only | Pages + Contacts + Tasks + Files + Events | 5x |
| **Apps** | None | Messages, Files, Calendar, Reports | New (8-10 weeks) |
| **Collaboration** | None | Channels with threading | New (4-6 weeks) |
| **Organization** | Flat list | Hierarchical Lists | 2x |
| **Activity Tracking** | None | Recently Viewed + Feed | New (2-3 weeks) |
| **Real-time** | None | Messages, Channels | New (3-4 weeks) |

**Overall Effort Increase:** ~3-4x (6-8 weeks → 18-24 weeks)

---

## Recommendation: HYBRID APPROACH

### Core Concept

**Combine the best of both approaches:**

1. ✅ **Use Workspace Navigator structure** - Positions Central as real enterprise platform
2. ✅ **Simplify initial scope** - Implement core navigation, stub out complex features
3. ✅ **LinkedIn-style Home with showcase focus** - Activity feed + Quick Links to showcase
4. ✅ **Pre-populate with practical examples** - Contacts, Tasks, Pages from the 8 examples
5. ✅ **Phase implementation** - Start with essentials, add apps iteratively

### Hybrid Structure

**Navigation (Week 1-2):**
```
Home                          ✅ Implement (2-column feed)
Contacts                      ✅ Implement (list + detail from CRM example)
Tasks                         ✅ Implement (simple list from sample data)

Apps
├─ Pages                      ✅ Implement (our core feature)
├─ Messages                   ⏸️ Stub (placeholder)
├─ Files                      ⏸️ Stub (placeholder)
├─ Calendar                   ⏸️ Stub (placeholder)
└─ Reports                    ⏸️ Stub (placeholder)

Recently Viewed               ✅ Implement (simple activity tracking)

Lists
└─ 📁 Showcase                ✅ Implement (pre-seeded with 8 examples)
   └─ All Examples
      └─ By Type
         ├─ CRM
         ├─ Marketing
         ├─ HR
         └─ ...

Channels                      ⏸️ Stub (placeholder)
├─ #Staff
├─ #Events
└─ #Finance
```

**Legend:**
- ✅ Implement - Build fully functional
- ⏸️ Stub - Create navigation item, show "Coming Soon" placeholder

**Home Page (Week 3-4):**

```
┌─────────────────────────────────────────────────────────────────┐
│ Global Bar                                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────┐  ┌──────────────────────────────────┐│
│  │ Left: Activity Feed  │  │ Right: Quick Links + Showcase    ││
│  │ ═══════════════════  │  │ ═══════════════════              ││
│  │                      │  │                                  ││
│  │ Recent Activity:     │  │ Quick Links:                     ││
│  │                      │  │ ┌────────────────────────────┐  ││
│  │ ┌──────────────────┐ │  │ │ 🆕 New Page               │  ││
│  │ │ You viewed       │ │  │ │ 🎨 New Canvas             │  ││
│  │ │ "CRM Contact"    │ │  │ │ 👁 View Showcase          │  ││
│  │ │ 2 hours ago      │ │  │ └────────────────────────────┘  ││
│  │ └──────────────────┘ │  │                                  ││
│  │                      │  │ Showcase Examples:              ││
│  │ ┌──────────────────┐ │  │ ┌────────────────────────────┐ ││
│  │ │ You added        │ │  │ │ 📱 CRM Contact            │ ││
│  │ │ "John Doe" to    │ │  │ │ HubSpot-style CRM...      │ ││
│  │ │ Contacts         │ │  │ │ [View Example →]          │ ││
│  │ │ 1 day ago        │ │  │ └────────────────────────────┘ ││
│  │ └──────────────────┘ │  │                                  ││
│  │                      │  │ ┌────────────────────────────┐ ││
│  │ ┌──────────────────┐ │  │ │ 🎪 Event Landing          │ ││
│  │ │ System generated │ │  │ │ Full-width hero...        │ ││
│  │ │ sample data      │ │  │ │ [View Example →]          │ ││
│  │ │ 2 days ago       │ │  │ └────────────────────────────┘ ││
│  │ └──────────────────┘ │  │                                  ││
│  │                      │  │ ┌────────────────────────────┐ ││
│  │ (Simple activity     │  │ │ 📊 Dashboard              │ ││
│  │  feed showing last   │  │ │ Analytics with charts...  │ ││
│  │  10 user actions)    │  │ │ [View Example →]          │ ││
│  │                      │  │ └────────────────────────────┘ ││
│  │                      │  │                                  ││
│  │                      │  │ [View All 8 Examples →]         ││
│  │                      │  │                                  ││
│  └──────────────────────┘  └──────────────────────────────────┘│
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Left: Simple activity feed (last 10 actions)
- Right: Quick Links (as requested) + Featured showcase examples
- No complex threading or interactions initially
- Focus remains on demonstrating page builder capabilities

---

### Phase Implementation Plan

#### Phase 1: Foundation + Home (Weeks 1-4)

**Deliverables:**
1. ✅ Workspace Navigator component
   - All sections visible
   - Stubs for complex features (Messages, Files, Calendar, Channels)
   - Functional for: Home, Contacts, Tasks, Pages, Lists

2. ✅ Global Bar
   - Workspace selector (static: "Demo Workspace")
   - Search (functional for pages, contacts, tasks)
   - Notifications (empty initially)
   - User avatar

3. ✅ Home page (2-column)
   - Left: Simple activity feed (last 10 actions)
   - Right: Quick Links + Featured showcase examples
   - Responsive design

4. ✅ Activity tracking system
   - Log user views, creates, updates
   - Simple activity feed data model
   - Render activity cards

**Timeline:** 4 weeks
**Complexity:** Medium

---

#### Phase 2: Contacts + Tasks (Weeks 5-7)

**Deliverables:**
1. ✅ Contacts app
   - List view (grid/table)
   - Detail view (based on CRM example)
   - Create/Edit forms
   - Pre-seeded with sample contacts (from CRM example)

2. ✅ Tasks app
   - List view (kanban or table)
   - Detail view
   - Create/Edit forms
   - Pre-seeded with sample tasks

3. ✅ Recently Viewed
   - Track page, contact, task views
   - Show last 5 items in navigator
   - Click to navigate to detail

**Timeline:** 3 weeks
**Complexity:** Medium

---

#### Phase 3: Pages + Showcase (Weeks 8-11)

**Deliverables:**
1. ✅ Pages app (our core feature)
   - List view (all user pages)
   - Detail/Editor view (drag-and-drop)
   - Create new page (from template or blank)
   - Pre-seeded with 8 example pages

2. ✅ Lists / Showcase organization
   - "Showcase" folder in Lists
   - Hierarchical view (folder → examples → by type)
   - Pre-seeded with 8 examples organized by vertical

3. ✅ Element system
   - Field, Record, Markup, Structure types
   - Render from JSON
   - Theme token resolution
   - Zod validation

**Timeline:** 4 weeks
**Complexity:** High (core feature)

---

#### Phase 4: Drag-and-Drop Editor (Weeks 12-16)

**Deliverables:**
1. ✅ Page editor with drag-and-drop
2. ✅ Element picker panel
3. ✅ Settings panel
4. ✅ Canvas rendering modes
5. ✅ Save/publish functionality

**Timeline:** 5 weeks
**Complexity:** Very High

**Total Timeline:** 16 weeks (vs 6-8 for Gallery approach)

---

#### Future Phases (Post-MVP)

**Phase 5: Messages App (4-6 weeks)**
- Channel threading
- Real-time updates (WebSocket)
- Message composer
- File attachments

**Phase 6: Files App (3-4 weeks)**
- File upload/download
- Folder hierarchy
- File preview
- Sharing permissions

**Phase 7: Calendar App (3-4 weeks)**
- Event creation
- Calendar views (day, week, month)
- Attendee management
- Event reminders

**Phase 8: Reports App (4-6 weeks)**
- Report builder
- Data visualization
- Scheduled reports
- Export functionality

---

## Sitemap (Hybrid Approach)

### Proposed URL Structure

```
/                                    Home (2-column feed)
├─ /contacts                         Contacts list
│  ├─ /new                           Create contact
│  └─ /:contactId                    Contact detail
│
├─ /tasks                            Tasks list
│  ├─ /new                           Create task
│  └─ /:taskId                       Task detail
│
├─ /pages                            Pages list
│  ├─ /new                           Create page (template selector)
│  └─ /:pageId                       Page detail/editor
│     ├─ /edit                       Edit mode
│     └─ /preview                    Preview mode
│
├─ /showcase                         Showcase gallery (8 examples)
│  ├─ /crm                           CRM examples
│  ├─ /marketing                     Marketing examples
│  ├─ /hr                            HR examples
│  ├─ /analytics                     Analytics examples
│  └─ /:exampleId                    Example detail (read-only)
│
├─ /lists                            Lists overview
│  └─ /:listId                       List detail
│
├─ /apps                             Apps hub
│  ├─ /messages                      Messages (stub)
│  ├─ /files                         Files (stub)
│  ├─ /calendar                      Calendar (stub)
│  └─ /reports                       Reports (stub)
│
├─ /channels                         Channels overview (stub)
│  └─ /:channelId                    Channel detail (stub)
│
└─ /settings                         App settings
   ├─ /profile                       User profile
   ├─ /workspace                     Workspace settings
   └─ /preferences                   User preferences
```

### Navigation Mapping

**Workspace Navigator → URL Mapping:**

| Navigator Item | URL | Status |
|---------------|-----|--------|
| Home | `/` | Implemented |
| Contacts | `/contacts` | Implemented |
| Tasks | `/tasks` | Implemented |
| Apps → Pages | `/pages` | Implemented |
| Apps → Messages | `/apps/messages` | Stub |
| Apps → Files | `/apps/files` | Stub |
| Apps → Calendar | `/apps/calendar` | Stub |
| Apps → Reports | `/apps/reports` | Stub |
| Recently Viewed → [item] | `/:type/:id` | Implemented |
| Lists → Showcase | `/showcase` | Implemented |
| Channels → #Staff | `/channels/staff` | Stub |
| Channels → #Events | `/channels/events` | Stub |
| Channels → #Finance | `/channels/finance` | Stub |

---

## User Guide Outline

### Proposed Document: `CENTRAL_DOMAIN_PROTOTYPE_USER_GUIDE.md`

**Structure:**

```markdown
# Central: Domain-Based Workspace Platform

## Overview
Central is an enterprise workspace platform that demonstrates domain-based
architecture for building flexible, data-driven applications. It combines
CRM, task management, content management, and collaboration tools in a
unified interface.

## Getting Started

### First Launch
When you first open Central, you'll see:
- Home feed with recent activity
- Quick Links to create pages and canvases
- Featured showcase examples

### Navigation
Central uses a workspace navigator (left sidebar) with five main sections:
1. Core Apps (Home, Contacts, Tasks)
2. Apps (Pages, Messages, Files, Calendar, Reports)
3. Recently Viewed (your last 5 items)
4. Lists (organized collections)
5. Channels (team communication)

## Core Features

### 1. Home
The Home page shows:
- Activity feed (left column) - recent actions across all apps
- Quick Links (right column) - create new pages, view showcase
- Featured examples (right column) - discover capabilities

### 2. Contacts
Manage your contacts with:
- List view (grid or table)
- Detail view (full contact record)
- Custom fields and tags
- Activity timeline

Pre-seeded with sample contacts from the CRM showcase example.

### 3. Tasks
Track your work with:
- Task list (kanban or table view)
- Task details with status, priority, due dates
- Assignee management
- Tags and custom fields

### 4. Pages
Build custom pages with our drag-and-drop editor:
- Create from templates or blank canvas
- Use 4 element types: field, record, markup, structure
- Save and publish pages
- View all your pages in one place

### 5. Showcase
Explore 8 comprehensive examples:
- CRM Contact (HubSpot-style)
- Event Landing Page (full-width marketing)
- Application Submission (canvas-based form)
- Analytics Dashboard (charts and KPIs)
- Notion-style Page (block editor)
- Figma-style Canvas (infinite design surface)
- Magazine Article (editorial layout)
- Renewal Email (marketing email)

### 6. Lists
Organize your content:
- Create custom folders and lists
- Drag-and-drop items to organize
- Pre-seeded "Showcase" folder with examples

### 7. Recently Viewed
Quick access to your last 5 viewed items across all apps.

## Sample Data

Central comes pre-populated with:
- 8 comprehensive example pages (read-only)
- 10 sample contacts (from CRM example)
- 15 sample tasks (various statuses)
- 1 demo workspace
- 1 demo user account

## Advanced Features

### Page Builder
- Drag-and-drop elements
- JSON-driven configuration
- Theme token support
- Zod validation
- 4 element types (field, record, markup, structure)

### Layouts
- 3-column (fixed-fluid-fixed)
- 2-column (fluid-fixed)
- Single column (fluid)
- Full-width + constrained
- Canvas (infinite)
- Grid-based (dashboard)

### Data Binding
- Static values
- Bound read (display data)
- Bound write (update data)
- Bound bidirectional (two-way sync)

## Coming Soon

The following features are stubbed (visible but not yet functional):
- Messages app (team communication)
- Files app (document management)
- Calendar app (event scheduling)
- Reports app (analytics and insights)
- Channels (team collaboration)
```

---

## Sample Data Strategy

### Pre-Populated Data (Initial Load)

**Pages (8 examples):**
- All 8 from COMPREHENSIVE_EXAMPLES_EVALUATION.md
- Marked `isExample: true, isReadOnly: true`
- Organized in "Showcase" list by vertical

**Contacts (10 samples):**
Based on CRM example, create realistic contacts:
```javascript
[
  { name: "John Doe", email: "john@acme.com", company: "Acme Corp", role: "Senior Engineer", tags: ["enterprise", "hot-lead"] },
  { name: "Sarah Johnson", email: "sarah@techstart.io", company: "TechStart", role: "Founder & CEO", tags: ["startup", "qualified"] },
  { name: "Michael Chen", email: "mchen@globalsoft.com", company: "GlobalSoft", role: "VP Engineering", tags: ["enterprise", "decision-maker"] },
  { name: "Emily Rodriguez", email: "emily@innovate.co", company: "Innovate Labs", role: "Product Manager", tags: ["mid-market", "champion"] },
  { name: "David Kim", email: "dkim@fastgrow.com", company: "FastGrow Inc", role: "CTO", tags: ["growth-stage", "technical"] },
  { name: "Lisa Wang", email: "lisa@designco.com", company: "DesignCo", role: "Creative Director", tags: ["agency", "interested"] },
  { name: "Robert Martinez", email: "rob@ventures.vc", company: "Ventures VC", role: "Partner", tags: ["investor", "warm"] },
  { name: "Jennifer Lee", email: "jlee@edutech.org", company: "EduTech", role: "Director of IT", tags: ["education", "evaluation"] },
  { name: "Tom Anderson", email: "tanderson@healthplus.com", company: "HealthPlus", role: "Operations Manager", tags: ["healthcare", "pilot"] },
  { name: "Maria Garcia", email: "maria@retailmax.com", company: "RetailMax", role: "VP Marketing", tags: ["retail", "cold"] }
]
```

**Tasks (15 samples):**
```javascript
[
  { title: "Follow up with John Doe", status: "todo", priority: "high", dueDate: "2025-11-22", assignee: "Demo User" },
  { title: "Send proposal to Sarah Johnson", status: "in-progress", priority: "high", dueDate: "2025-11-23", assignee: "Demo User" },
  { title: "Schedule demo with Michael Chen", status: "todo", priority: "medium", dueDate: "2025-11-25", assignee: "Demo User" },
  { title: "Update CRM fields", status: "done", priority: "low", dueDate: "2025-11-20", assignee: "Demo User" },
  { title: "Review Q4 report", status: "in-progress", priority: "high", dueDate: "2025-11-24", assignee: "Demo User" },
  { title: "Create event landing page", status: "done", priority: "medium", dueDate: "2025-11-19", assignee: "Demo User" },
  { title: "Design dashboard mockup", status: "in-progress", priority: "medium", dueDate: "2025-11-26", assignee: "Demo User" },
  { title: "Test application form", status: "todo", priority: "low", dueDate: "2025-11-27", assignee: "Demo User" },
  { title: "Write article content", status: "done", priority: "medium", dueDate: "2025-11-18", assignee: "Demo User" },
  { title: "Set up renewal email campaign", status: "todo", priority: "high", dueDate: "2025-11-28", assignee: "Demo User" },
  { title: "Update showcase examples", status: "in-progress", priority: "low", dueDate: "2025-11-29", assignee: "Demo User" },
  { title: "Review competitor analysis", status: "todo", priority: "medium", dueDate: "2025-11-30", assignee: "Demo User" },
  { title: "Prepare team meeting agenda", status: "todo", priority: "low", dueDate: "2025-12-01", assignee: "Demo User" },
  { title: "Update documentation", status: "in-progress", priority: "low", dueDate: "2025-12-02", assignee: "Demo User" },
  { title: "Test new canvas features", status: "todo", priority: "medium", dueDate: "2025-12-03", assignee: "Demo User" }
]
```

**Lists (Pre-seeded hierarchy):**
```javascript
{
  id: "list-showcase",
  name: "Showcase",
  type: "folder",
  children: [
    {
      id: "list-showcase-all",
      name: "All Examples",
      type: "list",
      items: ["example-crm-contact", "example-event-landing", ...] // all 8
    },
    {
      id: "list-showcase-by-type",
      name: "By Type",
      type: "folder",
      children: [
        { id: "list-type-crm", name: "CRM", items: ["example-crm-contact"] },
        { id: "list-type-marketing", name: "Marketing", items: ["example-event-landing", "example-renewal-email"] },
        { id: "list-type-hr", name: "HR/Admissions", items: ["example-application"] },
        { id: "list-type-analytics", name: "Analytics", items: ["example-dashboard"] },
        { id: "list-type-cms", name: "CMS/Docs", items: ["example-notion-page", "example-article"] },
        { id: "list-type-design", name: "Design", items: ["example-figma-canvas"] }
      ]
    }
  ]
}
```

**Channels (Stubbed):**
```javascript
[
  { id: "staff", name: "Staff", slug: "staff", description: "Company-wide announcements", members: ["demo-user"], unreadCount: 0 },
  { id: "events", name: "Events", slug: "events", description: "Event planning and coordination", members: ["demo-user"], unreadCount: 0 },
  { id: "finance", name: "Finance", slug: "finance", description: "Financial discussions", members: ["demo-user"], unreadCount: 0 }
]
```

**Activity Feed (Auto-generated):**
```javascript
[
  { actor: "System", action: "generated", object: "sample data", timestamp: "2025-11-21T00:00:00Z" },
  { actor: "Demo User", action: "viewed", object: "CRM Contact example", timestamp: "2025-11-21T10:30:00Z" },
  { actor: "Demo User", action: "viewed", object: "Event Landing example", timestamp: "2025-11-21T10:45:00Z" },
  { actor: "Demo User", action: "created", object: "Contact: John Doe", timestamp: "2025-11-21T11:00:00Z" },
  { actor: "Demo User", action: "updated", object: "Task: Follow up with John Doe", timestamp: "2025-11-21T11:15:00Z" }
]
```

---

## Quick Links Implementation

### Requested Quick Links (Right Column of Home)

**1. 🆕 New Page**
- Opens page creation modal
- Template selector (8 examples + blank)
- Name input
- Create button → navigates to `/pages/:newId/edit`

**2. 🎨 New Canvas**
- Shortcut to create canvas-based page
- Pre-selects "Figma-style Canvas" template
- Opens directly in edit mode with canvas tools

**3. 👁 View Showcase**
- Navigates to `/showcase`
- Gallery view of all 8 examples
- Filters by vertical (CRM, Marketing, HR, etc.)
- Search functionality

**Quick Links Component:**

```jsx
<QuickLinksPanel>
  <PanelTitle>Quick Links</PanelTitle>

  <QuickLink icon="🆕" href="/pages/new" primary>
    New Page
  </QuickLink>

  <QuickLink icon="🎨" href="/pages/new?template=canvas">
    New Canvas
  </QuickLink>

  <QuickLink icon="👁" href="/showcase">
    View Showcase
  </QuickLink>
</QuickLinksPanel>
```

---

## Pros/Cons Summary

### Hybrid Approach Pros ✅

1. **Real Enterprise Feel**
   - Workspace navigator = familiar structure
   - Multiple apps = comprehensive platform
   - Channels + Lists = collaboration + organization

2. **Maintains Showcase Focus**
   - Quick Links prominently feature "View Showcase"
   - Right column highlights featured examples
   - Showcase organized in Lists for easy browsing

3. **Practical Sample Data**
   - Contacts, Tasks provide context for examples
   - Activity feed shows real usage patterns
   - Recently Viewed demonstrates navigation

4. **Phased Implementation**
   - Can ship working product in 10-12 weeks (Phase 1-3)
   - Stubs communicate future vision
   - Incremental complexity

5. **"Central" Branding**
   - Strong product name
   - Positions as enterprise platform
   - Clear value proposition

### Hybrid Approach Cons ❌

1. **Increased Complexity**
   - 2x effort vs Gallery approach (10-12 weeks vs 6-8 weeks)
   - More data models to manage
   - More UI components to build

2. **Stubbed Features**
   - Messages, Files, Calendar, Channels not functional
   - May feel incomplete
   - Need "Coming Soon" messaging

3. **Activity Feed Requires Content**
   - Empty feed on first load (until user takes actions)
   - Need to seed initial activity
   - Real-time updates add complexity

4. **Navigation Complexity**
   - 15+ items in navigator vs 3 in Gallery
   - May overwhelm new users
   - Need good onboarding

---

## Final Recommendation

### ✅ PROCEED with HYBRID APPROACH

**Reasoning:**

1. **Strategic Positioning:** The Workspace Navigator structure positions Central as a real enterprise platform, not just a page builder demo. This aligns better with long-term vision.

2. **Maintains Showcase Value:** By featuring Quick Links ("View Showcase") and highlighting examples in the Home feed, we preserve the Gallery's educational value while adding context.

3. **Practical Scope:** With stubbed features, we can deliver a working product in 10-12 weeks (vs 18-24 for full implementation). Stubs communicate vision without requiring full builds.

4. **Sample Data Adds Context:** Contacts and Tasks provide real-world context for the page examples. Users understand how pages fit into broader workflows.

5. **Phased Growth:** We can ship Phase 1-3 (Home, Contacts, Tasks, Pages, Showcase) as MVP, then add Messages, Files, Calendar in future phases based on feedback.

**Modifications to Proposal:**

1. ✅ **Keep:** Workspace Navigator structure
2. ✅ **Keep:** LinkedIn-style 2-column home
3. ✅ **Keep:** Quick Links (New Page, New Canvas, View Showcase)
4. ✅ **Keep:** Lists with Showcase hierarchy
5. ✅ **Keep:** "Central" product name
6. ✅ **Modify:** Stub complex features (Messages, Files, Calendar, Channels)
7. ✅ **Add:** Featured examples in Home right column
8. ✅ **Add:** Simple activity feed (vs complex threading)

**Next Steps:**

1. Create `CENTRAL_DOMAIN_PROTOTYPE_USER_GUIDE.md` with overview and sitemap
2. Update INITIAL_USER_EXPERIENCE.md to reflect Hybrid approach
3. Create sample data JSON files (contacts, tasks)
4. Begin Phase 1 implementation: Workspace Navigator + Home page

---

## Timeline Comparison

| Approach | Phase 1 | Phase 2 | Phase 3 | Phase 4 | Total |
|----------|---------|---------|---------|---------|-------|
| **Gallery (Original)** | Gallery Home (2w) | Examples (2w) | Database (1w) | Create New (2-3w) | **7-8 weeks** |
| **Workspace Navigator (Full)** | Foundation (4w) | Contacts+Tasks (3w) | Pages (4w) | Editor (5w) | **16 weeks** + 16w for apps |
| **Hybrid (Recommended)** | Foundation+Home (4w) | Contacts+Tasks (3w) | Pages+Showcase (4w) | Editor (5w) | **16 weeks** (MVP ready at 11w) |

**MVP Ready:** 11 weeks (Phases 1-3)
**Full Editor:** 16 weeks (All phases)
**Future Apps:** +16 weeks (Messages, Files, Calendar, Reports)

---

**Document Version:** 1.0
**Last Updated:** 2025-11-21
**Status:** Ready for Review
