# Central - Domain-Based Workspace Platform

**Status:** Phase 1 Complete ✅
**Version:** 1.0.0
**Date:** 2025-11-21

---

## Overview

**Central** is an enterprise workspace platform demonstrating domain-based architecture for building flexible, data-driven applications. It combines CRM, task management, content management, and collaboration tools powered by a sophisticated page builder.

### Key Features

- **Domain-Based Architecture**: 4-element type system (field, record, markup, structure)
- **JSON-Driven Configuration**: All pages stored as JSON with runtime validation
- **Theme Token System**: Consistent design with centralized theme tokens
- **Enterprise-Ready**: Multi-workspace support, hierarchical organization, activity tracking

---

## Quick Start

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
cd apps/central-domain-prototype
npm install
```

### Development

```bash
npm run dev
```

Open http://localhost:5173/ to view the app.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Technology Stack

- **Frontend**: React 18.3.1 (JSX, pure JavaScript - NO TypeScript)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Theme Tokens
- **Routing**: React Router v6
- **State**: Zustand (for future state management)
- **Validation**: Zod (for JSON schema validation)
- **Props**: PropTypes (for component prop validation)

---

## Implementation Status

### ✅ Phase 1: Foundation + Home (COMPLETE)

**Completed Tasks:**

1. ✅ Project setup with Vite + React + dependencies
2. ✅ Tailwind CSS configuration
3. ✅ Theme token system (`src/config/theme.js`)
4. ✅ Theme resolver utility (`src/utils/themeResolver.js`)
5. ✅ Application chrome (GlobalBar, WorkspaceNavigator)
6. ✅ Home page components (WelcomeCard, JourneyCard, InsightsCard, QuickLinksPanel, UpcomingTasksPanel)
7. ✅ React Router setup with stubbed routes
8. ✅ Sample data files (10 contacts, 15 tasks)

**Success Criteria Met:**

- ✅ Home page loads successfully
- ✅ Workspace Navigator opens/closes smoothly
- ✅ All cards render with correct styling
- ✅ Theme tokens used consistently
- ✅ Zero compilation errors

### 🚧 Phase 2: Contacts + Tasks (Next)

### 📋 Phase 3: Pages + Showcase (Future)

### 🎨 Phase 4: Drag-and-Drop Editor (Future)

---

## Architecture Highlights

### Theme Token System

All styling uses theme tokens defined in `src/config/theme.js`. Components reference tokens like:

```javascript
import { theme } from '@/config/theme';

<div style={{
  backgroundColor: theme.colors.background,
  fontSize: theme.typography.fontSize.base
}}>
```

---

## Next Steps

1. **Implement Contacts Feature**
2. **Implement Tasks Feature**
3. **Add State Management (Zustand)**
4. **Build Page Builder Foundation**

---

## Resources

- [Product Requirements](../records-prototype/docs/PRODUCT_REQUIREMENTS_DOCUMENT.md)
- [Architecture Guide](../records-prototype/docs/GENERIC_ELEMENT_TYPES.md)
- [User Guide](../records-prototype/docs/CENTRAL_DOMAIN_PROTOTYPE_USER_GUIDE.md)
- [Home Page Screenshot](../../html-prototypes/sample-central-home-page-new-user.png)

---

**Last Updated:** 2025-11-21
**Branch:** `claude/implement-central-domain-01EKMa7dk5JC6sgUpozcqetJ`
