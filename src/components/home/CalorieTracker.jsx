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
      <div className="bg-gray-200 h-[177px] w-full mx-4 flex items-center justify-start rounded-xl shadow-md">
        <div>
          <CalorieProgress totalCalories={2800} consumedCalories={2362} />
        </div>
        {/* Right Side: Text Content */}
        <div
          className="flex flex-col justify-center ml-auto mr-4 space-y-3 relative top-3"
          style={{ color: '#333333' }}
        >
          <div className="flex items-center gap-3">
            <span className="text-gray-500">
              <FaFontAwesomeFlag />
            </span>
            <p className="font-medium">Grunnmål</p>
            <p className="ml-auto font-bold">2800</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-500">
              <FaAppleAlt />
            </span>
            <p className="font-medium">Mat</p>
            <p className="ml-auto font-bold">2362</p>
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">
                <FaGlassWater />
              </span>
              <p className="font-medium">Vann</p>
            </div>
            <p className="font-bold pl-3">1L</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalorieTracker;
