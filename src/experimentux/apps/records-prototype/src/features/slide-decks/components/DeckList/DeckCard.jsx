import React from 'react';
import PropTypes from 'prop-types';

/**
 * DeckCard Component
 *
 * Card component for displaying a single deck in the grid.
 * Shows thumbnail, metadata, and action buttons.
 */
export function DeckCard({ deck, onClick, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${deck.name}"?`)) {
      onDelete();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  return (
    <div
      onClick={onClick}
      className="group cursor-pointer bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow duration-200"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-lg overflow-hidden">
        {deck.thumbnailUrl ? (
          <img
            src={deck.thumbnailUrl}
            alt={`Thumbnail for ${deck.name}`}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-4xl mb-2">📊</div>
              <div className="text-sm font-medium text-gray-600">
                {deck.slideCount} slides
              </div>
            </div>
          </div>
        )}

        {/* Delete button (shown on hover) */}
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
          aria-label="Delete deck"
        >
          <svg
            className="w-4 h-4 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 truncate mb-1">
          {deck.name}
        </h3>

        {deck.description && (
          <p className="text-sm text-gray-600 truncate mb-2">
            {deck.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Modified {formatDate(deck.updatedAt)}</span>
          <span>{deck.slideCount} slides</span>
        </div>

        {deck.tags && deck.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {deck.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

DeckCard.propTypes = {
  deck: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    thumbnailUrl: PropTypes.string,
    slideCount: PropTypes.number.isRequired,
    updatedAt: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};
