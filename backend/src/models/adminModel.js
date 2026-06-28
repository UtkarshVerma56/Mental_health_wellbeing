const pool = require('../config/db');

exports.create = async (data) => {
  const { name, dob, email } = data;
  const res = await pool.query(
    `INSERT INTO administrators (name, dob, email) VALUES ($1, $2::date, $3) RETURNING *`,
    [name, dob, email]
  );
  return res.rows[0];
};

exports.getAll = async () => {
  const res = await pool.query(`SELECT * FROM administrators`);
  return res.rows;
};