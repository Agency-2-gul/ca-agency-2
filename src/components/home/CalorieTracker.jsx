import calorieTrackerImg from '../../assets/calorie-tracker.png';

const CalorieTracker = () => {
  return (
    <div
      className="h-[310px] bg-cover bg-center flex items-center justify-center text-white"
      style={{ backgroundImage: `url(${calorieTrackerImg})` }}
    >
      <h1 className="text-4xl font-bold drop-shadow-lg">Calorie Tracker</h1>
    </div>
  );
};

export default CalorieTracker;
