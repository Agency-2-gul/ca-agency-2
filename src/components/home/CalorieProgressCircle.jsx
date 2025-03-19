import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CalorieProgress = ({ totalCalories, consumedCalories }) => {
  const remainingCalories = totalCalories - consumedCalories;
  const percentage = (remainingCalories / totalCalories) * 100;

  return (
    <div className="flex flex-col items-center p-4 rounded-xl">
      <h2 className="text-lg font-bold text-primary-text">Kalorier</h2>
      <div
        className="relative w-24 h-24"
        style={{ width: '120px', height: '120px' }}
      >
        {/* Progress Circle */}
        <CircularProgressbar
          value={percentage}
          text={''} // Empty text, we will position it manually
          styles={buildStyles({
            textColor: '#333333',
            pathColor: '#F67B39',
            trailColor: '#F7F7F7',
          })}
        />
        {/* Remaining Calories (Moves Up Slightly) */}
        <p className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-red-500">
          {remainingCalories}
        </p>
        {/* "Gjenstående" Text (Moves Down Slightly) */}
        <p className="absolute bottom-[30%] left-1/2 -translate-x-1/2 text-xs text-primary-text">
          Gjenstående
        </p>
      </div>
    </div>
  );
};

export default CalorieProgress;
