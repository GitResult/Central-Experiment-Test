/**
 * RecordSlideOut Component
 *
 * A slide-out panel that appears from the right side to display
 * a list of records for a selected category.
 */

import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '../../config/theme';
import { useListFilterStore } from '../../store/listFilterStore';

export function RecordSlideOut() {
  const { slideOutOpen, slideOutData, closeSlideOut } = useListFilterStore();

  return (
    <AnimatePresence>
      {slideOutOpen && slideOutData && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSlideOut}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0, 0, 0, 0.2)',
              backdropFilter: 'blur(2px)',
              zIndex: theme.zIndex.modalBackdrop
            }}
          />

          {/* Slide-out Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0.8 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 35
            }}
            style={{
              position: 'fixed',
              top: 0,
              right: 0,
              bottom: 0,
              width: '440px',
              maxWidth: '90vw',
              background: theme.colors.background.elevated,
              borderLeft: `1px solid ${theme.colors.border.default}`,
              boxShadow: '-16px 0 48px rgba(0, 0, 0, 0.08)',
              zIndex: theme.zIndex.modal,
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '20px 24px',
              borderBottom: `1px solid ${theme.colors.border.default}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: theme.colors.background.tertiary
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '3px',
                  background: slideOutData.itemColor || theme.colors.primary[500]
                }} />
                <div>
                  <h3 style={{
                    fontSize: theme.typography.fontSize.lg,
                    fontWeight: theme.typography.fontWeight.semibold,
                    color: theme.colors.text.primary,
                    margin: 0,
                    lineHeight: theme.typography.lineHeight.tight
                  }}>
                    {slideOutData.itemName}
                  </h3>
                  <span style={{
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.tertiary
                  }}>
                    {slideOutData.count} records
                  </span>
                </div>
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, background: theme.colors.neutral[200] }}
                whileTap={{ scale: 0.95 }}
                onClick={closeSlideOut}
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: theme.colors.neutral[100],
                  border: 'none',
                  borderRadius: theme.borderRadius.md,
                  cursor: 'pointer',
                  color: theme.colors.text.secondary,
                  fontSize: '16px'
                }}
              >
                ✕
              </motion.button>
            </div>

            {/* Search bar */}
            <div style={{
              padding: '16px 24px',
              borderBottom: `1px solid ${theme.colors.border.subtle}`
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                background: theme.colors.background.tertiary,
                borderRadius: theme.borderRadius.full
              }}>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.colors.text.tertiary}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Search records..."
                  style={{
                    flex: 1,
                    border: 'none',
                    background: 'transparent',
                    outline: 'none',
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.primary
                  }}
                />
              </div>
            </div>

            {/* Records list */}
            <div style={{
              flex: 1,
              overflow: 'auto',
              padding: '8px 12px'
            }}>
              {slideOutData.records.map((record, index) => (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 30,
                    delay: Math.min(index * 0.02, 0.3)
                  }}
                  whileHover={{
                    background: theme.colors.interactive.hover,
                    x: 2
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: theme.borderRadius.lg,
                    cursor: 'pointer',
                    marginBottom: '2px',
                    transition: `background ${theme.transitions.fast}`
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '6px'
                  }}>
                    <span style={{
                      fontSize: theme.typography.fontSize.sm,
                      fontWeight: theme.typography.fontWeight.medium,
                      color: theme.colors.text.primary
                    }}>
                      {record.name}
                    </span>
                    <span style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontFamily: theme.typography.fontFamily.mono,
                      color: theme.colors.text.tertiary,
                      background: theme.colors.neutral[100],
                      padding: '2px 6px',
                      borderRadius: theme.borderRadius.sm
                    }}>
                      {record.id}
                    </span>
                  </div>
                  <div style={{
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary,
                    marginBottom: '4px'
                  }}>
                    {record.email}
                  </div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: theme.typography.fontSize.xs,
                    color: theme.colors.text.tertiary
                  }}>
                    <span>{record.company}</span>
                    <span style={{
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: theme.colors.neutral[400]
                    }} />
                    <span>{new Date(record.registeredAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}</span>
                    <span style={{
                      width: '3px',
                      height: '3px',
                      borderRadius: '50%',
                      background: theme.colors.neutral[400]
                    }} />
                    <span style={{
                      color: record.status === 'confirmed'
                        ? theme.colors.success[500]
                        : theme.colors.warning[500],
                      fontWeight: theme.typography.fontWeight.medium
                    }}>
                      {record.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Footer */}
            <div style={{
              padding: '16px 24px',
              borderTop: `1px solid ${theme.colors.border.default}`,
              background: theme.colors.background.tertiary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{
                fontSize: theme.typography.fontSize.xs,
                color: theme.colors.text.tertiary
              }}>
                Showing {Math.min(slideOutData.records.length, 50)} of {slideOutData.count}
              </span>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '8px 16px',
                  background: theme.colors.primary[500],
                  color: theme.colors.text.inverse,
                  border: 'none',
                  borderRadius: theme.borderRadius.md,
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight: theme.typography.fontWeight.medium,
                  cursor: 'pointer'
                }}
              >
                Export All
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

RecordSlideOut.propTypes = {};
