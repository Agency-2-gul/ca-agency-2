import { FaPizzaSlice } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NewRecepieButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/recepies-db/CreateRecepie');
  };
  return (
    <div className="flex h-[140px] justify-center items-center w-full bg-gradient-to-t from-[#E64D20] to-[#F67B39]">
      <div className="flex w-[184px] h-[100px] justify-center shadow-xl rounded-lg items-center bg-[#FAFAFA]">
        <button
          onClick={handleClick}
          className="flex flex-col items-center p-4 rounded-lg text-white font-bold cursor-pointer"
        >
          <FaPizzaSlice size={30} className="text-orange-500" />
          <span className="ml-2 text-[20px] text-orange-500">Ny Oppskrift</span>
        </button>
      </div>
    </div>
  );
};
export default NewRecepieButton;
