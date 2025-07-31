const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/start-session', (req, res) => {
  console.log('✅ Received POST to /start-session');
  console.log('📦 Body:', req.body);
  res.status(200).json({ message: 'Session started', dummySessionId: 1 });
});

app.listen(5000, () => {
  console.log('🚀 Listening on http://localhost:5000');
});
