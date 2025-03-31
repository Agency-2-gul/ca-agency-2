import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useLocation } from 'react-router-dom';
import LogModal from './LogModal';
import BarcodeScanner from '../ean-scan/BarcodeScanner';
import WeightLogger from '../weight-tracker/WeightLogger';
import WaterLogger from '../water/WaterLogger';
import BarcodeIcon from '../../assets/Barcode_Icon.png';

const FooterPopup = ({ isOpen, setIsOpen }) => {
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [openLogger, setOpenLogger] = useState(null); // 'weight', 'water', or null

  const handleModal = () => setIsModalOpen(true);

  const location = useLocation();
  const prevPathRef = useRef(location.pathname);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const currentPath = location.pathname;

    if (
      currentPath.startsWith('/log-products') &&
      !prevPath.startsWith('/log-products')
    ) {
      setIsOpen(false);
    }

    prevPathRef.current = currentPath;
  }, [location.pathname]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen && scannerOpen) {
      setScannerOpen(false);
    }
  }, [isOpen, scannerOpen]);

  if (!isOpen) return null;

  return (
    <>
      {isModalOpen && (
        <LogModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
      )}

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-20 bg-black/20"
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-up menu */}
      <motion.div
        className="fixed bottom-[64px] bg-gradient-to-t from-[#E64D20] to-[#F67B39] left-0 w-full max-h-[calc(100vh-64px)] h-auto shadow-xl p-6 rounded-t-2xl z-30 overflow-y-auto"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="max-w-md mx-auto mt-2 w-full flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <button
              className="flex flex-col items-center justify-center bg-white p-6 rounded-lg flex-grow cursor-pointer"
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

          <div className="p-3 flex flex-col gap-y-2 rounded-lg">
            <WaterLogger
              isOpen={openLogger === 'water'}
              onToggle={() =>
                setOpenLogger((prev) => (prev === 'water' ? null : 'water'))
              }
            />
            <WeightLogger
              isOpen={openLogger === 'weight'}
              onToggle={() =>
                setOpenLogger((prev) => (prev === 'weight' ? null : 'weight'))
              }
            />
          </div>
        </div>
      </motion.div>

      {/* Barcode Scanner */}
      {scannerOpen && (
        <div className="fixed inset-0 z-[999] bg-black/80 flex items-center justify-center">
          <BarcodeScanner
            onClose={() => setScannerOpen(false)}
            onScanSuccess={() => {
              setScannerOpen(false);
              setIsOpen(false);
            }}
          />
        </div>
      )}
    </>
  );
};

export default FooterPopup;
