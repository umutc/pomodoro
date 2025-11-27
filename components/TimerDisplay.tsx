
import React from 'react';

interface TimerDisplayProps {
  timeLeftInSeconds: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeLeftInSeconds }) => {
  return (
    <div className="text-8xl font-bold my-8 text-center text-emerald-400 tabular-nums">
      {formatTime(timeLeftInSeconds)}
    </div>
  );
};

export default TimerDisplay;
