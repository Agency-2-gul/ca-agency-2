import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import FirebaseLogin from './FirebaseLogin';
import FirebaseRegister from './FirebaseRegister';
import videoBg from '../assets/bakvid.mp4';

const FirebaseAuth = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const [isRegistering, setIsRegistering] = useState(() => {
    const verificationInProgress =
      localStorage.getItem('verificationSent') === 'true';
    const isVerified = localStorage.getItem('verified') === 'true';
    const isDeleted = localStorage.getItem('userDeleted') === 'true';

    return verificationInProgress || isVerified || isDeleted || true;
  });

  useEffect(() => {
    if (!user || (user && !user.emailVerified)) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <video
          autoPlay
          loop
          muted
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={videoBg} type="video/mp4" />
          Din nettleser støtter ikke videoelementet.
        </video>

        <div className="absolute inset-0 bg-black/75"></div>
        <div className="relative bg-white/85 bg-opacity-80 p-6 rounded-lg shadow-lg w-md">
          {isRegistering ? (
            <FirebaseRegister setIsRegistering={setIsRegistering} />
          ) : (
            <FirebaseLogin setIsRegistering={setIsRegistering} />
          )}
        </div>
      </div>
    )
  );
};

export default FirebaseAuth;
