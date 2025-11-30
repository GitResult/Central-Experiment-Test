# Initial User Experience: Central Domain Prototype

**Date:** 2025-11-21
**Version:** 2.0 (Updated for Hybrid Approach)
**Branch:** `claude/prototype-drag-drop-015wNpJGKT2xLTeY9SkKwSgD`

---

## Executive Summary

This document defines the initial page(s) and data that users will see when they first open **Central**, the domain-based workspace platform. The goal is to create an onboarding experience that:

1. **Welcomes new users** - Personalized greeting and guided journey
2. **Provides clear next steps** - Onboarding tasks with time estimates
3. **Offers quick actions** - Fast access to create contacts, events, tasks
4. **Shows platform potential** - Insights placeholder and showcase examples
5. **Establishes workspace context** - Full navigation structure visible

**Approach:** **Hybrid Workspace Navigator** with **Onboarding-Focused Home Page**

This combines:
- ✅ Enterprise workspace structure (Home, Contacts, Tasks, Apps, Lists, Channels)
- ✅ Beginner-friendly onboarding (guided journey, suggested tasks, quick links)
- ✅ Sample data for exploration (10 contacts, 15 tasks, 8 example pages)
- ✅ Phased implementation (stubs for complex features like Messages, Channels)

---

## Product Name: Central

**Central** positions the platform as:
- A central workspace for all enterprise needs
- A hub connecting CRM, tasks, content, and collaboration
- The center of productivity for teams

---

## Initial Route: `/`

### What Loads First

When a user opens the app for the first time, they land on `/` which displays the **Home** page with an onboarding focus.

**URL:** `http://localhost:5173/`

**Purpose:**
- Welcome new users with personalized greeting
- Provide guided journey to set up workspace
- Offer quick links to create first items
- Show placeholder for future insights
- Suggest next steps to complete onboarding

---

## Initial Page Structure

### Home Page (Onboarding Focus)

![Central Home Page - New User](/html-prototypes/sample-central-home-page-new-user.png)

**Layout:** Two-column with left-heavy content and right sidebar

```
┌─────────────────────────────────────────────────────────────────┐
│ Global Bar                                                       │
│ ☰ Central ▾  [+]              [Search Central]           JD [🔔]│
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────────────────────────────┐  ┌─────────────────┐ │
│  │ Left Content (60-70%)                │  │ Right Sidebar   │ │
│  │                                      │  │ (30-40%)        │ │
│  │ ┌──────────────────────────────────┐│  │                 │ │
│  │ │ Welcome Card                     ││  │ Quick Links     │ │
│  │ │                                  ││  │ ───────────────│ │
│  │ │ ☀️ Good Morning,                 ││  │ 📇 New contact │ │
│  │ │    Wednesday, July 8             ││  │ 📅 New event   │ │
│  │ │                                  ││  │ ✅ New task    │ │
│  │ │ Suggested next step:             ││  │                 │ │
│  │ │ [Introduce yourself]             ││  │                 │ │
│  │ └──────────────────────────────────┘│  │ Upcoming Tasks  │ │
│  │                                      │  │ ───────────────│ │
│  │ ┌──────────────────────────────────┐│  │ ○ Introduce    │ │
│  │ │ Journey Card (Blue, Prominent)   ││  │   yourself     │ │
│  │ │                                  ││  │   • 2 min      │ │
│  │ │ 👥 Your first journey with       ││  │   Start here   │ │
│  │ │    Central                       ││  │                 │ │
│  │ │                                  ││  │ ○ Meet your    │ │
│  │ │ A guided start to help you set   ││  │   team         │ │
│  │ │ up and explore.                  ││  │   • 2 min      │ │
│  │ │                                  ││  │                 │ │
│  │ │ [Start Journey]                  ││  │ ○ Invite a     │ │
│  │ │                                  ││  │   colleague    │ │
│  │ │ [Team illustration]              ││  │   • 1 min      │ │
│  │ └──────────────────────────────────┘│  │                 │ │
│  │                                      │  │                 │ │
│  │ ┌──────────────────────────────────┐│  │                 │ │
│  │ │ Insights                         ││  │                 │ │
│  │ │                                  ││  │                 │ │
│  │ │ 📊 [Chart illustration]          ││  │                 │ │
│  │ │                                  ││  │                 │ │
│  │ │ As you start using Central,      ││  │                 │ │
│  │ │ your workspace insights will     ││  │                 │ │
│  │ │ appear here                      ││  │                 │ │
│  │ └──────────────────────────────────┘│  │                 │ │
│  └──────────────────────────────────────┘  └─────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## UI Chrome (Persistent Elements)

### Global Bar (Always Visible)

The **Global Bar** appears at the top of every page:

```jsx
<GlobalBar>
  <Left>
    <HamburgerMenu />              {/* ☰ Opens workspace navigator */}
    <WorkspaceSelector value="Central" />  {/* Dropdown: Central ▾ */}
    <AddButton />                  {/* [+] Quick create */}
  </Left>

  <Center>
    <GlobalSearch placeholder="Search Central" />
  </Center>

  <Right>
    <NotificationBell count={0} />  {/* 🔔 */}
    <UserAvatar initials="JD" />    {/* User profile */}
  </Right>
