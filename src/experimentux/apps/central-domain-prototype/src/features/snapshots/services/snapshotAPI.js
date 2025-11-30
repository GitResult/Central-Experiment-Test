/**
 * Snapshot API
 * Mock API service for snapshots (uses localStorage for prototype)
 */

const STORAGE_KEY = 'central_snapshots';

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Convert blob to base64 data URL
 * @param {Blob} blob - Image blob
 * @returns {Promise<string>} - Base64 data URL
 */
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read blob'));
    reader.readAsDataURL(blob);
  });
}

/**
 * Create thumbnail from blob
 * @param {Blob} blob - Original image blob
 * @param {number} maxWidth - Maximum thumbnail width
 * @param {number} maxHeight - Maximum thumbnail height
 * @returns {Promise<string>} - Thumbnail data URL
 */
function createThumbnail(blob, maxWidth = 400, maxHeight = 300) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      // Calculate scaled dimensions
      let width = img.width;
      let height = img.height;

      if (width > maxWidth || height > maxHeight) {
        const aspectRatio = width / height;
        if (aspectRatio > maxWidth / maxHeight) {
          width = maxWidth;
          height = width / aspectRatio;
        } else {
          height = maxHeight;
          width = height * aspectRatio;
        }
      }

      // Create canvas and draw scaled image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      // Convert to data URL
      resolve(canvas.toDataURL('image/png', 0.8));
    };
    img.onerror = () => reject(new Error('Failed to load image for thumbnail'));
    img.src = URL.createObjectURL(blob);
  });
}

function getStoredSnapshots() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch (error) {
    console.error('Failed to parse stored snapshots:', error);
    return [];
  }
}

function saveSnapshots(snapshots) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
  } catch (error) {
    console.error('Failed to save snapshots:', error);
    throw new Error('Storage quota exceeded');
  }
}

/**
 * Upload new snapshot to storage
 * @param {Object} data - Snapshot data
 * @param {Blob} data.imageBlob - PNG image blob
 * @param {Object} data.sourceContext - Source page context (URL, filters, scroll)
 * @param {Object} data.metadata - Additional metadata (dimensions, timestamp, etc.)
 * @returns {Promise<Object>} - Created snapshot object
 */
export async function uploadSnapshot({ imageBlob, sourceContext, metadata }) {
  // Validate inputs
  if (!imageBlob || !(imageBlob instanceof Blob)) {
    throw new Error('uploadSnapshot: imageBlob must be a Blob');
  }
  if (!sourceContext || !sourceContext.url) {
    throw new Error('uploadSnapshot: sourceContext.url is required');
  }

  await delay(500); // Simulate network delay

  // Convert blob to base64 data URL for localStorage persistence
  // Blob URLs (URL.createObjectURL) are temporary and don't persist across page reloads
  const imageDataUrl = await blobToDataURL(imageBlob);
  const thumbnailDataUrl = await createThumbnail(imageBlob, 400, 300);

  const snapshot = {
    id: `snap_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    imageUrl: imageDataUrl,
    thumbnailUrl: thumbnailDataUrl,
    sourceContext,
    metadata: {
      ...metadata,
      capturedAt: new Date().toISOString(),
      fileSize: imageBlob.size,
    },
    createdAt: new Date().toISOString(),
    createdBy: 'user_1', // Mock user ID
    status: 'active',
    discussions: [],
  };

  // Store in localStorage
  const snapshots = getStoredSnapshots();
  snapshots.push(snapshot);
  saveSnapshots(snapshots);

  return snapshot;
}

/**
 * Retrieve snapshot by ID
 * @param {string} snapshotId - Snapshot ID
 * @returns {Promise<Object>} - Snapshot object with image URL and metadata
 */
export async function getSnapshot(snapshotId) {
  if (!snapshotId) {
    throw new Error('getSnapshot: snapshotId is required');
  }

  await delay(200);

  const snapshots = getStoredSnapshots();
  const snapshot = snapshots.find(s => s.id === snapshotId);

  if (!snapshot) {
    throw new Error('Snapshot not found');
  }

  return snapshot;
}

/**
 * List snapshots (with filters and pagination)
 * @param {Object} options - Query options
 * @param {string} options.module - Filter by module (e.g., 'finance', 'hr')
 * @param {string} options.cursor - Pagination cursor
 * @param {number} options.limit - Results per page (default: 20)
 * @returns {Promise<{snapshots: Array, pagination: Object}>}
 */
export async function listSnapshots(options = {}) {
  const {
    module = null,
    cursor = null,
    limit = 20,
  } = options;

  await delay(300);

  let snapshots = getStoredSnapshots();

  // Sort by creation date (newest first)
  snapshots.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Filter by module if specified
  if (module) {
    snapshots = snapshots.filter(s =>
      s.sourceContext.module === module
    );
  }

  // Simple pagination (in a real app, use cursor-based)
  const startIndex = cursor ? parseInt(cursor, 10) : 0;
  const paginatedSnapshots = snapshots.slice(startIndex, startIndex + limit);
  const hasMore = startIndex + limit < snapshots.length;

  return {
    snapshots: paginatedSnapshots,
    pagination: {
      nextCursor: hasMore ? (startIndex + limit).toString() : null,
      hasMore,
    },
  };
}

/**
 * Update snapshot
 * @param {string} snapshotId - Snapshot ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Updated snapshot
 */
export async function updateSnapshot(snapshotId, updates) {
  if (!snapshotId) {
    throw new Error('updateSnapshot: snapshotId is required');
  }

  await delay(200);

  const snapshots = getStoredSnapshots();
  const index = snapshots.findIndex(s => s.id === snapshotId);

  if (index === -1) {
    throw new Error('Snapshot not found');
  }

  snapshots[index] = {
    ...snapshots[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  saveSnapshots(snapshots);

  return snapshots[index];
}

/**
 * Delete snapshot
 * @param {string} snapshotId - Snapshot ID to delete
 * @returns {Promise<void>}
 */
export async function deleteSnapshot(snapshotId) {
  if (!snapshotId) {
    throw new Error('deleteSnapshot: snapshotId is required');
  }

  await delay(200);

  const snapshots = getStoredSnapshots();
  const filtered = snapshots.filter(s => s.id !== snapshotId);

  if (filtered.length === snapshots.length) {
    throw new Error('Snapshot not found');
  }

  saveSnapshots(filtered);
}

/**
 * Clear all snapshots (for testing)
 * @returns {Promise<void>}
 */
export async function clearAllSnapshots() {
  await delay(100);
  localStorage.removeItem(STORAGE_KEY);
}
