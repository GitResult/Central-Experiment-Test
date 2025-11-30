/**
 * EditableElement Component
 * Renders an element with editing capabilities
 */

import { useEditorStore } from '../../store/editorStore';
import { useDraggable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
import { MarkupElement } from '../elements/markup/MarkupElement';
import { FieldElement } from '../elements/field/FieldElement';
import { StructureElement } from '../elements/structure/StructureElement';
import { QuickLinksPanel } from '../home/QuickLinksPanel';
import { UpcomingTasksPanel } from '../home/UpcomingTasksPanel';
import { WelcomeCard } from '../home/WelcomeCard';
import { JourneyCard } from '../home/JourneyCard';
import { InsightsCard } from '../home/InsightsCard';
import { SpotifyPlayer } from '../elements/SpotifyPlayer';
import { AnalogClock } from '../elements/AnalogClock';
import { theme } from '../../config/theme';
import PropTypes from 'prop-types';

export function EditableElement({ element, path, pageKey, verticalGap = 16 }) {
  const selectedElements = useEditorStore((state) => state.selectedElements);
  const selectElement = useEditorStore((state) => state.selectElement);
  const updateElement = useEditorStore((state) => state.updateElement);
  const mode = useEditorStore((state) => state.mode);

  const isSelected = selectedElements.some(
    sel =>
      sel.zoneId === path.zoneId &&
      sel.rowIndex === path.rowIndex &&
      sel.columnIndex === path.columnIndex &&
      sel.elementIndex === path.elementIndex
  );

  const handleSelect = (e) => {
    e.stopPropagation();
    selectElement(path);
  };

  const handleUpdate = (updates) => {
    updateElement(path, updates, pageKey);
  };

  // Make element draggable for reordering (only in edit mode)
  const { attributes, listeners, setNodeRef: setDragRef, isDragging } = useDraggable({
    id: `page-element-${path.zoneId}-${path.rowIndex}-${path.columnIndex}-${path.elementIndex}`,
    data: {
      type: 'page-element',
      element,
      path,
      pageKey
    },
    disabled: mode !== 'edit'
  });

  const renderElement = () => {
    const commonProps = {
      data: element.data || {},
      settings: element.settings || {}
    };

    switch (element.type) {
      case 'markup':
        return (
          <MarkupElement
            {...commonProps}
            isEditMode={mode === 'edit'}
            onChange={(newData) => handleUpdate({ data: newData })}
          />
        );
      case 'field':
        return (
          <FieldElement
            {...commonProps}
            onChange={(newData) => handleUpdate({ data: newData })}
          />
        );
      case 'structure':
        return (
          <StructureElement
            {...commonProps}
            elements={element.elements}
            renderElement={(el, idx) => (
              <EditableElement
                key={idx}
                element={el}
                path={{ ...path, elementIndex: idx }}
                pageKey={pageKey}
              />
            )}
          />
        );
      case 'quick-links':
        return <QuickLinksPanel />;
      case 'upcoming-tasks':
        return <UpcomingTasksPanel />;
      case 'welcome-card':
        return <WelcomeCard />;
      case 'journey-card':
        return <JourneyCard />;
      case 'insights-card':
        return <InsightsCard />;
      case 'spotify-player':
        return <SpotifyPlayer {...commonProps} />;
      case 'analog-clock':
        return <AnalogClock {...commonProps} />;
      default:
        return <div>Unknown element type: {element.type}</div>;
    }
  };

  return (
    <div
      ref={setDragRef}
      onClick={handleSelect}
      className="relative group"
      data-element-id={element.id}
      style={{
        outline: isSelected ? `2px solid ${theme.colors.primary[500]}` : 'none',
        outlineOffset: '2px',
        cursor: mode === 'edit' ? 'pointer' : 'default',
        padding: '4px',
        borderRadius: theme.borderRadius.sm,
        marginBottom: `${verticalGap}px`,
        opacity: isDragging ? 0.5 : 1
      }}
    >
      {/* Drag handle - only in edit mode, visible on hover at top-left */}
      {mode === 'edit' && (
        <div
          {...listeners}
          {...attributes}
          className="absolute opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
          style={{
            top: '4px',
            left: '4px',
            width: '28px',
            height: '28px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            border: `1px solid ${theme.colors.border.default}`,
            borderRadius: theme.borderRadius.md,
            boxShadow: theme.shadows.sm,
            zIndex: 10
          }}
          title="Drag to reorder"
        >
          <GripVertical size={14} strokeWidth={2} color={theme.colors.text.secondary} />
        </div>
      )}

      {renderElement()}

      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          border: `1px dashed ${theme.colors.primary[500]}`,
          borderRadius: theme.borderRadius.sm
        }}
      />
    </div>
  );
}

EditableElement.propTypes = {
  element: PropTypes.object.isRequired,
  path: PropTypes.shape({
    zoneId: PropTypes.string.isRequired,
    rowIndex: PropTypes.number.isRequired,
    columnIndex: PropTypes.number.isRequired,
    elementIndex: PropTypes.number.isRequired
  }).isRequired,
  pageKey: PropTypes.string,
  verticalGap: PropTypes.number
};
