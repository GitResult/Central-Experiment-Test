/**
 * TasksList Component
 * Kanban board view for tasks with status columns
 */

import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { useDataStore } from '../../store/dataStore';
import { useEditorStore } from '../../store/editorStore';
import { DynamicColumnLayout } from '../layout/DynamicColumnLayout';
import { theme } from '../../config/theme';

const PAGE_KEY = 'tasks-list';

const STATUS_COLUMNS = [
  { id: 'todo', label: 'To Do', color: theme.colors.text.tertiary },
  { id: 'in-progress', label: 'In Progress', color: theme.colors.primary[500] },
  { id: 'done', label: 'Done', color: theme.colors.success[500] }
];

const PRIORITY_COLORS = {
  low: theme.colors.text.tertiary,
  medium: theme.colors.warning[500],
  high: theme.colors.error[500]
};

export function TasksList() {
  const tasks = useDataStore((state) => state.tasks);
  const updateTask = useDataStore((state) => state.updateTask);
  const sidebarOpen = useEditorStore((state) => state.sidebarOpen);
  const ensurePage = useEditorStore((state) => state.ensurePage);
  const addElement = useEditorStore((state) => state.addElement);
  const tasksPage = useEditorStore((state) => state.pages[PAGE_KEY]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');

  // Ensure page exists
  useEffect(() => {
    ensurePage(PAGE_KEY, 'Tasks');
  }, [ensurePage]);

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

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    let filtered = tasks;

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(term) ||
        task.description?.toLowerCase().includes(term)
      );
    }

    // Apply priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority);
    }

    // Group by status
    const grouped = {
      'todo': [],
      'in-progress': [],
      'done': []
    };

    filtered.forEach(task => {
      if (grouped[task.status]) {
        grouped[task.status].push(task);
      }
    });

    return grouped;
  }, [tasks, searchTerm, filterPriority]);

  const totalTasks = tasks.length;
  const filteredCount = Object.values(tasksByStatus).reduce((sum, arr) => sum + arr.length, 0);

  // Get page settings
  const mainZone = tasksPage?.zones?.[0] || {};
  const firstRow = mainZone.rows?.[0] || {};
  const columnGap = firstRow.columnGap || 24;
  const elementsVerticalGap = firstRow.elementsVerticalGap || 16;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="max-w-7xl mx-auto p-6">
        {/* User-added elements */}
        <DynamicColumnLayout
          zoneId="main-content"
          rowIndex={0}
          pageKey={PAGE_KEY}
          columnGap={columnGap}
          elementsVerticalGap={elementsVerticalGap}
        />
      {/* Header */}
      <div className="mb-6">
        <h1
          className="font-bold mb-2"
          style={{
            fontSize: theme.typography.fontSize['3xl'],
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.bold
          }}
        >
          Tasks
        </h1>
        <p
          style={{
            fontSize: theme.typography.fontSize.base,
            color: theme.colors.text.secondary
          }}
        >
          {filteredCount} of {totalTasks} tasks
        </p>
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <div className="flex-1 min-w-64">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border.default,
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.primary
            }}
          />
        </div>

        {/* Filter by priority */}
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="px-4 py-2 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border.default,
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary
          }}
        >
          <option value="all">All Priorities</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STATUS_COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasksByStatus[column.id]}
            onUpdateTask={updateTask}
          />
        ))}
      </div>
      </div>
    </DndContext>
  );
}

// KanbanColumn subcomponent
function KanbanColumn({ column, tasks, onUpdateTask }) {
  return (
    <div>
      {/* Column Header */}
      <div
        className="rounded-lg p-3 mb-3 flex items-center justify-between"
        style={{
          backgroundColor: theme.colors.surface
        }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3
            className="font-semibold"
            style={{
              fontSize: theme.typography.fontSize.base,
              color: theme.colors.text.primary,
              fontWeight: theme.typography.fontWeight.semibold
            }}
          >
            {column.label}
          </h3>
        </div>
        <span
          className="px-2 py-1 rounded text-xs"
          style={{
            backgroundColor: theme.colors.background,
            color: theme.colors.text.tertiary,
            fontSize: theme.typography.fontSize.xs
          }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div
            className="text-center py-8 rounded-lg border border-dashed"
            style={{
              borderColor: theme.colors.border.default,
              color: theme.colors.text.tertiary
            }}
          >
            <p style={{ fontSize: theme.typography.fontSize.sm }}>
              No tasks
            </p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} onUpdateTask={onUpdateTask} />
          ))
        )}
      </div>
    </div>
  );
}

// TaskCard subcomponent
function TaskCard({ task, onUpdateTask }) {
  const priorityColor = PRIORITY_COLORS[task.priority] || theme.colors.text.tertiary;

  // Format due date
  const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  }) : null;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <Link to={`/tasks/${task.id}`}>
      <div
        className="rounded-lg border p-4 hover:shadow-md transition-shadow cursor-pointer"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border.default,
          borderRadius: theme.borderRadius.lg
        }}
      >
        {/* Title */}
        <h4
          className="font-medium mb-2"
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.primary,
            fontWeight: theme.typography.fontWeight.medium
          }}
        >
          {task.title}
        </h4>

        {/* Description */}
        {task.description && (
          <p
            className="mb-3 line-clamp-2"
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.secondary
            }}
          >
            {task.description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          {/* Priority badge */}
          <span
            className="px-2 py-1 rounded text-xs capitalize"
            style={{
              backgroundColor: `${priorityColor}20`,
              color: priorityColor,
              fontSize: theme.typography.fontSize.xs
            }}
          >
            {task.priority}
          </span>

          {/* Due date */}
          {dueDate && (
            <span
              className="text-xs"
              style={{
                fontSize: theme.typography.fontSize.xs,
                color: isOverdue ? theme.colors.error[500] : theme.colors.text.tertiary
              }}
            >
              {isOverdue ? '⚠️ ' : ''}
              {dueDate}
            </span>
          )}
        </div>

        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-xs"
                style={{
                  backgroundColor: theme.colors.surface,
                  color: theme.colors.text.secondary,
                  fontSize: theme.typography.fontSize.xs
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
