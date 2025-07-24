import React, { useState, useEffect } from 'react';

const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  const handleStartPause = () => setIsRunning(!isRunning);
  const handleReset = () => {
    setTimeLeft(25 * 60);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-6">Pomodoro Timer</h1>
      <div className="text-7xl font-mono mb-6">{formatTime(timeLeft)}</div>
      <div className="space-x-4">
        <button
          onClick={handleStartPause}
          className="px-6 py-2 bg-green-500 hover:bg-green-600 rounded-xl"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={handleReset}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 rounded-xl"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default PomodoroTimer;
