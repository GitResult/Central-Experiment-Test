/**
 * Universal Panel System
 * Export all panel components and hooks
 */

export { default as Panel } from './Panel';
export { default as PanelHeader } from './PanelHeader';
export { default as PanelControls } from './PanelControls';
export { default as PanelResizer } from './PanelResizer';
export { default as PanelManager } from './PanelManager';
export { default as Taskbar } from './Taskbar';

// Hooks
export { default as usePanel } from './hooks/usePanel';
export { default as usePanelDocking } from './hooks/usePanelDocking';
export { default as usePanelResize } from './hooks/usePanelResize';
export { default as usePanelZIndex } from './hooks/usePanelZIndex';

// Store
export { usePanelStore } from '../../store/panelStore';
