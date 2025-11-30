import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/**
 * QuickInsertMenu Component
 *
 * Popup menu for quickly inserting widgets using the / command.
 * Shows chart, table, and metric options.
 *
 * Props:
 * - position: object - { x, y } coordinates for menu placement
 * - onSelect: function - Callback when widget type is selected
 * - onClose: function - Callback when menu should close
 */

const WIDGET_OPTIONS = [
  {
    type: 'chart',
    label: 'Chart',
    icon: '📊',
    description: 'Add a chart widget'
  },
  {
    type: 'table',
    label: 'Table',
    icon: '📋',
    description: 'Add a table widget'
  },
  {
    type: 'metric',
    label: 'Metric',
    icon: '🔢',
    description: 'Add a metric widget'
  }
];

export function QuickInsertMenu({ position, onSelect, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1"
      style={{ left: position.x, top: position.y }}
      role="menu"
      aria-label="Insert widget"
    >
      {WIDGET_OPTIONS.map(({ type, label, icon, description }) => (
        <button
          key={type}
          className="w-full px-4 py-2 text-left hover:bg-blue-50 flex items-center space-x-3 min-w-[240px]"
          onClick={() => onSelect(type)}
          role="menuitem"
        >
          <span className="text-2xl">{icon}</span>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">{label}</div>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </button>
      ))}
    </div>
  );
}

QuickInsertMenu.propTypes = {
  position: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired
  }).isRequired,
  onSelect: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};
