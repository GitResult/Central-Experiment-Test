function PropertiesPanel({ isOpen, selectedNode, onClose, onUpdateNode }) {
  const handleLabelChange = (e) => {
    if (selectedNode && onUpdateNode) {
      onUpdateNode(selectedNode.id, { label: e.target.value });
    }
  };

  return (
    <aside
      className={`
        absolute right-0 top-14 bottom-0 w-96 z-40
        transform transition-transform duration-300 ease-out
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}
    >
      <div className="h-full flex flex-col bg-white/90 backdrop-blur-xl border-l border-neutral-200/50 shadow-xl">
        {/* Panel header */}
        <div className="flex-shrink-0 px-6 py-4 border-b border-neutral-200/50">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-900">
              {selectedNode ? 'Node Properties' : 'Inspector'}
            </h2>
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

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {selectedNode ? (
            <div className="space-y-6">
              {/* Node Type Badge */}
              <div>
                <label className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
                  Node Type
                </label>
                <div className="mt-2">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 border border-primary-200">
                    {selectedNode.type}
                  </span>
                </div>
              </div>

              {/* Node Label */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Node Name
                </label>
                <input
                  type="text"
                  value={selectedNode.data?.label || ''}
                  onChange={handleLabelChange}
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Enter node name"
                />
              </div>

              {/* Action Type (for action nodes) */}
              {selectedNode.type === 'action' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Action Type
                  </label>
                  <select className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition">
                    <option>Send Email</option>
                    <option>Create Record</option>
                    <option>Update Record</option>
                    <option>Call API</option>
                    <option>Run Script</option>
                  </select>
                </div>
              )}

              {/* Delay Duration (for delay nodes) */}
              {selectedNode.type === 'delay' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Delay Duration
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="flex-1 px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="5"
                      defaultValue="5"
                    />
                    <select className="px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition">
                      <option>Seconds</option>
                      <option>Minutes</option>
                      <option>Hours</option>
                      <option>Days</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Decision Condition (for decision nodes) */}
              {selectedNode.type === 'decision' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Condition
                  </label>
                  <textarea
                    className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                    rows="3"
                    placeholder="Enter condition logic..."
                  />
                </div>
              )}

              {/* Node Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2.5 border border-neutral-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none"
                  rows="3"
                  placeholder="Add a description for this node..."
                />
              </div>

              {/* Node Settings */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-3">
                  Settings
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">Enable logging</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">Continue on error</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-2 focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">Send notifications</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            // Empty state
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">No Selection</h3>
              <p className="text-sm text-neutral-500">
                Select a node to view and edit its properties
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}

export default PropertiesPanel;
