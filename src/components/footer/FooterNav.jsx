import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import FooterPopup from './FooterPopup';
import { BiSolidPieChartAlt2 } from 'react-icons/bi';
import { FaBook } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';
import { FaBookOpenReader } from 'react-icons/fa6';
import { CgProfile } from 'react-icons/cg';

export default function FooterNav() {
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <>
      {isOpen && <FooterPopup isOpen={isOpen} setIsOpen={setIsOpen} />}

      {/* Mobile/Tablet Footer (Sticky, hidden on desktop) */}
      <div className="block md:hidden">
        <div className="fixed bottom-0 left-0 w-full bg-white z-30">
          <div className="footer">
            <Link className="icon-div" to="/">
              <BiSolidPieChartAlt2 className="icon circular-icon" />
              <span className="icon-text">Oversikt</span>
            </Link>

            <Link className="icon-div" to="/diary">
              <FaBookOpenReader className="icon" />
              <span className="icon-text">Dagbok</span>
            </Link>

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
                className={`center-icon transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}
                style={{ fill: 'url(#gradientId)' }}
              />
            </div>

            <Link className="icon-div" to="/recipes">
              <FaBook className="icon icon-stroke" />
              <span className="icon-text">Oppskrifter</span>
            </Link>

            <Link className="icon-div" to="/profile">
              <CgProfile className="icon icon-stroke circular-icon" />
              <span className="icon-text">Profil</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Footer */}
      <div className="hidden md:flex justify-center items-center py-4 text-sm text-gray-500 shadow-lg'">
        <p className="text-center">
          &copy; {new Date().getFullYear()} Matboksen – Agency-gruppe-gul
        </p>
      </div>
    </>
  );
}
