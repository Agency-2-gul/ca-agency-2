import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import FirebaseForgotPassword from './FirebaseForgotPassword';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const FirebaseLogin = ({ setIsRegistering }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError(
          'Din e-post er ikke bekreftet. Sjekk mailen din for verifisering.'
        );
        await signOut(auth);
        setLoading(false);
        return;
      }

      setSuccess('Innlogging vellykket!');
    } catch (err) {
      console.error('Login error:', err);
      setError('E-post eller passord er feil');
    }

    setLoading(false);
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-0 md:max-w-md lg:max-w-lg mx-auto">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center md:text-left">
          Logg inn
        </h2>

        {success && (
          <p className="text-green-500 text-sm sm:text-base">{success}</p>
        )}
        {error && <p className="text-red-500 text-sm sm:text-base">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 mb-2 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F67B39] focus:border-transparent"
          required
        />

        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-2 w-full pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F67B39] focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-gray-600"
          >
            {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
          </button>
        </div>

        <button
          type="submit"
          className="text-white w-full sm:w-[200px] mx-auto p-2 sm:p-3 rounded cursor-pointer bg-gradient-to-r from-[#E64D20] to-[#F67B39] relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed before:absolute before:inset-0 before:bg-[#E64D20] before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-in-out before:z-0"
          disabled={loading}
        >
          <span className="relative z-10">
            {loading ? 'Logger inn...' : 'Logg inn'}
          </span>
        </button>

        <p className="text-center mt-2 text-sm sm:text-base">
          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-black underline cursor-pointer hover:text-[#E64D20]"
          >
            Glemt passord?
          </button>
        </p>

        <p className="text-center text-sm sm:text-base">
          Har du ingen konto? Registrer deg
          <button
            type="button"
            onClick={() => setIsRegistering(true)}
            className="text-black underline text-center pl-1 cursor-pointer hover:text-[#E64D20]"
          >
            her
          </button>
        </p>
      </form>

      {showForgotPassword && (
        <FirebaseForgotPassword setShowForgotPassword={setShowForgotPassword} />
      )}
    </div>
  );
};

export default FirebaseLogin;
