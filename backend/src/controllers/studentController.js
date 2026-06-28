const pool = require('../config/db');
const catchAsync = require('../utils/catchAsync');

exports.register = catchAsync(async (req, res) => {
  const { registration_number, name, dob, branch, specialization, email } = req.body;
  const result = await pool.query(
    `INSERT INTO students (registration_number, name, dob, branch, specialization, email)
     VALUES ($1, $2, $3::date, $4, $5, $6) RETURNING *`,
    [registration_number, name, dob, branch, specialization, email]
  );
  res.status(201).json({ status: 'success', data: result.rows[0] });
});

exports.get = catchAsync(async (req, res) => {
  const { regNo } = req.params;
  const result = await pool.query(
    `SELECT * FROM students WHERE registration_number = $1`, [regNo]
  );
  res.status(200).json({ status: 'success', data: result.rows[0] });
});