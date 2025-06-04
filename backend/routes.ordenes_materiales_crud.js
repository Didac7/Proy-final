// Asignar materiales a una orden de producción (relación muchos a muchos)
const express = require('express');
const router = express.Router();
const authMiddleware = require('./auth.middleware');
const pool = require('./config');

// POST /api/ordenes/:id/materiales
router.post('/:id/materiales', authMiddleware, async (req, res) => {
  try {
    const { materiales } = req.body; // [{ material_id, cantidad }]
    const { id } = req.params;
    for (const mat of materiales) {
      await pool.query(
        'INSERT INTO ordenes_materiales (orden_id, material_id, cantidad) VALUES ($1, $2, $3)',
        [id, mat.material_id, mat.cantidad]
      );
    }
    res.status(201).json({ message: 'Materiales asignados a la orden' });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar materiales a la orden' });
  }
});

// DELETE /api/ordenes/:id/materiales/:material_id
router.delete('/:id/materiales/:material_id', authMiddleware, async (req, res) => {
  try {
    const { id, material_id } = req.params;
    await pool.query(
      'DELETE FROM ordenes_materiales WHERE orden_id = $1 AND material_id = $2',
      [id, material_id]
    );
    res.json({ message: 'Material eliminado de la orden' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar material de la orden' });
  }
});

module.exports = router;
