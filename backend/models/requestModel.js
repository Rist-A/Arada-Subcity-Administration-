const pool = require('../db/pool');

exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM request');
  return result.rows;
};

exports.create = async (data) => {
  const {
    leader_id,
    department_id,
    request_type_id,
    title,
    description,
    created_at,
    status,
    scheduled_date,
    completed_at,
  } = data;
  const result = await pool.query(
    `INSERT INTO request (
      request_id, leader_id, department_id, request_type_id, title,
      description, created_at, status, scheduled_date, completed_at
    ) VALUES (
      gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9
    ) RETURNING *`,
    [leader_id, department_id, request_type_id, title, description, created_at, status, scheduled_date, completed_at]
  );
  return result.rows[0];
};

exports.update = async (id, data) => {
  const {
    status
  } = data;
  const result = await pool.query(
    `UPDATE request SET
      status = $1
     WHERE request_id = $2 RETURNING *`,
    [status ,id]
  );
  return result.rows[0];
};

exports.remove = async (id) => {
  const result = await pool.query('DELETE FROM request WHERE request_id = $1 RETURNING *', [id]);
  return result.rows[0];
};
