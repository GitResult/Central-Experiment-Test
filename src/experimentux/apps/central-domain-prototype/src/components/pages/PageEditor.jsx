/**
 * PageEditor Component
 * Main page editor with drag-and-drop functionality
 */

import { useEffect } from 'react';
import { useEditorStore } from '../../store/editorStore';
import { EditorCanvas } from '../editor/EditorCanvas';
import { theme } from '../../config/theme';

export function PageEditor() {
  const createNewPage = useEditorStore((state) => state.createNewPage);
  const mode = useEditorStore((state) => state.mode);
  const toggleMode = useEditorStore((state) => state.toggleMode);
  const canUndo = useEditorStore((state) => state.canUndo);
  const canRedo = useEditorStore((state) => state.canRedo);
  const undo = useEditorStore((state) => state.undo);
  const redo = useEditorStore((state) => state.redo);
  const currentPage = useEditorStore((state) => state.currentPage);

  useEffect(() => {
    // Initialize with a new page
    createNewPage();
  }, [createNewPage]);

  const handleSave = () => {
    // In a real app, this would save to a backend
    const pageJson = JSON.stringify(currentPage, null, 2);
    console.log('Saving page:', pageJson);

    // Download as JSON file for now
    const blob = new Blob([pageJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentPage.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Page saved! JSON file downloaded.');
  };

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 56px)' }}>
      {/* Toolbar - hidden in preview mode */}
      {mode === 'edit' && (
        <div
          className="flex items-center justify-between px-6 py-3 border-b"
          style={{
            backgroundColor: theme.colors.background.primary,
            borderColor: theme.colors.border.default
          }}
        >
          <div className="flex items-center gap-4">
            <h1
              className="font-semibold"
              style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary
              }}
            >
              Page Editor
            </h1>

            <div className="flex items-center gap-2">
              <button
                onClick={undo}
                disabled={!canUndo()}
                className="px-3 py-1 rounded transition-colors"
                style={{
                  backgroundColor: canUndo() ? theme.colors.surface : theme.colors.surface,
                  color: canUndo() ? theme.colors.text.primary : theme.colors.text.tertiary,
                  fontSize: theme.typography.fontSize.sm,
                  cursor: canUndo() ? 'pointer' : 'not-allowed',
                  opacity: canUndo() ? 1 : 0.5
                }}
              >
                ↶ Undo
              </button>
              <button
                onClick={redo}
                disabled={!canRedo()}
                className="px-3 py-1 rounded transition-colors"
                style={{
                  backgroundColor: canRedo() ? theme.colors.surface : theme.colors.surface,
                  color: canRedo() ? theme.colors.text.primary : theme.colors.text.tertiary,
                  fontSize: theme.typography.fontSize.sm,
                  cursor: canRedo() ? 'pointer' : 'not-allowed',
                  opacity: canRedo() ? 1 : 0.5
                }}
              >
                ↷ Redo
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMode}
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: theme.colors.surface,
                color: theme.colors.text.primary,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium
              }}
            >
              {mode === 'edit' ? '👁️ Preview' : '✏️ Edit'}
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded transition-colors"
              style={{
                backgroundColor: theme.colors.primary[500],
                color: theme.colors.text.inverse,
                fontSize: theme.typography.fontSize.sm,
                fontWeight: theme.typography.fontWeight.medium
              }}
            >
              💾 Save
            </button>
          </div>
        </div>
      )}

      {/* Preview Mode Toggle Button - floating in preview mode */}
      {mode === 'preview' && (
        <div
          style={{
            position: 'fixed',
            top: '72px',
            right: '24px',
            zIndex: 1000,
          }}
        >
          <button
            onClick={toggleMode}
            className="px-4 py-2 rounded-lg shadow-lg transition-all hover:shadow-xl"
            style={{
              backgroundColor: theme.colors.primary[500],
              color: theme.colors.text.inverse,
              fontSize: theme.typography.fontSize.sm,
              fontWeight: theme.typography.fontWeight.medium,
              border: `2px solid ${theme.colors.primary[700]}`,
            }}
          >
            ✏️ Exit Preview
          </button>
        </div>
      )}

      {/* Editor Layout */}
      <div className="flex-1 flex overflow-hidden">
        <EditorCanvas />
      </div>
    </div>
  );
}
