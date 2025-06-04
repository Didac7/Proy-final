// Obtener materiales requeridos para un producto
const express = require('express');
const router = express.Router();
const authMiddleware = require('./auth.middleware');
const pool = require('./config');

// GET /api/productos/:id/materiales
router.get('/:id/materiales', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT m.id, m.nombre, pm.cantidad, m.unidad
       FROM productos_materiales pm
       JOIN materiales m ON pm.material_id = m.id
       WHERE pm.producto_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materiales del producto' });
  }
});

module.exports = router;
