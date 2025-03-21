import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BiSolidPieChartAlt2 } from 'react-icons/bi';
import { FaBook } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';
import { BsGraphUpArrow } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';

export default function FooterNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Slide-panel*/}
      <motion.div
        className="fixed bottom-0 left-0 w-full h-[60vh] bg-white shadow-xl p-6 rounded-t-2xl transition-all z-0"
        initial={{ y: '100%' }}
        animate={{ y: isOpen ? 0 : '100%' }}
        transition={{ type: 'spring', visualDuration: 0.1, bounce: 0 }}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-4 text-xl"
        >
          ❌
        </button>
        <h2 className="text-lg font-bold">Legg til din oppskrift:</h2>
        <form action="submit">
          <div>
            <label htmlFor="title">Navn på din oppskrift</label>
            <input id="title" type="text" />
          </div>
        </form>
      </motion.div>
      {/* Footer */}
      <div className="footer z-10">
        <Link className="icon-div" to="/">
          <BiSolidPieChartAlt2 className="icon circular-icon" />
          <span className="icon-text">Oversikt</span>
        </Link>

        <Link className="icon-div" to="/recipes">
          <FaBook className="icon" />{' '}
          <span className="icon-text">Oppskrifter</span>
        </Link>
        <svg width="0" height="0" className="absolute">
          <defs>
            <linearGradient id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop stopColor="#E64D20" offset="0%" /> {/* Tailwind blue-500 */}
              <stop stopColor="#F67B39" offset="100%" />{' '}
              {/* Tailwind purple-500 */}
            </linearGradient>
          </defs>
        </svg>
        <div className="icon-div" onClick={() => setIsOpen(!isOpen)}>
          <FaCirclePlus
            className="center-icon"
            style={{ fill: 'url(#gradientId)' }}
          />
        </div>
        <div className="icon-div">
          <BsGraphUpArrow className="icon icon-stroke" />{' '}
          <span className="icon-text">Priser</span>
        </div>
        <Link className="icon-div" to="/profile">
          <CgProfile className="icon icon-stroke circular-icon" />{' '}
          <span className="icon-text">Profil</span>
        </Link>
      </div>
    </>
  );
}
