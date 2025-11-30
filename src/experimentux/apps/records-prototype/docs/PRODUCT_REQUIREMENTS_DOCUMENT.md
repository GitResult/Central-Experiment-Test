# Product Requirements Document: Records Prototype

**Date:** 2025-11-21
**Version:** 1.0
**Branch:** `claude/prototype-drag-drop-015wNpJGKT2xLTeY9SkKwSgD`
**Status:** Current State Analysis

---

## Executive Summary

The Records Prototype is a drag-and-drop page builder demonstrating domain-based architecture for an enterprise platform. It serves as a foundation for building ERP, CRM, HR, Accounting, CMS, AMS, and LMS systems.

**Current State:** Functional prototype with 25,901-line monolithic architecture
**Target:** Enterprise platform serving sole proprietorships → Fortune 100
**Design Philosophy:** Apple-inspired minimalism with comprehensive functionality

---

## Product Vision

### Core Mission
Provide a comprehensive enterprise platform that:
- Addresses diverse business needs across all major verticals
- Uses innovation practically for competitive advantage
- Delivers delightful UX for novice and power users

### Strategic Context
The domain-based architecture (data/ui domains) will power:
1. **Customer-Facing Applications** - CMS, portals, websites
2. **Platform's Own UI** - Workspaces, Global Bar, Studio Icons, Flex Panels

---

## Current Features & Capabilities

### 1. Universal Page System ✅ Production-Ready
**Zone-based architecture** with Row → Column → Element hierarchy:
- **5 Layout Presets**: Single Column, Two Column, Three Column, Sidebar Left, Sidebar Right
- **Flexible Nesting**: Supports complex layouts with nested structures
- **Responsive Design**: Mobile-first with Tailwind CSS
- **Migration Utility**: Converts legacy pages to Universal Page format

### 2. Element System (15 Components)
**Content Elements:**
- TextElement - Body copy and descriptions
- TitleElement - Page titles
- HeadingElement - Section headings (h1-h6)
- DescriptionElement - Subtitles and summaries

**Media Elements:**
- ImageElement - Standard images
- CoverImageElement - Hero/banner images with overlays
- PageIconElement - Icons and avatars

**Interactive Elements:**
- ButtonElement - CTAs with variants (primary, secondary, outline)
- FormFieldElement - Input fields with validation

**Navigation Elements:**
- BreadcrumbElement - Hierarchical navigation
- MetadataBarElement - Record metadata display

**Data Elements:**
- DataGridElement - Tabular data with sorting/filtering
- ContentCardElement - Card-based layouts

**Layout Elements:**
- GridLayoutElement - CSS Grid-based layouts
- CanvasLayoutElement - Absolute positioning for creative layouts

### 3. View Modes
**List View:**
- Grid/table display of records
- Sorting, filtering, search
- Bulk actions

**Detail View:**
- Full record display
- Related data panels
- Action buttons

**Canvas View:**
- Free-form layout editing
- Drag-and-drop positioning
- Visual design tools

**Custom Pages:**
- Universal Page System integration
- 4 template presets
- Drag-and-drop page builder

### 4. Navigation Panels
**Explorer** - Browse records and collections
**Finder** - Advanced search and filters
**Insights** - Analytics and visualizations
**Timeline** - Activity history and audit log

### 5. Template System
Four production-ready templates:
1. **Executive Contact** - Leadership directory
2. **Conference Event** - Event management
3. **Enterprise Dashboard** - Business intelligence
4. **Editorial Article** - Content publishing

---

## Architecture Overview

### Domain-Based Element Types
```
Data Domain (Persisted)          UI Domain (Ephemeral)
├─ field                         ├─ markup
│  └─ Atomic inputs              │  └─ Content elements
└─ record                        └─ structure
   └─ Complex entities              └─ Layout containers
```

**Current Implementation:**
- **Category-based system** with 16 element types
- Works well but not aligned with proposed 4-type domain system
- Element registry with lazy loading for performance

### Technology Stack
- **Frontend:** React 18.3.1, Vite, Tailwind CSS
- **Drag & Drop:** @dnd-kit
- **Layout:** react-grid-layout
- **Charts:** recharts
- **State:** ~200+ useState declarations (no centralized store)
- **Routing:** None (state-based view switching)

---

## User Personas

### Persona 1: Small Business Owner
- **Size:** 1-10 employees
- **Needs:** Simple CRM, invoicing, website
- **Tech Skill:** Novice
- **Priority:** Ease of use, affordability

### Persona 2: Mid-Market Manager
- **Size:** 50-500 employees
- **Needs:** ERP, HR, advanced CRM
- **Tech Skill:** Intermediate
- **Priority:** Integration, automation

### Persona 3: Enterprise Administrator
- **Size:** 1,000+ employees
- **Needs:** Full platform (ERP, CRM, HR, Accounting, etc.)
- **Tech Skill:** Power user
- **Priority:** Customization, security, compliance

### Persona 4: Platform Developer
- **Role:** Internal team building platform UI
- **Needs:** Reusable components, domain architecture
- **Tech Skill:** Expert
- **Priority:** Maintainability, performance, extensibility

---

## Technical Requirements

### Functional Requirements

**FR1: Drag-and-Drop Page Builder**
- Visual element placement
- Real-time preview
- Undo/redo support
- Copy/paste elements

**FR2: Domain-Based Elements**
- Field elements (data entry)
- Record elements (data display)
- Markup elements (content)
- Structure elements (layout)

**FR3: Data Binding**
- Static content (no binding)
- Read-only display (bound-read)
- Form input capture (bound-write)
- Live editing (bound-bidirectional)

**FR4: Theme System**
- Design tokens (colors, spacing, typography)
- Dark mode support
- Custom branding
- Responsive breakpoints

