import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * AutoSaveIndicator Component
 *
 * Status indicator showing save state with transitions.
 * States: idle, saving, saved, error.
 * Shows relative timestamp ("Auto-saved 5s ago").
 *
 * Props:
 * - saveState: string - Current save state (idle, saving, saved, error)
 * - lastSaved: Date - Last saved timestamp
 */
export function AutoSaveIndicator({ saveState, lastSaved }) {
  const [relativeTime, setRelativeTime] = useState('');

  useEffect(() => {
    if (!lastSaved) return;

    const updateRelativeTime = () => {
      const now = new Date();
      const diffMs = now - new Date(lastSaved);
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);

      if (diffSec < 5) {
        setRelativeTime('just now');
      } else if (diffSec < 60) {
        setRelativeTime(`${diffSec}s ago`);
      } else if (diffMin < 60) {
        setRelativeTime(`${diffMin}m ago`);
      } else {
        setRelativeTime(`${diffHour}h ago`);
      }
    };

    updateRelativeTime();
    const intervalId = setInterval(updateRelativeTime, 1000);

    return () => clearInterval(intervalId);
  }, [lastSaved]);

  const getStatusDisplay = () => {
    switch (saveState) {
      case 'saving':
        return {
          text: 'Saving...',
          icon: (
            <svg className="animate-spin h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ),
          className: 'text-blue-600'
        };
      case 'saved':
        return {
          text: relativeTime ? `Saved ${relativeTime}` : 'Saved ✓',
          icon: (
            <svg className="h-4 w-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          ),
          className: 'text-green-600'
        };
      case 'error':
        return {
          text: 'Save failed',
          icon: (
            <svg className="h-4 w-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          ),
          className: 'text-red-600'
        };
      default: // idle
        return null;
    }
  };

  const status = getStatusDisplay();

  if (!status) return null;

  return (
    <div className={`flex items-center space-x-2 text-sm ${status.className}`}>
      {status.icon}
      <span>{status.text}</span>
    </div>
  );
}

AutoSaveIndicator.propTypes = {
  saveState: PropTypes.oneOf(['idle', 'saving', 'saved', 'error']).isRequired,
  lastSaved: PropTypes.instanceOf(Date)
};
