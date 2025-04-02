import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { FaFontAwesomeFlag, FaAppleAlt } from 'react-icons/fa';
import { FaGlassWater } from 'react-icons/fa6';
import { useAuth } from '../../context/authContext';
import useCalorieStore from '../../stores/calorieStore';
import useWaterStore from '../../stores/waterStore';

const MiniCalorieTracker = () => {
  const { user, authReady } = useAuth();
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2800);
  const { consumedCalories } = useCalorieStore();
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
  }, [authReady, user]);

  return (
    <div className="bg-[#FF671F] text-white rounded-xl p-4 shadow mb-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <span className="w-2 h-2 bg-white rounded-full" />
          <span>Kalorier</span>
        </div>
        <div className="text-sm font-medium">{remaining} Gjenstående</div>
      </div>

      <div className="w-full bg-white/30 h-[6px] rounded-full overflow-hidden mb-4">
        <div
          className="h-[6px] bg-white transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="flex justify-between text-sm font-medium">
        <div className="flex items-center gap-1">
          <FaFontAwesomeFlag size={16} />
          <span>{dailyCalorieGoal}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaAppleAlt size={16} />
          <span>{consumedCalories}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaGlassWater size={16} />
          <span>{(water || 0).toFixed(1)}L</span>
        </div>
      </div>
    </div>
  );
};

export default MiniCalorieTracker;