</GlobalBar>
```

**Height:** 56px
**Background:** White (#FFFFFF)
**Border:** Bottom border 1px solid #E5E7EB
**Position:** Sticky top

---

### Workspace Navigator (Left Sidebar)

The **Workspace Navigator** slides in from the left when the hamburger menu (☰) is clicked.

**Structure:**

```
┌────────────────────────┐
│ WORKSPACE NAVIGATOR    │
├────────────────────────┤
│                        │
│ 🏠 Home                │
│ 👥 Contacts            │
│ ✅ Tasks               │
│                        │
│ ─────────────────────  │
│                        │
│ 📦 Apps                │
│  ├─ 📄 Pages           │
│  ├─ 💬 Messages        │
│  ├─ 📁 Files           │
│  ├─ 📅 Calendar        │
│  ├─ 📊 Reports         │
│  └─ ➕ Add App         │
│                        │
│ ─────────────────────  │
│                        │
│ 🕐 Recently Viewed     │
│  ├─ John Doe           │
│  ├─ Q4 Planning        │
│  └─ CRM Contact        │
│                        │
│ ─────────────────────  │
│                        │
│ 📋 Lists               │
│  └─ 📁 Showcase        │
│     └─ 📄 All Examples │
│        └─ 📂 By Type   │
│                        │
│ ─────────────────────  │
│                        │
│ 💬 Channels            │
│  ├─ #Staff             │
│  ├─ #Events            │
│  └─ #Finance           │
│                        │
└────────────────────────┘
```

**Width:** 280px (when open)
**Background:** #F9FAFB (light gray)
**State:** Collapsed by default, opens on click of ☰
**Mobile:** Full-screen overlay

---

## Home Page Components

### 1. Welcome Card

**Purpose:** Personalized greeting and immediate next step

**Content:**
- **Greeting:** "Good Morning," (time-sensitive: Morning, Afternoon, Evening)
- **Date:** "Wednesday, July 8" (current date)
- **Weather Icon:** ☀️ Sunny illustration (decorative, optional)
- **Suggested Next Step:** "Introduce yourself" button

**Styling:**
- Background: White (#FFFFFF)
- Border: 1px solid #E5E7EB
- Border radius: 12px
- Padding: 24px
- Shadow: Subtle (0 1px 3px rgba(0, 0, 0, 0.1))

**Action:**
- Click "Introduce yourself" → Navigate to `/settings/profile` to complete user profile

---

### 2. Journey Card

**Purpose:** Call-to-action for guided onboarding tour

**Content:**
- **Icon:** 👥 Team meeting illustration (isometric style)
- **Headline:** "Your first journey with Central"
- **Description:** "A guided start to help you set up and explore."
- **CTA Button:** "Start Journey" (primary, blue)

**Styling:**
- Background: Blue gradient (#4F46E5 to #6366F1)
- Text color: White
- Border radius: 12px
- Padding: 32px
- Shadow: Medium (0 4px 6px rgba(0, 0, 0, 0.1))
- Prominent visual hierarchy (largest card)

**Action:**
- Click "Start Journey" → Launch guided tour (modal overlay with step-by-step instructions)

**Tour Steps:**
1. Welcome to Central - Overview
2. Create your first contact - Navigate to `/contacts/new`
3. Add a task - Navigate to `/tasks/new`
4. Explore the Showcase - Navigate to `/showcase`
5. Build your first page - Navigate to `/pages/new`

---

### 3. Insights Card

**Purpose:** Placeholder for future workspace analytics

**Content:**
- **Icon:** 📊 Chart illustration with growth trend
- **Message:** "As you start using Central, your workspace insights will appear here"

**Styling:**
- Background: White (#FFFFFF)
- Border: 1px solid #E5E7EB
- Border radius: 12px
- Padding: 24px
- Min height: 200px
- Center-aligned content
- Text color: #6B7280 (gray-500, subtle)

**Future State:**
Once user has data, replace with:
- Active contacts (e.g., "23 active contacts")
- Tasks completed this week (e.g., "12 tasks completed")
- Pages created (e.g., "5 pages published")
- Activity chart (line chart showing daily activity)

---

### 4. Quick Links Panel (Right Sidebar)

**Purpose:** Fast access to create new items

**Content:**
- **📇 New contact** → Navigate to `/contacts/new`
- **📅 New event** → Navigate to `/calendar/new` (stubbed)
- **✅ New task** → Navigate to `/tasks/new`

**Styling:**
- Background: White (#FFFFFF)
- Border: 1px solid #E5E7EB
- Border radius: 12px
- Padding: 16px
- Each link:
  - Icon (emoji or SVG)
  - Label text
  - Hover: Background #F3F4F6 (gray-100)
  - Click: Navigate to creation form

**Future Additions:**
- 📄 New page (once user completes onboarding)
- 💬 New message (when Messages app is implemented)
- 📊 New report (when Reports app is implemented)

---

### 5. Upcoming Tasks Panel (Right Sidebar)

**Purpose:** Guide user through onboarding steps

**Content:**
- **Introduce yourself** • 2 min
  - Badge: "Start here" (green background)
  - Status: Incomplete (○)
  - Action: Navigate to `/settings/profile`

- **Meet your team** • 2 min
  - Status: Incomplete (○)
  - Action: Navigate to `/settings/workspace/members`

- **Invite a colleague** • 1 min
  - Status: Incomplete (○)
  - Action: Open invite modal

**Styling:**
- Background: White (#FFFFFF)
- Border: 1px solid #E5E7EB
- Border radius: 12px
- Padding: 16px
- Each task:
  - Checkbox (○ incomplete, ● in progress, ✓ complete)
  - Task title (bold)
  - Time estimate (light gray)
  - Badge (optional, for emphasis)

**Behavior:**
- Click task → Navigate to relevant page or open modal
- Check task → Mark complete, show next task
- All complete → Show success message and next steps

---

## Initial Data State

### Sample Data Approach

**Decision: Pre-populate with practical sample data**

**Rationale:**
- ✅ **Demonstrates value immediately** - Users see real-world examples
- ✅ **Provides learning material** - Sample contacts, tasks, pages show what's possible
- ✅ **Reduces empty state anxiety** - Something to explore on day one
- ✅ **Validates all features** - Sample data exercises all functionality
- ✅ **Contextualizes page builder** - Examples show how pages fit into workflows

---

### Pre-Populated Data

**Workspace:**
- Name: "Demo Workspace"
- Owner: "Demo User" (JD)
- Created: 2025-11-21

**User:**
- Name: "Demo User"
- Initials: "JD"
- Email: "demo@central.app"
- Avatar: None (shows initials)

**Contacts:** 10 sample contacts
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

**Tasks:** 15 sample tasks
- 7 To Do (various priorities and due dates)
- 5 In Progress
- 3 Done

**Pages:** 8 comprehensive example pages (read-only)
1. HubSpot CRM Contact
2. Event Landing Page
3. Application Submission
4. Analytics Dashboard
5. New Page (Notion-style)
6. New Canvas (Figma-style)
7. Magazine Article
8. Renewal Email

**Lists:** Pre-seeded hierarchy
```
📁 Showcase
   ├─ 📄 All Examples (8 pages)
   └─ 📂 By Type
      ├─ 💼 CRM (1)
      ├─ 📢 Marketing (2)
      ├─ 🎓 HR/Admissions (1)
      ├─ 📊 Analytics (1)
      ├─ 📝 CMS/Docs (2)
      └─ 🎨 Design (1)
