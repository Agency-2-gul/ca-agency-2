import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MEAL_OPTIONS = ['Frokost', 'Lunsj', 'Middag', 'Snacks', 'Kvelds'];

const MealSelectionModal = ({ isOpen, onClose, onConfirm, amount, unit }) => {
  const [selectedMeal, setSelectedMeal] = useState('');

  const handleConfirm = () => {
    if (!selectedMeal) return;
    onConfirm(selectedMeal);
    setSelectedMeal('');
  };

  const handleClose = () => {
    setSelectedMeal('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
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
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold">Hvilket måltid?</h3>
            <p className="text-gray-500">
              Logg {amount} {unit}
            </p>

            <select
              value={selectedMeal}
              onChange={(e) => setSelectedMeal(e.target.value)}
              className="w-full p-3 rounded-xl border text-center text-lg"
              aria-label="Select meal type"
            >
              <option value="">Velg måltid</option>
              {MEAL_OPTIONS.map((meal) => (
                <option key={meal} value={meal.toLowerCase()}>
                  {meal}
                </option>
              ))}
            </select>

            <button
              onClick={handleConfirm}
              disabled={!selectedMeal}
              className="text-white w-full sm:w-[200px] mx-auto p-2 sm:p-3 rounded cursor-pointer bg-gradient-to-r from-[#E64D20] to-[#F67B39] relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <span className="relative z-10 font-semibold">Bekreft</span>
            </button>

            <button
              onClick={handleClose}
              className="text-sm text-gray-500 hover:underline"
            >
              Avbryt
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MealSelectionModal;
