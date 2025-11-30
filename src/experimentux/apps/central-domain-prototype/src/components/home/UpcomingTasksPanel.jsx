/**
 * UpcomingTasksPanel - Apple-inspired task list
 */

import { motion } from 'framer-motion';
import { Clock, Circle, CheckCircle2 } from 'lucide-react';
import { theme } from '../../config/theme';

export function UpcomingTasksPanel() {
  const tasks = [
    { id: 1, title: 'Introduce yourself', duration: '2 min', badge: 'Start here', completed: false },
    { id: 2, title: 'Meet your team', duration: '2 min', completed: false },
    { id: 3, title: 'Invite a colleague', duration: '1 min', completed: false }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      style={{
        background: theme.colors.background.primary,
        borderRadius: theme.borderRadius.xl,
        boxShadow: theme.shadows.elevated,
        padding: theme.components.card.padding.md
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3
          style={{
            fontSize: theme.typography.fontSize.md,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary
          }}
        >
          Upcoming Tasks
        </h3>
        <span
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.tertiary,
            fontWeight: theme.typography.fontWeight.medium
          }}
        >
          {tasks.length} tasks
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {tasks.map((task, index) => (
          <div key={task.id}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              whileHover={{ x: 4 }}
              className="group"
              style={{
                display: 'flex',
                alignItems: 'start',
                gap: theme.spacing[3],
                padding: `${theme.spacing[3]} 0`,
                background: 'transparent',
                cursor: 'pointer',
                transition: `all ${theme.transitions.base}`
              }}
            >
              <div style={{ flexShrink: 0, marginTop: '2px' }}>
                {task.completed ? (
                  <CheckCircle2 size={20} style={{ color: theme.colors.success[500], strokeWidth: 2 }} />
                ) : (
                  <Circle size={20} style={{ color: theme.colors.border.strong, strokeWidth: 2 }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    style={{
                      fontSize: theme.typography.fontSize.base,
                      color: theme.colors.text.primary,
                      fontWeight: theme.typography.fontWeight.normal
                    }}
                  >
                    {task.title}
                  </span>
                  {task.badge && (
                    <span
                      style={{
                        background: theme.colors.success[50],
                        color: theme.colors.success[600],
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: theme.typography.fontWeight.semibold,
                        padding: '2px 8px',
                        borderRadius: theme.borderRadius.sm
                      }}
                    >
                      {task.badge}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1" style={{ color: theme.colors.text.tertiary }}>
                  <Clock size={12} style={{ strokeWidth: 2 }} />
                  <span
                    style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.medium
                    }}
                  >
                    {task.duration}
                  </span>
                </div>
              </div>
            </motion.div>
            {index < tasks.length - 1 && (
              <div
                style={{
                  height: '1px',
                  background: theme.colors.border.default,
                  marginLeft: `calc(20px + ${theme.spacing[3]})`
                }}
              />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
