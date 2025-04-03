import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useLogProducts from '../../hooks/useLogProducts';
import useProductSearch from '../../hooks/useProductSearch';
import { FaPlus, FaCheckCircle, FaSearch } from 'react-icons/fa';

const LogProductsPage = () => {
  const { mealName } = useParams();
  const navigate = useNavigate();
  const { logProducts } = useLogProducts();
  const initialFetchDone = useRef(false);

  // For search functionality
  const {
    query,
    setQuery,
    varer: searchResults,
    loading: searchLoading,
    error: searchError,
    handleKeyDown,
  } = useProductSearch();

  // State for initial products
  const [initialProducts, setInitialProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(false);
  const [initialError, setInitialError] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);

  // Fetch initial products only once when component mounts and not on re-renders
  useEffect(() => {
    // Skip if we've already done the initial fetch in this session
    if (initialFetchDone.current) return;

    const fetchInitialProducts = async () => {
      setInitialLoading(true);
      try {
        // Get a random page number (assuming there are at least 10 pages of products)
        const randomPage = Math.floor(Math.random() * 10) + 1;

        // Fetch newest products first, with random page
        const response = await fetch(
          `https://kassal.app/api/v1/products/?size=100&sort=date_desc&page=${randomPage}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${import.meta.env.VITE_KASSALAPP_TOKEN}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const data = await response.json();

        // Filter products to include only those with nutrition data
        let filteredProducts = data.data.filter(
          (product) =>
            product.nutrition &&
            Array.isArray(product.nutrition) &&
            product.nutrition.length > 0
        );

        // Remove duplicate product names
        const uniqueNames = new Set();
        filteredProducts = filteredProducts.filter((product) => {
          if (product.name && !uniqueNames.has(product.name)) {
            uniqueNames.add(product.name);
            return true;
          }
          return false;
        });

        // Group products by category to ensure diversity
        const categorizedProducts = {};

        // First pass - group by category code or brand if category is missing
        filteredProducts.forEach((product) => {
          // Use category if available, otherwise use brand
          const category =
            product.category && product.category.length > 0
              ? product.category[0].code
              : product.brand || 'unknown';

          if (!categorizedProducts[category]) {
            categorizedProducts[category] = [];
          }
          categorizedProducts[category].push(product);
        });

        // Take a balanced selection from each category
        const finalProducts = [];
        const categories = Object.keys(categorizedProducts);

        // Randomly select products from different categories
        let attempts = 0;
        while (finalProducts.length < 12 && attempts < 30) {
          attempts++;
          const randomCategoryIndex = Math.floor(
            Math.random() * categories.length
          );
          const category = categories[randomCategoryIndex];

          if (
            categorizedProducts[category] &&
            categorizedProducts[category].length > 0
          ) {
            // Get a random product from this category
            const randomIndex = Math.floor(
              Math.random() * categorizedProducts[category].length
            );
            const product = categorizedProducts[category].splice(
              randomIndex,
              1
            )[0];
            finalProducts.push(product);

            // If we've used all products in this category, remove it from consideration
            if (categorizedProducts[category].length === 0) {
              categories.splice(randomCategoryIndex, 1);
            }
          }
        }

        // If we don't have 12 products yet, fill with random ones
        if (finalProducts.length < 12 && filteredProducts.length > 0) {
          const remainingProducts = filteredProducts.filter(
            (p) => !finalProducts.includes(p)
          );
          const additionalProducts = remainingProducts
            .sort(() => 0.5 - Math.random())
            .slice(0, 12 - finalProducts.length);

          finalProducts.push(...additionalProducts);
        }

        setInitialProducts(finalProducts);
        setInitialError(null);
        initialFetchDone.current = true; // Mark that we've done the initial fetch
      } catch (err) {
        console.error('Error fetching initial products:', err);
        setInitialError(err.message);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInitialProducts();
  }, []); // Empty dependency array ensures this runs only once

  const handleAddProduct = (product) => {
    setSelectedProducts((prev) => {
      const isAlreadySelected = prev.some((p) => p.id === product.id);
      return isAlreadySelected
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product];
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
        navigate('/Diary');
      },
      mealName
    );
  };

  const isProductSelected = (productId) => {
    return selectedProducts.some((p) => p.id === productId);
  };

  // Determine which products to display based on search state
  const isSearching = query.length >= 3;
  const displayProducts = isSearching ? searchResults : initialProducts;
  const isLoading = isSearching ? searchLoading : initialLoading;
  const hasError = isSearching ? searchError : initialError;

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Logg produkter for {mealName}</h2>

      <div className="relative mt-4">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Søk etter produkter..."
          className="w-full p-2 pl-10 border rounded-md"
        />
      </div>

      {isLoading && (
        <div className="flex justify-center my-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      )}

      {hasError && <p className="text-red-500 mt-4">Error: {hasError}</p>}

      {!isLoading && displayProducts.length === 0 && (
        <p className="text-gray-500 mt-4 text-center">Ingen produkter funnet</p>
      )}

      <h3 className="mt-4 mb-2 font-medium text-gray-700">Produkter</h3>

      <ul className="mt-2 space-y-2">
        {displayProducts.map((product) => (
          <li
            key={product.id}
            className="flex items-center p-4 bg-white rounded-2xl shadow-md hover:bg-gray-50 transition"
          >
            {/* Product Image */}
            <div className="w-16 h-16 flex items-center justify-center mr-3">
              <img
                className="object-contain max-h-full max-w-full rounded-lg"
                src={product.image}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/src/assets/react.svg';
                }}
                alt={`Bilde av ${product.name}`}
              />
            </div>

            {/* Product Details */}
            <div className="flex flex-col flex-grow">
              <span
                onClick={() =>
                  navigate(`/product/${product.id}`, { state: { product } })
                }
                className="font-semibold text-sm md:text-base truncate cursor-pointer"
              >
                {product.name}
              </span>
              <span className="text-gray-500 text-xs">
                {product.brand || 'Ukjent merkevare'}
              </span>
            </div>

            {/* Add/Remove Button */}
            <button
              className={`p-3 rounded-full ${
                isProductSelected(product.id)
                  ? 'text-green-500'
                  : 'text-orange-500'
              }`}
              onClick={() => handleAddProduct(product)}
            >
              {isProductSelected(product.id) ? <FaCheckCircle /> : <FaPlus />}
            </button>
          </li>
        ))}
      </ul>

      {selectedProducts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-lg border-t">
          <div className="max-w-lg mx-auto">
            <h3 className="text-sm font-semibold">
              Valgte produkter ({selectedProducts.length}):
            </h3>
            <div className="flex flex-wrap gap-2 mt-2 mb-3">
              {selectedProducts.map((product) => (
                <div
                  key={product.id}
                  className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                >
                  {product.name.length > 20
                    ? `${product.name.substring(0, 20)}...`
                    : product.name}
                </div>
              ))}
            </div>
            <button
              onClick={handleLog}
              className="w-full p-3 rounded cursor-pointer bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white font-semibold"
            >
              Logg {selectedProducts.length} produkter
            </button>
          </div>
        </div>
      )}

      {selectedProducts.length > 0 && <div className="h-36"></div>}
    </div>
  );
};

export default LogProductsPage;
