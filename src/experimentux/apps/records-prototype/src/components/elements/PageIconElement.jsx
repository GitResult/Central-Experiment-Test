import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * PageIconElement Component
 *
 * Displays an emoji or icon that can be used as page identifier.
 * Click to change icon (simplified - just cycles through common icons for demo).
 *
 * @param {Object} data - Element data
 * @param {string} data.icon - Icon/emoji character
 * @param {Object} settings - Element settings
 * @param {string} settings.size - Size (sm, md, lg, xl)
 * @param {Function} onUpdate - Callback for updates
 */
const PageIconElement = ({ data = {}, settings = {}, onUpdate }) => {
  const [icon, setIcon] = useState(data.icon || '📄');

  // Common icon options (simplified for demo)
  const iconOptions = ['📄', '📊', '📈', '🎯', '🚀', '💡', '⭐', '🎨', '📱', '💼', '🌟', '🔥', '✨', '🎉', '📝', '🔔'];

  // Size mapping
  const sizeClasses = {
    'sm': 'text-2xl w-10 h-10',
    'md': 'text-4xl w-16 h-16',
    'lg': 'text-6xl w-20 h-20',
    'xl': 'text-8xl w-24 h-24'
  };

  const size = sizeClasses[settings.size || 'lg'];

  const handleClick = () => {
    const currentIndex = iconOptions.indexOf(icon);
    const nextIndex = (currentIndex + 1) % iconOptions.length;
    const nextIcon = iconOptions[nextIndex];

    setIcon(nextIcon);
    if (onUpdate) {
      onUpdate({ data: { icon: nextIcon } });
    }
  };

  return (
    <div className="page-icon-element flex justify-center my-4">
      <div
        className={`${size} flex items-center justify-center cursor-pointer hover:bg-gray-100 rounded-lg transition-all hover:scale-110 select-none`}
        onClick={handleClick}
        title="Click to change icon"
      >
        {icon}
      </div>
    </div>
  );
};

PageIconElement.propTypes = {
  data: PropTypes.shape({
    icon: PropTypes.string
  }),
  settings: PropTypes.shape({
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl'])
  }),
  onUpdate: PropTypes.func
};

export default PageIconElement;
