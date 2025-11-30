# Implementation Prompt: Central Domain Prototype

**Date:** 2025-11-21
**Version:** 1.0
**Purpose:** Comprehensive prompt for implementing the central-domain-prototype app
**Status:** Ready for Implementation

---

## Overview

You are tasked with building **Central**, an enterprise workspace platform that demonstrates domain-based architecture for flexible, data-driven applications. Central combines CRM, task management, content management, and a sophisticated page builder in a unified interface.

---

## Documentation Reference

All architectural decisions, technical specifications, and design details are documented in the following files (read these first):

### Core Architecture
1. **`GENERIC_ELEMENT_TYPES.md`** - Domain-based element architecture (4 types: field, record, markup, structure)
2. **`ELEMENT_SETTINGS_ARCHITECTURE.md`** - Settings system, theme tokens, and localization
3. **`JSX_JSON_APPROACH_EVALUATION.md`** - JSX+JSON approach (no TypeScript), runtime validation

### Product & Strategy
4. **`PRODUCT_REQUIREMENTS_DOCUMENT.md`** - Product vision, features, and user personas
5. **`REVAMP_STRATEGY_EVALUATION.md`** - Option B (new app) decision and implementation path
6. **`COMPREHENSIVE_EXAMPLES_EVALUATION.md`** - 8 comprehensive example pages with complete JSON

### User Experience
7. **`WORKSPACE_NAVIGATOR_APPROACH_EVALUATION.md`** - Hybrid workspace navigator approach
8. **`INITIAL_USER_EXPERIENCE.md`** - Home page design, onboarding flow, navigation structure
9. **`CENTRAL_DOMAIN_PROTOTYPE_USER_GUIDE.md`** - Complete user guide with all features documented

### Visual Reference
10. **`/html-prototypes/sample-central-home-page-new-user.png`** - Home page design screenshot

---

## Project Structure

Create a new app at `/apps/central-domain-prototype` with the following structure:

