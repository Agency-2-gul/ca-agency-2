const NavBar = ({ setActiveTab, activeTab }) => {
  return (
    <div className="flex justify-around p-2 rounded-lg ">
      <button
        className={`p-2 ${activeTab === 'mostLiked' ? 'text-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('mostLiked')}
      >
        Most Liked
      </button>
      <button
        className={`p-2 ${activeTab === 'newest' ? 'text-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('newest')}
      >
        Newest
      </button>
      <button
        className={`p-2 ${activeTab === 'myRecepies' ? 'text-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('myRecepies')}
      >
        My Recipes
      </button>
    </div>
  );
};

export default NavBar;
