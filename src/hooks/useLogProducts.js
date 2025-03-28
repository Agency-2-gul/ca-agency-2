import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import useCalorieStore from '../stores/calorieStore';
import useMacroStore from '../stores/macroStore';
import {
  extractWeightFromName,
  normalizeUnit,
} from '../components/ean-logging/weight';

const useLogProducts = () => {
  const [user, setUser] = useState(null);
  const { refreshCalories } = useCalorieStore();
  const { refreshMacros } = useMacroStore();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  const logProducts = async (selectedProducts, resetSelection, mealName) => {
    if (!user) {
      alert('Du må logge inn for å logge produkter');
      return;
    }

    if (!selectedProducts || selectedProducts.length === 0) {
      alert('Du må velge produkter for å logge dem');
      return;
    }

    try {
      const db = getFirestore();

      const cleanProducts = selectedProducts.map((product) => {
        const { id, name, nutrition, weight, unit, fullWeight } = product;

        const parsedId = id || 'unknown id';
        const parsedName = name || 'Ukjent produkt';
        const fallback = extractWeightFromName(name);
        const parsedWeight = weight || fallback.fallbackWeight || 100;
        const parsedUnit = unit || fallback.fallbackUnit || 'g';
        const full = fullWeight || parsedWeight;

        const { normalizedWeight, normalizedUnit } = normalizeUnit(
          full,
          parsedUnit
        );

        // This is the key fix - calculate the scale factor correctly
        // Nutrition values are typically per 100g/100ml, so we need to scale accordingly
        const scaleFactor = parsedWeight / 100; // Scale based on selected weight vs 100g/ml standard

        console.log('Product scaling debug:');
        console.log('- parsedWeight:', parsedWeight);
        console.log('- normalizedWeight:', normalizedWeight);
        console.log('- scaleFactor:', scaleFactor);

        const mappedNutrition = Array.isArray(nutrition)
          ? nutrition.map((item) => {
              // Convert amount to number if it's not already
              const baseAmount =
                typeof item.amount === 'number'
                  ? item.amount
                  : parseFloat(String(item.amount).replace(',', '.')) || 0;

              // Scale the amount based on the selected weight (per 100g/ml)
              const scaledAmount = (baseAmount * scaleFactor).toFixed(2);

              // Include the unit if available
              const unitStr = item.unit || '';

              return {
                name: item.display_name || item.name || 'Ukjent næringsstoff',
                value: `${scaledAmount}${unitStr ? ' ' + unitStr : ''}`.trim(),
              };
            })
          : [];

        return {
          id: parsedId,
          name: parsedName,
          weight: parsedWeight,
          nutrition: mappedNutrition,
        };
      });

      await addDoc(collection(db, 'foodLogs'), {
        userId: user.uid,
        meal: mealName,
        products: cleanProducts,
        date: serverTimestamp(),
      });

      alert(`Produkter Logget i ${mealName}!`);
      refreshCalories();
      refreshMacros();
      resetSelection();
    } catch (err) {
      console.error('Error logging products:', err);
      alert('Noe gikk galt, prøv igjen senere ' + err);
    }
  };

  return { user, logProducts };
};

export default useLogProducts;