```
/apps/central-domain-prototype/
├─ src/
│  ├─ components/
│  │  ├─ chrome/                    # Application chrome components
│  │  │  ├─ GlobalBar.jsx           # Top navigation bar
│  │  │  ├─ WorkspaceNavigator.jsx  # Left sidebar navigation
│  │  │  ├─ NotificationBell.jsx    # Notifications
│  │  │  └─ UserAvatar.jsx          # User profile avatar
│  │  │
│  │  ├─ elements/                  # Page builder elements
│  │  │  ├─ field/                  # Data domain: field elements
│  │  │  │  ├─ TextField.jsx
│  │  │  │  ├─ EmailField.jsx
│  │  │  │  ├─ SelectField.jsx
│  │  │  │  └─ ...
│  │  │  ├─ record/                 # Data domain: record elements
│  │  │  │  ├─ ImageRecord.jsx
│  │  │  │  ├─ PersonRecord.jsx
│  │  │  │  ├─ ChartRecord.jsx
│  │  │  │  └─ ...
│  │  │  ├─ markup/                 # UI domain: markup elements
│  │  │  │  ├─ TitleMarkup.jsx
│  │  │  │  ├─ HeadingMarkup.jsx
│  │  │  │  ├─ ButtonMarkup.jsx
│  │  │  │  └─ ...
│  │  │  └─ structure/              # UI domain: structure elements
│  │  │     ├─ CardStructure.jsx
│  │  │     ├─ GridStructure.jsx
│  │  │     ├─ TabsStructure.jsx
│  │  │     └─ ...
│  │  │
│  │  ├─ pages/                     # Route pages
│  │  │  ├─ Home.jsx                # Onboarding home page
│  │  │  ├─ Contacts.jsx            # Contacts list/detail
│  │  │  ├─ Tasks.jsx               # Tasks kanban/table
│  │  │  ├─ Pages.jsx               # Page builder
│  │  │  └─ Showcase.jsx            # Example gallery
│  │  │
│  │  ├─ home/                      # Home page components
│  │  │  ├─ WelcomeCard.jsx
│  │  │  ├─ JourneyCard.jsx
│  │  │  ├─ InsightsCard.jsx
│  │  │  ├─ QuickLinksPanel.jsx
│  │  │  └─ UpcomingTasksPanel.jsx
│  │  │
│  │  ├─ editor/                    # Page editor components
│  │  │  ├─ PageEditor.jsx          # Main editor
│  │  │  ├─ ElementPicker.jsx       # Left panel: drag elements
│  │  │  ├─ SettingsPanel.jsx       # Right panel: element settings
│  │  │  └─ Canvas.jsx              # Center: page canvas
│  │  │
│  │  └─ common/                    # Shared components
│  │     ├─ Card.jsx
│  │     ├─ Button.jsx
│  │     ├─ Modal.jsx
│  │     └─ ...
│  │
│  ├─ schemas/                      # JSON schemas for validation
│  │  ├─ fieldElement.js            # Zod schema for field elements
│  │  ├─ recordElement.js           # Zod schema for record elements
│  │  ├─ markupElement.js           # Zod schema for markup elements
│  │  ├─ structureElement.js        # Zod schema for structure elements
│  │  └─ page.js                    # Zod schema for complete page
│  │
│  ├─ config/                       # Configuration files
│  │  ├─ theme.js                   # Theme token definitions
│  │  ├─ elements.js                # Element type registry
│  │  └─ routes.js                  # Route definitions
│  │
│  ├─ utils/                        # Utility functions
│  │  ├─ themeResolver.js           # Resolve theme tokens
│  │  ├─ dataBinding.js             # Data binding utilities
│  │  └─ validation.js              # Validation helpers
│  │
│  ├─ store/                        # Zustand state stores
│  │  ├─ navigationStore.js         # Navigator open/closed state
│  │  ├─ editorStore.js             # Editor state (selected element, mode)
│  │  └─ dataStore.js               # App data (contacts, tasks, pages)
│  │
│  ├─ data/                         # Sample data
│  │  ├─ contacts.json              # 10 sample contacts
│  │  ├─ tasks.json                 # 15 sample tasks
│  │  └─ examples/                  # 8 example pages
│  │     ├─ crm-contact.json
│  │     ├─ annual-conference.json
│  │     ├─ application-submission.json
│  │     ├─ dashboard.json
│  │     ├─ notion-page.json
│  │     ├─ figma-canvas.json
│  │     ├─ magazine-article.json
│  │     └─ renewal-email.json
│  │
│  ├─ App.jsx                       # Root app component
│  ├─ main.jsx                      # Entry point
│  └─ index.css                     # Global styles (Tailwind)
│
├─ public/
│  └─ screenshots/                  # Example page screenshots
│     ├─ crm-contact.png
│     ├─ annual-conference.png
│     └─ ...
│
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
└─ README.md
```

---

## Technology Stack

### Frontend Framework
- **React 18.3.1** with JSX (pure JavaScript, NO TypeScript)
- **Vite** for build tooling and dev server
- **React Router v6** for routing

### Styling
- **Tailwind CSS** for utility-first styling
- **Theme tokens** defined in `/src/config/theme.js`
- All components (chrome AND elements) must use theme tokens for consistency

### State Management
- **Zustand** for global state (lightweight alternative to Redux)
- Separate stores for navigation, editor, and data

### Validation
- **Zod** for runtime JSON schema validation
- **PropTypes** for React component prop validation

### Drag & Drop (Phase 4)
- **@dnd-kit** for drag-and-drop functionality
- **react-grid-layout** for dashboard widgets (optional)

### Data Visualization (Phase 3+)
- **Recharts** for charts and graphs

### Development
- **Vitest + React Testing Library** for unit tests
- **Playwright** for E2E tests (future)
- **ESLint** for code quality (no TypeScript rules)

---

## Key Architectural Principles

