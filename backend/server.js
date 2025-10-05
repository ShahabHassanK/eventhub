// backend/server.js
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/event');

const app = express();

// -------------------- Middlewares --------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Mount auth routes
app.use('/api/auth', authRoutes);
// Mount event routes
app.use('/api/events', eventRoutes);
// -------------------- Debug Logging --------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eventhub';

console.log('📦 Using Mongo URI:', MONGO_URI.startsWith('mongodb') ? 'OK' : 'MISSING');

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ JWT_SECRET is missing in .env');
}

// -------------------- Routes --------------------
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, time: Date.now() });
});

app.get('/api/token-test', (req, res) => {
  try {
    const token = jwt.sign(
      { id: '123', role: 'tester' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ message: 'JWT created and cookie set', token });
  } catch (err) {
    res.status(500).json({ error: 'JWT signing failed' });
  }
});

// -------------------- DB + Server --------------------
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });
