import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CalorieProgress = ({ totalCalories, consumedCalories }) => {
  const remainingCalories = totalCalories - consumedCalories;
  const percentage = (consumedCalories / totalCalories) * 100;

  return (
    <div className="flex flex-col items-start p-4 rounded-xl">
      <h2 className="text-lg font-bold text-primary-text pb-2">Kalorier</h2>
      <div
        className="relative w-24 h-24"
        style={{ width: '120px', height: '120px' }}
      >
        {/* Progress Circle */}
        <CircularProgressbar
          value={percentage}
          text={''}
          strokeWidth={6}
          styles={buildStyles({
            textColor: '#333333',
            pathColor: '#F67B39',
            trailColor: 'rgba(219, 219, 219, 0.8)',
          })}
        />
        {/* Remaining Calories Counter */}
        <p className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-primary-text">
          {remainingCalories}
        </p>
        {/* Gjenstående Text */}
        <p className="absolute bottom-[32%] left-1/2 -translate-x-1/2 text-xs text-primary-text">
          Gjenstående
        </p>
      </div>
    </div>
  );
};

export default CalorieProgress;
