/**
 * Studio Options Bar Component
 * A 40px bar at the top that provides access to studio options.
 * Features:
 * - Menu icon for mega menu
 * - Workspace views (3 icons + vertical ellipse for remaining 9)
 * - Interaction modes split button
 * - Contextual View options (center)
 * - Undo/Redo/Status segment
 * - Publish split button
 */

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  MousePointer2,
  Undo2,
  Redo2,
  Upload,
  Eye,
  Save,
  Share2,
  Layout,
  Database,
  Palette,
  Zap,
  CheckSquare,
  Calendar,
  Compass,
  Terminal,
  GitCompare,
  Network,
  Layers3,
  Film,
  Users,
  BarChart3,
  MessageCircle,
  Pencil,
  Filter,
  Target,
  HelpCircle,
  Camera,
  Clock,
  ChevronRight,
  Globe,
  User,
  CalendarDays,
  Monitor,
  X
} from 'lucide-react';
import { theme } from '../../config/theme';
import { useStudioDockStore } from '../../store/studioDockStore';

// Workspace view configurations
const WORKSPACE_VIEWS = [
  { id: 'data', label: 'Data', icon: Database, visible: true },
  { id: 'design', label: 'Design', icon: Palette, visible: true },
  { id: 'actions', label: 'Actions', icon: Zap, visible: true },
  // Hidden views (accessible via ellipse)
  { id: 'task', label: 'Task', icon: CheckSquare, visible: false },
  { id: 'calendar', label: 'Calendar', icon: Calendar, visible: false },
  { id: 'blueprint', label: 'Blueprint', icon: Compass, visible: false },
  { id: 'command', label: 'Command', icon: Terminal, visible: false },
  { id: 'compare', label: 'Compare', icon: GitCompare, visible: false },
  { id: 'relationship', label: 'Relationship', icon: Network, visible: false },
  { id: 'depth', label: 'DEPTH', icon: Layers3, visible: false },
  { id: 'media', label: 'Media', icon: Film, visible: false },
  { id: 'collaborate', label: 'Collaborate', icon: Users, visible: false }
];

// Interaction mode configurations
const INTERACTION_MODES = [
  { id: 'select', label: 'Select', icon: MousePointer2, isDefault: true },
  { id: 'chart', label: 'Chart', icon: BarChart3 },
  { id: 'design', label: 'Design', icon: Palette },
  { id: 'discussion', label: 'Discussion', icon: MessageCircle },
  { id: 'edit', label: 'Edit', icon: Pencil },
  { id: 'filter', label: 'Filter', icon: Filter },
  { id: 'focus', label: 'Focus', icon: Target },
  { id: 'help', label: 'Help', icon: HelpCircle },
  { id: 'snapshot', label: 'Snapshot', icon: Camera },
  { id: 'timeline', label: 'Timeline', icon: Clock },
  { id: 'view', label: 'View', icon: Eye }
];

// Mega menu sections
const MEGA_MENU_SECTIONS = [
  {
    title: 'File',
    items: [
      { label: 'New', shortcut: '⌘N' },
      { label: 'Open', shortcut: '⌘O' },
      { label: 'Save', shortcut: '⌘S' },
      { label: 'Save As...', shortcut: '⌘⇧S' },
      { label: 'Export', shortcut: '⌘E' }
    ]
  },
  {
    title: 'Edit',
    items: [
      { label: 'Undo', shortcut: '⌘Z' },
      { label: 'Redo', shortcut: '⌘⇧Z' },
      { label: 'Cut', shortcut: '⌘X' },
      { label: 'Copy', shortcut: '⌘C' },
      { label: 'Paste', shortcut: '⌘V' }
    ]
  },
  {
    title: 'View',
    items: [
      { label: 'Zoom In', shortcut: '⌘+' },
      { label: 'Zoom Out', shortcut: '⌘-' },
      { label: 'Fit to Screen', shortcut: '⌘0' },
      { label: 'Toggle Grid', shortcut: '⌘\'' },
      { label: 'Toggle Guides', shortcut: '⌘;' }
    ]
  },
  {
    title: 'Insert',
    items: [
      { label: 'Component' },
      { label: 'Shape' },
      { label: 'Image' },
      { label: 'Text' },
      { label: 'Frame' }
    ]
  }
];

