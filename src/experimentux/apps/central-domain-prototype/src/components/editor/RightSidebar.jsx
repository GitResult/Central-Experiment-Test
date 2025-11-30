/**
 * RightSidebar - Apple-inspired editor sidebar
 */

import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { Settings, LayoutGrid } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { useStudioDockStore } from '../../store/studioDockStore';
import { SettingsPanel } from './SettingsPanel';
import { ElementPicker } from './ElementPicker';
import { theme } from '../../config/theme';

function TabButton({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-center gap-2 py-4 transition-all"
      style={{
        flex: 1,
        color: active ? theme.colors.primary[500] : theme.colors.text.tertiary,
        fontWeight: active ? theme.typography.fontWeight.semibold : theme.typography.fontWeight.medium,
        fontSize: theme.typography.fontSize.base,
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        transition: `all ${theme.transitions.base}`
      }}
    >
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      <span>{label}</span>
      {active && (
        <motion.div
          layoutId="activeTab"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: theme.colors.primary[500]
          }}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.3 }}
        />
      )}
    </button>
  );
}

TabButton.propTypes = {
  active: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired
};

export function RightSidebar() {
  const sidebarOpen = useEditorStore((state) => state.sidebarOpen);
  const sidebarTab = useEditorStore((state) => state.sidebarTab);
  const setSidebarTab = useEditorStore((state) => state.setSidebarTab);
  const studioOptionsBarOpen = useStudioDockStore((state) => state.panels.studioOptionsBar);

  // Offset for Studio Options Bar (40px when open)
  const topOffset = studioOptionsBarOpen ? 40 : 0;

  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: sidebarOpen ? 0 : '100%' }}
      transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      className="flex flex-col"
      style={{
        position: 'fixed',
        right: 0,
        top: topOffset,
        width: '360px',
        height: `calc(100vh - ${topOffset}px)`,
        background: theme.colors.background.primary,
        borderLeft: `1px solid ${theme.colors.border.default}`,
        boxShadow: theme.shadows.xl,
        zIndex: 40,
        transition: 'top 200ms cubic-bezier(0.4, 0, 0.2, 1), height 200ms cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Tabs Header */}
      <div
        style={{
          borderBottom: `1px solid ${theme.colors.border.default}`,
          display: 'flex',
          paddingRight: '60px' // Reserve space for fixed sidebar toggle (16px + 44px button width)
        }}
      >
        <TabButton
          active={sidebarTab === 'elements'}
          onClick={() => setSidebarTab('elements')}
          icon={LayoutGrid}
          label="Elements"
        />
        <TabButton
          active={sidebarTab === 'settings'}
          onClick={() => setSidebarTab('settings')}
          icon={Settings}
          label="Settings"
        />
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: sidebarTab === 'settings' ? theme.spacing[4] : 0
        }}
        className="custom-scrollbar"
      >
        {sidebarTab === 'elements' ? <ElementPicker /> : <SettingsPanel />}
      </div>
    </motion.div>
  );
}
