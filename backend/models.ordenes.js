// Modelo de órdenes de producción para PostgreSQL
const pool = require('./config');

exports.getAll = async () => {
  const result = await pool.query('SELECT * FROM ordenes_produccion');
  return result.rows;
};

exports.create = async ({ producto_id, cantidad, fecha_inicio, fecha_fin, estado }) => {
  await pool.query('INSERT INTO ordenes_produccion (producto_id, cantidad, fecha_inicio, fecha_fin, estado) VALUES ($1, $2, $3, $4, $5)', [producto_id, cantidad, fecha_inicio, fecha_fin, estado]);
};

exports.update = async (id, { producto_id, cantidad, fecha_inicio, fecha_fin, estado }) => {
  await pool.query('UPDATE ordenes_produccion SET producto_id = $1, cantidad = $2, fecha_inicio = $3, fecha_fin = $4, estado = $5 WHERE id = $6', [producto_id, cantidad, fecha_inicio, fecha_fin, estado, id]);
};

exports.remove = async (id) => {
  await pool.query('DELETE FROM ordenes_produccion WHERE id = $1', [id]);
};