### 1. Theme Token System

**CRITICAL:** All styling (application chrome AND page elements) must use theme tokens for consistency.

**Theme Token Categories:**
```javascript
// /src/config/theme.js
export const theme = {
  colors: {
    primary: '#3B82F6',           // blue-500
    secondary: '#6B7280',         // gray-500
    accent: '#10B981',            // green-500
    background: '#FFFFFF',
    surface: '#F9FAFB',           // gray-50
    text: {
      primary: '#111827',         // gray-900
      secondary: '#6B7280',       // gray-500
      tertiary: '#9CA3AF',        // gray-400
      inverse: '#FFFFFF'
    },
    border: {
      default: '#E5E7EB',         // gray-200
      strong: '#D1D5DB',          // gray-300
      subtle: '#F3F4F6'           // gray-100
    },
    status: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    }
  },
  typography: {
    fontFamily: {
      sans: 'system-ui, -apple-system, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Menlo, Monaco, monospace'
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem',// 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem'     // 48px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '2.5rem',  // 40px
    '3xl': '3rem',    // 48px
    '4xl': '4rem',    // 64px
    '5xl': '5rem'     // 80px
  },
  borderRadius: {
    sm: '0.25rem',    // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
  }
};
```

**Usage in Application Chrome:**
```jsx
// GlobalBar.jsx
import { theme } from '@/config/theme';

export function GlobalBar() {
  return (
    <div
      className="h-14 border-b"
      style={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border.default
      }}
    >
      {/* ... */}
    </div>
  );
}
```

**Usage in Page Elements:**
```javascript
// Element JSON with theme tokens
{
  type: 'markup',
  data: { content: 'Welcome to Central' },
  settings: {
    typography: {
      fontSize: '{{theme.typography.fontSize.3xl}}',
      fontWeight: '{{theme.typography.fontWeight.bold}}'
    },
    appearance: {
      color: '{{theme.colors.text.primary}}'
    }
  }
}
```

**Theme Token Resolver:**
```javascript
// /src/utils/themeResolver.js
import { theme } from '@/config/theme';

export function resolveThemeToken(value) {
  if (!value || typeof value !== 'string') return value;

  const tokenRegex = /\{\{theme\.([^}]+)\}\}/g;

  return value.replace(tokenRegex, (match, path) => {
    const keys = path.split('.');
    let result = theme;

    for (const key of keys) {
      result = result?.[key];
      if (result === undefined) {
        console.warn(`Theme token not found: ${path}`);
        return match;
      }
    }

    return result;
  });
}
```

---

### 2. Domain-Based Element System

**Two Domains:**
- **data** (persisted to database) - field, record
- **ui** (ephemeral, not persisted) - markup, structure

**Four Element Types:**
```
data domain:
  - field    → Atomic data inputs (text, email, select, etc.)
  - record   → Complex data structures (images, charts, timelines, etc.)

ui domain:
  - markup   → Content presentation (titles, buttons, icons, etc.)
  - structure → Layout containers (cards, grids, tabs, etc.)
```

**Element Component Pattern:**
```jsx
// /src/components/elements/field/TextField.jsx
import PropTypes from 'prop-types';
import { resolveThemeToken } from '@/utils/themeResolver';

export function TextField({ data, settings, onChange }) {
  const { label, placeholder, required } = settings.field;
  const { fontSize, fontWeight } = settings.typography || {};
  const { color, background } = settings.appearance || {};

  return (
    <div className="field-element">
      {label && <label>{label}</label>}
      <input
        type="text"
        placeholder={placeholder}
        required={required}
        value={data.value || ''}
        onChange={(e) => onChange({ value: e.target.value })}
        style={{
          fontSize: resolveThemeToken(fontSize),
          fontWeight: resolveThemeToken(fontWeight),
          color: resolveThemeToken(color),
          backgroundColor: resolveThemeToken(background)
        }}
      />
    </div>
  );
}

TextField.propTypes = {
  data: PropTypes.shape({
    value: PropTypes.string
  }).isRequired,
  settings: PropTypes.shape({
    field: PropTypes.shape({
      fieldType: PropTypes.oneOf(['text']).isRequired,
      label: PropTypes.string,
      placeholder: PropTypes.string,
      required: PropTypes.bool
    }).isRequired,
    typography: PropTypes.object,
    appearance: PropTypes.object
  }).isRequired,
  onChange: PropTypes.func
};
```

