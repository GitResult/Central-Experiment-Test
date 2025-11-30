/**
 * PDF Generator
 * Generate PDF files using jsPDF
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { downloadFile } from '../utils/fileDownload';

/**
 * Generate PDF from table data
 * @param {Array} data - Array of objects (table rows)
 * @param {Object} options - Generation options
 * @returns {jsPDF} PDF document
 */
export function generateTablePDF(data, options = {}) {
  const {
    title = 'Report',
    headers = null,
    orientation = 'portrait',
    pageSize = 'a4',
    fontSize = 10
  } = options;

  // Create PDF
  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize
  });

  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 20);

  // Extract headers and rows
  const cols = headers || (data.length > 0 ? Object.keys(data[0]) : []);
  const rows = data.map(row => cols.map(col => row[col]));

  // Add table
  doc.autoTable({
    head: [cols],
    body: rows,
    startY: 30,
    styles: { fontSize },
    headStyles: {
      fillColor: [92, 124, 250], // Primary color from theme
      textColor: 255,
      fontStyle: 'bold'
    }
  });

  return doc;
}

/**
 * Download data as PDF
 * @param {Array} data - Array of objects
 * @param {string} filename - Filename for download
 * @param {Object} options - Generation options
 */
export function downloadPDF(data, filename = 'report.pdf', options = {}) {
  const doc = generateTablePDF(data, options);
  doc.save(filename);
}

/**
 * Generate custom PDF with text content
 * @param {string} content - Text content
 * @param {Object} options - Options
 * @returns {jsPDF} PDF document
 */
export function generateTextPDF(content, options = {}) {
  const {
    title = '',
    orientation = 'portrait',
    pageSize = 'a4',
    fontSize = 12,
    margins = { top: 20, left: 14, right: 14 }
  } = options;

  const doc = new jsPDF({
    orientation,
    unit: 'mm',
    format: pageSize
  });

  // Add title
  if (title) {
    doc.setFontSize(16);
    doc.text(title, margins.left, margins.top);
  }

  // Add content
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(
    content,
    doc.internal.pageSize.getWidth() - margins.left - margins.right
  );

  doc.text(lines, margins.left, margins.top + (title ? 10 : 0));

  return doc;
}

/**
 * Add header and footer to PDF
 * @param {jsPDF} doc - PDF document
 * @param {Object} options - Header/footer options
 */
export function addHeaderFooter(doc, options = {}) {
  const {
    header = null,
    footer = null
  } = options;

  const pageCount = doc.internal.getNumberOfPages();

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    // Header
    if (header) {
      doc.setFontSize(10);
      doc.text(header, 14, 10);
    }

    // Footer
    if (footer) {
      doc.setFontSize(10);
      doc.text(
        typeof footer === 'function' ? footer(i, pageCount) : footer,
        14,
        doc.internal.pageSize.getHeight() - 10
      );
    }
  }

  return doc;
}

export default generateTablePDF;
