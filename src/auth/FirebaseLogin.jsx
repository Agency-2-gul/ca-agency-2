import { useState } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import FirebaseForgotPassword from "./FirebaseForgotPassword";

const FirebaseLogin = ({ setIsRegistering }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Din e-post er ikke bekreftet. Sjekk mailen din for verifisering.");
        await signOut(auth);
        setLoading(false);
        return;
      }

      setSuccess("Innlogging vellykket!");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Logg inn</h2>

      {success && <p className="text-green-500">{success}</p>}
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleLogin} className="flex flex-col">
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

        <button type="submit" className="bg-black text-white p-2 rounded cursor-pointer" disabled={loading}>
          {loading ? "Logger inn..." : "Logg inn"}
        </button>
      </form>

      <button onClick={() => setShowForgotPassword(true)} className="text-blue-500 underline mt-2 cursor-pointer">
        Glemt passord?
      </button>

      <p className="mt-4">
        Har du ingen konto?{" "}
        <button onClick={() => setIsRegistering(true)} className="text-blue-500 underline cursor-pointer">
          Registrer deg her
        </button>
      </p>

      {showForgotPassword && <FirebaseForgotPassword setShowForgotPassword={setShowForgotPassword} />}
    </div>
  );
};

export default FirebaseLogin;