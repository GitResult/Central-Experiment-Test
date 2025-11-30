import React from 'react';
import PropTypes from 'prop-types';

/**
 * MetadataBarElement
 *
 * Displays record metadata in a compact, horizontal bar.
 * Common fields: Created, Modified, Author, Status, Tags, etc.
 */
const MetadataBarElement = ({ data, settings, onUpdate }) => {
  const fields = data.fields || [];

  if (fields.length === 0) {
    return (
      <div className="metadata-bar-empty p-4 border border-dashed border-gray-300 rounded text-center text-sm text-gray-500">
        No metadata fields configured
      </div>
    );
  }

  const getFieldIcon = (type) => {
    const icons = {
      date: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      user: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      status: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      tag: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
      text: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    };
    return icons[type] || icons.text;
  };

  const formatValue = (field) => {
    if (!field.value) return '-';

    switch (field.type) {
      case 'date':
        return new Date(field.value).toLocaleDateString();
      case 'tag':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            {field.value}
          </span>
        );
      case 'status':
        const statusColors = {
          active: 'bg-green-100 text-green-800',
          draft: 'bg-yellow-100 text-yellow-800',
          archived: 'bg-gray-100 text-gray-800',
          published: 'bg-blue-100 text-blue-800'
        };
        const colorClass = statusColors[field.value.toLowerCase()] || 'bg-gray-100 text-gray-800';
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
            {field.value}
          </span>
        );
      default:
        return field.value;
    }
  };

  return (
    <div className={`metadata-bar-element flex flex-wrap items-center gap-4 py-3 px-4 ${settings.background || 'bg-gray-50'} rounded-lg border border-gray-200`}>
      {fields.map((field, index) => (
        <div key={index} className="flex items-center gap-2 text-sm">
          <div className="text-gray-400">
            {getFieldIcon(field.type)}
          </div>
          <span className="text-gray-600 font-medium">{field.label}:</span>
          <span className="text-gray-900">{formatValue(field)}</span>
        </div>
      ))}
    </div>
  );
};

MetadataBarElement.propTypes = {
  data: PropTypes.shape({
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any,
        type: PropTypes.oneOf(['date', 'user', 'status', 'tag', 'text'])
      })
    )
  }),
  settings: PropTypes.shape({
    background: PropTypes.string
  }),
  onUpdate: PropTypes.func.isRequired
};

MetadataBarElement.defaultProps = {
  data: {
    fields: []
  },
  settings: {
    background: 'bg-gray-50'
  }
};

export default MetadataBarElement;
