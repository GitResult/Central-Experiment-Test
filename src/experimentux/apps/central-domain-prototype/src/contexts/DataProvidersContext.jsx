/**
 * Data Providers Context
 * Provides data sources for element data binding
 */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';

const DataProvidersContext = createContext(null);

/**
 * System data provider
 * Provides system-level data like date, time, environment
 */
function useSystemData() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return useMemo(() => ({
    date: currentTime.toLocaleDateString(),
    time: currentTime.toLocaleTimeString(),
    datetime: currentTime.toLocaleString(),
    timestamp: currentTime.getTime(),
    year: currentTime.getFullYear(),
    month: currentTime.getMonth() + 1,
    day: currentTime.getDate(),
    hour: currentTime.getHours(),
    minute: currentTime.getMinutes(),
    second: currentTime.getSeconds(),
    dayOfWeek: currentTime.toLocaleDateString('en-US', { weekday: 'long' }),
    environment: import.meta.env.MODE,
    isDevelopment: import.meta.env.DEV,
    isProduction: import.meta.env.PROD,
  }), [currentTime]);
}

/**
 * User data provider
 * Provides current user information
 */
function useUserData(initialUser = null) {
  const [user, setUser] = useState(initialUser || {
    id: null,
    name: 'Guest',
    email: null,
    isAuthenticated: false,
    roles: [],
    permissions: [],
  });

  return useMemo(() => ({
    data: user,
    setUser,
    isAuthenticated: user.isAuthenticated,
    hasRole: (role) => user.roles?.includes(role),
    hasPermission: (permission) => user.permissions?.includes(permission),
  }), [user]);
}

/**
 * API data provider
 * Provides data from external APIs with caching
 */
function useApiData() {
  const [cache, setCache] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const fetchData = useCallback(async (endpoint, options = {}) => {
    const cacheKey = endpoint;

    // Return cached data if available and not expired
    if (cache[cacheKey] && !options.refresh) {
      const { data, timestamp } = cache[cacheKey];
      const maxAge = options.maxAge || 300000; // 5 minutes default

      if (Date.now() - timestamp < maxAge) {
        return data;
      }
    }

    // Fetch new data
    setLoading(prev => ({ ...prev, [cacheKey]: true }));
    setErrors(prev => ({ ...prev, [cacheKey]: null }));

    try {
      const response = await fetch(endpoint, options.fetchOptions);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setCache(prev => ({
        ...prev,
        [cacheKey]: { data, timestamp: Date.now() },
      }));

      setLoading(prev => ({ ...prev, [cacheKey]: false }));
      return data;
    } catch (error) {
      console.error(`API fetch error for ${endpoint}:`, error);
      setErrors(prev => ({ ...prev, [cacheKey]: error.message }));
      setLoading(prev => ({ ...prev, [cacheKey]: false }));
      return null;
    }
  }, [cache]);

  const clearCache = useCallback((endpoint = null) => {
    if (endpoint) {
      setCache(prev => {
        const newCache = { ...prev };
        delete newCache[endpoint];
        return newCache;
      });
    } else {
      setCache({});
    }
  }, []);

  return useMemo(() => ({
    cache,
    loading,
    errors,
    fetchData,
    clearCache,
    getData: (endpoint) => cache[endpoint]?.data,
    isLoading: (endpoint) => loading[endpoint] || false,
    getError: (endpoint) => errors[endpoint],
  }), [cache, loading, errors, fetchData, clearCache]);
}

/**
 * Data Providers Provider Component
 */
export function DataProvidersProvider({ children, initialPageData = {}, initialUser = null }) {
  const [pageData, setPageData] = useState(initialPageData);
  const [store, setStore] = useState({});

  const systemData = useSystemData();
  const userData = useUserData(initialUser);
  const apiData = useApiData();

  // Update page data
  const updatePageData = useCallback((updates) => {
    setPageData(prev => ({ ...prev, ...updates }));
  }, []);

  // Update store
  const updateStore = useCallback((updates) => {
    setStore(prev => ({ ...prev, ...updates }));
  }, []);

  const value = useMemo(() => ({
    // Data sources
    page: pageData,
    user: userData.data,
    system: systemData,
    api: apiData.cache,
    store,

    // Update functions
    updatePageData,
    updateStore,
    setUser: userData.setUser,

    // API functions
    fetchApi: apiData.fetchData,
    clearApiCache: apiData.clearCache,
    isApiLoading: apiData.isLoading,
    getApiError: apiData.getError,

    // User helper functions
    isAuthenticated: userData.isAuthenticated,
    hasRole: userData.hasRole,
    hasPermission: userData.hasPermission,
  }), [
    pageData,
    userData,
    systemData,
    apiData,
    store,
    updatePageData,
    updateStore,
  ]);

  return (
    <DataProvidersContext.Provider value={value}>
      {children}
    </DataProvidersContext.Provider>
  );
}

DataProvidersProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialPageData: PropTypes.object,
  initialUser: PropTypes.object,
};

/**
 * Hook to access data providers
 */
export function useDataProviders() {
  const context = useContext(DataProvidersContext);

  if (!context) {
    throw new Error('useDataProviders must be used within DataProvidersProvider');
  }

  return context;
}

/**
 * Hook to access page data
 */
export function usePageData() {
  const { page, updatePageData } = useDataProviders();
  return { data: page, updateData: updatePageData };
}

/**
 * Hook to access user data
 */
export function useUser() {
  const { user, setUser, isAuthenticated, hasRole, hasPermission } = useDataProviders();
  return { user, setUser, isAuthenticated, hasRole, hasPermission };
}

/**
 * Hook to access system data
 */
export function useSystem() {
  const { system } = useDataProviders();
  return system;
}

/**
 * Hook to access API data
 */
export function useApi() {
  const { fetchApi, clearApiCache, isApiLoading, getApiError } = useDataProviders();
  return { fetch: fetchApi, clearCache: clearApiCache, isLoading: isApiLoading, getError: getApiError };
}

/**
 * Hook to access global store
 */
export function useGlobalStore() {
  const { store, updateStore } = useDataProviders();
  return { data: store, updateData: updateStore };
}
