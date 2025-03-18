import { useState } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const FirebaseLogin = ({ setIsRegistering }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setLoading(true); 
    setError("");
    setSuccess("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setSuccess("Innlogging vellykket!");

      console.log("User logged in:", userCredential.user); 

      setTimeout(() => {
        setIsRegistering(false);
      }, 2000);
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

        <button type="submit" className="bg-green-500 text-white p-2 rounded" disabled={loading}>
          {loading ? "Logger inn..." : "Logg inn"}
        </button>
      </form>

      <p className="mt-4">
        Har du ingen konto?{" "}
        <button onClick={() => setIsRegistering(true)} className="text-blue-500 underline">
          Registrer
        </button>
      </p>
    </div>
  );
};

export default FirebaseLogin;