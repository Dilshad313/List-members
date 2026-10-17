require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const guestRoutes = require('./routes/guests');

const app = express();
const PORT = process.env.PORT || 5000;

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

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
