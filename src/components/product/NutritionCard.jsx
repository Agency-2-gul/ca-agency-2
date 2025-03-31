import {
  FaAppleAlt,
  FaFireAlt,
  FaDrumstickBite,
  FaBreadSlice,
} from 'react-icons/fa';

const iconMap = {
  Kalorier: <FaFireAlt className="text-orange-500" />,
  Protein: <FaDrumstickBite className="text-orange-500" />,
  Fett: <FaAppleAlt className="text-orange-500" />,
  Karbohydrater: <FaBreadSlice className="text-orange-500" />,
};

const NutritionCard = ({ nutrition }) => {
  if (!nutrition || nutrition.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 space-y-2">
      <h3 className="text-lg font-semibold text-center text-gray-700 pb-4">
        Næringsinnhold per 100g/100ml
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {nutrition.map(({ display_name, amount, unit }) => (
          <div
            key={display_name}
            className="flex items-center justify-between bg-orange-50 px-3 py-2 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
              {iconMap[display_name] || (
                <FaAppleAlt className="text-orange-400" />
              )}
              {display_name}
            </div>
            <div className="text-sm font-semibold text-gray-900">
              {amount} {unit}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionCard;
