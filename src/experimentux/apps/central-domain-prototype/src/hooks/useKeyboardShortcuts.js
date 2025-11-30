/**
 * useKeyboardShortcuts Hook
 * Handles global keyboard shortcuts for editor operations
 * Including multi-selection, delete, duplicate, undo/redo, page creation
 */

import React, { useEffect } from 'react';
import { useEditorStore } from '../store/editorStore';
import { usePagesStore } from '../store/pagesStore';
import { useStudioDockStore } from '../store/studioDockStore';

export function useKeyboardShortcuts() {
  const deleteSelected = useEditorStore((state) => state.deleteSelected);
  const duplicateSelected = useEditorStore((state) => state.duplicateSelected);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const copyToClipboard = useEditorStore((state) => state.copyToClipboard);
  const pasteFromClipboard = useEditorStore((state) => state.pasteFromClipboard);
  const moveElementUp = useEditorStore((state) => state.moveElementUp);
  const moveElementDown = useEditorStore((state) => state.moveElementDown);
  const selectedElements = useEditorStore((state) => state.selectedElements);

  // Pages store for new page creation
  const startCreatingPage = usePagesStore((state) => state.startCreatingPage);
  const pagesPanel = useStudioDockStore((state) => state.panels.pages);
  const openPanel = useStudioDockStore((state) => state.openPanel);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

      // Delete selected elements (Delete or Backspace)
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedElements.length > 0) {
        // Only if not focused on an input
        if (!isInputFocused) {
          e.preventDefault();
          deleteSelected();
        }
      }

      // Duplicate selected elements (Cmd/Ctrl + D)
      if (modKey && e.key === 'd' && selectedElements.length > 0) {
        e.preventDefault();
        duplicateSelected();
      }

      // Copy selected elements (Cmd/Ctrl + C)
      if (modKey && e.key === 'c' && selectedElements.length > 0 && !isInputFocused) {
        e.preventDefault();
        copyToClipboard();
      }

      // Paste from clipboard (Cmd/Ctrl + V)
      if (modKey && e.key === 'v' && !isInputFocused) {
        e.preventDefault();
        pasteFromClipboard();
      }

      // Move element up (Alt + ↑)
      if (e.altKey && e.key === 'ArrowUp' && selectedElements.length === 1) {
        e.preventDefault();
        moveElementUp(selectedElements[0]);
      }

      // Move element down (Alt + ↓)
      if (e.altKey && e.key === 'ArrowDown' && selectedElements.length === 1) {
        e.preventDefault();
        moveElementDown(selectedElements[0]);
      }

      // Clear selection (Escape)
      if (e.key === 'Escape' && selectedElements.length > 0) {
        e.preventDefault();
        clearSelection();
      }

      // Undo (Cmd/Ctrl + Z)
      if (modKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Redo (Cmd/Ctrl + Shift + Z or Cmd/Ctrl + Y)
      if ((modKey && e.shiftKey && e.key === 'z') || (modKey && e.key === 'y')) {
        e.preventDefault();
        redo();
      }

      // New Page (Cmd/Ctrl + N)
      if (modKey && e.key === 'n' && !e.shiftKey) {
        e.preventDefault();
        // Open pages panel if not already open
        if (!pagesPanel) {
          openPanel('pages');
        }
        // Start creating a new page
        startCreatingPage();
      }

      // Select All (Cmd/Ctrl + A) - could be implemented in the future
      // if (modKey && e.key === 'a') {
      //   e.preventDefault();
      //   // selectAll();
      // }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    deleteSelected,
    duplicateSelected,
    clearSelection,
    undo,
    redo,
    copyToClipboard,
    pasteFromClipboard,
    moveElementUp,
    moveElementDown,
    selectedElements,
    startCreatingPage,
    pagesPanel,
    openPanel,
  ]);
}

/**
 * Helper hook to detect modifier keys
 * Returns the current state of Ctrl/Cmd, Shift, Alt keys
 */
export function useModifierKeys() {
  const [modifiers, setModifiers] = React.useState({
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      setModifiers({
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      });
    };

    const handleKeyUp = (e) => {
      setModifiers({
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
      });
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return modifiers;
}
