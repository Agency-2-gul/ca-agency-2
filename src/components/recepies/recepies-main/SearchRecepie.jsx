import { FaSearch } from 'react-icons/fa';
import calorieTrackerImg from '../../../assets/calorie-tracker.png';
import NavBar from './NavBar';

const SearchRecepie = () => {
  return (
    <>
      <div
        className="flex items-center justify-center w-full h-12 bg p-2"
        style={{ backgroundImage: `url(${calorieTrackerImg})` }}
      >
        <input
          type="text"
          placeholder=" Søk etter Oppskrifter"
          className="bg-[#FAFAFA] rounded-lg w-[310px] h-[22px] outline-none p-2 text-sm text-gray-500 placeholder:text-gray-400 focus:outline-none"
        />
      </div>
      <NavBar />
    </>
  );
};

export default SearchRecepie;