---

### 3. JSON-Driven Configuration

All pages are stored as JSON configurations:

```javascript
// Example page structure
{
  "id": "page-home",
  "type": "page",
  "meta": {
    "title": "Home",
    "layout": "two-column"
  },
  "zones": [
    {
      "id": "main-content",
      "rows": [
        {
          "columns": [
            {
              "width": "2/3",
              "elements": [
                {
                  "type": "structure",
                  "settings": {
                    "structure": { "structureType": "card" }
                  },
                  "elements": [
                    {
                      "type": "markup",
                      "data": { "content": "Good Morning" },
                      "settings": {
                        "markup": { "markupType": "heading", "level": 2 }
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

---

### 4. Consistent Component Pattern

**All components (chrome AND elements) follow this pattern:**

1. **Import theme and utilities**
2. **Use theme tokens for styling**
3. **Define PropTypes for validation**
4. **Export named function (not default)**

```jsx
// Example: QuickLinksPanel.jsx
import PropTypes from 'prop-types';
import { theme } from '@/config/theme';

export function QuickLinksPanel({ links }) {
  return (
    <div
      className="p-4 rounded-lg border"
      style={{
        backgroundColor: theme.colors.background,
        borderColor: theme.colors.border.default,
        borderRadius: theme.borderRadius.lg
      }}
    >
      <h3
        style={{
          fontSize: theme.typography.fontSize.lg,
          fontWeight: theme.typography.fontWeight.semibold,
          color: theme.colors.text.primary
        }}
      >
        Quick Links
      </h3>

      <div className="mt-4 space-y-2">
        {links.map((link) => (
          <a
            key={link.id}
            href={link.url}
            className="block p-2 rounded hover:bg-gray-100"
            style={{
              color: theme.colors.text.secondary
            }}
          >
            {link.icon} {link.label}
          </a>
        ))}
      </div>
    </div>
  );
}

QuickLinksPanel.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.string,
      label: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired
    })
  ).isRequired
};
```

---

## Implementation Phases

### Phase 1: Foundation + Home (Weeks 1-4)

**Goal:** Get the Home page and workspace navigator functional

**Tasks:**

1. **Project Setup**
   ```bash
   cd /apps
   npm create vite@latest central-domain-prototype -- --template react
   cd central-domain-prototype
   npm install
   npm install react-router-dom zustand zod prop-types
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

2. **Configure Tailwind**
   ```javascript
   // tailwind.config.js
   export default {
     content: ['./index.html', './src/**/*.{js,jsx}'],
     theme: {
       extend: {},
     },
     plugins: [],
   };
   ```

3. **Create Theme Configuration**
   - `/src/config/theme.js` with complete theme tokens
   - `/src/utils/themeResolver.js` with resolver function

4. **Build Application Chrome**
   - `GlobalBar.jsx` (hamburger, workspace selector, search, notifications, avatar)
   - `WorkspaceNavigator.jsx` (5 sections: Core, Apps, Recently Viewed, Lists, Channels)
   - Navigation state management with Zustand

5. **Build Home Page Components**
   - `WelcomeCard.jsx` (greeting, date, suggested next step)
   - `JourneyCard.jsx` (blue card, "Start Journey" CTA)
   - `InsightsCard.jsx` (placeholder with chart illustration)
   - `QuickLinksPanel.jsx` (New Canvas, New Page, View Showcase)
   - `UpcomingTasksPanel.jsx` (3 onboarding tasks)

