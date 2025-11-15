/**
 * Main Application Entry Point
 *
 * This file serves as the primary application component with navigation.
 * Users can access all components through a central navigation page.
 */

import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

// Import all components
import Navigation from './components/Navigation';
import BoardPacketPage from './components/BoardPacketPage';
import CompareModeDemo from './components/CompareModeDemo';
import StaffDetails from './components/StaffDetails';
import USBSearch from './components/USBSearch';
import ReportPhrase from './components/ReportPhrase';
import PerformanceListing from './components/PerformanceListing';
import RecordListingBasic from './components/RecordListingBasic';
import RecordListingResizable from './components/RecordListingResizable';
import RecordListingAdvanced from './components/RecordListingAdvanced';

/**
 * Main App Component with Navigation
 *
 * Manages routing between different demo components using state-based navigation.
 * Shows a navigation page by default with access to all available components.
 */
function App() {
  const [currentComponent, setCurrentComponent] = useState(null);

  // Component mapping
  const componentMap = {
    'board-packet': BoardPacketPage,
    'compare-mode': CompareModeDemo,
    'staff-details': StaffDetails,
    'usb-search': USBSearch,
    'report-phrase': ReportPhrase,
    'performance-listing': PerformanceListing,
    'record-listing-basic': RecordListingBasic,
    'record-listing-resizable': RecordListingResizable,
    'record-listing-advanced': RecordListingAdvanced,
  };

  // Get the component to render
  const ComponentToRender = currentComponent ? componentMap[currentComponent] : null;

  // Handle navigation
  const handleNavigate = (componentId) => {
    setCurrentComponent(componentId);
  };

  const handleBackToHome = () => {
    setCurrentComponent(null);
  };

  // Render navigation page or selected component
  if (!currentComponent) {
    return <Navigation onNavigate={handleNavigate} />;
  }

  return (
    <div className="min-h-screen">
      {/* Back to Navigation Button */}
      <button
        onClick={handleBackToHome}
        className="fixed top-4 left-4 z-50 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 hover:text-blue-600 border border-gray-200"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Home</span>
      </button>

      {/* Render selected component */}
      {ComponentToRender && <ComponentToRender />}
    </div>
  );
}

export default App;
