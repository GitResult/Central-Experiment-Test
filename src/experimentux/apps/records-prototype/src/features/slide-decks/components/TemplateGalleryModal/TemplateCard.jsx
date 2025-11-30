import React from 'react';
import PropTypes from 'prop-types';

/**
 * TemplateCard Component
 *
 * Displays a template preview card with selection state.
 *
 * Props:
 * - template: object - Template data (id, name, description, previewUrl, slideCount)
 * - isSelected: boolean - Whether this template is selected
 * - onClick: function - Callback when card is clicked
 */
export function TemplateCard({ template, isSelected, onClick }) {
  return (
    <div
      className={`cursor-pointer rounded-lg border-2 transition-all ${
        isSelected
          ? 'border-blue-600 shadow-lg'
          : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
      aria-label={`Select template: ${template.name}`}
      aria-pressed={isSelected}
    >
      {/* Preview Image */}
      <div className="relative aspect-video bg-gray-100 rounded-t-lg overflow-hidden">
        <img
          src={template.previewUrl}
          alt={`Preview of ${template.name} template`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-1">{template.name}</h4>
        <p className="text-sm text-gray-600 mb-2">{template.description}</p>
        <div className="flex items-center text-xs text-gray-500">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <span>{template.slideCount} slides</span>
        </div>
      </div>
    </div>
  );
}

TemplateCard.propTypes = {
  template: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    previewUrl: PropTypes.string.isRequired,
    slideCount: PropTypes.number.isRequired
  }).isRequired,
  isSelected: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
};
