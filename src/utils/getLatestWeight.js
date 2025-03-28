import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
} from 'firebase/firestore';

export async function getLatestWeight(userId) {
  const db = getFirestore();
  const weightRef = collection(db, 'weightLogs');

  const q = query(
    weightRef,
    where('userId', '==', userId),
    orderBy('timestamp', 'desc'),
    limit(1)
  );

  const snapshot = await getDocs(q);

  if (!snapshot.empty) {
    const data = snapshot.docs[0].data();
    return data.weight;
  }

  return null;
}