// View context options
const VIEW_CONTEXT_OPTIONS = {
  page: ['Home', 'Dashboard', 'Settings', 'Profile', 'Analytics'],
  locale: ['English (US)', 'Spanish', 'French', 'German', 'Japanese'],
  user: ['Admin', 'Editor', 'Viewer', 'Guest', 'Custom Role'],
  date: ['Today', 'Yesterday', 'Last Week', 'Last Month', 'Custom'],
  device: ['Desktop', 'Tablet', 'Mobile', 'Watch', 'TV']
};

// Animation variants
const barVariants = {
  hidden: { y: -40, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30
    }
  },
  exit: {
    y: -40,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const menuVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: { duration: 0.15 }
  }
};

export function StudioOptionsBar({ isOpen, onClose }) {
  const [activeWorkspaceView, setActiveWorkspaceView] = useState('data');
  const [activeInteractionMode, setActiveInteractionMode] = useState('select');
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [showInteractionMenu, setShowInteractionMenu] = useState(false);
  const [showPublishMenu, setShowPublishMenu] = useState(false);
  const [showViewContext, setShowViewContext] = useState(false);
  const [viewContextExpanded, setViewContextExpanded] = useState(false);
  const [statusColor, setStatusColor] = useState('green'); // green, yellow, red

  // View context state
  const [viewContext, setViewContext] = useState({
    page: 'Home',
    locale: 'English (US)',
    user: 'Admin',
    date: 'Today',
    device: 'Desktop'
  });
  const [activeContextDropdown, setActiveContextDropdown] = useState(null);

  const barRef = useRef(null);
  const megaMenuRef = useRef(null);
  const workspaceMenuRef = useRef(null);
  const interactionMenuRef = useRef(null);
  const publishMenuRef = useRef(null);
  const viewContextRef = useRef(null);

  // Close menus on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target)) {
        setShowMegaMenu(false);
      }
      if (workspaceMenuRef.current && !workspaceMenuRef.current.contains(e.target)) {
        setShowWorkspaceMenu(false);
      }
      if (interactionMenuRef.current && !interactionMenuRef.current.contains(e.target)) {
        setShowInteractionMenu(false);
      }
      if (publishMenuRef.current && !publishMenuRef.current.contains(e.target)) {
        setShowPublishMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        if (showMegaMenu) setShowMegaMenu(false);
        else if (showWorkspaceMenu) setShowWorkspaceMenu(false);
        else if (showInteractionMenu) setShowInteractionMenu(false);
        else if (showPublishMenu) setShowPublishMenu(false);
        else if (viewContextExpanded) setViewContextExpanded(false);
        else onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [showMegaMenu, showWorkspaceMenu, showInteractionMenu, showPublishMenu, viewContextExpanded, onClose]);

  // Get visible and hidden workspace views
  const visibleViews = WORKSPACE_VIEWS.filter(v => v.visible);
  const hiddenViews = WORKSPACE_VIEWS.filter(v => !v.visible);

  // Get current interaction mode
  const currentMode = INTERACTION_MODES.find(m => m.id === activeInteractionMode) || INTERACTION_MODES[0];

  // Status dot colors
  const statusColors = {
    green: theme.colors.success[500],
    yellow: theme.colors.warning[500],
    red: theme.colors.error[500]
  };

  // Button base styles
  const buttonBaseStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: theme.borderRadius.md,
    transition: `all ${theme.transitions.fast}`
  };

  const iconButtonStyle = {
    ...buttonBaseStyle,
    width: '28px',
    height: '28px',
    color: theme.colors.text.secondary
  };

  const segmentStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    padding: '2px',
    background: theme.colors.background.tertiary,
    borderRadius: theme.borderRadius.md
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={barRef}
          variants={barVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            height: '40px',
            background: theme.colors.background.elevated,
            borderBottom: `1px solid ${theme.colors.border.default}`,
            boxShadow: theme.shadows.sm,
            zIndex: theme.zIndex.sticky + 10,
            display: 'flex',
            alignItems: 'center',
            padding: '0 12px',
            gap: '16px',
            fontFamily: theme.typography.fontFamily.sans
          }}
        >
          {/* Left Section: Menu + Workspace Views + Interaction Modes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 0 auto' }}>
            {/* Menu Icon (Mega Menu) - Chrome-style angle down */}
            <div style={{ position: 'relative', marginLeft: '4px' }} ref={megaMenuRef}>
              <motion.button
                whileHover={{ background: theme.colors.interactive.hover }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowMegaMenu(!showMegaMenu)}
                style={{
                  ...iconButtonStyle,
                  background: showMegaMenu ? theme.colors.interactive.selected : 'transparent'
                }}
                title="Menu"
              >
                <ChevronDown size={18} strokeWidth={1.5} />
              </motion.button>

              {/* Mega Menu Dropdown */}
              <AnimatePresence>
                {showMegaMenu && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                      position: 'absolute',
                      top: '36px',
                      left: 0,
                      background: theme.colors.background.elevated,
                      border: `1px solid ${theme.colors.border.default}`,
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadows.xl,
                      padding: '12px 16px',
                      display: 'flex',
                      gap: '32px',
                      minWidth: '560px',
                      zIndex: theme.zIndex.dropdown
                    }}
                  >
                    {MEGA_MENU_SECTIONS.map((section) => (
                      <div key={section.title} style={{ flex: 1, minWidth: '120px' }}>
                        <div style={{
                          fontSize: theme.typography.fontSize.xs,
                          fontWeight: theme.typography.fontWeight.semibold,
                          color: theme.colors.text.tertiary,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          padding: '8px 12px 4px',
                          borderBottom: `1px solid ${theme.colors.border.subtle}`,
                          marginBottom: '4px'
                        }}>
                          {section.title}
                        </div>
                        {section.items.map((item) => (
                          <motion.button
                            key={item.label}
                            whileHover={{ background: theme.colors.interactive.hover }}
                            style={{
                              ...buttonBaseStyle,
                              width: '100%',
                              padding: '8px 12px',
                              justifyContent: 'space-between',
                              fontSize: theme.typography.fontSize.sm,
                              color: theme.colors.text.primary
                            }}
                          >
                            <span>{item.label}</span>
                            {item.shortcut && (
                              <span style={{
                                color: theme.colors.text.tertiary,
                                fontSize: theme.typography.fontSize.xs
                              }}>
                                {item.shortcut}
                              </span>
                            )}
                          </motion.button>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '20px',
              background: theme.colors.border.default
            }} />

            {/* Workspace Views */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} ref={workspaceMenuRef}>
              {/* Visible workspace views (3 with labels) */}
              <div style={{ ...segmentStyle, gap: '4px', padding: '3px 4px' }}>
                {visibleViews.map((view) => {
                  const Icon = view.icon;
                  const isActive = activeWorkspaceView === view.id;
                  return (
                    <motion.button
                      key={view.id}
                      whileHover={{ background: isActive ? theme.colors.primary[100] : theme.colors.interactive.hover }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setActiveWorkspaceView(view.id)}
                      style={{
                        ...buttonBaseStyle,
                        minWidth: '72px',
                        padding: '4px 10px',
                        gap: '6px',
                        background: isActive ? theme.colors.primary[50] : 'transparent',
                        color: isActive ? theme.colors.primary[600] : theme.colors.text.secondary,
                        borderRadius: theme.borderRadius.md
                      }}
                      title={view.label}
                    >
                      <Icon size={14} strokeWidth={1.5} />
                      <span style={{
                        fontSize: theme.typography.fontSize.xs,
                        fontWeight: isActive ? theme.typography.fontWeight.medium : theme.typography.fontWeight.normal
                      }}>
                        {view.label}
                      </span>
                    </motion.button>
                  );
                })}

                {/* Dropdown for more views */}
                <motion.button
                  whileHover={{ background: theme.colors.interactive.hover }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                  style={{
                    ...iconButtonStyle,
                    width: '20px',
                    background: showWorkspaceMenu ? theme.colors.interactive.selected : 'transparent'
                  }}
                  title="More views"
                >
                  <ChevronDown size={14} strokeWidth={1.5} />
                </motion.button>
              </div>

              {/* Workspace Views Dropdown */}
              <AnimatePresence>
                {showWorkspaceMenu && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                      position: 'absolute',
                      top: '36px',
                      left: '100px',
                      background: theme.colors.background.elevated,
                      border: `1px solid ${theme.colors.border.default}`,
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadows.lg,
                      padding: '4px',
                      minWidth: '160px',
                      zIndex: theme.zIndex.dropdown
                    }}
                  >
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.tertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '8px 12px 4px'
                    }}>
                      More Views
                    </div>
                    {hiddenViews.map((view) => {
                      const Icon = view.icon;
                      const isActive = activeWorkspaceView === view.id;
                      return (
                        <motion.button
                          key={view.id}
                          whileHover={{ background: theme.colors.interactive.hover }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setActiveWorkspaceView(view.id);
                            setShowWorkspaceMenu(false);
                          }}
                          style={{
                            ...buttonBaseStyle,
                            width: '100%',
                            padding: '8px 12px',
                            gap: '10px',
                            justifyContent: 'flex-start',
                            fontSize: theme.typography.fontSize.sm,
                            color: isActive ? theme.colors.primary[600] : theme.colors.text.primary,
                            background: isActive ? theme.colors.primary[50] : 'transparent'
                          }}
                        >
                          <Icon size={16} strokeWidth={1.5} />
                          <span>{view.label}</span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '20px',
              background: theme.colors.border.default
            }} />

            {/* Interaction Modes Split Button */}
            <div style={{ display: 'flex', alignItems: 'center' }} ref={interactionMenuRef}>
              <div style={segmentStyle}>
                {/* Current mode button */}
                <motion.button
                  whileHover={{ background: theme.colors.interactive.hover }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveInteractionMode('select')}
                  style={{
                    ...buttonBaseStyle,
                    padding: '4px 8px',
                    gap: '6px',
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.primary
                  }}
                  title={currentMode.label}
                >
                  <currentMode.icon size={16} strokeWidth={1.5} />
                  <span style={{ fontSize: theme.typography.fontSize.xs }}>{currentMode.label}</span>
                </motion.button>

                {/* Dropdown trigger */}
                <motion.button
                  whileHover={{ background: theme.colors.interactive.hover }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowInteractionMenu(!showInteractionMenu)}
                  style={{
                    ...iconButtonStyle,
                    width: '20px',
                    background: showInteractionMenu ? theme.colors.interactive.selected : 'transparent'
                  }}
                >
                  <ChevronDown size={14} strokeWidth={1.5} />
                </motion.button>
              </div>

              {/* Interaction Modes Dropdown */}
              <AnimatePresence>
                {showInteractionMenu && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                      position: 'absolute',
                      top: '36px',
                      left: '240px',
                      background: theme.colors.background.elevated,
                      border: `1px solid ${theme.colors.border.default}`,
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadows.lg,
                      padding: '4px',
                      minWidth: '160px',
                      zIndex: theme.zIndex.dropdown
                    }}
                  >
                    <div style={{
                      fontSize: theme.typography.fontSize.xs,
                      fontWeight: theme.typography.fontWeight.semibold,
                      color: theme.colors.text.tertiary,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      padding: '8px 12px 4px'
                    }}>
                      Interaction Modes
                    </div>
                    {INTERACTION_MODES.map((mode) => {
                      const Icon = mode.icon;
                      const isActive = activeInteractionMode === mode.id;
                      return (
                        <motion.button
                          key={mode.id}
                          whileHover={{ background: theme.colors.interactive.hover }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            setActiveInteractionMode(mode.id);
                            setShowInteractionMenu(false);
                          }}
                          style={{
                            ...buttonBaseStyle,
                            width: '100%',
                            padding: '8px 12px',
                            gap: '10px',
                            justifyContent: 'flex-start',
                            fontSize: theme.typography.fontSize.sm,
                            color: isActive ? theme.colors.primary[600] : theme.colors.text.primary,
                            background: isActive ? theme.colors.primary[50] : 'transparent'
                          }}
                        >
                          <Icon size={16} strokeWidth={1.5} />
                          <span>{mode.label}</span>
                          {isActive && (
                            <span style={{
                              marginLeft: 'auto',
                              color: theme.colors.primary[500],
                              fontSize: theme.typography.fontSize.xs
                            }}>
                              ✓
                            </span>
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Center Section: Contextual View Options */}
          <div
            style={{
              flex: '1 1 auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
            ref={viewContextRef}
          >
            <AnimatePresence mode="wait">
              {!viewContextExpanded ? (
                <motion.button
                  key="collapsed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ background: theme.colors.interactive.hover }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setViewContextExpanded(true)}
                  style={{
                    ...buttonBaseStyle,
                    padding: '6px 12px',
                    gap: '6px',
                    fontSize: theme.typography.fontSize.sm,
                    color: theme.colors.text.secondary
                  }}
                >
                  <Eye size={14} strokeWidth={1.5} />
                  <span>View ...</span>
                  <ChevronRight size={14} strokeWidth={1.5} />
                </motion.button>
              ) : (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    background: theme.colors.background.tertiary,
                    borderRadius: theme.borderRadius.lg,
                    fontSize: theme.typography.fontSize.sm
                  }}
                >
                  <span style={{ color: theme.colors.text.secondary }}>View</span>

                  {/* Page selector */}
                  <ContextDropdown
                    icon={Layout}
                    value={viewContext.page}
                    options={VIEW_CONTEXT_OPTIONS.page}
                    isOpen={activeContextDropdown === 'page'}
                    onToggle={() => setActiveContextDropdown(activeContextDropdown === 'page' ? null : 'page')}
                    onSelect={(value) => {
                      setViewContext({ ...viewContext, page: value });
                      setActiveContextDropdown(null);
                    }}
                  />

                  <span style={{ color: theme.colors.text.tertiary }}>in</span>

                  {/* Locale selector */}
                  <ContextDropdown
                    icon={Globe}
                    value={viewContext.locale}
                    options={VIEW_CONTEXT_OPTIONS.locale}
                    isOpen={activeContextDropdown === 'locale'}
                    onToggle={() => setActiveContextDropdown(activeContextDropdown === 'locale' ? null : 'locale')}
                    onSelect={(value) => {
                      setViewContext({ ...viewContext, locale: value });
                      setActiveContextDropdown(null);
                    }}
                  />

                  <span style={{ color: theme.colors.text.tertiary }}>as</span>

                  {/* User selector */}
                  <ContextDropdown
                    icon={User}
                    value={viewContext.user}
                    options={VIEW_CONTEXT_OPTIONS.user}
                    isOpen={activeContextDropdown === 'user'}
                    onToggle={() => setActiveContextDropdown(activeContextDropdown === 'user' ? null : 'user')}
                    onSelect={(value) => {
                      setViewContext({ ...viewContext, user: value });
                      setActiveContextDropdown(null);
                    }}
                  />

                  <span style={{ color: theme.colors.text.tertiary }}>on</span>

                  {/* Date selector */}
                  <ContextDropdown
                    icon={CalendarDays}
                    value={viewContext.date}
                    options={VIEW_CONTEXT_OPTIONS.date}
                    isOpen={activeContextDropdown === 'date'}
                    onToggle={() => setActiveContextDropdown(activeContextDropdown === 'date' ? null : 'date')}
                    onSelect={(value) => {
                      setViewContext({ ...viewContext, date: value });
                      setActiveContextDropdown(null);
                    }}
                  />

                  <span style={{ color: theme.colors.text.tertiary }}>with</span>

                  {/* Device selector */}
                  <ContextDropdown
                    icon={Monitor}
                    value={viewContext.device}
                    options={VIEW_CONTEXT_OPTIONS.device}
                    isOpen={activeContextDropdown === 'device'}
                    onToggle={() => setActiveContextDropdown(activeContextDropdown === 'device' ? null : 'device')}
                    onSelect={(value) => {
                      setViewContext({ ...viewContext, device: value });
                      setActiveContextDropdown(null);
                    }}
                  />

                  {/* Collapse button */}
                  <motion.button
                    whileHover={{ background: theme.colors.interactive.hover }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setViewContextExpanded(false);
                      setActiveContextDropdown(null);
                    }}
                    style={{
                      ...iconButtonStyle,
                      width: '20px',
                      height: '20px',
                      marginLeft: '4px'
                    }}
                  >
                    <X size={12} strokeWidth={2} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Section: Undo/Redo/Status + Publish */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 0 auto' }}>
            {/* Undo/Redo/Status Segment */}
            <div style={segmentStyle}>
              <motion.button
                whileHover={{ background: theme.colors.interactive.hover }}
                whileTap={{ scale: 0.95 }}
                style={iconButtonStyle}
                title="Undo (⌘Z)"
              >
                <Undo2 size={16} strokeWidth={1.5} />
              </motion.button>
              <motion.button
                whileHover={{ background: theme.colors.interactive.hover }}
                whileTap={{ scale: 0.95 }}
                style={iconButtonStyle}
                title="Redo (⌘⇧Z)"
              >
                <Redo2 size={16} strokeWidth={1.5} />
              </motion.button>

              {/* Status indicator */}
              <motion.button
                whileHover={{ background: theme.colors.interactive.hover }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Cycle through status colors for demo
                  const colors = ['green', 'yellow', 'red'];
                  const currentIndex = colors.indexOf(statusColor);
                  setStatusColor(colors[(currentIndex + 1) % colors.length]);
                }}
                style={{
                  ...iconButtonStyle,
                  position: 'relative'
                }}
                title={`Status: ${statusColor === 'green' ? 'All good' : statusColor === 'yellow' ? 'Warnings' : 'Issues'}`}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: statusColors[statusColor],
                  boxShadow: `0 0 4px ${statusColors[statusColor]}`
                }} />
              </motion.button>
            </div>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '20px',
              background: theme.colors.border.default
            }} />

            {/* Publish Split Button */}
            <div style={{ display: 'flex', alignItems: 'center' }} ref={publishMenuRef}>
              <div style={{ display: 'flex', alignItems: 'stretch', height: '28px' }}>
                {/* Main Publish button */}
                <motion.button
                  whileHover={{ background: theme.colors.neutral[300] }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    ...buttonBaseStyle,
                    height: '28px',
                    padding: '0 12px',
                    gap: '6px',
                    background: theme.colors.neutral[200],
                    color: theme.colors.text.primary,
                    fontSize: theme.typography.fontSize.sm,
                    fontWeight: theme.typography.fontWeight.medium,
                    borderTopRightRadius: 0,
                    borderBottomRightRadius: 0,
                    border: `1px solid ${theme.colors.border.default}`,
                    borderRight: 'none'
                  }}
                >
                  <Upload size={14} strokeWidth={1.5} />
                  <span>Publish</span>
                </motion.button>

                {/* Dropdown trigger */}
                <motion.button
                  whileHover={{ background: theme.colors.neutral[300] }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowPublishMenu(!showPublishMenu)}
                  style={{
                    ...buttonBaseStyle,
                    height: '28px',
                    padding: '0 6px',
                    background: showPublishMenu ? theme.colors.neutral[300] : theme.colors.neutral[200],
                    color: theme.colors.text.primary,
                    borderTopLeftRadius: 0,
                    borderBottomLeftRadius: 0,
                    border: `1px solid ${theme.colors.border.default}`,
                    borderLeft: `1px solid ${theme.colors.border.medium}`
                  }}
                >
                  <ChevronDown size={14} strokeWidth={1.5} />
                </motion.button>
              </div>

              {/* Publish Dropdown */}
              <AnimatePresence>
                {showPublishMenu && (
                  <motion.div
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{
                      position: 'absolute',
                      top: '36px',
                      right: '12px',
                      background: theme.colors.background.elevated,
                      border: `1px solid ${theme.colors.border.default}`,
                      borderRadius: theme.borderRadius.lg,
                      boxShadow: theme.shadows.lg,
                      padding: '4px',
                      minWidth: '140px',
                      zIndex: theme.zIndex.dropdown
                    }}
                  >
                    <motion.button
                      whileHover={{ background: theme.colors.interactive.hover }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPublishMenu(false)}
                      style={{
                        ...buttonBaseStyle,
                        width: '100%',
                        padding: '8px 12px',
                        gap: '10px',
                        justifyContent: 'flex-start',
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.primary
                      }}
                    >
                      <Eye size={16} strokeWidth={1.5} />
                      <span>Preview</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ background: theme.colors.interactive.hover }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPublishMenu(false)}
                      style={{
                        ...buttonBaseStyle,
                        width: '100%',
                        padding: '8px 12px',
                        gap: '10px',
                        justifyContent: 'flex-start',
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.primary
                      }}
                    >
                      <Save size={16} strokeWidth={1.5} />
                      <span>Save as</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ background: theme.colors.interactive.hover }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPublishMenu(false)}
                      style={{
                        ...buttonBaseStyle,
                        width: '100%',
                        padding: '8px 12px',
                        gap: '10px',
                        justifyContent: 'flex-start',
                        fontSize: theme.typography.fontSize.sm,
                        color: theme.colors.text.primary
                      }}
                    >
                      <Share2 size={16} strokeWidth={1.5} />
                      <span>Share</span>
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Context dropdown sub-component
function ContextDropdown({ icon: Icon, value, options, isOpen, onToggle, onSelect }) {
  const dropdownRef = useRef(null);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <motion.button
        whileHover={{
          background: theme.colors.neutral[200],
          boxShadow: theme.shadows.sm
        }}
        whileTap={{ scale: 0.98 }}
        onClick={onToggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          border: `1px solid transparent`,
          background: isOpen ? theme.colors.neutral[200] : theme.colors.background.elevated,
          cursor: 'pointer',
          borderRadius: theme.borderRadius.md,
          fontSize: theme.typography.fontSize.xs,
          color: theme.colors.text.primary,
          fontWeight: theme.typography.fontWeight.medium,
          boxShadow: isOpen ? theme.shadows.sm : 'none',
          transition: `all ${theme.transitions.fast}`
        }}
      >
        <Icon size={12} strokeWidth={1.5} style={{ color: theme.colors.text.secondary }} />
        <span>{value}</span>
        <ChevronDown
          size={10}
          strokeWidth={2}
          style={{
            color: theme.colors.text.tertiary,
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: `transform ${theme.transitions.fast}`
          }}
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            style={{
              position: 'absolute',
              top: '100%',
              left: '50%',
              transform: 'translateX(-50%)',
              marginTop: '4px',
              background: theme.colors.background.elevated,
              border: `1px solid ${theme.colors.border.default}`,
              borderRadius: theme.borderRadius.md,
              boxShadow: theme.shadows.md,
              padding: '4px',
              minWidth: '120px',
              zIndex: theme.zIndex.dropdown + 1
            }}
          >
            {options.map((option) => (
              <motion.button
                key={option}
                whileHover={{ background: theme.colors.neutral[100] }}
                onClick={() => onSelect(option)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  padding: '6px 10px',
                  border: 'none',
                  background: value === option ? theme.colors.primary[50] : 'transparent',
                  cursor: 'pointer',
                  borderRadius: theme.borderRadius.sm,
                  fontSize: theme.typography.fontSize.xs,
                  color: value === option ? theme.colors.primary[600] : theme.colors.text.primary,
                  textAlign: 'left'
                }}
              >
                {option}
                {value === option && (
                  <span style={{ marginLeft: 'auto', color: theme.colors.primary[500] }}>✓</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
