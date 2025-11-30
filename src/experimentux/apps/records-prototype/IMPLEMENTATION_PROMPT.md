# Unified Page System Refactoring - Implementation Prompt

## Context

You are tasked with implementing a comprehensive refactoring of the Records Prototype application to unify two parallel page architectures into a single, flexible zone-based system. This refactoring has been approved by CTO review and is designed to eliminate ~1,500 lines of duplicated code while enabling feature parity across all page types.

**Key Documents to Review**:
1. `/apps/records-prototype/REFACTORING_PROPOSAL.md` - Complete architectural proposal
2. `/apps/records-prototype/CTO_EVALUATION.md` - CTO evaluation and approval
3. `/apps/records-prototype/EVENT_LANDING_ANALYSIS.md` - Complex layout validation

**Current State**:
- Two parallel page architectures: Database Pages (Notion-style) and Data Record Pages (3-zone)
- ~2,000 lines of duplicated zone/element rendering logic in `App.jsx`
- Existing Grid Layout and Canvas Layout functionality using `react-grid-layout`
- Separate settings models preventing feature sharing

**Target State**:
- Single `UniversalPage` component with configurable zones
- Element registry system for all content types
- Layout presets for quick page creation
- Canvas frames can reuse layout presets (zero duplication)
- Grid/Canvas layouts preserved and integrated as element types

---

## Critical Constraints

### MUST DO ✅

1. **Preserve Existing Functionality**:
   - Do NOT break existing Database Pages or Data Record Pages
   - Maintain all existing Grid Layout and Canvas Layout functionality
   - Run old and new systems in parallel during migration
   - Create migration utility for automatic config conversion

2. **Preserve Grid/Canvas Implementation**:
   - Keep existing `react-grid-layout` library (do NOT adopt new libraries)
   - Maintain existing state management: `gridLayouts` and `canvasLayouts`
   - Wrap existing Grid/Canvas rendering logic (do NOT rewrite)
   - Test Grid/Canvas in isolation before integration

3. **Maintain Apple-Inspired Design**:
   - Keep existing minimalist design language
   - Preserve current styling and animations
   - Maintain hover states, transitions, and micro-interactions

4. **Code Quality**:
   - Use React best practices (hooks, memo, useMemo, useCallback)
   - Add PropTypes or TypeScript types for all components
   - Include error boundaries for element rendering
   - Add comprehensive comments for complex logic

5. **Performance**:
   - Lazy load element components
   - Memoize renderers with React.memo()
   - Debounce update operations
   - Monitor and log slow renders (>1000ms)

### MUST NOT DO ❌

1. **Do NOT rewrite Grid/Canvas logic** - Wrap existing implementation only
2. **Do NOT adopt new libraries** - Use existing `react-grid-layout`
3. **Do NOT break backward compatibility** - Support existing page configs
4. **Do NOT remove old code** until migration is complete and tested
5. **Do NOT skip testing** - Test each phase before proceeding

---

## Implementation Phases

### Phase 1: Foundation (3-4 hours)

**Goal**: Create unified zone system without breaking existing features

#### Tasks

1. **Create folder structure**:
```bash
apps/records-prototype/src/
├── components/
│   ├── UniversalPage/
│   │   ├── UniversalPage.jsx
│   │   ├── ZoneRenderer.jsx
│   │   ├── RowRenderer.jsx
│   │   ├── ColumnRenderer.jsx
│   │   └── ElementRenderer.jsx
│   ├── elements/
│   │   └── registry.js
│   └── layouts/
│       └── presets.js
```

