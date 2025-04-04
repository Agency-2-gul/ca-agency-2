const NavBar = ({ setActiveTab, activeTab }) => {
  return (
    <div className="flex justify-around p-2 rounded-lg ">
      <button
        className={`p-2 ${activeTab === 'all' ? 'text-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('all')}
      >
        Alle
      </button>
      <button
        className={`p-2 ${activeTab === 'mostLiked' ? 'text-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('mostLiked')}
      >
        Mest Likt
      </button>
      <button
        className={`p-2 ${activeTab === 'newest' ? 'text-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('newest')}
      >
        Nyeste
      </button>
      <button
        className={`p-2 ${activeTab === 'myRecepies' ? 'text-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('myRecepies')}
      >
        Mine Oppskrifter
      </button>
    </div>
  );
};

export default NavBar;
