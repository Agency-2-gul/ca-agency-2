const MacroProgressBar = ({ label, current, goal, color }) => {
  const percent = Math.min((current / goal) * 100, 100);

  return (
    <div className="flex flex-col items-center w-full max-w-[100px]">
      <p className="font-semibold text-sm text-gray-700 mb-1">{label}</p>
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{ width: `${percent}%`, backgroundColor: color }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {current}/{goal}g
      </p>
    </div>
  );
};

export default MacroProgressBar;
