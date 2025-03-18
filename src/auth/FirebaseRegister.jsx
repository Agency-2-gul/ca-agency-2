import { useState } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const FirebaseRegister = ({ setIsRegistering }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleRegister = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    setLoading(true); 
    setError("");
    setSuccess("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess("Registrering vellykket! Du er nå logget inn.");

      console.log("User registered:", userCredential.user); 

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
      <h2 className="text-xl font-bold mb-4">Registrer</h2>

      {success && <p className="text-green-500">{success}</p>}
      
      {error && <p className="text-red-500">{error}</p>}

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


        <button type="submit" className="bg-black text-white p-2 rounded" disabled={loading}>
          {loading ? "Registrerer..." : "Registrer"}
        </button>
      </form>

      <p className="mt-4">
        Har du allerede en kånto?{" "}
        <button onClick={() => setIsRegistering(false)} className="text-blue-500 underline">
          Logg inn
        </button>
      </p>
    </div>
  );
};

export default FirebaseRegister;