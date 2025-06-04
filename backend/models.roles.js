// Modelo de roles para PostgreSQL
const pool = require('./config');

exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM roles');
  return result.rows;
};

exports.create = async ({ nombre }) => {
  await pool.query('INSERT INTO roles (nombre) VALUES ($1)', [nombre]);
};

exports.update = async (id, { nombre }) => {
  await pool.query('UPDATE roles SET nombre = $1 WHERE id = $2', [nombre, id]);
};

exports.remove = async (id) => {
  await pool.query('DELETE FROM roles WHERE id = $1', [id]);
};
