# Database Page & Record Page Unification - Refactoring Proposal

## Problem Statement

Currently, the application has **two parallel page architectures** that duplicate functionality:

### 1. **Database Pages** (Notion-style)
- **Location**: `App.jsx:20402-20876`
- **Structure**: Cover → Header → Body (hardcoded)
- **Insert UX**: Slash palette (`/` command)
- **Data Model**: `customPages[].settings`
- **Use Case**: Content pages with cover images, icons, flexible blocks

### 2. **Data Record Pages** (3-Zone)
- **Location**: `App.jsx:21362-21377`
- **Structure**: Header → Body → Footer (configurable zones)
- **Insert UX**: Drag-drop from component panel
- **Data Model**: `pageSettings.detail.zones` + `detailPageLayouts`
- **Use Case**: Structured data records with forms, tables, metadata

### Key Issues
- **~2,000 lines of duplicated zone/element rendering logic**
- **Inconsistent UX patterns** (slash vs drag-drop)
- **Separate settings models** prevent feature sharing
- **Cannot use cover images, icons, or slash commands on record pages**
- **Cannot use 3-zone structure or advanced layouts on database pages**

---

## Proposed Solution: Unified Zone System

### Architecture Overview

Replace both architectures with a **single Universal Page Component** with configurable zones:

```javascript
<UniversalPage
  pageId={pageId}
  zones={zoneConfiguration}
  onUpdate={handleUpdate}
/>
```

**Key Insight**: Database Pages and Record Pages aren't different "modes" - they're just different **zone configurations** using the same underlying system.

---

## Detailed Design

### 1. Unified Zone System

**Replace both architectures with a single configurable zone system:**

```javascript
// Universal zone configuration
const ZoneSchema = {
  id: string,                    // 'cover', 'header', 'body', 'footer', 'sidebar', etc.
  type: 'cover' | 'header' | 'body' | 'footer' | 'custom',
  visible: boolean,
  containerWidth: 'narrow' | 'standard' | 'wide' | 'full' | 'notion',
  padding: { x: number, y: number },
  background: string,
  border: boolean,
  rows: RowSchema[]
};

// Universal row/column system (from 3-zone)
const RowSchema = {
  id: string,
  columns: ColumnSchema[]
};

const ColumnSchema = {
  id: string,
  span: number,        // Grid columns (1-12)
  elements: ElementSchema[]
};

// Universal element schema
const ElementSchema = {
  id: string,
  type: string,        // 'text', 'data-grid', 'cover-image', 'title', etc.
  settings: object,    // Type-specific configuration
  data: any           // Element data/content
};
```

### 2. Layout Presets

**Provide common layouts as starting points (like Squarespace/Wix):**

```javascript
// apps/records-prototype/src/layouts/presets.js
export const LAYOUT_PRESETS = {
  'database-page': {
    id: 'database-page',
    name: 'Database Page',
    description: 'Cover image, icon, title, and flexible content blocks',
    icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10',
    zones: [
      {
        id: 'cover',
        type: 'cover',
        visible: false,  // User can enable via settings
        containerWidth: 'full',
        padding: { x: 0, y: 0 },
        rows: []
      },
      {
        id: 'header',
        type: 'header',
        visible: true,
        containerWidth: 'notion',
        padding: { x: 12, y: 6 },
        rows: [
          {
            id: 'icon-row',
            columns: [
              {
                id: 'icon-col',
                span: 12,
                elements: [
                  { id: 'icon', type: 'page-icon', settings: {}, data: { icon: null } }
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
                  { id: 'title', type: 'title', settings: {}, data: { content: 'Untitled' } },
                  { id: 'desc', type: 'description', settings: {}, data: { content: '' } }
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
        rows: []  // Empty - user adds content via slash commands
      }
    ],
    features: {
      insertMethod: 'slash',
      showSlashHint: true,
      allowZoneToggle: true
    }
  },

  'data-record': {
    id: 'data-record',
    name: 'Data Record',
    description: 'Structured layout for data records with header and footer',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    zones: [
      {
        id: 'header',
        type: 'header',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 8, y: 6 },
        rows: [
          {
            id: 'breadcrumb-row',
            columns: [
              {
                id: 'breadcrumb-col',
                span: 8,
                elements: [
                  { id: 'breadcrumb', type: 'breadcrumb', settings: {}, data: {} }
                ]
              },
              {
                id: 'actions-col',
                span: 4,
                elements: [
                  { id: 'actions', type: 'action-buttons', settings: {}, data: { buttons: [] } }
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
                  { id: 'title', type: 'title', settings: { fontSize: '3xl' }, data: { content: 'Record Title' } }
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
        containerWidth: 'full',
        padding: { x: 8, y: 8 },
        rows: []  // User adds form fields, data grids, etc.
      },
      {
        id: 'footer',
        type: 'footer',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 8, y: 6 },
        rows: [
          {
            id: 'metadata-row',
            columns: [
              {
                id: 'metadata-col',
                span: 12,
                elements: [
                  { id: 'metadata', type: 'metadata-bar', settings: {}, data: {} }
                ]
              }
            ]
          }
        ]
      }
    ],
    features: {
      insertMethod: 'both',  // Slash + drag-drop
      showSlashHint: false,
      allowZoneToggle: true
    }
  },

  'blank': {
    id: 'blank',
    name: 'Blank Page',
    description: 'Start from scratch with an empty page',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
    zones: [
      {
        id: 'body',
        type: 'body',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 8, y: 8 },
        rows: []
      }
    ],
    features: {
      insertMethod: 'both',
      showSlashHint: true,
      allowZoneToggle: true
    }
  },

  'full-width': {
    id: 'full-width',
    name: 'Full Width',
    description: 'Edge-to-edge content with no container constraints',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z',
    zones: [
      {
        id: 'body',
        type: 'body',
        visible: true,
        containerWidth: 'full',
        padding: { x: 0, y: 0 },
        rows: []
      }
    ],
    features: {
      insertMethod: 'both',
      showSlashHint: true,
      allowZoneToggle: false
    }
  }
};
```