```

**Channels:** Stubbed (no messages)
- #Staff
- #Events
- #Finance

**Recently Viewed:** Empty initially
- Populates as user navigates to contacts, tasks, pages

---

## User Flows from Home Page

### Flow 1: Start Guided Journey

```
User clicks "Start Journey" on blue card
  ↓
Modal opens with tour steps
  ↓
Step 1: Welcome - Explains Central's purpose
  ↓
Step 2: Create contact - Navigates to /contacts/new, pre-fills sample data
  ↓
User creates "Jane Smith" contact
  ↓
Step 3: Add task - Navigates to /tasks/new, pre-fills "Follow up with Jane"
  ↓
User creates task
  ↓
Step 4: Explore Showcase - Navigates to /showcase, highlights CRM example
  ↓
User views CRM Contact example
  ↓
Step 5: Build page - Navigates to /pages/new, shows template selector
  ↓
Tour complete - Show success message, mark "Introduce yourself" task done
```

### Flow 2: Create First Contact

```
User clicks "New contact" in Quick Links
  ↓
Navigates to /contacts/new
  ↓
Form opens with fields:
  - Name (required)
  - Email (required)
  - Phone
  - Company
  - Role/Title
  - Tags
  ↓
User fills form and clicks "Create Contact"
  ↓
