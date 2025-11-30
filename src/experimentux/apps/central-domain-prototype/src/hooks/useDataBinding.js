/**
 * useDataBinding Hook
 * Integrates data binding system with data providers
 */

import { useMemo } from 'react';
import { useDataProviders } from '../contexts/DataProvidersContext';
import {
  resolveBinding,
  resolveBindings,
  transformData,
  isBinding,
} from '../utils/dataBinding';

/**
 * Hook to resolve a single data binding
 * @param {Object} binding - Binding configuration
 * @returns {*} Resolved value
 */
export function useDataBinding(binding) {
  const providers = useDataProviders();

  return useMemo(() => {
    if (!binding) return undefined;

    // If it's not a binding object, return as-is
    if (!isBinding(binding)) {
      return binding;
    }

    // Resolve the binding
    const resolved = resolveBinding(binding, providers);

    // Apply transformation if specified
    if (binding.transform) {
      return transformData(resolved, binding.transform);
    }

    return resolved;
  }, [binding, providers]);
}

/**
 * Hook to resolve multiple data bindings
 * @param {Object} bindings - Object with binding configurations
 * @returns {Object} Object with resolved values
 */
export function useDataBindings(bindings) {
  const providers = useDataProviders();

  return useMemo(() => {
    if (!bindings || typeof bindings !== 'object') return {};

    const resolved = {};

    Object.keys(bindings).forEach(key => {
      const binding = bindings[key];

      if (!isBinding(binding)) {
        resolved[key] = binding;
        return;
      }

      const value = resolveBinding(binding, providers);
      resolved[key] = binding.transform
        ? transformData(value, binding.transform)
        : value;
    });

    return resolved;
  }, [bindings, providers]);
}

/**
 * Hook to resolve element data settings
 * Combines static data with bound data
 * @param {Object} dataSettings - Element data settings from schema
 * @returns {Object} Resolved data object
 */
export function useElementData(dataSettings) {
  const providers = useDataProviders();

  return useMemo(() => {
    if (!dataSettings || typeof dataSettings !== 'object') return {};

    const resolved = {};

    Object.keys(dataSettings).forEach(key => {
      const setting = dataSettings[key];

      // Handle binding objects
      if (setting && typeof setting === 'object' && 'binding' in setting) {
        const { binding, transform, defaultValue } = setting;

        if (!binding) {
          resolved[key] = defaultValue;
          return;
        }

        const value = resolveBinding(binding, providers);
        resolved[key] = transform ? transformData(value, transform) : value;
      } else {
        // Static value
        resolved[key] = setting;
      }
    });

    return resolved;
  }, [dataSettings, providers]);
}

/**
 * Hook to check if a binding is loading (for async data sources)
 * @param {Object} binding - Binding configuration
 * @returns {boolean} True if binding is loading
 */
export function useBindingLoading(binding) {
  const { isApiLoading } = useDataProviders();

  return useMemo(() => {
    if (!binding || !isBinding(binding)) return false;

    if (binding.mode === 'api') {
      return isApiLoading(binding.endpoint);
    }

    return false;
  }, [binding, isApiLoading]);
}

/**
 * Hook to get binding error (for async data sources)
 * @param {Object} binding - Binding configuration
 * @returns {string|null} Error message or null
 */
export function useBindingError(binding) {
  const { getApiError } = useDataProviders();

  return useMemo(() => {
    if (!binding || !isBinding(binding)) return null;

    if (binding.mode === 'api') {
      return getApiError(binding.endpoint);
    }

    return null;
  }, [binding, getApiError]);
}

/**
 * Hook to fetch API data for a binding
 * @param {Object} binding - API binding configuration
 * @param {Object} options - Fetch options
 */
export function useFetchBinding(binding, options = {}) {
  const { fetchApi } = useDataProviders();

  return useMemo(() => {
    if (!binding || binding.mode !== 'api') {
      return null;
    }

    return () => fetchApi(binding.endpoint, options);
  }, [binding, fetchApi, options]);
}

/**
 * Hook to watch for data changes and trigger callbacks
 * @param {Object} binding - Binding configuration
 * @param {Function} onChange - Callback when data changes
 */
export function useBindingWatch(binding, onChange) {
  const value = useDataBinding(binding);

  useMemo(() => {
    if (onChange && typeof onChange === 'function') {
      onChange(value);
    }
  }, [value, onChange]);

  return value;
}

/**
 * Hook for two-way data binding
 * @param {Object} binding - Binding configuration
 * @returns {[value, setValue]} Tuple of current value and setter function
 */
export function useTwoWayBinding(binding) {
  const { updatePageData, updateStore } = useDataProviders();
  const value = useDataBinding(binding);

  const setValue = useMemo(() => {
    if (!binding || !isBinding(binding)) {
      return () => {
        console.warn('Cannot set value on non-binding');
      };
    }

    return (newValue) => {
      const { mode, source, path } = binding;

      switch (mode) {
        case 'direct':
          if (source === 'page') {
            updatePageData({ [path]: newValue });
          } else if (source === 'store') {
            updateStore({ [path]: newValue });
          } else {
            console.warn(`Two-way binding not supported for source: ${source}`);
          }
          break;

        case 'context':
          if (source === 'page') {
            updatePageData({ [path]: newValue });
          } else if (source === 'store') {
            updateStore({ [path]: newValue });
          } else {
            console.warn(`Two-way binding not supported for context source: ${source}`);
          }
          break;

        case 'store':
          updateStore({ [path]: newValue });
          break;

        default:
          console.warn(`Two-way binding not supported for mode: ${mode}`);
      }
    };
  }, [binding, updatePageData, updateStore]);

  return [value, setValue];
}
