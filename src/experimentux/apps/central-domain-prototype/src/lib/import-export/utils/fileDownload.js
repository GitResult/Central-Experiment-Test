/**
 * File Download Utility
 * Trigger browser file downloads
 */

/**
 * Trigger a file download in the browser
 * @param {string|Blob} data - File data (string, Blob, or ArrayBuffer)
 * @param {string} filename - Name for the downloaded file
 * @param {string} mimeType - MIME type of the file
 */
export function downloadFile(data, filename, mimeType = 'application/octet-stream') {
  let blob;

  if (data instanceof Blob) {
    blob = data;
  } else if (typeof data === 'string') {
    blob = new Blob([data], { type: mimeType });
  } else if (data instanceof ArrayBuffer) {
    blob = new Blob([data], { type: mimeType });
  } else {
    console.error('Invalid data type for download');
    return;
  }

  // Create temporary URL
  const url = URL.createObjectURL(blob);

  // Create temporary link element
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';

  // Append to document, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Cleanup URL
  setTimeout(() => URL.revokeObjectURL(url), 100);
}

/**
 * Download text content as a file
 * @param {string} text - Text content
 * @param {string} filename - Filename
 */
export function downloadTextFile(text, filename) {
  downloadFile(text, filename, 'text/plain');
}

/**
 * Download JSON data as a file
 * @param {Object} data - JavaScript object
 * @param {string} filename - Filename
 */
export function downloadJSON(data, filename) {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, 'application/json');
}

export default downloadFile;
