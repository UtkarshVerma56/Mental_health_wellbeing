const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect, restrictTo('counsellor'));

router.get('/profile', catchAsync(async (req, res, next) => {
  const { rows } = await pool.query(
    `SELECT id, name, email, domain FROM counsellors WHERE id = $1`, [req.user.userId]
  );
  if (!rows[0]) return next(new AppError('Counsellor not found', 404));
  res.json({ success: true, data: rows[0] });
}));

router.get('/appointments/pending', catchAsync(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT r.request_id, r.registration_number, r.appointment_date, r.time_slot, r.status, r.description,
            s.name AS student_name, s.branch, s.email
     FROM requests r JOIN students s ON r.registration_number = s.registration_number
     WHERE r.status = 'PENDING' ORDER BY r.appointment_date ASC`
  );
  res.json({ success: true, data: rows });
}));

router.get('/appointments/solved', catchAsync(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT r.request_id, r.registration_number, r.appointment_date, r.time_slot, r.status, r.description,
            s.name AS student_name, s.branch, s.email,
            resp.action_performed, resp.status AS response_status
     FROM requests r
     JOIN students s ON r.registration_number = s.registration_number
     LEFT JOIN responses resp ON r.request_id = resp.request_id
     WHERE r.status IN ('APPROVED','COMPLETED','REJECTED')
     ORDER BY r.appointment_date DESC`
  );
  res.json({ success: true, data: rows });
}));

router.get('/appointments/:id', catchAsync(async (req, res, next) => {
  const { rows } = await pool.query(
    `SELECT r.*, s.name AS student_name, s.branch, s.email FROM requests r
     JOIN students s ON r.registration_number = s.registration_number
     WHERE r.request_id = $1`, [req.params.id]
  );
  if (!rows[0]) return next(new AppError('Appointment not found', 404));
  res.json({ success: true, data: rows[0] });
}));

router.put('/appointments/:id', catchAsync(async (req, res) => {
  const { status } = req.body;
  const { rows } = await pool.query(
    `UPDATE requests SET status=$1 WHERE request_id=$2 RETURNING *`, [status, req.params.id]
  );
  res.json({ success: true, data: rows[0] });
}));

router.post('/appointments/:id/confirm', catchAsync(async (req, res) => {
  const { date, timeslot, action_performed, status } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO responses (request_id, counsellor_id, date, timeslot, action_performed, status)
     VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [req.params.id, req.user.userId, date, timeslot, action_performed, status]
  );
  await pool.query(`UPDATE requests SET status='COMPLETED' WHERE request_id=$1`, [req.params.id]);
  res.status(201).json({ success: true, data: rows[0] });
}));

module.exports = router;