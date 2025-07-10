const pool = require('../db/pool');

// Fetch all admins

exports.getAllAdmins = async () => {
  const result = await pool.query('SELECT * FROM admin'); // this must match your actual table name
  return result.rows;
};

exports.findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM admin WHERE email = $1', [email]);
  return result.rows[0]; // returns undefined if not found
};


// Create a new admin
exports.createAdmin = async (username, password_hash, email) => {
  const result = await pool.query(
    'INSERT INTO admin (admin_id, username, password_hash, email) VALUES (gen_random_uuid(), $1, $2, $3) RETURNING *',
    [username, password_hash, email]
  );
  return result.rows[0];
};

exports.getAdminByUsername = async (username) => {
  const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);
  return result.rows[0];
};


// Edit admin password
exports.updateAdminPassword = async (username, newPasswordHash) => {
  const result = await pool.query(
    `UPDATE admin
     SET password_hash = $2
     WHERE username = $1
     RETURNING *`,
    [username, newPasswordHash]
  );
  return result.rows[0];
};


// Delete admin by username
exports.deleteAdminByUsername = async (username) => {
  const result = await pool.query(
    'DELETE FROM admin WHERE username = $1 RETURNING *',
    [username]
  );
  return result.rows[0]; // null if not found
};
