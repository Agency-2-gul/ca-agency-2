import { useState, useEffect, useMemo } from 'react';
import useFetch from './useFetch';

const useProductSearch = () => {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const options = useMemo(() => ({}), []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length >= 3) {
        setSearchQuery(query.trim());
      } else if (query.trim().length === 0) {
        setSearchQuery('');
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  const { data, loading, error } = useFetch(
    searchQuery.length >= 3
      ? `https://kassal.app/api/v1/products/?search=${searchQuery}&size=8`
      : null,
    options
  );

  const varer = searchQuery.length >= 3 ? data?.data || [] : [];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchQuery(query.trim());
    }
  };

  return {
    query,
    setQuery,
    varer,
    loading,
    error,
    handleKeyDown,
  };
};

export default useProductSearch;
