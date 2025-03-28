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

// This function updates macro goals based on the latest calorie goal and weight
export async function setDefaultMacroGoals() {
  const user = auth.currentUser;
  if (!user) return;

  const db = getFirestore();
  const userRef = doc(db, 'users', user.uid);

  // Step 1: Get user's calorie goal
  const userSnap = await getDoc(userRef);
  const calorieGoal = userSnap.exists() ? userSnap.data().calorieGoal : null;

  if (!calorieGoal) {
    console.warn('No calorie goal found for user');
    return;
  }

  // Step 2: Get user's latest weight
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

  // Step 3: Calculate macros based on calorie goal and weight
  const recommended = calculateRecommendedMacros(calorieGoal, latestWeight);

  // Step 4: Save macro goals back to user document
  await setDoc(userRef, recommended, { merge: true });

  console.log('Macro goals saved to Firestore:', recommended);
}
