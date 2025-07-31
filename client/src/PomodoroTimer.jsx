import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

const PomodoroTimer = () => {
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' or 'break'
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);
  const sessionStarted = useRef(false); // prevent duplicate start-session calls
  const sessionIdRef = useRef(null); // track the session_id returned by backend
  const startAudio = useRef(new Audio('/sounds/session-start.mp3'));
  const endAudio = useRef(new Audio('/sounds/session-end.mp3'));


  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const switchMode = (newMode) => {
    setIsRunning(false);
    clearInterval(timerRef.current);
    setMode(newMode);
    setTimeLeft(newMode === 'pomodoro' ? 25 * 60 : 5 * 60);
    sessionStarted.current = false;
    sessionIdRef.current = null;
  };

  const callStartSession = async () => {
    try {
      startAudio.current.play();
      const response = await fetch('http://localhost:5000/start-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: 1 }), // use real user_id if available
      });

      const data = await response.json();
      console.log('Started session:', data);

      if (data.session?.id) {
        sessionIdRef.current = data.session.id;
      }
    } catch (err) {
      console.error('Failed to start session', err);
    }
  };

  const callEndSession = async () => {
    if (!sessionIdRef.current) {
      console.warn("No session to end.");
      return;
    }

    try {
      endAudio.current.play();
      const response = await fetch('http://localhost:5000/end-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ session_id: sessionIdRef.current }),
      });

      const data = await response.json();
      console.log('Ended session:', data);

      sessionIdRef.current = null;
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

    } catch (err) {
      console.error('Failed to end session', err);
    }
  };

  useEffect(() => {
    if (isRunning) {
      if (mode === 'pomodoro' && !sessionStarted.current) {
        callStartSession();
        sessionStarted.current = true;
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === 0) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            if (mode === 'pomodoro') callEndSession();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const radius = 90;
  const stroke = 10;
  const normalizedRadius = radius - stroke * 0.5;
  const circumference = normalizedRadius * 2 * Math.PI;
  const progress =
    mode === 'pomodoro'
    ? 1 - timeLeft / (25 * 60)
    : 1 - timeLeft / (5 * 60);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 bg-white rounded-2xl shadow-2xl max-w-sm mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold">
        {mode === 'pomodoro' ? 'Focus Session' : 'Break Time'}
      </h2>
      <div className="relative w-[200px] h-[200px]">
  <svg height="200" width="200">
    <circle
      stroke="#e5e7eb"
      fill="transparent"
      strokeWidth={stroke}
      r={normalizedRadius}
      cx="100"
      cy="100"
    />
    <circle
      stroke="#ef4444"
      fill="transparent"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeDasharray={circumference + ' ' + circumference}
      strokeDashoffset={strokeDashoffset}
      r={normalizedRadius}
      cx="100"
      cy="100"
      style={{ transition: 'stroke-dashoffset 1s linear' }}
    />
  </svg>
  <div className="absolute inset-0 flex items-center justify-center text-4xl font-mono text-red-600">
    {formatTime(timeLeft)}
  </div>
</div>


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
            sessionStarted.current = false;
            sessionIdRef.current = null;
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
