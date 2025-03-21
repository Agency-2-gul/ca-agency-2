import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  signInWithEmailAndPassword,
  deleteUser,
} from 'firebase/auth';

const FirebaseRegister = ({ setIsRegistering }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading] = useState(false);
  const [error, setError] = useState('');

  // Check localStorage for verification state and initialize timers
  const [verificationSent, setVerificationSent] = useState(() => {
    return localStorage.getItem('verificationSent') === 'true';
  });
  const [verified, setVerified] = useState(
    localStorage.getItem('verified') === 'true'
  );
  const [deleted, setDeleted] = useState(
    localStorage.getItem('userDeleted') === 'true'
  );

  // Get timer from localStorage or use default
  const defaultTime = 600;
  const [timeLeft, setTimeLeft] = useState(() => {
    const endTime = localStorage.getItem('verificationEndTime');
    if (endTime) {
      // Calculate time left based on stored end time
      const remaining = Math.max(
        0,
        Math.floor((parseInt(endTime) - Date.now()) / 1000)
      );
      return remaining || defaultTime; // Use default if calculation gives 0
    }
    return defaultTime;
  });

  // Get stored credentials
  const [userToDelete, setUserToDelete] = useState(() => {
    const storedEmail = localStorage.getItem('verificationEmail');
    const storedPassword = localStorage.getItem('verificationPassword');
    if (storedEmail && storedPassword) {
      return { email: storedEmail, password: storedPassword };
    }
    return null;
  });

  const [countdownId, setCountdownId] = useState(null);
  const [verificationIntervalId, setVerificationIntervalId] = useState(null);

  // Calculate progress for the timer circle
  const progress = 100 - (timeLeft / defaultTime) * 100;
  const strokeDashoffset = (progress * 283) / 100;

  // Cleanup function for component unmount
  useEffect(() => {
    return () => {
      if (countdownId) clearInterval(countdownId);
      if (verificationIntervalId) clearInterval(verificationIntervalId);
    };
  }, [countdownId, verificationIntervalId]);

  useEffect(() => {
    if (verificationSent && userToDelete) {
      // Start the countdown timer
      const countdown = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          // Save current end time to localStorage
          const endTime = Date.now() + (prev - 1) * 1000;
          localStorage.setItem('verificationEndTime', endTime.toString());
          return prev - 1;
        });
      }, 1000);

      setCountdownId(countdown);

      // Start verification checks
      const verificationCheck = setInterval(async () => {
        const authCheck = getAuth();
        try {
          const res = await signInWithEmailAndPassword(
            authCheck,
            userToDelete.email,
            userToDelete.password
          );
          await res.user.reload();

          if (res.user.emailVerified) {
            clearInterval(verificationCheck);
            clearInterval(countdown);

            // Update localStorage and state
            localStorage.setItem('verified', 'true');
            localStorage.removeItem('verificationSent');
            localStorage.removeItem('verificationEndTime');
            localStorage.removeItem('verificationEmail');
            localStorage.removeItem('verificationPassword');

            setVerified(true);
            setVerificationSent(false);
            await signOut(authCheck);
          } else {
            await signOut(authCheck);
          }
        } catch (err) {
          console.error('Verification check error:', err.message);
        }
      }, 5000);

      setVerificationIntervalId(verificationCheck);

      return () => {
        clearInterval(countdown);
        clearInterval(verificationCheck);
      };
    }
  }, [verificationSent, userToDelete]);

  // Handle timer expiration and user deletion
  useEffect(() => {
    if (timeLeft === 0 && userToDelete && !verified) {
      console.log('Timer expired - deleting user');

      // Clear intervals
      if (countdownId) {
        clearInterval(countdownId);
        setCountdownId(null);
      }
      if (verificationIntervalId) {
        clearInterval(verificationIntervalId);
        setVerificationIntervalId(null);
      }

      const auth = getAuth();
      signInWithEmailAndPassword(
        auth,
        userToDelete.email,
        userToDelete.password
      )
        .then((userCredential) => {
          // Double check if verified before deleting
          if (!userCredential.user.emailVerified) {
            return deleteUser(userCredential.user);
          } else {
            // User verified at the last moment
            localStorage.setItem('verified', 'true');
            setVerified(true);
            setVerificationSent(false);
            return signOut(auth);
          }
        })
        .then(() => {
          if (!verified) {
            console.log('User deleted due to non-verification');

            // Update localStorage
            localStorage.removeItem('verificationSent');
            localStorage.removeItem('verificationEndTime');
            localStorage.removeItem('verificationEmail');
            localStorage.removeItem('verificationPassword');
            localStorage.setItem('userDeleted', 'true');

            setDeleted(true);
            setVerificationSent(false);
          }
        })
        .catch((err) => {
          console.error('Error during deletion process:', err);
          // Still show deleted state even if there was an error
          localStorage.setItem('userDeleted', 'true');
          setDeleted(true);
          setVerificationSent(false);
        });
    }
  }, [timeLeft, userToDelete, verified, countdownId, verificationIntervalId]);

  // Function for the user to manually check verification
  const checkVerificationManually = async () => {
    if (!userToDelete) return;

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userToDelete.email,
        userToDelete.password
      );
      await userCredential.user.reload();

      if (userCredential.user.emailVerified) {
        if (countdownId) clearInterval(countdownId);
        if (verificationIntervalId) clearInterval(verificationIntervalId);

        // Update localStorage
        localStorage.setItem('verified', 'true');
        localStorage.removeItem('verificationSent');
        localStorage.removeItem('verificationEndTime');
        localStorage.removeItem('verificationEmail');
        localStorage.removeItem('verificationPassword');

        setVerified(true);
        setVerificationSent(false);
        await signOut(auth);
      } else {
        await signOut(auth);
        alert('E-posten er fortsatt ikke verifisert. Sjekk innboksen din.');
      }
    } catch (err) {
      console.error('Manuell verifiseringssjekk-feil:', err.message);
    }
  };

  // New function to handle incorrect email registration restart
  const handleRestartRegistration = async () => {
    if (!userToDelete) return;

    try {
      // Clear intervals
      if (countdownId) {
        clearInterval(countdownId);
        setCountdownId(null);
      }
      if (verificationIntervalId) {
        clearInterval(verificationIntervalId);
        setVerificationIntervalId(null);
      }

      const auth = getAuth();
      // Sign in with stored credentials
      const userCredential = await signInWithEmailAndPassword(
        auth,
        userToDelete.email,
        userToDelete.password
      );

      // Delete the user account
      await deleteUser(userCredential.user);
      console.log('User deleted to restart registration');

      // Clean up localStorage
      localStorage.removeItem('verificationSent');
      localStorage.removeItem('verificationEndTime');
      localStorage.removeItem('verificationEmail');
      localStorage.removeItem('verificationPassword');
      localStorage.removeItem('userDeleted');
      localStorage.removeItem('verified');

      // Reset component state
      setVerificationSent(false);
      setVerified(false);
      setDeleted(false);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setTimeLeft(defaultTime);
      setUserToDelete(null);
      setError('');
    } catch (err) {
      console.error('Error during restart registration:', err.message);

      resetRegistration();
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passordene stemmer ikke overens');
      return;
    }

    const auth = getAuth();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await sendEmailVerification(user);

      // Store verification info in localStorage
      localStorage.setItem('verificationSent', 'true');
      localStorage.setItem('verificationEmail', email);
      localStorage.setItem('verificationPassword', password);

      // Set end time for the timer
      const endTime = Date.now() + defaultTime * 1000;
      localStorage.setItem('verificationEndTime', endTime.toString());

      // Clear deletion state if present
      localStorage.removeItem('userDeleted');

      // Update component state
      setVerificationSent(true);
      setDeleted(false);
      setUserToDelete({ email, password });
      setTimeLeft(defaultTime);

      await signOut(auth);
    } catch (err) {
      setError(err.message);
    }
  };

  const resetRegistration = () => {
    // Clear intervals
    if (countdownId) {
      clearInterval(countdownId);
      setCountdownId(null);
    }
    if (verificationIntervalId) {
      clearInterval(verificationIntervalId);
      setVerificationIntervalId(null);
    }

    // Remove from localStorage
    localStorage.removeItem('userDeleted');
    localStorage.removeItem('verificationSent');
    localStorage.removeItem('verificationEndTime');
    localStorage.removeItem('verificationEmail');
    localStorage.removeItem('verificationPassword');

    // Reset state
    setDeleted(false);
    setVerified(false);
    setVerificationSent(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setTimeLeft(defaultTime);
    setUserToDelete(null);
    setError('');
  };

  return (
    <div className="w-full px-4 sm:px-6 md:px-0 md:max-w-md lg:max-w-lg mx-auto">
      {verified ? (
        <div className="text-center">
          <p className="text-green-600 font-semibold text-lg mb-4">
            Brukeren din er nå verifisert.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('verified');
              setIsRegistering(false);
            }}
            className="bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white px-4 py-2 rounded hover:from-[#d13f18] hover:to-[#e56425] transition cursor-pointer"
          >
            Gå til innlogging
          </button>
        </div>
      ) : deleted ? (
        <div className="text-center">
          <p className="text-red-600 font-semibold text-lg mb-4">
            Brukeren ble ikke verifisert og er dermed slettet.
          </p>
          <button
            onClick={resetRegistration}
            className="bg-gradient-to-r from-[#E64D20] to-[#F67B39] text-white px-4 py-2 rounded hover:from-[#d13f18] hover:to-[#e56425] transition"
          >
            Registrer deg på nytt
          </button>
        </div>
      ) : verificationSent ? (
        <div className="text-center">
          <p className="text-black font-semibold text-sm sm:text-base">
            Gå til din mail og klikk på verifiseringslenken for å aktivere
            kontoen din.
          </p>
          <div className="flex flex-col items-center mt-6">
            <svg
              width="150"
              height="150"
              viewBox="0 0 100 100"
              className="sm:w-[200px] sm:h-[200px]"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#494949"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#F67B39"
                strokeWidth="8"
                strokeDasharray="283"
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
                style={{ transition: 'stroke-dashoffset 1s linear' }}
              />
              <text
                x="50"
                y="55"
                fontSize="16"
                textAnchor="middle"
                fill="black"
              >
                {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, '0')}
              </text>
            </svg>

            <button
              onClick={checkVerificationManually}
              className="mt-6 text-black px-4 py-2 rounded transition underline cursor-pointer hover:text-[#F67B39]"
            >
              Jeg har verifisert min e-post
            </button>

            <button
              onClick={handleRestartRegistration}
              className="mt-3 text-black px-4 py-2 rounded transition underline cursor-pointer hover:text-[#F67B39]"
            >
              Jeg har registrert feil epost og vil starte registreringen på nytt
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="flex flex-col gap-4 w-full">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center md:text-left">
            Kom i gang her
          </h2>
          {error && (
            <p className="text-red-500 text-sm sm:text-base">{error}</p>
          )}
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
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Bekreft passord"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="border p-2 mb-2 w-full pr-10 rounded-md focus:outline-none focus:ring-2 focus:ring-[#F67B39] focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showConfirmPassword ? (
                <FaEye size={20} />
              ) : (
                <FaEyeSlash size={20} />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="text-white w-full sm:w-[200px] mx-auto p-2 sm:p-3 rounded cursor-pointer bg-gradient-to-r from-[#E64D20] to-[#F67B39] relative overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed before:absolute before:inset-0 before:bg-[#E64D20] before:translate-x-[-100%] hover:before:translate-x-0 before:transition-transform before:duration-300 before:ease-in-out before:z-0"
            disabled={loading}
          >
            <span className="relative z-10">
              {loading ? 'Lager...' : 'Lag en konto'}
            </span>
          </button>
          <p className="text-center text-sm sm:text-base">
            Har du allerede en bruker? Logg inn
            <button
              type="button"
              onClick={() => setIsRegistering(false)}
              className="text-black underline text-center pl-1 cursor-pointer hover:text-[#E64D20]"
            >
              her
            </button>
          </p>
        </form>
      )}
    </div>
  );
};

export default FirebaseRegister;
