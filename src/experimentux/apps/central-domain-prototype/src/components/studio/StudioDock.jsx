/**
 * Studio Dock Component
 * A floating action button that expands into tools:
 * - 4 vertical: Capture (with hover options), Options, Pages, Toolbelt
 * - 4 horizontal: Data Explorer, Insights in context, Reports, Timeline
 * - Capture defaults to quick capture, hover reveals options ellipse
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  FileText,
  Camera,
  Wrench,
  Compass,
  TrendingUp,
  FileBarChart,
  Clock,
  Aperture,
  MoreHorizontal
} from 'lucide-react';
import { useStudioDockStore } from '../../store/studioDockStore';
import { useSnapshotStore } from '../../store/snapshotStore';
import { theme } from '../../config/theme';
import { ToolbeltToolbar } from './ToolbeltToolbar';

// Tool configurations
const VERTICAL_TOOLS = [
  { id: 'snapshots', label: 'Capture', icon: Camera, description: 'Quick Capture' },
  { id: 'menu', label: 'Options', icon: SlidersHorizontal, description: 'Studio Options Bar' },
  { id: 'pages', label: 'Pages', icon: FileText, description: 'Pages panel' },
  { id: 'toolkit', label: 'Toolbelt', icon: Wrench, description: 'Toolbelt' }
];

const HORIZONTAL_TOOLS = [
  { id: 'explorer', label: 'Explorer', icon: Compass, description: 'Data Explorer' },
  { id: 'insights', label: 'Insights', icon: TrendingUp, description: 'Insights in context' },
  { id: 'reports', label: 'Reports', icon: FileBarChart, description: 'Reports' },
  { id: 'timeline', label: 'Timeline', icon: Clock, description: 'Timeline' }
];

// Shared button style
const getButtonStyle = () => ({
  backgroundColor: theme.colors.background.elevated,
  border: `1px solid ${theme.colors.border.default}`,
  boxShadow: theme.shadows.base,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer'
});

export function StudioDock() {
  const { isExpanded, toggleDock, closeDock, togglePanel, panels } = useStudioDockStore();
  const { startCapture } = useSnapshotStore();
  const dockRef = useRef(null);
  const [hoveredTool, setHoveredTool] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  // Shift dock right when pages panel is open
  const pagesPanelOpen = panels.pages;

  // Handle click outside to close dock
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dockRef.current && !dockRef.current.contains(event.target)) {
        if (isExpanded) {
          closeDock();
        }
        setIsHovered(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isExpanded, closeDock]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Cmd/Ctrl + Shift + D to toggle dock
      if ((event.metaKey || event.ctrlKey) && event.shiftKey && event.key === 'd') {
        event.preventDefault();
        toggleDock();
      }
      // Escape to close dock
      if (event.key === 'Escape' && isExpanded) {
        closeDock();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded, toggleDock, closeDock]);

  const handleToolClick = (toolId, event) => {
    event.stopPropagation();

    if (toolId === 'snapshots') {
      startCapture('region');
      closeDock();
      return;
    }

    if (toolId === 'toolkit') {
      togglePanel(toolId);
      closeDock();
      return;
    }

    if (toolId === 'menu') {
      togglePanel('studioOptionsBar');
      closeDock();
      return;
    }

    togglePanel(toolId);
    closeDock();
  };

  const handleOpenOptions = (event) => {
    event.stopPropagation();
    togglePanel('snapshots');
    closeDock();
    setHoveredTool(null);
  };

  // Simple: visible when hovered OR expanded, muted otherwise
  const isVisible = isHovered || isExpanded;

  return (
    <div
      ref={dockRef}
      className="fixed"
      style={{
        bottom: '24px',
        left: pagesPanelOpen ? '304px' : '24px', // Shift right when pages panel is open (280px panel + 24px margin)
        zIndex: 2100, // Higher than review mode overlay (2000) to ensure visibility
        // Apply opacity at container level - simple CSS transition
        opacity: isVisible ? 1 : 0.4,
        transition: 'opacity 150ms ease-out, left 300ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        // Only reset hover when dock is collapsed
        // When expanded, tools are positioned outside container bounds
        if (!isExpanded) {
          setIsHovered(false);
        }
      }}
    >
      {/* Vertical Tools - Positioned absolutely above FAB */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'absolute',
              bottom: '58px',
              left: '24px',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column-reverse',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {VERTICAL_TOOLS.map((tool, index) => {
              const Icon = tool.icon;
              const isSnapshots = tool.id === 'snapshots';
              const isToolHovered = hoveredTool === tool.id;

              return (
                <div
                  key={tool.id}
                  style={{ position: 'relative' }}
                  onMouseEnter={() => setHoveredTool(tool.id)}
                  onMouseLeave={() => setHoveredTool(null)}
                >
                  <motion.button
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{
                      type: 'spring',
                      stiffness: 500,
                      damping: 28,
                      delay: index * 0.05
                    }}
                    onClick={(e) => handleToolClick(tool.id, e)}
                    style={{
                      ...getButtonStyle(),
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%'
                    }}
                    whileHover={{
                      scale: 1.12,
                      backgroundColor: theme.colors.neutral[100],
                      boxShadow: theme.shadows.md,
                      rotate: 5
                    }}
                    whileTap={{ scale: 0.85, rotate: -5 }}
                    aria-label={tool.label}
                    title={tool.description}
                  >
                    <Icon size={18} strokeWidth={1.5} color={theme.colors.text.secondary} />
                  </motion.button>

                  {/* Tooltip - positioned above all icons for consistency */}
                  <AnimatePresence>
                    {isToolHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap"
                        style={{
                          backgroundColor: theme.colors.neutral[900],
                          color: theme.colors.text.inverse,
                          padding: '6px 12px',
                          borderRadius: theme.borderRadius.md,
                          fontSize: theme.typography.fontSize.sm,
                          fontWeight: theme.typography.fontWeight.medium,
                          boxShadow: theme.shadows.lg,
                          zIndex: 10
                        }}
                      >
                        {tool.label}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Options Button - Only for Snapshots tool */}
                  {isSnapshots && (
                    <AnimatePresence>
                      {isToolHovered && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                          onClick={handleOpenOptions}
                          whileHover={{
                            scale: 1.12,
                            backgroundColor: theme.colors.neutral[100]
                          }}
                          whileTap={{ scale: 0.85 }}
                          style={{
                            ...getButtonStyle(),
                            position: 'absolute',
                            left: '48px',
                            top: '4px',
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                            boxShadow: theme.shadows.sm
                          }}
                          aria-label="Snapshot Options"
                          title="More options"
                        >
                          <MoreHorizontal size={16} strokeWidth={1.5} color={theme.colors.text.secondary} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Container for FAB and Horizontal Tools */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Main FAB Button */}
        <motion.button
          animate={{
            scale: isExpanded ? 1.02 : 1,
            rotate: isExpanded ? 90 : 0
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={toggleDock}
          style={{
            ...getButtonStyle(),
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            border: `1px solid ${theme.colors.border.medium}`,
            boxShadow: isExpanded ? theme.shadows.lg : theme.shadows.md
          }}
          aria-label="Studio Dock"
          aria-expanded={isExpanded}
          title="Studio Dock (⌘⇧D)"
        >
          <motion.div
            animate={{
              rotate: isExpanded ? 180 : 0,
              scale: isExpanded ? 1.05 : 1
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Aperture
              size={20}
              strokeWidth={1.5}
              color={isExpanded ? theme.colors.primary[500] : theme.colors.text.secondary}
              style={{ transition: `color ${theme.transitions.base}` }}
            />
          </motion.div>
        </motion.button>

        {/* Horizontal Tools */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
            >
              {HORIZONTAL_TOOLS.map((tool, index) => {
                const Icon = tool.icon;
                const isToolHovered = hoveredTool === tool.id;
                const isToolActive = panels[tool.id];

                return (
                  <div
                    key={tool.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={() => setHoveredTool(tool.id)}
                    onMouseLeave={() => setHoveredTool(null)}
                  >
                    <motion.button
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, rotate: 180 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 28,
                        delay: index * 0.05
                      }}
                      onClick={(e) => handleToolClick(tool.id, e)}
                      style={{
                        ...getButtonStyle(),
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: isToolActive ? theme.colors.primary[50] : theme.colors.background.elevated,
                        borderColor: isToolActive ? theme.colors.primary[200] : theme.colors.border.default
                      }}
                      whileHover={{
                        scale: 1.12,
                        backgroundColor: isToolActive ? theme.colors.primary[100] : theme.colors.neutral[100],
                        boxShadow: theme.shadows.md,
                        y: -2
                      }}
                      whileTap={{ scale: 0.85, y: 0 }}
                      aria-label={tool.label}
                      title={tool.description}
                    >
                      <Icon size={18} strokeWidth={1.5} color={isToolActive ? theme.colors.primary[500] : theme.colors.text.secondary} />
                    </motion.button>

                    {/* Tooltip - positioned above to avoid bottom edge clipping */}
                    <AnimatePresence>
                      {isToolHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 pointer-events-none whitespace-nowrap"
                          style={{
                            backgroundColor: theme.colors.neutral[900],
                            color: theme.colors.text.inverse,
                            padding: '6px 12px',
                            borderRadius: theme.borderRadius.md,
                            fontSize: theme.typography.fontSize.sm,
                            fontWeight: theme.typography.fontWeight.medium,
                            boxShadow: theme.shadows.lg
                          }}
                        >
                          {tool.label}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Keyboard shortcut hint */}
      <AnimatePresence>
        {!isExpanded && isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ delay: 0.5 }}
            className="absolute left-full ml-3 bottom-0 pointer-events-none whitespace-nowrap"
            style={{
              backgroundColor: theme.colors.neutral[900],
              color: theme.colors.text.inverse,
              padding: '6px 12px',
              borderRadius: theme.borderRadius.md,
              fontSize: theme.typography.fontSize.xs,
              fontWeight: theme.typography.fontWeight.medium,
              boxShadow: theme.shadows.lg
            }}
          >
            ⌘⇧D
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toolbelt Floating Toolbar */}
      <ToolbeltToolbar />
    </div>
  );
}
