import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DataPill } from '../ContentBlockEditor/DataPill';
import { DataSourcePickerModal } from '../DataSourcePickerModal/DataSourcePickerModal';

/**
 * SimpleDeckEditorDemo Component
 *
 * Simplified demonstration of the Hybrid Split-View Editor concept.
 * Shows the three-panel layout with data pills and structured widget configuration.
 *
 * Three Panels:
 * 1. Left: Content editor with text and data pills
 * 2. Right: Visual preview showing rendered content
 * 3. Sidebar: Component palette (simplified for demo)
 *
 * This is a proof-of-concept demonstrating:
 * - Hybrid split-view architecture
 * - Data pills (system-generated, no free-form typing)
 * - Structured data source picker (dropdowns only)
 * - Real-time preview synchronization
 */
export function SimpleDeckEditorDemo({ deckId }) {
  const [contentBlocks, setContentBlocks] = useState([
    {
      id: 'block-1',
      type: 'text',
      content: 'Revenue Growth'
    },
    {
      id: 'block-2',
      type: 'text',
      content: 'Revenue grew 25% YoY driven by EMEA expansion.'
    }
  ]);

  const [editingWidget, setEditingWidget] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState('split'); // 'split', 'editor', 'preview'

  const handleAddWidget = (widgetType) => {
    setEditingWidget({
      type: widgetType,
      config: {},
      isNew: true
    });
  };

  const handleWidgetConfigured = (config) => {
    if (editingWidget.isNew) {
      // Add new widget as data pill
      const newWidget = {
        id: `widget-${Date.now()}`,
        type: 'widget',
        widgetType: editingWidget.type,
        config
      };
      setContentBlocks([...contentBlocks, newWidget]);
    } else {
      // Update existing widget
      setContentBlocks(
        contentBlocks.map((block) =>
          block.id === editingWidget.id
            ? { ...block, config }
            : block
        )
      );
    }
    setEditingWidget(null);
  };

  const handleDeleteWidget = (blockId) => {
    setContentBlocks(contentBlocks.filter((block) => block.id !== blockId));
  };

  const handleTextChange = (blockId, newContent) => {
    setContentBlocks(
      contentBlocks.map((block) =>
        block.id === blockId ? { ...block, content: newContent } : block
      )
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold text-gray-900">Slide Deck Editor Demo</h1>
          <span className="text-sm text-gray-500">Hybrid Split-View Architecture</span>
        </div>

        {/* View Mode Selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedPanel('split')}
            className={`px-3 py-1 text-sm rounded ${
              selectedPanel === 'split'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Split
          </button>
          <button
            onClick={() => setSelectedPanel('editor')}
            className={`px-3 py-1 text-sm rounded ${
              selectedPanel === 'editor'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Editor
          </button>
          <button
            onClick={() => setSelectedPanel('preview')}
            className={`px-3 py-1 text-sm rounded ${
              selectedPanel === 'preview'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Preview
          </button>
        </div>
      </div>

      {/* Three-Panel Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel: Content Editor */}
        {(selectedPanel === 'split' || selectedPanel === 'editor') && (
          <div className={`flex flex-col border-r border-gray-200 ${
            selectedPanel === 'split' ? 'w-1/2' : 'flex-1'
          }`}>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700">Content Editor</h2>
              <p className="text-xs text-gray-500 mt-1">
                Type text or add widgets via buttons below
              </p>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3">
              {contentBlocks.map((block) => (
                <div key={block.id} className="space-y-1">
                  {block.type === 'text' ? (
                    <textarea
                      value={block.content}
                      onChange={(e) => handleTextChange(block.id, e.target.value)}
                      placeholder="Type text..."
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      rows={2}
                    />
                  ) : (
                    <DataPill
                      widget={block}
                      onClick={() => setEditingWidget({ ...block, isNew: false })}
                      onDelete={() => handleDeleteWidget(block.id)}
                    />
                  )}
                </div>
              ))}

              {/* Add Widget Buttons */}
              <div className="pt-4 border-t border-gray-200">
                <div className="text-xs text-gray-500 mb-2">Add Widget:</div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleAddWidget('chart')}
                    className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    📊 Chart
                  </button>
                  <button
                    onClick={() => handleAddWidget('table')}
                    className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    📋 Table
                  </button>
                  <button
                    onClick={() => handleAddWidget('metric')}
                    className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100"
                  >
                    🔢 Metric
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right Panel: Visual Preview */}
        {(selectedPanel === 'split' || selectedPanel === 'preview') && (
          <div className={`flex flex-col ${
            selectedPanel === 'split' ? 'w-1/2' : 'flex-1'
          }`}>
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700">Visual Preview</h2>
              <p className="text-xs text-gray-500 mt-1">
                Real-time rendering of your slide
              </p>
            </div>

            <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-gray-50 to-white">
              <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
                {contentBlocks.map((block) => (
                  <div key={block.id} className="mb-4">
                    {block.type === 'text' ? (
                      <p className={`${
                        block.id === 'block-1'
                          ? 'text-3xl font-bold text-gray-900'
                          : 'text-gray-700'
                      }`}>
                        {block.content || <span className="text-gray-400 italic">Empty text</span>}
                      </p>
                    ) : (
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 bg-blue-50">
                        <div className="text-center">
                          <div className="text-4xl mb-2">
                            {block.widgetType === 'chart' ? '📊' :
                             block.widgetType === 'table' ? '📋' : '🔢'}
                          </div>
                          <div className="text-sm font-medium text-blue-900">
                            {block.widgetType.toUpperCase()} Widget
                          </div>
                          {block.config.dataViewId && (
                            <div className="text-xs text-blue-700 mt-1">
                              Connected to data view
                            </div>
                          )}
                          <div className="text-xs text-blue-600 mt-2">
                            (Live data rendering would appear here)
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

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

SimpleDeckEditorDemo.propTypes = {
  deckId: PropTypes.string
};
