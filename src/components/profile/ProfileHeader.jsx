import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  limit,
} from 'firebase/firestore';

const ProfileHeader = ({ user }) => {
  const [latestWeight, setLatestWeight] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestWeight = async () => {
      if (!user) return;

      try {
        const db = getFirestore();
        const weightCollection = collection(db, 'weightLogs');

        // Query to get the latest weight entry
        const weightQuery = query(
          weightCollection,
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc'),
          limit(1)
        );

        const querySnapshot = await getDocs(weightQuery);

        if (!querySnapshot.empty) {
          const latestWeightData = querySnapshot.docs[0].data();
          setLatestWeight(latestWeightData.weight);
        }
      } catch (err) {
        console.error('Error fetching latest weight:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestWeight();
  }, [user]);

  // Format date joined
  const joinDate = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('no-NO', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Ukjent';

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-lg">Brukerinfo</h3>
        <div className="border-t mt-2 pt-2">
          <p className="text-sm text-gray-500">E-post</p>
          <p className="font-medium">{user?.email || 'Ikke tilgjengelig'}</p>
        </div>
        <div className="mt-2 pt-1">
          <p className="text-sm text-gray-500">Medlem siden</p>
          <p className="font-medium">{joinDate}</p>
        </div>
      </div>

      {/* Latest Weight Section */}
      <div className="border-t pt-3">
        <h3 className="font-semibold text-lg">Min nåværende Vekt</h3>
        <div className="mt-2">
          {loading ? (
            <div className="flex items-center justify-center h-12">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#E64D20]"></div>
            </div>
          ) : latestWeight ? (
            <div className="flex flex-col items-center">
              <div className="text-2xl font-bold text-[#E64D20]">
                {latestWeight} kg
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-gray-500 text-sm">Ingen vektdata registrert</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
