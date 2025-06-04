// Asignar materiales a un producto (relación muchos a muchos)
const express = require('express');
const router = express.Router();
const authMiddleware = require('./auth.middleware');
const pool = require('./config');

// POST /api/productos/:id/materiales
router.post('/:id/materiales', authMiddleware, async (req, res) => {
  try {
    const { materiales } = req.body; // [{ material_id, cantidad }]
    const { id } = req.params;
    for (const mat of materiales) {
      await pool.query(
        'INSERT INTO productos_materiales (producto_id, material_id, cantidad) VALUES ($1, $2, $3)',
        [id, mat.material_id, mat.cantidad]
      );
    }
    res.status(201).json({ message: 'Materiales asignados al producto' });
  } catch (error) {
    res.status(500).json({ error: 'Error al asignar materiales al producto' });
  }
});

// DELETE /api/productos/:id/materiales/:material_id
router.delete('/:id/materiales/:material_id', authMiddleware, async (req, res) => {
  try {
    const { id, material_id } = req.params;
    await pool.query(
      'DELETE FROM productos_materiales WHERE producto_id = $1 AND material_id = $2',
      [id, material_id]
    );
    res.json({ message: 'Material eliminado del producto' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar material del producto' });
  }
});

module.exports = router;