2. **Create `UniversalPage.jsx`**:
```jsx
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ZoneRenderer from './ZoneRenderer';

const UniversalPage = ({
  pageId,
  config,
  containerContext = 'page',  // 'page' | 'frame'
  onUpdate
}) => {
  // Memoize zones to prevent unnecessary re-renders
  const memoizedZones = useMemo(() => config.zones, [config.zones]);

  const handleZoneUpdate = (zoneId, updates) => {
    const updatedZones = memoizedZones.map(zone =>
      zone.id === zoneId ? { ...zone, ...updates } : zone
    );
    onUpdate({ ...config, zones: updatedZones });
  };

  return (
    <div className="universal-page" data-page-id={pageId}>
      {memoizedZones.map((zone) => (
        <ZoneRenderer
          key={zone.id}
          zone={zone}
          containerContext={containerContext}
          onUpdate={(updates) => handleZoneUpdate(zone.id, updates)}
        />
      ))}
    </div>
  );
};

UniversalPage.propTypes = {
  pageId: PropTypes.string.isRequired,
  config: PropTypes.shape({
    layoutPresetId: PropTypes.string,
    zones: PropTypes.arrayOf(PropTypes.object).isRequired,
    features: PropTypes.object
  }).isRequired,
  containerContext: PropTypes.oneOf(['page', 'frame']),
  onUpdate: PropTypes.func.isRequired
};

export default UniversalPage;
```

3. **Create `ZoneRenderer.jsx`**:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import RowRenderer from './RowRenderer';

