import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const useLogNewRecepie = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsubscribe();
  }, []);

  const logRecepie = async (mealName, ingredients, steps) => {
    if (!user) {
      alert('Logg Inn DA!');
      return;
    }

    try {
      const db = getFirestore();
      await addDoc(collection(db, 'recepies'), {
        userId: user.uid,
        ingredients: ingredients,
        steps: steps,
        mealName: mealName,
        date: serverTimestamp(),
      });
      alert('Oppskrift Lagret!');
    } catch (err) {
      alert(err.message);
    }
  };
  return { user, logRecepie };
};

export default useLogNewRecepie;
