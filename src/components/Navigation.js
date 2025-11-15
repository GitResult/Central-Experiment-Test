/**
 * Navigation Component
 *
 * Main navigation page providing access to all available components in the application.
 * Acts as a central hub with component descriptions and easy navigation.
 *
 * Features:
 * - Grid layout of all available components
 * - Component descriptions and feature lists
 * - Visual icons for each component
 * - Responsive design
 * - Search/filter functionality
 *
 * @component
 * @param {Function} onNavigate - Callback function to handle navigation to components
 * @returns {React.Component} Navigation component
 */

import React, { useState } from 'react';
import {
  BarChart3, Users, Search, FileText, TrendingUp,
  Database, Layout, Maximize2, Cpu, Home, Sparkles, Briefcase
} from 'lucide-react';

const Navigation = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const components = [
    {
      id: 'board-packet',
      name: 'Board Meeting',
      description: 'Board meeting management with PDF viewing, annotations, markers, and document collaboration.',
      icon: Briefcase,
      color: 'bg-slate-600',
      features: ['PDF Viewing', 'Markers & Annotations', 'Document Upload', 'Meeting Management']
    },
    {
      id: 'compare-mode',
      name: 'Compare Mode Demo',
      description: 'Main comparison interface with interactive data tables, visual markers, and AI-powered chat panel.',
      icon: BarChart3,
      color: 'bg-blue-500',
      features: ['Visual Markers', 'AI Chat', 'Drag & Drop Tasks', 'Data Visualization']
    },
    {
      id: 'staff-details',
      name: 'Staff Details',
      description: 'Staff management interface with drag-and-drop notes, tasks, and customizable dashboard widgets.',
      icon: Users,
      color: 'bg-purple-500',
      features: ['Drag & Drop', 'Custom Widgets', 'Staff Cards', 'Templates']
    },
    {
      id: 'usb-search',
      name: 'USB Search',
      description: 'Unified search interface with advanced visualizations, filters, and animated search experience.',
      icon: Search,
      color: 'bg-green-500',
      features: ['Advanced Filters', 'Multiple Charts', 'Animations', 'Export Data']
    },
    {
      id: 'report-phrase',
      name: 'Report Phrase',
      description: 'Phrase-based search system with intelligent filtering and comprehensive result management.',
      icon: FileText,
      color: 'bg-orange-500',
      features: ['Phrase Search', 'Quick Actions', 'Analytics', 'Search History']
    },
    {
      id: 'performance-listing',
      name: 'Performance Listing',
      description: 'Performance analytics dashboard with member charts, revenue panels, and metrics tracking.',
      icon: TrendingUp,
      color: 'bg-red-500',
      features: ['Member Charts', 'Revenue Panels', 'Agents', 'Real-time Metrics']
    },
    {
      id: 'record-listing-basic',
      name: 'Record Listing Basic',
      description: 'Basic record listing with visual markers and essential data management features.',
      icon: Database,
      color: 'bg-cyan-500',
      features: ['Record Table', 'Visual Markers', 'Filtering', 'Charts']
    },
    {
      id: 'record-listing-resizable',
      name: 'Record Listing Resizable',
      description: 'Enhanced record listing with resizable panels and improved layout controls.',
      icon: Maximize2,
      color: 'bg-indigo-500',
      features: ['Resizable Panels', 'Heatmap', 'Agent Progress', 'All Basic Features']
    },
    {
      id: 'record-listing-advanced',
      name: 'Record Listing Advanced',
      description: 'Full-featured listing with heatmap visualization, AI chat, and automated task generation.',
      icon: Cpu,
      color: 'bg-pink-500',
      features: ['AI Chat', 'Heatmap', 'Task Generation', 'All Resizable Features']
    }
  ];

  const filteredComponents = components.filter(component =>
    component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    component.features.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Home className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Central USB Search</h1>
          </div>
          <p className="text-gray-600 ml-11">Select a component to explore its features</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search components..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Component Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredComponents.map((component) => {
            const Icon = component.icon;
            return (
              <button
                key={component.id}
                onClick={() => onNavigate(component.id)}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 text-left group"
              >
                {/* Icon Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={`${component.color} rounded-lg p-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {component.name}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {component.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-2">
                  {component.features.slice(0, 3).map((feature, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 group-hover:bg-blue-50 group-hover:text-blue-700 transition-colors"
                    >
                      {feature}
                    </span>
                  ))}
                  {component.features.length > 3 && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                      +{component.features.length - 3} more
                    </span>
                  )}
                </div>

                {/* Hover indicator */}
                <div className="mt-4 flex items-center text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-sm font-medium">Open Component</span>
                  <Sparkles className="w-4 h-4 ml-2" />
                </div>
              </button>
            );
          })}
        </div>

        {/* No Results */}
        {filteredComponents.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No components found</h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600 text-sm">
            Central USB Search v1.0.0 - {components.length} Components Available
          </p>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
