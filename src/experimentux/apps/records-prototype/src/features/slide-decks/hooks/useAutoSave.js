import { useState, useEffect, useCallback, useRef } from 'react';
import { deckService } from '../services/deckService';
import { trackEvent, SLIDE_DECK_EVENTS } from '../utils/telemetry';

/**
 * Hook for auto-saving deck changes
 *
 * @param {string} deckId - Deck ID
 * @param {Object} deckState - Current deck state
 * @param {number} debounceMs - Debounce delay in milliseconds (default: 2000)
 * @returns {Object} Save state and trigger function
 */
export function useAutoSave(deckId, deckState, debounceMs = 2000) {
  const [saveState, setSaveState] = useState('idle'); // idle, saving, saved, error
  const saveTimeoutRef = useRef(null);
  const lastSavedRef = useRef(null);

  const performSave = useCallback(async () => {
    if (!deckState) return;

    try {
      setSaveState('saving');
      trackEvent(SLIDE_DECK_EVENTS.AUTOSAVE_TRIGGERED, { deckId });

      await deckService.updateDeck(deckId, deckState);

      setSaveState('saved');
      lastSavedRef.current = new Date();
      trackEvent(SLIDE_DECK_EVENTS.AUTOSAVE_COMPLETED, { deckId });

      // Reset to idle after 3 seconds
      setTimeout(() => setSaveState('idle'), 3000);
    } catch (err) {
      setSaveState('error');
      trackEvent(SLIDE_DECK_EVENTS.AUTOSAVE_FAILED, {
        deckId,
        error: err.message
      });
      console.error('Auto-save failed:', err);
    }
  }, [deckId, deckState]);

  const triggerSave = useCallback(() => {
    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Schedule new save
    saveTimeoutRef.current = setTimeout(performSave, debounceMs);
  }, [performSave, debounceMs]);

  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  return {
    saveState,
    triggerSave,
    lastSaved: lastSavedRef.current
  };
}