### 3. Universal Element Registry

**Replace inline JSX and `renderElementContent()` with a type registry:**

```javascript
// apps/records-prototype/src/elements/registry.js
export const ElementRegistry = {
  // Structure Elements
  'cover-image': {
    component: CoverImageElement,
    category: 'structure',
    icon: 'M4 16l4.586-4.586...',
    description: 'Full-width cover image with drag-to-reposition',
    defaultSettings: { verticalPosition: 50 }
  },

  'page-icon': {
    component: PageIconElement,
    category: 'structure',
    icon: 'M14.828 14.828...',
    description: 'Emoji or icon that overlaps cover',
    defaultSettings: { icon: null, size: 'large' }
  },

  'title': {
    component: TitleElement,
    category: 'text',
    icon: 'M4 6h16...',
    description: 'Editable page title',
    defaultSettings: { fontSize: '4xl', fontWeight: 'bold' }
  },

  'description': {
    component: DescriptionElement,
    category: 'text',
    icon: 'M4 6h16M4 12h16M4 18h7',
    description: 'Page description or subtitle',
    defaultSettings: { fontSize: 'sm', color: 'neutral-500' }
  },

  // Content Elements
  'text': {
    component: TextElement,
    category: 'content',
    icon: 'M4 6h16M4 12h16M4 18h7',
    description: 'Plain text block',
    defaultSettings: { content: '' }
  },

  'heading': {
    component: HeadingElement,
    category: 'content',
    icon: 'M4 6h16M4 12h10M4 18h7',
    description: 'Large section heading',
    defaultSettings: { level: 2, content: '' }
  },

  'data-grid': {
    component: DataGridElement,
    category: 'data',
    icon: 'M3 10h18M3 14h18m-9-4v8...',
    description: 'Interactive data table with CSV support',
    defaultSettings: { headers: [], rows: [] }
  },

  // Navigation Elements
  'breadcrumb': {
    component: BreadcrumbElement,
    category: 'navigation',
    icon: 'M9 5l7 7-7 7',
    description: 'Breadcrumb navigation trail',
    defaultSettings: { items: [] }
  },

  'action-buttons': {
    component: ActionButtonsElement,
    category: 'interactive',
    icon: 'M13 10V3L4 14h7v7l9-11h-7z',
    description: 'Button group for record actions',
    defaultSettings: { buttons: [] }
  },

  'metadata-bar': {
    component: MetadataBarElement,
    category: 'data',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    description: 'Display record metadata (created, modified, etc.)',
    defaultSettings: { fields: ['created', 'modified', 'author'] }
  }

  // ... more elements
};
```

### 4. Unified Settings Model

**Single configuration structure for all page types:**

