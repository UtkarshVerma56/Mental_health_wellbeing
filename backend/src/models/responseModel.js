const pool = require('../config/db');
exports.create = async (data) => {
  const { request_id, counsellor_id, date, timeslot, action_performed, status } = data;
  const res = await pool.query(`INSERT INTO responses (request_id, counsellor_id, date, timeslot, action_performed, status) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`, [request_id, counsellor_id, date, timeslot, action_performed, status]);
  return res.rows[0];
};
exports.getByRequest = async (reqId) => {
  // Joins to get the Counsellor Name as requested in your schema
  const res = await pool.query(`SELECT r.*, c.name AS counsellor_name FROM responses r JOIN counsellors c ON r.counsellor_id = c.id WHERE r.request_id = $1`, [reqId]);
  return res.rows;
};