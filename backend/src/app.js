const pool = require('./config/db');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');

const studentRoutes      = require('./routes/studentRoutes');
const counsellorRoutes   = require('./routes/counsellorRoutes');
const adminRoutes        = require('./routes/adminRoutes');
const deanRoutes         = require('./routes/deanRoutes');
const requestRoutes      = require('./routes/requestRoutes');
const responseRoutes     = require('./routes/responseRoutes');

const authRoutes         = require('./routes/authRoutes');
const studentApiRoutes   = require('./routes/studentApiRoutes');
const counsellorApiRoutes= require('./routes/counsellorApiRoutes');
const adminApiRoutes     = require('./routes/adminApiRoutes');
const deanApiRoutes      = require('./routes/deanApiRoutes');

const AppError           = require('./utils/AppError');
const globalErrorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10kb' }));
app.use('/api', rateLimit({ max: 200, windowMs: 60 * 60 * 1000, message: 'Too many requests.' }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.status(200).json({ status: 'OK', database: 'Connected Successfully!', serverTime: result.rows[0].now });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', database: 'Connection Failed!', error: error.message });
  }
});

// Frontend-aligned routes
app.use('/api/auth',       authRoutes);
app.use('/api/student',    studentApiRoutes);
app.use('/api/counsellor', counsellorApiRoutes);
app.use('/api/admin',      adminApiRoutes);
app.use('/api/dean',       deanApiRoutes);

// Original versioned routes (kept)
app.use('/api/v1/students',   studentRoutes);
app.use('/api/v1/counsellors',counsellorRoutes);
app.use('/api/v1/admins',     adminRoutes);
app.use('/api/v1/deans',      deanRoutes);
app.use('/api/v1/requests',   requestRoutes);
app.use('/api/v1/responses',  responseRoutes);

app.all('/{*splat}', (req, res, next) =>
  next(new AppError(`Route ${req.originalUrl} not found`, 404))
);
app.use(globalErrorHandler);


module.exports = app;