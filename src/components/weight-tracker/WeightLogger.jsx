import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { setDefaultMacroGoals } from '../../utils/setDefaultMacros';
import useMacroStore from '../../stores/macroStore';
import useWeightStore from '../../stores/weightStore';

const WeightLogger = ({
  isOpen = false,
  onToggle = () => {},
  hideToggle = false,
}) => {
  const [weight, setWeight] = useState('');
  const [unit, setUnit] = useState('kg');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleWeightChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setWeight(value);
  };

  const logWeight = async () => {
    if (!user) {
      setError('Du må være logget inn');
      return;
    }

    setError('');
    setSuccess(false);

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0 || weightValue > 500) {
      setError('Ugyldig vekt');
      return;
    }

    setLoading(true);

    try {
      const db = getFirestore();
      const weightInKg = unit === 'lbs' ? weightValue / 2.20462 : weightValue;

      await addDoc(collection(db, 'weightLogs'), {
        userId: user.uid,
        weight: parseFloat(weightInKg.toFixed(1)),
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0],
        unit: 'kg',
      });

      await setDefaultMacroGoals();
      useMacroStore.getState().refreshMacros();
      useWeightStore.getState().refreshWeights();

      setSuccess(true);
    } catch (err) {
      console.error('Error logging weight:', err);
      setError('Feil ved lagring. Sjekk tillatelser.');
    }

    setLoading(false);
  };

  // Extract form content to a reusable JSX block
  const weightForm = (
    <div className="flex items-center gap-3 p-4 bg-white rounded-b-lg lg:rounded-lg border border-gray-300">
      <span className="text-gray-700 font-medium min-w-20">Vekt</span>
      <div className="flex-1">
        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm p-1">
          <button
            onClick={() => {
              const currentValue = parseFloat(weight) || 0;
              const decrement = unit === 'kg' ? 0.1 : 0.2;
              const newValue = Math.max(0, currentValue - decrement).toFixed(1);
              setWeight(newValue);
            }}
            className="w-10 h-10 flex items-center justify-center text-gray-600 rounded-lg hover:bg-gray-100"
          >
            –
          </button>

          <div className="relative flex-1 mx-2">
            <input
              type="text"
              inputMode="decimal"
              value={weight}
              onChange={handleWeightChange}
              placeholder={unit === 'kg' ? 'Kg' : 'Lbs'}
              className="w-full bg-white text-gray-800 text-center font-semibold text-lg placeholder-gray-400 py-2 px-3 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-[#E64D20] focus:ring-opacity-50"
            />
          </div>

          <button
            onClick={() => {
              const currentValue = parseFloat(weight) || 0;
              const increment = unit === 'kg' ? 0.1 : 0.2;
              const newValue = (currentValue + increment).toFixed(1);
              setWeight(newValue);
            }}
            className="w-10 h-10 flex items-center justify-center text-gray-600 rounded-lg hover:bg-gray-100"
          >
            +
          </button>
        </div>

        <div className="flex items-center mt-2 justify-between">
          <div
            onClick={() => {
              if (weight) {
                if (unit === 'kg') {
                  const lbsValue = (parseFloat(weight) * 2.20462).toFixed(1);
                  setWeight(lbsValue);
                  setUnit('lbs');
                } else {
                  const kgValue = (parseFloat(weight) / 2.20462).toFixed(1);
                  setWeight(kgValue);
                  setUnit('kg');
                }
              } else {
                setUnit(unit === 'kg' ? 'lbs' : 'kg');
              }
            }}
            className="flex items-center cursor-pointer border border-gray-200 bg-white shadow-sm hover:bg-gray-50 active:bg-gray-100 rounded-lg p-2 transition-colors"
          >
            <span className="text-gray-700 text-sm mr-1">
              {unit === 'kg' ? 'Bytt til lbs' : 'Bytt til kg'}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-600"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <button
            onClick={logWeight}
            disabled={loading || !weight || !user}
            className="bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white px-6 py-2 rounded-lg font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed min-w-16 flex items-center justify-center"
          >
            {loading ? (
              <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : success ? (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Lagret
              </span>
            ) : (
              'Logg'
            )}
          </button>
        </div>

        {error && (
          <div className="px-4 -mt-1">
            <span className="text-red-500 text-sm flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="w-full">
      {!hideToggle && (
        <button
          onClick={onToggle}
          className={`flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition cursor-pointer ${
            isOpen ? 'rounded-t-lg border-b-0' : 'rounded-lg'
          }`}
        >
          <span className="font-medium text-gray-700">Logg vekt</span>
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
      )}

      {/* Show the form below the toggle (dropdown style) */}
      {isOpen && !hideToggle && <div className="-mt-1">{weightForm}</div>}

      {/* Show the form directly when hideToggle is true (modal use) */}
      {hideToggle && weightForm}
    </div>
  );
};

export default WeightLogger;
