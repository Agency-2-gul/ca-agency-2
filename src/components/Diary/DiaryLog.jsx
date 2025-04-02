import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import {
  getTodaysLoggedFoods,
  calculateTotalCaloriesFromLogs,
} from '../../utils/foodLogs';
import { useAuth } from '../../context/authContext';
import useCalorieStore from '../../stores/calorieStore';
import MiniCalorieTracker from '../calorie-tracker/MiniCalorieTracker';

const DiaryLog = () => {
  const navigate = useNavigate();
  const [loggedMeals, setLoggedMeals] = useState({});
  const [expandedMeal, setExpandedMeal] = useState(null);
  const { setConsumedCalories } = useCalorieStore();
  const { user, authReady } = useAuth();

  const meals = [
    { name: 'Frokost', recommended: '300-500' },
    { name: 'Lunsj', recommended: '750-1150' },
    { name: 'Middag', recommended: '1060-1480' },
    { name: 'Snacks', recommended: '200' },
    { name: 'Kvelds', recommended: '200' },
  ];

  const formatMealName = (name) => name.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    if (!authReady || !user) return;

    getTodaysLoggedFoods(user.uid).then((foodLogs) => {
      // Group by meal
      const groupedLogs = foodLogs.reduce((acc, log) => {
        if (!acc[log.meal]) acc[log.meal] = { totalKcal: 0, products: [] };

        log.products.forEach((product) => {
          const kcalEntry = product.nutrition.find(
            (n) =>
              n.name.toLowerCase() === 'kalorier' ||
              n.name.toLowerCase() === 'kcal'
          );

          const kcalValue = kcalEntry?.value
            ? parseFloat(kcalEntry.value.replace(/[^\d.]/g, ''))
            : 0;

          acc[log.meal].totalKcal += kcalValue;
          acc[log.meal].products.push(product);
        });

        return acc;
      }, {});

      setLoggedMeals(groupedLogs);

      // Set total calories in store
      const totalCalories = calculateTotalCaloriesFromLogs(foodLogs);
      setConsumedCalories(Math.round(totalCalories));
    });
  }, [authReady, user]);

  const toggleMeal = (mealKey) => {
    setExpandedMeal((prev) => (prev === mealKey ? null : mealKey));
  };

  return (
    <div className="px-4">
      <MiniCalorieTracker />
      {meals.map((meal) => {
        const mealKey = formatMealName(meal.name);
        const loggedData = loggedMeals[mealKey] || {
          totalKcal: 0,
          products: [],
        };
        const isExpanded = expandedMeal === mealKey;

        return (
          <div key={meal.name} className="rounded-xl shadow-md">
            <div className="">
              <div
                className="flex justify-between items-center bg-white p-4 cursor-pointer"
                onClick={() => toggleMeal(mealKey)}
              >
                <div>
                  <p className="text-xs text-gray-500">
                    Anbefalt: {meal.recommended} kcal
                  </p>
                  <h2 className="text-lg font-semibold">{meal.name}</h2>
                  <p className="text-orange-500 font-medium">
                    {loggedData.totalKcal} kcal
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    className="bg-transparent text-orange-500 hover:bg-orange-100 p-2 rounded-full transition"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/log-products/${mealKey}`);
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="flex justify-center mt-2 border-t border-gray-200 w-[50%] mx-auto">
                {loggedData.products.length > 0 &&
                  (isExpanded ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  ))}
              </div>
            </div>

            {isExpanded && loggedData.products.length > 0 && (
              <ul className="mt-2 space-y-2 bg-gray-50 p-4 rounded-b-xl">
                {loggedData.products.map((product, i) => (
                  <li key={i} className="p-2 bg-white rounded-lg shadow-sm">
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default DiaryLog;
