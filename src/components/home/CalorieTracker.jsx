import React, { useState, useEffect } from 'react';
import calorieTrackerImg from '../../assets/calorie-tracker.png';
import CalorieProgress from './CalorieProgressCircle';
import { FaFontAwesomeFlag, FaAppleAlt } from 'react-icons/fa';
import { FaGlassWater } from 'react-icons/fa6';
import {
  getTodaysLoggedFoods,
  extractCaloriesFromLoggedFood,
} from '../../utils/foodLogs';
import { useAuth } from '../../auth/authContext';

const CalorieTracker = () => {
  const { user, authReady } = useAuth(); // ✅ use user and authReady from context

  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2800);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [isGoalMenuOpen, setIsGoalMenuOpen] = useState(false);

  useEffect(() => {
    if (!authReady || !user) return; // ✅ wait for Firebase to be ready

    const fetchLoggedFoods = async () => {
      try {
        const logs = await getTodaysLoggedFoods(user.uid);

        let total = 0;
        logs.forEach((log) => {
          const products = extractCaloriesFromLoggedFood(log);
          products.forEach((product) => {
            total += product.calories;
          });
        });

        setConsumedCalories(total);
      } catch (error) {
        console.error('Error fetching logged foods:', error);
      }
    };

    fetchLoggedFoods();
  }, [authReady, user]); // ✅ re-run if auth state changes

  const handleUpdateGoal = (newGoal) => {
    const parsedGoal = parseInt(newGoal, 10);
    if (!isNaN(parsedGoal) && parsedGoal > 0) {
      setDailyCalorieGoal(parsedGoal);
      setIsGoalMenuOpen(false);
      // TODO: Save goal to user's profile in Firebase
    }
  };

  return (
    <div
      className="relative h-[310px] bg-cover bg-center flex items-center justify-center z-[-10]"
      style={{ backgroundImage: `url(${calorieTrackerImg})` }}
    >
      <div
        className="h-[200px] w-full mx-4 flex items-center justify-start rounded-xl shadow-md -mt-6"
        style={{ backgroundColor: '#F7F7F7' }}
      >
        <div>
          <CalorieProgress
            totalCalories={dailyCalorieGoal}
            consumedCalories={consumedCalories}
          />
        </div>

        {/* Right Side: Text Content */}
        <div
          className="flex flex-col justify-center ml-auto mr-10 space-y-3 relative top-4 text-sm z-1"
          style={{ color: '#333333' }}
        >
          {/* Grunnmål */}
          <div className="flex flex-row items-center gap-2">
            <span className="text-gray-500">
              <FaFontAwesomeFlag size={24} />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-medium">Grunnmål</p>
              <p className="font-bold">{dailyCalorieGoal}</p>
            </div>
          </div>

          {/* Mat */}
          <div className="flex flex-row items-center gap-2">
            <span className="text-gray-500">
              <FaAppleAlt size={24} />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-medium">Mat</p>
              <p className="font-bold">{consumedCalories}</p>
            </div>
          </div>

          {/* Vann */}
          <div className="flex flex-row items-center gap-2">
            <span className="text-gray-500">
              <FaGlassWater size={23} />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-medium">Vann</p>
              <p className="font-bold">1L</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;
