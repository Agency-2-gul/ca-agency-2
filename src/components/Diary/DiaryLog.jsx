import { useNavigate } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa';
import { FaMinus } from 'react-icons/fa';

const DiaryLog = () => {
  const navigate = useNavigate();

  const meals = [
    { name: 'Frokost', recommended: '300-500', logged: 0 },
    { name: 'Lunsj', recommended: '750-1150', logged: 0 },
    { name: 'Middag', recommended: '1060-1480', logged: 0 },
    { name: 'Snacks', recommended: '200', logged: 0 },
    { name: 'Kvelds', recommended: '200', logged: 0 },
  ];

  return (
    <div className="space-y-4 p-4">
      {meals.map((meal, index) => (
        <div key={index} className="">
          {/* Meal Header */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md cursor-pointer">
            <div>
              <p className="text-xs text-gray-500">
                Anbefalt: {meal.recommended} kcal
              </p>
              <h2 className="text-lg font-semibold">{meal.name}</h2>
              <p className="text-orange-500 font-medium">{meal.logged} kcal</p>
            </div>
            <button
              className="bg-transparent text-orange-500 hover:bg-orange-100 p-2 rounded-full transition"
              onClick={() => navigate(`/log-products/${index}`)}
            >
              <FaPlus />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DiaryLog;
