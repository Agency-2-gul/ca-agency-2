import { useState } from 'react';
import {
  getAuth,
  signOut,
  deleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt, FaTrash } from 'react-icons/fa';

const AccountManagement = ({ user, setError }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [password, setPassword] = useState('');
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await signOut(auth);
      navigate('/');
    } catch (err) {
      console.error('Logout error:', err);
      setError('Kunne ikke logge ut. Prøv igjen senere.');
    } finally {
      setLoading(false);
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
      console.error('Delete account error:', err);

      if (err.code === 'auth/wrong-password') {
        setError('Feil passord. Vennligst prøv igjen.');
      } else {
        setError('Kunne ikke slette brukeren. Prøv igjen senere.');
      }
    } finally {
      setIsReauthenticating(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="space-y-6">
        {/* Logout section */}
        <div>
          <div className="flex items-center mb-4">
            <FaSignOutAlt className="text-[#E64D20] mr-2" />
            <h3 className="text-lg font-semibold">Logg ut</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Logg ut av din konto på denne enheten.
          </p>
          <button
            onClick={handleLogout}
            disabled={loading}
            className="bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white py-2 px-4 rounded-lg font-medium hover:from-[#d13f18] hover:to-[#e56425] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? 'Logger ut...' : 'Logg ut'}
          </button>
        </div>

        {/* Delete account section */}
        <div className="border-t pt-6">
          <div className="flex items-center mb-4">
            <FaTrash className="text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-600">Slett konto</h3>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            Når du sletter kontoen din, fjernes alle dine personlige data
            permanent. Denne handlingen kan ikke angres.
          </p>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors cursor-pointer"
            >
              Slett konto
            </button>
          ) : (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600 font-medium mb-3">
                Skriv inn: <strong>&quot;Jeg vil slette min konto&quot;</strong>{' '}
                for å bekrefte.
              </p>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                className="w-full p-2 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
                placeholder="Jeg vil slette min konto"
              />

              <p className="text-sm text-red-600 font-medium mb-1">
                Skriv inn passordet ditt:
              </p>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-red-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent mb-3"
                placeholder="Passord"
              />

              <div className="flex space-x-3">
                <button
                  onClick={handleDeleteAccount}
                  disabled={
                    confirmationText !== 'Jeg vil slette min konto' ||
                    !password ||
                    isReauthenticating
                  }
                  className="bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isReauthenticating ? 'Bekrefter...' : 'Bekreft sletting'}
                </button>

                <button
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setConfirmationText('');
                    setPassword('');
                  }}
                  className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors cursor-pointer"
                >
                  Avbryt
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountManagement;