```javascript
// Universal page configuration
const PageConfig = {
  id: string,
  name: string,
  layoutPresetId: string,  // Reference to LAYOUT_PRESETS (optional)

  // Unified zone configuration
  zones: [
    {
      id: 'cover',
      type: 'cover',
      visible: boolean,
      containerWidth: 'narrow' | 'standard' | 'wide' | 'full' | 'notion',
      padding: { x: number, y: number },
      background: string,
      border: boolean,
      rows: [
        {
          id: string,
          columns: [
            {
              id: string,
              span: number,  // 1-12 grid columns
              elements: [
                {
                  id: string,
                  type: string,  // From ElementRegistry
                  settings: object,
                  data: any
                }
              ]
            }
          ]
        }
      ]
    }
  ],

  // UI preferences
  features: {
    insertMethod: 'slash' | 'panel' | 'both',
    showSlashHint: boolean,
    allowZoneToggle: boolean
  },

  // Styling
  theme: 'light' | 'dark',
  customCSS: string
};
```

### 5. Component Structure

**New file organization:**

```
apps/records-prototype/src/
├── components/
│   ├── UniversalPage/
│   │   ├── UniversalPage.jsx         # Main page component
│   │   ├── ZoneRenderer.jsx          # Renders zones
│   │   ├── RowRenderer.jsx           # Renders rows
│   │   ├── ColumnRenderer.jsx        # Renders columns
│   │   └── ElementRenderer.jsx       # Delegates to registry
│   │
│   ├── elements/
│   │   ├── registry.js               # Element type registry
│   │   ├── CoverImageElement.jsx     # Cover image with drag-reposition
│   │   ├── PageIconElement.jsx       # Icon/emoji picker
│   │   ├── TitleElement.jsx          # Editable title
│   │   ├── DescriptionElement.jsx    # Description/subtitle
│   │   ├── TextElement.jsx           # Text block
│   │   ├── HeadingElement.jsx        # Heading block
│   │   ├── DataGridElement.jsx       # Data grid with CSV
│   │   ├── BreadcrumbElement.jsx     # Breadcrumb navigation
│   │   ├── ActionButtonsElement.jsx  # Button group
│   │   ├── MetadataBarElement.jsx    # Metadata display
│   │   └── ...
│   │
│   ├── panels/
│   │   ├── SlashPalette.jsx          # '/' command palette
│   │   ├── ComponentPanel.jsx        # Drag-drop element panel
│   │   ├── UnsplashPanel.jsx         # Image picker (slide-out)
│   │   ├── ElementInspector.jsx      # Settings for selected element
│   │   └── ZoneSettings.jsx          # Zone configuration panel
│   │
│   ├── layouts/
│   │   ├── presets.js                # Layout preset definitions
│   │   └── LayoutPicker.jsx          # UI for choosing presets
│   │
│   └── hooks/
│       ├── usePageConfig.js          # Manage page configuration
│       ├── useElementDragDrop.js     # Drag-drop logic
│       └── useZoneLayout.js          # Zone/row/column calculations
│
└── App.jsx                           # Main app (simplified)
```

---

## Canvas Frame Integration

### Canvas Frames Can Reuse Layout Presets

**Important**: Canvas frames should be able to select and use any layout preset, providing the same flexibility as standalone pages with **zero code duplication**.

#### How It Works

```javascript
// Canvas frame configuration
const CanvasFrame = {
  id: 'frame-123',
  type: 'frame',
  position: { x: 100, y: 100 },
  size: { width: 800, height: 600 },

  // Reuse the same page config structure!
  pageConfig: {
    layoutPresetId: 'data-record',  // User selects from same presets
    zones: LAYOUT_PRESETS['data-record'].zones,
    features: {
      insertMethod: 'both',
      showSlashHint: false,
      allowZoneToggle: true
    }
  }
};
```

#### Implementation

Canvas frames render using the **same** `UniversalPage` component:

```jsx
// Canvas frame rendering
<CanvasFrame position={frame.position} size={frame.size}>
  <UniversalPage
    pageId={frame.id}
    config={frame.pageConfig}      // Includes layoutPresetId
    containerContext="frame"        // Tells zones they're in a frame
    onUpdate={handleFrameUpdate}
  />
</CanvasFrame>
```

#### User Experience Flow

1. **User adds frame to canvas**
2. **System prompts**: "Choose a layout for this frame:"
   ```
   [ Database Page ]  [ Data Record ]  [ Blank ]  [ Full Width ]
   ```