const ZoneRenderer = ({ zone, containerContext, onUpdate }) => {
  if (!zone.visible) return null;

  const containerWidth = getContainerWidth(zone.containerWidth, containerContext);

  return (
    <div
      className={`zone zone-${zone.type}`}
      style={{
        width: containerWidth,
        margin: '0 auto',
        padding: `${zone.padding.y * 4}px ${zone.padding.x * 4}px`,
        background: zone.background,
        border: zone.border ? '1px solid rgb(229 231 235)' : 'none'
      }}
    >
      {zone.rows.map((row) => (
        <RowRenderer
          key={row.id}
          row={row}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

// Container width helper
const getContainerWidth = (width, context) => {
  if (context === 'frame') {
    // Frame context: Use percentages of frame width
    return {
      'full': '100%',
      'wide': '90%',
      'standard': '80%',
      'narrow': '60%',
      'notion': '75%'
    }[width] || '80%';
  } else {
    // Page context: Use fixed pixel widths
    return {
      'full': '100vw',
      'wide': '1200px',
      'standard': '900px',
      'narrow': '600px',
      'notion': '700px'
    }[width] || '900px';
  }
};

ZoneRenderer.propTypes = {
  zone: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    visible: PropTypes.bool.isRequired,
    containerWidth: PropTypes.string.isRequired,
    padding: PropTypes.shape({ x: PropTypes.number, y: PropTypes.number }).isRequired,
    background: PropTypes.string,
    border: PropTypes.bool,
    rows: PropTypes.array.isRequired
  }).isRequired,
  containerContext: PropTypes.oneOf(['page', 'frame']).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default ZoneRenderer;
```

4. **Create `RowRenderer.jsx`**:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import ColumnRenderer from './ColumnRenderer';

const RowRenderer = ({ row, onUpdate }) => {
  return (
    <div className="zone-row grid grid-cols-12 gap-4 mb-4">
      {row.columns.map((column) => (
        <ColumnRenderer
          key={column.id}
          column={column}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

RowRenderer.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    columns: PropTypes.array.isRequired
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default RowRenderer;
```

5. **Create `ColumnRenderer.jsx`**:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import ElementRenderer from './ElementRenderer';

const ColumnRenderer = ({ column, onUpdate }) => {
  return (
    <div className={`zone-column col-span-${column.span}`}>
      {column.elements.map((element) => (
        <ElementRenderer
          key={element.id}
          element={element}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
};

ColumnRenderer.propTypes = {
  column: PropTypes.shape({
    id: PropTypes.string.isRequired,
    span: PropTypes.number.isRequired,
    elements: PropTypes.array.isRequired
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default ColumnRenderer;
```

6. **Create `ElementRenderer.jsx`**:
```jsx
import React, { Suspense, lazy } from 'react';
import PropTypes from 'prop-types';
import { ElementRegistry } from '../elements/registry';

// Error boundary for element rendering
class ElementErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Element rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 border border-red-300 bg-red-50 rounded text-red-700">
          Failed to render element
        </div>
      );
    }
    return this.props.children;
  }
}

// Skeleton loader for lazy-loaded elements
const ElementSkeleton = () => (
  <div className="animate-pulse bg-gray-200 h-20 rounded"></div>
);

const ElementRenderer = React.memo(({ element, onUpdate }) => {
  const elementDef = ElementRegistry[element.type];

  if (!elementDef) {
    return (
      <div className="p-4 border border-yellow-300 bg-yellow-50 rounded text-yellow-700">
        Unknown element type: {element.type}
      </div>
    );
  }

  const ElementComponent = elementDef.component;

  return (
    <ElementErrorBoundary>
      <Suspense fallback={<ElementSkeleton />}>
        <ElementComponent
          data={element.data}
          settings={element.settings}
          onUpdate={(updates) => onUpdate(element.id, updates)}
        />
      </Suspense>
    </ElementErrorBoundary>
  );
}, (prevProps, nextProps) => {
  // Only re-render if element data/settings changed
  return (
    prevProps.element.id === nextProps.element.id &&
    JSON.stringify(prevProps.element.data) === JSON.stringify(nextProps.element.data) &&
    JSON.stringify(prevProps.element.settings) === JSON.stringify(nextProps.element.settings)
  );
});

ElementRenderer.propTypes = {
  element: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    settings: PropTypes.object,
    data: PropTypes.any
  }).isRequired,
  onUpdate: PropTypes.func.isRequired
};

export default ElementRenderer;
```

7. **Create `registry.js`** (initial empty registry):
```jsx
// apps/records-prototype/src/components/elements/registry.js

/**
 * Element Registry
 *
 * Central registry for all element types available in the Universal Page system.
 * Elements are lazy-loaded for performance.
 */

export const ElementRegistry = {
  // Will be populated in Phase 2
};

export const getElementsByCategory = () => {
  const categories = {};
  Object.entries(ElementRegistry).forEach(([type, def]) => {
    const category = def.category || 'other';
    if (!categories[category]) {
      categories[category] = [];
    }
    categories[category].push({ type, ...def });
  });
  return categories;
};
```

8. **Create `presets.js`** (layout presets):
```jsx
// apps/records-prototype/src/components/layouts/presets.js

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
        visible: false,
        containerWidth: 'full',
        padding: { x: 0, y: 0 },
        background: '',
        border: false,
        rows: []
      },
      {
        id: 'header',
        type: 'header',
        visible: true,
        containerWidth: 'notion',
        padding: { x: 12, y: 6 },
        background: '',
        border: false,
        rows: []
      },
      {
        id: 'body',
        type: 'body',
        visible: true,
        containerWidth: 'notion',
        padding: { x: 12, y: 8 },
        background: '',
        border: false,
        rows: []
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
        background: '',
        border: false,
        rows: []
      },
      {
        id: 'body',
        type: 'body',
        visible: true,
        containerWidth: 'full',
        padding: { x: 8, y: 8 },
        background: '',
        border: false,
        rows: []
      },
      {
        id: 'footer',
        type: 'footer',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 8, y: 6 },
        background: '',
        border: false,
        rows: []
      }
    ],
    features: {
      insertMethod: 'both',
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
        background: '',
        border: false,
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
```

9. **Add feature flag to App.jsx**:
```jsx
// Add to state in App.jsx
const [useUnifiedPageSystem, setUseUnifiedPageSystem] = useState(false);
```

10. **Test foundation**:
- Create a test page that uses `UniversalPage` with a blank preset
- Verify zones render correctly
- Verify container widths work for both page and frame contexts
- Verify no existing functionality is broken

#### Phase 1 Checkpoint

- [ ] All foundation components created
- [ ] Layout presets defined
- [ ] Feature flag added
- [ ] Test page renders successfully
- [ ] No existing functionality broken
- [ ] Code committed to branch

---

### Phase 2: Element Unification (4-5 hours)

**Goal**: Replace inline JSX with registry-based elements

#### Tasks

1. **Create element components** in `src/components/elements/`:

**TextElement.jsx**:
```jsx
import React from 'react';
import PropTypes from 'prop-types';

const TextElement = ({ data, settings, onUpdate }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div
      className={`text-element ${settings.className || ''}`}
      onDoubleClick={() => setIsEditing(true)}
      onBlur={() => setIsEditing(false)}
    >
      {isEditing ? (
        <textarea
          value={data.content || ''}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="w-full p-2 border rounded"
          autoFocus
        />
      ) : (
        <p className="text-gray-700">{data.content || 'Click to edit...'}</p>
      )}
    </div>
  );
};

TextElement.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string
  }),
  settings: PropTypes.object,
  onUpdate: PropTypes.func.isRequired
};

