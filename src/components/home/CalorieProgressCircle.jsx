import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import '../../main.css';

const CalorieProgress = ({ totalCalories, consumedCalories }) => {
  const remainingCalories = totalCalories - consumedCalories;
  const percentage = (consumedCalories / totalCalories) * 100;
  const idCSS = 'orangeGradient';

  return (
    <div className="relative flex flex-col items-start ml-6 rounded-xl">
      <h2 className="text-xl font-bold pb-2" style={{ color: '#333333' }}>
        Kalorier
      </h2>
      <div
        className="relative w-24 h-24 z-1"
        style={{ width: '140px', height: '140px' }}
      >
        {/* Progress Circle */}
        <CircularProgressbar
          value={percentage}
          text={''}
          strokeWidth={6}
          styles={buildStyles({
            textColor: '#333333',
            pathColor: `url(#${idCSS})`,
            trailColor: 'rgba(219, 219, 219, 0.8)',
          })}
        />
        {/* SVG Gradient Definition */}
        <svg style={{ height: 0 }}>
          <defs>
            <linearGradient id={idCSS} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#E64D20" />
              <stop offset="77%" stopColor="#F67B39" />
            </linearGradient>
          </defs>
        </svg>
        {/* Remaining Calories Counter */}
        <p
          className="absolute top-[46%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl font-bold"
          style={{ color: '#333333' }}
        >
          {remainingCalories}
        </p>
        {/* Gjenstående Text */}
        <p
          className="absolute bottom-[31%] left-1/2 -translate-x-1/2 text-sm"
          style={{ color: '#333333' }}
        >
          Gjenstående
        </p>
      </div>
    </div>
  );
};

export default CalorieProgress;
