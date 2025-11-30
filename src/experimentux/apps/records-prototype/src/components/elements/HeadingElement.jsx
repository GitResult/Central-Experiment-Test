import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * HeadingElement Component
 *
 * A heading element for section titles (h2, h3, h4, h5, h6).
 * Supports inline editing with double-click.
 *
 * @param {Object} data - Element data
 * @param {string} data.content - Heading text
 * @param {Object} settings - Element settings
 * @param {number} settings.level - Heading level (2-6)
 * @param {string} settings.color - Text color
 * @param {Function} onUpdate - Callback for updates
 */
const HeadingElement = ({ data = {}, settings = {}, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || '');
  const inputRef = useRef(null);

  // Heading level (2-6)
  const level = Math.min(6, Math.max(2, settings.level || 2));

  // Font size based on heading level
  const fontSize = {
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base'
  }[level];

  // Font weight
  const fontWeight = 'font-semibold';

  // Text color
  const textColor = settings.color || 'text-gray-900';

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate && content !== data.content) {
      onUpdate({ data: { content } });
    }
  };

  const handleKeyDown = (e) => {
    // Save on Enter
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    // Cancel on Escape
    if (e.key === 'Escape') {
      setContent(data.content || '');
      setIsEditing(false);
    }
  };

  const HeadingTag = `h${level}`;

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={`w-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 ${fontSize} ${fontWeight} ${textColor}`}
        placeholder="Enter heading..."
      />
    );
  }

  return React.createElement(
    HeadingTag,
    {
      className: `heading-element cursor-pointer hover:bg-gray-50 transition-colors rounded px-2 py-1 ${fontSize} ${fontWeight} ${textColor}`,
      onDoubleClick: () => setIsEditing(true),
      title: 'Double-click to edit'
    },
    content || <span className="text-gray-400 italic">Heading...</span>
  );
};

HeadingElement.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string
  }),
  settings: PropTypes.shape({
    level: PropTypes.oneOf([2, 3, 4, 5, 6]),
    color: PropTypes.string
  }),
  onUpdate: PropTypes.func
};

export default HeadingElement;
