import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  extractWeightFromName,
  extractWeightFromNutrition,
  normalizeUnit,
  calculateNutritionValues,
} from './weight';

import AmountSelector from './AmountSelector';
import MealSelectionModal from './MealSelectionModal';

import useLogProducts from '../../hooks/useLogProducts';

const QuantitySelector = ({ totalAmount, unit, productName = '', product }) => {
  const navigate = useNavigate();
  const { logProducts } = useLogProducts();

  // Extract all available information from product name
  const { fallbackWeight, fallbackUnit, weightPerPiece, totalProductWeight } =
    extractWeightFromName(productName);

  // Get fallback from nutrition as last resort
  const { nutritionWeight, nutritionUnit } = extractWeightFromNutrition(
    product?.nutrition
  );

  // Determine if we should prioritize piece-based logging
  const isPieceBasedProduct =
    unit === 'piece' ||
    unit === 'pieces' ||
    unit === 'stk' ||
    fallbackUnit === 'stk';

  // If product has weight but unit is piece, we know it's a piece-based product with known weight
  const hasWeightPerPiece =
    (isPieceBasedProduct && totalAmount && totalAmount > 0) ||
    (isPieceBasedProduct && weightPerPiece);

  // Calculate weight per piece if possible
  const effectiveWeightPerPiece = hasWeightPerPiece
    ? totalProductWeight && fallbackWeight
      ? totalProductWeight / fallbackWeight
      : weightPerPiece
    : totalAmount && fallbackWeight
      ? totalAmount / fallbackWeight
      : null;

  // Determine weight and unit values with cascading fallbacks
  let rawWeight, rawUnit;

  if (isPieceBasedProduct) {
    // For piece-based products, prioritize piece count
    rawWeight = fallbackWeight || totalAmount || 1;
    rawUnit = 'stk';
  } else {
    // For weight-based products, use standard fallback logic
    rawWeight = totalAmount || fallbackWeight || nutritionWeight || 100;
    rawUnit = unit || fallbackUnit || nutritionUnit || 'g';
  }

  // Default to 100g if all else fails
  const safeWeight = rawWeight ?? 100;
  const safeUnit = rawUnit ?? 'g';

  // Normalize to standard units
  const { normalizedWeight, normalizedUnit } = normalizeUnit(
    safeWeight,
    safeUnit
  );

  // Set selector parameters based on unit type
  const isLiquid = normalizedUnit === 'ml';
  const isPiece = normalizedUnit === 'stk';

  // Configure step and min values based on unit type
  const minAmount = isPiece ? 1 : isLiquid ? 100 : 0;
  const stepAmount = isPiece ? 1 : isLiquid ? 100 : 1;
  const maxAmount = normalizedWeight;

  const [amount, setAmount] = useState(Math.max(minAmount, 1));
  const [showMealModal, setShowMealModal] = useState(false);

  useEffect(() => {
    setAmount(Math.max(minAmount, 1));
  }, [normalizedWeight, maxAmount, minAmount]);

  const handleLogClick = () => setShowMealModal(true);

  const handleMealConfirm = (selectedMeal) => {
    const loggedProduct = {
      id: product.id || 'unknown',
      name: product.name || 'Ukjent produkt',
      nutrition: product.nutrition || [], // Pass the original nutrition array
      weight: amount,
      unit: normalizedUnit,
      fullWeight: normalizedWeight,
      // Add metadata to help with nutrition calculations
      isPiece: isPiece,
      weightPerPiece: effectiveWeightPerPiece,
      totalProductWeight: totalProductWeight || totalAmount,
    };

    logProducts([loggedProduct], () => navigate('/diary'), selectedMeal);

    setShowMealModal(false);
  };

  // Debug info to be removed in production
  console.log('Product logging debug:');
  console.log('- Product name:', productName);
  console.log('- isPieceBasedProduct:', isPieceBasedProduct);
  console.log('- weightPerPiece:', effectiveWeightPerPiece);
  console.log('- normalizedUnit:', normalizedUnit);
  console.log('- Amount to log:', amount);

  return (
    <>
      <div className="bg-white p-6 rounded-2xl space-y-4">
        <h2 className="text-lg font-semibold text-center">
          Velg mengde ({normalizedUnit})
        </h2>

        <AmountSelector
          value={amount}
          onChange={setAmount}
          min={minAmount}
          max={maxAmount}
          step={stepAmount}
          unit={normalizedUnit}
          isLiquid={isLiquid}
        />

        <div className="flex justify-center">
          <button
            onClick={handleLogClick}
            className="text-white w-full max-w-[250px] p-2 sm:p-3 rounded cursor-pointer bg-gradient-to-r from-[#E64D20] to-[#F67B39] relative overflow-hidden before:absolute before:inset-0 before:bg-[#E64D20] before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-in-out before:z-0"
          >
            <span className="relative z-10 font-semibold">
              Logg {amount} {normalizedUnit}
            </span>
          </button>
        </div>
      </div>

      <MealSelectionModal
        isOpen={showMealModal}
        onClose={() => setShowMealModal(false)}
        onConfirm={handleMealConfirm}
        amount={amount}
        unit={normalizedUnit}
      />
    </>
  );
};

export default QuantitySelector;
