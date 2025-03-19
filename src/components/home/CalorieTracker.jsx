import calorieTrackerImg from '../../assets/calorie-tracker.png';
import CalorieProgress from './CalorieProgressCircle';

const CalorieTracker = () => {
  return (
    <div
      className="h-[310px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${calorieTrackerImg})` }}
    >
      <div className="bg-gray-200 h-[177px] w-[388px] flex items-center justify-start rounded-xl shadow-md">
        <CalorieProgress totalCalories={2000} consumedCalories={1500} />
      </div>
    </div>
  );
};

export default CalorieTracker;