export default TextElement;
```

**TitleElement.jsx**, **HeadingElement.jsx**, **DescriptionElement.jsx**, etc.
(Create similar components for each element type)

2. **IMPORTANT: Wrap existing Grid/Canvas implementations**:

**GridLayoutElement.jsx**:
```jsx
import React from 'react';
import PropTypes from 'prop-types';
import RGL, { WidthProvider } from 'react-grid-layout';

const ReactGridLayout = WidthProvider(RGL);

/**
 * GridLayoutElement
 *
 * IMPORTANT: This wraps the existing react-grid-layout implementation.
 * DO NOT rewrite the grid logic - preserve existing functionality.
 */
const GridLayoutElement = ({ data, settings, onUpdate }) => {
  // Use existing gridLayouts state structure
  const layout = data.positions || [];
  const children = data.children || [];

  const handleLayoutChange = (newLayout) => {
    onUpdate({
      ...data,
      positions: newLayout
    });
  };

  return (
    <div className="grid-layout-element">
      <ReactGridLayout
        className="layout"
        layout={layout}
        cols={settings.cols || 12}
        rowHeight={settings.rowHeight || 30}
        width={settings.width || 1200}
        margin={settings.margin || [10, 10]}
        compactType={settings.compactType || 'vertical'}
        onLayoutChange={handleLayoutChange}
        draggableHandle=".drag-handle"
        resizeHandles={['se', 'sw', 'ne', 'nw']}
      >
        {children.map((child) => (
          <div key={child.id} data-grid={child.grid}>
            {/* Render nested elements here */}
            {/* TODO: Integrate with existing element rendering logic */}
          </div>
        ))}
      </ReactGridLayout>
    </div>
  );
};

GridLayoutElement.propTypes = {
  data: PropTypes.shape({
    children: PropTypes.array,
    positions: PropTypes.array
  }),
  settings: PropTypes.shape({
    cols: PropTypes.number,
    rowHeight: PropTypes.number,
    width: PropTypes.number,
    margin: PropTypes.array,
    compactType: PropTypes.string
  }),
  onUpdate: PropTypes.func.isRequired
};

export default GridLayoutElement;
```

**CanvasLayoutElement.jsx**:
```jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * CanvasLayoutElement
 *
 * IMPORTANT: This wraps the existing canvas layout implementation.
 * DO NOT rewrite the canvas logic - preserve existing functionality.
 */
const CanvasLayoutElement = ({ data, settings, onUpdate }) => {
  // Use existing canvasLayouts state structure
  const mode = settings.mode || 'grid';
  const breakpoint = settings.breakpoint || 'desktop';

  // TODO: Integrate with existing canvas rendering logic from App.jsx
  // Preserve gridPositions and freeformPositions structure

  return (
    <div className="canvas-layout-element">
      {/* Reuse existing canvas rendering logic */}
      {/* DO NOT rewrite - wrap existing implementation */}
    </div>
  );
};

