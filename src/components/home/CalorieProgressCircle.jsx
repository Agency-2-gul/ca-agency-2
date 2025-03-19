import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const CalorieProgress = ({ totalCalories, consumedCalories }) => {
  const remainingCalories = totalCalories - consumedCalories;
  const percentage = (consumedCalories / totalCalories) * 100; // Calculate based on consumed

  return (
    <div className="flex flex-col items-center p-4 rounded-xl">
      <h2 className="text-lg font-bold text-primary-text">Kalorier</h2>
      <div
        className="relative w-24 h-24"
        style={{ width: '120px', height: '120px' }}
      >
        {/* Progress Circle (Orange for consumed, Grey for remaining) */}
        <CircularProgressbar
          value={percentage}
          text={remainingCalories} // Display remaining calories
          styles={buildStyles({
            textColor: '#333333',
            pathColor: '#F67B39', // Orange for consumed calories
            trailColor: '#E5E5E5', // Grey for remaining calories
          })}
        />
        {/* "Gjenstående" Text Below the Number */}
        <p className="absolute bottom-[30%] left-1/2 -translate-x-1/2 text-xs text-primary-text">
          Gjenstående
        </p>
      </div>
    </div>
  );
};

export default CalorieProgress;
