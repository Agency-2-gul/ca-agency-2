import { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signOut, signInWithEmailAndPassword, deleteUser } from "firebase/auth";

const FirebaseRegister = ({ setIsRegistering }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [userToDelete, setUserToDelete] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      setVerificationSent(true);
      setUserToDelete({ email, password });

      await signOut(auth);

      const countdown = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && userToDelete) {
      const auth = getAuth();
      
      signInWithEmailAndPassword(auth, userToDelete.email, userToDelete.password)
        .then((userCredential) => {
          const user = userCredential.user;
          return deleteUser(user);
        })
        .then(() => console.log("User deleted due to non-verification"))
        .catch((err) => console.error("Error deleting user:", err));
    }
  }, [timeLeft, userToDelete]);

  const progress = (timeLeft / 600) * 100;
  const strokeDasharray = `${progress} ${100 - progress}`;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Registrer</h2>

      {error && <p className="text-red-500">{error}</p>}

      {verificationSent ? (
        <div className="text-center">
          <p className="text-blue-500 font-semibold">
            Gå til din mail og klikk på verifiseringslenken for å aktivere kontoen din.
          </p>
          <p className="mt-2 text-red-500">
            Du har {Math.floor(timeLeft / 60)} minutter og {timeLeft % 60} sekunder igjen før kontoen slettes.
          </p>

          <div className="flex justify-center mt-4">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#e0e0e0"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#ff0000"
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset="25"
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="55" fontSize="16" textAnchor="middle" fill="black">
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
              </text>
            </svg>
          </div>

          <p className="mt-4">
            Har du verifisert brukeren din?{" "}
            <button onClick={() => setIsRegistering(false)} className="text-blue-500 underline">
              Logg inn her
            </button>
          </p>
        </div>
      ) : (
        <form onSubmit={handleRegister} className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-2"
            required
          />
          <input
            type="password"
            placeholder="Passord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 mb-2"
            required
          />

          <button type="submit" className="bg-black text-white p-2 rounded mb-2">
            Registrer
          </button>

          <button
            onClick={() => setIsRegistering(false)}
            className="text-blue-500 underline text-center"
          >
            Har du allerde en bruker? Logg inn her
          </button>
        </form>
      )}
    </div>
  );
};

export default FirebaseRegister;