**FR5: Multi-View Experience**
- List view with filtering/sorting
- Detail view with related data
- Canvas view for creative layouts
- Custom pages with templates

### Non-Functional Requirements

**NFR1: Performance**
- Page load < 2 seconds
- Drag-and-drop < 16ms latency
- Lazy loading for 100+ elements

**NFR2: Scalability**
- Support 10,000+ records per collection
- 100+ concurrent users
- 50+ custom pages per workspace

**NFR3: Accessibility**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support

**NFR4: Security**
- Role-based access control
- Data encryption at rest and in transit
- Audit logging

---

## Current Limitations & Gaps

### Critical Issues

**1. Monolithic Architecture** 🔴
- **Problem:** 25,901-line App.jsx with ~200 useState declarations
- **Impact:** Difficult to maintain, test, and scale
- **Risk:** High technical debt

**2. No Routing** 🔴
- **Problem:** State-based view switching instead of URL-based navigation
- **Impact:** No deep linking, bookmarking, or browser history
- **Risk:** Poor UX for power users

**3. No State Management** 🔴
- **Problem:** Scattered state across 200+ useState declarations
- **Impact:** Prop drilling, inconsistent updates, hard to debug
- **Risk:** Bugs and performance issues at scale

**4. No Test Coverage** 🔴
- **Problem:** Zero unit, integration, or E2E tests
- **Impact:** Breaking changes go undetected
- **Risk:** Production bugs

### High Priority Gaps

**5. Theme Token System** 🟠
- **Problem:** Hard-coded Tailwind classes instead of design tokens
- **Impact:** No dark mode, custom branding, or theme inheritance
- **Blocker:** Prevents enterprise customization

**6. HTML Import** 🟠
- **Problem:** Documented approach but not implemented
- **Impact:** Users can't migrate existing websites
- **Opportunity:** Competitive advantage vs. competitors

**7. Localization** 🟠
- **Problem:** i18n system documented but not built
- **Impact:** English-only limits international expansion
- **Defer:** Phase 2+ unless urgent demand

### Medium Priority Gaps

**8. Architecture Misalignment** 🟡
- **Problem:** Current uses 16 category types, docs propose 4 domain types
- **Impact:** Code doesn't match architectural vision
- **Note:** Not critical; can evolve gradually

**9. Form Builder UI** 🟡
- **Problem:** FormFieldElement exists but no dedicated form builder
- **Impact:** Can't visually design multi-field forms
- **Defer:** After core architecture stabilizes

**10. Advanced Data Features** 🟡
- **Problem:** No computed fields, formulas, or business rules
- **Impact:** Limited data modeling capabilities
- **Defer:** Phase 2+ after MVP validation

---

## Success Metrics

### Adoption Metrics
- **User Onboarding:** 80% complete first page within 30 minutes
- **Feature Usage:** 60% use drag-and-drop builder vs. templates
- **Template Adoption:** 40% start from template, customize 70%+

### Performance Metrics
- **Page Load:** < 2 seconds (median)
- **Drag Latency:** < 16ms (60 FPS)
- **Time to Interactive:** < 3 seconds

### Quality Metrics
- **Bug Rate:** < 5 bugs per 1,000 user sessions
- **Test Coverage:** > 80% code coverage
- **Accessibility:** WCAG 2.1 AA compliance (100%)

### Business Metrics
- **Conversion Rate:** 25% of trials → paid subscriptions
- **Retention:** 80% monthly active users (MAU)
- **NPS Score:** > 50 (enterprise SaaS benchmark)

---

## Dependencies & Constraints

### Technical Dependencies
- React 18+ ecosystem
- Modern browser support (Chrome, Firefox, Safari, Edge)
- Backend API for data persistence (not in scope for prototype)

### Constraints
- **Timeline:** Prototype phase, not production-ready
- **Resources:** Limited team size
- **Scope:** Focus on core page builder, defer advanced features

### Assumptions
- Users have basic familiarity with drag-and-drop interfaces
- Modern browser usage (ES6+ support)
- Cloud-hosted deployment (not on-premise initially)

---

## Roadmap Alignment

This PRD aligns with the **12-Week Implementation Roadmap** documented in `EXECUTIVE_SUMMARY.md`:

**Phase 1 (Weeks 1-3):** HTML Import MVP
**Phase 2 (Weeks 4-6):** Theme Token System & Pattern Detection
**Phase 3 (Weeks 7-9):** Architecture Migration & Polish
**Phase 4 (Weeks 10-12):** Real-world Testing & Iteration

---

## Open Questions

1. **Architecture Strategy:** Refactor existing app or create new `central-domain-prototype`?
2. **Migration Path:** How to migrate existing 25,901-line App.jsx to modular architecture?
3. **State Management:** Zustand, Redux Toolkit, or Jotai?
4. **Routing:** React Router v6 or TanStack Router?
5. **Testing:** Jest + RTL, Vitest + Testing Library, or Playwright E2E first?
6. **Platform UI:** How to apply domain architecture to Global Bar, Studio Icons, Panels?

---

## Related Documents

- [Executive Summary](./EXECUTIVE_SUMMARY.md)
- [Architecture Evaluation](./ARCHITECTURE_EVALUATION_AND_RECOMMENDATIONS.md)
- [Element Settings Architecture](./ELEMENT_SETTINGS_ARCHITECTURE.md)
- [Generic Element Types](./GENERIC_ELEMENT_TYPES.md)
- [HTML Conversion Strategy](./HTML_TO_DOMAIN_SCHEMA_CONVERSION.md)

---

**Document Owner:** CTO Evaluator
**Last Updated:** 2025-11-21
**Next Review:** After revamp strategy decision
