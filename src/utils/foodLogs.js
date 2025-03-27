import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '/firebase'; // from firebase.js in root

// Get today's food logs for a specific user
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

// Extract calories from each product, scaled by weight
export function extractCaloriesFromLoggedFood(foodLog) {
  const products = foodLog.products || [];

  return products.map((product) => {
    const nutritionArray = product.nutrition || [];

    const calorieEntry = nutritionArray.find(
      (n) => n.name?.toLowerCase() === 'kalorier'
    );

    const per100gRaw = calorieEntry?.value?.replace('kcal', '').trim();
    const per100g = parseFloat(per100gRaw);

    const weight = product.weight || 100;

    const totalCalories = isNaN(per100g) ? 0 : (per100g / 100) * weight;

    return {
      ...product,
      calories: Math.round(totalCalories),
    };
  });
}

// Convert the full nutrition array into a key-value map
export function getNutritionDetails(product) {
  const nutritionArray = product?.nutrition || [];

  return nutritionArray.reduce((acc, item) => {
    acc[item.name] = item.value;
    return acc;
  }, {});
}
