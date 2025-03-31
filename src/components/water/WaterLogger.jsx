import { useState, useEffect } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import useWaterStore from '../../stores/waterStore';

const WaterLogger = ({ isOpen, onToggle }) => {
  const [amount, setAmount] = useState(0.25);
  const [user, setUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const { setWater } = useWaterStore();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (delta) => {
    setAmount((prev) => Math.max(0, parseFloat((prev + delta).toFixed(2))));
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const db = getFirestore();
      const waterRef = doc(db, 'users', user.uid);
      const existingDoc = await getDoc(waterRef);
      const prevAmount = existingDoc.exists()
        ? existingDoc.data().water || 0
        : 0;
      const newAmount = prevAmount + amount;

      await setDoc(waterRef, { water: newAmount }, { merge: true });
      setWater(newAmount);
      onToggle();
      setAmount(0.25);
    } catch (err) {
      console.error('Error logging water:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <button
        onClick={onToggle}
        className={`flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition cursor-pointer ${isOpen ? 'rounded-t-lg border-b-0' : 'rounded-lg'}`}
      >
        <span className="font-medium text-gray-700">Logg vann</span>
        <svg
          className={`h-5 w-5 transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {isOpen && (
        <div className="-mt-1">
          <div className="flex items-center gap-3 p-4 bg-white rounded-b-lg border-t-2 border-gray-300">
            <span className="text-gray-700 font-medium min-w-20">Vann</span>
            <div className="flex-1">
              <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm p-1">
                <button
                  onClick={() => handleChange(-0.25)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  –
                </button>
                <div className="flex-1 mx-2 text-center font-semibold text-lg text-gray-700">
                  {amount.toFixed(2)} L
                </div>
                <button
                  onClick={() => handleChange(0.25)}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  +
                </button>
              </div>
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white px-6 py-2 rounded-lg font-medium shadow-sm disabled:opacity-50"
                >
                  {saving ? 'Lagrer...' : 'Logg'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterLogger;
