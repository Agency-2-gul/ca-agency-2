import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '/firebase';

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

export async function getMealsFromUser(userId) {
  const mealLogsRef = collection(db, 'recepies');

  const q = query(mealLogsRef, where('userId', '==', userId));

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

// Extract protein, fat, and carbs from food logs, scaled by weight
export function extractMacrosFromLoggedFood(foodLog) {
  const products = foodLog.products || [];

  const totals = {
    carbs: 0,
    protein: 0,
    fat: 0,
  };

  products.forEach((product) => {
    const nutrition = product.nutrition || [];

    nutrition.forEach((n) => {
      const name = n.name?.toLowerCase();
      const rawValue = parseFloat(n.value.replace(/[^\d.]/g, ''));

      if (isNaN(rawValue)) return;

      if (name.includes('karbohydrater')) totals.carbs += rawValue;
      if (name.includes('protein')) totals.protein += rawValue;
      if (name.includes('fett') && !name.includes('mettet'))
        totals.fat += rawValue;
    });
  });

  return {
    carbs: Math.round(totals.carbs),
    protein: Math.round(totals.protein),
    fat: Math.round(totals.fat),
  };
}

// Convert the full nutrition array into a key-value map
export function getNutritionDetails(product) {
  const nutritionArray = product?.nutrition || [];

  return nutritionArray.reduce((acc, item) => {
    acc[item.name] = item.value;
    return acc;
  }, {});
}
