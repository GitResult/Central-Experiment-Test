/**
 * File Upload Utility
 * Handle file upload interactions
 */

/**
 * Open file picker and read file
 * @param {Object} options - Upload options
 * @param {string} options.accept - Accepted file types (e.g., '.csv,.xlsx')
 * @param {boolean} options.multiple - Allow multiple files
 * @param {string} options.readAs - How to read file ('text', 'json', 'arraybuffer', 'dataurl')
 * @returns {Promise} Promise resolving to file data
 */
export function uploadFile(options = {}) {
  const {
    accept = '*/*',
    multiple = false,
    readAs = 'text'
  } = options;

  return new Promise((resolve, reject) => {
    // Create file input
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.multiple = multiple;
    input.style.display = 'none';

    input.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);

      if (files.length === 0) {
        reject(new Error('No file selected'));
        return;
      }

      try {
        if (multiple) {
          const results = await Promise.all(files.map(file => readFile(file, readAs)));
          resolve(results);
        } else {
          const result = await readFile(files[0], readAs);
          resolve(result);
        }
      } catch (err) {
        reject(err);
      } finally {
        document.body.removeChild(input);
      }
    });

    input.addEventListener('cancel', () => {
      reject(new Error('Upload cancelled'));
      document.body.removeChild(input);
    });

    document.body.appendChild(input);
    input.click();
  });
}

/**
 * Read a file with FileReader
 * @param {File} file - File object
 * @param {string} readAs - Read method
 * @returns {Promise} Promise resolving to file data
 */
function readFile(file, readAs) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      let result = e.target.result;

      if (readAs === 'json') {
        try {
          result = JSON.parse(result);
        } catch (err) {
          reject(new Error('Invalid JSON file'));
          return;
        }
      }

      resolve({
        name: file.name,
        type: file.type,
        size: file.size,
        lastModified: file.lastModified,
        data: result
      });
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    switch (readAs) {
      case 'text':
      case 'json':
        reader.readAsText(file);
        break;
      case 'arraybuffer':
        reader.readAsArrayBuffer(file);
        break;
      case 'dataurl':
        reader.readAsDataURL(file);
        break;
      default:
        reject(new Error(`Invalid read mode: ${readAs}`));
    }
  });
}

/**
 * Upload CSV file
 */
export function uploadCSV() {
  return uploadFile({
    accept: '.csv,text/csv',
    readAs: 'text'
  });
}

/**
 * Upload JSON file
 */
export function uploadJSON() {
  return uploadFile({
    accept: '.json,application/json',
    readAs: 'json'
  });
}

/**
 * Upload Excel file
 */
export function uploadExcel() {
  return uploadFile({
    accept: '.xlsx,.xls',
    readAs: 'arraybuffer'
  });
}

/**
 * Upload image file
 */
export function uploadImage() {
  return uploadFile({
    accept: 'image/*',
    readAs: 'dataurl'
  });
}

export default uploadFile;
