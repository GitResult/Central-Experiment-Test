import React from 'react';
import PropTypes from 'prop-types';

/**
 * ButtonElement Component
 *
 * A clickable button element with customizable styling.
 *
 * @param {Object} data - Element data
 * @param {string} data.text - Button text
 * @param {string} data.url - Optional URL to navigate to
 * @param {Object} settings - Element settings
 * @param {string} settings.variant - Button variant (primary, secondary, outline, ghost)
 * @param {string} settings.size - Button size (sm, md, lg)
 * @param {string} settings.align - Alignment (left, center, right)
 * @param {Function} onUpdate - Callback for updates
 */
const ButtonElement = ({ data = {}, settings = {}, onUpdate }) => {
  const { text = 'Button', url } = data;

  // Variant styles
  const variants = {
    'primary': 'bg-blue-600 hover:bg-blue-700 text-white',
    'secondary': 'bg-gray-600 hover:bg-gray-700 text-white',
    'outline': 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    'ghost': 'text-blue-600 hover:bg-blue-50'
  };

  // Size styles
  const sizes = {
    'sm': 'px-3 py-1.5 text-sm',
    'md': 'px-4 py-2 text-base',
    'lg': 'px-6 py-3 text-lg'
  };

  // Alignment
  const alignments = {
    'left': 'justify-start',
    'center': 'justify-center',
    'right': 'justify-end'
  };

  const variant = variants[settings.variant || 'primary'];
  const size = sizes[settings.size || 'md'];
  const align = alignments[settings.align || 'left'];

  const handleClick = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`button-element flex ${align}`}>
      <button
        onClick={handleClick}
        className={`${variant} ${size} rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-md`}
      >
        {text}
      </button>
    </div>
  );
};

ButtonElement.propTypes = {
  data: PropTypes.shape({
    text: PropTypes.string,
    url: PropTypes.string
  }),
  settings: PropTypes.shape({
    variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    align: PropTypes.oneOf(['left', 'center', 'right'])
  }),
  onUpdate: PropTypes.func
};

export default ButtonElement;
