const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

router.use(protect, restrictTo('dean'));

router.get('/analytics', catchAsync(async (req, res) => {
  const [byStatus, byBranch] = await Promise.all([
    pool.query(`SELECT status, COUNT(*) as count FROM requests GROUP BY status`),
    pool.query(`SELECT s.branch, COUNT(*) as count FROM requests r
                JOIN students s ON r.registration_number = s.registration_number
                GROUP BY s.branch ORDER BY count DESC`),
  ]);
  res.json({ success: true, data: { byStatus: byStatus.rows, byBranch: byBranch.rows } });
}));

router.get('/statistics', catchAsync(async (req, res) => {
  const [total, pending, approved, completed, rejected, students, counsellors] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM requests'),
    pool.query(`SELECT COUNT(*) FROM requests WHERE status='PENDING'`),
    pool.query(`SELECT COUNT(*) FROM requests WHERE status='APPROVED'`),
    pool.query(`SELECT COUNT(*) FROM requests WHERE status='COMPLETED'`),
    pool.query(`SELECT COUNT(*) FROM requests WHERE status='REJECTED'`),
    pool.query('SELECT COUNT(*) FROM students'),
    pool.query('SELECT COUNT(*) FROM counsellors'),
  ]);
  res.json({
    success: true,
    data: {
      totalRequests:     parseInt(total.rows[0].count),
      pendingRequests:   parseInt(pending.rows[0].count),
      approvedRequests:  parseInt(approved.rows[0].count),
      completedRequests: parseInt(completed.rows[0].count),
      rejectedRequests:  parseInt(rejected.rows[0].count),
      totalStudents:     parseInt(students.rows[0].count),
      totalCounsellors:  parseInt(counsellors.rows[0].count),
    },
  });
}));
// Unified trends endpoint: ?period=week | month | year
router.get('/trends', catchAsync(async (req, res) => {
  const { period } = req.query;

  let query;

  if (period === 'week') {
    query = `
      SELECT
        TO_CHAR(DATE_TRUNC('week', appointment_date), 'DD Mon YYYY') AS label,
        DATE_TRUNC('week', appointment_date) AS sort_date,
        COUNT(*) AS count
      FROM requests
      GROUP BY DATE_TRUNC('week', appointment_date)
      ORDER BY sort_date ASC
    `;
  } else if (period === 'year') {
    query = `
      SELECT
        TO_CHAR(DATE_TRUNC('year', appointment_date), 'YYYY') AS label,
        DATE_TRUNC('year', appointment_date) AS sort_date,
        COUNT(*) AS count
      FROM requests
      GROUP BY DATE_TRUNC('year', appointment_date)
      ORDER BY sort_date ASC
    `;
  } else {
    // default: month
    query = `
      SELECT
        TO_CHAR(DATE_TRUNC('month', appointment_date), 'Mon YYYY') AS label,
        DATE_TRUNC('month', appointment_date) AS sort_date,
        COUNT(*) AS count
      FROM requests
      GROUP BY DATE_TRUNC('month', appointment_date)
      ORDER BY sort_date ASC
    `;
  }

  const { rows } = await pool.query(query);
  res.json({ success: true, data: rows });
}));
module.exports = router;