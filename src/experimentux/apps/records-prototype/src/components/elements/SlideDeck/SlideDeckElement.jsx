import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import MarkdownEditor from './MarkdownEditor';
import LivePreview from './LivePreview';
import { minimalistTheme } from './themes/minimalist';
import { createTemplate } from './utils/markdownParser';

/**
 * SlideDeckElement Component
 *
 * Main component for creating slide deck presentations.
 * Features:
 * - Markdown-based editing
 * - Live preview
 * - Apple-inspired minimalist design
 * - Split-pane editor/preview layout
 */
const SlideDeckElement = ({
  elementId,
  settings = {},
  onUpdate,
  isEditing = true,
  containerContext = 'page'
}) => {
  // State
  const [markdown, setMarkdown] = useState(
    settings.markdown || createTemplate(settings.template || 'blank')
  );
  const [theme] = useState(minimalistTheme); // Future: support theme switching
  const [viewMode, setViewMode] = useState('split'); // 'split', 'editor', 'preview'

  // Save markdown when it changes
  useEffect(() => {
    if (onUpdate) {
      onUpdate({
        ...settings,
        markdown,
        lastEdited: new Date().toISOString()
      });
    }
  }, [markdown]);

  const handleMarkdownChange = (newMarkdown) => {
    setMarkdown(newMarkdown);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Container styles
  const containerStyles = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    minHeight: '600px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    border: '1px solid #D2D2D7',
    overflow: 'hidden'
  };

  // Toolbar styles
  const toolbarStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 24px',
    borderBottom: '1px solid #D2D2D7',
    backgroundColor: '#FAFAFA'
  };

  const titleStyles = {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1D1D1F'
  };

  const viewModeButtonStyles = (isActive) => ({
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '500',
    color: isActive ? '#FFFFFF' : '#1D1D1F',
    backgroundColor: isActive ? '#0071E3' : 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.2s'
  });

  // Content area styles based on view mode
  const contentStyles = {
    display: 'flex',
    flex: 1,
    overflow: 'hidden'
  };

  const editorPaneStyles = {
    flex: viewMode === 'split' ? 1 : viewMode === 'editor' ? 1 : 0,
    display: viewMode === 'preview' ? 'none' : 'flex',
    flexDirection: 'column',
    borderRight: viewMode === 'split' ? '1px solid #D2D2D7' : 'none',
    overflow: 'auto'
  };

  const previewPaneStyles = {
    flex: viewMode === 'split' ? 1 : viewMode === 'preview' ? 1 : 0,
    display: viewMode === 'editor' ? 'none' : 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  };

  return (
    <div style={containerStyles}>
      {/* Toolbar */}
      <div style={toolbarStyles}>
        <div style={titleStyles}>
          📊 Slide Deck
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => handleViewModeChange('split')}
            style={viewModeButtonStyles(viewMode === 'split')}
          >
            Split
          </button>
          <button
            onClick={() => handleViewModeChange('editor')}
            style={viewModeButtonStyles(viewMode === 'editor')}
          >
            Editor
          </button>
          <button
            onClick={() => handleViewModeChange('preview')}
            style={viewModeButtonStyles(viewMode === 'preview')}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div style={contentStyles}>
        {/* Editor Pane */}
        <div style={editorPaneStyles}>
          <MarkdownEditor
            value={markdown}
            onChange={handleMarkdownChange}
            placeholder="# Your Presentation Title

Start typing your presentation...

Use --- to separate slides

---

## Second Slide

Add content here..."
          />
        </div>

        {/* Preview Pane */}
        <div style={previewPaneStyles}>
          <LivePreview markdown={markdown} theme={theme} />
        </div>
      </div>

      {/* Helper Text */}
      <div
        style={{
          padding: '8px 24px',
          fontSize: '11px',
          color: '#86868B',
          borderTop: '1px solid #D2D2D7',
          backgroundColor: '#FAFAFA'
        }}
      >
        💡 Tip: Use <code style={{ padding: '2px 4px', backgroundColor: '#F5F5F7', borderRadius: '2px' }}>---</code> on a new line to create a new slide
      </div>
    </div>
  );
};

SlideDeckElement.propTypes = {
  elementId: PropTypes.string.isRequired,
  settings: PropTypes.shape({
    markdown: PropTypes.string,
    template: PropTypes.oneOf(['blank', 'pitch-deck', 'technical']),
    theme: PropTypes.string,
    aspectRatio: PropTypes.string
  }),
  onUpdate: PropTypes.func,
  isEditing: PropTypes.bool,
  containerContext: PropTypes.string
};

export default SlideDeckElement;
