import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import SlideDeckElement from './components/elements/SlideDeck/SlideDeckElement';
import './index.css';

/**
 * Test harness for Slide Deck Element
 */
const SlideDeckTest = () => {
  const [settings, setSettings] = useState({
    template: 'pitch-deck',
    theme: 'minimalist',
    aspectRatio: '16:9',
    markdown: ''
  });

  const handleUpdate = (newSettings) => {
    console.log('Settings updated:', newSettings);
    setSettings(newSettings);
  };

  return (
    <div style={{ padding: '24px' }}>
      <SlideDeckElement
        elementId="test-slide-deck"
        settings={settings}
        onUpdate={handleUpdate}
        isEditing={true}
        containerContext="page"
      />
    </div>
  );
};

// Mount the test component
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SlideDeckTest />
  </React.StrictMode>
);
