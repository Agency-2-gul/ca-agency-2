import { useEffect, useState } from 'react';
import { getMealsFromUser } from '../../../utils/foodLogs';
import { useAuth } from '../../../context/authContext';
import MealCard from '../recepies-db/MealCard';

const MyRecepies = () => {
  const { user, authReady } = useAuth();
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authReady || !user) return; // Wait until authentication is ready

    const fetchMeals = async () => {
      try {
        setLoading(true);
        const userMeals = await getMealsFromUser(user.uid); // Fetch meals
        setMeals(userMeals);
        console.log('Fetched meals:', userMeals);
      } catch (err) {
        console.error('Error fetching meals:', err);
        setError('Kunne ikke hente oppskrifter.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, [authReady, user]); // Runs when `authReady` or `user` changes

  return (
    <div className="p-4 mx-4 bg-white rounded-lg shadow-md max-w-lg">
      <h2 className="font-bold text-xl text-[#333] mb-2">Mine Oppskrifter</h2>
      {loading && <p className="text-gray-500">Laster oppskrifter...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {meals.length > 0
        ? meals.map((meal, index) => <MealCard key={index} meal={meal} />)
        : !loading && (
            <p className="text-gray-500">Ingen oppskrifter funnet.</p>
          )}
    </div>
  );
};

export default MyRecepies;
