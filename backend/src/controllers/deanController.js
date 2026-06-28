const model = require('../models/deanModel');
const requestModel = require('../models/requestModel');
const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');

exports.create = catchAsync(async (req, res) => {
  const data = await model.create(req.body);
  res.status(201).json({ status: 'success', data });
});

exports.getAll = catchAsync(async (req, res) => {
  const data = await model.getAll();
  res.status(200).json({ status: 'success', results: data.length, data });
});

exports.getDashboardRequests = catchAsync(async (req, res) => {
  const data = await requestModel.getAllForAdmin();
  res.status(200).json({ status: 'success', results: data.length, data });
});

// Full statistics for bar chart
exports.getStatistics = catchAsync(async (req, res) => {
  const [total, pending, completed, approved, rejected, students, counsellors] = await Promise.all([
    pool.query('SELECT COUNT(*) FROM requests'),
    pool.query(`SELECT COUNT(*) FROM requests WHERE status='PENDING'`),
    pool.query(`SELECT COUNT(*) FROM requests WHERE status='COMPLETED'`),
    pool.query(`SELECT COUNT(*) FROM requests WHERE status='APPROVED'`),
    pool.query(`SELECT COUNT(*) FROM requests WHERE status='REJECTED'`),
    pool.query('SELECT COUNT(*) FROM students'),
    pool.query('SELECT COUNT(*) FROM counsellors'),
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      totalRequests: parseInt(total.rows[0].count),
      pendingRequests: parseInt(pending.rows[0].count),
      completedRequests: parseInt(completed.rows[0].count),
      approvedRequests: parseInt(approved.rows[0].count),
      rejectedRequests: parseInt(rejected.rows[0].count),
      totalStudents: parseInt(students.rows[0].count),
      totalCounsellors: parseInt(counsellors.rows[0].count),
    },
  });
});

// Trend data for line chart — period: 'week' | 'month' | 'year'
exports.getTrends = catchAsync(async (req, res) => {
  const { period = 'month' } = req.query;

  let query;
  if (period === 'week') {
    query = `
      SELECT
        TO_CHAR(DATE_TRUNC('week', appointment_date), 'YYYY-MM-DD') AS label,
        COUNT(*) AS count
      FROM requests
      WHERE appointment_date >= NOW() - INTERVAL '12 weeks'
      GROUP BY DATE_TRUNC('week', appointment_date)
      ORDER BY DATE_TRUNC('week', appointment_date) ASC
    `;
  } else if (period === 'year') {
    query = `
      SELECT
        TO_CHAR(DATE_TRUNC('year', appointment_date), 'YYYY') AS label,
        COUNT(*) AS count
      FROM requests
      WHERE appointment_date >= NOW() - INTERVAL '5 years'
      GROUP BY DATE_TRUNC('year', appointment_date)
      ORDER BY DATE_TRUNC('year', appointment_date) ASC
    `;
  } else {
    query = `
      SELECT
        TO_CHAR(DATE_TRUNC('month', appointment_date), 'Mon YYYY') AS label,
        COUNT(*) AS count
      FROM requests
      WHERE appointment_date >= NOW() - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', appointment_date)
      ORDER BY DATE_TRUNC('month', appointment_date) ASC
    `;
  }

  const { rows } = await pool.query(query);
  res.status(200).json({ status: 'success', period, data: rows });
});