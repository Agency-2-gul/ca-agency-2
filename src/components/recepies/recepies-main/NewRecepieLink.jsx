import { FaPizzaSlice } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NewRecepieButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/recepies-db/CreateRecepie');
  };
  return (
    <div className="flex justify-center items-center">
      <button
        onClick={handleClick}
        className="flex flex-col items-center bg-orange-500  p-4 rounded-lg shadow-xl text-white font-bold cursor-pointer"
      >
        <FaPizzaSlice size={20} className="text-white" />
        <span className="ml-2">Ny Oppskrift</span>
      </button>
    </div>
  );
};
export default NewRecepieButton;
