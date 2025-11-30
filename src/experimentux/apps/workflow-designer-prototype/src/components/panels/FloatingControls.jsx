import { useReactFlow } from '@xyflow/react';

function FloatingControls() {
  const { zoomIn, zoomOut, fitView, getZoom } = useReactFlow();
  const currentZoom = Math.round(getZoom() * 100);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-3 px-4 py-2 bg-white/90 backdrop-blur-xl border border-neutral-200/50 rounded-full shadow-lg">
        {/* Undo/Redo - placeholder for future implementation */}
        <button
          className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Undo (⌘Z)"
          disabled
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>

        <button
          className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed"
          title="Redo (⌘⇧Z)"
          disabled
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>

        <div className="w-px h-4 bg-neutral-300" />

        {/* Zoom controls */}
        <button
          onClick={() => zoomOut({ duration: 300 })}
          className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition"
          title="Zoom Out (⌘-)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>

        <span className="text-xs text-neutral-600 font-medium min-w-[3rem] text-center">
          {currentZoom}%
        </span>

        <button
          onClick={() => zoomIn({ duration: 300 })}
          className="p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition"
          title="Zoom In (⌘+)"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>

        <div className="w-px h-4 bg-neutral-300" />

        {/* Fit to screen */}
        <button
          onClick={() => fitView({ duration: 300, padding: 0.2 })}
          className="px-3 py-1 text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-full transition"
          title="Fit to Screen (⌘0)"
        >
          Fit to Screen
        </button>
      </div>
    </div>
  );
}

export default FloatingControls;
