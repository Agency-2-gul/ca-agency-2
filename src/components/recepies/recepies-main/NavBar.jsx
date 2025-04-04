const NavBar = ({ setActiveTab, activeTab }) => {
  return (
    <div className="flex justify-around p-2 rounded-lg ">
      <button
        className={`p-2 transition-all duration-150  ${activeTab === 'all' ? 'border-b-2 border-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('all')}
      >
        Alle
      </button>
      <button
        className={`p-2 transition-all duration-150 ${activeTab === 'mostLiked' ? 'border-b-2 border-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('mostLiked')}
      >
        Mest Likt
      </button>
      <button
        className={`p-2 transition-all duration-150 ${activeTab === 'newest' ? 'border-b-2 border-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('newest')}
      >
        Nyeste
      </button>
      <button
        className={`p-2 transition-all duration-150 ${activeTab === 'myRecepies' ? 'border-b-2 border-orange-500 font-bold' : 'text-gray-500'}`}
        onClick={() => setActiveTab('myRecepies')}
      >
        Mine Oppskrifter
      </button>
    </div>
  );
};

export default NavBar;
