// Modelo de materiales para PostgreSQL
const pool = require('./config');

exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM materiales');
  return result.rows;
};

exports.create = async ({ nombre, descripcion, stock, unidad }) => {
  await pool.query('INSERT INTO materiales (nombre, descripcion, stock, unidad) VALUES ($1, $2, $3, $4)', [nombre, descripcion, stock, unidad]);
};

exports.update = async (id, { nombre, descripcion, stock, unidad }) => {
  await pool.query('UPDATE materiales SET nombre = $1, descripcion = $2, stock = $3, unidad = $4 WHERE id = $5', [nombre, descripcion, stock, unidad, id]);
};

exports.remove = async (id) => {
  await pool.query('DELETE FROM materiales WHERE id = $1', [id]);
};
