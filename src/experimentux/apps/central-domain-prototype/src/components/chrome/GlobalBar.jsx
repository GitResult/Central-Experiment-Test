/**
 * GlobalBar Component
 * Top navigation bar visible on all pages
 */

import { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { theme } from '../../config/theme';
import { CreateNewMenu } from './CreateNewMenu';

export function GlobalBar({ onMenuClick, isEditMode = false, sidebarOpen = false, transparent = false }) {
  const [showCreateMenu, setShowCreateMenu] = useState(false);
  const plusButtonRef = useRef(null);

  return (
    <div
      className="h-14 flex items-center justify-between px-4 relative"
      style={{
        backgroundColor: transparent ? 'transparent' : theme.colors.background,
        borderBottom: transparent ? 'none' : `1px solid ${theme.colors.border.default}`,
        zIndex: 50 // Ensure it's above the sidebar
      }}
    >
      {/* Left section */}
      <div className="flex items-center gap-3" style={{ position: 'relative', zIndex: 50 }}>
        {/* Hamburger menu */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded transition-colors"
          aria-label="Toggle menu"
          style={{
            color: transparent ? 'white' : theme.colors.text.primary,
            backgroundColor: 'transparent'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = transparent ? 'rgba(255,255,255,0.15)' : theme.colors.interactive.hover;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 4.5h16M2 10h16M2 15.5h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Workspace selector */}
        <div className="flex items-center gap-1">
          <span
            className="font-semibold"
            style={{
              fontSize: theme.typography.fontSize.base,
              color: transparent ? 'white' : theme.colors.text.primary
            }}
          >
            Central
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ color: transparent ? 'white' : 'currentColor' }}>
            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          </svg>
        </div>

        {/* Add button */}
        <button
          ref={plusButtonRef}
          onClick={() => setShowCreateMenu(!showCreateMenu)}
          className="p-1.5 rounded transition-colors"
          aria-label="Add new"
          style={{
            color: transparent ? 'white' : theme.colors.text.primary,
            backgroundColor: showCreateMenu ? (transparent ? 'rgba(255,255,255,0.15)' : theme.colors.primary[50]) : 'transparent'
          }}
          onMouseOver={(e) => {
            if (!showCreateMenu) {
              e.currentTarget.style.backgroundColor = transparent ? 'rgba(255,255,255,0.15)' : theme.colors.interactive.hover;
            }
          }}
          onMouseOut={(e) => {
            if (!showCreateMenu) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Create New Menu */}
        <CreateNewMenu
          isOpen={showCreateMenu}
          onClose={() => setShowCreateMenu(false)}
          anchorRef={plusButtonRef}
        />
      </div>

      {/* Center section - Global search */}
      <div className="flex-1 max-w-xl mx-8">
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle cx="7" cy="7" r="4" stroke={transparent ? 'rgba(255,255,255,0.7)' : theme.colors.text.tertiary} strokeWidth="2" />
            <path d="M11 11l3 3" stroke={transparent ? 'rgba(255,255,255,0.7)' : theme.colors.text.tertiary} strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search Central"
            className="w-full pl-10 pr-4 py-1.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: transparent ? 'rgba(255,255,255,0.15)' : theme.colors.surface,
              fontSize: theme.typography.fontSize.sm,
              color: transparent ? 'white' : theme.colors.text.primary,
              backdropFilter: transparent ? 'blur(8px)' : 'none'
            }}
          />
        </div>
      </div>

      {/* Right section */}
      <div
        className="flex items-center gap-3"
        style={{
          marginRight: isEditMode && !sidebarOpen ? '56px' : '0', // Space for fixed sidebar toggle when sidebar is closed
          transition: 'margin-right 0.3s ease'
        }}
      >
        {/* Notification bell */}
        <button
          className="p-2 rounded transition-colors relative"
          aria-label="Notifications"
          style={{
            color: transparent ? 'white' : theme.colors.text.primary,
            backgroundColor: 'transparent'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = transparent ? 'rgba(255,255,255,0.15)' : theme.colors.interactive.hover;
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 2a6 6 0 00-6 6c0 3-1 4-1 4h14s-1-1-1-4a6 6 0 00-6-6z" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 16a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* User avatar */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-semibold text-white"
          style={{
            backgroundColor: transparent ? 'rgba(255,255,255,0.2)' : theme.colors.primary[500],
            fontSize: theme.typography.fontSize.sm,
            border: transparent ? '1px solid rgba(255,255,255,0.3)' : 'none'
          }}
        >
          JD
        </div>
      </div>
    </div>
  );
}

GlobalBar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  sidebarOpen: PropTypes.bool,
  transparent: PropTypes.bool
};
