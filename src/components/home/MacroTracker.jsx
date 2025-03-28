import { useEffect } from 'react';
import { useAuth } from '../../context/authContext';
import MacroProgressBar from './MacroProgressBar';
import {
  getTodaysLoggedFoods,
  extractMacrosFromLoggedFood,
} from '../../utils/foodLogs';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import useMacroStore from '../../stores/macroStore';

const MacroTracker = () => {
  const { user, authReady } = useAuth();
  const {
    carbs,
    protein,
    fat,
    carbGoal,
    proteinGoal,
    fatGoal,
    setMacros,
    setMacroGoals,
    trigger,
  } = useMacroStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!authReady || !user) return;

      const db = getFirestore();

      // 1. Fetch food logs and calculate intake
      const logs = await getTodaysLoggedFoods(user.uid);
      let totals = { carbs: 0, protein: 0, fat: 0 };

      logs.forEach((log) => {
        const extracted = extractMacrosFromLoggedFood(log);
        totals.carbs += extracted.carbs;
        totals.protein += extracted.protein;
        totals.fat += extracted.fat;
      });

      setMacros({
        carbs: Math.round(totals.carbs),
        protein: Math.round(totals.protein),
        fat: Math.round(totals.fat),
      });

      // 2. Fetch saved macro goals from Firestore
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMacroGoals({
          carbGoal: data.carbGoal || 0,
          proteinGoal: data.proteinGoal || 0,
          fatGoal: data.fatGoal || 0,
        });
      }
    };

    fetchData();
  }, [authReady, user, trigger]);

  return (
    <div className="bg-white shadow-md rounded-xl py-3 px-2 flex justify-around items-center mx-4">
      <MacroProgressBar
        label="Carbs"
        current={carbs}
        goal={carbGoal}
        color="#EF4444"
      />
      <MacroProgressBar
        label="Protein"
        current={protein}
        goal={proteinGoal}
        color="#3B82F6"
      />
      <MacroProgressBar
        label="Fat"
        current={fat}
        goal={fatGoal}
        color="#EA580C"
      />
    </div>
  );
};

export default MacroTracker;