3. **User selects preset** (e.g., "Data Record")
4. **Frame renders** with the selected zone configuration
5. **User can customize**: Add/remove zones, insert elements via slash or drag-drop

#### Benefits

✅ **Zero code duplication**: Frames and pages use the same rendering system
✅ **Consistent UX**: Same element registry, same insertion methods
✅ **All presets available**: Any layout preset works in any frame
✅ **Full customization**: Users can modify zones, elements, settings per frame

#### Frame-Specific Considerations

**Container Width Adaptation**:
- Full-width zones adapt to frame width (not viewport width)
- Notion/standard/wide containers scale proportionally
- `containerContext="frame"` enables frame-aware behavior

**Example**:
```javascript
const getContainerWidth = (zone, context) => {
  if (context === 'frame') {
    // Frame context: Use percentages of frame width
    return {
      'full': '100%',
      'wide': '90%',
      'standard': '80%',
      'narrow': '60%',
      'notion': '75%'
    }[zone.containerWidth];
  } else {
    // Page context: Use fixed pixel widths
    return {
      'full': '100vw',
      'wide': '1200px',
      'standard': '900px',
      'narrow': '600px',
      'notion': '700px'
    }[zone.containerWidth];
  }
};
```

---

## Grid Layout and Canvas Layout Support

### Critical: Maintain Existing Implementation

**The platform already supports Grid Layout and Canvas Layout** as element types within pages. This functionality **must be preserved** and will work seamlessly with the unified zone system.

### Current Implementation

The application currently uses `react-grid-layout` for Grid Layout functionality:

```javascript
// Already installed and configured
import RGL, { WidthProvider } from 'react-grid-layout';
const ReactGridLayout = WidthProvider(RGL);

// Existing element types in the codebase
const elementTypes = {
  'grid-layout': {
    // Grid layout container with react-grid-layout
    // Supports drag-to-position, resize, responsive breakpoints
  },
  'canvas-layout': {
    // Canvas layout container with grid/freeform modes
    // Supports pixel-perfect positioning, multi-breakpoint
  }
};
```

### State Management (Already Exists)

```javascript
// Current state structure (App.jsx:6071-6073)
const [gridLayouts, setGridLayouts] = useState({});
// { containerId: { children: [childId], positions: {childId: {x, y, w, h}} } }

const [canvasLayouts, setCanvasLayouts] = useState({});
// { containerId: {
//   gridPositions: { desktop: {}, tablet: {}, mobile: {} },
//   freeformPositions: { desktop: {}, tablet: {}, mobile: {} }
// } }
```

### How These Fit Into Unified System

Grid Layout and Canvas Layout elements will be **registered in the ElementRegistry** and can be **inserted into any zone**:

```javascript
// apps/records-prototype/src/elements/registry.js
export const ElementRegistry = {
  // ... other elements

  'grid-layout': {
    component: GridLayoutElement,  // Uses existing react-grid-layout implementation
    category: 'layout',
    icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4...',
    description: 'Drag-to-position grid layout with responsive breakpoints',
    defaultSettings: {
      cols: 12,
      rowHeight: 30,
      margin: [10, 10],
      compactType: 'vertical'
    }
  },

  'canvas-layout': {
    component: CanvasLayoutElement,  // Uses existing canvas implementation
    category: 'layout',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2...',
    description: 'Freeform canvas with grid/freeform modes and multi-breakpoint support',
    defaultSettings: {
      mode: 'grid',  // 'grid' or 'freeform'
      breakpoint: 'desktop'
    }
  }
};
```

### Usage Example

Users can add Grid Layout or Canvas Layout to any zone in any page:

```javascript
{
  id: 'body',
  type: 'body',
  visible: true,
  containerWidth: 'wide',
  padding: { x: 8, y: 8 },
  rows: [
    {
      id: 'dashboard-row',
      columns: [
        {
          id: 'dashboard-col',
          span: 12,
          elements: [
            {
              id: 'dashboard-grid',
              type: 'grid-layout',  // Grid layout element
              settings: {
                cols: 12,
                rowHeight: 40
              },
              data: {
                children: ['widget-1', 'widget-2', 'widget-3'],
                positions: {
                  'widget-1': { x: 0, y: 0, w: 4, h: 2 },
                  'widget-2': { x: 4, y: 0, w: 8, h: 4 },
                  'widget-3': { x: 0, y: 2, w: 4, h: 2 }
                }
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Key Benefits

✅ **Ultimate flexibility**: Zones (structured) + Grid (semi-structured) + Canvas (freeform)
✅ **No library changes**: Continue using existing `react-grid-layout` implementation
✅ **Proven system**: Existing logic for Grid/Canvas is already working and tested
✅ **Seamless integration**: Grid/Canvas elements work in any zone, any page, any frame

### Use Cases

**Grid Layout**:
- 📊 Dashboard pages with resizable widgets
- 🎨 Portfolio layouts with custom positioning
- 🏢 Admin panels with drag-to-arrange sections
- 📱 Responsive layouts that adapt to different breakpoints

**Canvas Layout**:
- 🎨 Marketing landing pages with overlapping elements
- 📊 Infographics and data visualizations
- 🖼️ Magazine-style layouts with pixel-perfect control
- ⚡ Event pages with complex visual compositions

### Important: Do NOT Change Libraries

**Keep the existing implementation**:
- ✅ Continue using `react-grid-layout` (already installed and configured)
- ✅ Maintain existing state management (`gridLayouts`, `canvasLayouts`)
- ✅ Preserve current Grid/Canvas rendering logic
- ✅ Keep responsive breakpoint support (desktop, tablet, mobile)

**Do NOT adopt new libraries** for now. The existing implementation is:
- ✅ Working and tested
- ✅ Integrated with the application
- ✅ Supports all required features
- ✅ Familiar to current users

The refactoring should **wrap** the existing Grid/Canvas logic into the ElementRegistry pattern, not rewrite it.

---

## Implementation Plan

### Phase 1: Foundation (3-4 hours)
**Goal**: Create unified zone system without breaking existing features

- [ ] Create `UniversalPage` component with zone configuration
- [ ] Create `ZoneRenderer`, `RowRenderer`, `ColumnRenderer`
- [ ] Create `ElementRegistry` with initial types
- [ ] Create layout presets (`LAYOUT_PRESETS`)
- [ ] Migrate container width logic to shared presets
- [ ] Add configuration migration utility for existing pages

**Migration Strategy**: Run both systems in parallel, slowly migrate

### Phase 2: Element Unification (4-5 hours)
**Goal**: Replace inline JSX with registry-based elements

- [ ] Create individual element components:
  - `CoverImageElement` (from Database page)
  - `PageIconElement` (from Database page)
  - `TitleElement` (unified title rendering)
  - `DescriptionElement` (description/subtitle)
  - `DataGridElement` (with CSV support)
  - `TextElement`, `HeadingElement`, `ListElement`
  - `BreadcrumbElement`, `ActionButtonsElement`, `MetadataBarElement`
  - `GridLayoutElement` (wrap existing react-grid-layout implementation)
  - `CanvasLayoutElement` (wrap existing canvas layout implementation)
- [ ] Migrate `renderElementContent()` to use registry
- [ ] Add element wrapper with hover controls
- [ ] **Preserve existing Grid/Canvas state management** (do not rewrite)

### Phase 3: Insert UX Unification (3-4 hours)
**Goal**: Support both slash and drag-drop everywhere

- [ ] Extract `SlashPalette` to shared component
- [ ] Make component panel layout-aware
- [ ] Add "insert method" setting (slash/panel/both)
- [ ] Unified element creation flow
- [ ] Shared undo/redo for all insert methods

### Phase 4: Settings Migration (2-3 hours)
**Goal**: Migrate to unified settings model

- [ ] Create settings migration utility
- [ ] Convert `customPages[].settings` to unified model
- [ ] Convert `pageSettings.detail.zones` to unified model
- [ ] Update state management
- [ ] Ensure backward compatibility

### Phase 5: Canvas Frame Integration (2-3 hours)
**Goal**: Enable canvas frames to use layout presets

- [ ] Add `containerContext` prop to `UniversalPage` component
- [ ] Implement frame-aware container width logic
- [ ] Add layout preset picker UI for canvas frames
- [ ] Test all presets in frame contexts
- [ ] Verify Grid/Canvas layouts work within frames

### Phase 6: Polish & Features (3-4 hours)
**Goal**: Enable all features on all pages

- [ ] Enable cover images on any page type
- [ ] Enable slash commands on any page type
- [ ] Enable any zone configuration
- [ ] Add layout preset picker UI for standalone pages
- [ ] Add zone add/remove/reorder UI
- [ ] Performance optimization
- [ ] Update documentation

**Total Estimated Time**: 17-23 hours

---

## Benefits

### Code Quality
- ✅ **~1,500 lines of code eliminated** (from 2,000 duplicated to 500 unified)
- ✅ **Single source of truth** for page rendering
- ✅ **Easier testing** (test element registry instead of inline JSX)
- ✅ **Type safety** ready for TypeScript migration

### User Experience
- ✅ **Consistent UX** across all page types and canvas frames
- ✅ **Feature parity** (all features available on all pages and frames)
- ✅ **Flexible layouts** (any zone configuration)
- ✅ **Better performance** (shared component instances)
- ✅ **Layout presets** for quick page creation and frame setup
- ✅ **Ultimate flexibility** (Zones + Grid Layout + Canvas Layout in any combination)
- ✅ **Canvas frame reusability** (frames can use any layout preset)

### Developer Experience
- ✅ **Easier to add new element types** (just add to registry)
- ✅ **Easier to add new layouts** (just add preset configuration)
- ✅ **Better separation of concerns** (zones → rows → columns → elements)
- ✅ **Reusable components** across the application
- ✅ **No artificial limitations** (no "modes")

### Future Extensibility
- ✅ **Save custom layouts** (users can save their own presets)
- ✅ **Theme support** (zone-level styling)
- ✅ **Plugin architecture** (3rd-party elements)
- ✅ **Layout marketplace** (share presets with community)

---

## Risks & Mitigations

### Risk 1: Breaking Existing Pages
**Mitigation**:
- Run old and new systems in parallel during migration
- Add automatic migration for existing page configs
- Comprehensive testing before removing old code

### Risk 2: Performance Regression
**Mitigation**:
- Memoize element renderers with `React.memo()`
- Use `useMemo()` for zone layout calculations
- Implement virtualization for large element lists

### Risk 3: Increased Complexity
**Mitigation**:
- Comprehensive documentation with examples
- Type definitions for all configs
- Visual configuration builder for non-technical users

### Risk 4: Breaking Grid/Canvas Layout Functionality
**Mitigation**:
- Preserve existing `react-grid-layout` implementation (do not rewrite)
- Wrap existing Grid/Canvas logic into ElementRegistry (no logic changes)
- Maintain existing state management (`gridLayouts`, `canvasLayouts`)
- Test Grid/Canvas in isolation before integration
- Ensure backward compatibility with existing Grid/Canvas pages

### Risk 5: Timeline Overrun
**Mitigation**:
- Phased rollout (can stop after any phase)
- Each phase delivers standalone value
- Phase 1-2 already provides 60% of benefits

---

## Success Metrics

### Before (Current State)
- **Lines of code**: ~26,000 (App.jsx)
- **Page architectures**: 2 (parallel systems)
- **Element types**: ~15 (split across systems)
- **Insert methods**: 2 (incompatible)
- **Code duplication**: ~2,000 lines

### After (Target State)
- **Lines of code**: ~18,000 (App.jsx) + ~3,000 (new components)
- **Page architectures**: 1 (unified with layouts)
- **Element types**: ~25 (all shared via registry)
- **Insert methods**: 1 (unified, configurable)
- **Code duplication**: ~0 lines
- **Layout presets**: 4+ (database-page, data-record, blank, full-width)

**Net Reduction**: ~5,000 lines while adding more features

---

## User Experience Flow

### Creating a New Page

1. **User clicks "New Page"**
2. **System shows Layout Picker:**
   ```
   Choose a layout to get started:

   [ Database Page ]          [ Data Record ]
   Cover, icon, content       Header, body, footer

   [ Blank Page ]             [ Full Width ]
   Start from scratch         Edge-to-edge content
   ```
3. **User selects layout (e.g., "Database Page")**
4. **Page created with preset configuration**
5. **User can customize:**
   - Add/remove zones via settings
   - Toggle zone visibility
   - Change container widths
   - Add elements via slash commands or drag-drop

### Configuring Zones

**Settings Panel:**
```
Page Settings
  Layout: Database Page (custom)

  Zones:
    ☑ Cover Image          [Settings] [Remove]
    ☑ Header              [Settings] [Remove]
    ☑ Body                [Settings] [Remove]
    ☐ Footer              [Settings] [Add]

  [+ Add Zone]

  Features:
    Insert Method: ● Slash  ○ Panel  ○ Both
    ☑ Show slash command hints
    ☑ Allow zone visibility toggle