6. **Set Up Routing**
   ```javascript
   // /src/App.jsx
   import { BrowserRouter, Routes, Route } from 'react-router-dom';
   import { Home } from './components/pages/Home';

   export function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/" element={<Home />} />
           {/* Other routes stubbed */}
         </Routes>
       </BrowserRouter>
     );
   }
   ```

7. **Create Sample Data**
   - `/src/data/contacts.json` (10 sample contacts)
   - `/src/data/tasks.json` (15 sample tasks)
   - Hardcoded initially (no database yet)

**Deliverables:**
- ✅ User can load app and see Home page
- ✅ User can open/close Workspace Navigator
- ✅ User can navigate to stubbed routes
- ✅ All styling uses theme tokens consistently
- ✅ Responsive design works on mobile/tablet/desktop

---

### Phase 2: Contacts + Tasks (Weeks 5-7)

**Goal:** Implement functional Contacts and Tasks apps

**Tasks:**

1. **Contacts List View**
   - Grid/table display of contacts
   - Sort by name, company, tags
   - Filter by tags
   - Search by name/email

2. **Contacts Detail View**
   - 3-column layout (left nav, center content, right sidebar)
   - Left nav: About section with editable fields
   - Center: Tabs (Overview, Activity, Emails)
   - Right: Quick Actions, Associated Records

3. **Tasks List View**
   - Kanban board view (To Do, In Progress, Done)
   - Table view alternative
   - Filter by status, priority, assignee
   - Sort by due date, priority

4. **Tasks Detail View**
   - Full task information
   - Inline editing
   - Status/priority dropdowns
   - Due date picker

5. **Recently Viewed Tracking**
   - Zustand store for recently viewed items
   - Track views of contacts, tasks, pages
   - Display last 5 in Workspace Navigator
   - Click to navigate to detail

6. **Quick Links Functional**
   - "New Canvas" opens `/pages/new?type=canvas` (stubbed)
   - "New Page" opens `/pages/new?type=page` (stubbed)
   - "View Showcase" opens `/showcase`

**Deliverables:**
- ✅ User can create, view, edit contacts
- ✅ User can create, view, edit, delete tasks
- ✅ User can filter/sort contacts and tasks
- ✅ Recently Viewed updates dynamically

---

### Phase 3: Pages + Showcase + Database (Weeks 8-11)

**Goal:** Implement page builder, showcase, and database layer

**Tasks:**

1. **Extract Example JSON**
   - Extract 8 example page JSONs from `COMPREHENSIVE_EXAMPLES_EVALUATION.md`
   - Save to `/src/data/examples/` directory
   - Validate with Zod schemas

2. **Create Element Schemas**
   - `/src/schemas/fieldElement.js` (Zod schema)
   - `/src/schemas/recordElement.js` (Zod schema)
   - `/src/schemas/markupElement.js` (Zod schema)
   - `/src/schemas/structureElement.js` (Zod schema)
   - `/src/schemas/page.js` (complete page schema)

3. **Build Element Components**
   - Start with markup elements (title, heading, paragraph, button)
   - Then field elements (text, email, select)
   - Then record elements (image, chart, timeline)
   - Finally structure elements (card, grid, tabs)
   - Each with PropTypes and theme token support

4. **Page Renderer**
   - `/src/components/PageRenderer.jsx`
   - Recursively render zones → rows → columns → elements
   - Support for nested structures (max depth 3)
   - Theme token resolution

5. **Showcase Gallery**
   - `/src/components/pages/Showcase.jsx`
   - Grid of 8 example cards with screenshots
   - Filter by type (CRM, Marketing, HR, Analytics, CMS, Design)
   - Click card to view example detail

6. **Example Detail Page**
   - Render example from JSON (read-only)
   - "Back to Showcase" button
   - "Duplicate This Example" button
   - "View JSON" button (shows JSON in modal)

