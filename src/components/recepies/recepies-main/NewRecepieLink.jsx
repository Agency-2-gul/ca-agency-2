import { useNavigate } from 'react-router-dom';
const NewRecepieButton = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/recepies-db/CreateRecepie');
  };
  return (
    <button
      onClick={handleClick}
      className="bg-orange-500 p-2 rounded-full shadow-xl text-white font-bold cursor-pointer"
    >
      NEW RECEPIE__Under Construction
    </button>
  );
};
export default NewRecepieButton;
