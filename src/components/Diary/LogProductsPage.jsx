import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import useLogProducts from '../../hooks/useLogProducts';
import useProductSearch from '../../hooks/useProductSearch';
import { FaPlus } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';

const LogProductsPage = () => {
  const { mealName } = useParams(); // Get the meal index from the URL
  const navigate = useNavigate();
  const { logProducts } = useLogProducts();
  const { query, setQuery, varer, loading, error, handleKeyDown } =
    useProductSearch();

  const [selectedProducts, setSelectedProducts] = useState([]);

  const handleAddProduct = (product) => {
    setSelectedProducts((prev) => {
      const isAlreadySelected = prev.some((p) => p.id === product.id);
      return isAlreadySelected
        ? prev.filter((p) => p.id !== product.id) // Remove if already selected
        : [...prev, product]; // Add if not selected
    });
  };

  const handleLog = () => {
    if (selectedProducts.length === 0) {
      alert('Ingen produkter valgt');
      return;
    }

    logProducts(
      selectedProducts,
      () => {
        setSelectedProducts([]);
        navigate('/Diary'); // Navigate back to DiaryLog after logging
      },
      mealName
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">
        Logg produkter for måltid {mealName}
      </h2>

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Søk etter produkter..."
        className="w-full p-2 border rounded-md mt-4"
      />

      {loading && <p>Laster produkter...</p>}

      <ul className="mt-2 space-y-2">
        {varer.map((product) => (
          <li
            key={product.id}
            className="flex items-center p-4 bg-white rounded-2xl shadow-md hover:bg-gray-50 transition"
            onClick={() => handleAddProduct(product)}
          >
            {/* Product Image */}
            <img
              className="object-contain aspect-3/2 h-8 w-auto rounded-lg"
              src={product.image}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/src/assets/react.svg'; // Fallback image
              }}
              alt={`Bilde av ${product.name}`}
            />

            {/* Product Details */}
            <div className="flex flex-col flex-grow">
              <span className="font-semibold text-lg">{product.name}</span>
            </div>

            {/* Add Button */}
            <button className=" text-orange-500 p-3 rounded-full">
              <FaPlus />
            </button>
          </li>
        ))}
      </ul>

      {selectedProducts.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-semibold">Valgte produkter:</h3>
          <ul className="space-y-2">
            {selectedProducts.map((product, i) => (
              <li key={i} className="p-2 border rounded-md">
                {product.name}
              </li>
            ))}
          </ul>
          <button
            onClick={handleLog}
            className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Logg produkter
          </button>
        </div>
      )}
    </div>
  );
};

export default LogProductsPage;
