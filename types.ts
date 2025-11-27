
export enum TimerState {
  IDLE,    // Timer is stopped, ready to start or has been reset
  RUNNING, // Timer is actively counting down
  PAUSED   // Timer was running and is now paused
}

// For simplicity, using timerIsActive (boolean) in App.tsx, but SessionType is crucial.
// This TimerState might be more useful if we had distinct PAUSED vs IDLE states for button logic.
// For now, timerIsActive (true for RUNNING, false for IDLE/PAUSED) simplifies App.tsx.

export enum SessionType {
  WORK = "Work",
  SHORT_BREAK = "Short Break",
  LONG_BREAK = "Long Break"
}
