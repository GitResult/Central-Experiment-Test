import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DeckCard } from './DeckCard';
import { useDeckList } from '../../hooks/useDeckList';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * DeckList Component
 *
 * Displays a grid of deck cards with search, thumbnails, and actions.
 * Follows Central's DataTable grid pattern with Apple-inspired design.
 */
export function DeckList({ folderId = null, onCreateDeck, onOpenDeck }) {
  const [searchQuery, setSearchQuery] = useState('');
  const { decks, loading, error, deleteDeck, refreshList } = useDeckList(folderId);

  useEffect(() => {
    trackEvent(SLIDE_DECK_EVENTS.DECK_LIST_VIEWED, { folderId });
  }, [folderId]);

  const filteredDecks = decks.filter(deck =>
    deck.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDeck = () => {
    trackEvent(SLIDE_DECK_EVENTS.CREATE_DECK_CLICKED);
    onCreateDeck();
  };

  const handleOpenDeck = (deckId) => {
    trackEvent(SLIDE_DECK_EVENTS.DECK_OPENED, { deckId });
    onOpenDeck(deckId);
  };

  const handleDeleteDeck = async (deckId) => {
    try {
      await deleteDeck(deckId);
      trackEvent(SLIDE_DECK_EVENTS.DECK_DELETED, { deckId });
      refreshList();
    } catch (err) {
      trackEvent(SLIDE_DECK_EVENTS.DELETE_FAILED, { deckId, error: err.message });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading decks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-red-600">Failed to load decks</div>
        <button
          onClick={refreshList}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-semibold text-gray-900">Slide Decks</h1>
          <span className="text-sm text-gray-500">{filteredDecks.length} decks</span>
        </div>
        <button
          onClick={handleCreateDeck}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <span>+</span>
          <span>New Deck</span>
        </button>
      </div>

      {/* Search */}
      <div className="px-6 py-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value) {
              trackEvent(SLIDE_DECK_EVENTS.DECK_SEARCHED, { query: e.target.value });
            }
          }}
          placeholder="Search decks..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Deck Grid */}
      {filteredDecks.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 space-y-4">
          <div className="text-6xl">📊</div>
          <div className="text-xl font-medium text-gray-900">No slide decks yet</div>
          <div className="text-gray-500">Create your first slide deck to get started</div>
          <button
            onClick={handleCreateDeck}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create Deck
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDecks.map((deck) => (
              <DeckCard
                key={deck.id}
                deck={deck}
                onClick={() => handleOpenDeck(deck.id)}
                onDelete={() => handleDeleteDeck(deck.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

DeckList.propTypes = {
  folderId: PropTypes.string,
  onCreateDeck: PropTypes.func.isRequired,
  onOpenDeck: PropTypes.func.isRequired
};
