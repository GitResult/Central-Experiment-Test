import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * DescriptionElement Component
 *
 * A description or subtitle element with muted styling.
 * Supports inline editing with double-click.
 *
 * @param {Object} data - Element data
 * @param {string} data.content - Description text
 * @param {Object} settings - Element settings
 * @param {string} settings.fontSize - Font size (sm, base, lg)
 * @param {string} settings.color - Text color
 * @param {Function} onUpdate - Callback for updates
 */
const DescriptionElement = ({ data = {}, settings = {}, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || '');
  const textareaRef = useRef(null);

  // Font size mapping
  const fontSize = {
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg'
  }[settings.fontSize || 'sm'];

  // Text color (default to muted gray)
  const textColor = settings.color || 'text-gray-500';

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = content.length;
      textareaRef.current.selectionEnd = content.length;
    }
  }, [isEditing, content.length]);

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdate && content !== data.content) {
      onUpdate({ data: { content } });
    }
  };

  const handleKeyDown = (e) => {
    // Save on Cmd/Ctrl+Enter
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    }
    // Cancel on Escape
    if (e.key === 'Escape') {
      setContent(data.content || '');
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="description-element-editing">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${fontSize} ${textColor} resize-y min-h-[60px]`}
          placeholder="Enter description..."
        />
        <div className="text-xs text-gray-400 mt-1">
          Cmd/Ctrl+Enter to save, Esc to cancel
        </div>
      </div>
    );
  }

  return (
    <div
      className={`description-element cursor-pointer hover:bg-gray-50 transition-colors rounded p-2 ${fontSize} ${textColor}`}
      onDoubleClick={() => setIsEditing(true)}
      title="Double-click to edit"
    >
      {content || (
        <span className="text-gray-400 italic">Add a description...</span>
      )}
    </div>
  );
};

DescriptionElement.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string
  }),
  settings: PropTypes.shape({
    fontSize: PropTypes.oneOf(['sm', 'base', 'lg']),
    color: PropTypes.string
  }),
  onUpdate: PropTypes.func
};

export default DescriptionElement;
