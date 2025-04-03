import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const MealCard = ({ meal }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-3 max-w-md transition-all">
      {/* Header (Image, Title, Calories, Plus Icon) */}
      <div className="flex items-center">
        {/* Meal Image */}
        <img
          src={meal.image}
          alt={meal.mealName}
          className="w-12 h-12 rounded-md object-cover"
        />

        {/* Meal Details */}
        <div className="flex-1 mx-3">
          <h3 className="text-sm font-semibold border-b-[1px] border-gray-300">
            {meal.mealName}
          </h3>
          <p className="text-xs text-red-500 font-bold">{meal.calories} kcal</p>
          <p className="text-xs text-gray-500">
            {meal.ingredients.slice(0, 2).join(', ')}, +{' '}
            {meal.ingredients.length} Ingredienser
          </p>
        </div>

        {/* Expand/Collapse Button */}
        <button
          className="bg-orange-500 text-white p-2 rounded-full transition-all"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <FaMinus size={12} /> : <FaPlus size={12} />}
        </button>
      </div>

      {/* Expandable Section */}
      {expanded && (
        <div className="mt-3 border-t pt-2 text-sm text-gray-700 transition-all">
          {/* Ingredients */}
          <h4 className="font-semibold">Ingredienser:</h4>
          <ul className="list-disc list-inside text-gray-600">
            {meal.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>

          {/* Steps */}
          <h4 className="font-semibold mt-2">Fremgangsmåte:</h4>
          <ol className="list-decimal list-inside text-gray-600">
            {meal.steps.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

export default MealCard;
