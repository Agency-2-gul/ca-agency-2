import { useLocation } from 'react-router-dom';

const ProductPage = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <p>Fant ikke produktinfo.</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">{product.name}</h1>
      <p className="text-gray-600 mb-2">{product.brand}</p>

      {/* Product Image */}
      {product.image ? (
        <img
          src={product.image}
          alt={product.name}
          className="w-full max-w-sm rounded-lg shadow-md mb-4"
        />
      ) : (
        <p className="text-sm text-gray-500 mb-4">Ingen bilde tilgjengelig</p>
      )}

      <p className="text-sm">{product.description || 'Ingen beskrivelse'}</p>
    </div>
  );
};

export default ProductPage;
