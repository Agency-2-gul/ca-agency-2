import { useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import useProductSearch from '../../hooks/useProductSearch';
import useLogProducts from '../../hooks/useLogProducts';

const LogModal = ({ setIsModalOpen }) => {
  const onClose = () => setIsModalOpen(false);

  const { query, setQuery, varer, loading, error, handleKeyDown } =
    useProductSearch();
  const { user, logProducts } = useLogProducts();
  console.log(user);

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleSelectedProducts = (product) => {
    setSelectedProducts((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (p) => p.name === product.name
      );
      return isAlreadySelected
        ? prevSelected.filter((p) => p.name !== product.name)
        : [...prevSelected, product];
    });
  };

  const resetSelection = () => {
    setSelectedProducts([]);
    setQuery('');
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
        {!query && (
          <p className="text-gray-500">
            Skriv inn et varenavn og trykk &quot;Enter&quot; for å søke 🔎
          </p>
        )}
        {loading && <p>Laster inn resultater...</p>}
        {error && <p className="text-red-500">Feil: {error}</p>}
        {!loading && !error && varer.length === 0 && query && (
          <p>Ingen resultater funnet.</p>
        )}
        {varer.length > 0 && (
          <div>
            <h2 className="text-md font-medium text-gray-800 mb-1">
              Resultater:
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {varer.map((item, index) => (
                <li
                  key={index}
                  onClick={() => handleSelectedProducts(item)}
                  className="flex items-center gap-2 list-none pb-2 border-b border-gray-300 last:border-none cursor-pointer"
                >
                  <img
                    src={item.image}
                    alt="Product image"
                    className="object-contain aspect-3/2 h-8 w-auto rounded-lg"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/src/assets/react.svg';
                    }}
                  />
                  <div className="flex items-center justify-between w-full">
                    <span>{item.name}</span>
                    {selectedProducts.some((p) => p.name === item.name) && (
                      <FaCheckCircle className="text-green-500" />
                    )}
                  </div>
                </li>
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
        <button
          onClick={() => logProducts(selectedProducts, resetSelection)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Logg
        </button>
      </div>
    </div>
  );
};

export default LogModal;
