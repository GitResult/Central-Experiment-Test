/**
 * Template Gallery Component
 *
 * Displays a beautiful gallery of available templates for users to choose from.
 * Inspired by Squarespace/Wix template selection UX.
 */

import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import {
  getAllTemplates,
  getAllCategories,
  getTemplatesByCategory,
  searchTemplates
} from '../templates/index';

const TemplateGallery = ({ onSelectTemplate, onClose, showBlankOption = true }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredTemplate, setHoveredTemplate] = useState(null);

  const categories = useMemo(() => ['All', ...getAllCategories()], []);

  const filteredTemplates = useMemo(() => {
    let templates = searchQuery
      ? searchTemplates(searchQuery)
      : selectedCategory === 'All'
        ? getAllTemplates()
        : getTemplatesByCategory(selectedCategory);

    return templates;
  }, [selectedCategory, searchQuery]);

  const handleTemplateClick = (template) => {
    onSelectTemplate(template);
  };

  const handleBlankClick = () => {
    onSelectTemplate(null); // null indicates blank template
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-8 py-6 border-b border-neutral-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-bold text-neutral-900">Choose a Template</h2>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-neutral-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blank Template Option */}
            {showBlankOption && (
              <button
                onClick={handleBlankClick}
                onMouseEnter={() => setHoveredTemplate('blank')}
                onMouseLeave={() => setHoveredTemplate(null)}
                className="group relative bg-white border-2 border-dashed border-neutral-300 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-200"
              >
                <div className="aspect-[4/3] flex items-center justify-center bg-neutral-50">
                  <div className="text-center">
                    <svg
                      className="w-16 h-16 mx-auto mb-3 text-neutral-400 group-hover:text-blue-500 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                    </svg>
                    <p className="text-lg font-semibold text-neutral-600 group-hover:text-blue-600">
                      Start Blank
                    </p>
                    <p className="text-sm text-neutral-500 mt-1">
                      Build from scratch
                    </p>
                  </div>
                </div>
              </button>
            )}

            {/* Template Cards */}
            {filteredTemplates.map((template) => (
              <button
                key={template.templateId}
                onClick={() => handleTemplateClick(template)}
                onMouseEnter={() => setHoveredTemplate(template.templateId)}
                onMouseLeave={() => setHoveredTemplate(null)}
                className="group relative bg-white border border-neutral-200 rounded-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-200"
              >
                {/* Template Preview/Thumbnail */}
                <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
                  {/* Icon */}
                  <div className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity">
                    {template.icon}
                  </div>

                  {/* Hover Overlay */}
                  {hoveredTemplate === template.templateId && (
                    <div className="absolute inset-0 bg-blue-600 bg-opacity-90 flex items-center justify-center">
                      <div className="text-white text-center px-4">
                        <svg
                          className="w-12 h-12 mx-auto mb-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <p className="font-semibold">Click to use this template</p>
                      </div>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-white bg-opacity-90 rounded-full text-xs font-medium text-neutral-700">
                    {template.category}
                  </div>
                </div>

                {/* Template Info */}
                <div className="p-4 text-left">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-2xl flex-shrink-0">{template.icon}</span>
                    <div>
                      <h3 className="font-semibold text-neutral-900 group-hover:text-blue-600 transition-colors">
                        {template.name}
                      </h3>
                      <p className="text-sm text-neutral-600 mt-1 line-clamp-2">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  {/* Template Stats */}
                  <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                      </svg>
                      <span>
                        {template.config.zones.filter(z => z.visible !== false).length} zones
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                      <span>Drag & Drop</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* No Results */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-16">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-neutral-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">
                No templates found
              </h3>
              <p className="text-neutral-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-neutral-200 bg-neutral-50">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-600">
              {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 text-neutral-700 hover:text-neutral-900 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

TemplateGallery.propTypes = {
  onSelectTemplate: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  showBlankOption: PropTypes.bool
};

export default TemplateGallery;
