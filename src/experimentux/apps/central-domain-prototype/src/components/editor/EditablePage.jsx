/**
 * EditablePage Wrapper Component
 * Provides DndContext and drag handling for any editable page
 * Wrap any page component with this to enable full editing
 */

import PropTypes from 'prop-types';
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useEditorStore } from '../../store/editorStore';
import { EditablePageCanvas } from './EditablePageCanvas';

export function EditablePage({
  pageKey,
  showTitle = true,
  containerClassName = 'max-w-7xl',
  children
}) {
  const addElement = useEditorStore((state) => state.addElement);
  const mode = useEditorStore((state) => state.mode);

  // Configure sensors for drag detection
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating drag
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;

    // Handle dropping new element from palette
    if (active.data.current?.type === 'palette-element') {
      const elementType = active.data.current.elementType;
      const elementSubtype = active.data.current.elementSubtype;
      const dropData = over.data.current;

      if (dropData) {
        const newElement = createNewElement(elementType, elementSubtype);
        addElement(
          dropData.zoneId,
          dropData.rowIndex,
          dropData.columnIndex,
          newElement,
          pageKey
        );
      }
    }
  };

  // In preview mode, render children without edit UI
  if (mode === 'preview' && children) {
    return children;
  }

  // In edit mode, render the editable canvas
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      {children || (
        <EditablePageCanvas
          pageKey={pageKey}
          showTitle={showTitle}
          containerClassName={containerClassName}
        />
      )}
    </DndContext>
  );
}

EditablePage.propTypes = {
  pageKey: PropTypes.string.isRequired,
  showTitle: PropTypes.bool,
  containerClassName: PropTypes.string,
  children: PropTypes.node
};

/**
 * Create a new element based on type and subtype
 */
function createNewElement(type, subtype) {
  const baseElement = {
    id: `element-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    subtype,
    data: {},
    settings: {}
  };

  // Set default data based on element type
  switch (type) {
    case 'markup':
      switch (subtype) {
        case 'text':
          baseElement.data = {
            content: 'New Text Element',
            variant: 'body'
          };
          break;
        case 'button':
          baseElement.data = {
            label: 'Click Me',
            variant: 'primary',
            size: 'medium'
          };
          break;
        case 'link':
          baseElement.data = {
            text: 'Link Text',
            url: '#',
            external: false
          };
          break;
        case 'image':
          baseElement.data = {
            src: 'https://via.placeholder.com/400x300',
            alt: 'Placeholder image',
            width: '100%'
          };
          break;
        case 'divider':
          baseElement.data = {
            thickness: 1,
            color: 'border'
          };
          break;
      }
      break;

    case 'field':
      switch (subtype) {
        case 'input':
          baseElement.data = {
            label: 'Input Field',
            placeholder: 'Enter text...',
            required: false
          };
          break;
        case 'textarea':
          baseElement.data = {
            label: 'Text Area',
            placeholder: 'Enter text...',
            rows: 4
          };
          break;
        case 'checkbox':
          baseElement.data = {
            label: 'Checkbox',
            checked: false
          };
          break;
        case 'radio':
          baseElement.data = {
            label: 'Radio Group',
            options: ['Option 1', 'Option 2', 'Option 3']
          };
          break;
        case 'select':
          baseElement.data = {
            label: 'Select',
            options: ['Option 1', 'Option 2', 'Option 3'],
            placeholder: 'Choose an option'
          };
          break;
        case 'date':
          baseElement.data = {
            label: 'Date',
            placeholder: 'Select date'
          };
          break;
      }
      break;

    case 'structure':
      switch (subtype) {
        case 'container':
          baseElement.data = {
            padding: 'medium'
          };
          baseElement.elements = [];
          break;
        case 'card':
          baseElement.data = {
            title: 'Card Title',
            padding: 'medium'
          };
          baseElement.elements = [];
          break;
        case 'tabs':
          baseElement.data = {
            tabs: [
              { id: 'tab1', label: 'Tab 1' },
              { id: 'tab2', label: 'Tab 2' }
            ],
            activeTab: 'tab1'
          };
          baseElement.elements = [];
          break;
        case 'accordion':
          baseElement.data = {
            items: [
              { id: 'item1', label: 'Section 1', open: false },
              { id: 'item2', label: 'Section 2', open: false }
            ]
          };
          baseElement.elements = [];
          break;
      }
      break;

    case 'record':
      switch (subtype) {
        case 'contact-card':
          baseElement.data = {
            name: 'Contact Name',
            role: 'Role',
            company: 'Company'
          };
          break;
        case 'task-card':
          baseElement.data = {
            title: 'Task Title',
            status: 'pending',
            priority: 'medium'
          };
          break;
        case 'data-list':
          baseElement.data = {
            items: []
          };
          break;
      }
      break;
  }

  return baseElement;
}
