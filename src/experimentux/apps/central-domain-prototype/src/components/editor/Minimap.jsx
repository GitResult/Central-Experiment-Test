/**
 * Minimap Component
 * Shows a bird's-eye view of the page during drag operations
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditorStore } from '../../store/editorStore';
import { theme } from '../../config/theme';

export function Minimap({ containerRef }) {
  const isDragging = useEditorStore((state) => state.isDragging);
  const mode = useEditorStore((state) => state.mode);
  const [viewportRect, setViewportRect] = useState(null);
  const [contentRect, setContentRect] = useState(null);
  const minimapRef = useRef(null);

  // Only show during drag in edit mode
  const isVisible = isDragging && mode === 'edit';

  // Calculate viewport and content positions
  useEffect(() => {
    if (!isVisible || !containerRef?.current) return;

    const updateRects = () => {
      const container = containerRef.current;
      if (!container) return;

      // Get the scrollable content area
      const scrollParent = container.closest('[style*="overflow"]') || document.documentElement;

      const contentHeight = container.scrollHeight;
      const contentWidth = container.scrollWidth;
      const viewportHeight = scrollParent.clientHeight;
      const viewportWidth = scrollParent.clientWidth;
      const scrollTop = scrollParent.scrollTop;
      const scrollLeft = scrollParent.scrollLeft;

      setContentRect({ width: contentWidth, height: contentHeight });
      setViewportRect({
        top: scrollTop,
        left: scrollLeft,
        width: viewportWidth,
        height: viewportHeight
      });
    };

    updateRects();
    const interval = setInterval(updateRects, 100);
    window.addEventListener('scroll', updateRects, true);
    window.addEventListener('resize', updateRects);

    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', updateRects, true);
      window.removeEventListener('resize', updateRects);
    };
  }, [isVisible, containerRef]);

  // Calculate minimap scale
  const minimapWidth = 120;
  const minimapHeight = 160;
  const scale = contentRect
    ? Math.min(minimapWidth / contentRect.width, minimapHeight / contentRect.height)
    : 0.1;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={minimapRef}
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          exit={{ opacity: 0, scale: 0.9, x: 20 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '24px',
            width: `${minimapWidth}px`,
            height: `${minimapHeight}px`,
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderRadius: theme.borderRadius.lg,
            boxShadow: theme.shadows.elevated,
            border: `1px solid ${theme.colors.border.default}`,
            overflow: 'hidden',
            zIndex: 1001,
            padding: '8px'
          }}
        >
          {/* Label */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '8px',
              fontSize: '9px',
              fontWeight: theme.typography.fontWeight.medium,
              color: theme.colors.text.tertiary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontFamily: theme.typography.fontFamily.sans
            }}
          >
            Page Overview
          </div>

          {/* Content representation */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: 'calc(100% - 16px)',
              marginTop: '16px',
              backgroundColor: theme.colors.background.secondary,
              borderRadius: theme.borderRadius.sm,
              overflow: 'hidden'
            }}
          >
            {/* Page content blocks (simplified representation) */}
            <div
              style={{
                position: 'absolute',
                top: '10%',
                left: '10%',
                width: '80%',
                height: '15%',
                backgroundColor: theme.colors.primary[100],
                borderRadius: '2px'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '30%',
                left: '10%',
                width: '50%',
                height: '25%',
                backgroundColor: theme.colors.primary[100],
                borderRadius: '2px'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '30%',
                left: '65%',
                width: '25%',
                height: '25%',
                backgroundColor: theme.colors.primary[100],
                borderRadius: '2px'
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '60%',
                left: '10%',
                width: '80%',
                height: '20%',
                backgroundColor: theme.colors.primary[100],
                borderRadius: '2px'
              }}
            />

            {/* Viewport indicator */}
            {viewportRect && contentRect && (
              <motion.div
                animate={{
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                style={{
                  position: 'absolute',
                  top: `${(viewportRect.top / contentRect.height) * 100}%`,
                  left: `${(viewportRect.left / contentRect.width) * 100}%`,
                  width: `${(viewportRect.width / contentRect.width) * 100}%`,
                  height: `${(viewportRect.height / contentRect.height) * 100}%`,
                  border: `2px solid ${theme.colors.primary[500]}`,
                  backgroundColor: 'rgba(59, 130, 246, 0.1)',
                  borderRadius: '2px',
                  pointerEvents: 'none'
                }}
              />
            )}

            {/* Drop target indicator */}
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
              style={{
                position: 'absolute',
                top: '45%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: theme.colors.primary[500],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'white'
                }}
              />
            </motion.div>
          </div>

          {/* Instructions */}
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '0',
              right: '0',
              textAlign: 'center',
              fontSize: '8px',
              color: theme.colors.text.tertiary,
              fontFamily: theme.typography.fontFamily.sans
            }}
          >
            Drop on any zone
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
