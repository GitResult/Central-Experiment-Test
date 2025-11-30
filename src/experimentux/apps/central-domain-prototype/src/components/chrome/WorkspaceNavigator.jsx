/**
 * WorkspaceNavigator Component
 * Left sidebar navigation with macOS Tahoe-inspired design
 */

import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, Users, CheckSquare, FileText, Edit3, MessageSquare,
  Folder, Calendar, BarChart3, Plus, Hash, Layers, GripVertical, RefreshCw,
  Zap, Network, Presentation, BookOpen, HelpCircle, Diamond
} from 'lucide-react';
import { useState } from 'react';
import { useDataStore } from '../../store/dataStore';
import { theme } from '../../config/theme';
import { ElementMigration } from '../editor/ElementMigration';

export function WorkspaceNavigator({ isOpen, onClose }) {
  const recentlyViewed = useDataStore((state) => state.recentlyViewed);
  const [isMigrationOpen, setIsMigrationOpen] = useState(false);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay with fade animation */}
          <motion.div
            key="workspace-navigator-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(4px)'
            }}
            onClick={onClose}
            role="button"
            tabIndex={0}
            aria-label="Close navigation"
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
            }}
          />

          {/* Sidebar panel with slide animation */}
          <motion.div
            key="workspace-navigator-panel"
            initial={{ x: -288 }}
            animate={{ x: 0 }}
            exit={{ x: -288 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 z-40"
            style={{
              width: '288px',
              backgroundColor: 'rgba(255, 255, 255, 0.85)',
              backdropFilter: 'blur(40px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.08)',
              borderRight: `1px solid ${theme.colors.border.subtle}`
            }}
          >
            {/* macOS-style scrollbar */}
            <style>{`
              .tahoe-scrollbar::-webkit-scrollbar {
                width: 8px;
              }
              .tahoe-scrollbar::-webkit-scrollbar-track {
                background: transparent;
              }
              .tahoe-scrollbar::-webkit-scrollbar-thumb {
                background: rgba(0, 0, 0, 0.2);
                border-radius: 4px;
                border: 2px solid transparent;
                background-clip: padding-box;
              }
              .tahoe-scrollbar::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 0, 0, 0.3);
                border: 2px solid transparent;
                background-clip: padding-box;
              }
            `}</style>

            {/* Scrollable content */}
            <div
              className="h-full overflow-y-auto tahoe-scrollbar"
              style={{
                paddingTop: '68px', // 56px (GlobalBar height) + 12px spacing to slide under workspace switcher
                paddingBottom: theme.spacing[8]
              }}
            >
              <div style={{ paddingLeft: theme.spacing[5], paddingRight: theme.spacing[5] }}>
                {/* Section 1: Core Pages */}
                <nav style={{ marginBottom: theme.spacing[6] }}>
                  <NavItem icon={Home} label="Home" to="/" onClick={onClose} />
                  <NavItem icon={Diamond} label="Collections" to="/collections" onClick={onClose} badge="NEW" />
                  <NavItem icon={Users} label="Contacts" to="/contacts" onClick={onClose} />
                  <NavItem icon={CheckSquare} label="Tasks" to="/tasks" onClick={onClose} />
                </nav>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: theme.colors.border.subtle,
                    marginTop: theme.spacing[4],
                    marginBottom: theme.spacing[4],
                    opacity: 0.6
                  }}
                />

                {/* Section 2: Apps */}
                <div style={{ marginBottom: theme.spacing[6] }}>
                  <SectionHeader>Apps</SectionHeader>
                  <nav>
                    <NavItem icon={FileText} label="Pages" to="/pages" onClick={onClose} />
                    <NavItem icon={Edit3} label="Page Editor" to="/editor" onClick={onClose} />
                    <NavItem icon={MessageSquare} label="Messages" badge="Soon" disabled />
                    <NavItem icon={Folder} label="Files" badge="Soon" disabled />
                    <NavItem icon={Calendar} label="Calendar" to="/calendar" onClick={onClose} />
                    <NavItem icon={BarChart3} label="Reports" badge="Soon" disabled />
                    <NavItem icon={Plus} label="Add App" disabled />
                  </nav>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: theme.colors.border.subtle,
                    marginTop: theme.spacing[4],
                    marginBottom: theme.spacing[4],
                    opacity: 0.6
                  }}
                />

                {/* Section: Studio */}
                <div style={{ marginBottom: theme.spacing[6] }}>
                  <SectionHeader>Studio</SectionHeader>
                  <nav>
                    <NavItem icon={Zap} label="Blueprint Generator" to="/studio/blueprint" onClick={onClose} badge="NEW" />
                    <NavItem icon={Network} label="DEPTH View" to="/studio/depth" onClick={onClose} badge="NEW" />
                    <NavItem icon={Presentation} label="Presenter Mode" to="/studio/presenter" onClick={onClose} badge="NEW" />
                  </nav>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: theme.colors.border.subtle,
                    marginTop: theme.spacing[4],
                    marginBottom: theme.spacing[4],
                    opacity: 0.6
                  }}
                />

                {/* Section: Help5 System */}
                <div style={{ marginBottom: theme.spacing[6] }}>
                  <SectionHeader>Help5 System</SectionHeader>
                  <nav>
                    <NavItem icon={BookOpen} label="All Contexts" to="/help5" onClick={onClose} badge="NEW" />
                    <NavItem icon={Zap} label="Interactive Guides" to="/help5/guides" onClick={onClose} badge="NEW" />
                    <NavItem icon={BarChart3} label="Coverage Dashboard" to="/help5/coverage" onClick={onClose} badge="NEW" />
                  </nav>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: theme.colors.border.subtle,
                    marginTop: theme.spacing[4],
                    marginBottom: theme.spacing[4],
                    opacity: 0.6
                  }}
                />

                {/* Section: Discussions */}
                <div style={{ marginBottom: theme.spacing[6] }}>
                  <SectionHeader>Discussions</SectionHeader>
                  <nav>
                    <NavItem icon={MessageSquare} label="All Threads" to="/discussions" onClick={onClose} badge="NEW" />
                    <NavItem icon={MessageSquare} label="Open Discussions" to="/discussions?filter=open" onClick={onClose} />
                    <NavItem icon={CheckSquare} label="Resolved" to="/discussions?filter=resolved" onClick={onClose} />
                  </nav>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: theme.colors.border.subtle,
                    marginTop: theme.spacing[4],
                    marginBottom: theme.spacing[4],
                    opacity: 0.6
                  }}
                />

                {/* Section: Tools */}
                <div style={{ marginBottom: theme.spacing[6] }}>
                  <SectionHeader>Tools</SectionHeader>
                  <nav>
                    <NavItem
                      icon={RefreshCw}
                      label="Element Migration"
                      onClick={(e) => {
                        e.preventDefault();
                        setIsMigrationOpen(true);
                      }}
                    />
                  </nav>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: theme.colors.border.subtle,
                    marginTop: theme.spacing[4],
                    marginBottom: theme.spacing[4],
                    opacity: 0.6
                  }}
                />

                {/* Section 3: Recently Viewed */}
                <div style={{ marginBottom: theme.spacing[6] }}>
                  <SectionHeader>Recently Viewed</SectionHeader>
                  <nav>
                    {recentlyViewed.length === 0 ? (
                      <div
                        style={{
                          paddingLeft: theme.spacing[3],
                          paddingTop: theme.spacing[2],
                          paddingBottom: theme.spacing[2],
                          fontSize: theme.typography.fontSize.xs,
                          color: theme.colors.text.disabled
                        }}
                      >
                        No recent items
                      </div>
                    ) : (
                      recentlyViewed.map((item) => (
                        <NavItem
                          key={`${item.type}-${item.id}`}
                          label={item.name}
                          to={`/${item.type}s/${item.id}`}
                          indent
                          onClick={onClose}
                        />
                      ))
                    )}
                  </nav>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: theme.colors.border.subtle,
                    marginTop: theme.spacing[4],
                    marginBottom: theme.spacing[4],
                    opacity: 0.6
                  }}
                />

                {/* Section 4: Lists */}
                <div style={{ marginBottom: theme.spacing[6] }}>
                  <SectionHeader>Lists</SectionHeader>
                  <nav>
                    <NavItem icon={Layers} label="Showcase" to="/showcase" onClick={onClose} />
                    <NavItem label="All Examples" to="/showcase" indent onClick={onClose} />
                  </nav>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: '1px',
                    background: theme.colors.border.subtle,
                    marginTop: theme.spacing[4],
                    marginBottom: theme.spacing[4],
                    opacity: 0.6
                  }}
                />

                {/* Section 5: Channels */}
                <div style={{ marginBottom: theme.spacing[6] }}>
                  <SectionHeader>Channels</SectionHeader>
                  <nav>
                    <NavItem icon={Hash} label="Staff" disabled />
                    <NavItem icon={Hash} label="Events" disabled />
                    <NavItem icon={Hash} label="Finance" disabled />
                  </nav>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}

      {/* Element Migration Modal */}
      <ElementMigration
        isOpen={isMigrationOpen}
        onClose={() => setIsMigrationOpen(false)}
      />
    </AnimatePresence>
  );
}

