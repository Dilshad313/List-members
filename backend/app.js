const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./db');
const guestRoutes = require('./routes/guests');

const app = express();

const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'https://dilshad313.github.io,http://localhost:5500,http://127.0.0.1:5500')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json());

// Ensure a DB connection exists before handling any request.
// Cached in db.js, so this is a no-op after the first call per process.
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed', details: err.message });
  }
});

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Wedding Invitation Tracker API' });
});

app.use('/api/guests', guestRoutes);

app.get('/api/health', (req, res) => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.status(200).json({
    status: 'ok',
    db: dbStates[mongoose.connection.readyState] || 'unknown',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

module.exports = app;
