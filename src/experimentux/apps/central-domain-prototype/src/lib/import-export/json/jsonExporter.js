/**
 * JSON Exporter
 * Export data to JSON format
 */

import { downloadJSON } from '../utils/fileDownload';

/**
 * Convert data to formatted JSON string
 * @param {any} data - Data to export
 * @param {number} indent - Indentation spaces (default: 2)
 * @returns {string} Formatted JSON string
 */
export function exportJSON(data, indent = 2) {
  return JSON.stringify(data, null, indent);
}

/**
 * Download data as JSON file
 * @param {any} data - Data to download
 * @param {string} filename - Filename
 * @param {number} indent - Indentation
 */
export function downloadJSONFile(data, filename = 'data.json', indent = 2) {
  downloadJSON(data, filename);
}

/**
 * Export with metadata
 * @param {any} data - Data to export
 * @param {Object} metadata - Metadata to include
 * @returns {Object} Data with metadata
 */
export function exportJSONWithMetadata(data, metadata = {}) {
  return {
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      ...metadata
    },
    data
  };
}

export default exportJSON;
