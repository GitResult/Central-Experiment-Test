/**
 * Keyboard Shortcut Manager
 * Central registry for all keyboard shortcuts across the application
 * Handles shortcut registration, conflict detection, and execution
 */

class KeyboardShortcutManager {
  constructor() {
    this.shortcuts = new Map();
    this.listeners = new Set();
    this.enabled = true;
    this.currentContext = 'global';

    // Platform-specific modifier key
    this.isMac = typeof window !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.platform);
    this.modKey = this.isMac ? 'Cmd' : 'Ctrl';

    // Bind keyboard event handler
    if (typeof window !== 'undefined') {
      this.handleKeyDown = this.handleKeyDown.bind(this);
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }

  /**
   * Normalize shortcut string to consistent format
   * Examples: "Cmd+S" → "Meta+S", "Ctrl+Shift+P" → "Control+Shift+P"
   */
  normalizeShortcut(shortcut) {
    const parts = shortcut.split('+').map(part => part.trim());
    const normalized = parts.map(part => {
      switch (part.toLowerCase()) {
        case 'cmd':
        case 'command':
          return 'Meta';
        case 'ctrl':
        case 'control':
          return 'Control';
        case 'alt':
        case 'option':
          return 'Alt';
        case 'shift':
          return 'Shift';
        default:
          return part.length === 1 ? part.toUpperCase() : part;
      }
    });

    // Sort modifiers consistently: Meta/Control, Alt, Shift, Key
    const modifiers = [];
    let key = '';

    normalized.forEach(part => {
      if (part === 'Meta' || part === 'Control') modifiers.push(part);
      else if (part === 'Alt') modifiers.push(part);
      else if (part === 'Shift') modifiers.push(part);
      else key = part;
    });

    return [...modifiers, key].join('+');
  }

  /**
   * Register a keyboard shortcut
   * @param {string} shortcut - Shortcut string (e.g., "Cmd+S", "Ctrl+Shift+P")
   * @param {Function} handler - Function to execute when shortcut is triggered
   * @param {Object} options - Configuration options
   * @param {string} options.description - Human-readable description
   * @param {string} options.category - Category for grouping (e.g., "Panels", "Editor")
   * @param {string} options.context - Context where shortcut is active (default: "global")
   * @param {boolean} options.preventDefault - Whether to prevent default behavior
   * @returns {Function} Unregister function
   */
  register(shortcut, handler, options = {}) {
    const {
      description = '',
      category = 'General',
      context = 'global',
      preventDefault = true
    } = options;

    const normalized = this.normalizeShortcut(shortcut);
    const id = `${context}:${normalized}`;

    // Check for conflicts
    if (this.shortcuts.has(id)) {
      console.warn(`Keyboard shortcut conflict: ${shortcut} already registered in context "${context}"`);
    }

    // Store shortcut
    this.shortcuts.set(id, {
      shortcut: normalized,
      originalShortcut: shortcut,
      handler,
      description,
      category,
      context,
      preventDefault,
      enabled: true
    });

    // Notify listeners
    this.notifyListeners();

    // Return unregister function
    return () => this.unregister(shortcut, context);
  }

  /**
   * Unregister a keyboard shortcut
   */
  unregister(shortcut, context = 'global') {
    const normalized = this.normalizeShortcut(shortcut);
    const id = `${context}:${normalized}`;
    const deleted = this.shortcuts.delete(id);

    if (deleted) {
      this.notifyListeners();
    }

    return deleted;
  }

  /**
   * Handle keyboard events
   */
  handleKeyDown(event) {
    if (!this.enabled) return;

    // Don't trigger shortcuts when typing in input fields (unless explicitly allowed)
    const target = event.target;
    const isInput = target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.contentEditable === 'true';

    // Build shortcut string from event
    const parts = [];
    if (event.metaKey) parts.push('Meta');
    if (event.ctrlKey) parts.push('Control');
    if (event.altKey) parts.push('Alt');
    if (event.shiftKey) parts.push('Shift');

    // Get key
    let key = event.key;
    if (key.length === 1) {
      key = key.toUpperCase();
    }
    parts.push(key);

    const shortcut = parts.join('+');

    // Try current context first, then global
    const contexts = [this.currentContext, 'global'];

    for (const context of contexts) {
      const id = `${context}:${shortcut}`;
      const registered = this.shortcuts.get(id);

      if (registered && registered.enabled) {
        // Skip if typing in input (unless it's a common shortcut like Cmd+S)
        const isCommonShortcut = shortcut.includes('Meta+') || shortcut.includes('Control+');
        if (isInput && !isCommonShortcut) {
          continue;
        }

        if (registered.preventDefault) {
          event.preventDefault();
          event.stopPropagation();
        }

        registered.handler(event);
        return;
      }
    }
  }

  /**
   * Get all registered shortcuts, optionally filtered by context or category
   */
  getShortcuts({ context = null, category = null } = {}) {
    const shortcuts = Array.from(this.shortcuts.values());

    let filtered = shortcuts;
    if (context) {
      filtered = filtered.filter(s => s.context === context);
    }
    if (category) {
      filtered = filtered.filter(s => s.category === category);
    }

    return filtered;
  }

  /**
   * Get all categories
   */
  getCategories() {
    const categories = new Set();
    this.shortcuts.forEach(shortcut => {
      categories.add(shortcut.category);
    });
    return Array.from(categories).sort();
  }

  /**
   * Set current context
   */
  setContext(context) {
    this.currentContext = context;
  }

  /**
   * Enable/disable all shortcuts
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Enable/disable specific shortcut
   */
  setShortcutEnabled(shortcut, context = 'global', enabled = true) {
    const normalized = this.normalizeShortcut(shortcut);
    const id = `${context}:${normalized}`;
    const registered = this.shortcuts.get(id);

    if (registered) {
      registered.enabled = enabled;
      this.notifyListeners();
    }
  }

  /**
   * Subscribe to shortcut changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Notify all listeners of changes
   */
  notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * Format shortcut for display (platform-specific)
   */
  formatShortcut(shortcut) {
    let formatted = shortcut;

    if (this.isMac) {
      formatted = formatted
        .replace('Meta+', '⌘')
        .replace('Control+', '⌃')
        .replace('Alt+', '⌥')
        .replace('Shift+', '⇧');
    } else {
      formatted = formatted.replace('Meta+', 'Ctrl+');
    }

    return formatted;
  }

  /**
   * Cleanup
   */
  destroy() {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
    this.shortcuts.clear();
    this.listeners.clear();
  }
}

// Singleton instance
export const keyboardShortcutManager = new KeyboardShortcutManager();

export default keyboardShortcutManager;
