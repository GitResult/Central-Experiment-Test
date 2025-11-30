/**
 * Data Binding System
 * Supports multiple binding modes and data providers
 *
 * Binding Modes:
 * - static: Fixed value, no binding
 * - direct: Bind to a specific data field (e.g., "user.name")
 * - expression: JavaScript expression for computed values (e.g., "user.firstName + ' ' + user.lastName")
 * - context: Bind to context providers (page, user, system)
 * - api: Bind to external API data
 * - store: Bind to global state store
 */

/**
 * Parse a data path string into parts
 * @param {string} path - Dot-notation path (e.g., "user.profile.name")
 * @returns {string[]} Array of path parts
 */
function parsePath(path) {
  if (!path || typeof path !== 'string') return [];
  return path.split('.').filter(Boolean);
}

/**
 * Get value from nested object using path
 * @param {Object} obj - Source object
 * @param {string} path - Dot-notation path
 * @param {*} defaultValue - Default value if path not found
 * @returns {*} Value at path or default value
 */
function getNestedValue(obj, path, defaultValue = undefined) {
  if (!obj || !path) return defaultValue;

  const parts = parsePath(path);
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return defaultValue;
    }

    if (Array.isArray(current)) {
      const index = parseInt(part, 10);
      if (!isNaN(index)) {
        current = current[index];
        continue;
      }
    }

    current = current[part];
  }

  return current !== undefined ? current : defaultValue;
}

/**
 * Set value in nested object using path
 * @param {Object} obj - Target object
 * @param {string} path - Dot-notation path
 * @param {*} value - Value to set
 * @returns {Object} Updated object
 */
function setNestedValue(obj, path, value) {
  if (!obj || !path) return obj;

  const parts = parsePath(path);
  const result = { ...obj };
  let current = result;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] === undefined) {
      current[part] = {};
    } else {
      current[part] = { ...current[part] };
    }
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
  return result;
}

/**
 * Evaluate a JavaScript expression safely
 * @param {string} expression - JavaScript expression
 * @param {Object} context - Context object for variable resolution
 * @returns {*} Result of expression or error object
 */
function evaluateExpression(expression, context = {}) {
  try {
    // Create a function with context variables as parameters
    const contextKeys = Object.keys(context);
    const contextValues = contextKeys.map(key => context[key]);

    // eslint-disable-next-line no-new-func
    const fn = new Function(...contextKeys, `return ${expression}`);
    return fn(...contextValues);
  } catch (error) {
    console.error('Expression evaluation error:', error);
    return { error: error.message, expression };
  }
}

/**
 * Resolve data binding based on mode
 * @param {Object} binding - Binding configuration
 * @param {string} binding.mode - Binding mode (static, direct, expression, context, api, store)
 * @param {*} binding.value - Static value or binding path/expression
 * @param {Object} providers - Data providers { page, user, system, api, store }
 * @returns {*} Resolved value
 */
export function resolveBinding(binding, providers = {}) {
  if (!binding) return undefined;

  const { mode = 'static', value, defaultValue } = binding;

  switch (mode) {
    case 'static':
      // Return static value as-is
      return value !== undefined ? value : defaultValue;

    case 'direct': {
      // Bind to a specific field in data providers
      const { source = 'page', path } = binding;
      const sourceData = providers[source];
      return getNestedValue(sourceData, path, defaultValue);
    }

    case 'expression': {
      // Evaluate JavaScript expression
      const expression = binding.expression || value;
      if (!expression) return defaultValue;

      const context = {
        page: providers.page || {},
        user: providers.user || {},
        system: providers.system || {},
        api: providers.api || {},
        store: providers.store || {},
      };

      const result = evaluateExpression(expression, context);
      return result?.error ? defaultValue : result;
    }

    case 'context': {
      // Bind to context provider
      const { source = 'page', path } = binding;
      const sourceData = providers[source];
      return path ? getNestedValue(sourceData, path, defaultValue) : sourceData;
    }

    case 'api': {
      // API bindings should be resolved asynchronously
      // This is just a placeholder for the sync API
      return providers.api?.[binding.endpoint] || defaultValue;
    }

    case 'store': {
      // Bind to global store
      const { path } = binding;
      return getNestedValue(providers.store, path, defaultValue);
    }

    default:
      console.warn(`Unknown binding mode: ${mode}`);
      return defaultValue;
  }
}

