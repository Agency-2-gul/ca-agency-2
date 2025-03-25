
import { useState, useMemo, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';

const LogModal = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const options = useMemo(() => ({}), []);

  const { data, loading, error } = useFetch(
    searchQuery.length >= 2
      ? `https://kassal.app/api/v1/products/?search=${searchQuery}`
      : null,
    options
  );

  const varer = data?.data || [];

  useEffect(() => {
    console.log('searchQuery:', searchQuery);
    console.log('Fetched data:', data);
  }, [searchQuery, data]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchQuery(query.trim());
    }
  };


  return (
    <div className="absolute bg-white w-[400px] max-h-[400px] overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg p-6 z-1000">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Logg Vare</h1>


      {/* Søkefelt */}
      <div>
        <label
          htmlFor="søk"
          className="block text-sm font-medium text-gray-700"
        >
          Søk vare
        </label>
        <input
          type="text"
          id="søk"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
          placeholder="Skriv inn varenavn..."
        />
      </div>

      {/* Resultater / Meldinger */}
      <div
        className="overflow-y-auto mt-4 mb-4 pr-2 text-sm text-gray-700"
        style={{ maxHeight: '170px' }}
      >
        {!searchQuery && (
          <p className="text-gray-500">
            Skriv inn et varenavn og trykk &quot;Enter&quot; for å søke 🔎
          </p>
        )}
        {loading && <p>Laster inn resultater...</p>}
        {error && <p className="text-red-500">Feil: {error}</p>}
        {!loading && !error && varer.length === 0 && searchQuery && (
          <p>Ingen resultater funnet.</p>
        )}
        {varer.length > 0 && (
          <div>
            <h2 className="text-md font-medium text-gray-800 mb-1">
              Resultater:
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {varer.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Knapper */}
      <div className="flex justify-end gap-2 mt-auto">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          onClick={onClose}
        >
          Avbryt
        </button>
        <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
          Logg
        </button>
      </div>
    </div>
  );
};

export default LogModal;
