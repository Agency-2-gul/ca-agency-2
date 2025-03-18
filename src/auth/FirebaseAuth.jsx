import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth"; 
import FirebaseLogin from "./FirebaseLogin";
import FirebaseRegister from "./FirebaseRegister";

const FirebaseAuth = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [user]);

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
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