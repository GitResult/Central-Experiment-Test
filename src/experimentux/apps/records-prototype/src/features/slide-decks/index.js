/**
 * Slide Decks Feature - Main Export
 *
 * Exports all components, hooks, services, and utilities for the Slide Decks feature.
 * This follows the feature-based architecture pattern.
 */

// Components - Deck Management
export { DeckList } from './components/DeckList/DeckList';
export { DeckCard } from './components/DeckList/DeckCard';

// Components - Editor
export { DeckEditor } from './components/DeckEditor/DeckEditor';
export { SimpleDeckEditorDemo } from './components/DeckEditor/SimpleDeckEditorDemo';
export { ContentBlockEditor } from './components/ContentBlockEditor/ContentBlockEditor';
export { DataPill } from './components/ContentBlockEditor/DataPill';
export { QuickInsertMenu } from './components/ContentBlockEditor/QuickInsertMenu';

// Components - Canvas
export { SlideCanvas } from './components/SlideCanvas/SlideCanvas';
export { AlignmentGuides } from './components/SlideCanvas/AlignmentGuides';
export { ResizeHandles } from './components/SlideCanvas/ResizeHandles';

// Components - Widgets
export { WidgetRenderer } from './components/WidgetRenderer/WidgetRenderer';
export { ChartWidget } from './components/WidgetRenderer/ChartWidget';
export { TableWidget } from './components/WidgetRenderer/TableWidget';
export { MetricWidget } from './components/WidgetRenderer/MetricWidget';

// Components - Sidebar
export { ComponentPalette } from './components/ComponentPalette/ComponentPalette';
export { PropertiesPanel } from './components/PropertiesPanel/PropertiesPanel';

// Components - Presenter Mode
export { PresenterMode } from './components/PresenterMode/PresenterMode';
export { PresenterModeToolbar } from './components/PresenterMode/PresenterModeToolbar';

// Components - Modals & Dialogs
export { TemplateGalleryModal } from './components/TemplateGalleryModal/TemplateGalleryModal';
export { TemplateCard } from './components/TemplateGalleryModal/TemplateCard';
export { DataSourcePickerModal } from './components/DataSourcePickerModal/DataSourcePickerModal';
export { ShareModal } from './components/ShareModal/ShareModal';

// Components - UI Elements
export { AutoSaveIndicator } from './components/AutoSaveIndicator/AutoSaveIndicator';
export { MobileTabSwitcher } from './components/MobileTabSwitcher/MobileTabSwitcher';

// Hooks
export { useDeckList } from './hooks/useDeckList';
export { useDeckState } from './hooks/useDeckState';
export { useAutoSave } from './hooks/useAutoSave';
export { useDataViews } from './hooks/useDataViews';
export { useWidgetData } from './hooks/useWidgetData';

// Services
export { deckService } from './services/deckService';
export { dataViewService } from './services/dataViewService';

// Utilities
export { trackEvent, trackPageView, trackError, trackTiming, SLIDE_DECK_EVENTS } from './utils/telemetry';
