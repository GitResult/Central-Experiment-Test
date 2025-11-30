/**
 * Toolbelt Toolbar Component
 * A floating, draggable toolbar with tools: Discuss, Interaction Modes, Rules, Sticky Notes
 * Snaps to edges when dragged near them
 */

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  MousePointer2,
  Scale,
  StickyNote,
  GripVertical,
  GripHorizontal
} from 'lucide-react';
import { useStudioDockStore } from '../../store/studioDockStore';
import { theme } from '../../config/theme';
import { InteractionModesMenu, ALL_MODES } from './InteractionModesMenu';

// Toolbar tools configuration
const TOOLBELT_TOOLS = [
  { id: 'discuss', label: 'Discuss', icon: MessageCircle, description: 'Start a discussion' },
  { id: 'interaction-modes', label: 'Interaction Modes', icon: MousePointer2, description: 'Change interaction mode' },
  { id: 'rules', label: 'Rules', icon: Scale, description: 'View and manage rules' },
  { id: 'sticky-notes', label: 'Sticky Notes', icon: StickyNote, description: 'Add sticky notes' }
];

// Edge snap threshold in pixels
const SNAP_THRESHOLD = 40;
const EDGE_MARGIN = 16;

export function ToolbeltToolbar() {
  const { panels } = useStudioDockStore();
  const isOpen = panels.toolkit;

  const toolbarRef = useRef(null);
  const [position, setPosition] = useState({ x: null, y: null }); // null means use default
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [snappedEdge, setSnappedEdge] = useState('right'); // 'left', 'right', 'top', 'bottom', or null
  const [activeTool, setActiveTool] = useState(null);
  const [orientation, setOrientation] = useState('vertical'); // 'vertical' or 'horizontal' - persists when floating
  const [snapPreview, setSnapPreview] = useState(null); // Shows which edge will be snapped to during drag

  // Interaction modes state
  const [modesMenuOpen, setModesMenuOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('balanced');
  const [modesExpanded, setModesExpanded] = useState(false);
  const modeButtonRef = useRef(null);
  const [modeButtonPosition, setModeButtonPosition] = useState({ x: 0, y: 0 });
  const [hoveredTool, setHoveredTool] = useState(null);

  // Orientation based on explicit state (not just snapped edge)
  const isHorizontal = orientation === 'horizontal';

  // Toolbar dimensions (icon-only mode)
  const TOOLBAR_WIDTH_VERTICAL = 56;
  const TOOLBAR_HEIGHT_VERTICAL = TOOLBELT_TOOLS.length * 44 + 26; // 44px per tool + header
  const TOOLBAR_WIDTH_HORIZONTAL = TOOLBELT_TOOLS.length * 44 + 26; // 44px per tool + handle
  const TOOLBAR_HEIGHT_HORIZONTAL = 56;

  // Current dimensions based on orientation
  const toolbarWidth = isHorizontal ? TOOLBAR_WIDTH_HORIZONTAL : TOOLBAR_WIDTH_VERTICAL;
  const toolbarHeight = isHorizontal ? TOOLBAR_HEIGHT_HORIZONTAL : TOOLBAR_HEIGHT_VERTICAL;

  // Initialize position on first render
  useEffect(() => {
    if (isOpen && position.x === null) {
      // Default to right edge, vertically centered
      const windowHeight = window.innerHeight;
      setPosition({
        x: window.innerWidth - TOOLBAR_WIDTH_VERTICAL - EDGE_MARGIN,
        y: (windowHeight - TOOLBAR_HEIGHT_VERTICAL) / 2
      });
      setSnappedEdge('right');
    }
  }, [isOpen, position.x]);

  // Handle mouse down on drag handle
  const handleMouseDown = useCallback((e) => {
    if (!toolbarRef.current) return;

    const rect = toolbarRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setIsDragging(true);
    setSnappedEdge(null); // Unsnap while dragging
  }, []);

  // Handle mouse move during drag
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      setPosition({ x: newX, y: newY });

      // Calculate snap preview while dragging
      if (toolbarRef.current) {
        const rect = toolbarRef.current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const distToRight = windowWidth - rect.right;
        const distToLeft = rect.left;
        const distToTop = rect.top;
        const distToBottom = windowHeight - rect.bottom;

        const minDist = Math.min(distToRight, distToLeft, distToTop, distToBottom);

        if (minDist < SNAP_THRESHOLD) {
          if (minDist === distToTop) {
            setSnapPreview('top');
          } else if (minDist === distToBottom) {
            setSnapPreview('bottom');
          } else if (minDist === distToRight) {
            setSnapPreview('right');
          } else if (minDist === distToLeft) {
            setSnapPreview('left');
          }
        } else {
          setSnapPreview(null);
        }
      }
    };

    const handleMouseUp = (e) => {
      setIsDragging(false);
      setSnapPreview(null); // Clear preview on release

      if (!toolbarRef.current) return;

      const rect = toolbarRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      // Check for edge snapping - prioritize the edge closest to the cursor
      let snapped = null;
      let finalX = position.x;
      let finalY = position.y;

      // Calculate distances to each edge
      const distToRight = windowWidth - rect.right;
      const distToLeft = rect.left;
      const distToTop = rect.top;
      const distToBottom = windowHeight - rect.bottom;

      // Find the closest edge within threshold
      const minDist = Math.min(distToRight, distToLeft, distToTop, distToBottom);

      if (minDist < SNAP_THRESHOLD) {
        if (minDist === distToTop) {
          snapped = 'top';
        } else if (minDist === distToBottom) {
          snapped = 'bottom';
        } else if (minDist === distToRight) {
          snapped = 'right';
        } else if (minDist === distToLeft) {
          snapped = 'left';
        }
      }

      // Determine new orientation - only change when snapping to an edge
      // Keep current orientation when floating (not snapped)
      let newOrientation = orientation;
      if (snapped === 'top' || snapped === 'bottom') {
        newOrientation = 'horizontal';
      } else if (snapped === 'left' || snapped === 'right') {
        newOrientation = 'vertical';
      }
      // If not snapped, keep current orientation

      // Calculate dimensions based on new orientation
      const willBeHorizontal = newOrientation === 'horizontal';
      const newWidth = willBeHorizontal ? TOOLBAR_WIDTH_HORIZONTAL : TOOLBAR_WIDTH_VERTICAL;
      const newHeight = willBeHorizontal ? TOOLBAR_HEIGHT_HORIZONTAL : TOOLBAR_HEIGHT_VERTICAL;

      // Adjust position based on new orientation and snapped edge
      if (snapped === 'right') {
        finalX = windowWidth - newWidth - EDGE_MARGIN;
        // Center vertically at current position
        finalY = Math.max(EDGE_MARGIN, Math.min(rect.top, windowHeight - newHeight - EDGE_MARGIN));
      } else if (snapped === 'left') {
        finalX = EDGE_MARGIN;
        finalY = Math.max(EDGE_MARGIN, Math.min(rect.top, windowHeight - newHeight - EDGE_MARGIN));
      } else if (snapped === 'top') {
        finalY = EDGE_MARGIN;
        // Center horizontally at current position
        finalX = Math.max(EDGE_MARGIN, Math.min(rect.left, windowWidth - newWidth - EDGE_MARGIN));
      } else if (snapped === 'bottom') {
        finalY = windowHeight - newHeight - EDGE_MARGIN;
        finalX = Math.max(EDGE_MARGIN, Math.min(rect.left, windowWidth - newWidth - EDGE_MARGIN));
      } else {
        // Not snapped - ensure toolbar stays within viewport with current dimensions
        finalX = Math.max(EDGE_MARGIN, Math.min(finalX, windowWidth - newWidth - EDGE_MARGIN));
        finalY = Math.max(EDGE_MARGIN, Math.min(finalY, windowHeight - newHeight - EDGE_MARGIN));
      }

      setPosition({ x: finalX, y: finalY });
      setSnappedEdge(snapped);
      setOrientation(newOrientation);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, position]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!toolbarRef.current || position.x === null) return;

      const rect = toolbarRef.current.getBoundingClientRect();
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let newX = position.x;
      let newY = position.y;

      // Keep toolbar within bounds
      if (snappedEdge === 'right') {
        newX = windowWidth - rect.width - EDGE_MARGIN;
      } else {
        newX = Math.min(newX, windowWidth - rect.width - EDGE_MARGIN);
      }

      newY = Math.min(newY, windowHeight - rect.height - EDGE_MARGIN);

      setPosition({ x: newX, y: newY });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position, snappedEdge]);

  const handleToolClick = (toolId, event) => {
    if (toolId === 'interaction-modes') {
      // Calculate button position for the popover menu
      if (modeButtonRef.current) {
        const rect = modeButtonRef.current.getBoundingClientRect();
        setModeButtonPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      }
      setModesMenuOpen(!modesMenuOpen);
      return;
    }

    setActiveTool(activeTool === toolId ? null : toolId);
  };

  const handleModeSelect = (modeId) => {
    setCurrentMode(modeId);
  };

  const handleToggleModesExpand = () => {
    setModesExpanded(!modesExpanded);
    setModesMenuOpen(false); // Close the arc menu when expanding inline
  };

  // Get the current mode icon for display in toolbelt
  const getCurrentModeIcon = () => {
    const mode = ALL_MODES.find(m => m.id === currentMode);
    return mode ? mode.icon : MousePointer2;
  };

  // Get snap preview indicator styles
  const getSnapPreviewStyles = () => {
    if (!snapPreview) return {};

    const baseStyles = {
      position: 'fixed',
      zIndex: theme.zIndex.modal - 1,
      background: `linear-gradient(${
        snapPreview === 'top' ? '180deg' :
        snapPreview === 'bottom' ? '0deg' :
        snapPreview === 'left' ? '90deg' : '270deg'
      }, ${theme.colors.primary[400]}40, transparent)`,
      pointerEvents: 'none'
    };

    if (snapPreview === 'top') {
      return { ...baseStyles, top: 0, left: 0, right: 0, height: '60px' };
    } else if (snapPreview === 'bottom') {
      return { ...baseStyles, bottom: 0, left: 0, right: 0, height: '60px' };
    } else if (snapPreview === 'left') {
      return { ...baseStyles, top: 0, bottom: 0, left: 0, width: '60px' };
    } else if (snapPreview === 'right') {
      return { ...baseStyles, top: 0, bottom: 0, right: 0, width: '60px' };
    }
    return {};
  };

  return (
    <>
      {/* Snap Preview Indicator - shows on screen edge while dragging */}
      <AnimatePresence>
        {isDragging && snapPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            style={getSnapPreviewStyles()}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={toolbarRef}
            initial={{ opacity: 0, scale: 0.9, x: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            x: 0,
            transition: {
              type: 'spring',
              stiffness: 400,
              damping: 30
            }
          }}
          exit={{
            opacity: 0,
            scale: 0.9,
            x: 20,
            transition: { duration: 0.15 }
          }}
          style={{
            position: 'fixed',
            left: position.x ?? 'auto',
            top: position.y ?? '50%',
            right: position.x === null ? EDGE_MARGIN : 'auto',
            transform: position.x === null ? 'translateY(-50%)' : 'none',
            zIndex: theme.zIndex.modal,
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            background: theme.colors.background.elevated,
            borderRadius: theme.borderRadius.xl,
            border: `1px solid ${theme.colors.border.default}`,
            boxShadow: isDragging ? theme.shadows.xl : theme.shadows.lg,
            overflow: 'hidden',
            cursor: isDragging ? 'grabbing' : 'default',
            userSelect: 'none'
          }}
        >
          {/* Drag Handle */}
          <div
            onMouseDown={handleMouseDown}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRight: isHorizontal ? `1px solid ${theme.colors.border.subtle}` : 'none',
              borderBottom: isHorizontal ? 'none' : `1px solid ${theme.colors.border.subtle}`,
              cursor: isDragging ? 'grabbing' : 'grab',
              background: theme.colors.background.tertiary
            }}
          >
            {isHorizontal ? (
              <GripHorizontal size={14} style={{ color: theme.colors.text.tertiary }} />
            ) : (
              <GripVertical size={14} style={{ color: theme.colors.text.tertiary }} />
            )}
          </div>

          {/* Tools */}
          <div style={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            padding: '8px',
            gap: '4px'
          }}>
            {TOOLBELT_TOOLS.map((tool) => {
              const isInteractionModes = tool.id === 'interaction-modes';
              // Show current mode icon for interaction-modes button
              const Icon = isInteractionModes ? getCurrentModeIcon() : tool.icon;
              const isActive = activeTool === tool.id || (isInteractionModes && modesMenuOpen);

              // Determine tooltip position based on snapped edge and orientation
              const getTooltipStyle = () => {
                if (snappedEdge === 'top') {
                  return {
                    top: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  };
                } else if (snappedEdge === 'bottom') {
                  return {
                    bottom: 'calc(100% + 8px)',
                    left: '50%',
                    transform: 'translateX(-50%)'
                  };
                } else if (snappedEdge === 'left') {
                  return {
                    left: 'calc(100% + 8px)',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  };
                } else if (snappedEdge === 'right') {
                  return {
                    right: 'calc(100% + 8px)',
                    top: '50%',
                    transform: 'translateY(-50%)'
                  };
                } else {
                  // Floating - position based on current orientation
                  if (isHorizontal) {
                    return {
                      bottom: 'calc(100% + 8px)',
                      left: '50%',
                      transform: 'translateX(-50%)'
                    };
                  } else {
                    return {
                      right: 'calc(100% + 8px)',
                      top: '50%',
                      transform: 'translateY(-50%)'
                    };
                  }
                }
              };

              const isHovered = hoveredTool === tool.id;
              const showTooltip = isHovered && !(isInteractionModes && modesMenuOpen);

              return (
                <div key={tool.id} style={{ position: 'relative' }}>
                  <motion.button
                    ref={isInteractionModes ? modeButtonRef : undefined}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => handleToolClick(tool.id, e)}
                    onMouseEnter={() => setHoveredTool(tool.id)}
                    onMouseLeave={() => setHoveredTool(null)}
                    style={{
                      position: 'relative',
                      width: '40px',
                      height: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isHovered
                        ? (isActive ? theme.colors.primary[100] : theme.colors.interactive.hover)
                        : (isActive ? theme.colors.primary[50] : 'rgba(0,0,0,0)'),
                      border: isInteractionModes && modesMenuOpen ? `2px solid ${theme.colors.primary[400]}` : 'none',
                      borderRadius: theme.borderRadius.lg,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      color: isActive ? theme.colors.primary[600] : theme.colors.text.secondary
                    }}
                  >
                    <Icon size={20} strokeWidth={1.5} />
                  </motion.button>

                  {/* Tooltip */}
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        style={{
                          position: 'absolute',
                          ...getTooltipStyle(),
                          backgroundColor: theme.colors.neutral[900],
                          color: theme.colors.text.inverse,
                          padding: '6px 10px',
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.medium,
                          boxShadow: theme.shadows.lg,
                          pointerEvents: 'none',
                          whiteSpace: 'nowrap',
                          zIndex: theme.zIndex.tooltip
                        }}
                      >
                        {tool.label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Interaction modes popover - render inside button container */}
                  {isInteractionModes && (
                    <InteractionModesMenu
                      isOpen={modesMenuOpen && !modesExpanded}
                      onClose={() => setModesMenuOpen(false)}
                      onSelectMode={handleModeSelect}
                      currentMode={currentMode}
                      snappedEdge={snappedEdge}
                      isHorizontal={isHorizontal}
                      anchorPosition={modeButtonPosition}
                      isExpanded={false}
                      onToggleExpand={handleToggleModesExpand}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Inline expanded modes */}
          <AnimatePresence>
            {modesExpanded && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 'auto', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  borderTop: isHorizontal ? 'none' : `1px solid ${theme.colors.border.subtle}`,
                  borderLeft: isHorizontal ? `1px solid ${theme.colors.border.subtle}` : 'none',
                  overflow: 'hidden'
                }}
              >
                <InteractionModesMenu
                  isOpen={false}
                  onClose={() => {}}
                  onSelectMode={handleModeSelect}
                  currentMode={currentMode}
                  snappedEdge={snappedEdge}
                  isHorizontal={isHorizontal}
                  anchorPosition={modeButtonPosition}
                  isExpanded={true}
                  onToggleExpand={handleToggleModesExpand}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Edge indicator when snapped */}
          {snappedEdge && !isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                position: 'absolute',
                [snappedEdge]: 0,
                [snappedEdge === 'left' || snappedEdge === 'right' ? 'top' : 'left']: 0,
                [snappedEdge === 'left' || snappedEdge === 'right' ? 'bottom' : 'right']: 0,
                width: snappedEdge === 'left' || snappedEdge === 'right' ? '3px' : '100%',
                height: snappedEdge === 'top' || snappedEdge === 'bottom' ? '3px' : '100%',
                background: theme.colors.primary[400],
                borderRadius: theme.borderRadius.full
              }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
