import { useState, useEffect } from 'react';
import { deckService } from '../services/deckService';

/**
 * Hook for managing single deck state
 *
 * @param {string} deckId - Deck ID to load
 * @returns {Object} Deck state and actions
 */
export function useDeckState(deckId) {
  const [deckState, setDeckState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await deckService.getDeck(deckId);
        setDeckState(data);
      } catch (err) {
        setError(err);
        console.error('Failed to fetch deck:', err);
      } finally {
        setLoading(false);
      }
    };

    if (deckId) {
      fetchDeck();
    }
  }, [deckId]);

  const updateDeck = (newState) => {
    setDeckState(newState);
  };

  return {
    deckState,
    updateDeck,
    loading,
    error
  };
}
