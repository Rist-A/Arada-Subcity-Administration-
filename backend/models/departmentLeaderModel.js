const pool = require('../db/pool');
const bcrypt = require('bcrypt');
exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM departmentleader');
  return result.rows;
};

exports.findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM departmentleader WHERE email = $1', [email]);
  return result.rows[0];
};


exports.create = async (data) => {
  const { username, password_hash, full_name, department_id , email } = data;
  const result = await pool.query(
    'INSERT INTO departmentleader (leader_id, username, password_hash, full_name, department_id, email) VALUES (gen_random_uuid(), $1, $2, $3, $4 ,$5) RETURNING *',
    [username, password_hash, full_name, department_id , email]
  );
  return result.rows[0];
};




exports.getLeaderById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM departmentleader WHERE leader_id = $1',
    [id]
  );
  return result.rows[0];
};



// Edit leader password
exports.updateLeaderPassword = async (leaderId, newPasswordHash) => {
  const result = await pool.query(
    `UPDATE departmentleader
     SET password_hash = $1
     WHERE leader_id = $2
     RETURNING *`,
    [newPasswordHash, leaderId]
  );
  return result.rows[0];
};







// exports.update = async (id, data) => {
//   const { username, password_hash, full_name, department_id } = data;
//   const result = await pool.query(
//     `UPDATE departmentleader SET
//       username = $1,
//       password_hash = $2,
//       full_name = $3,
//       department_id = $4
//      WHERE leader_id = $5 RETURNING *`,
//     [username, password_hash, full_name, department_id, id]
//   );
//   return result.rows[0];
// };

exports.remove = async (id) => {
  const result = await pool.query('DELETE FROM departmentleader WHERE leader_id = $1 RETURNING *', [id]);
  return result.rows[0];
};