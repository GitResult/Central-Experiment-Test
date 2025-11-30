import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * TextElement Component
 *
 * A simple text block element that supports inline editing.
 * Double-click to edit, click outside or blur to save.
 *
 * @param {Object} data - Element data
 * @param {string} data.content - Text content
 * @param {Object} settings - Element settings
 * @param {string} settings.fontSize - Font size (sm, base, lg, xl)
 * @param {string} settings.color - Text color (Tailwind color class)
 * @param {string} settings.align - Text alignment (left, center, right)
 * @param {Function} onUpdate - Callback for updates
 */
const TextElement = ({ data = {}, settings = {}, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(data.content || '');
  const textareaRef = useRef(null);

  // Font size mapping
  const fontSize = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl'
  }[settings.fontSize || 'base'];

  // Text color
  const textColor = settings.color || 'text-gray-700';

  // Text alignment
  const textAlign = {
    'left': 'text-left',
    'center': 'text-center',
    'right': 'text-right',
    'justify': 'text-justify'
  }[settings.align || 'left'];

  // Auto-focus when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
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
      <div className="text-element-editing">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className={`w-full p-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${fontSize} ${textColor} ${textAlign} resize-y min-h-[80px]`}
          placeholder="Enter text..."
        />
        <div className="text-xs text-gray-400 mt-1">
          Cmd/Ctrl+Enter to save, Esc to cancel
        </div>
      </div>
    );
  }

  return (
    <div
      className={`text-element cursor-pointer hover:bg-gray-50 transition-colors rounded p-2 ${fontSize} ${textColor} ${textAlign}`}
      onDoubleClick={() => setIsEditing(true)}
      title="Double-click to edit"
    >
      {content || (
        <span className="text-gray-400 italic">Click to edit...</span>
      )}
    </div>
  );
};

TextElement.propTypes = {
  data: PropTypes.shape({
    content: PropTypes.string
  }),
  settings: PropTypes.shape({
    fontSize: PropTypes.oneOf(['xs', 'sm', 'base', 'lg', 'xl']),
    color: PropTypes.string,
    align: PropTypes.oneOf(['left', 'center', 'right', 'justify'])
  }),
  onUpdate: PropTypes.func
};

export default TextElement;
