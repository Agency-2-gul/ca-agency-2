import RecepiesMostLiked from '../components/recepies/recepies-main/RecepiesMostLiked';
import SearchRecepie from '../components/recepies/recepies-main/SearchRecepie';
import NewestRecepies from '../components/recepies/recepies-main/NewestRecepies';
import MyRecepies from '../components/recepies/recepies-main/MyRecepies';
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
