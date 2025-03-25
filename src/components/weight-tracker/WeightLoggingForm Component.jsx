import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const WeightLoggingForm = () => {
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const weightValue = parseFloat(weight);
    if (isNaN(weightValue) || weightValue <= 0 || weightValue > 500) {
      setError('Vennligst angi en gyldig vekt.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();

      await addDoc(collection(db, 'weightLogs'), {
        userId: user.uid,
        weight: weightValue,
        timestamp: serverTimestamp(),
        date: new Date().toISOString().split('T')[0],
      });

      setSuccess('Vekt logget!');
      setWeight('');
    } catch (err) {
      console.error('Error logging weight:', err);
      setError('Kunne ikke logge vekt. Prøv igjen senere.');
    }

    setLoading(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Logg vekt</h2>

        {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="relative mb-4">
          <input
            type="number"
            step="0.1"
            min="0"
            placeholder="Vekt i kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="border w-full rounded-md p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#E64D20] focus:border-transparent"
            required
          />
          <span className="absolute right-3 top-2.5 text-gray-500">kg</span>
        </div>

        <button
          type="submit"
          className="w-full sm:w-[200px] block mx-auto p-2 rounded-md text-white bg-gradient-to-r from-[#E64D20] to-[#F67B39] relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed before:absolute before:inset-0 before:bg-[#E64D20] before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-in-out before:z-0"
          disabled={loading}
        >
          <span className="relative z-10">
            {loading ? 'Logger...' : 'Logg vekt'}
          </span>
        </button>
      </form>
    </div>
  );
};

export default WeightLoggingForm;
