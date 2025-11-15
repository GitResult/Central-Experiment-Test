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
 * - Real PDF document viewing with react-pdf
 * - Marker overlay system with normalized coordinates (survives zoom/resize)
 * - Document upload and conversion status tracking
 * - Threaded annotations with @mentions
 * - Mention autocomplete and hover cards
 * - Agenda creation with PDF upload
 * - Share and download packet functionality
 *
 * @component
 * @returns {React.Component} BoardPacketPage component
 */

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { PDFDocument, rgb, degrees } from 'pdf-lib';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  FileText, Upload, Download, Share2, Plus, Minus, ChevronLeft, ChevronRight,
  Search, Filter, MessageSquare, Check, AlertCircle, Loader2, X, Users,
  Calendar, MapPin, Clock, Eye, Edit3, Trash2, MoreVertical, CheckCircle2,
  Circle, PenTool, MousePointer, Send, AtSign, Mail, Briefcase
} from 'lucide-react';

// Configure PDF.js worker - using the recommended approach for Create React App
// This ensures version matching between pdf.js and the worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

// Mock users for mentions
const AVAILABLE_USERS = [
  { id: 1, name: 'John Smith', designation: 'Board Chair', email: 'john.smith@company.com' },
  { id: 2, name: 'Sarah Chen', designation: 'CFO', email: 'sarah.chen@company.com' },
  { id: 3, name: 'Maria Garcia', designation: 'Board Member', email: 'maria.garcia@company.com' },
  { id: 4, name: 'David Lee', designation: 'CEO', email: 'david.lee@company.com' },
  { id: 5, name: 'Emily Johnson', designation: 'Board Secretary', email: 'emily.johnson@company.com' },
  { id: 6, name: 'Michael Brown', designation: 'COO', email: 'michael.brown@company.com' }
];

