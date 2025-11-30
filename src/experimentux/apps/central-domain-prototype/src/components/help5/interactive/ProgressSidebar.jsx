/**
 * ProgressSidebar
 * Section tracking sidebar for interactive guides
 */

import PropTypes from 'prop-types';
import { CheckCircle2, Circle, Loader } from 'lucide-react';
import { theme } from '../../../config/theme';

export function ProgressSidebar({ sections, currentSection, progress }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: theme.spacing[6],
        right: theme.spacing[6],
        width: '280px',
        backgroundColor: theme.colors.background.elevated,
        border: `1px solid ${theme.colors.border.default}`,
        borderRadius: theme.borderRadius.lg,
        boxShadow: theme.shadows.xl,
        overflow: 'hidden',
        zIndex: theme.zIndex.modal + 5
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: theme.spacing[4],
          borderBottom: `1px solid ${theme.colors.border.default}`,
          backgroundColor: theme.colors.background.secondary
        }}
      >
        <h3
          style={{
            fontSize: theme.typography.fontSize.base,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            margin: 0,
            marginBottom: theme.spacing[2]
          }}
        >
          Progress
        </h3>

        {/* Progress Bar */}
        <div
          style={{
            height: '6px',
            backgroundColor: theme.colors.background.tertiary,
            borderRadius: theme.borderRadius.full,
            overflow: 'hidden',
            marginTop: theme.spacing[2]
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: theme.colors.primary[500],
              transition: `width ${theme.transitions.base}`
            }}
          />
        </div>

        <div
          style={{
            fontSize: theme.typography.fontSize.xs,
            color: theme.colors.text.secondary,
            marginTop: theme.spacing[1],
            textAlign: 'right'
          }}
        >
          {Math.round(progress)}% Complete
        </div>
      </div>

      {/* Sections List */}
      <div
        style={{
          padding: theme.spacing[3],
          maxHeight: '500px',
          overflowY: 'auto'
        }}
      >
        {sections.map((section, sectionIndex) => {
          const isActive = currentSection?.id === section.id;
          const allItemsCompleted = section.items?.every(item => item.completed) || false;
          const someItemsCompleted = section.items?.some(item => item.completed) || false;

          return (
            <div
              key={section.id}
              style={{
                marginBottom: theme.spacing[4]
              }}
            >
              {/* Section Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: theme.spacing[2],
                  marginBottom: theme.spacing[2]
                }}
              >
                {/* Status Icon */}
                {allItemsCompleted ? (
                  <CheckCircle2
                    size={18}
                    color={theme.colors.success[500]}
                  />
                ) : isActive ? (
                  <Loader
                    size={18}
                    color={theme.colors.primary[500]}
                    style={{ animation: 'spin 2s linear infinite' }}
                  />
                ) : (
                  <Circle
                    size={18}
                    color={someItemsCompleted ? theme.colors.primary[300] : theme.colors.neutral[400]}
                  />
                )}

                {/* Section Title */}
                <span
                  style={{
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: isActive ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
                    color: isActive
                      ? theme.colors.primary[600]
                      : allItemsCompleted
                      ? theme.colors.success[600]
                      : theme.colors.text.primary
                  }}
                >
                  {sectionIndex + 1}. {section.title}
                </span>
              </div>

              {/* Section Items */}
              {section.items && section.items.length > 0 && (
                <div
                  style={{
                    marginLeft: theme.spacing[6],
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing[1]
                  }}
                >
                  {section.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: theme.spacing[2],
                        padding: theme.spacing[1],
                        borderRadius: theme.borderRadius.sm,
                        backgroundColor: item.completed
                          ? theme.colors.success[50]
                          : 'transparent'
                      }}
                    >
                      {/* Item Checkbox */}
                      <div
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: theme.borderRadius.sm,
                          border: item.completed
                            ? 'none'
                            : `2px solid ${theme.colors.neutral[400]}`,
                          backgroundColor: item.completed
                            ? theme.colors.success[500]
                            : 'transparent',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}
                      >
                        {item.completed && (
                          <svg
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                          >
                            <path
                              d="M1 4L3.5 6.5L9 1"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>

                      {/* Item Label */}
                      <span
                        style={{
                          fontSize: theme.typography.fontSize.xs,
                          color: item.completed
                            ? theme.colors.success[700]
                            : theme.colors.text.secondary,
                          textDecoration: item.completed ? 'line-through' : 'none'
                        }}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

ProgressSidebar.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      title: PropTypes.string.isRequired,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          completed: PropTypes.bool
        })
      )
    })
  ),
  currentSection: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string
  }),
  progress: PropTypes.number
};

ProgressSidebar.defaultProps = {
  sections: [],
  currentSection: null,
  progress: 0
};

export default ProgressSidebar;
