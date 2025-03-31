import RecepiesMostLiked from '../components/recepies/RecepiesMostLiked';
import SearchRecepie from '../components/recepies/SearchRecepie';
import NewestRecepies from '../components/recepies/NewestRecepies';
import MyRecepies from '../components/recepies/MyRecepies';
const Recipes = () => {
  return (
    <div className="flex flex-col gap-y-16">
      <div className="space-y-4">
        <SearchRecepie />
        <RecepiesMostLiked />
      </div>
      <NewestRecepies />
      <MyRecepies />
    </div>
  );
};

export default Recipes;
