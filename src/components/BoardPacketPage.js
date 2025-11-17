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

import React, { useState, useRef, useMemo } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  FileText, Download, Share2, Plus, Minus, ChevronLeft, ChevronRight,
  Search, MessageSquare, AlertCircle, Loader2, X,
  Calendar, MapPin, Clock, Eye, CheckCircle2,
  Circle, PenTool, Send, Mail, Briefcase, Pencil, GripVertical
} from 'lucide-react';
import { convertToPDF, isSupportedFileType } from '../utils/documentConverter';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Sortable Agenda Item Component
const SortableAgendaItem = ({
  item,
  itemDocCount,
  isSelected,
  isEditing,
  editTitle,
  editDescription,
  editDuration,
  editPresenter,
  onSelect,
  onEdit,
  onFileUpload,
  onEditTitleChange,
  onEditDescriptionChange,
  onEditDurationChange,
  onEditPresenterChange,
  onSaveEdit,
  onCancelEdit
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="space-y-2">
      {/* Agenda Item Button */}
      <button
        onClick={onSelect}
        className={`w-full text-left px-3 py-2 rounded-lg transition-all ${
          isSelected
            ? 'bg-blue-50 border-2 border-blue-300'
            : 'border border-transparent hover:bg-gray-50 hover:border-gray-200'
        }`}
      >
        <div className="flex items-start justify-between">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="mr-2 mt-0.5 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-4 h-4" />
          </div>

          <div className="flex-1">
            <div className={`text-sm font-medium ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
              {item.order}. {item.title}
            </div>
            {item.duration && (
              <div className="text-xs text-gray-500 mt-0.5">
                <Clock className="w-3 h-3 inline mr-1" />
                {item.duration}
                {item.presenter && ` • ${item.presenter}`}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 ml-2">
            {/* Edit Icon */}
            <button
              onClick={onEdit}
              className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
              title="Edit agenda item"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            {/* File Count */}
            {itemDocCount > 0 && (
              <span className={`px-2 py-0.5 text-xs rounded-full ${
                isSelected
                  ? 'bg-blue-200 text-blue-800'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {itemDocCount}
              </span>
            )}
          </div>
        </div>
      </button>

      {/* Expanded Detail View - Edit Mode */}
      {isSelected && isEditing && (
        <div className="ml-3 p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Agenda item title..."
              value={editTitle}
              onChange={(e) => onEditTitleChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onClick={(e) => e.stopPropagation()}
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              placeholder="Agenda item description..."
              value={editDescription}
              onChange={(e) => onEditDescriptionChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Duration
              </label>
              <input
                type="text"
                placeholder="e.g., 15 min"
                value={editDuration}
                onChange={(e) => onEditDurationChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Presenter
              </label>
              <input
                type="text"
                placeholder="Presenter name"
                value={editPresenter}
                onChange={(e) => onEditPresenterChange(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSaveEdit();
              }}
              disabled={!editTitle.trim()}
              className="flex-1 px-3 py-1.5 text-xs text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed rounded transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCancelEdit();
              }}
              className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Expanded Detail View - Normal Mode */}
      {isSelected && !isEditing && (
        <div className="ml-3 space-y-2 pb-1">
          {item.description && (
            <div className="px-3 py-2 bg-white rounded border border-blue-200">
              <p className="text-sm text-gray-700">
                {item.description}
              </p>
            </div>
          )}

          {/* Upload File Button for Agenda */}
          <button
            onClick={onFileUpload}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-blue-600 bg-white border-2 border-dashed border-blue-300 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Files
          </button>
        </div>
      )}
    </div>
  );
};

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
    {
      id: 1,
      title: "Opening & Minutes",
      order: 1,
      description: "Review and approve previous meeting minutes. Opening remarks from the Chair.",
      duration: "15 min",
      presenter: "John Smith"
    },
    {
      id: 2,
      title: "Financials",
      order: 2,
      description: "Q1 2026 financial performance review, budget variance analysis, and cash flow update.",
      duration: "30 min",
      presenter: "Sarah Chen"
    },
    {
      id: 3,
      title: "Strategy & Risk",
      order: 3,
      description: "2026 strategic initiatives update, risk assessment, and competitive landscape review.",
      duration: "45 min",
      presenter: "David Lee"
    },
    {
      id: 4,
      title: "Operations",
      order: 4,
      description: "Operational metrics, customer satisfaction, and key performance indicators.",
      duration: "20 min",
      presenter: "Michael Brown"
    }
  ]);

  const [showNewAgendaForm, setShowNewAgendaForm] = useState(false);
  const [newAgendaTitle, setNewAgendaTitle] = useState('');
  const [newAgendaDescription, setNewAgendaDescription] = useState('');
  const [newAgendaDuration, setNewAgendaDuration] = useState('');
  const [newAgendaPresenter, setNewAgendaPresenter] = useState('');
  const [selectedAgendaId, setSelectedAgendaId] = useState(null);

  // Edit Agenda State
  const [editingAgendaId, setEditingAgendaId] = useState(null);
  const [editAgendaTitle, setEditAgendaTitle] = useState('');
  const [editAgendaDescription, setEditAgendaDescription] = useState('');
  const [editAgendaDuration, setEditAgendaDuration] = useState('');
  const [editAgendaPresenter, setEditAgendaPresenter] = useState('');

  // Documents State - First document is the uploaded PDF
  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "CPA ANNUAL REPORT 2024-EN-FINAL.pdf",
      type: "pdf",
      agendaId: 1,
      status: "ready",
      pages: null, // Will be set when PDF loads
      pdfPath: "/CPA ANNUAL REPORT 2024-EN-FINAL.pdf",
      uploadedAt: new Date(),
      progress: 100
    },
    {
      id: 2,
      name: "Q1 Financials v4.xlsx",
      type: "excel",
      agendaId: 2,
      status: "ready",
      pages: 12,
      uploadedAt: new Date(),
      progress: 100
    },
    {
      id: 3,
      name: "Strategic Plan 2026.pptx",
      type: "powerpoint",
      agendaId: 3,
      status: "ready",
      pages: 25,
      uploadedAt: new Date(),
      progress: 100
    }
  ]);

  const [currentDocument, setCurrentDocument] = useState(documents[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const [numPages, setNumPages] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'annotate'
  const [showShareModal, setShowShareModal] = useState(false);

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
      if (!selectedAgendaId) return true;
      const doc = documents.find(d => d.id === m.documentId);
      return doc?.agendaId === selectedAgendaId;
    });

  // Get documents for selected agenda
  const agendaDocuments = selectedAgendaId
    ? documents.filter(doc => doc.agendaId === selectedAgendaId)
    : documents;

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

  // Handle file upload with real conversion
  const handleFileUpload = async (e, agendaId = null) => {
    const files = Array.from(e.target.files);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Check if file type is supported
      if (!isSupportedFileType(file.name)) {
        alert(`File type not supported: ${file.name}`);
        continue;
      }

      const newDoc = {
        id: Date.now() + i,
        name: file.name,
        type: getFileType(file.name),
        agendaId: agendaId || 1,
        status: 'converting',
        pages: 0,
        pdfPath: null,
        uploadedAt: new Date(),
        progress: 0,
        originalFile: file
      };

      // Add document to list
      setDocuments(prev => [...prev, newDoc]);

      // Convert to PDF
      try {
        const pdfBlob = await convertToPDF(file, (progress) => {
          // Update progress
          setDocuments(prev =>
            prev.map(doc =>
              doc.id === newDoc.id
                ? { ...doc, progress }
                : doc
            )
          );
        });

        // Create object URL for the PDF
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Update document with PDF
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === newDoc.id
              ? {
                  ...doc,
                  type: 'pdf', // Update type to PDF after conversion
                  status: 'ready',
                  pdfPath: pdfUrl,
                  progress: 100,
                  pages: null // Will be set by onDocumentLoadSuccess
                }
              : doc
          )
        );

        // Auto-select the first uploaded document
        if (i === 0) {
          setCurrentDocument({
            ...newDoc,
            type: 'pdf', // Update type to PDF after conversion
            status: 'ready',
            pdfPath: pdfUrl,
            progress: 100,
            pages: null
          });
          setCurrentPage(1);
        }
      } catch (error) {
        console.error('Conversion failed:', error);

        // Update document with error status
        setDocuments(prev =>
          prev.map(doc =>
            doc.id === newDoc.id
              ? {
                  ...doc,
                  status: 'error',
                  progress: 0,
                  errorMessage: error.message
                }
              : doc
          )
        );
      }
    }
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
      description: newAgendaDescription,
      duration: newAgendaDuration,
      presenter: newAgendaPresenter,
      order: agendaItems.length + 1
    };

    setAgendaItems(prev => [...prev, newAgenda]);
    setNewAgendaTitle('');
    setNewAgendaDescription('');
    setNewAgendaDuration('');
    setNewAgendaPresenter('');
    setShowNewAgendaForm(false);
  };

  // Edit Agenda Functions
  const handleStartEditAgenda = (item, e) => {
    e.stopPropagation(); // Prevent triggering the select button
    // Select the agenda item if not already selected
    if (selectedAgendaId !== item.id) {
      setSelectedAgendaId(item.id);
    }
    // Set edit mode and populate form fields
    setEditingAgendaId(item.id);
    setEditAgendaTitle(item.title);
    setEditAgendaDescription(item.description || '');
    setEditAgendaDuration(item.duration || '');
    setEditAgendaPresenter(item.presenter || '');
  };

  const handleSaveEditAgenda = () => {
    if (!editAgendaTitle.trim()) return;

    setAgendaItems(prev =>
      prev.map(item =>
        item.id === editingAgendaId
          ? {
              ...item,
              title: editAgendaTitle,
              description: editAgendaDescription,
              duration: editAgendaDuration,
              presenter: editAgendaPresenter
            }
          : item
      )
    );

    setEditingAgendaId(null);
    setEditAgendaTitle('');
    setEditAgendaDescription('');
    setEditAgendaDuration('');
    setEditAgendaPresenter('');
  };

  const handleCancelEditAgenda = () => {
    setEditingAgendaId(null);
    setEditAgendaTitle('');
    setEditAgendaDescription('');
    setEditAgendaDuration('');
    setEditAgendaPresenter('');
  };

  // Drag and Drop for Agenda Items
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setAgendaItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        // Reorder the array
        const reorderedItems = arrayMove(items, oldIndex, newIndex);

        // Update order property to match new positions
        return reorderedItems.map((item, index) => ({
          ...item,
          order: index + 1
        }));
      });
    }
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

  // Get file icon
  const getFileIcon = (type) => {
    return <FileText className="w-4 h-4" />;
  };

  // Get status badge
  const getStatusBadge = (doc) => {
    if (doc.status === 'converting') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
          <Loader2 className="w-3 h-3 animate-spin" />
          Converting... {doc.progress}%
        </span>
      );
    }
    if (doc.status === 'ready') {
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
        {doc.errorMessage || 'Error'}
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
            <button className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4" />
              Download All
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Agenda & Documents */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
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
              <div className="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200 space-y-2">
                <input
                  type="text"
                  placeholder="Agenda item title..."
                  value={newAgendaTitle}
                  onChange={(e) => setNewAgendaTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <textarea
                  placeholder="Description (optional)..."
                  value={newAgendaDescription}
                  onChange={(e) => setNewAgendaDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Duration (e.g., 15 min)"
                    value={newAgendaDuration}
                    onChange={(e) => setNewAgendaDuration(e.target.value)}
                    className="px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Presenter"
                    value={newAgendaPresenter}
                    onChange={(e) => setNewAgendaPresenter(e.target.value)}
                    className="px-3 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-2 pt-1">
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
                      setNewAgendaDescription('');
                      setNewAgendaDuration('');
                      setNewAgendaPresenter('');
                    }}
                    className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100 rounded transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Agenda List with Inline Detail View - Drag and Drop Enabled */}
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={agendaItems.map(item => item.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-1">
                  {agendaItems.map(item => {
                    const itemDocCount = documents.filter(d => d.agendaId === item.id).length;
                    const isSelected = selectedAgendaId === item.id;
                    const isEditing = editingAgendaId === item.id;

                    return (
                      <SortableAgendaItem
                        key={item.id}
                        item={item}
                        itemDocCount={itemDocCount}
                        isSelected={isSelected}
                        isEditing={isEditing}
                        editTitle={editAgendaTitle}
                        editDescription={editAgendaDescription}
                        editDuration={editAgendaDuration}
                        editPresenter={editAgendaPresenter}
                        onSelect={() => setSelectedAgendaId(isSelected ? null : item.id)}
                        onEdit={(e) => handleStartEditAgenda(item, e)}
                        onFileUpload={(e) => {
                          e.stopPropagation();
                          const input = document.createElement('input');
                          input.type = 'file';
                          input.multiple = true;
                          input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx';
                          input.onchange = (e) => handleFileUpload(e, selectedAgendaId);
                          input.click();
                        }}
                        onEditTitleChange={setEditAgendaTitle}
                        onEditDescriptionChange={setEditAgendaDescription}
                        onEditDurationChange={setEditAgendaDuration}
                        onEditPresenterChange={setEditAgendaPresenter}
                        onSaveEdit={handleSaveEditAgenda}
                        onCancelEdit={handleCancelEditAgenda}
                      />
                    );
                  })}
                </div>
              </SortableContext>
            </DndContext>
          </div>

          {/* Documents Section */}
          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">
                {selectedAgendaId ? `Files (${agendaDocuments.length})` : 'All Materials'}
              </h2>
              {!selectedAgendaId && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Add documents"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {agendaDocuments.length === 0 ? (
              <div className="text-center py-8 px-4 border-2 border-dashed border-gray-300 rounded-lg">
                <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-1">
                  {selectedAgendaId ? 'No files for this agenda item' : 'No documents yet'}
                </p>
                {selectedAgendaId ? (
                  <p className="text-xs text-gray-500">
                    Use the button above to add files
                  </p>
                ) : (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Drop files here or click to upload
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {agendaDocuments.map(doc => (
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
                          {getStatusBadge(doc)}
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
                      {currentMarkers.map((marker) => {
                        const markerNumber = markers.filter(m => m.documentId === currentDocument.id).indexOf(marker) + 1;
                        const isSelected = selectedMarkerId === marker.id;

                        return (
                          <div
                            key={marker.id}
                            className="absolute pointer-events-auto"
                            style={{
                              left: `${marker.xNorm * 100}%`,
                              top: `${marker.yNorm * 100}%`,
                              transform: 'translate(-50%, -50%)',
                            }}
                          >
                            {/* Marker Pin */}
                            <div
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedMarkerId(isSelected ? null : marker.id);
                              }}
                              className="cursor-pointer relative z-20"
                            >
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-xs shadow-lg transition-all hover:scale-110 ${
                                  isSelected
                                    ? 'bg-blue-600 text-white ring-4 ring-blue-200'
                                    : marker.status === 'resolved'
                                    ? 'bg-green-500 text-white hover:ring-2 hover:ring-green-200'
                                    : 'bg-yellow-500 text-white hover:ring-2 hover:ring-yellow-200'
                                }`}
                              >
                                {markerNumber}
                              </div>
                            </div>
                          </div>
                        );
                      })}

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

        {/* Right Sidebar - Comments List */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-sm font-semibold text-gray-900 mb-3">
              Comments ({filteredMarkers.length})
            </h2>

            {/* Filter Tabs */}
            <div className="flex gap-1 mb-3">
              {[
                { value: 'all', label: 'All' },
                { value: 'mine', label: 'Mine' },
                { value: 'unresolved', label: 'Open' }
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
                placeholder="Search comments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto">
            {filteredMarkers.length === 0 ? (
              <div className="p-8 text-center">
                <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No comments yet</p>
                <p className="text-xs text-gray-500 mt-1">
                  {viewMode === 'view'
                    ? 'Switch to Annotate mode to add comments'
                    : 'Click on the document to add a comment'}
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {filteredMarkers.map((marker, index) => {
                  const markerNumber = markers.filter(m => m.documentId === currentDocument.id).indexOf(marker) + 1;
                  const isSelected = selectedMarkerId === marker.id;

                  return (
                    <div key={marker.id} className="space-y-2">
                      {/* Comment Card */}
                      <button
                        onClick={() => {
                          setSelectedMarkerId(isSelected ? null : marker.id);
                          if (!isSelected) setCurrentPage(marker.page);
                        }}
                        className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : marker.status === 'resolved'
                                ? 'bg-green-500 text-white'
                                : 'bg-yellow-500 text-white'
                            }`}
                          >
                            {markerNumber}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-gray-900">{marker.author}</span>
                              {marker.status === 'resolved' ? (
                                <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Resolved
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-xs text-yellow-700 bg-yellow-100 px-1.5 py-0.5 rounded-full">
                                  <Circle className="w-3 h-3" />
                                  Open
                                </span>
                              )}
                            </div>
                            <p className={`text-sm ${isSelected ? 'text-gray-900' : 'text-gray-900 line-clamp-2'}`}>
                              {isSelected ? renderTextWithMentions(marker.note) : marker.note}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                              <span>Page {marker.page}</span>
                              <span>·</span>
                              <span>{marker.createdAt.toLocaleDateString()}</span>
                              {marker.replies.length > 0 && (
                                <>
                                  <span>·</span>
                                  <span className="text-blue-600">
                                    {marker.replies.length} {marker.replies.length === 1 ? 'reply' : 'replies'}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>

                      {/* Expanded Detail View */}
                      {isSelected && (
                        <div className="ml-8 space-y-3 pb-2">
                          {/* Replies */}
                          {marker.replies.length > 0 && (
                            <div className="space-y-2">
                              {marker.replies.map(reply => (
                                <div key={reply.id} className="bg-white border border-gray-200 rounded-lg p-3">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="text-xs font-medium text-gray-900">{reply.author}</span>
                                    <span className="text-xs text-gray-500">
                                      {reply.createdAt.toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {renderTextWithMentions(reply.text)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Input */}
                          <div className="relative">
                            <textarea
                              ref={replyInputRef}
                              value={replyText}
                              onChange={handleReplyTextChange}
                              placeholder="Write a reply... Use @ to mention"
                              className="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                              rows={2}
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

                            {/* Mention Suggestions */}
                            {showMentionSuggestions && filteredMentionSuggestions.length > 0 && (
                              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto z-20">
                                {filteredMentionSuggestions.map(user => (
                                  <button
                                    key={user.id}
                                    onClick={() => insertMention(user)}
                                    className="w-full text-left px-3 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                                  >
                                    <div className="flex items-center gap-2">
                                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-xs font-medium text-gray-900">{user.name}</p>
                                        <p className="text-xs text-gray-500">{user.designation}</p>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setMarkers(prev =>
                                  prev.map(m =>
                                    m.id === marker.id
                                      ? { ...m, status: m.status === 'open' ? 'resolved' : 'open' }
                                      : m
                                  )
                                );
                              }}
                              className="flex-1 px-3 py-1.5 text-xs text-white bg-green-600 hover:bg-green-700 rounded transition-colors"
                            >
                              {marker.status === 'open' ? 'Mark Resolved' : 'Reopen'}
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm('Delete this comment?')) {
                                  setMarkers(prev => prev.filter(m => m.id !== marker.id));
                                  setSelectedMarkerId(null);
                                }
                              }}
                              className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 border border-red-200 rounded transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
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
