# Quick Start: Unified Page System

**For future sessions - How to start using the unified page system**

---

## 🚀 5-Minute Quick Start

### 1. Check Feature Flag

**File**: `apps/records-prototype/src/App.jsx` (line 4780)

```javascript
// Make sure this is set to true:
const [useUnifiedPageSystem, setUseUnifiedPageSystem] = useState(true);
```

### 2. View the Demo

Start dev server and open demo page:
```bash
cd apps/records-prototype
npm run dev

# Then open in browser:
# http://localhost:3003/demo.html
```

### 3. Start Creating Pages

Use one of these methods below ⬇️

---

## 📋 Method 1: Use a Layout Preset (Fastest)

**Best for**: Quick page creation with standard layouts

```javascript
import UniversalPage from './components/UniversalPage/UniversalPage';
import { createPageConfigFromPreset } from './components/layouts/presets';

function MyPage() {
  const [pageConfig, setPageConfig] = useState(
    createPageConfigFromPreset('database-page')  // or 'data-record', 'blank', 'event-landing'
  );

  return (
    <UniversalPage
      pageId="my-page-1"
      config={pageConfig}
      containerContext="page"
      onUpdate={setPageConfig}
    />
  );
}
```

**Available Presets**:
- `'database-page'` - Notion-style (cover, icon, title, body)
- `'data-record'` - 3-zone layout (header, body, footer)
- `'blank'` - Single body zone (start from scratch)
- `'event-landing'` - Marketing page (hero, content, CTA)

---

## 📋 Method 2: Create Custom Config

**Best for**: Custom layouts and specific requirements

```javascript
import UniversalPage from './components/UniversalPage/UniversalPage';

function MyCustomPage() {
  const customConfig = {
    layoutPresetId: 'custom',
    zones: [
      {
        id: 'my-header',
        type: 'header',
        visible: true,
        containerWidth: 'standard',  // 'full', 'wide', 'standard', 'narrow', 'notion'
        padding: { x: 8, y: 6 },
        background: '',
        border: false,
        rows: [
          {
            id: 'title-row',
            columns: [
              {
                id: 'title-col',
                span: 12,  // 1-12 (12-column grid)
                elements: [
                  {
                    id: 'my-title',
                    type: 'title',
                    data: { content: 'My Custom Page' },
                    settings: { fontSize: '4xl', fontWeight: 'bold' }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: 'my-body',
        type: 'body',
        visible: true,
        containerWidth: 'wide',
        padding: { x: 8, y: 8 },
        rows: [
          {
            id: 'content-row',
            columns: [
              {
                id: 'content-col',
                span: 12,
                elements: [
                  {
                    id: 'my-text',
                    type: 'text',
                    data: { content: 'Add your content here...' },
                    settings: {}
                  }
                ]
              }
            ]
          }
        ]
      }
    ],
    features: {
      insertMethod: 'both',      // 'slash', 'panel', 'both'
      showSlashHint: true,
      allowZoneToggle: true
    }
  };

  const [config, setConfig] = useState(customConfig);

  return (
    <UniversalPage
      pageId="custom-page"
      config={config}
      containerContext="page"
      onUpdate={setConfig}
    />
  );
}
```

---

## 📋 Method 3: Copy Existing Demo

**Best for**: Starting from working examples

```javascript
import UniversalPage from './components/UniversalPage/UniversalPage';
import { getDemoPageById } from './components/layouts/demoPages';

function MyPageBasedOnDemo() {
  // Copy a demo config and modify it
  const baseConfig = getDemoPageById('demo-simple');

  const [config, setConfig] = useState({
    ...baseConfig,
    // Customize as needed:
    zones: baseConfig.zones.map(zone => ({
      ...zone,
      // Modify zones, add elements, etc.
    }))
  });

  return (
    <UniversalPage
      pageId="my-modified-demo"
      config={config}
      containerContext="page"
      onUpdate={setConfig}
    />
  );
}
```

---

## 🧩 Adding Elements to a Page

### All 15 Available Element Types:

