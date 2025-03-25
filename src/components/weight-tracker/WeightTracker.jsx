import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import WeightLoggingForm from './WeightLoggingForm';
import WeightVisualization from './WeightVisualization';

const WeightTracker = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E64D20]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Vektlogger</h1>

      <div className="max-w-4xl mx-auto space-y-8">
        <WeightLoggingForm />

        <div className="mt-10">
          <WeightVisualization />
        </div>
      </div>
    </div>
  );
};

export default WeightTracker;
