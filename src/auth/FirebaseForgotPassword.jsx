import { useState } from 'react';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const FirebaseForgotPassword = ({ setShowForgotPassword }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Skriv inn e-posten din for å tilbakestille passordet.');
      return;
    }

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);
      setSuccess('En e-post for tilbakestilling av passord er sendt.');
    } catch (err) {
      setError(`Kunne ikke sende tilbakestillings-e-post: ${err.message}`);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <h2 className="text-xl font-bold mb-4">Tilbakestill Passord</h2>

        {success && <p className="text-green-500">{success}</p>}
        {error && <p className="text-red-500">{error}</p>}

        <form onSubmit={handlePasswordReset} className="flex flex-col">
          <input
            type="email"
            placeholder="Skriv inn e-post"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 mb-2"
            required
          />

          <button
            type="submit"
            className="bg-black text-white p-2 rounded cursor-pointer"
          >
            Send tilbakestillings-e-post
          </button>
        </form>

        <button
          onClick={() => setShowForgotPassword(false)}
          className="text-blue-500 underline mt-4 cursor-pointer"
        >
          Tilbake til innlogging
        </button>
      </div>
    </div>
  );
};

export default FirebaseForgotPassword;
