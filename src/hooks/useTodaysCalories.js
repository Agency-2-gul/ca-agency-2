import { useEffect, useState } from 'react';
import { getTodaysLoggedFoods } from '../lib/firebase'; // adjust path
import { extractCaloriesFromLoggedFood } from '../utils/parsing'; // adjust path

export function useTodaysCalories(currentUserId) {
  const [calories, setCalories] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchCalories = async () => {
      setLoading(true);
      setError(null);

      try {
        const loggedFoods = await getTodaysLoggedFoods(currentUserId);

        const total = loggedFoods.reduce((sum, log) => {
          const processed = extractCaloriesFromLoggedFood(log);
          return processed ? sum + processed.calories : sum;
        }, 0);

        setCalories(total);
      } catch (err) {
        console.error('Error fetching calories:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalories();
  }, [currentUserId]);

  return { calories, loading, error };
}
