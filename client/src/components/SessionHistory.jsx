import React, { useEffect, useState } from 'react';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://localhost:5000/session-history?user_id=1');
        const data = await response.json();
        setSessions(data.sessions || []);
      } catch (error) {
        console.error('Failed to fetch session history:', error);
      }
    };

    fetchSessions();
  }, []);

  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatDuration = (start, end) => {
    const diff = (new Date(end) - new Date(start)) / 1000;
    const mins = Math.floor(diff / 60);
    const secs = Math.floor(diff % 60);
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="mt-8 px-4 max-w-2xl mx-auto">
      <h3 className="text-xl font-bold mb-4 dark:text-white">Session History</h3>
      {sessions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No sessions recorded yet.</p>
      ) : (
        <div className="space-y-4">
          {sessions.map((session) => (
            <div
              key={session.id}
              className="p-4 border rounded-lg shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700"
            >
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Start:</strong> {formatDateTime(session.start_time)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>End:</strong> {formatDateTime(session.end_time)}
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>Duration:</strong> {formatDuration(session.start_time, session.end_time)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SessionHistory;
