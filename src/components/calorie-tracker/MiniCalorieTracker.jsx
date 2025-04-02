import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { FaFontAwesomeFlag, FaAppleAlt } from 'react-icons/fa';
import { FaGlassWater } from 'react-icons/fa6';
import { useAuth } from '../../context/authContext';
import useCalorieStore from '../../stores/calorieStore';
import useWaterStore from '../../stores/waterStore';
import calorieTrackerImg from '../../assets/calorie-tracker.png';

const MiniCalorieTracker = () => {
  const { user, authReady } = useAuth();
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2800);
  const { consumedCalories, triggerUpdate } = useCalorieStore();
  const { water, setWater } = useWaterStore();

  const remaining = Math.max(dailyCalorieGoal - consumedCalories, 0);
  const percentage = Math.min((consumedCalories / dailyCalorieGoal) * 100, 100);

  useEffect(() => {
    const fetchGoalAndWater = async () => {
      try {
        const db = getFirestore();
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.calorieGoal) setDailyCalorieGoal(data.calorieGoal);

          const today = new Date().toISOString().split('T')[0];
          const storedDate = data.waterDate;

          if (storedDate !== today) {
            await setDoc(
              userRef,
              { water: 0, waterDate: today },
              { merge: true }
            );
            setWater(0);
          } else {
            setWater(data.water || 0);
          }
        }
      } catch (err) {
        console.error('Failed to fetch user goal/water:', err);
      }
    };

    if (authReady && user) {
      fetchGoalAndWater();
    }
  }, [authReady, user, triggerUpdate]);

  return (
    <div
      className="w-screen -mx-4 py-6 mb-4 shadow-md bg-cover bg-center"
      style={{ backgroundImage: `url(${calorieTrackerImg})` }}
    >
      <div className="bg-white rounded-lg mx-4 px-4 py-3 space-y-2">
        {/* Header and progress */}
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Kalorier</span>
          <span className="text-sm font-medium text-gray-600">
            {remaining} Gjenstående
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="w-full h-[8px] rounded-full overflow-hidden"
          style={{ backgroundColor: 'rgba(219, 219, 219, 0.8)' }}
        >
          <div
            className="h-full bg-gradient-to-r from-[#E64D20] to-[#F67B39] rounded-full transition-all"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Details */}
        <div className="flex justify-between text-xs font-medium text-gray-700 pt-1">
          <div className="flex items-center gap-1">
            <FaFontAwesomeFlag size={14} />
            <span>{dailyCalorieGoal}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaAppleAlt size={14} />
            <span>{consumedCalories}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaGlassWater size={14} />
            <span>{(water || 0).toFixed(2)} L</span> {/* 2 decimals */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniCalorieTracker;
