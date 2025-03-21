import { useAuth } from '../hooks/useAuth';
import {
  getAuth,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const Profile = () => {
  const { user } = useAuth();
  const auth = getAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [password, setPassword] = useState('');
  const [isReauthenticating, setIsReauthenticating] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      setError(`Kunne ikke logge ut. Prøv igjen. ${console.log(err.message)}`);
    }
  };

  const handleDeleteAccount = async () => {
    if (confirmationText !== 'Jeg vil slette min konto') {
      setError(
        "Teksten stemmer ikke. Skriv nøyaktig: 'Jeg vil slette min konto'"
      );
      return;
    }

    if (!password) {
      setError('Du må oppgi passordet ditt for å slette kontoen.');
      return;
    }

    setIsReauthenticating(true);
    setError('');

    try {
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      await deleteUser(auth.currentUser);
      navigate('/');
    } catch (err) {
      setError(
        `Kunne ikke slette brukeren. Passordet kan være feil, eller du må logge inn på nytt. ${console.log(err.message)}`
      );
    } finally {
      setIsReauthenticating(false);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-bold mb-4">Profil</h2>

      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-gray-100 p-4 rounded shadow-md w-80 text-center">
        <p className="text-lg mb-2">
          <strong>Email:</strong> {user?.email}
        </p>

        <button
          onClick={handleLogout}
          className="bg-black text-white p-2 rounded w-full mt-4 cursor-pointer"
        >
          Logg ut
        </button>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500 text-white p-2 rounded w-full mt-2 cursor-pointer"
          >
            Slett konto
          </button>
        ) : (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Skriv inn: <strong>&quot Jeg vil slette min konto &quot</strong>{' '}
              for å bekrefte.
            </p>
            <input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Jeg vil slette min konto"
            />

            <p className="text-sm text-gray-600 mt-2">
              Skriv inn passordet ditt:
            </p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 rounded w-full"
              placeholder="Passord"
            />

            <button
              onClick={handleDeleteAccount}
              disabled={
                confirmationText !== 'Jeg vil slette min konto' ||
                !password ||
                isReauthenticating
              }
              className={`mt-2 p-2 rounded w-full ${
                confirmationText === 'Jeg vil slette min konto' && password
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isReauthenticating ? 'Bekrefter...' : 'Bekreft sletting'}
            </button>

            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="mt-2 text-blue-500 underline w-full"
            >
              Avbryt
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