| Element Type | Usage | Common Props |
|--------------|-------|--------------|
| `'title'` | Large page titles | `data: { content }`, `settings: { fontSize, fontWeight, color }` |
| `'heading'` | Section headings (h2-h6) | `data: { content }`, `settings: { level }` |
| `'text'` | Plain text blocks | `data: { content }`, `settings: { fontSize, align, color }` |
| `'description'` | Subtitles/descriptions | `data: { content }`, `settings: { fontSize, color }` |
| `'page-icon'` | Emoji/icon | `data: { icon }`, `settings: { size }` |
| `'image'` | Images | `data: { src, alt }`, `settings: { width, height, objectFit }` |
| `'cover-image'` | Full-width covers | `data: { url, alt, position }`, `settings: { height }` |
| `'button'` | Interactive buttons | `data: { text, url }`, `settings: { variant, size, align }` |
| `'content-card'` | Versatile cards | `data: { title, description, media, cta }`, `settings: { variant, background }` |
| `'breadcrumb'` | Navigation breadcrumbs | `data: { items: [{ label, url }] }` |
| `'data-grid'` | Data tables | `data: { columns, rows }` |
| `'metadata-bar'` | Metadata display | `data: { fields: [{ label, value, type }] }` |
| `'form-field'` | Form inputs | `data: { fieldType, label, value }`, `settings: { rows }` |
| `'grid-layout'` | Grid layouts | `data: { children, positions }`, `settings: { cols, rowHeight }` |
| `'canvas-layout'` | Canvas layouts | `data: { mode, children, gridPositions }` |

### Example: Adding Elements

```javascript
// Add a new element to a zone:
const addElement = (zoneId, elementConfig) => {
  const newConfig = {
    ...config,
    zones: config.zones.map(zone => {
      if (zone.id === zoneId) {
        return {
          ...zone,
          rows: [
            ...zone.rows,
            {
              id: `row-${Date.now()}`,
              columns: [
                {
                  id: `col-${Date.now()}`,
                  span: 12,
                  elements: [elementConfig]
                }
              ]
            }
          ]
        };
      }
      return zone;
    })
  };
  setConfig(newConfig);
};

// Usage:
addElement('my-body', {
  id: `elem-${Date.now()}`,
  type: 'text',
  data: { content: 'New text element' },
  settings: {}
});
```

---

## 📂 Key Files Reference

### Core Components
```
src/components/UniversalPage/
├── UniversalPage.jsx         ← Main component
├── ZoneRenderer.jsx          ← Renders zones
├── RowRenderer.jsx           ← Renders rows
├── ColumnRenderer.jsx        ← Renders columns
├── ElementRenderer.jsx       ← Renders elements
├── SlashPalette.jsx          ← Slash command UI
├── ElementPanel.jsx          ← Drag-drop panel
├── LayoutPresetPicker.jsx    ← Layout picker
└── ZoneManager.jsx           ← Zone management
```

### Element Components (15 total)
```
src/components/elements/
├── registry.js               ← Element registry (import from here)
├── TextElement.jsx
├── TitleElement.jsx
├── HeadingElement.jsx
├── DescriptionElement.jsx
├── PageIconElement.jsx
├── ImageElement.jsx
├── CoverImageElement.jsx
├── ButtonElement.jsx
├── ContentCardElement.jsx
├── BreadcrumbElement.jsx
├── DataGridElement.jsx
├── MetadataBarElement.jsx
├── FormFieldElement.jsx
├── GridLayoutElement.jsx
└── CanvasLayoutElement.jsx
```

### Utilities
```
src/components/layouts/
├── presets.js                ← Layout presets & helpers
└── demoPages.js              ← Demo page configs (examples)

src/utils/
└── configMigration.js        ← Migration utility
```

---

## 🔧 Common Operations

### 1. Add a New Zone

```javascript
const addZone = () => {
  setConfig({
    ...config,
    zones: [
      ...config.zones,
      {
        id: `zone-${Date.now()}`,
        type: 'body',
        visible: true,
        containerWidth: 'standard',
        padding: { x: 8, y: 8 },
        background: '',
        border: false,
        rows: []
      }
    ]
  });
};
```

### 2. Toggle Zone Visibility

```javascript
const toggleZone = (zoneId) => {
  setConfig({
    ...config,
    zones: config.zones.map(zone =>
      zone.id === zoneId ? { ...zone, visible: !zone.visible } : zone
    )
  });
};
```

### 3. Update Element Data

```javascript
const updateElement = (elementId, newData) => {
  setConfig({
    ...config,
    zones: config.zones.map(zone => ({
      ...zone,
      rows: zone.rows.map(row => ({
        ...row,
        columns: row.columns.map(col => ({
          ...col,
          elements: col.elements.map(elem =>
            elem.id === elementId ? { ...elem, data: { ...elem.data, ...newData } } : elem
          )
        }))
      }))
    }))
  });
};
```

### 4. Multi-Column Layouts

