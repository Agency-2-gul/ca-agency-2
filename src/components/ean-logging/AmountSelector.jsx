import { useRef } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

/**
 * Combined component for selecting amount (handles both liquid and solid products)
 */
const AmountSelector = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  unit = 'g',
  isLiquid = false,
}) => {
  const intervalRef = useRef(null);

  // Handlers for continuous increment/decrement
  const startContinuousChange = (type) => {
    clearInterval(intervalRef.current);
    const change = () => {
      onChange((prev) => {
        const next =
          type === 'inc'
            ? Math.min(prev + step, max)
            : Math.max(prev - step, min);
        return next;
      });
    };
    change();
    intervalRef.current = setInterval(change, 150);
  };

  const stopContinuousChange = () => clearInterval(intervalRef.current);

  const handleInputChange = (e) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      onChange(Math.min(Math.max(val, min), max));
    }
  };

  // Liquid products use a dropdown
  if (isLiquid) {
    const generateOptions = () => {
      const options = [];
      for (let i = min; i <= max; i += step) {
        options.push(i);
      }
      return options;
    };

    return (
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full p-3 rounded-xl border-2 border-orange-300 text-center text-lg"
        aria-label={`Select amount in ${unit}`}
      >
        {generateOptions().map((val) => (
          <option key={val} value={val}>
            {val} {unit}
          </option>
        ))}
      </select>
    );
  }

  // Solid products use +/- buttons with numeric input
  return (
    <div className="flex items-center justify-center gap-4">
      <button
        onMouseDown={() => startContinuousChange('dec')}
        onMouseUp={stopContinuousChange}
        onMouseLeave={stopContinuousChange}
        onTouchStart={() => startContinuousChange('dec')}
        onTouchEnd={stopContinuousChange}
        className="p-3 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
        aria-label="Decrease amount"
      >
        <FaMinus />
      </button>

      <input
        type="number"
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={handleInputChange}
        className="w-[100px] text-center text-lg font-medium border-2 border-orange-300 rounded-xl px-3 py-2"
        aria-label={`Amount in ${unit}`}
      />

      <button
        onMouseDown={() => startContinuousChange('inc')}
        onMouseUp={stopContinuousChange}
        onMouseLeave={stopContinuousChange}
        onTouchStart={() => startContinuousChange('inc')}
        onTouchEnd={stopContinuousChange}
        className="p-3 rounded-full bg-orange-100 text-orange-600 hover:bg-orange-200"
        aria-label="Increase amount"
      >
        <FaPlus />
      </button>
    </div>
  );
};

export default AmountSelector;
