const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

const JWT_SECRET = process.env.JWT_SECRET || 'mnnit_secret_key_change_in_prod';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '24h';

const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// Format DB date → DD-MM-YYYY
const formatDOB = (dob) => {
  const str = typeof dob === 'string' ? dob : dob.toISOString();
  const datePart = str.split('T')[0]; // "2000-10-10"
  const [yyyy, mm, dd] = datePart.split('-');
  return `${dd}-${mm}-${yyyy}`; // "10-10-2000"
};

exports.login = catchAsync(async (req, res, next) => {
  const { userType, userId, password } = req.body;
  if (!userType || !userId || !password)
    return next(new AppError('Please provide userType, userId and password', 400));

  let user = null;
  let passwordMatch = false;

  if (userType === 'student') {
    const { rows } = await pool.query(
      `SELECT registration_number AS id, name, email, branch, specialization, dob, password_hash
       FROM students WHERE registration_number = $1`,
      [userId.toUpperCase()]
    );
    if (!rows[0]) return next(new AppError('Invalid credentials', 401));
    user = rows[0];
    if (user.password_hash && !user.password_hash.startsWith('$2b$10$92IXUNpkjO0rO'))
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) passwordMatch = (password === formatDOB(user.dob));
  }
  else if (userType === 'counsellor') {
    const { rows } = await pool.query(
      `SELECT id::text AS id, name, email, domain, dob, password_hash
       FROM counsellors WHERE email = $1`, [userId]
    );
    if (!rows[0]) return next(new AppError('Invalid credentials', 401));
    user = rows[0];
    if (user.password_hash && !user.password_hash.startsWith('$2b$10$92IXUNpkjO0rO'))
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) passwordMatch = (password === formatDOB(user.dob));
  }
  else if (userType === 'administrator') {
    const { rows } = await pool.query(
      `SELECT id::text AS id, name, email, dob, password_hash
       FROM administrators WHERE email = $1`, [userId]
    );
    if (!rows[0]) return next(new AppError('Invalid credentials', 401));
    user = rows[0];
    if (user.password_hash && !user.password_hash.startsWith('$2b$10$92IXUNpkjO0rO'))
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) passwordMatch = (password === formatDOB(user.dob));
  }
  else if (userType === 'dean') {
    const { rows } = await pool.query(
      `SELECT id::text AS id, name, email, dob, password_hash
       FROM deans WHERE email = $1`, [userId]
    );
    if (!rows[0]) return next(new AppError('Invalid credentials', 401));
    user = rows[0];
    if (user.password_hash && !user.password_hash.startsWith('$2b$10$92IXUNpkjO0rO'))
      passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) passwordMatch = (password === formatDOB(user.dob));
  }
  else return next(new AppError('Invalid user type', 400));

  if (!passwordMatch) return next(new AppError('Invalid credentials', 401));

  const token = signToken({ id: user.id, userType });
  delete user.password_hash;
  delete user.dob;

  res.status(200).json({ success: true, token, user: { ...user, userType } });
});

exports.logout = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, message: 'Logged out successfully.' });
});

exports.forgotPassword = catchAsync(async (req, res) => {
  res.status(200).json({ success: true, message: 'Password is your Date of Birth in DD-MM-YYYY format.' });
});

exports.changePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  const { userId, userType } = req.user;
  const tableMap = {
    student:       { table: 'students',       idCol: 'registration_number' },
    counsellor:    { table: 'counsellors',    idCol: 'id' },
    administrator: { table: 'administrators', idCol: 'id' },
    dean:          { table: 'deans',          idCol: 'id' },
  };
  const cfg = tableMap[userType];
  if (!cfg) return next(new AppError('Invalid user type', 400));
  const { rows } = await pool.query(
    `SELECT dob, password_hash FROM ${cfg.table} WHERE ${cfg.idCol} = $1`, [userId]
  );
  if (!rows[0]) return next(new AppError('User not found', 404));
  const validCurrent =
    currentPassword === formatDOB(rows[0].dob) ||
    (rows[0].password_hash && await bcrypt.compare(currentPassword, rows[0].password_hash));
  if (!validCurrent) return next(new AppError('Current password is incorrect', 401));
  const hash = await bcrypt.hash(newPassword, 12);
  await pool.query(`UPDATE ${cfg.table} SET password_hash = $1 WHERE ${cfg.idCol} = $2`, [hash, userId]);
  res.status(200).json({ success: true, message: 'Password changed successfully.' });
});

exports.refreshToken = catchAsync(async (req, res) => {
  const token = signToken({ id: req.user.userId, userType: req.user.userType });
  res.status(200).json({ success: true, token });
});