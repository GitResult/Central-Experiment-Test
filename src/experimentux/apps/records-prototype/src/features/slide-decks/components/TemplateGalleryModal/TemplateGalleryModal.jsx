import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TemplateCard } from './TemplateCard';
import { trackEvent, SLIDE_DECK_EVENTS } from '../../utils/telemetry';

/**
 * TemplateGalleryModal Component
 *
 * Modal workflow for selecting templates or creating blank decks.
 * Templates show previews with 3 sample slides.
 *
 * Props:
 * - isOpen: boolean - Whether modal is visible
 * - onClose: function - Callback when modal is closed
 * - onSelectTemplate: function - Callback when template is selected (null for blank deck)
 */
export function TemplateGalleryModal({ isOpen, onClose, onSelectTemplate }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      trackEvent(SLIDE_DECK_EVENTS.TEMPLATE_GALLERY_OPENED);
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    // Mock templates - in production, fetch from backend
    setLoading(true);
    setTimeout(() => {
      setTemplates([
        {
          id: 'template-1',
          name: 'Board Deck',
          description: 'Executive presentation for board meetings',
          previewUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect fill="%23f8fafc" width="300" height="200"/%3E%3Ctext x="150" y="100" text-anchor="middle" fill="%23334155" font-size="16"%3EBoard Deck%3C/text%3E%3C/svg%3E',
          slideCount: 15
        },
        {
          id: 'template-2',
          name: 'Sales Review',
          description: 'Monthly sales performance review',
          previewUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect fill="%23f0f9ff" width="300" height="200"/%3E%3Ctext x="150" y="100" text-anchor="middle" fill="%23075985" font-size="16"%3ESales Review%3C/text%3E%3C/svg%3E',
          slideCount: 12
        },
        {
          id: 'template-3',
          name: 'Loan Application',
          description: 'Credit committee presentation',
          previewUrl: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200"%3E%3Crect fill="%23f0fdf4" width="300" height="200"/%3E%3Ctext x="150" y="100" text-anchor="middle" fill="%23166534" font-size="16"%3ELoan Application%3C/text%3E%3C/svg%3E',
          slideCount: 18
        }
      ]);
      setLoading(false);
    }, 300);
  };

  const handleTemplateClick = (template) => {
    setSelectedTemplate(template);
    trackEvent(SLIDE_DECK_EVENTS.TEMPLATE_PREVIEWED, {
      templateId: template.id
    });
  };

  const handleSelectTemplate = () => {
    trackEvent(SLIDE_DECK_EVENTS.TEMPLATE_SELECTED, {
      templateId: selectedTemplate?.id || 'blank'
    });
    onSelectTemplate(selectedTemplate);
  };

  const handleBlankDeck = () => {
    trackEvent(SLIDE_DECK_EVENTS.BLANK_DECK_CREATED);
    onSelectTemplate(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Choose a template</h2>
            <p className="text-sm text-gray-500 mt-1">Start with a template or create a blank deck</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-gray-500">Loading templates...</div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-6">
              {/* Blank Deck Option */}
              <button
                onClick={handleBlankDeck}
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-medium text-gray-700">Blank Deck</span>
                <span className="text-xs text-gray-500 mt-1">Start from scratch</span>
              </button>

              {/* Template Cards */}
              {templates.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  isSelected={selectedTemplate?.id === template.id}
                  onClick={() => handleTemplateClick(template)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSelectTemplate}
            disabled={!selectedTemplate}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Use Template
          </button>
        </div>
      </div>
    </div>
  );
}

TemplateGalleryModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSelectTemplate: PropTypes.func.isRequired
};
