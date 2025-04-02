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
  calculateNutritionValues,
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
        const {
          id,
          name,
          nutrition,
          weight,
          unit,
          fullWeight,
          isPiece,
          weightPerPiece,
          totalProductWeight,
        } = product;

        const parsedId = id || 'unknown id';
        const parsedName = name || 'Ukjent produkt';

        // Extract info from name if not already provided
        const nameInfo = extractWeightFromName(name);

        // Determine if it's piece-based
        const isPieceBased =
          isPiece || unit === 'stk' || unit === 'piece' || unit === 'pieces';

        // Get weight per piece (if it's piece-based)
        const effectiveWeightPerPiece =
          weightPerPiece ||
          nameInfo.weightPerPiece ||
          (totalProductWeight && nameInfo.fallbackWeight
            ? totalProductWeight / nameInfo.fallbackWeight
            : null);

        // Ensure we have the correct weight and unit for the database
        const parsedWeight = weight || nameInfo.fallbackWeight || 100;
        const parsedUnit =
          unit || (isPieceBased ? 'stk' : nameInfo.fallbackUnit || 'g');

        // Calculate appropriate nutrition values based on the logged amount
        const mappedNutrition = calculateNutritionValues(
          nutrition,
          parsedWeight,
          parsedUnit,
          effectiveWeightPerPiece,
          totalProductWeight || nameInfo.totalProductWeight
        );

        console.log('Logging product:', parsedName);
        console.log('- Amount:', parsedWeight, parsedUnit);
        console.log('- Is piece-based:', isPieceBased);
        console.log('- Weight per piece:', effectiveWeightPerPiece, 'g');
        console.log(
          '- Nutrition sample:',
          mappedNutrition.length > 0 ? mappedNutrition[0] : 'No nutrition data'
        );

        return {
          id: parsedId,
          name: parsedName,
          weight: parsedWeight,
          unit: parsedUnit, // Store the actual unit (stk, g, ml)
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
