import { getAllMeals } from '../../../utils/foodLogs';
import { useEffect, useState } from 'react';
import MealCard from '../recepies-db/MealCard';

const NewestRecepies = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        setLoading(true);
        const allMeals = await getAllMeals(); // Fetch all meals
        const sortedMeals = allMeals.sort(
          (a, b) => b.date.seconds - a.date.seconds
        );
        setMeals(sortedMeals);
      } catch (err) {
        console.error('Error fetching meals:', err);
        setError('Kunne ikke hente oppskrifter.');
      } finally {
        setLoading(false);
      }
    };
    fetchMeals();
  }, []); // Empty dependency array to run once on mount

  return (
    <div className="flex flex-col gap-y-8 p-4 mx-4  max-w-lg">
      <h2 className="font-bold text-xl text-[#333] mb-2">Nyeste</h2>
      {loading && <p className="text-gray-500">Laster oppskrifter...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="flex flex-col gap-y-4">
        {meals.length > 0
          ? meals.map((meal, index) => <MealCard key={index} meal={meal} />)
          : !loading && (
              <p className="text-gray-500">Ingen oppskrifter funnet.</p>
            )}
      </div>
    </div>
  );
};
export default NewestRecepies;
