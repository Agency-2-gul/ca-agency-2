import calorieTrackerImg from '../../assets/calorie-tracker.png';
import CalorieProgress from './CalorieProgressCircle';

const CalorieTracker = () => {
  return (
    <div
      className="h-[310px] bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${calorieTrackerImg})` }}
    >
      <div className="bg-primary-bg" h-96 w-96>
        <CalorieProgress totalCalories={2000} consumedCalories={1500} />
      </div>
    </div>
  );
};

export default CalorieTracker;
