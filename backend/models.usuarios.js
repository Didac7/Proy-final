// Modelo de usuarios para PostgreSQL
const pool = require('./config');

exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM usuarios');
  return result.rows;
};

exports.create = async ({ nombre, email, password, rol_id }) => {
  await pool.query('INSERT INTO usuarios (nombre, email, password, rol_id) VALUES ($1, $2, $3, $4)', [nombre, email, password, rol_id]);
};

exports.update = async (id, { nombre, email, rol_id }) => {
  await pool.query('UPDATE usuarios SET nombre = $1, email = $2, rol_id = $3 WHERE id = $4', [nombre, email, rol_id, id]);
};

exports.remove = async (id) => {
  await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
};

exports.getById = async (id) => {
  const result = await pool.query('SELECT * FROM usuarios WHERE id = $1', [id]);
  return result.rows[0];
};
