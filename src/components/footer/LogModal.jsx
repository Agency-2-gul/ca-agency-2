import { useState, useMemo, useEffect } from 'react';
import useFetch from '../../hooks/useFetch';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

const LogModal = ({ setIsModalOpen }) => {
  const onClose = () => setIsModalOpen(false);
  const [query, setQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [user, setUser] = useState(null);
  console.log(user);

  const options = useMemo(() => ({}), []);

  const { data, loading, error } = useFetch(
    searchQuery.length >= 2
      ? `https://kassal.app/api/v1/products/?search=${searchQuery}`
      : null,
    options
  );

  const varer = data?.data || [];

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log('user logged in:', currentUser);
        setUser(currentUser);
      } else {
        console.log('No user registered');
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setSearchQuery(query.trim());
    }
  };

  const handleSelectedProducts = (product) => {
    setSelectedProducts((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (p) => p.name === product.name
      );
      if (isAlreadySelected) {
        return prevSelected.filter((p) => p.name !== product.name);
      } else {
        return [...prevSelected, product];
      }
    });
  };

  console.log(selectedProducts);

  const logProducts = async () => {
    if (!user) {
      alert('Du må være logget inn for å logge varer.');
      return;
    }
    try {
      const auth = getAuth();
      const db = getFirestore();

      const cleanProducts = selectedProducts.map((product) => ({
        name: product.name,
      }));
      if (auth) {
        await addDoc(collection(db, 'manualLogs'), {
          userId: user.uid,
          products: cleanProducts,
          timestamp: serverTimestamp(),
          date: new Date().toISOString().split('T')[0],
        });
      }
    } catch (err) {
      alert('Kunne ikke logge varer. Prøv igjen senere. ' + err);
    }
  };

  return (
    <div className="absolute bg-white w-[400px] max-h-[400px] overflow-y-auto top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-xl shadow-lg p-6 z-1000">
      <h1 className="text-xl font-semibold text-gray-800 mb-4">Logg Vare</h1>

      {/* Søkefelt */}
      <div>
        <label
          htmlFor="søk"
          className="block text-sm font-medium text-gray-700"
        >
          Søk vare
        </label>
        <input
          type="text"
          id="søk"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full mt-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
          placeholder="Skriv inn varenavn..."
        />
      </div>

      {/* Resultater / Meldinger */}
      <div
        className="overflow-y-auto mt-4 mb-4 pr-2 text-sm text-gray-700"
        style={{ maxHeight: '170px' }}
      >
        {!searchQuery && (
          <p className="text-gray-500">
            Skriv inn et varenavn og trykk &quot;Enter&quot; for å søke 🔎
          </p>
        )}
        {loading && <p>Laster inn resultater...</p>}
        {error && <p className="text-red-500">Feil: {error}</p>}
        {!loading && !error && varer.length === 0 && searchQuery && (
          <p>Ingen resultater funnet.</p>
        )}
        {varer.length > 0 && (
          <div>
            <h2 className="text-md font-medium text-gray-800 mb-1">
              Resultater:
            </h2>
            <ul className="list-disc list-inside space-y-1">
              {varer.map((item, index) => (
                <li
                  onClick={() => handleSelectedProducts(item)}
                  key={index}
                  className="flex items-center gap-2 list-none pb-2 border-b border-gray-300 last:border-none"
                >
                  <img
                    src={item.image}
                    alt="Product image"
                    className="w-8 h-8 rounded-lg"
                  />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Knapper */}
      <div className="flex justify-end gap-2 mt-auto">
        <button
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          onClick={onClose}
        >
          Avbryt
        </button>
        <button
          onClick={logProducts}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Logg
        </button>
      </div>
    </div>
  );
};

export default LogModal;