```javascript
// Two columns (50/50):
{
  id: 'two-col-row',
  columns: [
    { id: 'col-1', span: 6, elements: [...] },
    { id: 'col-2', span: 6, elements: [...] }
  ]
}

// Three columns (33/33/33):
{
  id: 'three-col-row',
  columns: [
    { id: 'col-1', span: 4, elements: [...] },
    { id: 'col-2', span: 4, elements: [...] },
    { id: 'col-3', span: 4, elements: [...] }
  ]
}

// Asymmetric (66/33):
{
  id: 'asym-row',
  columns: [
    { id: 'main', span: 8, elements: [...] },
    { id: 'sidebar', span: 4, elements: [...] }
  ]
}
```

---

## 🎨 Styling & Customization

### Container Widths
```javascript
containerWidth: 'full'      // 100vw (full viewport)
containerWidth: 'wide'      // 1200px
containerWidth: 'standard'  // 900px
containerWidth: 'narrow'    // 600px
containerWidth: 'notion'    // 700px (Notion-style)
```

### Padding (4px units)
```javascript
padding: { x: 0, y: 0 }    // No padding
padding: { x: 8, y: 6 }    // 32px horizontal, 24px vertical
padding: { x: 12, y: 12 }  // 48px all around
```

### Backgrounds
```javascript
background: ''                                        // Transparent
background: '#f9fafb'                                // Gray
background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)'  // Gradient
```

---

## 🔄 Migration from Old System

If you have existing Database/Record pages:

```javascript
import { migrateToUnifiedConfig } from './utils/configMigration';

// Migrate old config:
const oldConfig = { /* existing page config */ };
const newConfig = migrateToUnifiedConfig(oldConfig, 'database');  // or 'record'

// Use migrated config:
<UniversalPage
  pageId="migrated-page"
  config={newConfig}
  containerContext="page"
  onUpdate={setConfig}
/>
```

---

## 🧪 Testing Your Pages

### 1. View in Dev Mode
```bash
npm run dev
# Open http://localhost:3003
```

### 2. Check Browser Console
- Should see "UniversalPage render" logs
- No errors (all green ✅)

### 3. Test Element Editing
- Double-click any text element
- Edit and save (Enter or Cmd/Ctrl+Enter)
- Check console for "Updated:" logs

### 4. Build Verification
```bash
npm run build
# Should succeed with lazy-loaded element chunks
```

---

## 📚 Documentation Reference

- **UNIFIED_PAGE_SYSTEM_COMPLETE.md** - Full implementation docs
- **DEMO_GUIDE.md** - Demo features & examples
- **HOW_TO_VIEW_DEMO.md** - Demo viewing guide
- **TROUBLESHOOTING_UNDEFINED.md** - Debug guide

---

## 💡 Pro Tips

1. **Start with a preset** - Faster than building from scratch
2. **Use demo pages as templates** - Copy and modify existing demos
3. **Check registry.js** - See all available element types
4. **Use the demo.html page** - Great for testing and prototyping
5. **Elements are lazy-loaded** - Add as many as you need, they load on-demand
6. **Zone visibility** - Hide zones you don't need (e.g., cover image)
7. **Multi-column layouts** - Use span property (1-12) for flexible grids

---

## 🚨 Common Mistakes to Avoid

❌ **Don't forget curly braces on imports**:
```javascript
// Wrong:
import getAllDemoPages from './components/layouts/demoPages';

// Right:
import { getAllDemoPages } from './components/layouts/demoPages';
```

❌ **Don't forget to pass config.zones**:
```javascript
// Wrong:
<UniversalPage pageId="x" config={{}} />

// Right:
<UniversalPage pageId="x" config={{ zones: [...] }} />
```

❌ **Don't mix up span values** (must sum to 12):
```javascript
// Wrong:
columns: [{ span: 6 }, { span: 8 }]  // Sum = 14 ❌

// Right:
columns: [{ span: 6 }, { span: 6 }]  // Sum = 12 ✅
```

---

## ✅ Quick Checklist for Starting

- [ ] Feature flag enabled (`useUnifiedPageSystem = true`)
- [ ] Dev server running (`npm run dev`)
- [ ] demo.html accessible and working
- [ ] Know which method to use (preset, custom, or demo-based)
- [ ] Have element type reference handy (see table above)
- [ ] Browser DevTools open (for debugging)

---

## 🎯 Next Steps

1. **Try creating your first page** using Method 1 (preset)
2. **Add some elements** using the element type table
3. **Test editing** by double-clicking elements
4. **Experiment with layouts** using different column spans
5. **Check the demos** for inspiration (`demo.html`)

---

**You're ready to start using the Unified Page System!** 🚀

**Quick Command**:
```bash
cd apps/records-prototype && npm run dev
# Then open: http://localhost:3003/demo.html
```
