import { useState } from 'react';
import RecepiesMostLiked from '../components/recepies/recepies-main/RecepiesMostLiked';
import SearchRecepie from '../components/recepies/recepies-main/SearchRecepie';
import NewestRecepies from '../components/recepies/recepies-main/NewestRecepies';
import MyRecepies from '../components/recepies/recepies-main/MyRecepies';
import NavBar from '../components/recepies/recepies-main/NavBar';
import AllRecepies from '../components/recepies/recepies-main/AllRecepies';
import NewRecepieButton from '../components/recepies/recepies-main/NewRecepieLink';

const Recipes = () => {
  const [activeTab, setActiveTab] = useState('mostLiked'); // Default tab

  const renderContent = () => {
    switch (activeTab) {
      case 'all':
        return <AllRecepies />;
      case 'mostLiked':
        return <RecepiesMostLiked />;
      case 'newest':
        return <NewestRecepies />;
      case 'myRecepies':
        return <MyRecepies />;
      default:
        return <RecepiesMostLiked />;
    }
  };

  return (
    <div className="flex flex-col gap-y-8">
      <div className="space-y-4 ">
        <SearchRecepie />
        <NavBar setActiveTab={setActiveTab} activeTab={activeTab} />
        <NewRecepieButton />
      </div>
      {renderContent()}
    </div>
  );
};

export default Recipes;
