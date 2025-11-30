/**
 * CSV Generator
 * Generate CSV files from data
 */

import Papa from 'papaparse';
import { downloadFile } from '../utils/fileDownload';

/**
 * Convert data to CSV string
 * @param {Array} data - Array of objects
 * @param {Object} options - Generation options
 * @returns {string} CSV string
 */
export function generateCSV(data, options = {}) {
  const {
    headers = null,
    delimiter = ',',
    newline = '\n',
    quotes = true
  } = options;

  const config = {
    quotes,
    delimiter,
    newline,
    header: true
  };

  if (headers) {
    config.columns = headers;
  }

  return Papa.unparse(data, config);
}

/**
 * Download data as CSV file
 * @param {Array} data - Array of objects
 * @param {string} filename - Filename for download
 * @param {Object} options - Generation options
 */
export function downloadCSV(data, filename = 'data.csv', options = {}) {
  const csv = generateCSV(data, options);
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Convert object array to CSV with custom column mapping
 * @param {Array} data - Array of objects
 * @param {Object} columnMap - Map of internal field names to display headers
 * @returns {string} CSV string
 */
export function generateCSVWithMapping(data, columnMap) {
  const headers = Object.values(columnMap);
  const keys = Object.keys(columnMap);

  const mappedData = data.map(row => {
    const mappedRow = {};
    keys.forEach(key => {
      mappedRow[columnMap[key]] = row[key];
    });
    return mappedRow;
  });

  return generateCSV(mappedData, { headers });
}

export default generateCSV;
