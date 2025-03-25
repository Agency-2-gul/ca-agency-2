import { useState, useEffect, useCallback, useRef } from 'react';

const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortControllerRef = useRef(null);

  // Memoized function to fetch data
  const fetchData = useCallback(async () => {
    if (!url) return; // Prevents unnecessary calls

    setLoading(true);
    setError(null);

    // Cancel previous request if a new one is made
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_KASSALAPP_TOKEN}`,
          ...options.headers,
        },
        signal: controller.signal, // Connect fetch to AbortController
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Fetch failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  // Automatically fetch data when URL changes
  useEffect(() => {
    fetchData();

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(); // Cleanup on unmount
      }
    };
  }, [fetchData]); // ✅ Only triggers when URL/options change

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
