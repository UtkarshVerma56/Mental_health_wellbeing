const pool = require('../config/db');

exports.register = async (data) => {
  const { registration_number, name, dob, branch, specialization, email } = data;
  const res = await pool.query(
    `INSERT INTO students (registration_number, name, dob, branch, specialization, email)
     VALUES ($1, $2, $3::date, $4, $5, $6) RETURNING *`,
    [registration_number, name, dob, branch, specialization, email]
  );
  return res.rows[0];
};

exports.get = async (regNo) => {
  const res = await pool.query(
    `SELECT * FROM students WHERE registration_number = $1`, [regNo]
  );
  return res.rows[0];
};