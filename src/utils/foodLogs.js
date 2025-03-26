import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '/firebase'; // from firebase.js in root

// 🔥 Get today's food logs for a specific user
export async function getTodaysLoggedFoods(userId) {
  const foodLogsRef = collection(db, 'foodLogs');

  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const q = query(
    foodLogsRef,
    where('userId', '==', userId),
    where('date', '>=', start),
    where('date', '<=', end)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data());
}

// 🔍 Extract calories from each product in a food log
export function extractCaloriesFromLoggedFood(foodLog) {
  const products = foodLog.products || [];

  return products.map((product) => {
    const nutritionArray = product.nutrition || [];
    const calorieEntry = nutritionArray.find((n) => n.name === 'Kalorier');

    const raw = calorieEntry?.value?.replace('kcal', '').trim();
    const calories = parseFloat(raw);

    return {
      ...product,
      calories: isNaN(calories) ? 0 : calories,
    };
  });
}

// 🍽️ Convert the full nutrition array into a key-value map
export function getNutritionDetails(product) {
  const nutritionArray = product?.nutrition || [];

  return nutritionArray.reduce((acc, item) => {
    acc[item.name] = item.value;
    return acc;
  }, {});
}
