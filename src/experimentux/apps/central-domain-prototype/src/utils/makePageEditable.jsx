/**
 * Utility to quickly add editing capabilities to a page
 * This helps reduce boilerplate code across all page components
 */

import { useEffect } from 'react';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { useEditorStore } from '../store/editorStore';
import { DropZone } from '../components/editor/DropZone';
import { EditableElement } from '../components/editor/EditableElement';

/**
 * Hook to make a page editable
 * @param {string} pageKey - Unique key for the page
 * @param {string} pageName - Display name for the page
 * @returns {object} - { sidebarOpen, userElements, renderDropZone, renderUserElements, dndProps }
 */
export function useEditablePage(pageKey, pageName) {
  const sidebarOpen = useEditorStore((state) => state.sidebarOpen);
  const ensurePage = useEditorStore((state) => state.ensurePage);
  const addElement = useEditorStore((state) => state.addElement);
  const page = useEditorStore((state) => state.pages[pageKey]);

  // Ensure page exists
  useEffect(() => {
    ensurePage(pageKey, pageName);
  }, [ensurePage, pageKey, pageName]);

  // Configure sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    if (active.data.current?.type === 'palette-element') {
      const elementType = active.data.current.elementType;
      const elementSubtype = active.data.current.elementSubtype;
      const dropData = over.data.current;

      if (dropData) {
        const newElement = {
          type: elementType,
          subtype: elementSubtype,
          data: active.data.current.defaultData || {},
          settings: active.data.current.defaultSettings || {}
        };

        if (elementType === 'structure') {
          newElement.elements = active.data.current.elements || [];
        }

        addElement(dropData.zoneId, dropData.rowIndex, dropData.columnIndex, newElement, pageKey);
      }
    }
  };

  const userElements = page?.zones?.[0]?.rows?.[0]?.columns?.[0]?.elements || [];

  const renderDropZone = (zoneId = `${pageKey}-main`, compact = true) => {
    if (!sidebarOpen) return null;

    return (
      <DropZone
        zoneId={zoneId}
        rowIndex={0}
        columnIndex={0}
        compact={compact}
      />
    );
  };

  const renderUserElements = (zoneId = `${pageKey}-main`) => {
    if (!sidebarOpen || userElements.length === 0) return null;

    return userElements.map((element, idx) => (
      <EditableElement
        key={`user-${idx}`}
        element={element}
        path={{
          zoneId,
          rowIndex: 0,
          columnIndex: 0,
          elementIndex: idx
        }}
        pageKey={pageKey}
      />
    ));
  };

  const wrapWithDndContext = (children) => (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );

  return {
    sidebarOpen,
    userElements,
    renderDropZone,
    renderUserElements,
    wrapWithDndContext,
    dndProps: {
      sensors,
      collisionDetection: closestCenter,
      onDragEnd: handleDragEnd
    }
  };
}
