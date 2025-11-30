/**
 * PageCanvas Component
 * Dedicated editor view for pages created via the Pages panel
 * Uses DynamicColumnLayout for proper drag-and-drop and editing support
 */

import { useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useDroppable } from '@dnd-kit/core';
import { theme } from '../../config/theme';
import { usePagesStore } from '../../store/pagesStore';
import { useEditorStore } from '../../store/editorStore';
import { DynamicColumnLayout } from '../layout/DynamicColumnLayout';
import { EmptyCanvasState } from './EmptyCanvasState';

// Map quick-start element types to actual editorStore element definitions
const ELEMENT_TYPE_MAP = {
  frame: {
    type: 'structure',
    data: {},
    settings: {
      structure: { structureType: 'card' },
      appearance: { background: '{{theme.colors.background}}', borderColor: '{{theme.colors.border.default}}' },
      layout: { padding: '{{theme.spacing.lg}}' }
    },
    elements: []
  },
  text: {
    type: 'markup',
    data: { content: 'Start typing...' },
    settings: {
      markup: { markupType: 'paragraph' },
      typography: { fontSize: '{{theme.typography.fontSize.base}}' }
    }
  },
  image: {
    type: 'markup',
    data: { content: '', src: '' },
    settings: {
      markup: { markupType: 'image' },
      layout: { width: '100%' }
    }
  },
  list: {
    type: 'markup',
    data: { content: '• Item 1\n• Item 2\n• Item 3' },
    settings: {
      markup: { markupType: 'list' }
    }
  },
  shape: {
    type: 'structure',
    data: {},
    settings: {
      structure: { structureType: 'canvas' },
      appearance: { background: '{{theme.colors.primary[100]}}' },
      layout: { width: '100px', height: '100px' }
    }
  }
};

// Drop zone for empty canvas - allows dropping first element
function EmptyDropZone({ zoneId, pageKey }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `empty-dropzone-${pageKey}`,
    data: {
      zoneId,
      rowIndex: 0,
      columnIndex: 0,
      elementIndex: 0,
      pageKey
    }
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1,
        pointerEvents: 'auto',
        backgroundColor: isOver ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
        border: isOver ? '2px dashed #3b82f6' : '2px dashed transparent',
        transition: 'all 150ms ease'
      }}
    >
      {isOver && (
        <div
          style={{
            padding: `${theme.spacing[4]} ${theme.spacing[6]}`,
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderRadius: theme.borderRadius.lg,
            color: theme.colors.primary[600],
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium
          }}
        >
          Drop element here
        </div>
      )}
    </div>
  );
}

