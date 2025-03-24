import { useState } from 'react';
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import {
  FaLock,
  FaEye,
  FaEyeSlash,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';

const SecuritySettings = ({ user, setError }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError('');
    setSuccess('');

    // Validate inputs
    if (!currentPassword) {
      setError('Skriv inn nåværende passord');
      return;
    }

    if (!newPassword) {
      setError('Skriv inn nytt passord');
      return;
    }

    if (newPassword.length < 6) {
      setError('Passordet må være minst 6 tegn');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Nye passord samsvarer ikke');
      return;
    }

    setLoading(true);

    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        user.email,
        currentPassword
      );

      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      // Success
      setSuccess('Passordet ble endret');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error changing password:', err);

      if (err.code === 'auth/wrong-password') {
        setError('Nåværende passord er feil');
      } else if (err.code === 'auth/too-many-requests') {
        setError('For mange forsøk. Prøv igjen senere');
      } else {
        setError('Kunne ikke endre passord. Prøv igjen senere');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Header with toggle button */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <div className="flex items-center">
          <FaLock className="text-[#E64D20] mr-2" />
          <h3 className="text-lg font-semibold">Sikkerhetsinnstillinger</h3>
        </div>
        {isMenuOpen ? <FaChevronUp /> : <FaChevronDown />}
      </div>

      {/* Collapsible content with smooth transition */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100 p-6' : 'max-h-0 opacity-0 p-0'
        }`}
      >
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nåværende passord
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E64D20] focus:border-transparent"
                placeholder="Skriv inn nåværende passord"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nytt passord
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E64D20] focus:border-transparent"
                placeholder="Minst 6 tegn"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showNewPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bekreft nytt passord
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#E64D20] focus:border-transparent"
                placeholder="Gjenta nytt passord"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white py-2 px-4 rounded-lg font-medium hover:from-[#d13f18] hover:to-[#e56425] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Oppdaterer...
              </span>
            ) : (
              'Oppdater passord'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SecuritySettings;
