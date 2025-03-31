import React, { useState, useEffect, useRef } from 'react';
import calorieTrackerImg from '../../assets/calorie-tracker.png';
import CalorieProgress from './CalorieProgressCircle';
import { FaFontAwesomeFlag, FaAppleAlt } from 'react-icons/fa';
import { FaGlassWater } from 'react-icons/fa6';
import { getTodaysLoggedFoods } from '../../utils/foodLogs';
import { useAuth } from '../../context/authContext';
import useCalorieStore from '../../stores/calorieStore';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
import MacroTracker from './MacroTracker';
import { setDefaultMacroGoals } from '../../utils/setDefaultMacros';
import useMacroStore from '../../stores/macroStore';
import { calculateTotalCaloriesFromLogs } from '../../utils/calculateCaloriesFromFoodLogs';
import useWaterStore from '../../stores/waterStore'; // ✅ Import store

const CalorieTracker = () => {
  const { user, authReady } = useAuth();
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2800);
  const { consumedCalories, setConsumedCalories, triggerUpdate } =
    useCalorieStore();
  const [isGoalMenuOpen, setIsGoalMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const { water, setWater } = useWaterStore(); // ✅ Use water store

  useEffect(() => {
    if (!authReady || !user) return;

    const fetchLoggedFoods = async () => {
      try {
        const logs = await getTodaysLoggedFoods(user.uid);
        const total = calculateTotalCaloriesFromLogs(logs);
        setConsumedCalories(total);
      } catch (error) {
        console.error('Error fetching logged foods:', error);
      }
    };

    const fetchGoalAndWater = async () => {
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.calorieGoal) setDailyCalorieGoal(data.calorieGoal);
          if (typeof data.water === 'number') setWater(data.water); // ✅ set Zustand value
        }
      } catch (err) {
        console.error('Failed to fetch user goal/water:', err);
      }
    };

    fetchGoalAndWater();
    fetchLoggedFoods();
  }, [authReady, user, triggerUpdate, setWater]);

  const handleUpdateGoal = async (newGoal) => {
    const parsedGoal = parseInt(newGoal, 10);
    if (!isNaN(parsedGoal) && parsedGoal > 0 && user) {
      setDailyCalorieGoal(parsedGoal);
      setIsGoalMenuOpen(false);

      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, { calorieGoal: parsedGoal }, { merge: true });

        await setDefaultMacroGoals();
        useMacroStore.getState().refreshMacros();
      } catch (err) {
        console.error('Error saving goal:', err);
      }
    }
  };

  return (
    <div
      className="relative h-[310px] bg-cover bg-center flex items-center justify-center mb-14"
      style={{ backgroundImage: `url(${calorieTrackerImg})` }}
    >
      <div
        className="h-[200px] w-full mx-4 flex items-center justify-start rounded-xl shadow-md -mt-8"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        <div>
          <CalorieProgress
            totalCalories={dailyCalorieGoal}
            consumedCalories={consumedCalories}
          />
        </div>

        <div
          className="flex flex-col justify-center ml-auto mr-10 space-y-3 relative top-1 text-sm z-1"
          style={{ color: '#333333' }}
        >
          <button
            onClick={() => setIsGoalMenuOpen(!isGoalMenuOpen)}
            className="text-xs text-blue-500 hover:underline m-0 ml-6 pb-2"
          >
            Endre mål
          </button>

          {isGoalMenuOpen && (
            <div className="absolute top-[1.2rem] mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 z-20">
              <input
                ref={inputRef}
                type="number"
                placeholder="F.eks. 2800"
                className="w-28 px-2 py-1 text-sm border rounded mb-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleUpdateGoal(e.target.value);
                }}
              />
              <div className="flex justify-between gap-2 text-xs">
                <button
                  onClick={() => handleUpdateGoal(inputRef.current.value)}
                  className="text-green-600 hover:underline"
                >
                  Lagre
                </button>
                <button
                  onClick={() => setIsGoalMenuOpen(false)}
                  className="text-red-500 hover:underline"
                >
                  Avbryt
                </button>
              </div>
            </div>
          )}

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
              <p className="font-bold">{water.toFixed(2)} L</p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-[-35px] z-10">
        <MacroTracker />
      </div>
    </div>
  );
};

export default CalorieTracker;
