import React from 'react'
import PomodoroTimer from './PomodoroTimer'
import './index.css'
import './App.css'

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6 text-red-600">Virtual Study Partner</h1>
      <PomodoroTimer />
    </div>
  )
}

export default App
