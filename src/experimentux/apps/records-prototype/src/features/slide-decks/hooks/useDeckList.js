import { useState, useEffect } from 'react';
import { deckService } from '../services/deckService';

/**
 * Hook for managing deck list state
 *
 * @param {string|null} folderId - Optional folder ID to filter decks
 * @returns {Object} Deck list state and actions
 */
export function useDeckList(folderId = null) {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await deckService.listDecks(folderId);
      setDecks(data);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch decks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, [folderId]);

  const deleteDeck = async (deckId) => {
    await deckService.deleteDeck(deckId);
  };

  return {
    decks,
    loading,
    error,
    deleteDeck,
    refreshList: fetchDecks
  };
}
