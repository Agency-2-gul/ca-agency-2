import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { calculateRecommendedMacros } from './getRecommendedMacros';
import { auth } from '../../firebase';

export async function setDefaultMacroGoals() {
  const user = auth.currentUser;
  if (!user) return;

  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);

  // 1. Get calorie goal from user document
  const userSnap = await getDoc(userRef);
  const calorieGoal = userSnap.exists() ? userSnap.data().calorieGoal : null;
  if (!calorieGoal) {
    console.warn('No calorie goal found for user');
    return;
  }

  // 2. Get latest weight from weightLogs, ordered by timestamp
  const weightQuery = query(
    collection(db, 'weightLogs'),
    where('userId', '==', user.uid),
    orderBy('timestamp', 'desc'),
    limit(1)
  );
  const weightSnap = await getDocs(weightQuery);
  const latestWeight = weightSnap.docs[0]?.data()?.weight;

  if (!latestWeight) {
    console.warn('No weight entry found for user');
    return;
  }

  // 3. Calculate macros using helper
  const recommended = calculateRecommendedMacros(calorieGoal, latestWeight);

  // 4. Save macros to user document
  await setDoc(userRef, recommended, { merge: true });

  console.log('Macro goals saved:', recommended);
}
