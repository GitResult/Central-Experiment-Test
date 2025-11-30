import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { DataPill } from './DataPill';
import { QuickInsertMenu } from './QuickInsertMenu';
import { DataSourcePickerModal } from '../DataSourcePickerModal/DataSourcePickerModal';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * ContentBlockEditor Component
 *
 * Block-based text editor in left panel with data pills for widgets.
 * Users type text or insert widgets via `/` quick-insert menu.
 * Widgets appear as data pills (clickable badges) that open configuration modals.
 *
 * Props:
 * - blocks: array - Content blocks (text or widget)
 * - onChange: function - Callback when blocks change
 */
export function ContentBlockEditor({ blocks, onChange }) {
  const [showQuickInsert, setShowQuickInsert] = useState(false);
  const [quickInsertPosition, setQuickInsertPosition] = useState({ x: 0, y: 0 });
  const [quickInsertBlockIndex, setQuickInsertBlockIndex] = useState(null);
  const [editingWidget, setEditingWidget] = useState(null);
  const editorRef = useRef(null);

  const handleKeyDown = (e, blockIndex) => {
    // Trigger quick insert menu with "/"
    if (e.key === '/' && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      const rect = e.target.getBoundingClientRect();
      setQuickInsertPosition({ x: rect.left, y: rect.bottom });
      setQuickInsertBlockIndex(blockIndex);
      setShowQuickInsert(true);
      trackEvent(SLIDE_DECK_EVENTS.QUICK_INSERT_OPENED);
    }

    // Create new block with Enter
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const newBlocks = [
        ...blocks.slice(0, blockIndex + 1),
        { id: `block_${Date.now()}`, type: 'text', content: '' },
        ...blocks.slice(blockIndex + 1)
      ];
      onChange(newBlocks);
    }

    // Delete empty block with Backspace
    if (e.key === 'Backspace' && blocks[blockIndex].content === '' && blocks.length > 1) {
      e.preventDefault();
      const newBlocks = blocks.filter((_, i) => i !== blockIndex);
      onChange(newBlocks);
    }
  };

  const handleTextChange = (blockIndex, content) => {
    const newBlocks = blocks.map((block, i) =>
      i === blockIndex ? { ...block, content } : block
    );
    onChange(newBlocks);
  };

  const handleInsertWidget = (widgetType) => {
    setShowQuickInsert(false);
    setEditingWidget({
      type: widgetType,
      config: {},
      isNew: true,
      insertAtIndex: quickInsertBlockIndex
    });
    trackEvent(SLIDE_DECK_EVENTS.WIDGET_INSERT_INITIATED, { widgetType });
  };

  const handleWidgetConfigured = (config) => {
    if (editingWidget.isNew) {
      // Add new widget at specific index
      const newWidget = {
        id: `widget_${Date.now()}`,
        type: 'widget',
        widgetType: editingWidget.type,
        config
      };
      const insertIndex = editingWidget.insertAtIndex !== null
        ? editingWidget.insertAtIndex + 1
        : blocks.length;
      const newBlocks = [
        ...blocks.slice(0, insertIndex),
        newWidget,
        ...blocks.slice(insertIndex)
      ];
      onChange(newBlocks);
      trackEvent(SLIDE_DECK_EVENTS.WIDGET_INSERTED, {
        widgetType: editingWidget.type
      });
    } else {
      // Update existing widget
      const newBlocks = blocks.map((block) =>
        block.id === editingWidget.id ? { ...block, config } : block
      );
      onChange(newBlocks);
      trackEvent(SLIDE_DECK_EVENTS.WIDGET_CONFIGURED, {
        widgetType: editingWidget.widgetType
      });
    }
    setEditingWidget(null);
  };

  const handleDeleteWidget = (blockId) => {
    const newBlocks = blocks.filter((block) => block.id !== blockId);
    onChange(newBlocks);
    trackEvent(SLIDE_DECK_EVENTS.WIDGET_DELETED);
  };

  const handleEditWidget = (widget) => {
    setEditingWidget({ ...widget, isNew: false });
  };

  return (
    <div className="flex flex-col h-full" ref={editorRef}>
      {/* Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">Content Editor</h2>
        <p className="text-xs text-gray-500 mt-1">
          Type <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">/</kbd> to insert widgets
        </p>
      </div>

      {/* Content Blocks */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {blocks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-2">Start typing to add content</p>
            <p className="text-sm">
              Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-xs">/</kbd> to insert a widget
            </p>
          </div>
        )}

        {blocks.map((block, index) => (
          <div key={block.id} className="space-y-1">
            {block.type === 'text' ? (
              <textarea
                value={block.content}
                onChange={(e) => handleTextChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                placeholder="Type text or / for widgets..."
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
                aria-label="Text block"
              />
            ) : (
              <DataPill
                widget={block}
                onClick={() => handleEditWidget(block)}
                onDelete={() => handleDeleteWidget(block.id)}
              />
            )}
          </div>
        ))}
      </div>

      {/* Quick Insert Menu */}
      {showQuickInsert && (
        <QuickInsertMenu
          position={quickInsertPosition}
          onSelect={handleInsertWidget}
          onClose={() => setShowQuickInsert(false)}
        />
      )}

      {/* Data Source Picker Modal */}
      {editingWidget && (
        <DataSourcePickerModal
          isOpen={true}
          widgetType={editingWidget.type || editingWidget.widgetType}
          currentConfig={editingWidget.config}
          onSave={handleWidgetConfigured}
          onClose={() => setEditingWidget(null)}
        />
      )}
    </div>
  );
}

ContentBlockEditor.propTypes = {
  blocks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['text', 'widget']).isRequired,
      content: PropTypes.string, // for text blocks
      widgetType: PropTypes.oneOf(['chart', 'table', 'metric']), // for widgets
      config: PropTypes.object // widget configuration
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired
};
