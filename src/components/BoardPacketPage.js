import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  StickyNote,
  CheckCircle2,
  X,
  Share2,
  Download
} from 'lucide-react';

const mockAgenda = [
  '1. Opening & Minutes',
  '2. Financials',
  '3. Strategy & Risk',
  '4. Operations & KPIs',
];

let markerIdCounter = 1;

const BoardPacketPage = () => {
  const [documents, setDocuments] = useState([]);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [mode, setMode] = useState('view'); // 'view' | 'annotate'
  const [markers, setMarkers] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const fileInputRef = useRef(null);
  const pageRef = useRef(null);

  const currentDoc = documents.find(d => d.id === currentDocId) || null;
  const currentMarkers = markers.filter(m => m.docId === currentDocId && m.page === currentPage);

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newDocs = files.map(file => ({
      id: `${Date.now()}-${file.name}`,
      name: file.name,
      status: 'converting', // 'converting' | 'ready' | 'error'
      type: file.name.split('.').pop()?.toLowerCase() || 'file',
      // In real implementation, you would call backend to convert and return PDF URL.
      pdfUrl: null,
    }));

    setDocuments(prev => [...prev, ...newDocs]);

    // Simulate conversion complete
    setTimeout(() => {
      setDocuments(prev =>
        prev.map(d =>
          newDocs.some(nd => nd.id === d.id)
            ? { ...d, status: 'ready', pdfUrl: '/sample.pdf' } // replace with actual URL
            : d
        )
      );
      if (!currentDocId && newDocs[0]) {
        setCurrentDocId(newDocs[0].id);
      }
    }, 800);
  };

  const handleZoomChange = (delta) => {
    setZoom(prev => {
      const next = Math.min(2, Math.max(0.5, prev + delta));
      return Number(next.toFixed(2));
    });
  };

  const handlePageClick = (e) => {
    if (mode !== 'annotate' || !currentDoc) return;
    if (!pageRef.current) return;

    const rect = pageRef.current.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width;
    const yNorm = (e.clientY - rect.top) / rect.height;

    const newMarker = {
      id: markerIdCounter++,
      docId: currentDoc.id,
      page: currentPage,
      xNorm: Math.min(1, Math.max(0, xNorm)),
      yNorm: Math.min(1, Math.max(0, yNorm)),
      note: '',
      status: 'open',
    };

    setMarkers(prev => [...prev, newMarker]);
    setSelectedMarkerId(newMarker.id);
  };

  const handleMarkerNoteChange = (id, note) => {
    setMarkers(prev =>
      prev.map(m => (m.id === id ? { ...m, note } : m))
    );
  };

  const handleMarkerStatusToggle = (id) => {
    setMarkers(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, status: m.status === 'open' ? 'resolved' : 'open' }
          : m
      )
    );
  };

  const handleDeleteMarker = (id) => {
    setMarkers(prev => prev.filter(m => m.id !== id));
    if (selectedMarkerId === id) setSelectedMarkerId(null);
  };

  const selectedMarker = markers.find(m => m.id === selectedMarkerId) || null;

  return (
    <div className="h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="border-b bg-white px-6 py-3 flex items-center justify-between">
        <div>
          <div className="text-lg font-semibold">Q1 2026 Board Meeting</div>
          <div className="text-xs text-slate-500">
            Mar 10, 3:00–5:00 PM · HQ / Zoom
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1 text-xs px-3 py-1.5 border rounded-full hover:bg-slate-50">
            <Share2 className="w-4 h-4" />
            Share packet
          </button>
          <button className="inline-flex items-center gap-1 text-xs px-3 py-1.5 border rounded-full hover:bg-slate-50">
            <Download className="w-4 h-4" />
            Download all
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Agenda & docs */}
        <aside className="w-72 border-r bg-white flex flex-col">
          <div className="p-4 border-b">
            <div className="text-xs font-semibold text-slate-500 uppercase mb-2">
              Agenda
            </div>
            <ul className="space-y-1 text-xs">
              {mockAgenda.map(item => (
                <li key={item} className="truncate text-slate-700">
                  • {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border-b flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-500 uppercase">
              Board packet materials
            </div>
            <button
              onClick={handleUploadClick}
              className="inline-flex items-center gap-1 text-[11px] px-2 py-1 border rounded-full hover:bg-slate-50"
            >
              <Upload className="w-3 h-3" />
              Add
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFilesSelected}
              accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
            />
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-2">
            {documents.length === 0 && (
              <div className="text-xs text-slate-500 border border-dashed rounded-md p-3 text-center">
                No documents yet. <br />
                Click <span className="font-medium">Add</span> or drag files here.
              </div>
            )}
            {documents.map(doc => (
              <button
                key={doc.id}
                onClick={() => setCurrentDocId(doc.id)}
                className={`w-full flex items-start gap-2 rounded-md border px-2 py-2 text-left text-xs hover:bg-slate-50 ${
                  currentDocId === doc.id ? 'border-sky-500 bg-sky-50' : 'border-slate-200'
                }`}
              >
                <div className="mt-0.5">
                  <FileText className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium text-slate-800">
                    {doc.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {doc.status === 'converting' && 'Converting to PDF…'}
                    {doc.status === 'ready' && 'Ready to view'}
                    {doc.status === 'error' && 'Conversion failed'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Center: PDF & overlay */}
        <main className="flex-1 flex flex-col">
          {/* Toolbar */}
          <div className="border-b bg-white px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-medium text-sm">
                {currentDoc ? currentDoc.name : 'Select a document'}
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              {/* Zoom */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleZoomChange(-0.1)}
                  className="p-1 border rounded hover:bg-slate-50 disabled:opacity-40"
                  disabled={!currentDoc}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="w-12 text-center text-slate-600">
                  {Math.round(zoom * 100)}%
                </span>
                <button
                  onClick={() => handleZoomChange(0.1)}
                  className="p-1 border rounded hover:bg-slate-50 disabled:opacity-40"
                  disabled={!currentDoc}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>

              {/* Page navigation (stubbed) */}
              <div className="flex items-center gap-1">
                <button
                  className="p-1 border rounded hover:bg-slate-50 disabled:opacity-40"
                  disabled={!currentDoc || currentPage <= 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="w-20 text-center text-slate-600">
                  Page {currentPage}
                </span>
                <button
                  className="p-1 border rounded hover:bg-slate-50 disabled:opacity-40"
                  disabled={!currentDoc}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mode toggle */}
              <div className="flex items-center border rounded-full overflow-hidden text-[11px]">
                <button
                  onClick={() => setMode('view')}
                  className={`px-3 py-1 ${
                    mode === 'view'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  View
                </button>
                <button
                  onClick={() => setMode('annotate')}
                  className={`px-3 py-1 flex items-center gap-1 ${
                    mode === 'annotate'
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  <StickyNote className="w-3 h-3" />
                  Annotate
                </button>
              </div>

              {mode === 'annotate' && currentDoc && (
                <div className="text-[11px] text-slate-500">
                  Click anywhere on the page to add a marker.
                </div>
              )}
            </div>
          </div>

          {/* PDF area */}
          <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-4">
            {!currentDoc && (
              <div className="text-xs text-slate-500 text-center max-w-xs">
                Select a document on the left to start reviewing.
              </div>
            )}

            {currentDoc && (
              <div
                className="bg-white shadow-md rounded-md overflow-hidden relative"
                style={{
                  width: `${zoom * 800}px`,
                  height: `${zoom * 1000}px`,
                  transition: 'width 0.15s ease, height 0.15s ease',
                }}
                onClick={handlePageClick}
                ref={pageRef}
              >
                {/* This is where your PDF canvas/component goes. */}
                <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-[11px] text-slate-400 select-none">
                  PDF page {currentPage} preview
                  <br />
                  (replace this with real PDF rendering)
                </div>

                {/* Marker overlay */}
                {currentMarkers.map(marker => (
                  <button
                    key={marker.id}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-1.5 py-0.5 text-[10px] flex items-center gap-1 ${
                      marker.status === 'open'
                        ? 'bg-amber-50 border-amber-400 text-amber-700'
                        : 'bg-emerald-50 border-emerald-400 text-emerald-700'
                    } ${selectedMarkerId === marker.id ? 'ring-2 ring-sky-400' : ''}`}
                    style={{
                      left: `${marker.xNorm * 100}%`,
                      top: `${marker.yNorm * 100}%`,
                    }}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMarkerId(marker.id);
                    }}
                  >
                    <StickyNote className="w-3 h-3" />
                    #{marker.id}
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>

        {/* Right: Notes & markers */}
        <aside className="w-80 border-l bg-white flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase">
                Notes & markers
              </div>
              <div className="text-[11px] text-slate-400">
                {currentMarkers.length} on this page
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-3 space-y-2">
            {currentMarkers.length === 0 && (
              <div className="text-xs text-slate-500 border border-dashed rounded-md p-3 text-center">
                No markers on this page.
                {mode === 'annotate' && (
                  <>
                    <br />
                    Click on the document to add one.
                  </>
                )}
              </div>
            )}

            {currentMarkers.map(marker => (
              <button
                key={marker.id}
                onClick={() => setSelectedMarkerId(marker.id)}
                className={`w-full text-left border rounded-md px-2 py-2 text-xs flex items-start gap-2 hover:bg-slate-50 ${
                  selectedMarkerId === marker.id ? 'border-sky-500 bg-sky-50' : 'border-slate-200'
                }`}
              >
                <div className="mt-0.5">
                  <StickyNote className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-800">
                      Marker #{marker.id}
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        marker.status === 'open'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {marker.status === 'open' ? 'Open' : 'Resolved'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Page {marker.page}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-700 line-clamp-2">
                    {marker.note || 'No note yet – click to add.'}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Marker detail editor */}
          {selectedMarker && (
            <div className="border-t p-3 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold text-slate-600">
                  Marker #{selectedMarker.id} · Page {selectedMarker.page}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    className="p-1 rounded hover:bg-slate-100"
                    onClick={() => handleMarkerStatusToggle(selectedMarker.id)}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </button>
                  <button
                    className="p-1 rounded hover:bg-slate-100"
                    onClick={() => handleDeleteMarker(selectedMarker.id)}
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>
              <textarea
                className="w-full text-xs border rounded-md px-2 py-1.5 resize-none h-20 focus:outline-none focus:ring-1 focus:ring-sky-400"
                placeholder="Add or edit note for this marker…"
                value={selectedMarker.note}
                onChange={(e) =>
                  handleMarkerNoteChange(selectedMarker.id, e.target.value)
                }
              />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};

export default BoardPacketPage;
