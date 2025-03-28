import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import LogModal from '../footer/LogModal';
import BarcodeScanner from '../ean-scan/BarcodeScanner';
import WeightLogger from '../weight-tracker/WeightLogger';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showWeightLogger, setShowWeightLogger] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex justify-between items-center">
        {/* Mobile/Tablet View */}
        <div className="md:hidden w-full flex justify-center">
          <img src={logo} alt="Logo" className="h-10" />
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex justify-between items-center w-full">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-12 mr-6" />
          </Link>

          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="font-medium text-gray-800 hover:text-orange-500 transition"
            >
              Oversikt
            </Link>
            <Link
              to="/diary"
              className="font-medium text-gray-800 hover:text-orange-500 transition"
            >
              Dagbok
            </Link>
            <Link
              to="/recipes"
              className="font-medium text-gray-800 hover:text-orange-500 transition"
            >
              Oppskrifter
            </Link>
            <Link
              to="/profile"
              className="font-medium text-gray-800 hover:text-orange-500 transition"
            >
              Profil
            </Link>

            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                onMouseEnter={() => setShowDropdown(true)}
                className="font-medium text-gray-800 hover:text-orange-500 transition cursor-pointer"
              >
                Logg her ▾
              </button>

              {showDropdown && (
                <div
                  onMouseLeave={() => setShowDropdown(false)}
                  className="absolute right-0 top-full mt-2 bg-white border rounded shadow-lg p-4 space-y-3 z-50 min-w-[220px]"
                >
                  <button
                    onClick={() => setShowLogModal(true)}
                    className="block w-full text-left hover:text-orange-600 font-medium cursor-pointer"
                  >
                    Logg mat
                  </button>
                  <button
                    onClick={() => setShowScanner(true)}
                    className="block w-full text-left hover:text-orange-600 font-medium cursor-pointer"
                  >
                    Strekkodeskanning
                  </button>
                  <button
                    onClick={() => setShowWeightLogger(true)}
                    className="block w-full text-left hover:text-orange-600 font-medium cursor-pointer"
                  >
                    Logg vekt
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {showLogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <LogModal
            isModalOpen={showLogModal}
            setIsModalOpen={setShowLogModal}
          />
        </div>
      )}

      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <BarcodeScanner
            onClose={() => setShowScanner(false)}
            onScanSuccess={() => setShowScanner(false)}
          />
        </div>
      )}

      {showWeightLogger && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-xl">
            <WeightLogger defaultOpen />
            <button
              onClick={() => setShowWeightLogger(false)}
              className="mt-4 text-sm text-gray-600 hover:text-red-500"
            >
              Lukk
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
