import React, { useRef, useEffect } from 'react';

/**
 * MarkdownEditor Component
 *
 * Simple markdown editor with syntax awareness.
 * Uses a textarea with custom styling for now.
 * Future: Could be upgraded to CodeMirror for advanced features.
 */
const MarkdownEditor = ({
  value,
  onChange,
  placeholder = 'Start typing your presentation...',
  className = ''
}) => {
  const textareaRef = useRef(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [value]);

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Handle tab key for indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);

      // Set cursor position after inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const editorStyles = {
    fontFamily: 'ui-monospace, "SF Mono", Menlo, Monaco, "Courier New", monospace',
    fontSize: '14px',
    lineHeight: '1.6',
    padding: '24px',
    width: '100%',
    minHeight: '400px',
    border: 'none',
    outline: 'none',
    resize: 'vertical',
    backgroundColor: '#FAFAFA',
    color: '#1D1D1F'
  };

  return (
    <div className={`markdown-editor ${className}`}>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        style={editorStyles}
        spellCheck="false"
      />
    </div>
  );
};

export default MarkdownEditor;
