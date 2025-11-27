
import React from 'react';
import { SessionType } from '../types';
import { SESSIONS_PER_CYCLE } from '../constants';

interface SessionInfoProps {
  currentSession: SessionType;
  workSessionsCompletedInCycle: number;
}

const getSessionColor = (sessionType: SessionType): string => {
  switch (sessionType) {
    case SessionType.WORK:
      return 'text-red-400';
    case SessionType.SHORT_BREAK:
      return 'text-green-400';
    case SessionType.LONG_BREAK:
      return 'text-blue-400';
    default:
      return 'text-slate-300';
  }
};

const SessionInfo: React.FC<SessionInfoProps> = ({ currentSession, workSessionsCompletedInCycle }) => {
  return (
    <div className="text-center my-4">
      <h2 className={`text-3xl font-semibold ${getSessionColor(currentSession)}`}>
        {currentSession}
      </h2>
      {currentSession === SessionType.WORK && (
        <p className="text-slate-400 text-lg mt-1">
          Pomodoro: {workSessionsCompletedInCycle + 1} / {SESSIONS_PER_CYCLE}
        </p>
      )}
      <div className="flex justify-center space-x-2 mt-3">
        {Array.from({ length: SESSIONS_PER_CYCLE }).map((_, index) => (
          <div
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentSession === SessionType.WORK && index === workSessionsCompletedInCycle
                ? 'bg-emerald-500 scale-125' // Current pomodoro
                : index < workSessionsCompletedInCycle
                ? 'bg-emerald-600 opacity-50' // Completed pomodoros
                : 'bg-slate-600' // Upcoming pomodoros
            } transition-all duration-300`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SessionInfo;
