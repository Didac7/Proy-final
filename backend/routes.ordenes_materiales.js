// Obtener materiales requeridos para una orden de producción
const express = require('express');
const router = express.Router();
const authMiddleware = require('./auth.middleware');
const pool = require('./config');

// GET /api/ordenes/:id/materiales
router.get('/:id/materiales', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT m.id, m.nombre, om.cantidad, m.unidad
       FROM ordenes_materiales om
       JOIN materiales m ON om.material_id = m.id
       WHERE om.orden_id = $1`,
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materiales de la orden' });
  }
});

module.exports = router;
