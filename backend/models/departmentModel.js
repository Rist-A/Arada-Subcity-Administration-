const pool = require('../db/pool');

exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM department');
  return result.rows;
};

exports.create = async ({ name, address }) => {
  const result = await pool.query(
    'INSERT INTO department (department_id, name, address) VALUES (gen_random_uuid(), $1, $2) RETURNING *',
    [name, address]
  );
  return result.rows[0];
};

exports.update = async (id, { name, address }) => {
  const result = await pool.query(
    'UPDATE department SET name = $1, address = $2 WHERE department_id = $3 RETURNING *',
    [name, address, id]
  );
  return result.rows[0];
};

exports.remove = async (id) => {
  const result = await pool.query('DELETE FROM department WHERE department_id = $1 RETURNING *', [id]);
  return result.rows[0];
};