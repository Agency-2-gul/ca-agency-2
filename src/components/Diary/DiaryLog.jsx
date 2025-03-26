import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa';
import useLogProducts from '../../hooks/useLogProducts';
import useProductSearch from '../../hooks/useProductSearch';

const DiaryLog = () => {
  const { logProducts } = useLogProducts();
  const { query, setQuery, varer, loading, error, handleKeyDown } =
    useProductSearch();

  const meals = [
    { name: 'Frokost', recommended: '300-500', logged: 0 },
    { name: 'Lunsj', recommended: '750-1150', logged: 0 },
    { name: 'Middag', recommended: '1060-1480', logged: 0 },
    { name: 'Snacks', recommended: '200', logged: 0 },
    { name: 'Kvelds', recommended: '200', logged: 0 },
  ];
  const [openIndex, setOpenIndex] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const handleMenu = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleAddProduct = (mealIndex, product) => {
    setSelectedProducts((prev) => ({
      ...prev,
      [mealIndex]: [...(prev[mealIndex] || []), product],
    }));
  };
  const handleLog = (mealIndex) => {
    if (
      !selectedProducts[mealIndex] ||
      selectedProducts[mealIndex].length === 0
    ) {
      alert('ingen produkter valgt');
      return;
    }
    logProducts(
      selectedProducts[mealIndex],
      () => {
        setSelectedProducts((prev) => ({
          ...prev,
          [mealIndex]: [],
        }));
      },
      mealIndex
    );
  };

  return (
    <div className="space-y-4 p-4">
      {meals.map((meal, index) => (
        <div key={index} className="">
          {/* Meal Header */}
          <div
            className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md cursor-pointer"
            onClick={() => handleMenu(index)}
          >
            <div>
              <p className="text-xs text-gray-500">
                Anbefalt: {meal.recommended} kcal
              </p>
              <h2 className="text-lg font-semibold">{meal.name}</h2>
              <p className="text-orange-500 font-medium">{meal.logged} kcal</p>
            </div>
            <button
              className="bg-transparent text-orange-500 hover:bg-orange-100 p-2 rounded-full transition"
              onClick={(e) => {
                e.stopPropagation();
                handleLog(index);
              }}
            >
              {openIndex === index ? <FaMinus /> : <FaPlus />}
            </button>
          </div>

          {/* Expanded Section with Search */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === index
                ? 'max-h-screen opacity-100 p-4'
                : 'max-h-0 opacity-0 p-0'
            }`}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Søk etter produkter..."
              className="w-full p-2 border rounded-md"
            />

            {loading && <p>Laster produkter...</p>}

            {/* Search Results */}
            <ul className="mt-2 space-y-2">
              {varer.map((product) => (
                <li
                  key={product.id}
                  className="flex justify-between items-center p-2 border rounded-md cursor-pointer hover:bg-gray-100"
                  onClick={() => handleAddProduct(index, product)}
                >
                  <span>{product.name}</span>
                  <FaPlus className="text-green-500" />
                </li>
              ))}
            </ul>

            {/* Selected Products */}
            {selectedProducts[index]?.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-semibold">Valgte produkter:</h3>
                <ul className="space-y-2">
                  {selectedProducts[index].map((product, i) => (
                    <li key={i} className="p-2 border rounded-md">
                      {product.name}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleLog(index)}
                  className="mt-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Logg produkter
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiaryLog;
