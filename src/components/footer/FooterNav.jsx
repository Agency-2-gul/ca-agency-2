import { Link } from 'react-router-dom';

import { BiSolidPieChartAlt2 } from 'react-icons/bi';
import { FaBook } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';
import { BsGraphUpArrow } from 'react-icons/bs';
import { CgProfile } from 'react-icons/cg';

export default function FooterNav() {
  return (
    <>
      <Link className="icon-div" to="/">
        <BiSolidPieChartAlt2 className="icon" />
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
      <div className="icon-div">
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
        <CgProfile className="icon icon-stroke" />{' '}
        <span className="icon-text">Profil</span>
      </Link>
    </>
  );
}
