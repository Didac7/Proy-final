// Modelo de departamentos para PostgreSQL
const pool = require('./config');

exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM departamentos');
  return result.rows;
};

exports.create = async ({ nombre }) => {
  await pool.query('INSERT INTO departamentos (nombre) VALUES ($1)', [nombre]);
};

exports.update = async (id, { nombre }) => {
  await pool.query('UPDATE departamentos SET nombre = $1 WHERE id = $2', [nombre, id]);
};

exports.remove = async (id) => {
  await pool.query('DELETE FROM departamentos WHERE id = $1', [id]);
};