7. **Database Setup** (Optional for Phase 3, can use JSON files)
   - PostgreSQL with JSONB support
   - Schema: workspaces, users, contacts, tasks, pages
   - Seed script with sample data
   - Express.js API with endpoints

**Deliverables:**
- ✅ User can view all 8 examples in Showcase
- ✅ User can view example detail pages (rendered from JSON)
- ✅ User can duplicate examples (creates editable copy)
- ✅ Pages render correctly with all element types
- ✅ Theme tokens resolve correctly in elements

---

### Phase 4: Drag-and-Drop Editor (Weeks 12-16)

**Goal:** Full page editing with drag-and-drop

**Tasks:**

1. **Install @dnd-kit**
   ```bash
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

2. **Element Picker Panel**
   - Left sidebar in edit mode
   - Tabs: Field, Record, Markup, Structure
   - Draggable element type cards
   - Search/filter functionality

3. **Canvas (Droppable Area)**
   - Center area in edit mode
   - Drop zones for elements
   - Visual feedback on drag over
   - Reorder elements via drag-and-drop

4. **Settings Panel**
   - Right sidebar in edit mode
   - Forms for 5 setting groups (Layout, Appearance, Data, Typography, Business Rules)
   - Visual controls (color picker, spacing inputs, dropdown selectors)
   - JSON view toggle

5. **Editor State Management**
   - Zustand store for editor state
   - Selected element
   - Edit mode vs preview mode
   - Undo/redo stack

6. **Save Functionality**
   - Auto-save drafts (debounced, every 30 seconds)
   - Manual save button
   - Validate JSON with Zod before saving
   - Show save status indicator

7. **Mode Switching**
   - Preview mode (read-only rendering)
   - Edit mode (drag-and-drop + settings)
   - Split mode (preview + settings side-by-side)

**Deliverables:**
- ✅ User can drag elements from picker to canvas
- ✅ User can select element and edit settings
- ✅ User can reorder and delete elements
- ✅ User can switch between modes
- ✅ User can save and publish pages
- ✅ Auto-save works reliably

---

## Sample Data Specifications

### Contacts (10 samples)

```json
[
  {
    "id": "contact-1",
    "name": "John Doe",
    "email": "john@acme.com",
    "phone": "(555) 123-4567",
    "company": "Acme Corp",
    "role": "Senior Engineer",
    "tags": ["enterprise", "hot-lead"],
    "createdAt": "2025-11-15"
  },
  {
    "id": "contact-2",
    "name": "Sarah Johnson",
    "email": "sarah@techstart.io",
    "company": "TechStart",
    "role": "Founder & CEO",
    "tags": ["startup", "qualified"],
    "createdAt": "2025-11-16"
  }
  // ... 8 more
]
```

### Tasks (15 samples)

```json
[
  {
    "id": "task-1",
    "title": "Follow up with John Doe",
    "description": "Send proposal and schedule demo",
    "status": "todo",
    "priority": "high",
    "dueDate": "2025-11-22",
    "assignee": "Demo User",
    "tags": ["sales"]
  },
  {
    "id": "task-2",
    "title": "Send proposal to Sarah Johnson",
    "description": "Include pricing and timeline",
    "status": "in-progress",
    "priority": "high",
    "dueDate": "2025-11-23",
    "assignee": "Demo User",
    "tags": ["sales"]
  }
  // ... 13 more
]
```

### Example Pages (8 comprehensive examples)

Extract complete JSON from `COMPREHENSIVE_EXAMPLES_EVALUATION.md`:

1. **crm-contact.json** - HubSpot CRM Contact (from Example 1)
2. **annual-conference.json** - Annual Conference (from Example 2, renamed from "Event Landing Page")
3. **application-submission.json** - Application Submission (from Example 3)
4. **dashboard.json** - Analytics Dashboard (from Example 4)
5. **notion-page.json** - New Page Notion-style (from Example 5)
6. **figma-canvas.json** - New Canvas Figma-style (from Example 6)
7. **magazine-article.json** - Magazine Article (from Example 7)
8. **renewal-email.json** - Renewal Email (from Example 8)

---

## Routing Structure

```javascript
// /src/config/routes.js
export const routes = [
  { path: '/', component: 'Home' },

  // Contacts
  { path: '/contacts', component: 'ContactsList' },
  { path: '/contacts/new', component: 'ContactForm' },
  { path: '/contacts/:id', component: 'ContactDetail' },

  // Tasks
  { path: '/tasks', component: 'TasksList' },
  { path: '/tasks/new', component: 'TaskForm' },
  { path: '/tasks/:id', component: 'TaskDetail' },

  // Pages
  { path: '/pages', component: 'PagesList' },
  { path: '/pages/new', component: 'PageForm' },
  { path: '/pages/:id', component: 'PageDetail' },
  { path: '/pages/:id/edit', component: 'PageEditor' },
  { path: '/pages/:id/preview', component: 'PagePreview' },

  // Showcase
  { path: '/showcase', component: 'ShowcaseGallery' },
  { path: '/showcase/:exampleId', component: 'ShowcaseDetail' },

  // Apps (stubbed)
  { path: '/apps/messages', component: 'ComingSoon' },
  { path: '/apps/files', component: 'ComingSoon' },
  { path: '/apps/calendar', component: 'ComingSoon' },
  { path: '/apps/reports', component: 'ComingSoon' },

  // Lists
  { path: '/lists', component: 'ListsOverview' },
  { path: '/lists/:listId', component: 'ListDetail' },

  // Channels (stubbed)
  { path: '/channels', component: 'ComingSoon' },
  { path: '/channels/:channelId', component: 'ComingSoon' },

  // Settings
  { path: '/settings/profile', component: 'ProfileSettings' },
  { path: '/settings/workspace', component: 'WorkspaceSettings' },
  { path: '/settings/theme', component: 'ThemeSettings' },
  { path: '/settings/preferences', component: 'PreferencesSettings' }
];
```

---

## Critical Implementation Notes

### 1. Theme Consistency

**ALL components must use theme tokens:**
- Application chrome (GlobalBar, Navigator, panels)
- Page elements (field, record, markup, structure)
- Common components (Card, Button, Modal)

**Never hardcode colors, fonts, or spacing:**
```javascript
// ❌ BAD
<div style={{ color: '#111827', fontSize: '16px' }}>

