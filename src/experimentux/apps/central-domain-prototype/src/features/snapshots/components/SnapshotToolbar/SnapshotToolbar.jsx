/**
 * SnapshotToolbar
 * Floating toolbar with capture options and recent snapshots filmstrip
 * iPhone Camera-inspired design
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, X, Image as ImageIcon, Maximize2, Pen } from 'lucide-react';
import { theme } from '../../../../config/theme';
import { useSnapshotStore } from '../../../../store/snapshotStore';

export function SnapshotToolbar({ isOpen, onClose }) {
  const { snapshots, startCapture, selectSnapshot } = useSnapshotStore();
  const [selectedMode, setSelectedMode] = useState('quick');

  // Get recent 5 snapshots for filmstrip
  const recentSnapshots = snapshots.slice(0, 5);

  // Handle ESC key to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle capture trigger
  const handleCapture = (mode = 'region') => {
    startCapture(mode);
    onClose(); // Close toolbar when entering capture mode
  };

  // Handle snapshot thumbnail click
  const handleSnapshotClick = (snapshot) => {
    selectSnapshot(snapshot);
    window.location.href = `/snapshots/${snapshot.id}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 9998,
            }}
          />

          {/* Floating Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{
              type: 'spring',
              stiffness: 500,
              damping: 30,
            }}
            style={{
              position: 'fixed',
              bottom: '100px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: theme.colors.background.elevated,
              borderRadius: '20px',
              padding: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
              border: `1px solid ${theme.colors.border.default}`,
              zIndex: 9999,
              minWidth: '400px',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}>
              <h3 style={{
                fontSize: theme.typography.fontSize.lg,
                fontWeight: theme.typography.fontWeight.semibold,
                color: theme.colors.text.primary,
                margin: 0,
              }}>
                Snapshots
              </h3>

              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: theme.colors.text.secondary,
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '6px',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = theme.colors.background.secondary}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={18} />
              </button>
            </div>

            {/* Capture Mode Buttons */}
            <div style={{
              display: 'flex',
              gap: '8px',
              marginBottom: '16px',
            }}>
              <CaptureButton
                icon={Camera}
                label="Quick Capture"
                description="Cmd+Shift+S"
                isSelected={selectedMode === 'quick'}
                onClick={() => {
                  setSelectedMode('quick');
                  handleCapture('region');
                }}
              />

              <CaptureButton
                icon={Pen}
                label="Pre-Markup"
                description="Annotate before capture"
                isSelected={selectedMode === 'pre-markup'}
                onClick={() => {
                  setSelectedMode('pre-markup');
                  handleCapture('pre-markup');
                }}
              />

              <CaptureButton
                icon={Maximize2}
                label="Full Screen"
                description="Capture entire screen"
                isSelected={selectedMode === 'fullscreen'}
                onClick={() => {
                  setSelectedMode('fullscreen');
                  handleCapture('region');
                }}
              />
            </div>

            {/* Filmstrip - Recent Snapshots */}
            {recentSnapshots.length > 0 && (
              <>
                <div style={{
                  fontSize: theme.typography.fontSize.xs,
                  fontWeight: theme.typography.fontWeight.medium,
                  color: theme.colors.text.secondary,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  Recent
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  overflowX: 'auto',
                  paddingBottom: '4px',
                }}>
                  {recentSnapshots.map((snapshot, index) => (
                    <SnapshotThumbnail
                      key={snapshot.id}
                      snapshot={snapshot}
                      index={index}
                      onClick={() => handleSnapshotClick(snapshot)}
                    />
                  ))}

                  {/* View All Button */}
                  <button
                    onClick={() => window.location.href = '/snapshots'}
                    style={{
                      minWidth: '64px',
                      height: '64px',
                      borderRadius: '8px',
                      border: `2px dashed ${theme.colors.border.default}`,
                      backgroundColor: theme.colors.background.secondary,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.primary[500];
                      e.currentTarget.style.backgroundColor = theme.colors.primary[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = theme.colors.border.default;
                      e.currentTarget.style.backgroundColor = theme.colors.background.secondary;
                    }}
                  >
                    <ImageIcon size={20} color={theme.colors.text.tertiary} />
                    <span style={{
                      fontSize: theme.typography.fontSize.xs,
                      color: theme.colors.text.tertiary,
                    }}>
                      View All
                    </span>
                  </button>
                </div>
              </>
            )}

            {/* Empty State */}
            {recentSnapshots.length === 0 && (
              <div style={{
                padding: '24px',
                textAlign: 'center',
                color: theme.colors.text.tertiary,
                fontSize: theme.typography.fontSize.sm,
              }}>
                <Camera size={32} style={{ margin: '0 auto', marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ margin: 0 }}>No snapshots yet</p>
                <p style={{ margin: '4px 0 0 0', fontSize: theme.typography.fontSize.xs }}>
                  Click Quick Capture to get started
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

SnapshotToolbar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

// Capture Button Component
function CaptureButton({ icon: Icon, label, description, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1,
        padding: '12px',
        borderRadius: '12px',
        border: `2px solid ${isSelected ? '#0066FF' : theme.colors.border.default}`,
        backgroundColor: isSelected ? 'rgba(0, 102, 255, 0.1)' : theme.colors.background.primary,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
      onMouseEnter={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = '#0066FF';
          e.currentTarget.style.backgroundColor = 'rgba(0, 102, 255, 0.05)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isSelected) {
          e.currentTarget.style.borderColor = theme.colors.border.default;
          e.currentTarget.style.backgroundColor = theme.colors.background.primary;
        }
      }}
    >
      <Icon size={20} color={isSelected ? '#0066FF' : theme.colors.text.secondary} />
      <span style={{
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.medium,
        color: isSelected ? '#0066FF' : theme.colors.text.primary,
      }}>
        {label}
      </span>
      <span style={{
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.text.tertiary,
      }}>
        {description}
      </span>
    </button>
  );
}

CaptureButton.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

// Snapshot Thumbnail Component
function SnapshotThumbnail({ snapshot, index, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      style={{
        minWidth: '64px',
        width: '64px',
        height: '64px',
        borderRadius: '8px',
        overflow: 'hidden',
        border: `2px solid ${theme.colors.border.default}`,
        cursor: 'pointer',
        padding: 0,
        background: 'none',
        transition: 'all 0.2s',
      }}
      whileHover={{
        scale: 1.05,
        borderColor: '#0066FF',
        boxShadow: '0 4px 12px rgba(0, 102, 255, 0.2)',
      }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={snapshot.thumbnailUrl}
        alt={`Snapshot ${index + 1}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </motion.button>
  );
}

SnapshotThumbnail.propTypes = {
  snapshot: PropTypes.shape({
    id: PropTypes.string.isRequired,
    thumbnailUrl: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};
