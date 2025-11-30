/**
 * Excel Parser
 * Parse Excel files using xlsx library
 */

import * as XLSX from 'xlsx';

/**
 * Parse Excel file
 * @param {ArrayBuffer|File} input - Excel file data or File object
 * @param {Object} options - Parse options
 * @returns {Promise} Promise resolving to parsed data
 */
export function parseExcel(input, options = {}) {
  return new Promise((resolve, reject) => {
    const {
      sheetName = null, // null = first sheet
      header = 1, // 1 = first row is header
      raw = false
    } = options;

    const readFile = (data) => {
      try {
        // Read workbook
        const wb = XLSX.read(data, { type: 'array', raw });

        // Get sheet
        const wsName = sheetName || wb.SheetNames[0];
        const ws = wb.Sheets[wsName];

        if (!ws) {
          reject(new Error(`Sheet "${wsName}" not found`));
          return;
        }

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(ws, { header, raw });

        resolve({
          data: jsonData,
          sheetName: wsName,
          sheets: wb.SheetNames
        });
      } catch (error) {
        reject(new Error(`Excel parsing failed: ${error.message}`));
      }
    };

    if (input instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => readFile(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(input);
    } else {
      readFile(input);
    }
  });
}

/**
 * Parse all sheets from Excel file
 * @param {ArrayBuffer|File} input - Excel file data
 * @returns {Promise} Promise resolving to object with all sheets
 */
export function parseAllExcelSheets(input) {
  return new Promise((resolve, reject) => {
    const readFile = (data) => {
      try {
        const wb = XLSX.read(data, { type: 'array' });
        const sheets = {};

        wb.SheetNames.forEach(sheetName => {
          const ws = wb.Sheets[sheetName];
          sheets[sheetName] = XLSX.utils.sheet_to_json(ws);
        });

        resolve(sheets);
      } catch (error) {
        reject(new Error(`Excel parsing failed: ${error.message}`));
      }
    };

    if (input instanceof File) {
      const reader = new FileReader();
      reader.onload = (e) => readFile(e.target.result);
      reader.onerror = () => reject(new Error('Failed to read Excel file'));
      reader.readAsArrayBuffer(input);
    } else {
      readFile(input);
    }
  });
}

export default parseExcel;
