/**
 * Search Highlight
 * Highlights matched text in search results
 */

import PropTypes from 'prop-types';
import { theme } from '../../config/theme';

/**
 * Highlight matched text in a string
 * @param {string} text - Full text
 * @param {string} query - Search query to highlight
 * @returns {Array} Array of text segments with highlight flags
 */
function getHighlightSegments(text, query) {
  if (!query || !text) {
    return [{ text, highlight: false }];
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const segments = [];
  let lastIndex = 0;

  let index = lowerText.indexOf(lowerQuery);
  while (index !== -1) {
    // Add non-highlighted segment before match
    if (index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, index),
        highlight: false
      });
    }

    // Add highlighted segment
    segments.push({
      text: text.substring(index, index + query.length),
      highlight: true
    });

    lastIndex = index + query.length;
    index = lowerText.indexOf(lowerQuery, lastIndex);
  }

  // Add remaining text
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      highlight: false
    });
  }

  return segments;
}

export function SearchHighlight({ text, query, highlightStyle = {} }) {
  const segments = getHighlightSegments(text, query);

  const defaultHighlightStyle = {
    backgroundColor: theme.colors.primary[100],
    color: theme.colors.primary[700],
    fontWeight: theme.typography.fontWeight.semibold,
    padding: '0 2px',
    borderRadius: '2px',
    ...highlightStyle
  };

  return (
    <span>
      {segments.map((segment, index) => (
        segment.highlight ? (
          <mark key={index} style={defaultHighlightStyle}>
            {segment.text}
          </mark>
        ) : (
          <span key={index}>{segment.text}</span>
        )
      ))}
    </span>
  );
}

SearchHighlight.propTypes = {
  text: PropTypes.string.isRequired,
  query: PropTypes.string,
  highlightStyle: PropTypes.object
};

export default SearchHighlight;
