/**
 * Main Application Entry Point
 *
 * This file serves as the primary application component.
 * You can switch between different demo components by changing the import.
 */

import React from 'react';
import CompareModeDemo from './components/CompareModeDemo';

/**
 * Available Components:
 * - CompareModeDemo: Main comparison mode with markers and chat
 * - StaffDetails: Staff management and notes interface
 * - USBSearch: Unified search interface with visualizations
 * - ReportPhrase: Report phrase search and management
 * - PerformanceListing: Performance metrics and analytics
 * - RecordListingBasic: Basic record listing with markers
 * - RecordListingResizable: Resizable record listing panels
 * - RecordListingAdvanced: Advanced listing with heatmap and AI
 */

function App() {
  return <CompareModeDemo />;
}

export default App;
