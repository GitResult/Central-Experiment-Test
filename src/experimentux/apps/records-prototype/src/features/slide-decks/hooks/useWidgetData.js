import { useState, useEffect } from 'react';
import { dataViewService } from '../services/dataViewService';

/**
 * useWidgetData Hook
 *
 * Fetches live data for widgets (charts, tables, metrics).
 * Supports auto-refresh with configurable interval.
 *
 * @param {string} dataViewId - ID of the data view to fetch
 * @param {object} config - Widget configuration
 * @param {number} refreshInterval - Auto-refresh interval in ms (default: 30000 = 30s)
 * @returns {object} { data, loading, error, refetch }
 */
export function useWidgetData(dataViewId, config = {}, refreshInterval = 30000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (!dataViewId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await dataViewService.fetchData(dataViewId, config);
      setData(result);
    } catch (err) {
      setError(err);
      console.error('Failed to fetch widget data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up auto-refresh if enabled
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchData, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [dataViewId, JSON.stringify(config), refreshInterval]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}
