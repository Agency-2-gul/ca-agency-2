import { useState } from 'react';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { useAuth } from '../../context/authContext';
import { motion, AnimatePresence } from 'framer-motion';
import useWaterStore from '../../stores/waterStore';

const WaterLogModal = ({ onClose }) => {
  const { user } = useAuth();
  const [amount, setAmount] = useState(0.25);
  const { setWater } = useWaterStore();

  const handleChange = (delta) => {
    setAmount((prev) => Math.max(0, parseFloat((prev + delta).toFixed(2))));
  };

  const handleSave = async () => {
    if (!user) return;
    const db = getFirestore();
    const waterRef = doc(db, 'users', user.uid);

    try {
      const existingDoc = await getDoc(waterRef);
      const prevAmount = existingDoc.exists()
        ? existingDoc.data().water || 0
        : 0;
      const newAmount = prevAmount + amount;

      await setDoc(waterRef, { water: newAmount }, { merge: true });

      setWater(newAmount);
      onClose();
    } catch (err) {
      console.error('Error logging water:', err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 30, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="bg-white rounded-2xl p-6 w-[90%] max-w-md mx-auto shadow-lg text-center space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-lg font-semibold">Logg vann</h2>
          <p className="text-gray-500 text-sm">Hvor mye vann har du drukket?</p>

          <div className="flex items-center justify-center gap-4 text-2xl">
            <button
              onClick={() => handleChange(-0.25)}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-bold cursor-pointer"
            >
              –
            </button>
            <span className="font-medium">{amount.toFixed(2)} L</span>
            <button
              onClick={() => handleChange(0.25)}
              className="px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-bold cursor-pointer"
            >
              +
            </button>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleSave}
              className="w-full text-white p-3 rounded bg-gradient-to-r from-[#E64D20] to-[#F67B39] font-semibold shadow hover:brightness-110 transition cursor-pointer"
            >
              Bekreft
            </button>

            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:underline"
            >
              Avbryt
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WaterLogModal;
