import { useLocation } from 'react-router-dom';
import QuantitySelector from '../../utils/QuantitySelector';

const ProductPage = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="p-6 max-w-md mx-auto text-center">
        <p className="text-gray-500 text-lg">Fant ikke produktinfo.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-5">
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
    </div>
  );
};

export default ProductPage;
