import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getTodaysLoggedFoods } from '../../utils/foodLogs';
import { getAuth } from 'firebase/auth';
import MiniCalorieTracker from '../calorie-tracker/MiniCalorieTracker';

const DiaryLog = () => {
  const navigate = useNavigate();
  const [loggedMeals, setLoggedMeals] = useState({});
  const [expandedMeal, setExpandedMeal] = useState(null); // Track which meal is expanded
  const auth = getAuth();
  const user = auth.currentUser;

  const meals = [
    { name: 'Frokost', recommended: '300-500', logged: 0 },
    { name: 'Lunsj', recommended: '750-1150', logged: 0 },
    { name: 'Middag', recommended: '1060-1480', logged: 0 },
    { name: 'Snacks', recommended: '200', logged: 0 },
    { name: 'Kvelds', recommended: '200', logged: 0 },
  ];

  const formatMealName = (name) => name.toLowerCase().replace(/\s+/g, '-');

  useEffect(() => {
    if (user) {
      getTodaysLoggedFoods(user.uid).then((foodLogs) => {
        const groupedLogs = foodLogs.reduce((acc, log) => {
          if (!acc[log.meal]) acc[log.meal] = { totalKcal: 0, products: [] };

          log.products.forEach((product) => {
            const kcalEntry = product.nutrition.find(
              (n) =>
                n.name.toLowerCase() === 'kalorier' ||
                n.name.toLowerCase() === 'kcal'
            );

            // Extract numeric kcal value
            const kcalValue = kcalEntry?.value
              ? parseFloat(kcalEntry.value.replace(/[^\d.]/g, '')) // Remove non-numeric characters
              : 0;

            acc[log.meal].totalKcal += kcalValue;
            acc[log.meal].products.push(product);
          });

          return acc;
        }, {});

        setLoggedMeals(groupedLogs);
      });
    }
  }, [user]);

  const toggleMeal = (mealKey) => {
    setExpandedMeal((prev) => (prev === mealKey ? null : mealKey));
  };

  return (
    <div className="space-y-4 p-4">
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
            {/* Meal Header */}
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
                      e.stopPropagation(); // Prevent dropdown toggle when clicking the button
                      navigate(`/log-products/${mealKey}`);
                    }}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
              <div className="flex justify-center mt-2 border-t-1 border-gray-200 w-[50%] mx-auto">
                {' '}
                {/* Center the chevron */}
                {loggedMeals[mealKey] && loggedData.products.length > 0 ? (
                  isExpanded ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )
                ) : null}
              </div>
            </div>

            {/* Dropdown for logged products */}
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