Contact created, redirect to /contacts/:newContactId
  ↓
Contact detail page shows (based on CRM example layout)
  ↓
Recently Viewed updates with new contact
  ↓
Return to Home - "Introduce yourself" task marked complete
```

### Flow 3: Complete Onboarding Task

```
User clicks "Introduce yourself • 2 min" in Upcoming Tasks
  ↓
Navigates to /settings/profile
  ↓
Profile form opens:
  - Name: [Demo User] (pre-filled)
  - Email: [demo@central.app] (pre-filled)
  - Avatar: [Upload or select icon]
  - Bio: [text area]
  - Role: [dropdown]
  - Department: [dropdown]
  ↓
User updates profile and clicks "Save"
  ↓
Profile saved, redirect to Home
  ↓
"Introduce yourself" task marked complete (✓)
  ↓
Next task "Meet your team" becomes active with "Start here" badge
```

### Flow 4: Explore Showcase

```
User clicks Lists > Showcase > All Examples in navigator
  ↓
Navigates to /showcase
  ↓
Gallery view shows 8 example cards with screenshots
  ↓
User clicks "CRM Contact" example
  ↓
Navigates to /showcase/crm-contact
  ↓
Example page opens in read-only mode:
  - Left sidebar: About section
  - Center: Tabs (Overview, Activity, Emails)
  - Right sidebar: Quick Actions, Associated Records
  ↓
User explores, clicks tabs, views data
  ↓
Header shows: [← Back to Showcase] [Duplicate This Example] [View JSON]
  ↓
User clicks "Duplicate This Example"
  ↓
Modal opens: "Create new page from CRM Contact template?"
  ↓
User enters page name: "My Customer Portal"
  ↓
Page created at /pages/:newPageId, opens in edit mode
  ↓
User can now customize the page with drag-and-drop editor
```

---

## Navigation Structure

### Route Map

```
/                                    Home (onboarding dashboard)

/contacts                            Contacts list
├─ /contacts/new                     Create contact form
└─ /contacts/:contactId              Contact detail (CRM-style)

/tasks                               Tasks list
├─ /tasks/new                        Create task form
└─ /tasks/:taskId                    Task detail

/pages                               Pages list (page builder)
├─ /pages/new                        Create page (template selector)
└─ /pages/:pageId                    Page detail/editor
   ├─ /pages/:pageId/edit            Edit mode (drag-and-drop)
   └─ /pages/:pageId/preview         Preview mode

