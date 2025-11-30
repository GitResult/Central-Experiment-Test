/**
 * URL Serialization Utilities
 * Capture and restore page state (filters, scroll position, etc.)
 */

/**
 * Capture current page state for deep linking
 * @returns {Object} - Page state with URL, filters, scroll position
 */
export function capturePageState() {
  return {
    url: window.location.pathname + window.location.search,
    pathname: window.location.pathname,
    search: window.location.search,
    filters: extractFiltersFromURL(),
    scrollPosition: {
      x: window.scrollX,
      y: window.scrollY,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Extract filters from URL query parameters
 * @returns {Object} - Filters as key-value pairs
 */
export function extractFiltersFromURL() {
  const params = new URLSearchParams(window.location.search);
  const filters = {};

  for (const [key, value] of params.entries()) {
    // Parse JSON values if they look like JSON
    try {
      filters[key] = JSON.parse(value);
    } catch {
      filters[key] = value;
    }
  }

  return filters;
}

/**
 * Serialize filters to URL query string
 * @param {Object} filters - Filters to serialize
 * @returns {string} - Query string (e.g., "?status=pending&priority=high")
 */
export function serializeFilters(filters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    // Serialize objects as JSON
    const serialized = typeof value === 'object'
      ? JSON.stringify(value)
      : String(value);
    params.set(key, serialized);
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

/**
 * Restore page state from snapshot context
 * @param {Object} sourceContext - Context captured when snapshot was created
 */
export function restorePageState(sourceContext) {
  if (!sourceContext) {
    console.warn('restorePageState: no sourceContext provided');
    return;
  }

  // Restore scroll position (after a short delay for page to render)
  if (sourceContext.scrollPosition) {
    setTimeout(() => {
      window.scrollTo({
        left: sourceContext.scrollPosition.x || 0,
        top: sourceContext.scrollPosition.y || 0,
        behavior: 'smooth',
      });
    }, 100);
  }

  console.log('Page state restored:', {
    url: sourceContext.url,
    filters: sourceContext.filters,
    scroll: sourceContext.scrollPosition,
  });
}

/**
 * Build full URL with filters
 * @param {string} pathname - Base path (e.g., "/contacts")
 * @param {Object} filters - Filters to append
 * @returns {string} - Full URL with query string
 */
export function buildURLWithFilters(pathname, filters = {}) {
  const queryString = serializeFilters(filters);
  return pathname + queryString;
}

/**
 * Check if source URL is still valid (exists in app)
 * @param {string} url - URL to check
 * @returns {boolean} - True if URL is valid
 */
export function isValidSourceURL(url) {
  if (!url) return false;

  // List of known valid paths in the app
  const validPaths = [
    '/',
    '/contacts',
    '/tasks',
    '/showcase',
    '/studio',
    '/help5',
    '/discussions',
    '/snapshots',
    '/editor',
    '/canvas',
    '/page',
  ];

  const pathname = url.split('?')[0];

  // Check if pathname starts with any valid path
  return validPaths.some(path =>
    pathname === path || pathname.startsWith(path + '/')
  );
}
