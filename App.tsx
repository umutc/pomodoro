
import React, { useState, useEffect, useCallback, useRef } from 'react';
import TimerDisplay from './components/TimerDisplay';
import Controls from './components/Controls';
import SessionInfo from './components/SessionInfo';
import { SessionType } from './types';
import { 
  WORK_DURATION_SECONDS, 
  SHORT_BREAK_DURATION_SECONDS, 
  LONG_BREAK_DURATION_SECONDS, 
  SESSIONS_PER_CYCLE 
} from './constants';

const App: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<SessionType>(SessionType.WORK);
  const [timeLeftInSeconds, setTimeLeftInSeconds] = useState<number>(WORK_DURATION_SECONDS);
  const [timerIsActive, setTimerIsActive] = useState<boolean>(false);
  const [workSessionsCompletedInCycle, setWorkSessionsCompletedInCycle] = useState<number>(0);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playNotificationSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const now = ctx.currentTime;

      // Quick two-beep envelope for clarity without an external audio file.
      const makeBeep = (startOffset: number, frequency: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frequency, now + startOffset);

        gain.gain.setValueAtTime(0.0001, now + startOffset);
        gain.gain.exponentialRampToValueAtTime(0.25, now + startOffset + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + 0.45);

        osc.connect(gain).connect(ctx.destination);
        osc.start(now + startOffset);
        osc.stop(now + startOffset + 0.5);
      };

      makeBeep(0, 880);
      makeBeep(0.55, 660);
    } catch (err) {
      console.warn('Notification sound failed', err);
    }
  }, []);

  const handleSessionEnd = useCallback(() => {
    setTimerIsActive(false);
    playNotificationSound();

    if (currentSession === SessionType.WORK) {
      const newCompletedCount = workSessionsCompletedInCycle + 1;
      if (newCompletedCount >= SESSIONS_PER_CYCLE) {
        setCurrentSession(SessionType.LONG_BREAK);
        setTimeLeftInSeconds(LONG_BREAK_DURATION_SECONDS);
        setWorkSessionsCompletedInCycle(0);
      } else {
        setCurrentSession(SessionType.SHORT_BREAK);
        setTimeLeftInSeconds(SHORT_BREAK_DURATION_SECONDS);
        setWorkSessionsCompletedInCycle(newCompletedCount);
      }
    } else { // SessionType.SHORT_BREAK or SessionType.LONG_BREAK
      setCurrentSession(SessionType.WORK);
      setTimeLeftInSeconds(WORK_DURATION_SECONDS);
    }
  }, [currentSession, workSessionsCompletedInCycle, playNotificationSound]);

  useEffect(() => {
    return () => {
      if (audioCtxRef.current?.state !== 'closed') {
        audioCtxRef.current?.close();
      }
    };
  }, []);

  useEffect(() => {
    if (timerIsActive && timeLeftInSeconds === 0) {
      handleSessionEnd();
    }

    if (!timerIsActive || timeLeftInSeconds === 0) {
      return; 
    }

    const intervalId = setInterval(() => {
      setTimeLeftInSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timerIsActive, timeLeftInSeconds, handleSessionEnd]);

  useEffect(() => {
    const sessionName = currentSession === SessionType.WORK 
      ? `Work (${workSessionsCompletedInCycle + 1}/${SESSIONS_PER_CYCLE})` 
      : currentSession;
    const timeStr = `${String(Math.floor(timeLeftInSeconds / 60)).padStart(2, '0')}:${String(timeLeftInSeconds % 60).padStart(2, '0')}`;
    document.title = `${timeStr} - ${sessionName} | Pomodoro Timer`;
  }, [timeLeftInSeconds, currentSession, workSessionsCompletedInCycle]);


  const handleStartPause = () => {
    setTimerIsActive(prev => !prev);
  };

  const handleReset = () => {
    setTimerIsActive(false);
    switch (currentSession) {
      case SessionType.WORK:
        setTimeLeftInSeconds(WORK_DURATION_SECONDS);
        break;
      case SessionType.SHORT_BREAK:
        setTimeLeftInSeconds(SHORT_BREAK_DURATION_SECONDS);
        break;
      case SessionType.LONG_BREAK:
        setTimeLeftInSeconds(LONG_BREAK_DURATION_SECONDS);
        break;
    }
  };

  const handleSkip = () => {
    if (!timerIsActive) {
      setTimeLeftInSeconds(0); 
      setTimerIsActive(true); 
    } else {
      setTimeLeftInSeconds(0); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-8 sm:pt-12 bg-slate-900 selection:bg-emerald-500 selection:text-white">
      <header className="mb-6 sm:mb-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-100">
          Pomodoro Focus Timer
        </h1>
      </header>
      
      <main className="w-full max-w-md bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-10">
        <SessionInfo 
          currentSession={currentSession} 
          workSessionsCompletedInCycle={workSessionsCompletedInCycle} 
        />
        <TimerDisplay timeLeftInSeconds={timeLeftInSeconds} />
        <Controls 
          timerIsActive={timerIsActive}
          onStartPause={handleStartPause}
          onReset={handleReset}
          onSkip={handleSkip}
          currentSession={currentSession}
        />
      </main>

      <footer className="mt-8 sm:mt-12 text-center text-slate-500">
        <p>Inspired by the Pomodoro Technique®.</p>
        <p>Adjust durations in <code className="bg-slate-700 px-1 rounded-sm text-xs">constants.ts</code> for custom intervals.</p>
      </footer>
    </div>
  );
};

export default App;
