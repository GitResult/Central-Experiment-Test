# Integration Testing Guide

This document outlines comprehensive integration testing scenarios for the Page Editor system.

## Overview

The Page Editor is a drag-and-drop visual page builder with a 4-type element architecture, comprehensive editing tools, and live preview functionality.

## Test Scenarios

### 1. Drag-and-Drop Functionality

#### 1.1 Basic Element Placement
- [ ] Drag a Markup element (Text, Button, Link) to an empty drop zone
- [ ] Verify element appears in the correct location
- [ ] Verify element can be selected by clicking
- [ ] Verify selection outline appears

#### 1.2 Multiple Elements
- [ ] Drag multiple elements into the same column
- [ ] Verify elements stack vertically in insertion order
- [ ] Verify drop zones appear between existing elements
- [ ] Drag element between two existing elements
- [ ] Verify element inserts at correct position

#### 1.3 Different Element Types
- [ ] Drag Field element (Input, Textarea, Checkbox, Radio, Select, Date)
- [ ] Drag Record element (Contact Card, Task Card, Data List)
- [ ] Drag Markup element (Text, Button, Link, Image, Divider)
- [ ] Drag Structure element (Container, Card, Tabs, Accordion)
- [ ] Verify each type renders correctly with default data

#### 1.4 Structure Elements
- [ ] Drag Container element to page
- [ ] Drag child elements into Container
- [ ] Verify nested rendering
- [ ] Verify child elements can be selected independently

### 2. Selection & Multi-Selection

#### 2.1 Single Selection
- [ ] Click element to select
- [ ] Verify blue outline appears
- [ ] Verify RightSidebar opens with element settings
- [ ] Click different element
- [ ] Verify selection moves to new element

#### 2.2 Multi-Selection
- [ ] Ctrl+Click (Cmd+Click on Mac) to add element to selection
- [ ] Verify multiple elements show selection outline
- [ ] Verify RightSidebar shows multi-selection message
- [ ] Click empty area to clear selection

#### 2.3 Selection Toolbar
- [ ] Select element
- [ ] Verify SelectionToolbar appears at bottom
- [ ] Verify toolbar shows correct element count
- [ ] Test Duplicate button (Ctrl+D)
- [ ] Test Delete button (Delete key)
- [ ] Test Move Up button (Alt+↑)
- [ ] Test Move Down button (Alt+↓)

### 3. Keyboard Shortcuts

#### 3.1 Selection Shortcuts
- [ ] Escape: Clear selection
- [ ] Delete: Delete selected elements
- [ ] Ctrl+D: Duplicate selected elements

#### 3.2 Clipboard Shortcuts
- [ ] Ctrl+C: Copy selected elements
- [ ] Ctrl+V: Paste from clipboard
- [ ] Verify pasted elements appear below originals

#### 3.3 Movement Shortcuts
- [ ] Alt+↑: Move element up in list
- [ ] Alt+↓: Move element down in list
- [ ] Verify selection follows moved element

#### 3.4 Editor Shortcuts
- [ ] Ctrl+Z: Undo last action
- [ ] Ctrl+Shift+Z: Redo last undone action
- [ ] /: Open Slash Palette

### 4. Context Menu

#### 4.1 Right-Click Menu
- [ ] Right-click on element
- [ ] Verify context menu appears at cursor
- [ ] Test each action:
  - Duplicate (Ctrl+D)
  - Delete (Delete)
  - Move Up (Alt+↑)
  - Move Down (Alt+↓)
  - Copy (Ctrl+C)
  - Convert Type
  - Select Parent
  - Clear Selection (Esc)
  - Edit JSON

#### 4.2 Context Menu Edge Cases
- [ ] Right-click when no element selected
- [ ] Right-click on first element (Move Up disabled)
- [ ] Right-click on last element (Move Down disabled)
- [ ] Click outside menu to close

### 5. Slash Palette

#### 5.1 Opening & Navigation
- [ ] Press / to open palette
- [ ] Verify modal appears centered
- [ ] Verify input is focused
- [ ] Type to filter commands
- [ ] Use ↑/↓ to navigate
- [ ] Press Enter to execute
- [ ] Press Escape to close

