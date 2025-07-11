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
    `UPDATE request SET
      leader_id = $1,
      department_id = $2,
      request_type_id = $3,
      title = $4,
      description = $5,
      created_at = $6,
      status = $7,
      scheduled_date = $8,
      completed_at = $9
     WHERE request_id = $10 RETURNING *`,
    [leader_id, department_id, request_type_id, title, description, created_at, status, scheduled_date, completed_at, id]
  );
  return result.rows[0];
};

exports.remove = async (id) => {
  const result = await pool.query('DELETE FROM request WHERE request_id = $1 RETURNING *', [id]);
  return result.rows[0];
};