```

### Adding Content

**Slash Commands** (type `/`):
```
/ Basic Blocks
  Text             Plain text block
  Heading          Large section heading
  Data             Interactive data grid

/ Structure
  Cover Image      Full-width cover
  Page Icon        Emoji or icon

/ Navigation
  Breadcrumb       Navigation trail
  Action Buttons   Button group
```

**Drag-Drop Panel**:
```
Elements Panel
  Structure ▼
    Cover Image
    Page Icon

  Content ▼
    Text
    Heading
    Data Grid

  [Drag to page to insert]
```

---

## Recommendation

**Proceed with refactoring in phases**, with checkpoints after each phase:

1. **Phase 1**: Lay foundation, ensure no regressions
2. **Phase 2**: Unify elements (including Grid/Canvas wrapping), measure performance
3. **Phase 3**: Unified insert UX, gather user feedback
4. **Phase 4**: Settings migration, data integrity checks
5. **Phase 5**: Canvas frame integration with layout presets
6. **Phase 6**: Enable all features, celebrate! 🎉

**Key Priorities**:
- ✅ Preserve existing Grid/Canvas layout functionality (do not rewrite)
- ✅ Enable canvas frames to reuse layout presets (zero duplication)
- ✅ Maintain backward compatibility throughout migration

**Stop Condition**: Can pause/stop after any phase if priorities change

---

## Next Steps

1. ✅ **Review this proposal** - Approve architecture direction
2. ⏳ **Create feature branch** - `refactor/unified-page-system`
3. ⏳ **Implement Phase 1** - Foundation (3-4 hours)
4. ⏳ **Review checkpoint** - Ensure no regressions
5. ⏳ **Continue with Phase 2+** - Based on results

---

## Appendix: Code Examples

### Example 1: Using UniversalPage Component

```javascript
// Database-style page (from preset)
<UniversalPage
  pageId="page-123"
  config={{
    layoutPresetId: 'database-page',
    zones: LAYOUT_PRESETS['database-page'].zones,
    features: LAYOUT_PRESETS['database-page'].features
  }}
  onUpdate={handlePageUpdate}
