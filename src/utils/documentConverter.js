/**
 * Document Converter Utility
 *
 * Client-side document conversion to PDF using browser libraries:
 * - DOCX: mammoth.js (converts to HTML) + jsPDF (HTML to PDF)
 * - XLSX: xlsx.js (reads spreadsheet) + jsPDF (renders to PDF)
 * - PPTX: JSZip + DOMParser (extracts text from slides) + jsPDF (creates PDF)
 *   Note: PPTX conversion extracts text only; images and formatting are not preserved
 * - PDF: Direct passthrough
 */

import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import JSZip from 'jszip';

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
 * Extracts text content from PPTX slides and creates a text-based PDF.
 * Note: Does not preserve formatting, images, or complex layouts.
 */
const convertPowerPointToPDF = async (file, onProgress) => {
  onProgress(20);

  try {
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();

    onProgress(30);

    // Unzip PPTX file
    const zip = await JSZip.loadAsync(arrayBuffer);

    onProgress(40);

    // Extract slide content
    const slides = [];
    const slideFiles = [];

    // Get all slide files
    Object.keys(zip.files).forEach(filename => {
      if (filename.match(/ppt\/slides\/slide\d+\.xml/)) {
        slideFiles.push(filename);
      }
    });

    // Sort slides by number
    slideFiles.sort((a, b) => {
      const numA = parseInt(a.match(/slide(\d+)\.xml/)[1]);
      const numB = parseInt(b.match(/slide(\d+)\.xml/)[1]);
      return numA - numB;
    });

    onProgress(50);

    // Extract text from each slide
    for (const slideFile of slideFiles) {
      const slideXml = await zip.files[slideFile].async('string');
      const textContent = extractTextFromSlideXml(slideXml);
      slides.push(textContent);
    }

    onProgress(70);

    // Create PDF from extracted text
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const maxHeight = pageHeight - (margin * 2);

    // Add each slide as a page
    slides.forEach((slideText, index) => {
      if (index > 0) {
        pdf.addPage();
      }

      // Slide number header
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 15, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text(`Slide ${index + 1} of ${slides.length}`, margin, 10);
      pdf.text(file.name, pageWidth - margin, 10, { align: 'right' });

      // Slide content
      pdf.setTextColor(30, 30, 30);
      pdf.setFontSize(11);

      if (slideText.trim()) {
        // Split text into lines that fit the page
        const lines = pdf.splitTextToSize(slideText, maxWidth);

        let y = 25;
        lines.forEach(line => {
          if (y > maxHeight) {
            return; // Skip if we exceed page height
          }
          pdf.text(line, margin, y);
          y += 6;
        });
      } else {
        // Empty slide
        pdf.setTextColor(150, 150, 150);
        pdf.text('[Empty slide or content not extracted]', margin, 30);
      }
    });

    // Add info page at the end
    pdf.addPage();
    pdf.setFillColor(240, 240, 250);
    pdf.rect(0, 0, pageWidth, pageHeight, 'F');

    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(14);
    pdf.text('PowerPoint Conversion Info', pageWidth/2, 40, { align: 'center' });

    pdf.setFontSize(10);
    const infoLines = [
      'This PDF was generated from a PowerPoint file using text extraction.',
      '',
      'Note: The following are NOT preserved in this conversion:',
      '• Images and graphics',
      '• Formatting (fonts, colors, sizes)',
      '• Slide layouts and positioning',
      '• Charts and diagrams',
      '• Animations and transitions',
      '',
      'For a complete conversion, please export to PDF from PowerPoint directly.'
    ];

    let y = 60;
    infoLines.forEach(line => {
      pdf.text(line, pageWidth/2, y, { align: 'center' });
      y += 7;
    });

    onProgress(100);

    return pdf.output('blob');
  } catch (error) {
    console.error('PowerPoint conversion error:', error);

    // If extraction fails, create an error PDF
    return createErrorPDF(file, error.message, onProgress);
  }
};

/**
 * Extract text from slide XML
 */
const extractTextFromSlideXml = (xmlString) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

  // Extract all text nodes (a:t tags in PowerPoint XML)
  const textNodes = xmlDoc.getElementsByTagName('a:t');
  const textContent = [];

  for (let i = 0; i < textNodes.length; i++) {
    const text = textNodes[i].textContent.trim();
    if (text) {
      textContent.push(text);
    }
  }

  // Join with line breaks, but try to detect paragraphs
  return textContent.join('\n');
};

/**
 * Create an error PDF when conversion fails
 */
const createErrorPDF = (file, errorMessage, onProgress) => {
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  pdf.setFillColor(255, 245, 245);
  pdf.rect(0, 0, pageWidth, pageHeight, 'F');

  pdf.setTextColor(200, 50, 50);
  pdf.setFontSize(24);
  pdf.text('Conversion Error', pageWidth/2, 50, { align: 'center' });

  pdf.setTextColor(80, 80, 80);
  pdf.setFontSize(12);
  pdf.text(file.name, pageWidth/2, 70, { align: 'center' });

  pdf.setFontSize(10);
  const errorLines = pdf.splitTextToSize(`Error: ${errorMessage}`, pageWidth - 60);
  let y = 90;
  errorLines.forEach(line => {
    pdf.text(line, pageWidth/2, y, { align: 'center' });
    y += 6;
  });

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
