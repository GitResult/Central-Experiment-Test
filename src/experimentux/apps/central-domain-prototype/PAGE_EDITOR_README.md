# Page Editor System

A comprehensive drag-and-drop visual page builder with a 4-type element architecture, real-time editing, and extensive customization capabilities.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Element Types](#element-types)
4. [Features](#features)
5. [Keyboard Shortcuts](#keyboard-shortcuts)
6. [User Interface](#user-interface)
7. [Technical Stack](#technical-stack)
8. [Getting Started](#getting-started)
9. [Advanced Features](#advanced-features)

## Overview

The Page Editor is a production-ready visual page builder that allows users to create complex page layouts through an intuitive drag-and-drop interface. It supports four distinct element types, provides comprehensive editing tools, and includes live preview functionality.

### Key Highlights

- 🎨 **4-Type Element Architecture**: Field, Record, Markup, Structure
- 🖱️ **Drag-and-Drop Interface**: Intuitive element placement
- ⚡ **Real-Time Editing**: Instant visual feedback
- 🎭 **Live Preview Mode**: See pages as end users will
- 🎨 **Theme Customization**: Full theme control with visual editor
- 🌍 **Internationalization**: Multi-locale translation management
- ⌨️ **Keyboard Shortcuts**: Power-user productivity features
- 📝 **JSON Export/Import**: Full data portability
- ↩️ **Undo/Redo**: Comprehensive history management

## Architecture

### Page Structure Hierarchy

```
Page
└── Zones (containers for layout regions)
    └── Rows (horizontal divisions)
        └── Columns (vertical divisions)
            └── Elements (4 types: Field, Record, Markup, Structure)
```

### 6-Layer Settings Inheritance

Settings cascade through these layers (most specific wins):

1. **Page Settings** - Global page configuration
2. **Zone Settings** - Region-specific styles
3. **Row Settings** - Row-level layout
4. **Column Settings** - Column-level spacing
5. **Element Settings** - Element-specific styles
6. **Structure Settings** - Internal structure styles

### Data Flow

```
User Action → EditorStore (Zustand) → React Components → Visual Update
     ↓
History Stack (Undo/Redo)
```

## Element Types

### 1. Field Elements (Form Inputs)

Interactive form elements for data collection:

- **Input**: Single-line text input
- **Textarea**: Multi-line text input
- **Checkbox**: Boolean selection
- **Radio**: Single choice from options
- **Select**: Dropdown selection
- **Date**: Date picker

**Example Use Cases:**
- Contact forms
- Search bars
- Login forms
- Surveys

### 2. Record Elements (Data Display)

Data-driven display components:

- **Contact Card**: Person/contact information
- **Task Card**: Task/todo item display
- **Data List**: Structured data listing

**Example Use Cases:**
- Contact directories
- Task management boards
- Product catalogs
- News feeds

### 3. Markup Elements (Static Content)

Static content and navigation:

- **Text**: Headings, paragraphs, formatted text
- **Button**: Call-to-action buttons
- **Link**: Hyperlinks and navigation
- **Image**: Pictures and graphics
- **Divider**: Visual separators

**Example Use Cases:**
- Landing pages
- Blog posts
- Marketing pages
- Documentation

### 4. Structure Elements (Containers)

Layout and organizational components:

- **Container**: Generic wrapper with padding/margin
- **Card**: Bordered content card
- **Tabs**: Tabbed interface
- **Accordion**: Collapsible sections

**Example Use Cases:**
- Complex layouts
- Nested content
- Dashboard widgets
- FAQ sections

## Features

### Drag-and-Drop

1. **Element Palette**: Right sidebar "Elements" tab
2. **Drop Zones**: Dashed bordered areas indicate drop targets
3. **Visual Feedback**: Highlighted drop zones on hover
4. **Instant Placement**: Elements appear immediately after drop

### Selection & Multi-Selection

- **Single Selection**: Click element to select
- **Multi-Selection**: Ctrl+Click (Cmd+Click on Mac) to add to selection
- **Selection Toolbar**: Appears at bottom when elements selected
- **Visual Indicators**: Blue outline on selected elements

### Editing Tools

#### Right Sidebar

**Settings Tab:**
- Element-specific data editing
- Real-time preview of changes
- Visual style editor
- Collapsible sections

**Elements Tab:**
- Element palette organized by type
- Drag elements to canvas
- Search/filter elements (future)

#### Slash Palette (`/`)

Quick command access via keyboard:

```
Element Commands:
  - Add Markup Element
  - Add Field Element
  - Add Structure Element
  - Add Record Element

Edit Commands:
  - Duplicate Selected (Ctrl+D)
  - Delete Selected (Delete)
  - Undo (Ctrl+Z)
  - Redo (Ctrl+Shift+Z)
  - Clear Selection (Esc)

View Commands:
  - Toggle Preview Mode
  - Toggle Sidebar
  - Toggle Alignment Guides

Page Commands:
  - New Page
  - Layout Preset

Theme Commands:
  - Customize Theme

Advanced Commands:
  - View Page JSON
  - Manage Locales
```

#### Context Menu (Right-Click)

Quick actions on elements:
- Duplicate
- Delete
- Move Up/Down
- Copy/Paste
- Convert Type
- Select Parent
- Edit JSON

### Live Preview Mode

Toggle between edit and preview:

**Edit Mode:**
- Full editor UI visible
- Drop zones shown
- Selection enabled
- Toolbar visible

**Preview Mode:**
- Clean end-user view
- No editor UI
- No selection
- Floating "Exit Preview" button

### JSON Editor

Direct page structure editing:

- Syntax highlighting
- Real-time validation
- Format button
- Import/Export JSON files
- Error reporting

### Theme Customizer

Visual theme editor with 8 sections:

1. **Primary Colors** (10 shades)
2. **Status Colors** (Success, Warning, Error, Info)
3. **Text Colors** (Primary, Secondary, Tertiary, Disabled)
4. **Background Colors** (Primary, Secondary, Surface)
5. **Border Colors** (Default, Light, Dark)
6. **Typography** (Font Sizes, Weights)
7. **Spacing Scale** (10 values)
8. **Border Radius** (5 values)

**Operations:**
- Real-time preview
- Import/Export themes
- Reset to defaults

### Locale Manager

Internationalization management:

- **10 Default Locales**: en-US, es-ES, fr-FR, de-DE, ja-JP, zh-CN, ar-SA, pt-BR, ru-RU, hi-IN
- **Active Locale Management**: Add/remove locales
- **Default Locale**: Designate fallback language
- **Translation Editing**: Inline key/value editing
- **Bulk Operations**: Add/delete keys across all locales
- **Import/Export**: JSON-based translation files

### Undo/Redo System

Comprehensive history tracking:

- All page modifications tracked
- Ctrl+Z: Undo last action
- Ctrl+Shift+Z: Redo last undone action
- History visualization (future)
- Branching support

## Keyboard Shortcuts

### Selection

| Shortcut | Action |
|----------|--------|
| `Click` | Select element |
| `Ctrl+Click` | Add to selection (Cmd+Click on Mac) |
| `Esc` | Clear selection |

### Clipboard

| Shortcut | Action |
|----------|--------|
| `Ctrl+C` | Copy selected elements (Cmd+C on Mac) |
| `Ctrl+V` | Paste from clipboard (Cmd+V on Mac) |
| `Ctrl+D` | Duplicate selected (Cmd+D on Mac) |

### Movement

| Shortcut | Action |
|----------|--------|
| `Alt+↑` | Move element up |
| `Alt+↓` | Move element down |
| `Delete` | Delete selected elements |

### History

| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` | Undo (Cmd+Z on Mac) |
| `Ctrl+Shift+Z` | Redo (Cmd+Shift+Z on Mac) |

### Navigation

| Shortcut | Action |
|----------|--------|
| `/` | Open Slash Palette |
| `Esc` | Close modals/palettes |

## User Interface

### Global UI Components

```
┌─────────────────────────────────────────────────┐
│ GlobalBar (App Header)                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────┐  ┌─────────────────┐  │
│  │                     │  │                 │  │
│  │  Main Content       │  │  Right Sidebar  │  │
│  │  (Routes)           │  │  - Elements     │  │
│  │                     │  │  - Settings     │  │
│  │                     │  │                 │  │
│  └─────────────────────┘  └─────────────────┘  │
│                                                 │
├─────────────────────────────────────────────────┤
│ SelectionToolbar (when elements selected)       │
└─────────────────────────────────────────────────┘
```

### Page Editor Layout

```
┌─────────────────────────────────────────────────┐
│ Toolbar: Page Editor | Undo/Redo | Preview/Save│
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ Page Title (editable)                   │   │
│  ├─────────────────────────────────────────┤   │
│  │                                         │   │
│  │  Canvas                                 │   │
│  │  ┌─────────────────────────────────┐   │   │
│  │  │ Element 1                       │   │   │
│  │  ├─────────────────────────────────┤   │   │
│  │  │ Element 2                       │   │   │
│  │  ├─────────────────────────────────┤   │   │
│  │  │ Drop Zone                       │   │   │
│  │  └─────────────────────────────────┘   │   │
│  │                                         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Technical Stack

### Core Technologies

- **React 18.3.1**: UI framework
- **Vite 7.2.4**: Build tool and dev server
- **Zustand**: State management
- **@dnd-kit**: Drag-and-drop functionality
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS

### State Management

**EditorStore (Zustand):**
```javascript
{
  currentPage: Page,        // Current editing page
  selectedElements: Path[], // Selected element paths
  sidebarOpen: boolean,     // Sidebar visibility
  mode: 'edit' | 'preview', // Editor mode
  history: Page[],          // Undo/redo stack
  historyIndex: number,     // Current history position
  clipboard: Element[],     // Copied elements
  // ... modals and other state
}
```

### File Structure

```
src/
├── components/
│   ├── chrome/           # App-level UI (GlobalBar, Navigator)
│   ├── editor/           # Editor-specific components
│   │   ├── EditorCanvas.jsx
│   │   ├── RightSidebar.jsx
│   │   ├── SelectionToolbar.jsx
│   │   ├── SlashPalette.jsx
│   │   ├── ContextMenu.jsx
│   │   ├── JsonEditor.jsx
│   │   ├── ThemeCustomizer.jsx
│   │   ├── LocaleManager.jsx
│   │   ├── StyleEditor.jsx
│   │   └── VisualControls.jsx
│   ├── elements/         # Element type implementations
│   │   ├── field/
│   │   ├── record/
│   │   ├── markup/
│   │   └── structure/
│   └── pages/            # Page components
│       └── PageEditor.jsx
├── store/
│   └── editorStore.js    # Zustand store
├── hooks/
│   └── useKeyboardShortcuts.js
├── config/
│   └── theme.js          # Theme token system
└── App.jsx               # Root component
```

## Getting Started

### Basic Page Creation

1. **Start**: Navigate to `/editor`
2. **Add Elements**:
   - Open right sidebar "Elements" tab
   - Drag element to drop zone
3. **Edit Content**:
   - Click element to select
   - Edit in right sidebar "Settings" tab
4. **Style Elements**:
   - Use Style Editor in settings panel
   - Adjust spacing, colors, typography
5. **Preview**:
   - Click "👁️ Preview" button
   - View as end user
   - Click "✏️ Exit Preview" to return
6. **Save**:
   - Click "💾 Save" button
   - Downloads JSON file

### Power User Workflow

1. **Rapid Placement**: Use `/` → type element name → Enter
2. **Quick Actions**: Right-click for context menu
3. **Keyboard First**: Use Ctrl+C/V, Alt+↑/↓, Ctrl+D
4. **Direct Editing**: Advanced users use JSON Editor
5. **Undo Freely**: Ctrl+Z to experiment without fear

## Advanced Features

### Element Type Conversion

Future feature to convert between compatible types:
- Field ↔ Record (when data compatible)
- Markup ↔ Structure (for wrapping)

### Layout Presets

Pre-configured page layouts:
- Hero + Features
- Two Column
- Three Column
- Dashboard Grid

### Component Library

Save custom element combinations for reuse:
- Save selection as component
- Drag from component library
- Update all instances

### Responsive Design

Future support for breakpoint-specific settings:
- Mobile (< 768px)
- Tablet (768px - 1024px)
- Desktop (> 1024px)

### Collaboration

Future multi-user features:
- Real-time editing
- User cursors
- Comment system
- Version history

## Performance Considerations

### Optimizations Implemented

1. **React.memo**: CanvasElement and DropZone memoized
2. **useCallback**: Event handlers memoized
3. **Zustand Selectors**: Fine-grained subscriptions
4. **Lazy Loading**: Heavy modals loaded on demand (future)

### Best Practices

- Avoid deeply nested structures (max 3-4 levels)
- Limit elements per page (< 100 for best performance)
- Use preview mode when not actively editing
- Close unused modals

## Browser Support

- **Chrome**: ✅ Full support
- **Edge**: ✅ Full support
- **Firefox**: ✅ Full support
- **Safari**: ✅ Full support (Mac-specific shortcuts)
- **Mobile**: ⚠️ Not optimized (future)

## Troubleshooting

### Elements Won't Drop

- Ensure drop zone is visible (dashed border)
- Check browser console for errors
- Verify drag-and-drop not disabled

### Selection Not Working

- Click directly on element
- Avoid clicking on interactive children (inputs, buttons)
- Check preview mode is not active

### Undo/Redo Not Working

- Verify Ctrl/Cmd key is pressed
- Check not in input field (Ctrl+Z in inputs does native undo)
- Verify history not at boundary (can't undo first action)

### Performance Issues

- Reduce number of elements
- Close unused modals
- Check browser extensions (some interfere with React DevTools)
- Use production build for best performance

## API Reference

### EditorStore Actions

```javascript
// Page Operations
createNewPage()
loadPage(pageData)
updatePageMetadata(updates)

// Element Operations
addElement(zoneId, rowIndex, columnIndex, element)
updateElement(path, updates)
removeElement(path)
reorderElements(zoneId, rowIndex, columnIndex, oldIndex, newIndex)

// Selection
selectElement(path, mode = 'replace')
selectMultiple(paths)
clearSelection()
isElementSelected(path)

// Multi-Element Operations
deleteSelected()
duplicateSelected()
moveSelected(targetZoneId, targetRowIndex, targetColumnIndex)

// Clipboard
copyToClipboard()
pasteFromClipboard()

// Movement
moveElementUp(path)
moveElementDown(path)

// History
undo()
redo()
canUndo()
canRedo()

// UI State
toggleSidebar()
openSidebar(tab)
closeSidebar()
toggleMode()  // edit ↔ preview

// Modals
openJsonEditor()
closeJsonEditor()
openThemeCustomizer()
closeThemeCustomizer()
openLocaleManager()
closeLocaleManager()
```

### Element Path Structure

```javascript
{
  zoneId: string,        // Zone identifier
  rowIndex: number,      // Row position
  columnIndex: number,   // Column position
  elementIndex: number   // Element position in column
}
```

## Contributing

When extending the page editor:

1. **Add Element Type**: Create in `src/components/elements/[type]/`
2. **Register**: Add to element type switch in `EditorCanvas.jsx`
3. **Add to Palette**: Update `RightSidebar.jsx` elements list
4. **Document**: Add to this README
5. **Test**: Add scenarios to `INTEGRATION_TESTING.md`

## License

[Specify license]

## Support

For issues and questions:
- GitHub Issues: [link]
- Documentation: This file
- Integration Tests: See `INTEGRATION_TESTING.md`
