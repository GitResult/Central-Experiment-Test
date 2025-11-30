import { Button } from '@central-ux/ui-components';

function Header({ showPalette, showInspector, onTogglePalette, onToggleInspector, workflowName, onWorkflowNameChange }) {
  return (
    <header className="absolute top-0 inset-x-0 z-50">
      <div className="h-14 px-4 flex items-center justify-between bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
        {/* Left: Title + Panel toggles */}
        <div className="flex items-center gap-4">
          <h1 className="text-base font-semibold text-neutral-900">
            Workflow Designer
          </h1>

          {/* Panel toggle buttons */}
          <div className="flex gap-1">
            <button
              onClick={onTogglePalette}
              className={`p-2 rounded-lg transition ${
                showPalette
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              title="Toggle Palette (⌘1)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>

            <button
              onClick={onToggleInspector}
              className={`p-2 rounded-lg transition ${
                showInspector
                  ? 'bg-primary-100 text-primary-600'
                  : 'text-neutral-500 hover:bg-neutral-100'
              }`}
              title="Toggle Inspector (⌘2)"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Center: Workflow name (editable) */}
        <input
          type="text"
          value={workflowName}
          onChange={(e) => onWorkflowNameChange(e.target.value)}
          className="text-sm text-center bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1 max-w-xs"
          placeholder="Untitled Workflow"
        />

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-8 px-4 text-sm">
            Test
          </Button>
          <Button variant="primary" className="h-8 px-4 text-sm">
            Save
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
