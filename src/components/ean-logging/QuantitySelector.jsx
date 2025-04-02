import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { extractWeightFromName, normalizeUnit } from './weight';

import AmountSelector from './AmountSelector';
import MealSelectionModal from './MealSelectionModal';

import useLogProducts from '../../hooks/useLogProducts';

const QuantitySelector = ({ totalAmount, unit, productName = '', product }) => {
  const navigate = useNavigate();
  const { logProducts } = useLogProducts();

  const { fallbackWeight, fallbackUnit } = extractWeightFromName(productName);

  const hasValidWeight =
    totalAmount && totalAmount > 0 && typeof unit === 'string';
  const rawWeight = hasValidWeight ? totalAmount : fallbackWeight;
  const rawUnit = hasValidWeight && unit ? unit : fallbackUnit;
  const safeWeight = rawWeight ?? 100;
  const safeUnit = rawUnit ?? 'g';
  const { normalizedWeight, normalizedUnit } = normalizeUnit(
    safeWeight,
    safeUnit
  );

  const isLiquid = normalizedUnit === 'ml';
  const minAmount = isLiquid ? 100 : 0;
  const stepAmount = isLiquid ? 100 : 1;
  const maxAmount = normalizedWeight;

  const [amount, setAmount] = useState(Math.min(maxAmount, minAmount));
  const [showMealModal, setShowMealModal] = useState(false);

  useEffect(() => {
    setAmount(Math.min(maxAmount, minAmount));
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
    };

    logProducts([loggedProduct], () => navigate('/diary'), selectedMeal);

    setShowMealModal(false);
  };

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
