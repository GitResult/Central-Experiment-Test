import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  DeckList,
  SimpleDeckEditorDemo,
  deckService
} from './features/slide-decks/index';

/**
 * Slide Decks Feature Demo
 *
 * Demonstrates the key components of the Slide Decks feature:
 * 1. DeckList - Grid view of all decks
 * 2. SimpleDeckEditorDemo - Hybrid split-view editor
 *
 * This showcases:
 * - Apple-inspired minimalist design
 * - Structured data widget configuration (no free-form typing)
 * - Data pills (system-generated widget placeholders)
 * - Three-panel architecture (content editor, visual preview, sidebar)
 */
function SlideDecksDemo() {
  const [view, setView] = useState('list'); // 'list' or 'editor'
  const [currentDeckId, setCurrentDeckId] = useState(null);

  const handleCreateDeck = async () => {
    try {
      const newDeck = await deckService.createDeck({
        name: 'New Presentation',
        description: 'Created from demo',
        tags: ['demo']
      });
      setCurrentDeckId(newDeck.id);
      setView('editor');
    } catch (err) {
      console.error('Failed to create deck:', err);
    }
  };

  const handleOpenDeck = (deckId) => {
    setCurrentDeckId(deckId);
    setView('editor');
  };

  const handleBackToList = () => {
    setView('list');
    setCurrentDeckId(null);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation */}
      {view === 'editor' && (
        <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
          <button
            onClick={handleBackToList}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Deck List</span>
          </button>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {view === 'list' ? (
          <DeckList
            onCreateDeck={handleCreateDeck}
            onOpenDeck={handleOpenDeck}
          />
        ) : (
          <SimpleDeckEditorDemo deckId={currentDeckId} />
        )}
      </div>

      {/* Info Footer */}
      <div className="bg-blue-50 border-t border-blue-200 px-6 py-3">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600 text-2xl">ℹ️</div>
          <div className="flex-1 text-sm text-blue-900">
            <strong>Demo Features:</strong>
            <ul className="list-disc list-inside mt-1 space-y-1 text-blue-800">
              <li>DeckList: Grid view with search, thumbnails, and Apple-inspired design</li>
              <li>Hybrid Split-View Editor: Three panels (content editor, visual preview, sidebar)</li>
              <li>Data Pills: System-generated widget placeholders (📊📋🔢)</li>
              <li>Structured Configuration: Dropdowns only - NO free-form typing for data references</li>
              <li>Real-time Preview: Changes in editor update preview instantly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mount the app
const container = document.getElementById('root');
const root = createRoot(container);
root.render(<SlideDecksDemo />);
