const pool = require('../db/pool');

exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM requesttype');
  return result.rows;
};

exports.create = async (name) => {
  const result = await pool.query(
    'INSERT INTO requesttype (request_type_id, name) VALUES (gen_random_uuid(), $1) RETURNING *',
    [name]
  );
  return result.rows[0];
};

exports.update = async (id, name) => {
  const result = await pool.query(
    'UPDATE requesttype SET name = $1 WHERE request_type_id = $2 RETURNING *',
    [name, id]
  );
  return result.rows[0];
};

exports.remove = async (id) => {
  const result = await pool.query('DELETE FROM requesttype WHERE request_type_id = $1 RETURNING *', [id]);
  return result.rows[0];
};