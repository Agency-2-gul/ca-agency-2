import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4 hidden md:flex justify-between">
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
    </header>
  );
};

export default Header;
