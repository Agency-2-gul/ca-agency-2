import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useLogProducts from '../hooks/useLogProducts';

const extractWeightFromName = (name = '') => {
  const normalizedName = name.replace(/,/g, '.');
  const match = normalizedName.match(/(\d{1,4}(\.\d{1,2})?)\s?(ml|g|l|kg)/i);
  if (match) {
    const value = parseFloat(match[1]);
    const unit = match[3].toLowerCase();
    return { fallbackWeight: value, fallbackUnit: unit };
  }
  return { fallbackWeight: null, fallbackUnit: null };
};

const normalizeUnit = (weight, unit) => {
  if (!weight || !unit) return { normalizedWeight: null, normalizedUnit: null };
  const u = unit.toLowerCase();
  if (u === 'kg')
    return { normalizedWeight: weight * 1000, normalizedUnit: 'g' };
  if (u === 'l')
    return { normalizedWeight: weight * 1000, normalizedUnit: 'ml' };
  return { normalizedWeight: weight, normalizedUnit: u };
};

const QuantitySelector = ({ totalAmount, unit, productName = '', product }) => {
  const { fallbackWeight, fallbackUnit } = extractWeightFromName(productName);
  const rawWeight =
    totalAmount && totalAmount > 0 ? totalAmount : fallbackWeight;
  const rawUnit = totalAmount && totalAmount > 0 ? unit : fallbackUnit;

  const safeWeight = rawWeight ?? 100;
  const safeUnit = rawUnit ?? 'g';

  const { normalizedWeight, normalizedUnit } = normalizeUnit(
    safeWeight,
    safeUnit
  );
  const isLiquid = normalizedUnit === 'ml';

  const minAmount = isLiquid ? 100 : 1;
  const stepAmount = isLiquid ? 100 : 1;
  const maxAmount = normalizedWeight;

  const [amount, setAmount] = useState(Math.min(maxAmount, minAmount));
  const [showMealModal, setShowMealModal] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState('');

  const { logProducts } = useLogProducts();

  useEffect(() => {
    setAmount(Math.min(maxAmount, minAmount));
  }, [normalizedWeight]);

  const handleLogClick = () => {
    setShowMealModal(true);
  };

  const confirmMeal = () => {
    if (!selectedMeal) {
      alert('Velg et måltid');
      return;
    }

    const loggedProduct = {
      id: product.id || 'unknown',
      name: product.name || 'Ukjent produkt',
      nutrition: product.nutrition || [],
      weight: amount,
    };

    logProducts([loggedProduct], () => {}, selectedMeal);
    setShowMealModal(false);
    setSelectedMeal('');
  };

  const mealOptions = ['Frokost', 'Lunsj', 'Middag', 'Snacks', 'Kvelds'];

  const renderLiquidDropdown = () => {
    const options = [];
    for (let i = 100; i <= normalizedWeight; i += 100) {
      options.push(
        <option key={i} value={i}>
          {i} ml
        </option>
      );
    }
    return (
      <select
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        className="w-full p-3 rounded-xl border-2 border-orange-300 text-center text-lg"
      >
        {options}
      </select>
    );
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-xl border space-y-4">
        <h2 className="text-lg font-semibold text-orange-600 text-center">
          Velg mengde ({normalizedUnit})
        </h2>

        {isLiquid ? (
          renderLiquidDropdown()
        ) : (
          <input
            type="number"
            step={stepAmount}
            min={minAmount}
            max={maxAmount}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-3 rounded-xl border-2 border-orange-300 text-center text-lg"
          />
        )}

        <button
          onClick={handleLogClick}
          className="text-white w-full sm:w-[200px] mx-auto p-2 sm:p-3 rounded cursor-pointer bg-gradient-to-r from-[#E64D20] to-[#F67B39] relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed before:absolute before:inset-0 before:bg-[#E64D20] before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-in-out before:z-0"
        >
          <span className="relative z-10 font-semibold">
            Logg {amount} {normalizedUnit}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {showMealModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-white rounded-2xl p-6 w-[90%] max-w-md mx-auto shadow-lg space-y-4 text-center"
            >
              <h3 className="text-lg font-semibold">Hvilket måltid?</h3>
              <select
                value={selectedMeal}
                onChange={(e) => setSelectedMeal(e.target.value)}
                className="w-full p-3 rounded-xl border text-center text-lg"
              >
                <option value="">Velg måltid</option>
                {mealOptions.map((meal) => (
                  <option key={meal} value={meal.toLowerCase()}>
                    {meal}
                  </option>
                ))}
              </select>

              <button
                onClick={confirmMeal}
                className="text-white w-full sm:w-[200px] mx-auto p-2 sm:p-3 rounded cursor-pointer bg-gradient-to-r from-[#E64D20] to-[#F67B39] relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed before:absolute before:inset-0 before:bg-[#E64D20] before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-in-out before:z-0"
              >
                <span className="relative z-10 font-semibold">Bekreft</span>
              </button>

              <button
                onClick={() => setShowMealModal(false)}
                className="text-sm text-gray-500 hover:underline"
              >
                Avbryt
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuantitySelector;