/showcase                            Showcase gallery (8 examples)
├─ /showcase/crm                     CRM examples (1)
├─ /showcase/marketing               Marketing examples (2)
├─ /showcase/hr                      HR/Admissions examples (1)
├─ /showcase/analytics               Analytics examples (1)
├─ /showcase/cms                     CMS/Docs examples (2)
├─ /showcase/design                  Design examples (1)
└─ /showcase/:exampleId              Example detail (read-only)

/apps                                Apps hub
├─ /apps/pages                       Pages app (redirects to /pages)
├─ /apps/messages                    Messages (Coming Soon)
├─ /apps/files                       Files (Coming Soon)
├─ /apps/calendar                    Calendar (Coming Soon)
└─ /apps/reports                     Reports (Coming Soon)

/lists                               Lists overview
└─ /lists/:listId                    List detail (hierarchical)

/channels                            Channels overview (Coming Soon)
└─ /channels/:channelId              Channel detail (Coming Soon)

/settings                            Settings
├─ /settings/profile                 User profile (onboarding step 1)
├─ /settings/workspace               Workspace settings
├─ /settings/theme                   Theme customization
└─ /settings/preferences             User preferences

/help                                Help documentation
/search                              Global search results
```

---

## Implementation Priority

### Phase 1: Foundation + Home (Weeks 1-4)

**Goal:** Get the Home page and workspace navigator functional

**Deliverables:**

1. ✅ **Global Bar component**
   - Hamburger menu (toggles navigator)
   - Workspace selector ("Central" dropdown)
   - Add button ([+] quick create - stubbed initially)
   - Global search (functional for contacts, tasks, pages)
   - Notification bell (empty initially)
   - User avatar (shows initials "JD")

2. ✅ **Workspace Navigator component**
   - All sections visible
   - Home, Contacts, Tasks (functional links)
   - Apps section with Pages functional, others stubbed
   - Recently Viewed (functional tracking)
   - Lists with Showcase hierarchy (functional)
   - Channels (stubbed, show "Coming Soon")

3. ✅ **Home page (onboarding focus)**
   - Welcome Card (greeting, date, suggested next step)
   - Journey Card (blue, prominent, "Start Journey" CTA)
   - Insights Card (placeholder with illustration)
   - Quick Links Panel (New contact, New event, New task)
   - Upcoming Tasks Panel (3 onboarding tasks)
   - Responsive design (mobile, tablet, desktop)

4. ✅ **Routing setup**
   - React Router v6 configuration
   - All routes defined (stubbed where not yet implemented)
   - Proper 404 handling
   - Navigation guards (future: authentication)

5. ✅ **Basic styling**
   - Tailwind CSS configuration
   - Theme tokens initial setup
   - Component styling (Global Bar, Navigator, Cards)
   - Responsive breakpoints

**Technologies:**
- React 18.3.1 with JSX (no TypeScript)
- Vite build tool
- React Router v6
- Tailwind CSS
- Zustand for state (navigator open/closed, etc.)

**Data:**
- Hardcoded sample data initially
- No database connection yet

**Success Criteria:**
- ✅ User can load app and see Home page
- ✅ User can open/close Workspace Navigator
- ✅ User can navigate to stubbed routes (show "Coming Soon")
- ✅ User can click onboarding tasks (navigate to destinations)
- ✅ Responsive design works on mobile/tablet/desktop
- ✅ Zero console errors on page load

**Timeline:** 4 weeks

---

### Phase 2: Contacts + Tasks (Weeks 5-7)

**Goal:** Implement functional Contacts and Tasks apps

**Deliverables:**

1. ✅ **Contacts app**
   - List view (grid or table, sortable, filterable)
   - Detail view (based on CRM example: 3-column layout)
   - Create form (`/contacts/new`)
   - Edit form (inline editing in detail view)
   - Pre-seeded with 10 sample contacts

2. ✅ **Tasks app**
   - List view (kanban board or table, filterable by status/priority)
   - Detail view (full task information)
   - Create form (`/tasks/new`)
   - Edit form (inline editing)
   - Pre-seeded with 15 sample tasks

3. ✅ **Recently Viewed tracking**
   - Track page views (contacts, tasks, pages)
   - Store in localStorage or database
   - Show last 5 items in Workspace Navigator
   - Click to navigate to detail page

4. ✅ **Quick Links functional**
   - "New contact" opens `/contacts/new`
   - "New task" opens `/tasks/new`
   - "New event" shows "Coming Soon" modal (Calendar not yet implemented)

5. ✅ **Onboarding tasks functional**
   - "Introduce yourself" navigates to `/settings/profile`
   - "Meet your team" navigates to `/settings/workspace/members` (stubbed)
   - "Invite a colleague" opens invite modal (simple email form)

**Technologies:**
- React components for list/detail views
- Zustand for state management (contacts, tasks)
- localStorage for Recently Viewed (upgrade to database in Phase 3)

**Data:**
- Still hardcoded sample data
- CRUD operations update in-memory state

**Success Criteria:**
- ✅ User can create, view, edit contacts
- ✅ User can create, view, edit, delete tasks
- ✅ User can filter/sort contacts and tasks
- ✅ Recently Viewed updates as user navigates
- ✅ Quick Links work as expected
- ✅ Onboarding tasks navigate to correct destinations

**Timeline:** 3 weeks

---

### Phase 3: Pages + Showcase + Database (Weeks 8-11)

**Goal:** Implement page builder, showcase, and database layer

**Deliverables:**

1. ✅ **Database setup**
   - PostgreSQL with JSONB support
   - Schema: workspaces, users, contacts, tasks, pages
   - Seed script with all sample data

2. ✅ **API layer**
   - Express.js REST API
   - Endpoints: GET/POST/PUT/DELETE for contacts, tasks, pages
   - Authentication (simple token-based, future: OAuth)

3. ✅ **Pages app (core feature)**
   - List view (all user pages + examples)
   - Detail/Editor view (page renderer, read-only initially)
   - Create new page (template selector modal)
   - Pre-seeded with 8 example pages (read-only, `isExample: true`)

4. ✅ **Showcase organization**
   - `/showcase` gallery view (8 example cards)
   - `/showcase/:exampleId` detail view (read-only)
   - "Duplicate" button creates editable copy
   - Lists > Showcase hierarchy (folder structure)

5. ✅ **Element rendering system**
   - Render pages from JSON configuration
   - Support for 4 element types: field, record, markup, structure
   - Theme token resolution
   - Zod validation for JSON schemas
   - PropTypes for component validation

6. ✅ **Migration from hardcoded to database**
   - Update Contacts app to use API
   - Update Tasks app to use API
   - Update Pages app to use API
   - Update Recently Viewed to use database

**Technologies:**
- PostgreSQL (JSONB for page configs)
- Express.js API
- Zod for JSON validation
- React Query or SWR for data fetching

**Data:**
- All data now persisted in database
- Seed script runs on first launch

**Success Criteria:**
- ✅ Database seeded with sample data
- ✅ All apps (Contacts, Tasks, Pages) read from database
- ✅ User can view all 8 example pages in Showcase
- ✅ User can duplicate examples to create editable pages
- ✅ Pages render correctly from JSON configuration
- ✅ Theme tokens resolve correctly
- ✅ CRUD operations persist to database

**Timeline:** 4 weeks

---

### Phase 4: Drag-and-Drop Editor (Weeks 12-16)

**Goal:** Full page editing with drag-and-drop

**Deliverables:**

1. ✅ **Page editor with drag-and-drop**
   - Drag elements from picker panel to canvas
   - Reorder elements within page
   - Delete elements
   - Undo/redo functionality

2. ✅ **Element picker panel** (left sidebar in edit mode)
   - Tabs: Field, Record, Markup, Structure
   - Search/filter elements
   - Drag element type to canvas to add

3. ✅ **Settings panel** (right sidebar in edit mode)
   - Element settings form (based on selected element)
   - 5 setting groups: Layout, Appearance, Data, Typography, Business Rules
   - Visual editors: color picker, spacing controls, dropdown selectors
   - JSON view toggle (for advanced users)

4. ✅ **Canvas rendering modes**
   - Preview mode (read-only, as users will see it)
   - Edit mode (drag-and-drop, element selection, settings panel)
   - Split mode (preview + settings side-by-side)

5. ✅ **Save/publish functionality**
   - Auto-save drafts (every 30 seconds)
   - Manual save button
   - Publish workflow (draft → published)
   - Version history (future)

**Technologies:**
- @dnd-kit for drag-and-drop
- react-grid-layout for dashboard widgets (optional)
- Zustand for editor state (selected element, mode, etc.)
- Debounced auto-save

**Success Criteria:**
- ✅ User can drag elements from picker to canvas
- ✅ User can select element and edit settings in settings panel
- ✅ User can reorder and delete elements
- ✅ User can switch between preview and edit modes
- ✅ User can save and publish pages
- ✅ Auto-save works reliably (no data loss)

**Timeline:** 5 weeks

---

## Mobile Responsiveness

### Home Page on Mobile

```
┌───────────────────────────┐
│ Global Bar (compact)      │
│ ☰ Central  [Search] [JD]  │
├───────────────────────────┤
│                           │
│ ┌───────────────────────┐ │
│ │ Welcome Card          │ │
│ │                       │ │
│ │ ☀️ Good Morning,      │ │
│ │    Wednesday, July 8  │ │
│ │                       │ │
│ │ [Introduce yourself]  │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ Journey Card (Blue)   │ │
│ │                       │ │
│ │ Your first journey    │ │
│ │ with Central          │ │
│ │                       │ │
│ │ [Start Journey]       │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ Quick Links           │ │
│ │                       │ │
│ │ 📇 New contact        │ │
│ │ 📅 New event          │ │
│ │ ✅ New task           │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ Upcoming Tasks        │ │
│ │                       │ │
│ │ ○ Introduce yourself  │ │
│ │   • 2 min             │ │
│ │ ○ Meet your team      │ │
│ │   • 2 min             │ │
│ │ ○ Invite a colleague  │ │
│ │   • 1 min             │ │
│ └───────────────────────┘ │
│                           │
│ ┌───────────────────────┐ │
│ │ Insights              │ │
│ │                       │ │
│ │ 📊 [Chart]            │ │
│ │                       │ │
│ │ As you start using... │ │
│ └───────────────────────┘ │
│                           │
└───────────────────────────┘
```

**Responsive Changes:**
- **Layout:** Single column, all cards stacked vertically
- **Global Bar:** Compact (hamburger, logo, search icon, avatar)
- **Workspace Navigator:** Full-screen overlay when opened
- **Cards:** Full width, consistent padding
- **Text:** Slightly smaller font sizes
- **Illustrations:** Smaller or hidden on very small screens

**Breakpoints:**
- Mobile: `< 640px` - Single column, full-width cards
- Tablet: `640px - 1024px` - 2-column where appropriate, larger cards
- Desktop: `> 1024px` - Full layout as designed

---

## Key Design Decisions

### 1. Why Onboarding Home (Not Gallery)?

**Previously Considered:** Gallery Home with 8 example cards

**Current Approach:** Onboarding Home with guided journey

**Rationale:**
- ✅ **Better first impression** - Welcoming, not overwhelming
- ✅ **Clear next steps** - Guided journey removes guesswork
- ✅ **Practical learning** - Create real items (contacts, tasks) not just view examples
- ✅ **Progressive disclosure** - Showcase examples available via Lists, but not primary focus
- ✅ **Faster time-to-value** - Users creating useful content on day one

**User Flow:**
- Day 1: Onboarding home → Create contact → Create task → Complete profile
- Day 2-3: Explore showcase → Duplicate example → Start building pages
- Week 1+: Home becomes activity dashboard (future: replace onboarding cards with insights)

---

### 2. Why Workspace Navigator?

**Rationale:**
- ✅ **Scalable structure** - Easy to add apps as platform grows
- ✅ **Enterprise feel** - Familiar to users of Slack, Teams, Notion
- ✅ **Hierarchical organization** - Lists provide folder structure
- ✅ **Context awareness** - Recently Viewed shows cross-app activity
- ✅ **Team collaboration** - Channels prepare for future features

**Alternative Considered:** Simple top bar with Gallery | Pages | Settings
- ❌ Doesn't convey platform breadth
- ❌ No hierarchical organization
- ❌ Doesn't scale as features are added

---

### 3. Why Pre-Populate vs. Empty State?

**Rationale:**
- ✅ **Immediate value** - Users see what's possible
- ✅ **Learning by example** - Sample contacts/tasks show patterns
- ✅ **Reduces anxiety** - Something to explore vs. blank slate
- ✅ **Validates features** - Sample data exercises all functionality
- ✅ **Better screenshots** - Populated app looks better in demos

**Caveat:** Provide clear "Delete All Sample Data" option in settings for users who want fresh start.

---

### 4. Why Stub Complex Features?

**Features Stubbed:**
- Messages app
- Files app
- Calendar app (partially - "New event" in Quick Links)
- Reports app
- Channels

**Rationale:**
- ✅ **Faster MVP** - Delivers core features in 16 weeks vs 32+ weeks
- ✅ **Communicates vision** - Navigation shows future capabilities
- ✅ **Reduces scope risk** - Focus on page builder (core differentiator)
- ✅ **Iterative delivery** - Can add apps based on user feedback

**User Experience:**
- Stubbed items show "Coming Soon" page with:
  - Feature description
  - Mockup or illustration
  - "Notify me when available" form
  - Expected release timeline

---

## Performance Targets

### Initial Load (Home Page)

| Metric | Target | Notes |
|--------|--------|-------|
| **TTFB** | < 200ms | Server response time |
| **FCP** | < 1.0s | User sees content |
| **LCP** | < 2.0s | Main content visible (Journey Card) |
| **TTI** | < 3.0s | Page is interactive |
| **CLS** | < 0.1 | Minimal layout shift |

### Optimization Strategies

1. **Lazy load illustrations** - Only load visible card images
2. **Code splitting** - Separate bundle per route
3. **Skeleton screens** - Show loading placeholders
4. **Database indexing** - Index frequently queried fields
5. **API caching** - Cache sample data (rarely changes)

---

## Success Metrics

### Onboarding Completion

**Key Metrics:**
- % of users who click "Start Journey"
- % of users who complete all 3 onboarding tasks
- Time to complete onboarding (target: < 5 minutes)
- % of users who create at least 1 contact
- % of users who create at least 1 task

**Target:** 70% of users complete onboarding within first session

---

### Feature Adoption

**Key Metrics:**
- % of users who view Showcase examples
- % of users who duplicate an example
- % of users who create a custom page
- Average time spent in page editor
- % of users who publish a page

**Target:** 50% of users explore Showcase, 30% duplicate an example

---

## Summary

### Initial User Experience: Central

**Route:** `/`

**Page:** Onboarding-focused Home with guided journey

**Content:**
1. Welcome Card (personalized greeting, suggested next step)
2. Journey Card (blue, prominent, "Start Journey" CTA)
3. Insights Card (placeholder for future analytics)
4. Quick Links Panel (New contact, New event, New task)
5. Upcoming Tasks Panel (3 onboarding tasks with time estimates)

**Navigation:** Workspace Navigator (left sidebar)
- Home, Contacts, Tasks (core apps)
- Apps: Pages, Messages, Files, Calendar, Reports (Pages functional, others stubbed)
- Recently Viewed (last 5 items)
- Lists: Showcase with 8 examples organized by type
- Channels: #Staff, #Events, #Finance (stubbed)

**Sample Data:**
- 10 contacts (diverse industries and roles)
- 15 tasks (To Do, In Progress, Done)
- 8 example pages (comprehensive coverage of use cases)
- Pre-seeded Lists hierarchy (Showcase by type)

**Implementation Timeline:**
- Phase 1: Foundation + Home (4 weeks)
- Phase 2: Contacts + Tasks (3 weeks)
- Phase 3: Pages + Showcase + Database (4 weeks)
- Phase 4: Drag-and-Drop Editor (5 weeks)
- **Total:** 16 weeks to fully functional page builder with workspace context

**Key Decisions:**
- ✅ Onboarding Home (not Gallery)
- ✅ Workspace Navigator structure (not simple top bar)
- ✅ Pre-populated sample data (not empty state)
- ✅ Stubbed complex features (Messages, Files, Calendar, Channels)
- ✅ Progressive disclosure (Showcase available but not primary focus)

---

**Document Version:** 2.0
**Last Updated:** 2025-11-21
**Changes:** Updated to reflect Hybrid Workspace Navigator approach with onboarding-focused Home page (previously Gallery Home)
