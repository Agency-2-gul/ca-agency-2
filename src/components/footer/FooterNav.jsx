import { Link } from 'react-router-dom';

import { BiSolidPieChartAlt2 } from 'react-icons/bi';
import { FaBook } from 'react-icons/fa';
import { FaCirclePlus } from 'react-icons/fa6';
import { BsGraphUpArrow } from 'react-icons/bs';
import { BsThreeDots } from 'react-icons/bs';

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

      <div className="icon-div">
        <FaCirclePlus className="center-icon" />
      </div>
      <div className="icon-div">
        <BsGraphUpArrow className="icon icon-stroke" />{' '}
        <span className="icon-text">Priser</span>
      </div>
      <div className="icon-div">
        <BsThreeDots className="icon icon-stroke" />{' '}
        <span className="icon-text">Mer</span>
      </div>
    </>
  );
}
