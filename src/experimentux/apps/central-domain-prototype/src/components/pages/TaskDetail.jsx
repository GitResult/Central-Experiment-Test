/**
 * TaskDetail Component
 * Full task view with inline editing
 */

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { useDataStore } from '../../store/dataStore';
import { useEditorStore } from '../../store/editorStore';
import { ElementWrapper } from '../editor/ElementWrapper';
import { DynamicColumnLayout } from '../layout/DynamicColumnLayout';
import { theme } from '../../config/theme';

const PAGE_KEY_PREFIX = 'task-detail-';

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

export function TaskDetail() {
  const { id } = useParams();
  const task = useDataStore((state) => state.getTaskById(id));
  const updateTask = useDataStore((state) => state.updateTask);
  const addRecentlyViewed = useDataStore((state) => state.addRecentlyViewed);
  const sidebarOpen = useEditorStore((state) => state.sidebarOpen);
  const ensurePage = useEditorStore((state) => state.ensurePage);
  const addElement = useEditorStore((state) => state.addElement);

  const PAGE_KEY = `${PAGE_KEY_PREFIX}${id}`;
  const taskPage = useEditorStore((state) => state.pages[PAGE_KEY]);

  const [editedTask, setEditedTask] = useState(task);

  // Ensure page exists
  useEffect(() => {
    if (task) {
      ensurePage(PAGE_KEY, `Task: ${task.title}`);
    }
  }, [task, ensurePage, PAGE_KEY]);

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

    // Check if dropping a palette element
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

        addElement(dropData.zoneId, dropData.rowIndex, dropData.columnIndex, newElement, PAGE_KEY);
      }
    }
  };

  // Track as recently viewed
  useEffect(() => {
    if (task) {
      addRecentlyViewed({
        type: 'task',
        id: task.id,
        name: task.title
      });
    }
  }, [task, addRecentlyViewed]);

  // Update local state when task changes
  useEffect(() => {
    if (task) {
      setEditedTask(task);
    }
  }, [task]);

  if (!task) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <p style={{ color: theme.colors.text.secondary }}>Task not found</p>
        <Link to="/tasks" style={{ color: theme.colors.primary }}>
          Back to Tasks
        </Link>
      </div>
    );
  }

  const handleUpdate = (field, value) => {
    const updated = { ...editedTask, [field]: value };
    setEditedTask(updated);
    updateTask(id, { [field]: value });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return theme.colors.error[500];
      case 'medium':
        return theme.colors.warning[500];
      case 'low':
        return theme.colors.text.tertiary;
      default:
        return theme.colors.text.tertiary;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'done':
        return theme.colors.success[500];
      case 'in-progress':
        return theme.colors.primary[500];
      default:
        return theme.colors.text.tertiary;
    }
  };

  // Get page settings
  const mainZone = taskPage?.zones?.[0] || {};
  const firstRow = mainZone.rows?.[0] || {};
  const columnGap = firstRow.columnGap || 24;
  const elementsVerticalGap = firstRow.elementsVerticalGap || 16;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-4xl mx-auto p-6">
        {/* Back button */}
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 mb-4 hover:opacity-70 transition-opacity"
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.secondary
          }}
        >
          <span>←</span> Back to Tasks
        </Link>

        {/* Main content */}
        {sidebarOpen ? (
          <>
            {/* User-added elements before main content */}
            <DynamicColumnLayout
              zoneId="main-content"
              rowIndex={0}
              pageKey={PAGE_KEY}
              columnGap={columnGap}
              elementsVerticalGap={elementsVerticalGap}
            />

            <ElementWrapper elementPath={{ zoneId: 'task-detail', rowIndex: 0, columnIndex: 0, elementIndex: 0 }}>
              <div
                className="rounded-lg border p-6"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border.default,
                  borderRadius: theme.borderRadius.lg
                }}
              >
        {/* Title */}
        <div className="mb-6">
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) => handleUpdate('title', e.target.value)}
            className="w-full font-bold border-0 border-b-2 px-0 py-2 focus:outline-none transition-colors"
            style={{
              fontSize: theme.typography.fontSize['2xl'],
              color: theme.colors.text.primary,
              fontWeight: theme.typography.fontWeight.bold,
              borderColor: 'transparent',
              borderBottomColor: theme.colors.border.subtle
            }}
            onFocus={(e) => e.target.style.borderBottomColor = theme.colors.primary}
            onBlur={(e) => e.target.style.borderBottomColor = theme.colors.border.subtle}
          />
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {/* Status */}
          <div>
            <label
              className="block text-xs mb-2"
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary
              }}
            >
              Status
            </label>
            <select
              value={editedTask.status}
              onChange={(e) => handleUpdate('status', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border.default,
                fontSize: theme.typography.fontSize.sm,
                color: getStatusColor(editedTask.status)
              }}
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div>
            <label
              className="block text-xs mb-2"
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary
              }}
            >
              Priority
            </label>
            <select
              value={editedTask.priority}
              onChange={(e) => handleUpdate('priority', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border.default,
                fontSize: theme.typography.fontSize.sm,
                color: getPriorityColor(editedTask.priority)
              }}
            >
              {PRIORITY_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Due date */}
          <div>
            <label
              className="block text-xs mb-2"
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary
              }}
            >
              Due Date
            </label>
            <input
              type="date"
              value={editedTask.dueDate || ''}
              onChange={(e) => handleUpdate('dueDate', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border.default,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary
              }}
            />
          </div>

          {/* Assignee */}
          <div>
            <label
              className="block text-xs mb-2"
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary
              }}
            >
              Assignee
            </label>
            <input
              type="text"
              value={editedTask.assignee || ''}
              onChange={(e) => handleUpdate('assignee', e.target.value)}
              className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border.default,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary
              }}
            />
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <label
            className="block text-xs mb-2"
            style={{
              fontSize: theme.typography.fontSize.xs,
              color: theme.colors.text.tertiary
            }}
          >
            Description
          </label>
          <textarea
            value={editedTask.description || ''}
            onChange={(e) => handleUpdate('description', e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border.default,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary
            }}
            placeholder="Add a description..."
          />
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div>
            <label
              className="block text-xs mb-2"
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary
              }}
            >
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded"
                  style={{
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text.secondary,
                    fontSize: theme.typography.fontSize.sm
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

            {/* Footer info */}
            <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.colors.border.default }}>
              <p
                className="text-xs"
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary
                }}
              >
                Created on {new Date(task.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </p>
            </div>
              </div>
            </ElementWrapper>
          </>
        ) : (
        <div
          className="rounded-lg border p-6"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border.default,
            borderRadius: theme.borderRadius.lg
          }}
        >
          {/* Title */}
          <div className="mb-6">
            <input
              type="text"
              value={editedTask.title}
              onChange={(e) => handleUpdate('title', e.target.value)}
              className="w-full font-bold border-0 border-b-2 px-0 py-2 focus:outline-none transition-colors"
              style={{
                fontSize: theme.typography.fontSize['2xl'],
                color: theme.colors.text.primary,
                fontWeight: theme.typography.fontWeight.bold,
                borderColor: 'transparent',
                borderBottomColor: theme.colors.border.subtle
              }}
              onFocus={(e) => e.target.style.borderBottomColor = theme.colors.primary}
              onBlur={(e) => e.target.style.borderBottomColor = theme.colors.border.subtle}
            />
          </div>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Status */}
            <div>
              <label
                className="block text-xs mb-2"
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary
                }}
              >
                Status
              </label>
              <select
                value={editedTask.status}
                onChange={(e) => handleUpdate('status', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border.default,
                  fontSize: theme.typography.fontSize.sm,
                  color: getStatusColor(editedTask.status)
                }}
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
            <div>
              <label
                className="block text-xs mb-2"
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary
                }}
              >
                Priority
              </label>
              <select
                value={editedTask.priority}
                onChange={(e) => handleUpdate('priority', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border.default,
                  fontSize: theme.typography.fontSize.sm,
                  color: getPriorityColor(editedTask.priority)
                }}
              >
                {PRIORITY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due date */}
            <div>
              <label
                className="block text-xs mb-2"
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary
                }}
              >
                Due Date
              </label>
              <input
                type="date"
                value={editedTask.dueDate || ''}
                onChange={(e) => handleUpdate('dueDate', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border.default,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.primary
                }}
              />
            </div>

            {/* Assignee */}
            <div>
              <label
                className="block text-xs mb-2"
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary
                }}
              >
                Assignee
              </label>
              <input
                type="text"
                value={editedTask.assignee || ''}
                onChange={(e) => handleUpdate('assignee', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  backgroundColor: theme.colors.background,
                  borderColor: theme.colors.border.default,
                  fontSize: theme.typography.fontSize.sm,
                  color: theme.colors.text.primary
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label
              className="block text-xs mb-2"
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary
              }}
            >
              Description
            </label>
            <textarea
              value={editedTask.description || ''}
              onChange={(e) => handleUpdate('description', e.target.value)}
              rows={6}
              className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              style={{
                backgroundColor: theme.colors.background,
                borderColor: theme.colors.border.default,
                fontSize: theme.typography.fontSize.sm,
                color: theme.colors.text.primary
              }}
              placeholder="Add a description..."
            />
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <label
                className="block text-xs mb-2"
                style={{
                  fontSize: theme.typography.fontSize.xs,
                  color: theme.colors.text.tertiary
                }}
              >
                Tags
              </label>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded"
                    style={{
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text.secondary,
                      fontSize: theme.typography.fontSize.sm
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer info */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: theme.colors.border.default }}>
            <p
              className="text-xs"
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary
              }}
            >
              Created on {new Date(task.createdAt || Date.now()).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric'
              })}
            </p>
          </div>
        </div>
      )}
      </div>
    </DndContext>
  );
}
