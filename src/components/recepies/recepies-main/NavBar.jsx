import { useNavigate } from 'react-router-dom';
const NavBar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between mx-10">
      <p>Alle</p>
      <p>Mine Oppskrifter</p>
      <p>Utvalgte</p>
      <p>Nyeste</p>
    </nav>
  );
};
export default NavBar;
