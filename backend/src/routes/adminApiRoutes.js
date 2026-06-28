const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect, restrictTo('administrator'));

router.get('/appointments', catchAsync(async (req, res) => {
  const { status } = req.query;
  let query = `
    SELECT r.request_id, r.registration_number, r.appointment_date, r.time_slot, r.status AS request_status,
           s.name AS student_name, s.branch,
           resp.action_performed, resp.status AS response_status,
           c.name AS counsellor_name
    FROM requests r
    JOIN students s ON r.registration_number = s.registration_number
    LEFT JOIN responses resp ON r.request_id = resp.request_id
    LEFT JOIN counsellors c ON resp.counsellor_id = c.id
    WHERE 1=1`;
  const params = [];
  if (status) { params.push(status); query += ` AND r.status = $${params.length}`; }
  query += ' ORDER BY r.appointment_date DESC';
  const { rows } = await pool.query(query, params);
  res.json({ success: true, data: rows });
}));

router.get('/appointments/search', catchAsync(async (req, res) => {
  const { regNo } = req.query;
  const { rows } = await pool.query(
    `SELECT r.*, s.name AS student_name, s.branch FROM requests r
     JOIN students s ON r.registration_number = s.registration_number
     WHERE r.registration_number ILIKE $1`,
    [`%${regNo}%`]
  );
  res.json({ success: true, data: rows });
}));

router.get('/appointments/:id', catchAsync(async (req, res) => {
  const { rows } = await pool.query(
    `SELECT r.*, s.name AS student_name, s.branch FROM requests r
     JOIN students s ON r.registration_number = s.registration_number
     WHERE r.request_id = $1`, [req.params.id]
  );
  res.json({ success: true, data: rows[0] || null });
}));

router.get('/statistics', catchAsync(async (req, res) => {
  const [total, pending, completed, students] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM requests'),
    pool.query(`SELECT COUNT(*) FROM requests WHERE status='PENDING'`),
    pool.query(`SELECT COUNT(*) FROM requests WHERE status='COMPLETED'`),
    pool.query('SELECT COUNT(*) FROM students'),
  ]);
  res.json({ success: true, data: {
    totalRequests: parseInt(total.rows[0].count),
    pendingRequests: parseInt(pending.rows[0].count),
    completedRequests: parseInt(completed.rows[0].count),
    totalStudents: parseInt(students.rows[0].count),
  }});
}));

module.exports = router;