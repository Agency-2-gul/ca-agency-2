import { div } from 'framer-motion/client';
import { BsDot } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const RecepiesMostLiked = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/recepies-db/CreateRecepie');
  };
  return (
    <div className="p-4">
      <button
        onClick={handleClick}
        className="bg-orange-500 p-2 rounded-full shadow-xl text-white font-bold cursor-pointer"
      >
        NEW RECEPIE
      </button>
      <h1 className="font-bold text-xl">Utvalgte Oppskrifter</h1>
      <span className="text-gray-600 text-sm">Mest populære denne uken</span>
      <div className="mt-4 bg-white shadow-lg rounded-lg p-4 items-center max-w-[388px]">
        <div className="flex justify-between border-b-1 border-gray-200 mb-2">
          <h2 className="font-semibold">Pasta med pesto</h2>
          <span className="text-gray-500 text-sm">Frokost</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-orange-500">
          <BsDot size={24} />
          <span className="font-medium">124 kcal</span>
        </div>
      </div>
    </div>
  );
};

export default RecepiesMostLiked;
