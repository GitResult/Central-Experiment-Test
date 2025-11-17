import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * Breadcrumb Component
 *
 * Displays a breadcrumb navigation trail
 *
 * @param {Array} items - Array of breadcrumb items with label and optional url
 */
const Breadcrumb = ({ items = [] }) => {
  return (
    <div className="flex items-center gap-1 text-sm text-gray-500">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-3 h-3" />}
          {item.url ? (
            <a href={item.url} className="hover:text-gray-700 hover:underline">
              {item.label}
            </a>
          ) : (
            <span className="text-gray-700">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumb;
