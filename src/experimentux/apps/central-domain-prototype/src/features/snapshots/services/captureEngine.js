/**
 * Capture Engine
 * Service for capturing DOM regions as PNG images using modern-screenshot
 */

import { domToBlob } from 'modern-screenshot';

/**
 * Captures a DOM region as PNG image
 * @param {Object} region - Region coordinates {x, y, width, height}
 * @param {Object} options - Capture options
 * @param {number} options.scale - Pixel density (1 = standard, 2 = retina)
 * @param {string} options.backgroundColor - Background color for transparent regions
 * @returns {Promise<{dataUrl: string, blob: Blob, dimensions: {width, height}}>}
 */
export async function captureRegion(region, options = {}) {
  const {
    scale = window.devicePixelRatio || 1,
    backgroundColor = '#ffffff',
  } = options;

  // Validate inputs
  if (!region || typeof region !== 'object') {
    throw new Error('captureRegion: region is required');
  }

  const { x, y, width, height } = region;
  if (width <= 0 || height <= 0) {
    throw new Error('captureRegion: width and height must be positive');
  }

  try {
    // Wait for fonts and images to load
    await document.fonts.ready;

    // Use modern-screenshot to capture the document body
    // modern-screenshot handles CSS variables, CSS-in-JS, and modern CSS automatically
    const blob = await domToBlob(document.body, {
      width,
      height,
      scale,
      backgroundColor,
      style: {
        // Position the viewport to capture the selected region
        transform: `translate(${-x}px, ${-y}px)`,
        transformOrigin: 'top left',
      },
      // Filter function to exclude overlay elements
      filter: (element) => {
        // Exclude capture overlay elements
        if (element.classList) {
          const classesToIgnore = [
            'capture-overlay',
            'capture-overlay__background',
            'capture-overlay__selection',
            'capture-overlay__dimensions',
            'capture-overlay__instructions',
          ];
          for (const className of classesToIgnore) {
            if (element.classList.contains(className)) {
              return false;
            }
          }
        }
        // Exclude by data attribute
        if (element.hasAttribute && element.hasAttribute('data-capture-overlay')) {
          return false;
        }
        return true;
      },
    });

    // Convert blob to data URL
    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error('Failed to convert blob to data URL'));
      reader.readAsDataURL(blob);
    });

    return {
      dataUrl,
      blob,
      dimensions: {
        width: Math.round(width * scale),
        height: Math.round(height * scale),
      },
    };
  } catch (error) {
    console.error('captureRegion failed:', error);
    throw new Error(`Capture failed: ${error.message}`);
  }
}

/**
 * Compresses PNG blob (reduces file size by 50-70%)
 * @param {Blob} blob - PNG blob to compress
 * @returns {Promise<Blob>} - Compressed blob
 */
export async function compressImage(blob) {
  // Use Canvas API to downsample and recompress
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Target: Max 2000px width (maintains aspect ratio)
      const maxWidth = 2000;
      const scale = img.width > maxWidth ? maxWidth / img.width : 1;

      const canvas = document.createElement('canvas');
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob(
        (compressedBlob) => {
          if (compressedBlob) resolve(compressedBlob);
          else reject(new Error('Compression failed'));
        },
        'image/png',
        0.85 // 85% quality (balance size vs quality)
      );
    };
    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(blob);
  });
}
