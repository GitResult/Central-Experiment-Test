/**
 * Document Converter Utility
 *
 * Client-side document conversion to PDF using browser libraries:
 * - DOCX: mammoth.js (extracts text) + jsPDF (creates formatted PDF)
 * - XLSX: xlsx.js (parses spreadsheet) + jsPDF + autotable (renders tables to PDF)
 * - PPTX: JSZip (unzips file) + DOMParser (extracts text from slide XML) + jsPDF (creates PDF)
 *
 * Note: All conversions extract text content only. Images, complex formatting,
 * and layouts are not preserved. For full fidelity, export to PDF from the source application.
 */

import mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
 * Extracts text content from DOCX and creates a formatted PDF
 */
const convertWordToPDF = async (file, onProgress) => {
  onProgress(20);

  try {
    // Read file as array buffer
    const arrayBuffer = await file.arrayBuffer();

    onProgress(40);

    // Convert DOCX to text using mammoth
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;

    onProgress(60);

    // Create PDF from extracted text
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxWidth = pageWidth - (margin * 2);
    const lineHeight = 7;
    const maxLinesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);

    onProgress(70);

    // Add header
    pdf.setFillColor(59, 130, 246);
    pdf.rect(0, 0, pageWidth, 12, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text(file.name, margin, 8);

    // Add content
    pdf.setTextColor(30, 30, 30);
    pdf.setFontSize(11);

    if (text.trim()) {
      // Split text into lines that fit the page width
      const lines = pdf.splitTextToSize(text, maxWidth);

      let y = margin + 5;
      let pageNum = 1;
      let linesOnPage = 0;

      lines.forEach((line, index) => {
        // Check if we need a new page
        if (linesOnPage >= maxLinesPerPage) {
          pdf.addPage();
          pageNum++;

          // Add header to new page
          pdf.setFillColor(59, 130, 246);
          pdf.rect(0, 0, pageWidth, 12, 'F');

          pdf.setTextColor(255, 255, 255);
          pdf.setFontSize(10);
          pdf.text(file.name, margin, 8);
          pdf.text(`Page ${pageNum}`, pageWidth - margin, 8, { align: 'right' });

          // Reset for content
          pdf.setTextColor(30, 30, 30);
          pdf.setFontSize(11);

          y = margin + 5;
          linesOnPage = 0;
        }

        pdf.text(line, margin, y);
        y += lineHeight;
        linesOnPage++;
      });
    } else {
      // Empty document
      pdf.setTextColor(150, 150, 150);
      pdf.text('[Empty document or content not extracted]', margin, margin + 10);
    }

    onProgress(90);

    // Get PDF as blob
    const pdfBlob = pdf.output('blob');

    onProgress(100);

    return pdfBlob;
  } catch (error) {
    console.error('Word conversion error:', error);
    return createErrorPDF(file, error.message, onProgress);
  }
};

/**
 * Convert Excel spreadsheet to PDF
 * Renders spreadsheet data as formatted tables in PDF
 */
const convertExcelToPDF = async (file, onProgress) => {
  onProgress(20);

  try {
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

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const maxWidth = pageWidth - (margin * 2);

    let isFirstSheet = true;

    // Process each sheet
    for (const sheetName of workbook.SheetNames) {
      if (!isFirstSheet) {
        pdf.addPage();
      }
      isFirstSheet = false;

      const worksheet = workbook.Sheets[sheetName];

      // Add header
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 0, pageWidth, 12, 'F');

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text(file.name, margin, 8);
      pdf.text(`Sheet: ${sheetName}`, pageWidth - margin, 8, { align: 'right' });

      // Convert sheet to array of arrays
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      if (data.length === 0) {
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(11);
        pdf.text('[Empty sheet]', margin, 25);
        continue;
      }

      // Use autoTable for better table rendering
      if (pdf.autoTable) {
        pdf.autoTable({
          head: data.length > 0 ? [data[0]] : [],
          body: data.slice(1),
          startY: 18,
          margin: { left: margin, right: margin },
          styles: {
            fontSize: 8,
            cellPadding: 2
          },
          headStyles: {
            fillColor: [59, 130, 246],
            textColor: 255,
            fontStyle: 'bold'
          },
          alternateRowStyles: {
            fillColor: [245, 247, 250]
          }
        });
      } else {
        // Fallback: render as text if autoTable is not available
        pdf.setTextColor(30, 30, 30);
        pdf.setFontSize(8);

        let y = 20;
        const lineHeight = 5;
        const maxRows = Math.floor((pageHeight - 25) / lineHeight);

        data.slice(0, maxRows).forEach((row, rowIndex) => {
          const rowText = row.join(' | ');
          const lines = pdf.splitTextToSize(rowText, maxWidth);

          if (y + (lines.length * lineHeight) > pageHeight - margin) {
            return; // Skip if we exceed page height
          }

          lines.forEach(line => {
            pdf.text(line, margin, y);
            y += lineHeight;
          });
        });

        if (data.length > maxRows) {
          pdf.setTextColor(150, 150, 150);
          pdf.text(`... ${data.length - maxRows} more rows`, margin, y);
        }
      }
    }

    onProgress(90);

    const pdfBlob = pdf.output('blob');

    onProgress(100);

    return pdfBlob;
  } catch (error) {
    console.error('Excel conversion error:', error);
    return createErrorPDF(file, error.message, onProgress);
  }
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
