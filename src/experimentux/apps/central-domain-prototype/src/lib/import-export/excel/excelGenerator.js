/**
 * Excel Generator
 * Generate Excel files using xlsx library
 */

import * as XLSX from 'xlsx';
import { downloadFile } from '../utils/fileDownload';

/**
 * Generate Excel file from data
 * @param {Array} data - Array of objects
 * @param {Object} options - Generation options
 * @returns {ArrayBuffer} Excel file data
 */
export function generateExcel(data, options = {}) {
  const {
    sheetName = 'Sheet1',
    headers = null
  } = options;

  // Create workbook
  const wb = XLSX.utils.book_new();

  // Create worksheet from data
  const ws = XLSX.utils.json_to_sheet(data, {
    header: headers
  });

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  // Generate Excel file
  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
}

/**
 * Download data as Excel file
 * @param {Array} data - Array of objects
 * @param {string} filename - Filename for download
 * @param {Object} options - Generation options
 */
export function downloadExcel(data, filename = 'data.xlsx', options = {}) {
  const excelData = generateExcel(data, options);
  const blob = new Blob([excelData], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
  downloadFile(blob, filename);
}

/**
 * Generate Excel with multiple sheets
 * @param {Object} sheets - Object mapping sheet names to data arrays
 * @returns {ArrayBuffer} Excel file data
 */
export function generateMultiSheetExcel(sheets) {
  const wb = XLSX.utils.book_new();

  Object.entries(sheets).forEach(([sheetName, data]) => {
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  });

  return XLSX.write(wb, { type: 'array', bookType: 'xlsx' });
}

export default generateExcel;
