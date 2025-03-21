import calorieTrackerImg from '../../assets/calorie-tracker.png';
import CalorieProgress from './CalorieProgressCircle';
import { FaFontAwesomeFlag } from 'react-icons/fa';
import { FaAppleAlt } from 'react-icons/fa';
import { FaGlassWater } from 'react-icons/fa6';

const CalorieTracker = () => {
  return (
    <div
      className="h-[310px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${calorieTrackerImg})` }}
    >
      <div
        className="h-[200px] w-full mx-4 flex items-center justify-start rounded-xl shadow-md -mt-6"
        style={{ backgroundColor: '#F7F7F7' }}
      >
        <div>
          <CalorieProgress totalCalories={2800} consumedCalories={2362} />
        </div>
        {/* Right Side: Text Content */}
        <div
          className="flex flex-col justify-center ml-auto mr-10 space-y-3 relative top-4 text-sm"
          style={{ color: '#333333' }}
        >
          {/* Grunnmål */}
          <div className="flex flex-row items-center gap-2">
            <span className="text-gray-500">
              <FaFontAwesomeFlag size={24} />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-medium">Grunnmål</p>
              <p className="font-bold">2800</p>
            </div>
          </div>

          {/* Mat */}
          <div className="flex flex-row items-center gap-2">
            <span className="text-gray-500">
              <FaAppleAlt size={24} />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-medium">Mat</p>
              <p className="font-bold">2362</p>
            </div>
          </div>

          {/* Vann */}
          <div className="flex flex-row items-center gap-2">
            <span className="text-gray-500">
              <FaGlassWater size={23} />
            </span>
            <div className="flex flex-col items-start">
              <p className="font-medium">Vann</p>
              <p className="font-bold">1L</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;
