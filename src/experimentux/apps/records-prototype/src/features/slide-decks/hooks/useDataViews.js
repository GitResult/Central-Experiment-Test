import { useState, useEffect } from 'react';
import { dataViewService } from '../services/dataViewService';

/**
 * Hook for fetching available data views
 *
 * @param {Object} options - Filter options
 * @returns {Object} Data views state
 */
export function useDataViews(options = {}) {
  const [dataViews, setDataViews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataViews = async () => {
      try {
        setLoading(true);
        const data = await dataViewService.listViews(options);
        setDataViews(data);
      } catch (err) {
        setError(err);
        console.error('Failed to fetch data views:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDataViews();
  }, [JSON.stringify(options)]);

  return { dataViews, loading, error };
}
