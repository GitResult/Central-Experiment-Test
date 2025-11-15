/**
 * BoardPacketPage Component
 *
 * Board meeting packet management system with PDF viewing, annotations, and markers.
 * Follows "Don't Make Me Think" UX principles with three-column layout:
 * - Left: Agenda & Documents
 * - Center: PDF Viewer with Markers
 * - Right: Notes & Annotations
 *
 * Features:
 * - PDF document viewing with zoom controls
 * - Marker overlay system with normalized coordinates (survives zoom/resize)
 * - Document upload and conversion status tracking
 * - Threaded annotations and comments
 * - Agenda-based navigation
 * - Share and download packet functionality
 *
 * Technical Implementation:
 * - Uses normalized coordinates (0-1) for markers to survive zoom
 * - Marker overlay positioned absolutely over PDF pages
 * - Real-time status updates for document conversion
 *
 * @component
 * @returns {React.Component} BoardPacketPage component
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  FileText, Upload, Download, Share2, Plus, Minus, ChevronLeft, ChevronRight,
  Search, Filter, MessageSquare, Check, AlertCircle, Loader2, X, Users,
  Calendar, MapPin, Clock, Eye, Edit3, Trash2, MoreVertical, CheckCircle2,
  Circle, PenTool, MousePointer
} from 'lucide-react';

const BoardPacketPage = () => {
  // Meeting Info
  const [meetingInfo] = useState({
    title: "Q1 2026 Board Meeting",
    date: "March 10, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "HQ Conference Room / Zoom",
    lastUpdated: { by: "Sarah Chen", time: "5 min ago" }
  });

  // Agenda Items
  const [agendaItems] = useState([
    { id: 1, title: "Opening & Minutes", order: 1 },
    { id: 2, title: "Financials", order: 2 },
    { id: 3, title: "Strategy & Risk", order: 3 },
    { id: 4, title: "Operations", order: 4 }
  ]);

  // Documents State
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Q1 Financials v4.xlsx",
      type: "excel",
      agendaId: 2,
      status: "ready",
      pages: 12,
      uploadedAt: new Date()
    },
    {
      id: 2,
      name: "Strategic Plan 2026.pptx",
      type: "powerpoint",
      agendaId: 3,
      status: "ready",
      pages: 25,
      uploadedAt: new Date()
    },
    {
      id: 3,
      name: "Board Minutes - Feb 2026.pdf",
      type: "pdf",
      agendaId: 1,
      status: "ready",
      pages: 8,
      uploadedAt: new Date()
    }
  ]);

  const [currentDocument, setCurrentDocument] = useState(documents[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'annotate'

  // Markers State - using normalized coordinates (0-1)
  const [markers, setMarkers] = useState([
    {
      id: 1,
      documentId: 1,
      page: 3,
      xNorm: 0.45,
      yNorm: 0.32,
      note: "Revenue projection seems conservative. Can we get a breakdown by segment?",
      author: "John Smith",
      status: "open",
      createdAt: new Date(),
      replies: [
        {
          id: 1,
          author: "Sarah Chen",
          text: "I'll have finance prepare detailed segment breakdown for next meeting.",
          createdAt: new Date()
        }
      ]
    },
    {
      id: 2,
      documentId: 1,
      page: 3,
      xNorm: 0.72,
      yNorm: 0.58,
      note: "Operating expenses increased 15% YoY. What's driving this?",
      author: "Maria Garcia",
      status: "open",
      createdAt: new Date(),
      replies: []
    },
    {
      id: 3,
      documentId: 1,
      page: 5,
      xNorm: 0.28,
      yNorm: 0.45,
      note: "Cash flow looks healthy. Good job team!",
      author: "David Lee",
      status: "resolved",
      createdAt: new Date(),
      replies: []
    }
  ]);

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [markerFilter, setMarkerFilter] = useState('all'); // 'all', 'mine', 'unresolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [tempMarker, setTempMarker] = useState(null);

  const pageRef = useRef(null);
  const fileInputRef = useRef(null);

  // Get current document markers
  const currentMarkers = markers.filter(
    m => m.documentId === currentDocument?.id && m.page === currentPage
  );

  // Filter markers for right panel
  const filteredMarkers = markers
    .filter(m => m.documentId === currentDocument?.id)
    .filter(m => {
      if (markerFilter === 'mine') return m.author === 'John Smith'; // Current user
      if (markerFilter === 'unresolved') return m.status === 'open';
      return true;
    })
    .filter(m => {
      if (!searchQuery) return true;
      return m.note.toLowerCase().includes(searchQuery.toLowerCase());
    });

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file, index) => {
      const newDoc = {
        id: Date.now() + index,
        name: file.name,
        type: getFileType(file.name),
        agendaId: 1,
        status: 'converting',
        pages: 0,
        uploadedAt: new Date()
      };

      setDocuments(prev => [...prev, newDoc]);

      // Simulate conversion process
      setTimeout(() => {
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === newDoc.id
              ? { ...doc, status: 'ready', pages: Math.floor(Math.random() * 20) + 5 }
              : doc
          )
        );
      }, 2000 + index * 1000);
    });
  };

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    if (ext === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(ext)) return 'word';
    if (['xls', 'xlsx'].includes(ext)) return 'excel';
    if (['ppt', 'pptx'].includes(ext)) return 'powerpoint';
    return 'file';
  };

  // Handle marker placement
  const handlePageClick = (e) => {
    if (viewMode !== 'annotate') return;

    const rect = pageRef.current.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width;
    const yNorm = (e.clientY - rect.top) / rect.height;

    // Create temporary marker
    const newMarker = {
      id: Date.now(),
      documentId: currentDocument.id,
      page: currentPage,
      xNorm,
      yNorm,
      note: '',
      author: 'John Smith',
      status: 'open',
      createdAt: new Date(),
      replies: []
    };

    setTempMarker(newMarker);
    setIsAddingMarker(true);
  };

  const saveMarker = (note) => {
    if (!note.trim() || !tempMarker) return;

    const finalMarker = { ...tempMarker, note };
    setMarkers(prev => [...prev, finalMarker]);
    setTempMarker(null);
    setIsAddingMarker(false);
    setSelectedMarkerId(finalMarker.id);
  };

  const cancelMarker = () => {
    setTempMarker(null);
    setIsAddingMarker(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

  // Page navigation
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, currentDocument?.pages || 1));

  // Get file icon
  const getFileIcon = (type) => {
    return <FileText className="w-4 h-4" />;
  };

  // Get status badge
  const getStatusBadge = (status) => {
    if (status === 'converting') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
          <Loader2 className="w-3 h-3 animate-spin" />
          Converting...
        </span>
      );
    }
    if (status === 'ready') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
          <CheckCircle2 className="w-3 h-3" />
          Ready
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-red-100 text-red-700">
        <AlertCircle className="w-3 h-3" />
        Error
      </span>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Top Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{meetingInfo.title}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {meetingInfo.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {meetingInfo.time}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {meetingInfo.location}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">
              Last updated by {meetingInfo.lastUpdated.by} · {meetingInfo.lastUpdated.time}
            </span>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4" />
              Share Packet
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Agenda & Documents */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col">
          {/* Agenda Section */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Agenda</h2>
            <div className="space-y-1">
              {agendaItems.map(item => (
                <button
                  key={item.id}
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item.order}. {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Board Packet Materials</h2>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Add documents"
              >
                <Plus className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">No documents yet</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Drop files here or click to upload
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => doc.status === 'ready' && setCurrentDocument(doc)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      currentDocument?.id === doc.id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                    disabled={doc.status !== 'ready'}
                  >
                    <div className="flex items-start gap-2">
                      {getFileIcon(doc.type)}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {getStatusBadge(doc.status)}
                          {doc.status === 'ready' && (
                            <span className="text-xs text-gray-500">{doc.pages} pages</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center - PDF Viewer */}
        <div className="flex-1 flex flex-col bg-gray-100">
          {currentDocument ? (
            <>
              {/* PDF Toolbar */}
              <div className="bg-white border-b border-gray-200 px-6 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{currentDocument.name}</h3>
                  </div>

                  {/* Zoom Controls */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleZoomOut}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        disabled={zoomLevel <= 50}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-medium text-gray-700 w-12 text-center">
                        {zoomLevel}%
                      </span>
                      <button
                        onClick={handleZoomIn}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        disabled={zoomLevel >= 200}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Page Navigation */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrevPage}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        disabled={currentPage <= 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-sm text-gray-700 min-w-[100px] text-center">
                        Page {currentPage} of {currentDocument.pages}
                      </span>
                      <button
                        onClick={handleNextPage}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        disabled={currentPage >= currentDocument.pages}
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => setViewMode('view')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          viewMode === 'view'
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => setViewMode('annotate')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          viewMode === 'annotate'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                      >
                        <PenTool className="w-4 h-4" />
                        Annotate
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* PDF Container with Overlay */}
              <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <div
                    ref={pageRef}
                    onClick={handlePageClick}
                    className={`relative bg-white shadow-lg ${
                      viewMode === 'annotate' ? 'cursor-crosshair' : 'cursor-default'
                    }`}
                    style={{
                      width: '100%',
                      aspectRatio: '8.5 / 11',
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'top center',
                      marginBottom: `${(zoomLevel - 100) * 5}px`
                    }}
                  >
                    {/* PDF Content Placeholder */}
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
                      <div className="text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">PDF Page {currentPage} Preview</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {viewMode === 'annotate'
                            ? 'Click anywhere to add a marker'
                            : 'Switch to Annotate mode to add markers'}
                        </p>
                      </div>
                    </div>

                    {/* Marker Overlay */}
                    <div className="absolute inset-0 pointer-events-none">
                      {currentMarkers.map((marker) => (
                        <div
                          key={marker.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMarkerId(marker.id);
                          }}
                          className="absolute pointer-events-auto"
                          style={{
                            left: `${marker.xNorm * 100}%`,
                            top: `${marker.yNorm * 100}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shadow-lg cursor-pointer transition-transform hover:scale-110 ${
                              selectedMarkerId === marker.id
                                ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                                : marker.status === 'resolved'
                                ? 'bg-green-500 text-white'
                                : 'bg-yellow-500 text-white'
                            }`}
                            title={marker.note}
                          >
                            {markers.filter(m => m.documentId === currentDocument.id).indexOf(marker) + 1}
                          </div>
                        </div>
                      ))}

                      {/* Temporary Marker */}
                      {tempMarker && (
                        <div
                          className="absolute"
                          style={{
                            left: `${tempMarker.xNorm * 100}%`,
                            top: `${tempMarker.yNorm * 100}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-xs shadow-lg animate-pulse">
                            +
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">No document selected</p>
                <p className="text-sm text-gray-500">Select a document from the left panel</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar - Notes & Markers */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Notes & Markers</h2>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-3">
              {[
                { value: 'all', label: 'All' },
                { value: 'mine', label: 'Mine' },
                { value: 'unresolved', label: 'Unresolved' }
              ].map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setMarkerFilter(filter.value)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    markerFilter === filter.value
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search in notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Marker List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMarkers.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No markers yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  {viewMode === 'view'
                    ? 'Switch to Annotate mode to add markers'
                    : 'Click on the document to add a marker'}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredMarkers.map((marker, index) => {
                  const markerNumber = markers.filter(m => m.documentId === currentDocument.id).indexOf(marker) + 1;
                  const isSelected = selectedMarkerId === marker.id;

                  return (
                    <div
                      key={marker.id}
                      onClick={() => {
                        setSelectedMarkerId(marker.id);
                        setCurrentPage(marker.page);
                      }}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-blue-50 border-blue-200'
                          : 'bg-white border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                            marker.status === 'resolved'
                              ? 'bg-green-500 text-white'
                              : 'bg-yellow-500 text-white'
                          }`}
                        >
                          {markerNumber}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 line-clamp-2">{marker.note}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs text-gray-500">
                              Page {marker.page} · {currentDocument?.name}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-600">{marker.author}</span>
                            {marker.status === 'resolved' ? (
                              <span className="inline-flex items-center gap-1 text-xs text-green-700">
                                <CheckCircle2 className="w-3 h-3" />
                                Resolved
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-yellow-700">
                                <Circle className="w-3 h-3" />
                                Open
                              </span>
                            )}
                          </div>

                          {/* Replies */}
                          {marker.replies.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200 space-y-2">
                              {marker.replies.map(reply => (
                                <div key={reply.id} className="text-xs">
                                  <span className="font-medium text-gray-700">{reply.author}:</span>
                                  <p className="text-gray-600 mt-0.5">{reply.text}</p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Actions */}
                          {isSelected && (
                            <div className="flex items-center gap-2 mt-3">
                              <button className="flex-1 px-2 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded transition-colors">
                                Reply
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMarkers(prev =>
                                    prev.map(m =>
                                      m.id === marker.id
                                        ? { ...m, status: m.status === 'open' ? 'resolved' : 'open' }
                                        : m
                                    )
                                  );
                                }}
                                className="flex-1 px-2 py-1 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                              >
                                {marker.status === 'open' ? 'Resolve' : 'Reopen'}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Marker Input Modal */}
      {isAddingMarker && tempMarker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Marker Note</h3>
              <textarea
                autoFocus
                placeholder="What do you want to note here?"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.metaKey) {
                    saveMarker(e.target.value);
                  }
                  if (e.key === 'Escape') {
                    cancelMarker();
                  }
                }}
              />
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs text-gray-500">Press ⌘+Enter to save, Esc to cancel</span>
                <div className="flex gap-2">
                  <button
                    onClick={cancelMarker}
                    className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={(e) => {
                      const textarea = e.target.closest('.bg-white').querySelector('textarea');
                      saveMarker(textarea.value);
                    }}
                    className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Save Marker
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPacketPage;
