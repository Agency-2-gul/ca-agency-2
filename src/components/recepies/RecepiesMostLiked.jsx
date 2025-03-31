import { div } from 'framer-motion/client';
import { BsDot } from 'react-icons/bs';

const RecepiesMostLiked = () => {
  return (
    <div className="p-4">
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
