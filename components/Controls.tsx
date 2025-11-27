
import React from 'react';
import { SessionType } from '../types';

interface ControlsProps {
  timerIsActive: boolean;
  onStartPause: () => void;
  onReset: () => void;
  onSkip: () => void;
  currentSession: SessionType; 
}

const Controls: React.FC<ControlsProps> = ({ timerIsActive, onStartPause, onReset, onSkip, currentSession }) => {
  const baseButtonClass = "px-6 py-3 text-lg font-medium rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-150 ease-in-out";
  const primaryButtonClass = timerIsActive 
    ? `${baseButtonClass} bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400`
    : `${baseButtonClass} bg-emerald-500 hover:bg-emerald-600 text-white focus:ring-emerald-400`;
  
  const secondaryButtonClass = `${baseButtonClass} bg-slate-600 hover:bg-slate-700 text-slate-100 focus:ring-slate-500`;

  return (
    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 my-8">
      <button
        onClick={onStartPause}
        className={`${primaryButtonClass} w-full sm:w-auto min-w-[120px]`}
      >
        {timerIsActive ? 'Pause' : 'Start'}
      </button>
      <button
        onClick={onReset}
        className={`${secondaryButtonClass} w-full sm:w-auto`}
        disabled={timerIsActive} 
      >
        Reset
      </button>
      <button
        onClick={onSkip}
        className={`${secondaryButtonClass} w-full sm:w-auto`}
      >
        Skip
      </button>
    </div>
  );
};

export default Controls;
