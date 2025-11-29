import { useState, useEffect } from "react";

// URL State Persistence (P1.3)
export function useURLState(key, defaultValue) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const params = new URLSearchParams(window.location.search);
    const urlValue = params.get(key);
    if (urlValue === null) return defaultValue;
    try {
      return JSON.parse(urlValue);
    } catch {
      return urlValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const serialized = typeof value === 'object' ? JSON.stringify(value) : String(value);
    const defaultSerialized = typeof defaultValue === 'object' ? JSON.stringify(defaultValue) : String(defaultValue);

    if (serialized === defaultSerialized) {
      params.delete(key);
    } else {
      params.set(key, serialized);
    }
    const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
    window.history.replaceState({}, '', newURL);
  }, [key, value, defaultValue]);

  // Handle browser back/forward
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlValue = params.get(key);
      if (urlValue === null) {
        setValue(defaultValue);
      } else {
        try {
          setValue(JSON.parse(urlValue));
        } catch {
          setValue(urlValue);
        }
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [key, defaultValue]);

  return [value, setValue];
}
