import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BiSolidPieChartAlt2 } from 'react-icons/bi';
import { FaBookOpenReader, FaBook, FaCirclePlus } from 'react-icons/fa6';
import { CgProfile } from 'react-icons/cg';
import FooterPopup from './FooterPopup';

export default function FooterNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const body = document.querySelector('body');
    if (isOpen) {
      body.classList.add('overflow-hidden');
    } else {
      body.classList.remove('overflow-hidden');
    }

    return () => {
      body.classList.remove('overflow-hidden');
    };
  }, [isOpen]);

  // Helper function to check if the current path is active
  const isActive = (path) => location.pathname === path;

  return (
    <>
      {isOpen && <FooterPopup isOpen={isOpen} setIsOpen={setIsOpen} />}

      {/* Mobile/Tablet Footer */}
      <div className="block md:hidden">
        <div className="fixed bottom-0 left-0 w-full bg-white z-30">
          <div className="footer">
            <Link className="icon-div" to="/">
              <BiSolidPieChartAlt2
                className={` circular-icon ${isActive('/') ? 'text-orange-500' : 'text-gray-600'}`}
              />
              <span
                className={`icon-text ${isActive('/') ? 'text-orange-500' : ''}`}
              >
                Oversikt
              </span>
            </Link>

            <Link className="icon-div" to="/diary">
              <FaBookOpenReader
                className={`icon ${isActive('/diary') ? 'text-orange-500' : 'text-gray-600'}`}
              />
              <span
                className={`icon-text ${isActive('/diary') ? 'text-orange-500' : ''}`}
              >
                Dagbok
              </span>
            </Link>

            {/* Gradient Icon */}
            <svg width="0" height="0" className="absolute">
              <defs>
                <linearGradient
                  id="gradientId"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop stopColor="#E64D20" offset="0%" />
                  <stop stopColor="#F67B39" offset="100%" />
                </linearGradient>
              </defs>
            </svg>

            <div className="icon-div" onClick={() => setIsOpen(!isOpen)}>
              <FaCirclePlus
                className={`center-icon transition-transform duration-300 ${
                  isOpen ? 'rotate-45' : 'rotate-0'
                }`}
                style={{ fill: 'url(#gradientId)' }}
              />
            </div>

            <Link className="icon-div" to="/recipes">
              <FaBook
                className={`icon icon-stroke ${isActive('/recipes') ? 'text-orange-500' : 'text-gray-600'}`}
              />
              <span
                className={`icon-text ${isActive('/recipes') ? 'text-orange-500' : ''}`}
              >
                Oppskrifter
              </span>
            </Link>

            <Link className="icon-div" to="/profile">
              <CgProfile
                className={`icon icon-stroke circular-icon ${isActive('/profile') ? 'text-orange-500' : 'text-gray-600'}`}
              />
              <span
                className={`icon-text ${isActive('/profile') ? 'text-orange-500' : ''}`}
              >
                Profil
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:flex justify-center items-center py-4 text-sm text-gray-500 shadow-lg">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Matboksen – Agency-gruppe-gul
        </p>
      </div>
    </>
  );
}
