// utils/calculateCaloriesFromFoodLogs.js

export function calculateTotalCaloriesFromLogs(foodLogs) {
  let total = 0;

  foodLogs.forEach((log) => {
    const products = log.products || [];

    products.forEach((product) => {
      const nutritionArray = product.nutrition || [];

      const calorieEntry = nutritionArray.find(
        (n) =>
          n.name?.toLowerCase() === 'kalorier' ||
          n.name?.toLowerCase() === 'kcal'
      );

      const raw = calorieEntry?.value?.replace(/[^\d.]/g, '');
      const kcal = parseFloat(raw);

      if (!isNaN(kcal)) {
        total += kcal;
      }
    });
  });

  return Math.round(total);
}
