// Modelo de productos para PostgreSQL
const pool = require('./config');

exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM productos');
  return result.rows;
};

exports.create = async ({ nombre, descripcion, stock, precio }) => {
  await pool.query('INSERT INTO productos (nombre, descripcion, stock, precio) VALUES ($1, $2, $3, $4)', [nombre, descripcion, stock, precio]);
};

exports.update = async (id, { nombre, descripcion, stock, precio }) => {
  await pool.query('UPDATE productos SET nombre = $1, descripcion = $2, stock = $3, precio = $4 WHERE id = $5', [nombre, descripcion, stock, precio, id]);
};

exports.remove = async (id) => {
  await pool.query('DELETE FROM productos WHERE id = $1', [id]);
};
