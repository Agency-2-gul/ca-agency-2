import CalorieTracker from '../components/calorie-tracker/CalorieTracker';
import WeightVisualization from '../components/weight-tracker/WeightVisualization';

const Home = () => {
  return (
    <div>
      <CalorieTracker />
      <WeightVisualization />
    </div>
  );
};

export default Home;
