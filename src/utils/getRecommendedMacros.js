export function calculateRecommendedMacros(calorieGoal, weightKg) {
  // 1. Protein: 2g per kg
  const protein = weightKg * 2;

  // 2. Fat: 25% of total calories / 9 kcal/g
  const fatCalories = calorieGoal * 0.25;
  const fat = fatCalories / 9;

  // 3. Carbs: remaining calories / 4 kcal/g (clamped to avoid negatives)
  const proteinCalories = protein * 4;
  const carbsCalories = calorieGoal - fatCalories - proteinCalories;
  const carbs = Math.max(0, carbsCalories / 4);

  return {
    proteinGoal: Math.round(protein),
    fatGoal: Math.round(fat),
    carbGoal: Math.round(carbs),
  };
}