#### 5.2 Command Categories
- [ ] Test Element commands (Add Markup, Field, Structure, Record)
- [ ] Test Edit commands (Duplicate, Delete, Undo, Redo, Clear Selection)
- [ ] Test View commands (Toggle Preview, Toggle Sidebar, Toggle Alignment)
- [ ] Test Page commands (New Page, Layout Preset)
- [ ] Test Theme commands (Customize Theme)
- [ ] Test Advanced commands (View JSON, Manage Locales)

#### 5.3 Search Functionality
- [ ] Test exact match (e.g., "delete" → Delete Selected)
- [ ] Test starts-with match (e.g., "dup" → Duplicate Selected)
- [ ] Test contains match (e.g., "theme" → Customize Theme)
- [ ] Test keyword match (e.g., "i18n" → Manage Locales)
- [ ] Test fuzzy match (e.g., "jsn" → View Page JSON)

### 6. Right Sidebar

#### 6.1 Element Settings
- [ ] Select element
- [ ] Verify sidebar opens on right side
- [ ] Switch between "Settings" and "Elements" tabs
- [ ] Test Settings tab shows element properties
- [ ] Test Elements tab shows element palette

#### 6.2 Settings Panel
- [ ] Modify element data (text content, labels, etc.)
- [ ] Verify changes appear in real-time on canvas
- [ ] Test collapsible sections
- [ ] Test different input types (text, number, select, checkbox)

#### 6.3 Style Editor
- [ ] Open Style Editor for element
- [ ] Test Layout & Sizing (width, height, display)
- [ ] Test Spacing (padding, margin)
- [ ] Test Typography (font size, weight, align, line height)
- [ ] Test Colors (text color, background color)
- [ ] Test Borders & Shadows (radius, width, style, shadow)
- [ ] Test Effects (opacity, scale)
- [ ] Verify styles apply in real-time

### 7. JSON Editor

#### 7.1 Basic Functionality
- [ ] Open JSON Editor via Slash Palette
- [ ] Verify page structure appears as formatted JSON
- [ ] Test Format button
- [ ] Test Reset button (discards changes)
- [ ] Test Apply button (saves changes)

#### 7.2 Validation
- [ ] Edit JSON with syntax error
- [ ] Verify error message appears
- [ ] Verify Apply button is disabled
- [ ] Fix syntax error
- [ ] Verify error clears

#### 7.3 Import/Export
- [ ] Test Export button (downloads JSON file)
- [ ] Test Import button (loads JSON file)
- [ ] Import valid page JSON
- [ ] Verify page updates correctly

### 8. Theme Customizer

#### 8.1 Theme Sections
- [ ] Open Theme Customizer via Slash Palette
- [ ] Test Primary Colors section (10 shades)
- [ ] Test Status Colors section (Success, Warning, Error, Info)
- [ ] Test Text Colors section (Primary, Secondary, Tertiary, Disabled)
- [ ] Test Background Colors section (Primary, Secondary, Surface)
- [ ] Test Border Colors section (Default, Light, Dark)
- [ ] Test Typography section (Font Sizes, Font Weights)
- [ ] Test Spacing Scale section (10 spacing values)
- [ ] Test Border Radius section (5 radius values)

#### 8.2 Theme Operations
- [ ] Modify theme color
- [ ] Verify change appears in real-time
- [ ] Test Reset to Defaults button
- [ ] Test Import Theme (load JSON)
- [ ] Test Export Theme (download JSON)
- [ ] Test Apply Theme button

### 9. Locale Manager

#### 9.1 Locale Management
- [ ] Open Locale Manager via Slash Palette
- [ ] View active locales
- [ ] Add new locale from dropdown (10 options)
- [ ] Remove locale (except default)
- [ ] Set default locale

#### 9.2 Translation Management
- [ ] View translation keys for selected locale
- [ ] Click key to edit value
- [ ] Press Enter to save
- [ ] Press Escape to cancel
- [ ] Add new translation key (applies to all locales)
- [ ] Delete translation key (removes from all locales)

#### 9.3 Import/Export
- [ ] Test Export Translations button
- [ ] Test Import Translations button
- [ ] Verify translations persist

### 10. Live Preview Mode

#### 10.1 Entering Preview
- [ ] Click "👁️ Preview" button in toolbar
- [ ] Verify toolbar disappears
- [ ] Verify floating "✏️ Exit Preview" button appears
- [ ] Verify RightSidebar is hidden
- [ ] Verify SelectionToolbar is hidden
- [ ] Verify ContextMenu is disabled
- [ ] Verify drop zones are hidden
- [ ] Verify selection outlines are hidden
- [ ] Verify page title is read-only