// ✅ GOOD
<div style={{
  color: theme.colors.text.primary,
  fontSize: theme.typography.fontSize.base
}}>
```

### 2. Element Nesting Rules

**Structure elements can nest up to depth 3:**
- Depth 1: All types allowed (structure, field, record, markup)
- Depth 2: structure, record, markup (no fields)
- Depth 3: record, markup only (no fields, no structures)
- Depth 4+: Not allowed

**Validate nesting depth in PageRenderer:**
```javascript
function validateNesting(element, depth = 0) {
  if (depth >= 4) {
    throw new Error('Max nesting depth (3) exceeded');
  }
  if (depth >= 2 && element.type === 'field') {
    throw new Error('Fields cannot be nested deeper than depth 1');
  }
  if (depth >= 3 && element.type === 'structure') {
    throw new Error('Structures cannot be nested deeper than depth 2');
  }
  // Recursively validate children...
}
```

### 3. Data Binding Modes

**Four binding modes:**
- `static` - No binding, static value
- `bound-read` - Read from data source, display only
- `bound-write` - Write to data source (form inputs)
- `bound-bidirectional` - Two-way sync (live updates)

**Implement in data binding utility:**
```javascript
// /src/utils/dataBinding.js
export function resolveBinding(settings, dataContext) {
  const { bindingMode, binding } = settings.data || {};

  if (bindingMode === 'static') {
    return null; // No binding
  }

  if (bindingMode === 'bound-read') {
    // Read from dataContext
    return getNestedValue(dataContext, binding.source, binding.property);
  }

  if (bindingMode === 'bound-write' || bindingMode === 'bound-bidirectional') {
    // Return value and update function
    return {
      value: getNestedValue(dataContext, binding.source, binding.property),
      onChange: (newValue) => setNestedValue(dataContext, binding.source, binding.property, newValue)
    };
  }
}
```

### 4. Responsive Design

**Three breakpoints:**
- Mobile: `< 640px` (single column)
- Tablet: `640px - 1024px` (2 columns)
- Desktop: `> 1024px` (full layout)

**Use Tailwind responsive utilities:**
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### 5. Error Handling

**Validate JSON with Zod before rendering:**
```javascript
import { pageSchema } from '@/schemas/page';

