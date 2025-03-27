import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa';
import { getTodaysLoggedFoods } from '../../utils/foodLogs';
import { getAuth } from 'firebase/auth';
import { useEffect, useState } from 'react';

const DiaryLog = () => {
  const navigate = useNavigate();
  const [loggedMeals, setLoggedMeals] = useState([]);
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

  // fetch looged products
  useEffect(() => {
    if (user) {
      getTodaysLoggedFoods(user.uid).then((foodLogs) => {
        const groupedLogs = foodLogs.reduce((acc, log) => {
          if (!acc[log.meal]) acc[log.meal] = { totalKcal: 0, products: [] };
          log.products.forEach((product) => {
            const kcal = product.nutrition.find((n) => n.name === 'kcal');
            acc[log.meal].totalKcal += kcal ? parseFloat(kcal.value) : 0;
            acc[log.meal].products.push(product);
          });
          return acc;
        }, {});
        setLoggedMeals(groupedLogs);
      });
    }
  }, [user]);

  return (
    <div className="space-y-4 p-4">
      {meals.map((meal) => {
        const mealKey = formatMealName(meal.name);
        const loggedData = loggedMeals[mealKey] || {
          totalKcal: 0,
          products: [],
        };

        return (
          <div key={meal.name} className="">
            {/* Meal Header */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md cursor-pointer">
              <div>
                <p className="text-xs text-gray-500">
                  Anbefalt: {meal.recommended} kcal
                </p>
                <h2 className="text-lg font-semibold">{meal.name}</h2>
                <p className="text-orange-500 font-medium">
                  {loggedData.totalKcal} kcal
                </p>
              </div>
              <button
                className="bg-transparent text-orange-500 hover:bg-orange-100 p-2 rounded-full transition"
                onClick={() => navigate(`/log-products/${mealKey}`)}
              >
                <FaPlus />
              </button>
            </div>

            {/* Display Logged Products */}
            {loggedData.products.length > 0 && (
              <ul className="mt-2 space-y-2">
                {loggedData.products.map((product, i) => (
                  <li key={i} className="p-2 bg-gray-100 rounded-lg">
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
