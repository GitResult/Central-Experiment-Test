import React from 'react';
import PropTypes from 'prop-types';

/**
 * BreadcrumbElement
 *
 * Breadcrumb navigation showing the current page's location in the hierarchy.
 */
const BreadcrumbElement = ({ data, settings, onUpdate }) => {
  const items = data.items || [];

  if (items.length === 0) {
    return (
      <div className="breadcrumb-empty p-2 text-sm text-gray-400">
        No breadcrumb items configured
      </div>
    );
  }

  return (
    <nav className="breadcrumb-element flex items-center text-sm" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <svg
                className="flex-shrink-0 h-4 w-4 text-gray-400 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}

            {index === items.length - 1 ? (
              <span className="font-medium text-gray-900">{item.label}</span>
            ) : (
              <a
                href={item.url || '#'}
                className="text-gray-500 hover:text-gray-700 hover:underline"
                onClick={(e) => {
                  if (!item.url || item.url === '#') {
                    e.preventDefault();
                  }
                }}
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

BreadcrumbElement.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        url: PropTypes.string
      })
    )
  }),
  settings: PropTypes.object,
  onUpdate: PropTypes.func.isRequired
};

BreadcrumbElement.defaultProps = {
  data: {
    items: []
  },
  settings: {}
};

export default BreadcrumbElement;
