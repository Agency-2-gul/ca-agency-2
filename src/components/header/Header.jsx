import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import BarcodeScanner from '../ean-scan/BarcodeScanner';
import WeightLogger from '../weight-tracker/WeightLogger';
import WaterLogger from '../water/WaterLogger';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showWeightLogger, setShowWeightLogger] = useState(false);
  const [showWaterLogger, setShowWaterLogger] = useState(false); // Add state for WaterLogger
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // check on load
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-[1400px] mx-auto px-4 py-3 flex justify-between items-center">
        {/* Mobile/Tablet View */}
        <div className="md:hidden w-full flex justify-center">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10" />
          </Link>
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
                  <Link
                    to="/diary"
                    className="block w-full text-left hover:text-orange-600 font-medium cursor-pointer"
                  >
                    Logg manuelt
                  </Link>
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
                  <button
                    onClick={() => setShowWaterLogger(true)}
                    className="block w-full text-left hover:text-orange-600 font-medium cursor-pointer"
                  >
                    Logg vann
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center">
          <BarcodeScanner
            onClose={() => setShowScanner(false)}
            onScanSuccess={() => setShowScanner(false)}
          />
        </div>
      )}

      {showWeightLogger && isDesktop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-xl weight-modal">
            <WeightLogger isOpen={true} onToggle={() => {}} hideToggle={true} />
            <button
              onClick={() => setShowWeightLogger(false)}
              className="mt-4 text-sm text-gray-600 hover:text-red-500"
            >
              Lukk
            </button>
          </div>
        </div>
      )}

      {showWaterLogger && isDesktop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white p-6 rounded-xl shadow-xl water-modal">
            <WaterLogger isOpen={true} onToggle={() => {}} hideToggle={true} />
            <button
              onClick={() => setShowWaterLogger(false)}
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
