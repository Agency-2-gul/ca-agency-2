import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const useLogProducts = () => {
  const [user, setUser] = useState(null);

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

      const cleanProducts = selectedProducts.map(({ name, id, nutrition }) => ({
        id: id || 'unknown id',
        name: name || 'unknown product',
        nutrition: nutrition
          ? nutrition.map(({ display_name, amount, unit }) => ({
              name: display_name,
              value: `${amount} ${unit}`,
            }))
          : [],
      }));

      await addDoc(collection(db, 'foodLogs'), {
        userId: user.uid,
        meal: mealName || null,
        products: cleanProducts,
        timestamp: serverTimestamp(),
      });
      alert(`Produkter Logget i ${mealName}! `);
      resetSelection();
    } catch (err) {
      alert('Noe gikk galt, prøv igjen senere ' + err);
    }
  };
  return { user, logProducts };
};

export default useLogProducts;