/>

// Record-style page (from preset)
<UniversalPage
  pageId="record-456"
  config={{
    layoutPresetId: 'data-record',
    zones: LAYOUT_PRESETS['data-record'].zones,
    features: LAYOUT_PRESETS['data-record'].features
  }}
  onUpdate={handlePageUpdate}
/>

// Custom page (mix and match)
<UniversalPage
  pageId="custom-789"
  config={{
    layoutPresetId: null,  // Custom layout
    zones: [
      { id: 'cover', type: 'cover', visible: true, rows: [...] },
      { id: 'header', type: 'header', visible: true, rows: [...] },
      { id: 'body', type: 'body', visible: true, rows: [...] },
      { id: 'sidebar', type: 'custom', visible: true, rows: [...] },
      { id: 'footer', type: 'footer', visible: true, rows: [...] }
    ],
    features: {
      insertMethod: 'both',
      showSlashHint: true,
      allowZoneToggle: true
    }
  }}
  onUpdate={handlePageUpdate}
/>
```

### Example 2: Adding New Element Type

```javascript
// apps/records-prototype/src/elements/VideoElement.jsx
import React from 'react';

export const VideoElement = ({ data, settings, onUpdate }) => {
  return (
    <div className="video-element">
      <video
        src={data.url}
        controls
        style={{ width: settings.width || '100%' }}
      />
    </div>
  );
};

// Register in registry.js
export const ElementRegistry = {
  // ... existing elements
  'video': {
    component: VideoElement,
    category: 'media',
    icon: 'M14.752 11.168l-3.197...',
    description: 'Embedded video player',
    defaultSettings: { width: '100%', autoplay: false }
  }
};

