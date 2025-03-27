import { useState, useMemo } from 'react';
import useFetch from './useFetch';

const useProductSearch = () => {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const options = useMemo(() => ({}), []);

  const { data, loading, error } = useFetch(
    searchQuery.length >= 2
      ? `https://kassal.app/api/v1/products/?search=${searchQuery}&size=8`
      : null,
    options
  );

  const varer = data?.data || [];
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchQuery(query.trim());
    }
  };
  return { query, setQuery, varer, loading, error, handleKeyDown };
};

export default useProductSearch;
