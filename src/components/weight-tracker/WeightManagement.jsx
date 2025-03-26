import { useState, useEffect } from 'react';
import {
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { FaTrash, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const WeightManagement = () => {
  const [weightEntries, setWeightEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  // First, set up auth listener
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Then fetch weight entries when user is available
  useEffect(() => {
    const fetchWeightEntries = async () => {
      // Don't proceed if no user
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const db = getFirestore();
        const weightCollection = collection(db, 'weightLogs');

        // Query to get all weight entries for the user, ordered by date
        const weightQuery = query(
          weightCollection,
          where('userId', '==', user.uid),
          orderBy('date', 'desc')
        );

        const querySnapshot = await getDocs(weightQuery);

        const entries = [];
        querySnapshot.forEach((doc) => {
          const weightLog = doc.data();
          entries.push({
            id: doc.id,
            ...weightLog,
            // Format date for display
            formattedDate: new Date(weightLog.date).toLocaleDateString(
              'no-NO',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            ),
          });
        });

        //console.log('Fetched weight entries:', entries);

        setWeightEntries(entries);
      } catch (err) {
        console.error('Error fetching weight entries:', err);
        setError(`Kunne ikke hente vektoppføringer: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchWeightEntries();
  }, [user]);

  const handleDeleteEntry = async (entryId) => {
    try {
      const db = getFirestore();
      const entryRef = doc(db, 'weightLogs', entryId);

      // Delete the document
      await deleteDoc(entryRef);

      // Remove the entry from local state
      setWeightEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== entryId)
      );
    } catch (err) {
      console.error('Error deleting weight entry:', err);
      setError('Kunne ikke slette vektoppføring');
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p>Du må være pålogget for å administrere vektoppføringer</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header with toggle button */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <h3 className="text-lg font-semibold">Administrer Vektoppføringer</h3>
        {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {/* Collapsible content with smooth transition */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100 p-6' : 'max-h-0 opacity-0 p-0'
        }`}
      >
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E64D20]"></div>
          </div>
        ) : weightEntries.length === 0 ? (
          <p className="text-center text-gray-500">
            Ingen vektoppføringer funnet
          </p>
        ) : (
          <div className="max-h-64 overflow-y-auto space-y-4 pr-2">
            {weightEntries.map((entry) => (
              <div
                key={entry.id}
                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg"
              >
                <div>
                  <p className="font-medium text-[#E64D20]">
                    {entry.weight} kg
                  </p>
                  <p className="text-sm text-gray-600">{entry.formattedDate}</p>
                </div>
                <button
                  onClick={() => handleDeleteEntry(entry.id)}
                  className="text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  title="Slett vektoppføring"
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeightManagement;