CanvasLayoutElement.propTypes = {
  data: PropTypes.shape({
    gridPositions: PropTypes.object,
    freeformPositions: PropTypes.object
  }),
  settings: PropTypes.shape({
    mode: PropTypes.oneOf(['grid', 'freeform']),
    breakpoint: PropTypes.string
  }),
  onUpdate: PropTypes.func.isRequired
};

export default CanvasLayoutElement;
```

3. **Update registry.js** with all element types:
```jsx
import { lazy } from 'react';

export const ElementRegistry = {
  // Text elements
  'text': {
    component: lazy(() => import('./TextElement')),
    category: 'content',
    icon: 'M4 6h16M4 12h16M4 18h7',
    description: 'Plain text block',
    defaultSettings: {}
  },

  'heading': {
    component: lazy(() => import('./HeadingElement')),
    category: 'content',
    icon: 'M4 6h16M4 12h10M4 18h7',
    description: 'Section heading',
    defaultSettings: { level: 2 }
  },

  'title': {
    component: lazy(() => import('./TitleElement')),
    category: 'structure',
    icon: 'M4 6h16',
    description: 'Page title',
    defaultSettings: { fontSize: '3xl' }
  },

  // Layout elements - PRESERVE EXISTING IMPLEMENTATIONS
  'grid-layout': {
    component: lazy(() => import('./GridLayoutElement')),
    category: 'layout',
    icon: 'M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5z',
    description: 'Grid layout with drag-to-position (uses existing react-grid-layout)',
    defaultSettings: {
      cols: 12,
      rowHeight: 30,
      margin: [10, 10],
      compactType: 'vertical'
    }
  },

  'canvas-layout': {
    component: lazy(() => import('./CanvasLayoutElement')),
    category: 'layout',
    icon: 'M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5',
    description: 'Freeform canvas layout (uses existing canvas implementation)',
    defaultSettings: {
      mode: 'grid',
      breakpoint: 'desktop'
    }
  }

  // Add more elements...
};
```

4. **Test element rendering**:
- Create test pages with each element type
- Verify Grid/Canvas elements use existing logic (no rewrites)
- Verify elements render and update correctly
- Test lazy loading and error boundaries

#### Phase 2 Checkpoint

- [ ] All element components created
- [ ] Grid/Canvas elements wrap existing implementation (not rewritten)
- [ ] Element registry populated
- [ ] Elements render correctly
- [ ] Lazy loading works
- [ ] Error boundaries catch failures
- [ ] No existing functionality broken
- [ ] Code committed to branch

---

### Phase 3: Insert UX Unification (3-4 hours)

**Goal**: Support both slash commands and drag-drop everywhere

#### Tasks

1. **Extract SlashPalette to shared component**
2. **Make component panel layout-aware**
3. **Add unified element creation flow**
4. **Test both insertion methods**

*(Detailed implementation steps similar to above)*

---

### Phase 4: Settings Migration (2-3 hours)

**Goal**: Migrate existing pages to unified settings model

#### Tasks

1. **Create migration utility**:
```jsx
// src/utils/configMigration.js

export const migrateToUnifiedConfig = (oldConfig, oldType) => {
  if (oldType === 'database') {
    // Migrate Database Page
    return migrateDatabasePage(oldConfig);
  } else if (oldType === 'record') {
    // Migrate Data Record Page
    return migrateRecordPage(oldConfig);
  }
  return createBlankPage();
};

const migrateDatabasePage = (oldConfig) => {
  // TODO: Implement migration logic
  // Preserve all existing data
  // Convert to new zone structure
};

