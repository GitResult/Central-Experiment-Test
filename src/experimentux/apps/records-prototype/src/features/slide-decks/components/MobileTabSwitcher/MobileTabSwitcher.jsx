import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * MobileTabSwitcher Component
 *
 * Stacked tabs for mobile view with swipe gestures.
 * Tabs: [Edit] [Preview]
 * Supports touch swipe for switching tabs.
 *
 * Props:
 * - tabs: array - Tab definitions [{ id, label, content }]
 * - activeTab: string - ID of active tab
 * - onChange: function - Callback when tab changes
 */
export function MobileTabSwitcher({ tabs, activeTab, onChange }) {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const containerRef = useRef(null);

  // Minimum swipe distance (in px) to trigger tab change
  const MIN_SWIPE_DISTANCE = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distance < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe || isRightSwipe) {
      const currentIndex = tabs.findIndex(tab => tab.id === activeTab);

      if (isLeftSwipe && currentIndex < tabs.length - 1) {
        // Swipe left -> next tab
        onChange(tabs[currentIndex + 1].id);
        trackEvent(SLIDE_DECK_EVENTS.TAB_SWITCHED, {
          from: activeTab,
          to: tabs[currentIndex + 1].id,
          method: 'swipe'
        });
      } else if (isRightSwipe && currentIndex > 0) {
        // Swipe right -> previous tab
        onChange(tabs[currentIndex - 1].id);
        trackEvent(SLIDE_DECK_EVENTS.TAB_SWITCHED, {
          from: activeTab,
          to: tabs[currentIndex - 1].id,
          method: 'swipe'
        });
      }
    }
  };

  const handleTabClick = (tabId) => {
    onChange(tabId);
    trackEvent(SLIDE_DECK_EVENTS.TAB_SWITCHED, {
      from: activeTab,
      to: tabId,
      method: 'click'
    });
  };

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  return (
    <div className="flex flex-col h-full">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200 bg-white">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            aria-selected={activeTab === tab.id}
            role="tab"
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        role="tabpanel"
      >
        {activeTabContent}
      </div>

      {/* Swipe Hint (shown briefly on first render) */}
      <div className="bg-blue-50 border-t border-blue-200 px-4 py-2 text-xs text-blue-900 text-center">
        💡 Tip: Swipe left/right to switch tabs
      </div>
    </div>
  );
}

MobileTabSwitcher.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};
