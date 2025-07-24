import React, { useState, useEffect, useRef } from 'react';

const PomodoroTimer = () => {
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  // Helper to format seconds into mm:ss
  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  // Handle switching modes
  const switchMode = (newMode) => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(newMode === 'pomodoro' ? 25 * 60 : 5 * 60);
  };

  // Handle timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4 bg-white rounded-2xl shadow-lg max-w-sm mx-auto">
      <h2 className="text-2xl font-bold">
        {mode === 'pomodoro' ? 'Focus Session' : 'Break Time'}
      </h2>
      <div className="text-6xl font-mono text-red-600">{formatTime(timeLeft)}</div>

      <div className="flex gap-2">
        <button
          onClick={() => setIsRunning((prev) => !prev)}
          className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            clearInterval(timerRef.current);
            setTimeLeft(mode === 'pomodoro' ? 25 * 60 : 5 * 60);
          }}
          className="px-4 py-2 bg-gray-400 text-white rounded-xl hover:bg-gray-500"
        >
          Reset
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => switchMode('pomodoro')}
          className={`px-3 py-1 rounded-lg ${
            mode === 'pomodoro' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Pomodoro
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`px-3 py-1 rounded-lg ${
            mode === 'break' ? 'bg-blue-600 text-white' : 'bg-gray-200'
          }`}
        >
          Break
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
