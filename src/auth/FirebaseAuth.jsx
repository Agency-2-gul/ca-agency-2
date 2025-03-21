import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import FirebaseLogin from './FirebaseLogin';
import FirebaseRegister from './FirebaseRegister';
import videoBg from '../assets/floating-greens-fruit.mp4';

const FirebaseAuth = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

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

        <div className="relative bg-white bg-opacity-80 p-6 rounded-lg shadow-lg w-96">
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
