const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect, restrictTo('student'));

router.get('/profile', catchAsync(async (req, res, next) => {
  const { rows } = await pool.query(
    `SELECT registration_number, name, email, branch, specialization FROM students WHERE registration_number = $1`,
    [req.user.userId]
  );
  if (!rows[0]) return next(new AppError('Student not found', 404));
  res.json({ success: true, data: rows[0] });
}));

router.put('/profile', catchAsync(async (req, res) => {
  const { name, branch, specialization } = req.body;
  const { rows } = await pool.query(
    `UPDATE students SET name=COALESCE($1,name), branch=COALESCE($2,branch), specialization=COALESCE($3,specialization)
     WHERE registration_number=$4 RETURNING registration_number, name, email, branch, specialization`,
    [name, branch, specialization, req.user.userId]
  );
  res.json({ success: true, data: rows[0] });
}));

router.post('/appointments', catchAsync(async (req, res) => {
  const { appointment_date, time_slot, description } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO requests (registration_number, appointment_date, time_slot, description)
     VALUES ($1,$2,$3,$4) RETURNING *`,
    [req.user.userId, appointment_date, time_slot, description || null]
  );
  res.status(201).json({ success: true, data: rows[0] });
}));

router.get('/appointments', catchAsync(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT r.*, resp.action_performed, resp.status AS response_status, c.name AS counsellor_name
     FROM requests r
     LEFT JOIN responses resp ON r.request_id = resp.request_id
     LEFT JOIN counsellors c ON resp.counsellor_id = c.id
     WHERE r.registration_number = $1
     ORDER BY r.appointment_date DESC`,
    [req.user.userId]
  );
  res.json({ success: true, data: rows });
}));

router.get('/appointments/:id', catchAsync(async (req, res, next) => {
  const { rows } = await pool.query(
    `SELECT r.*, resp.action_performed, resp.status AS response_status, c.name AS counsellor_name
     FROM requests r
     LEFT JOIN responses resp ON r.request_id = resp.request_id
     LEFT JOIN counsellors c ON resp.counsellor_id = c.id
     WHERE r.request_id = $1 AND r.registration_number = $2`,
    [req.params.id, req.user.userId]
  );
  if (!rows[0]) return next(new AppError('Appointment not found', 404));
  res.json({ success: true, data: rows[0] });
}));

router.put('/appointments/:id/cancel', catchAsync(async (req, res) => {
  const { rows } = await pool.query(
    `UPDATE requests SET status='REJECTED' WHERE request_id=$1 AND registration_number=$2 RETURNING *`,
    [req.params.id, req.user.userId]
  );
  res.json({ success: true, data: rows[0] });
}));

module.exports = router;