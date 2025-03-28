import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import QuantitySelector from '../ean-logging/QuantitySelector';
import NutritionCard from './NutritionCard';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const ProductPage = () => {
  const location = useLocation();
  const product = location.state?.product;
  const [showNutrition, setShowNutrition] = useState(false);

  console.log(product);
  if (!product) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <p className="text-gray-500 text-lg">Fant ikke produktinfo.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto shadow-md space-y-5">
      {/* Title */}
      <div className="text-center">
        <h1 className="text-2xl font-semibold mb-1">{product.name}</h1>
        {product.brand && (
          <p className="text-sm text-gray-500">{product.brand}</p>
        )}
      </div>

      {/* Product Image */}
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="max-h-[180px] object-contain mx-auto rounded-xl shadow-sm"
        />
      )}

      {/* Quantity Selector */}
      <QuantitySelector
        totalAmount={product.weight}
        unit={product.weight_unit}
        productName={product.name}
        product={product}
      />

      {/* Toggle Nutrition Button */}
      {product.nutrition && product.nutrition.length > 0 && (
        <div className="flex justify-center">
          <button
            onClick={() => setShowNutrition((prev) => !prev)}
            className="text-sm text-orange-600 font-medium flex items-center gap-1 hover:underline mt-2 cursor-pointer"
          >
            {showNutrition ? 'Skjul næringsinnhold' : 'Vis næringsinnhold'}
            {showNutrition ? <FaChevronUp /> : <FaChevronDown />}
          </button>
        </div>
      )}

      {/* Nutrition Card */}
      {showNutrition && <NutritionCard nutrition={product.nutrition} />}
    </div>
  );
};

export default ProductPage;
