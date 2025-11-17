/**
 * Document Converter Utility
 *
 * Client-side document conversion to PDF using browser libraries:
 * - DOCX: mammoth.js (converts to HTML) + jsPDF (HTML to PDF)
 * - XLSX: xlsx.js (reads spreadsheet) + jsPDF (renders to PDF)
 * - PPTX: Limited support - converts to images/text where possible
 * - PDF: Direct passthrough
 */

import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Convert a file to PDF
 * @param {File} file - The file to convert
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<Blob>} - PDF blob
 */
export const convertToPDF = async (file, onProgress = () => {}) => {
  const fileType = getFileType(file.name);

  onProgress(10);

  try {
    switch (fileType) {
      case 'pdf':
        onProgress(100);
        return file;

      case 'word':
        return await convertWordToPDF(file, onProgress);

      case 'excel':
        return await convertExcelToPDF(file, onProgress);

      case 'powerpoint':
        return await convertPowerPointToPDF(file, onProgress);

      default:
        throw new Error(`Unsupported file type: ${fileType}`);
    }
  } catch (error) {
    console.error('Conversion error:', error);
    throw new Error(`Failed to convert ${file.name}: ${error.message}`);
  }
};

/**
 * Convert Word document to PDF
 */
const convertWordToPDF = async (file, onProgress) => {
  onProgress(20);

  // Read file as array buffer
  const arrayBuffer = await file.arrayBuffer();

  onProgress(40);

  // Convert DOCX to HTML using mammoth
  const result = await mammoth.convertToHtml({ arrayBuffer });
  const html = result.value;

  onProgress(60);

  // Create a temporary container for the HTML
  const container = document.createElement('div');
  container.style.width = '210mm'; // A4 width
  container.style.padding = '20mm';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.fontSize = '12pt';
  container.style.lineHeight = '1.5';
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.innerHTML = html;
  document.body.appendChild(container);

  onProgress(70);

  try {
    // Convert HTML to PDF using jsPDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Use html method to render the content
    await pdf.html(container, {
      callback: function(doc) {
        // This will be handled by the return below
      },
      x: 10,
      y: 10,
      width: 190, // A4 width minus margins
      windowWidth: 794 // A4 width in pixels at 96 DPI
    });

    onProgress(90);

    // Get PDF as blob
    const pdfBlob = pdf.output('blob');

    onProgress(100);

    return pdfBlob;
  } finally {
    // Clean up
    document.body.removeChild(container);
  }
};

/**
 * Convert Excel spreadsheet to PDF
 */
const convertExcelToPDF = async (file, onProgress) => {
  onProgress(20);

  // Read file as array buffer
  const arrayBuffer = await file.arrayBuffer();

  onProgress(40);

  // Parse Excel file
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });

  onProgress(60);

  // Create PDF
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  let isFirstSheet = true;

  // Process each sheet
  for (const sheetName of workbook.SheetNames) {
    if (!isFirstSheet) {
      pdf.addPage();
    }
    isFirstSheet = false;

    const worksheet = workbook.Sheets[sheetName];

    // Convert sheet to HTML
    const html = XLSX.utils.sheet_to_html(worksheet);

    // Create temporary container
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.fontSize = '10pt';
    container.innerHTML = `
      <h2 style="margin-bottom: 10px;">${sheetName}</h2>
      ${html}
    `;

    // Style the table
    const table = container.querySelector('table');
    if (table) {
      table.style.borderCollapse = 'collapse';
      table.style.width = '100%';
      table.style.fontSize = '9pt';

      const cells = table.querySelectorAll('td, th');
      cells.forEach(cell => {
        cell.style.border = '1px solid #ddd';
        cell.style.padding = '4px';
      });

      const headers = table.querySelectorAll('th');
      headers.forEach(header => {
        header.style.backgroundColor = '#f0f0f0';
        header.style.fontWeight = 'bold';
      });
    }

    document.body.appendChild(container);

    try {
      // Add content to PDF
      await pdf.html(container, {
        callback: function(doc) {
          // Handled by return
        },
        x: 10,
        y: 10,
        width: 277, // A4 landscape width minus margins
        windowWidth: 1123 // A4 landscape width in pixels
      });
    } finally {
      document.body.removeChild(container);
    }
  }

  onProgress(90);

  const pdfBlob = pdf.output('blob');

  onProgress(100);

  return pdfBlob;
};

/**
 * Convert PowerPoint to PDF
 * Note: Full PPTX parsing is complex. This creates a placeholder PDF.
 */
const convertPowerPointToPDF = async (file, onProgress) => {
  onProgress(50);

  // For now, create a placeholder PDF indicating the file type
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  // Create a nice placeholder page
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  // Background
  pdf.setFillColor(240, 240, 250);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  // Icon/Box
  pdf.setFillColor(59, 130, 246);
  pdf.roundedRect(pageWidth/2 - 30, 40, 60, 60, 5, 5, 'F');

  // Text
  pdf.setTextColor(59, 130, 246);
  pdf.setFontSize(48);
  pdf.text('📊', pageWidth/2, 75, { align: 'center' });

  pdf.setTextColor(30, 30, 30);
  pdf.setFontSize(24);
  pdf.text('PowerPoint File', pageWidth/2, 120, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setTextColor(100, 100, 100);
  pdf.text(file.name, pageWidth/2, 135, { align: 'center' });

  pdf.setFontSize(11);
  pdf.text('PowerPoint to PDF conversion has limited support.', pageWidth/2, 155, { align: 'center' });
  pdf.text('This is a placeholder. For full conversion, please use', pageWidth/2, 165, { align: 'center' });
  pdf.text('PowerPoint\'s built-in export or a desktop conversion tool.', pageWidth/2, 175, { align: 'center' });

  onProgress(100);

  return pdf.output('blob');
};

/**
 * Get file type from filename
 */
const getFileType = (filename) => {
  const ext = filename.split('.').pop().toLowerCase();
  if (ext === 'pdf') return 'pdf';
  if (['doc', 'docx'].includes(ext)) return 'word';
  if (['xls', 'xlsx'].includes(ext)) return 'excel';
  if (['ppt', 'pptx'].includes(ext)) return 'powerpoint';
  return 'unknown';
};

/**
 * Check if a file type is supported
 */
export const isSupportedFileType = (filename) => {
  const type = getFileType(filename);
  return ['pdf', 'word', 'excel', 'powerpoint'].includes(type);
};

/**
 * Get estimated conversion time in seconds
 */
export const getEstimatedConversionTime = (file) => {
  const type = getFileType(file.name);
  const sizeMB = file.size / (1024 * 1024);

  // Base times per file type
  const baseTimes = {
    pdf: 0.5,
    word: 3,
    excel: 4,
    powerpoint: 2
  };

  // Add time based on file size
  const baseTime = baseTimes[type] || 5;
  const sizeTime = sizeMB * 0.5; // 0.5 seconds per MB

  return Math.ceil(baseTime + sizeTime);
};
