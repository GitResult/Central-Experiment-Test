function NodePalettePanel({ isOpen, onClose, insertMode = false, onAddNode, onExitInsertMode }) {
  const nodeTypes = [
    {
      category: 'Triggers',
      items: [
        {
          type: 'start',
          label: 'Start',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-green-50 text-green-600',
        },
      ],
    },
    {
      category: 'Actions',
      items: [
        {
          type: 'action',
          label: 'Action',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
          color: 'bg-blue-50 text-blue-600',
        },
        {
          type: 'delay',
          label: 'Delay',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-purple-50 text-purple-600',
        },
      ],
    },
    {
      category: 'Logic',
      items: [
        {
          type: 'decision',
          label: 'Decision',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-amber-50 text-amber-600',
        },
      ],
    },
    {
      category: 'Completion',
      items: [
        {
          type: 'end',
          label: 'End',
          icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
            </svg>
          ),
          color: 'bg-red-50 text-red-600',
        },
      ],
    },
  ];

  const onDragStart = (event, nodeType, nodeLabel) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.setData('nodeLabel', nodeLabel);
    event.dataTransfer.effectAllowed = 'move';
  };

  const handleItemClick = (nodeType) => {
    if (insertMode && onAddNode) {
      onAddNode(nodeType);
    }
  };

  return (
    <aside
      className={`
        absolute left-0 top-14 bottom-0 w-80 z-40
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="h-full flex flex-col bg-white/90 backdrop-blur-xl border-r border-neutral-200/50 shadow-xl">
        {/* Panel header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-neutral-200/50">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">Components</h2>
            <button
              onClick={onClose}
              className="p-1 text-neutral-500 hover:text-neutral-900 rounded hover:bg-neutral-100 transition"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Insert mode banner */}
        {insertMode && (
          <div className="flex-shrink-0 px-6 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <p className="text-xs font-medium text-blue-900">
                Insert Mode: Click components to add them sequentially
              </p>
            </div>
          </div>
        )}

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {nodeTypes.map((category, idx) => (
            <div key={category.category} className={idx > 0 ? 'mt-6' : ''}>
              <h3 className="text-xs font-medium text-neutral-500 uppercase tracking-wide mb-3">
                {category.category}
              </h3>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <div
                    key={item.type}
                    draggable={!insertMode}
                    onDragStart={(e) => onDragStart(e, item.type, item.label)}
                    onClick={() => handleItemClick(item.type)}
                    className={`flex items-center gap-3 p-3 bg-white border border-neutral-200 rounded-lg transition-all duration-200 ${
                      insertMode
                        ? 'cursor-pointer hover:bg-blue-50 hover:border-blue-300 hover:shadow-md'
                        : 'cursor-move hover:shadow-md hover:border-neutral-300'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.color}`}>
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-neutral-900">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Panel footer */}
        <div className="flex-shrink-0 border-t border-neutral-200/50 px-6 py-4">
          {insertMode ? (
            <div className="space-y-3">
              <p className="text-xs text-neutral-500">
                Click components above to add them sequentially
              </p>
              <button
                onClick={onExitInsertMode}
                className="w-full px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors duration-200"
              >
                Exit Insert Mode
              </button>
            </div>
          ) : (
            <p className="text-xs text-neutral-500">
              Drag components to the canvas to build your workflow
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}

export default NodePalettePanel;