const BoardPacketPage = () => {
  // Meeting Info
  const [meetingInfo] = useState({
    title: "Q1 2026 Board Meeting",
    date: "March 10, 2026",
    time: "3:00 PM - 5:00 PM",
    location: "HQ Conference Room / Zoom",
    lastUpdated: { by: "Sarah Chen", time: "5 min ago" }
  });

  // Agenda Items State
  const [agendaItems, setAgendaItems] = useState([
    { id: 1, title: "Opening & Minutes", order: 1 },
    { id: 2, title: "Financials", order: 2 },
    { id: 3, title: "Strategy & Risk", order: 3 },
    { id: 4, title: "Operations", order: 4 }
  ]);

  const [showNewAgendaForm, setShowNewAgendaForm] = useState(false);
  const [newAgendaTitle, setNewAgendaTitle] = useState('');

  // Documents State - First document is the uploaded PDF
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Board of Directors Dashboard.pdf",
      type: "pdf",
      agendaId: 1,
      status: "ready",
      pages: null, // Will be set when PDF loads
      pdfPath: "/Board-of-Directors-Dashboard.pdf",
      uploadedAt: new Date()
    },
    {
      id: 2,
      name: "Q1 Financials v4.xlsx",
      type: "excel",
      agendaId: 2,
      status: "ready",
      pages: 12,
      uploadedAt: new Date()
    },
    {
      id: 3,
      name: "Strategic Plan 2026.pptx",
      type: "powerpoint",
      agendaId: 3,
      status: "ready",
      pages: 25,
      uploadedAt: new Date()
    }
  ]);

  const [currentDocument, setCurrentDocument] = useState(documents[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'annotate'
  const [showShareModal, setShowShareModal] = useState(false);
  const [activeAgendaId, setActiveAgendaId] = useState(null);

  // Markers State - using normalized coordinates (0-1)
  const [markers, setMarkers] = useState([
    {
      id: 1,
      documentId: 1,
      page: 1,
      xNorm: 0.75,
      yNorm: 0.35,
      note: "Great revenue growth! @Sarah Chen can you provide more details on Q4 performance?",
      author: "John Smith",
      authorId: 1,
      status: "open",
      createdAt: new Date(),
      replies: [
        {
          id: 1,
          author: "Sarah Chen",
          authorId: 2,
          text: "Sure @John Smith! I'll prepare a detailed breakdown for next week. cc @Maria Garcia",
          createdAt: new Date(),
          mentions: [{ id: 1, name: "John Smith" }, { id: 3, name: "Maria Garcia" }]
        }
      ]
    },
    {
      id: 2,
      documentId: 1,
      page: 1,
      xNorm: 0.25,
      yNorm: 0.65,
      note: "Customer satisfaction metrics look strong. @David Lee what's driving this improvement?",
      author: "Maria Garcia",
      authorId: 3,
      status: "open",
      createdAt: new Date(),
      replies: []
    }
  ]);

  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [markerFilter, setMarkerFilter] = useState('all'); // 'all', 'mine', 'unresolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [tempMarker, setTempMarker] = useState(null);

  // Reply state
  const [replyText, setReplyText] = useState('');
  const [showMentionSuggestions, setShowMentionSuggestions] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [mentionCursorPosition, setMentionCursorPosition] = useState(null);
  const [hoveredMention, setHoveredMention] = useState(null);
  const [mentionHoverPosition, setMentionHoverPosition] = useState({ x: 0, y: 0 });

  const pageRef = useRef(null);
  const fileInputRef = useRef(null);
  const replyInputRef = useRef(null);
  const pageContainerRef = useRef(null);

  // Get current document markers
  const currentMarkers = markers.filter(
    m => m.documentId === currentDocument?.id && m.page === currentPage
  );

  // Filter markers for right panel
  const filteredMarkers = markers
    .filter(m => m.documentId === currentDocument?.id)
    .filter(m => {
      if (markerFilter === 'mine') return m.authorId === 1; // Current user ID
      if (markerFilter === 'unresolved') return m.status === 'open';
      return true;
    })
    .filter(m => {
      if (!searchQuery) return true;
      return m.note.toLowerCase().includes(searchQuery.toLowerCase());
    })
    .filter(m => {
      if (!activeAgendaId) return true;
      const doc = documents.find(d => d.id === m.documentId);
      return doc?.agendaId === activeAgendaId;
    });

  // Compute marker counts by document
  const markerCountsByDoc = useMemo(() => {
    const counts = {};
    markers.forEach(m => {
      if (!counts[m.documentId]) counts[m.documentId] = { total: 0, open: 0 };
      counts[m.documentId].total += 1;
      if (m.status === 'open') counts[m.documentId].open += 1;
    });
    return counts;
  }, [markers]);

  // Open markers for current document
  const openMarkersForDoc = useMemo(() => {
    if (!currentDocument) return [];
    return markers
      .filter(m => m.documentId === currentDocument.id && m.status === 'open')
      .sort((a, b) => a.page - b.page || a.createdAt - b.createdAt);
  }, [markers, currentDocument]);

  const openMarkersOnPage = useMemo(() => {
    return openMarkersForDoc.filter(m => m.page === currentPage);
  }, [openMarkersForDoc, currentPage]);

  // PDF loading handlers
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    // Update document with actual page count
    setDocuments(prev =>
      prev.map(doc =>
        doc.id === currentDocument.id ? { ...doc, pages: numPages } : doc
      )
    );
  };

  // Handle file upload
  const handleFileUpload = (e, agendaId = null) => {
    const files = Array.from(e.target.files);

    files.forEach((file, index) => {
      const isPdf = file.type === 'application/pdf';
      const newDoc = {
        id: Date.now() + index,
        name: file.name,
        type: getFileType(file.name),
        agendaId: agendaId || 1,
        status: isPdf ? 'converting' : 'converting',
        pages: 0,
        pdfPath: isPdf ? URL.createObjectURL(file) : null,
        uploadedAt: new Date()
      };

      setDocuments(prev => [...prev, newDoc]);

      // Simulate conversion process
      setTimeout(() => {
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === newDoc.id
              ? { ...doc, status: 'ready', pages: isPdf ? null : Math.floor(Math.random() * 20) + 5 }
              : doc
          )
        );

        // Auto-select the newly uploaded document if it's a PDF
        if (isPdf) {
          setCurrentDocument({
            ...newDoc,
            status: 'ready',
            pages: null, // Will be filled by onDocumentLoadSuccess
          });
          setCurrentPage(1);
        }
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
    if (viewMode !== 'annotate' || !pageContainerRef.current) return;

    const rect = pageContainerRef.current.getBoundingClientRect();
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
      authorId: 1,
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

  // Handle reply with mentions
  const handleReplyTextChange = (e) => {
    const text = e.target.value;
    setReplyText(text);

    // Check for @ mention
    const cursorPos = e.target.selectionStart;
    const textBeforeCursor = text.slice(0, cursorPos);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');

    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.slice(lastAtIndex + 1);
      // Check if there's a space after @
      if (!textAfterAt.includes(' ')) {
        setMentionSearch(textAfterAt);
        setMentionCursorPosition(lastAtIndex);
        setShowMentionSuggestions(true);
      } else {
        setShowMentionSuggestions(false);
      }
    } else {
      setShowMentionSuggestions(false);
    }
  };

  const insertMention = (user) => {
    if (mentionCursorPosition === null) return;

    const beforeMention = replyText.slice(0, mentionCursorPosition);
    const afterMention = replyText.slice(mentionCursorPosition + mentionSearch.length + 1);
    const newText = `${beforeMention}@${user.name} ${afterMention}`;

    setReplyText(newText);
    setShowMentionSuggestions(false);
    setMentionSearch('');
    setMentionCursorPosition(null);

    // Focus back on input
    if (replyInputRef.current) {
      replyInputRef.current.focus();
    }
  };

  const sendReply = () => {
    if (!replyText.trim() || !selectedMarkerId) return;

    // Extract mentions from reply text
    const mentionRegex = /@(\w+\s\w+)/g;
    const mentions = [];
    let match;
    while ((match = mentionRegex.exec(replyText)) !== null) {
      const userName = match[1];
      const user = AVAILABLE_USERS.find(u => u.name === userName);
      if (user) {
        mentions.push({ id: user.id, name: user.name });
      }
    }

    const newReply = {
      id: Date.now(),
      author: 'John Smith',
      authorId: 1,
      text: replyText,
      createdAt: new Date(),
      mentions
    };

    setMarkers(prev =>
      prev.map(m =>
        m.id === selectedMarkerId
          ? { ...m, replies: [...m.replies, newReply] }
          : m
      )
    );

    setReplyText('');
  };

  const handleMentionHover = (mention, event) => {
    const user = AVAILABLE_USERS.find(u => u.name === mention);
    if (user) {
      setHoveredMention(user);
      setMentionHoverPosition({ x: event.clientX, y: event.clientY });
    }
  };

  const handleMentionLeave = () => {
    setHoveredMention(null);
  };

  // Render mention with hover card
  const renderTextWithMentions = (text) => {
    const parts = text.split(/(@\w+\s\w+)/g);
    return parts.map((part, index) => {
      if (part.startsWith('@')) {
        const userName = part.slice(1);
        const user = AVAILABLE_USERS.find(u => u.name === userName);
        return (
          <span
            key={index}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onMouseEnter={(e) => handleMentionHover(userName, e)}
            onMouseLeave={handleMentionLeave}
          >
            {part}
          </span>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  // Filtered mention suggestions
  const filteredMentionSuggestions = AVAILABLE_USERS.filter(user =>
    user.name.toLowerCase().includes(mentionSearch.toLowerCase())
  );

  // Create new agenda
  const handleCreateAgenda = () => {
    if (!newAgendaTitle.trim()) return;

    const newAgenda = {
      id: Date.now(),
      title: newAgendaTitle,
      order: agendaItems.length + 1
    };

    setAgendaItems(prev => [...prev, newAgenda]);
    setNewAgendaTitle('');
    setShowNewAgendaForm(false);
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));

  // Page navigation
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, numPages || currentDocument?.pages || 1));

  // Navigate to next open marker
  const goToNextOpenMarker = () => {
    if (!currentDocument || openMarkersForDoc.length === 0) return;

    const currentIndex = openMarkersForDoc.findIndex(m => m.id === selectedMarkerId);
    const next = openMarkersForDoc[(currentIndex + 1) % openMarkersForDoc.length];

    setCurrentPage(next.page);
    setSelectedMarkerId(next.id);
  };

  // Export PDF with embedded annotations
  const exportPDFWithAnnotations = async (doc) => {
    try {
      if (!doc || !doc.pdfPath) {
        alert('No PDF document selected');
        return;
      }

      // Fetch the original PDF
      const existingPdfBytes = await fetch(doc.pdfPath).then(res => res.arrayBuffer());

      // Load the PDF with pdf-lib
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      // Get markers for this document
      const docMarkers = markers.filter(m => m.documentId === doc.id);

      // Add annotations to each page
      for (const marker of docMarkers) {
        const pageIndex = marker.page - 1; // pdf-lib uses 0-based indexing
        if (pageIndex < 0 || pageIndex >= pages.length) continue;

        const page = pages[pageIndex];
        const { width, height } = page.getSize();

        // Convert normalized coordinates to PDF coordinates
        // PDF coordinates: origin at bottom-left, Y increases upward
        const x = marker.xNorm * width;
        const y = height - (marker.yNorm * height); // Flip Y axis

        // Draw a circle marker
        const markerRadius = 12;
        const markerColor = marker.status === 'resolved'
          ? rgb(0.13, 0.77, 0.33) // green
          : rgb(0.96, 0.73, 0.19); // yellow/orange

        page.drawCircle({
          x: x,
          y: y,
          size: markerRadius,
          borderColor: markerColor,
          borderWidth: 2,
          color: rgb(1, 1, 1),
          opacity: 0.9,
        });

        // Add marker number
        const markerNumber = docMarkers.indexOf(marker) + 1;
        page.drawText(markerNumber.toString(), {
          x: x - 4,
          y: y - 4,
          size: 10,
          color: rgb(0, 0, 0),
        });

        // Add annotation text as a text box nearby
        const annotationX = Math.min(x + 20, width - 200);
        const annotationY = Math.max(y - 20, 100);
        const maxWidth = 180;

        // Draw annotation background
        page.drawRectangle({
          x: annotationX,
          y: annotationY - 40,
          width: maxWidth,
          height: 60,
          color: rgb(1, 0.98, 0.9),
          borderColor: rgb(0.9, 0.7, 0.4),
          borderWidth: 1,
        });

        // Add author and note text
        page.drawText(`${marker.author}:`, {
          x: annotationX + 5,
          y: annotationY - 15,
          size: 8,
          color: rgb(0, 0, 0),
          maxWidth: maxWidth - 10,
        });

        // Truncate long notes
        const noteText = marker.note.length > 100
          ? marker.note.substring(0, 97) + '...'
          : marker.note;

        page.drawText(noteText, {
          x: annotationX + 5,
          y: annotationY - 30,
          size: 7,
          color: rgb(0.2, 0.2, 0.2),
          maxWidth: maxWidth - 10,
        });
      }

      // Save the modified PDF
      const pdfBytes = await pdfDoc.save();

      // Create a blob and download
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${doc.name.replace('.pdf', '')}_annotated.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      alert('PDF with embedded annotations downloaded successfully!');
    } catch (error) {
      console.error('Error exporting PDF with annotations:', error);
      alert('Failed to export PDF with annotations. Please try again.');
    }
  };

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

  const selectedMarker = markers.find(m => m.id === selectedMarkerId);

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
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Agenda</h2>
              <button
                onClick={() => setShowNewAgendaForm(!showNewAgendaForm)}
                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Add agenda item"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* New Agenda Form */}
            {showNewAgendaForm && (
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <input
                  type="text"
                  placeholder="New agenda item title..."
                  value={newAgendaTitle}
                  onChange={(e) => setNewAgendaTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleCreateAgenda();
                    if (e.key === 'Escape') {
                      setShowNewAgendaForm(false);
                      setNewAgendaTitle('');
                    }
                  }}
                  className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateAgenda}
                    className="flex-1 px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
                  >
                    Add Item
                  </button>
                  <button
                    onClick={() => {
                      setShowNewAgendaForm(false);
                      setNewAgendaTitle('');
                    }}
                    className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
                <div className="mt-2">
                  <label className="block text-xs text-gray-600 mb-1">Attach PDF (optional):</label>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleFileUpload(e, agendaItems.length + 1)}
                    className="block w-full text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              {agendaItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveAgendaId(activeAgendaId === item.id ? null : item.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                    activeAgendaId === item.id
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.order}. {item.title}
                </button>
              ))}
            </div>
          </div>

          {/* Documents Section */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Board Meeting Materials</h2>
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
                    onClick={() => {
                      if (doc.status === 'ready') {
                        setCurrentDocument(doc);
                        setCurrentPage(1);
                      }
                    }}
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
                          {doc.status === 'ready' && doc.pages && (
                            <span className="text-xs text-gray-500">{doc.pages} pages</span>
                          )}
                          {markerCountsByDoc[doc.id] && (
                            <span className="text-xs text-orange-600">
                              {markerCountsByDoc[doc.id].open} open / {markerCountsByDoc[doc.id].total} notes
                            </span>
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
          {currentDocument && currentDocument.type === 'pdf' ? (
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
                        Page {currentPage} of {numPages || currentDocument.pages || '?'}
                      </span>
                      <button
                        onClick={handleNextPage}
                        className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
                        disabled={currentPage >= (numPages || currentDocument.pages || 1)}
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
                      <button
                        onClick={() => setShowShareModal(true)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share
                      </button>
                      <button
                        onClick={() => exportPDFWithAnnotations(currentDocument)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white bg-green-600 hover:bg-green-700 transition-colors"
                        title="Download PDF with embedded annotations"
                      >
                        <Download className="w-4 h-4" />
                        Export PDF
                      </button>
                    </div>
                  </div>
                </div>

                {/* Open Items Summary Strip */}
                {openMarkersForDoc.length > 0 && (
                  <div className="px-6 py-2 bg-orange-50 border-t border-orange-100">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-orange-700">
                        <strong>{openMarkersForDoc.length}</strong> open note{openMarkersForDoc.length !== 1 ? 's' : ''} ·{' '}
                        <strong>{openMarkersOnPage.length}</strong> on this page
                      </span>
                      <button
                        onClick={goToNextOpenMarker}
                        className="text-orange-600 hover:text-orange-800 font-medium hover:underline"
                      >
                        Go to next open →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* PDF Container with Overlay */}
              <div className="flex-1 overflow-auto p-8">
                <div className="max-w-4xl mx-auto">
                  <div
                    ref={pageContainerRef}
                    onClick={handlePageClick}
                    className={`relative inline-block ${
                      viewMode === 'annotate' ? 'cursor-crosshair' : 'cursor-default'
                    }`}
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: 'top center',
                    }}
                  >
                    {/* PDF Rendering */}
                    <Document
                      file={currentDocument.pdfPath}
                      onLoadSuccess={onDocumentLoadSuccess}
                      loading={
                        <div className="flex items-center justify-center bg-white shadow-lg" style={{ width: 800, height: 1035 }}>
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                        </div>
                      }
                    >
                      <Page
                        pageNumber={currentPage}
                        width={800}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    </Document>

                    {/* Marker Overlay */}
                    <div className="absolute inset-0 pointer-events-none z-10">
                      {currentMarkers.map((marker) => (
                        <div
                          key={marker.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMarkerId(marker.id);
                          }}
                          className="absolute pointer-events-auto cursor-pointer"
                          style={{
                            left: `${marker.xNorm * 100}%`,
                            top: `${marker.yNorm * 100}%`,
                            transform: 'translate(-50%, -50%)',
                          }}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shadow-lg transition-all hover:scale-110 ${
                              selectedMarkerId === marker.id
                                ? 'bg-blue-600 text-white ring-4 ring-blue-200 animate-pulse'
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
                          className="absolute pointer-events-none"
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
          ) : currentDocument ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-1">Non-PDF Document</p>
                <p className="text-sm text-gray-500">
                  {currentDocument.name} - Preview not available for {currentDocument.type} files
                </p>
              </div>
            </div>
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
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
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

          {/* Marker List / Detail View */}
          <div className="flex-1 overflow-y-auto">
            {selectedMarker ? (
              /* Detailed Marker View */
              <div className="p-4">
                <button
                  onClick={() => setSelectedMarkerId(null)}
                  className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to all markers
                </button>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                        selectedMarker.status === 'resolved'
                          ? 'bg-green-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}
                    >
                      {markers.filter(m => m.documentId === currentDocument.id).indexOf(selectedMarker) + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-gray-900">{selectedMarker.author}</p>
                          <p className="text-xs text-gray-500">
                            Page {selectedMarker.page} · {selectedMarker.createdAt.toLocaleDateString()}
                          </p>
                        </div>
                        {selectedMarker.status === 'resolved' ? (
                          <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" />
                            Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                            <Circle className="w-3 h-3" />
                            Open
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-wrap">
                        {renderTextWithMentions(selectedMarker.note)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-gray-200">
                    <button
                      onClick={() => {
                        setMarkers(prev =>
                          prev.map(m =>
                            m.id === selectedMarker.id
                              ? { ...m, status: m.status === 'open' ? 'resolved' : 'open' }
                              : m
                          )
                        );
                      }}
                      className="flex-1 px-3 py-1.5 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                    >
                      {selectedMarker.status === 'open' ? 'Mark Resolved' : 'Reopen'}
                    </button>
                    <button
                      onClick={() => {
                        setMarkers(prev => prev.filter(m => m.id !== selectedMarker.id));
                        setSelectedMarkerId(null);
                      }}
                      className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Replies */}
                <div className="space-y-3 mb-4">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Replies ({selectedMarker.replies.length})
                  </h3>

                  {selectedMarker.replies.map(reply => (
                    <div key={reply.id} className="bg-white border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
                          {reply.author.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{reply.author}</p>
                          <p className="text-xs text-gray-500">{reply.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 ml-10 whitespace-pre-wrap">
                        {renderTextWithMentions(reply.text)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Reply Input */}
                <div className="relative">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 relative">
                      <textarea
                        ref={replyInputRef}
                        value={replyText}
                        onChange={handleReplyTextChange}
                        placeholder="Write a reply... Use @ to mention someone"
                        className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={3}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                            sendReply();
                          }
                        }}
                      />
                      <button
                        onClick={sendReply}
                        disabled={!replyText.trim()}
                        className="absolute bottom-2 right-2 p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Send (⌘+Enter)"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Mention Suggestions */}
                  {showMentionSuggestions && filteredMentionSuggestions.length > 0 && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-10">
                      {filteredMentionSuggestions.map(user => (
                        <button
                          key={user.id}
                          onClick={() => insertMention(user)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">{user.designation}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-2">
                  Press ⌘+Enter to send • Use @ to mention
                </p>
              </div>
            ) : filteredMarkers.length === 0 ? (
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

                  return (
                    <button
                      key={marker.id}
                      onClick={() => {
                        setSelectedMarkerId(marker.id);
                        setCurrentPage(marker.page);
                      }}
                      className="w-full text-left p-3 rounded-lg border border-gray-200 hover:border-gray-300 bg-white transition-colors"
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
                              Page {marker.page}
                            </span>
                            <span className="text-xs text-gray-400">·</span>
                            <span className="text-xs text-gray-500">{marker.author}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            {marker.replies.length > 0 && (
                              <span className="text-xs text-blue-600">
                                {marker.replies.length} {marker.replies.length === 1 ? 'reply' : 'replies'}
                              </span>
                            )}
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
                        </div>
                      </div>
                    </button>
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
                placeholder="What do you want to note here? Use @ to mention someone"
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

      {/* Mention Hover Card */}
      {hoveredMention && (
        <div
          className="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72"
          style={{
            left: `${mentionHoverPosition.x + 10}px`,
            top: `${mentionHoverPosition.y - 80}px`,
          }}
        >
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-semibold flex-shrink-0">
              {hoveredMention.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{hoveredMention.name}</h4>
              <div className="space-y-1 mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  <span>{hoveredMention.designation}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{hoveredMention.email}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Share Board Meeting</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                Share these board meeting materials with others
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }}
                  className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Search className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Copy Link</p>
                    <p className="text-xs text-gray-500">Share via link to anyone</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    const subject = encodeURIComponent(meetingInfo.title);
                    const body = encodeURIComponent(`Please review the board meeting materials for ${meetingInfo.title}\n\nDate: ${meetingInfo.date}\nTime: ${meetingInfo.time}\nLocation: ${meetingInfo.location}`);
                    window.location.href = `mailto:?subject=${subject}&body=${body}`;
                    setShowShareModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-xs text-gray-500">Send via email client</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    if (currentDocument && currentDocument.type === 'pdf') {
                      exportPDFWithAnnotations(currentDocument);
                      setShowShareModal(false);
                    } else {
                      alert('Please select a PDF document first');
                    }
                  }}
                  className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Export Current PDF</p>
                    <p className="text-xs text-gray-500">Download with embedded annotations</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    alert('Download feature would download all documents as a ZIP file');
                    setShowShareModal(false);
                  }}
                  className="w-full flex items-center gap-3 p-4 text-left border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Download className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">Download Package</p>
                    <p className="text-xs text-gray-500">Download all documents as ZIP</p>
                  </div>
                </button>
              </div>

              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  <strong>Note:</strong> Recipients will need appropriate permissions to view these board meeting materials.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardPacketPage;
