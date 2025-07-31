const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db'); // PostgreSQL pool
const focusSessionsRoutes = require('./routes/focusSessions'); // 👈 Add this

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test DB route
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected!', time: result.rows[0].now });
  } catch (err) {
    console.error("DB ERROR:", err.message);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

// 👇 Mount your session routes (all: /start-session, /end-session, /session-history)
app.use('/', focusSessionsRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
