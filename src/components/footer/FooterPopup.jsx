import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import LogModal from './LogModal';
import BarcodeScanner from '../ean-scan/BarcodeScanner';
import WeightLogger from '../weight-tracker/WeightLogger';
import BarcodeIcon from '../../assets/Barcode_Icon.png';

const FooterPopup = ({ isOpen, setIsOpen }) => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModal = () => setIsModalOpen(true);
  const [scannerOpen, setScannerOpen] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      {isModalOpen && (
        <LogModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}
      <motion.div
        className="fixed bottom-10 bg-gradient-to-t from-[#E64D20] to-[#F67B39] left-0 w-full h-[50vh] shadow-xl p-6 rounded-t-2xl transition-all z-0"
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
      >
        <div className="max-w-md mx-auto mt-2 w-full h-full flex flex-col space-y-4">
          {/* Top buttons */}
          <div className="grid grid-cols-2 gap-4">
            <button
              className="flex flex-col items-center justify-center bg-white  p-6 rounded-lg flex-grow"
              onClick={handleModal}
            >
              <span>Logg mat</span>
            </button>
            <button
              onClick={() => setScannerOpen(true)}
              className="flex flex-col items-center justify-center bg-white p-6 rounded-lg flex-grow cursor-pointer"
            >
              <img src={BarcodeIcon} alt="Barcode icon" className="mb-2" />
              <span className="text-[#E64D20]">Strekkodeskanning</span>
            </button>
          </div>

          {/* Bottom content */}
          <div className="p-3 flex flex-col gap-y-2 rounded-lg">
            <div className="flex items-center bg-[#FAFAFA] gap-3 p-4 rounded-lg">
              <span>Vann</span>
            </div>
            <WeightLogger user={user} />
          </div>
        </div>

        {/* Barcode scanner modal */}
        {scannerOpen && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded-lg max-w-sm w-full">
              <BarcodeScanner
                onClose={() => setScannerOpen(false)}
                onScanSuccess={() => {
                  setScannerOpen(false);
                  setIsOpen(false); // ✅ Close the footer popup too
                }}
              />
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default FooterPopup;
