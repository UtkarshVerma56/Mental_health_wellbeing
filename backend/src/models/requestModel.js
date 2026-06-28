const pool = require('../config/db');
exports.create = async (data) => {
  const { registration_number, appointment_date, time_slot } = data;
  const res = await pool.query(`INSERT INTO requests (registration_number, appointment_date, time_slot) VALUES ($1,$2,$3) RETURNING *`, [registration_number, appointment_date, time_slot]);
  return res.rows[0];
};
exports.getByStudent = async (regNo) => {
  const res = await pool.query(`SELECT * FROM requests WHERE registration_number = $1 ORDER BY appointment_date DESC`, [regNo]);
  return res.rows;
};
exports.updateStatus = async (id, status) => {
  const res = await pool.query(`UPDATE requests SET status = $1 WHERE request_id = $2 RETURNING *`, [status, id]);
  return res.rows[0];
};

// --- NEW DASHBOARD QUERIES ---

// For Counsellors: See all requests with student details
exports.getAllForCounsellor = async () => {
  const query = `
    SELECT r.request_id, r.registration_number, r.appointment_date, r.time_slot, r.status,
           s.name AS student_name, s.branch, s.email
    FROM requests r
    JOIN students s ON r.registration_number = s.registration_number
    ORDER BY r.appointment_date DESC
  `;
  const res = await pool.query(query);
  return res.rows;
};

// For Admins/Deans: See all requests with student details AND response details
exports.getAllForAdmin = async () => {
  const query = `
    SELECT r.request_id, r.registration_number, r.appointment_date, r.time_slot, r.status AS request_status,
           s.name AS student_name, s.branch,
           resp.action_performed, resp.status AS response_status, resp.date AS response_date,
           c.name AS counsellor_name
    FROM requests r
    JOIN students s ON r.registration_number = s.registration_number
    LEFT JOIN responses resp ON r.request_id = resp.request_id
    LEFT JOIN counsellors c ON resp.counsellor_id = c.id
    ORDER BY r.appointment_date DESC, resp.date DESC
  `;
  const res = await pool.query(query);
  return res.rows;
};