WorkspaceNavigator.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired
};

// SectionHeader subcomponent
function SectionHeader({ children }) {
  return (
    <div
      style={{
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.text.disabled,
        textTransform: 'uppercase',
        letterSpacing: theme.typography.letterSpacing.wide,
        paddingLeft: theme.spacing[3],
        paddingBottom: theme.spacing[2],
        marginBottom: theme.spacing[1]
      }}
    >
      {children}
    </div>
  );
}

SectionHeader.propTypes = {
  children: PropTypes.node.isRequired
};

// NavItem subcomponent
function NavItem({ icon: Icon, label, indent, badge, to, onClick, disabled }) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <span
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing[2.5],
        flex: 1,
        position: 'relative'
      }}
    >
      {/* Drag handle - appears on hover in the margin */}
      <span
        style={{
          position: 'absolute',
          left: '-20px',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '16px',
          height: '16px',
          opacity: isHovered && !disabled ? 1 : 0,
          transition: `opacity ${theme.transitions.fast}`,
          color: theme.colors.text.tertiary,
          cursor: isHovered && !disabled ? 'grab' : 'default'
        }}
      >
        <GripVertical size={14} strokeWidth={2} />
      </span>

      {Icon && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: disabled ? theme.colors.text.disabled : theme.colors.text.secondary,
            width: '18px',
            height: '18px'
          }}
        >
          <Icon size={18} strokeWidth={2} />
        </span>
      )}
      <span>{label}</span>
    </span>
  );

  const badgeElement = badge && (
    <span
      style={{
        fontSize: '11px',
        paddingLeft: theme.spacing[2],
        paddingRight: theme.spacing[2],
        paddingTop: '2px',
        paddingBottom: '2px',
        borderRadius: theme.borderRadius.sm,
        backgroundColor: 'rgba(0, 0, 0, 0.06)',
        color: theme.colors.text.tertiary,
        fontWeight: theme.typography.fontWeight.medium
      }}
    >
      {badge}
    </span>
  );

  const baseStyle = {
    paddingLeft: indent ? theme.spacing['8'] : theme.spacing['3'],
    paddingRight: theme.spacing['3'],
    paddingTop: theme.spacing['1.5'],
    paddingBottom: theme.spacing['1.5'],
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: disabled ? theme.colors.text.disabled : theme.colors.text.primary,
    opacity: disabled ? 0.6 : 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    borderRadius: theme.borderRadius.md,
    transition: `all ${theme.transitions.fast}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    textAlign: 'left',
    border: 'none',
    background: 'transparent',
    textDecoration: 'none',
    marginBottom: '2px'
  };

  const hoverStyle = {
    backgroundColor: 'rgba(0, 0, 0, 0.05)'
  };

  if (disabled || !to) {
    return (
      <button
        style={baseStyle}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={(e) => {
          setIsHovered(true);
          if (!disabled) {
            Object.assign(e.currentTarget.style, hoverStyle);
          }
        }}
        onMouseLeave={(e) => {
          setIsHovered(false);
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        {content}
        {badgeElement}
      </button>
    );
  }

  return (
    <Link
      to={to}
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={(e) => {
        setIsHovered(true);
        Object.assign(e.currentTarget.style, hoverStyle);
      }}
      onMouseLeave={(e) => {
        setIsHovered(false);
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {content}
      {badgeElement}
    </Link>
  );
}

NavItem.propTypes = {
  icon: PropTypes.elementType,
  label: PropTypes.string.isRequired,
  indent: PropTypes.bool,
  badge: PropTypes.string,
  to: PropTypes.string,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};
