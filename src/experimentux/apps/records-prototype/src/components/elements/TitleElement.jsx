import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * TitleElement Component
 *
 * A large, prominent title element typically used as the page or section title.
 * Supports inline editing with double-click.
 *
 * @param {Object} data - Element data
 * @param {string} data.content - Title text
 * @param {Object} settings - Element settings
 * @param {string} settings.fontSize - Font size (2xl, 3xl, 4xl, 5xl, 6xl)
 * @param {string} settings.fontWeight - Font weight (normal, semibold, bold, extrabold)
 * @param {string} settings.color - Text color
 * @param {Function} onUpdate - Callback for updates
 */
const TitleElement = ({ data = {}, settings = {}, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || 'Untitled');
  const inputRef = useRef(null);

  // Font size mapping
  const fontSize = {
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl'
  }[settings.fontSize || '4xl'];

  // Font weight mapping
  const fontWeight = {
    'normal': 'font-normal',
    'semibold': 'font-semibold',
    'bold': 'font-bold',
    'extrabold': 'font-extrabold'
  }[settings.fontWeight || 'bold'];

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
      setContent(data.content || 'Untitled');
      setIsEditing(false);
    }
  };

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
        placeholder="Enter title..."
      />
    );
  }

  return (
    <h1
      className={`title-element cursor-pointer hover:bg-gray-50 transition-colors rounded px-2 py-1 ${fontSize} ${fontWeight} ${textColor}`}
      onDoubleClick={() => setIsEditing(true)}
      title="Double-click to edit"
    >
      {content || 'Untitled'}
    </h1>
  );
};

TitleElement.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string
  }),
  settings: PropTypes.shape({
    fontSize: PropTypes.oneOf(['2xl', '3xl', '4xl', '5xl', '6xl']),
    fontWeight: PropTypes.oneOf(['normal', 'semibold', 'bold', 'extrabold']),
    color: PropTypes.string
  }),
  onUpdate: PropTypes.func
};

export default TitleElement;