/**
 * Resolve multiple bindings
 * @param {Object} bindings - Object with binding configurations
 * @param {Object} providers - Data providers
 * @returns {Object} Object with resolved values
 */
export function resolveBindings(bindings, providers = {}) {
  if (!bindings || typeof bindings !== 'object') return {};

  const resolved = {};

  Object.keys(bindings).forEach(key => {
    resolved[key] = resolveBinding(bindings[key], providers);
  });

  return resolved;
}

/**
 * Check if a value is a binding configuration
 * @param {*} value - Value to check
 * @returns {boolean} True if value is a binding configuration
 */
export function isBinding(value) {
  return (
    value &&
    typeof value === 'object' &&
    'mode' in value &&
    ['static', 'direct', 'expression', 'context', 'api', 'store'].includes(value.mode)
  );
}

/**
 * Create a static binding
 * @param {*} value - Static value
 * @returns {Object} Binding configuration
 */
export function staticBinding(value) {
  return { mode: 'static', value };
}

/**
 * Create a direct field binding
 * @param {string} source - Data source (page, user, system, api, store)
 * @param {string} path - Dot-notation path to field
 * @param {*} defaultValue - Default value if field not found
 * @returns {Object} Binding configuration
 */
export function directBinding(source, path, defaultValue) {
  return { mode: 'direct', source, path, defaultValue };
}

/**
 * Create an expression binding
 * @param {string} expression - JavaScript expression
 * @param {*} defaultValue - Default value if expression fails
 * @returns {Object} Binding configuration
 */
export function expressionBinding(expression, defaultValue) {
  return { mode: 'expression', expression, defaultValue };
}

/**
 * Create a context binding
 * @param {string} source - Context source (page, user, system)
 * @param {string} path - Optional path within context
 * @param {*} defaultValue - Default value
 * @returns {Object} Binding configuration
 */
export function contextBinding(source, path, defaultValue) {
  return { mode: 'context', source, path, defaultValue };
}

/**
 * Create an API binding
 * @param {string} endpoint - API endpoint identifier
 * @param {*} defaultValue - Default value
 * @returns {Object} Binding configuration
 */
export function apiBinding(endpoint, defaultValue) {
  return { mode: 'api', endpoint, defaultValue };
}

/**
 * Create a store binding
 * @param {string} path - Path in global store
 * @param {*} defaultValue - Default value
 * @returns {Object} Binding configuration
 */
export function storeBinding(path, defaultValue) {
  return { mode: 'store', path, defaultValue };
}

/**
 * Transform data for element consumption
 * @param {*} value - Raw data value
 * @param {Object} transform - Transform configuration
 * @returns {*} Transformed value
 */
export function transformData(value, transform = {}) {
  if (!transform || typeof transform !== 'object') return value;

  let result = value;

  // Format transformation
  if (transform.format) {
    switch (transform.format) {
      case 'uppercase':
        result = String(result).toUpperCase();
        break;
      case 'lowercase':
        result = String(result).toLowerCase();
        break;
      case 'capitalize':
        result = String(result).charAt(0).toUpperCase() + String(result).slice(1);
        break;
      case 'number':
        result = Number(result);
        break;
      case 'currency':
        result = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: transform.currency || 'USD',
        }).format(Number(result));
        break;
      case 'date':
        result = new Date(result).toLocaleDateString();
        break;
      case 'datetime':
        result = new Date(result).toLocaleString();
        break;
      default:
        break;
    }
  }

  // Prefix/Suffix
  if (transform.prefix) {
    result = transform.prefix + result;
  }
  if (transform.suffix) {
    result = result + transform.suffix;
  }

  // Default value if result is null/undefined
  if (transform.defaultValue !== undefined && (result === null || result === undefined)) {
    result = transform.defaultValue;
  }

  return result;
}

// Export utility functions
export { getNestedValue, setNestedValue, evaluateExpression };