export function PageCanvas() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Pages store (for page metadata)
  const pagesStorePages = usePagesStore((state) => state.pages);
  const selectPage = usePagesStore((state) => state.selectPage);
  const markPageHasContent = usePagesStore((state) => state.markPageHasContent);

  // Editor store
  const ensurePage = useEditorStore((state) => state.ensurePage);
  const addElement = useEditorStore((state) => state.addElement);

  // Derive pageKey from slug
  const pageKey = slug || 'untitled';

  // Get page from editor store (this is where content lives)
  const editorPage = useEditorStore((state) => state.pages[pageKey]);

  // Find page metadata by slug
  const decodedSlug = '/' + (slug || '');
  const pageMetadata = pagesStorePages.find(p => p.slug === decodedSlug);
  const pageId = pageMetadata?.id;
  const pageName = pageMetadata?.name || 'Untitled';

  // Initialize editor page when component mounts or page changes
  useEffect(() => {
    if (pageId) {
      // Select in pages store (for metadata tracking)
      selectPage(pageId);
    }

    // Ensure page exists in editor store and set as current
    ensurePage(pageKey, pageName);
    useEditorStore.setState({ currentPageKey: pageKey });

    // Cleanup: clear currentPageKey when leaving
    return () => {
      useEditorStore.setState({ currentPageKey: null });
    };
  }, [pageId, pageKey, pageName, selectPage, ensurePage]);

  // Get page settings from editor store
  const mainZone = editorPage?.zones?.[0];
  const zoneId = mainZone?.id || 'main-content';
  const firstRow = mainZone?.rows?.[0];
  const containerWidth = mainZone?.containerWidth || 'standard';
  const columnGap = firstRow?.columnGap || 24;
  const contentPadding = firstRow?.contentPadding || 24;
  const elementsVerticalGap = firstRow?.elementsVerticalGap || 16;

  // Check if page has elements
  const hasElements = mainZone?.rows?.some(row =>
    row.columns?.some(col => col.elements?.length > 0)
  );

  // Container width mapping
  const containerMaxWidth = {
    narrow: '600px',
    standard: '900px',
    wide: '1200px',
    full: '100%'
  }[containerWidth] || '900px';

  // Handle element addition from quick-start buttons
  const handleAddElement = useCallback((elementType) => {
    if (pageMetadata) {
      markPageHasContent(pageMetadata.id);
    }

    const elementDef = ELEMENT_TYPE_MAP[elementType];
    if (elementDef) {
      // Add element to the page using pageKey
      addElement(zoneId, 0, 0, { ...elementDef }, pageKey, 0);
    }
  }, [pageMetadata, markPageHasContent, addElement, zoneId, pageKey]);

  // Handle command palette
  const handleOpenCommandPalette = useCallback(() => {
    useEditorStore.getState().openSidebar('elements');
  }, []);

  // Page not found in pagesStore
  if (!pageMetadata) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 64px)',
          fontFamily: theme.typography.fontFamily.sans
        }}
      >
        <h2
          style={{
            fontSize: theme.typography.fontSize.xl,
            fontWeight: theme.typography.fontWeight.semibold,
            color: theme.colors.text.primary,
            marginBottom: theme.spacing[2]
          }}
        >
          Page not found
        </h2>
        <p
          style={{
            fontSize: theme.typography.fontSize.sm,
            color: theme.colors.text.tertiary,
            marginBottom: theme.spacing[6]
          }}
        >
          The page "{decodedSlug}" doesn't exist.
        </p>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: theme.spacing[2],
            padding: `${theme.spacing[2]} ${theme.spacing[4]}`,
            backgroundColor: theme.colors.primary[500],
            color: theme.colors.text.inverse,
            border: 'none',
            borderRadius: theme.borderRadius.md,
            fontSize: theme.typography.fontSize.sm,
            fontWeight: theme.typography.fontWeight.medium,
            cursor: 'pointer',
            transition: `all ${theme.transitions.fast}`
          }}
        >
          <ArrowLeft size={16} />
          Go home
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        height: 'calc(100vh - 64px)',
        overflow: 'auto',
        backgroundColor: theme.colors.surface,
        fontFamily: theme.typography.fontFamily.sans
      }}
    >
      {/* Page content area */}
      <div
        className="mx-auto"
        style={{
          maxWidth: containerMaxWidth,
          padding: `${contentPadding}px`,
          minHeight: '100%'
        }}
      >
        {/* Page title - editable */}
        <div style={{ marginBottom: theme.spacing[6] }}>
          <h1
            style={{
              fontSize: theme.typography.fontSize['2xl'],
              fontWeight: theme.typography.fontWeight.bold,
              color: theme.colors.text.primary,
              margin: 0,
              marginBottom: theme.spacing[1]
            }}
          >
            {pageName}
          </h1>
          <span
            style={{
              fontSize: theme.typography.fontSize.sm,
              color: theme.colors.text.tertiary,
              fontFamily: theme.typography.fontFamily.mono
            }}
          >
            {pageMetadata.slug}
          </span>
        </div>

        {/* Canvas content */}
        <div
          style={{
            position: 'relative',
            minHeight: '400px',
            backgroundColor: theme.colors.background.primary,
            borderRadius: theme.borderRadius.lg,
            border: `1px solid ${theme.colors.border.default}`,
            padding: theme.spacing[6]
          }}
        >
          {hasElements ? (
            // Render elements using DynamicColumnLayout
            <DynamicColumnLayout
              zoneId={zoneId}
              rowIndex={0}
              pageKey={pageKey}
              columnGap={columnGap}
              elementsVerticalGap={elementsVerticalGap}
            />
          ) : (
            // Empty state with drop zone
            <>
              <EmptyDropZone zoneId={zoneId} pageKey={pageKey} />
              <EmptyCanvasState
                onAddElement={handleAddElement}
                onOpenCommandPalette={handleOpenCommandPalette}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