#### 10.2 Preview Interactions
- [ ] Click on elements
- [ ] Verify no selection occurs
- [ ] Test form inputs (if present)
- [ ] Test button clicks (if present)
- [ ] Verify page looks like end-user view

#### 10.3 Exiting Preview
- [ ] Click "✏️ Exit Preview" button
- [ ] Verify returns to edit mode
- [ ] Verify toolbar reappears
- [ ] Verify all editor UI returns

### 11. Undo/Redo System

#### 11.1 Basic Undo/Redo
- [ ] Add element
- [ ] Press Ctrl+Z (Undo)
- [ ] Verify element disappears
- [ ] Press Ctrl+Shift+Z (Redo)
- [ ] Verify element reappears

#### 11.2 Complex Operations
- [ ] Add 5 elements
- [ ] Undo 3 times
- [ ] Verify correct elements disappear in reverse order
- [ ] Redo 2 times
- [ ] Verify elements reappear in forward order

#### 11.3 History Branching
- [ ] Add element A
- [ ] Add element B
- [ ] Undo (removes B)
- [ ] Add element C
- [ ] Verify can't redo to B (history branch)

### 12. Page Operations

#### 12.1 Page Metadata
- [ ] Edit page title in header
- [ ] Verify title updates in real-time
- [ ] Verify title persists

#### 12.2 Save Functionality
- [ ] Click "💾 Save" button
- [ ] Verify JSON file downloads
- [ ] Open downloaded file
- [ ] Verify contains complete page structure

#### 12.3 New Page
- [ ] Create page with elements
- [ ] Use Slash Palette to create new page
- [ ] Confirm dialog
- [ ] Verify page clears
- [ ] Verify new empty page created

### 13. Edge Cases & Error Handling

#### 13.1 Empty States
- [ ] New empty page shows drop zone
- [ ] Empty column shows drop zone
- [ ] No elements selected shows empty sidebar message

#### 13.2 Invalid Operations
- [ ] Try to move first element up (should be disabled)
- [ ] Try to move last element down (should be disabled)
- [ ] Delete all elements
- [ ] Verify drop zone reappears

#### 13.3 Concurrent Operations
- [ ] Select element
- [ ] Open JSON Editor
- [ ] Modify element in JSON
- [ ] Apply changes
- [ ] Verify element updates on canvas

### 14. Accessibility

#### 14.1 Keyboard Navigation
- [ ] Tab through UI elements
- [ ] Verify focus indicators visible
- [ ] Test all keyboard shortcuts work
- [ ] Verify Escape closes modals

#### 14.2 Screen Reader Support
- [ ] Test with screen reader
- [ ] Verify ARIA labels present
- [ ] Verify roles are appropriate
- [ ] Verify interactive elements are announced

### 15. Performance

#### 15.1 Large Pages
- [ ] Create page with 50+ elements
- [ ] Test scrolling performance
- [ ] Test selection performance
- [ ] Test drag-and-drop performance

#### 15.2 Rapid Operations
- [ ] Rapidly add/delete elements
- [ ] Rapidly undo/redo
- [ ] Rapidly switch between tabs
- [ ] Verify no UI lag or freezing

### 16. Cross-Browser Compatibility

#### 16.1 Chrome/Edge
- [ ] Test all features in Chrome
- [ ] Test all features in Edge

#### 16.2 Firefox
- [ ] Test all features in Firefox
- [ ] Test drag-and-drop specifically

#### 16.3 Safari
- [ ] Test all features in Safari
- [ ] Test Cmd key shortcuts (Mac)

## Test Completion Criteria

✅ All scenarios pass
✅ No console errors during testing
✅ No visual glitches
✅ All keyboard shortcuts work
✅ All modals open/close correctly
✅ All undo/redo operations work
✅ Performance is acceptable (< 100ms interaction response)
✅ Accessibility requirements met

## Known Limitations

- Multi-column layouts not yet implemented
- Multi-zone layouts not yet implemented
- Element reordering between rows not implemented via drag-and-drop (use move buttons)
- No mobile/touch support yet

## Reporting Issues

When reporting issues, include:
1. Browser and OS version
2. Steps to reproduce
3. Expected vs actual behavior
4. Console errors (if any)
5. Screenshots/videos if applicable
