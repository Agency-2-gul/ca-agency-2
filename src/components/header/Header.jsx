import { Link } from 'react-router-dom';
import HeaderBell from './HeaderBell';

const Header = () => {
  return (
    <header className="text-white p-4 shadow-2xs ">
      <div
        id="desktop-header"
        className="items-center hidden md:flex justify-between text-black"
      >
        <h1 className="text-xl">
          <Link to="/">Matboksen</Link>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link to="/">Oversikt</Link>
            </li>
            <li>
              <Link to="/recipes">Oppskrifter</Link>
            </li>
          </ul>
        </nav>
      </div>
      <div
        id="mobile-header"
        className="flex items-center text-orange-500 justify-between md:hidden"
      >
        <Link to="/">
          <h1 className="font-bold">MB</h1>
        </Link>
        <HeaderBell />
      </div>
    </header>
  );
};

export default Header;