// Now available in slash palette AND component panel on ALL pages!
```

### Example 3: Adding New Layout Preset

```javascript
// apps/records-prototype/src/layouts/presets.js
export const LAYOUT_PRESETS = {
  // ... existing presets

  'portfolio': {
    id: 'portfolio',
    name: 'Portfolio',
    description: 'Showcase work with full-width images and project details',
    icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586...',
    zones: [
      {
        id: 'cover',
        type: 'cover',
        visible: true,
        containerWidth: 'full',
        padding: { x: 0, y: 0 },
        rows: [
          {
            id: 'cover-row',
            columns: [
              {
                id: 'cover-col',
                span: 12,
                elements: [
                  { id: 'cover', type: 'cover-image', settings: { verticalPosition: 50 }, data: {} }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'header',
        type: 'header',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 8, y: 6 },
        rows: [
          {
            id: 'title-row',
            columns: [
              {
                id: 'title-col',
                span: 12,
                elements: [
                  { id: 'title', type: 'title', settings: { fontSize: '5xl' }, data: { content: 'Project Name' } },
                  { id: 'subtitle', type: 'description', settings: {}, data: { content: 'Client / Year' } }
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
        containerWidth: 'wide',
        padding: { x: 8, y: 8 },
        rows: []
      }
    ],
    features: {
      insertMethod: 'both',
      showSlashHint: true,
      allowZoneToggle: true
    }
  }
};

// Instantly available in Layout Picker!
```

### Example 4: Configuration Migration

```javascript
// Automatic migration utility
function migrateToUnifiedConfig(oldConfig, oldType) {
  if (oldType === 'database') {
    // Migrate from old Database Page structure
    return {
      layoutPresetId: 'database-page',
      zones: [
        {
          id: 'cover',
          type: 'cover',
          visible: oldConfig.settings.cover?.enabled || false,
          containerWidth: 'full',
          padding: { x: 0, y: 0 },
          rows: oldConfig.settings.cover?.enabled ? [
            {
              id: 'cover-row',
              columns: [{
                id: 'cover-col',
                span: 12,
                elements: [{
                  id: 'cover-img',
                  type: 'cover-image',
                  settings: { verticalPosition: oldConfig.settings.cover.verticalPosition || 50 },
                  data: { image: oldConfig.settings.cover.image }
                }]
              }]
            }
          ] : []
        },
        {
          id: 'header',
          type: 'header',
          visible: true,
          containerWidth: 'notion',
          padding: { x: 12, y: 6 },
          rows: [
            {
              id: 'icon-row',
              columns: [{
                id: 'icon-col',
                span: 12,
                elements: [{
                  id: 'icon',
                  type: 'page-icon',
                  settings: {},
                  data: { icon: oldConfig.settings.header?.icon }
                }]
              }]
            },
            {
              id: 'title-row',
              columns: [{
                id: 'title-col',
                span: 12,
                elements: [
                  {
                    id: 'title',
                    type: 'title',
                    settings: {},
                    data: { content: oldConfig.settings.header?.title || 'Untitled' }
                  },
                  {
                    id: 'desc',
                    type: 'description',
                    settings: {},
                    data: { content: oldConfig.settings.header?.description || '' }
                  }
                ]
              }]
            }
          ]
        },
        {
          id: 'body',
          type: 'body',
          visible: true,
          containerWidth: 'notion',
          padding: { x: 12, y: 8 },
          rows: (oldConfig.settings.body?.elements || []).map((el, idx) => ({
            id: `body-row-${idx}`,
            columns: [{
              id: `body-col-${idx}`,
              span: 12,
              elements: [{
                id: el.id,
                type: el.type,
                settings: {},
                data: el.data || el
              }]
            }]
          }))
        }
      ],
      features: {
        insertMethod: 'slash',
        showSlashHint: true,
        allowZoneToggle: true
      }
    };
  } else if (oldType === 'record') {
    // Migrate from old 3-zone structure
    return {
      layoutPresetId: 'data-record',
      zones: Object.entries(oldConfig.pageSettings.detail.zones).map(([zoneId, zone]) => ({
        id: zoneId,
        type: zoneId,
        visible: zone.visible,
        containerWidth: zone.containerWidth,
        padding: { x: 8, y: 6 },  // Default padding
        rows: zone.rows || []
      })),
      features: {
        insertMethod: 'both',
        showSlashHint: false,
        allowZoneToggle: true
      }
    };
  }

  // Default: blank page
  return {
    layoutPresetId: 'blank',
    zones: LAYOUT_PRESETS['blank'].zones,
    features: LAYOUT_PRESETS['blank'].features
  };
}
```

---

## Questions for Review

1. **Architecture**: Does the unified zone system make sense?
2. **Layout Presets**: Are the preset names and configurations appropriate?
3. **Timeline**: Is 15-20 hours acceptable for this refactoring?
4. **Priority**: Should we proceed immediately or defer?
5. **Scope**: Any features we should add/remove from the plan?

**Status**: 🟡 Awaiting approval to proceed
