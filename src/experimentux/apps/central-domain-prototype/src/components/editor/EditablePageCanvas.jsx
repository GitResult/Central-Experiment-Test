/**
 * EditablePageCanvas Component
 * Reusable canvas for any editable page with full drag-and-drop support
 * Works with any page from editorStore
 */

import { memo, useCallback } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { useEditorStore } from '../../store/editorStore';
import { theme } from '../../config/theme';
import { MarkupElement } from '../elements/markup/MarkupElement';
import { FieldElement } from '../elements/field/FieldElement';
import { StructureElement } from '../elements/structure/StructureElement';

const CanvasElement = memo(function CanvasElement({ element, path, isSelected, onSelect, onUpdate, isPreviewMode }) {
  const renderElement = () => {
    const commonProps = {
      data: element.data || {},
      settings: element.settings || {}
    };

    switch (element.type) {
      case 'markup':
        return <MarkupElement {...commonProps} />;
      case 'field':
        return (
          <FieldElement
            {...commonProps}
            onChange={(newData) => onUpdate(path, { data: newData })}
          />
        );
      case 'structure':
        return (
          <StructureElement
            {...commonProps}
            elements={element.elements}
            renderElement={(el, idx) => (
              <CanvasElement
                key={idx}
                element={el}
                path={{ ...path, elementIndex: idx }}
                isSelected={false}
                onSelect={onSelect}
                onUpdate={onUpdate}
                isPreviewMode={isPreviewMode}
              />
            )}
          />
        );
      default:
        return <div>Unknown element type: {element.type}</div>;
    }
  };

  return (
    <div
      onClick={(e) => {
        if (!isPreviewMode) {
          e.stopPropagation();
          onSelect(path);
        }
      }}
      className={isPreviewMode ? '' : 'relative group'}
      style={{
        outline: !isPreviewMode && isSelected ? `2px solid ${theme.colors.primary[500]}` : 'none',
        outlineOffset: '2px',
        cursor: isPreviewMode ? 'default' : 'pointer',
        padding: isPreviewMode ? '0' : '4px',
        borderRadius: theme.borderRadius.sm
      }}
    >
      {renderElement()}

      {/* Hover overlay - only in edit mode */}
      {!isPreviewMode && (
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
          style={{
            border: `1px dashed ${theme.colors.primary[500]}`,
            borderRadius: theme.borderRadius.sm
          }}
        />
      )}
    </div>
  );
});

const DropZone = memo(function DropZone({ zoneId, rowIndex, columnIndex }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `dropzone-${zoneId}-${rowIndex}-${columnIndex}`,
    data: { zoneId, rowIndex, columnIndex }
  });

  return (
    <div
      ref={setNodeRef}
      className="rounded-lg border-2 border-dashed p-8 text-center transition-all"
      style={{
        borderColor: isOver ? theme.colors.primary[500] : theme.colors.border.default,
        backgroundColor: isOver ? `${theme.colors.primary[500]}10` : 'transparent',
        minHeight: '120px'
      }}
    >
      <div
        style={{
          color: theme.colors.text.tertiary,
          fontSize: theme.typography.fontSize.sm
        }}
      >
        {isOver ? 'Drop element here' : 'Drop elements here to start building'}
      </div>
    </div>
  );
});

export function EditablePageCanvas({ pageKey, showTitle = true, containerClassName = 'max-w-7xl' }) {
  // Get page-specific data from store
  const page = useEditorStore((state) => state.pages[pageKey] || state.currentPage);
  const selectedElement = useEditorStore((state) => state.selectedElement);
  const selectElement = useEditorStore((state) => state.selectElement);
  const updateElement = useEditorStore((state) => state.updateElement);
  const clearSelection = useEditorStore((state) => state.clearSelection);
  const updatePageMetadata = useEditorStore((state) => state.updatePageMetadata);
  const mode = useEditorStore((state) => state.mode);

  // Memoized handlers to prevent child re-renders
  const handleSelect = useCallback((path) => {
    selectElement(path);
  }, [selectElement]);

  const handleUpdate = useCallback((path, updates) => {
    updateElement(path, updates);
  }, [updateElement]);

  const mainZone = page?.zones?.[0] || { id: 'main-content', rows: [] };
  const isPreviewMode = mode === 'preview';

  if (!page) {
    return <div>Loading page...</div>;
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-6"
      onClick={(e) => {
        if (!isPreviewMode && e.target === e.currentTarget) {
          clearSelection();
        }
      }}
      style={{
        backgroundColor: theme.colors.background.secondary
      }}
    >
      {/* Page Header */}
      {showTitle && (
        <div className={`${containerClassName} mx-auto mb-6`}>
          {isPreviewMode ? (
            <h1
              className="text-3xl font-bold"
              style={{
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.bold
              }}
            >
              {page.name}
            </h1>
          ) : (
            <input
              type="text"
              value={page.name}
              onChange={(e) => {
                updatePageMetadata({ name: e.target.value }, pageKey);
              }}
              className="text-3xl font-bold w-full bg-transparent border-none outline-none"
              style={{
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.bold
              }}
              placeholder="Page Title"
            />
          )}
        </div>
      )}

      {/* Canvas */}
      <div className={`${containerClassName} mx-auto`}>
        {mainZone.rows.length === 0 ? (
          !isPreviewMode && <DropZone zoneId={mainZone.id} rowIndex={0} columnIndex={0} />
        ) : (
          <div className="space-y-4">
            {mainZone.rows.map((row, rowIndex) => (
              <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: '1fr' }}>
                {row.columns.map((column, columnIndex) => (
                  <div key={columnIndex}>
                    {column.elements && column.elements.length > 0 ? (
                      <div className="space-y-4">
                        {column.elements.map((element, elementIndex) => {
                          const path = {
                            zoneId: mainZone.id,
                            rowIndex,
                            columnIndex,
                            elementIndex
                          };
                          const isSelected =
                            selectedElement &&
                            selectedElement.zoneId === path.zoneId &&
                            selectedElement.rowIndex === path.rowIndex &&
                            selectedElement.columnIndex === path.columnIndex &&
                            selectedElement.elementIndex === path.elementIndex;

                          return (
                            <CanvasElement
                              key={elementIndex}
                              element={element}
                              path={path}
                              isSelected={isSelected}
                              onSelect={handleSelect}
                              onUpdate={handleUpdate}
                              isPreviewMode={isPreviewMode}
                            />
                          );
                        })}
                        {!isPreviewMode && (
                          <DropZone
                            zoneId={mainZone.id}
                            rowIndex={rowIndex}
                            columnIndex={columnIndex}
                          />
                        )}
                      </div>
                    ) : (
                      !isPreviewMode && (
                        <DropZone
                          zoneId={mainZone.id}
                          rowIndex={rowIndex}
                          columnIndex={columnIndex}
                        />
                      )
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
