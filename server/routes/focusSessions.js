const express = require('express');
const router = express.Router();
const pool = require('../db');

// Start session
router.post('/start-session', async (req, res) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: "user_id is required" });
  }

  try {
    const result = await pool.query(
      `INSERT INTO focus_sessions (user_id, start_time)
       VALUES ($1, NOW()) RETURNING *`,
      [user_id]
    );

    res.status(201).json({ message: "Session started", session: result.rows[0] });
  } catch (err) {
    console.error("Error starting session:", err.message);
    res.status(500).json({ error: "Failed to start session" });
  }
});

// End session
router.post('/end-session', async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    return res.status(400).json({ error: "session_id is required" });
  }

  try {
    const result = await pool.query(
      `UPDATE focus_sessions
       SET end_time = NOW(),
           duration_minutes = EXTRACT(EPOCH FROM (NOW() - start_time)) / 60
       WHERE id = $1
       RETURNING *`,
      [session_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json({ message: "Session ended", session: result.rows[0] });
  } catch (err) {
    console.error("Error ending session:", err.message);
    res.status(500).json({ error: "Failed to end session" });
  }
});

// ✅ Get session history
router.get('/session-history', async (req, res) => {
  const userId = req.query.user_id;

  if (!userId) {
    return res.status(400).json({ error: 'user_id is required' });
  }

  try {
    const result = await pool.query(
      `SELECT id, start_time, end_time, duration_minutes 
       FROM focus_sessions 
       WHERE user_id = $1 
       ORDER BY start_time DESC`,
      [userId]
    );

    res.status(200).json({ sessions: result.rows });
  } catch (err) {
    console.error('Error fetching session history:', err.message);
    res.status(500).json({ error: 'Failed to fetch session history' });
  }
});

module.exports = router;
