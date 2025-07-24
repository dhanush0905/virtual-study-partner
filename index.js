const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected!', time: result.rows[0].now });
  } catch (err) {
    console.error("DB ERROR:", err.message); // 👈 add this
    res.status(500).json({ error: 'Database connection failed' });
  }
});


const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

app.post('/start-session', async (req, res) => {
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