const migrateRecordPage = (oldConfig) => {
  // TODO: Implement migration logic
  // Preserve all existing data
  // Convert to new zone structure
};
```

2. **Test migration with existing pages**
3. **Ensure backward compatibility**

---

### Phase 5: Canvas Frame Integration (2-3 hours)

**Goal**: Enable canvas frames to use layout presets

#### Tasks

1. **Add containerContext support to UniversalPage** (already done in Phase 1)
2. **Create layout preset picker UI for canvas frames**:

```jsx
const FrameLayoutPicker = ({ onSelect }) => {
  return (
    <div className="frame-layout-picker">
      <h3>Choose a layout for this frame:</h3>
      <div className="layout-grid">
        {Object.entries(LAYOUT_PRESETS).map(([id, preset]) => (
          <button
            key={id}
            onClick={() => onSelect(preset)}
            className="layout-preset-card"
          >
            <div className="preset-icon">{preset.icon}</div>
            <div className="preset-name">{preset.name}</div>
            <div className="preset-description">{preset.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
};
```

3. **Integrate with canvas frame creation flow**
4. **Test all presets in frame contexts**
5. **Verify Grid/Canvas layouts work within frames**

---

### Phase 6: Polish & Features (3-4 hours)

**Goal**: Enable all features and optimize performance

#### Tasks

1. **Enable cover images on any page type**
2. **Enable slash commands on any page type**
3. **Add layout preset picker UI for standalone pages**
4. **Add zone add/remove/reorder UI**
5. **Performance optimization**:
   - Add React.memo() to all renderers
   - Add useMemo() for expensive calculations
   - Add debouncing for updates
   - Implement performance monitoring
6. **Update documentation**

---

## Testing Requirements

### Unit Tests
- Test each element component in isolation
- Test zone/row/column renderers
- Test layout presets
- Test migration utility

### Integration Tests
- Test complete page rendering
- Test element insertion (slash + drag-drop)
- Test canvas frame integration
- Test Grid/Canvas layout functionality

### End-to-End Tests
- Create new pages with each preset
- Migrate existing pages
- Create canvas frames with different layouts
- Test all element types

### Performance Tests
- Measure page load time (target: <1s)
- Measure element insertion time (target: <100ms)
- Measure update time (target: <500ms)
- Monitor for slow renders (>1000ms)

---

## Success Criteria

### Code Quality
- [ ] ~1,500 lines of code eliminated
- [ ] Single source of truth for page rendering
- [ ] All components have PropTypes or TypeScript types
- [ ] Error boundaries catch element rendering failures
- [ ] Performance monitoring in place

### Functionality
- [ ] All existing features work (Database Pages, Record Pages)
- [ ] Grid/Canvas layouts preserved (using existing implementation)
- [ ] Canvas frames can use layout presets
- [ ] Both insertion methods work (slash + drag-drop)
- [ ] Migration utility works for all existing pages

### Performance
- [ ] Page load < 1 second
- [ ] Element insertion < 100ms
- [ ] Update operations < 500ms
- [ ] No slow renders (>1000ms)

### User Experience
- [ ] Consistent UX across all page types
- [ ] Apple-inspired design preserved
- [ ] Layout presets easy to use
- [ ] Element insertion intuitive

---

## Rollback Plan

If critical issues arise during implementation:

1. **Disable feature flag**: Set `useUnifiedPageSystem = false`
2. **Old system still works**: Parallel systems run during migration
3. **No data loss**: Migration utility preserves all existing data
4. **Phased rollout**: Can stop after any phase

---

## Final Checklist

Before marking refactoring complete:

- [ ] All 6 phases implemented
- [ ] All tests passing
- [ ] No regressions in existing functionality
- [ ] Grid/Canvas layouts using existing implementation (not rewritten)
- [ ] Canvas frames can use layout presets
- [ ] Performance targets met
- [ ] Documentation updated
- [ ] Code reviewed and approved
- [ ] Old code removed (after 2 weeks of stability)
- [ ] Feature flag removed

---

## Key Reminders

1. **PRESERVE Grid/Canvas**: Wrap existing implementation, do NOT rewrite
2. **RUN IN PARALLEL**: Old and new systems during migration
3. **TEST THOROUGHLY**: Each phase before proceeding
4. **MAINTAIN DESIGN**: Apple-inspired minimalist aesthetic
5. **PERFORMANCE FIRST**: Memoize, lazy load, debounce
6. **ZERO DUPLICATION**: Frames and pages share same components

Good luck! The refactoring has been approved by CTO review and is ready for implementation.
