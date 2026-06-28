const pool = require('../config/db');

exports.create = async (data) => {
  const { name, dob, domain, email } = data;
  const res = await pool.query(
    `INSERT INTO counsellors (name, dob, domain, email) VALUES ($1, $2::date, $3, $4) RETURNING *`,
    [name, dob, domain, email]
  );
  return res.rows[0];
};

exports.getAll = async () => {
  const res = await pool.query(`SELECT * FROM counsellors`);
  return res.rows;
};