try {
  const validatedPage = pageSchema.parse(pageJSON);
  renderPage(validatedPage);
} catch (error) {
  console.error('Invalid page JSON:', error);
  showErrorPage(error);
}
```

---

## Testing Requirements

### Unit Tests (Vitest)

**Test coverage targets:**
- Theme resolver: 100%
- Data binding utilities: 100%
- Element components: >80%
- Application chrome: >70%

**Example test:**
```javascript
// /src/utils/__tests__/themeResolver.test.js
import { describe, it, expect } from 'vitest';
import { resolveThemeToken } from '../themeResolver';

describe('resolveThemeToken', () => {
  it('resolves color tokens', () => {
    const result = resolveThemeToken('{{theme.colors.primary}}');
    expect(result).toBe('#3B82F6');
  });

  it('returns original value if no token', () => {
    const result = resolveThemeToken('#FF0000');
    expect(result).toBe('#FF0000');
  });

  it('warns on invalid token', () => {
    const consoleSpy = vi.spyOn(console, 'warn');
    resolveThemeToken('{{theme.colors.invalid}}');
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('not found'));
  });
});
```

---

## Success Criteria

### Phase 1 Complete When:
- ✅ Home page loads in < 2 seconds
- ✅ Workspace Navigator opens/closes smoothly
- ✅ All cards render with correct styling (matches screenshot)
- ✅ Theme tokens used consistently (no hardcoded colors)
- ✅ Responsive design works on all breakpoints
- ✅ Zero console errors or warnings

### Phase 2 Complete When:
- ✅ User can CRUD contacts and tasks
- ✅ Filtering and sorting work correctly
- ✅ Recently Viewed updates in real-time
- ✅ All list/detail views match design specs

### Phase 3 Complete When:
- ✅ All 8 examples render correctly from JSON
- ✅ User can view example detail pages
- ✅ User can duplicate examples
- ✅ Theme tokens resolve in all elements
- ✅ Page validation works (Zod schemas)

### Phase 4 Complete When:
- ✅ User can drag elements to canvas
- ✅ User can edit element settings
- ✅ User can reorder/delete elements
- ✅ Auto-save works reliably (no data loss)
- ✅ User can switch between modes seamlessly

---

## Getting Started

1. **Read all documentation** (9 files listed at top)
2. **Set up project** (Phase 1, Task 1)
3. **Create theme configuration** (Phase 1, Task 3)
4. **Build Global Bar** (Phase 1, Task 4)
5. **Build Home page** (Phase 1, Task 5)
6. **Test thoroughly** before moving to next phase

---

## Questions to Answer Before Starting

1. ✅ Have you read all 9 documentation files?
2. ✅ Do you understand the domain-based architecture (data/ui, 4 types)?
3. ✅ Do you understand the theme token system and why it's critical?
4. ✅ Do you understand the difference between application chrome and page elements?
5. ✅ Have you reviewed the home page screenshot reference?
6. ✅ Do you have the 8 example JSONs extracted from COMPREHENSIVE_EXAMPLES_EVALUATION.md?

---

**Ready to Build?** Start with Phase 1, Task 1: Project Setup.

**Questions?** Refer back to the documentation files or ask for clarification.

**Good luck building Central!** 🚀
