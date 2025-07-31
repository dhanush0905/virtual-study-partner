import React, { useState, useEffect } from 'react';
import PomodoroTimer from './PomodoroTimer';
import './index.css';
import './App.css';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300 p-4">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="mb-4 text-sm px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
      >
        {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
      <h1 className="text-3xl font-bold mb-6 text-red-600 dark:text-red-400">
        Virtual Study Partner
      </h1>
      <PomodoroTimer />
    </div>
  );
}

export default App;
