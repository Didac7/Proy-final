// Aquí irán las rutas de roles
const express = require('express');
const router = express.Router();
const rolesController = require('./controllers.roles');
const authMiddleware = require('./auth.middleware');
const rolesModel = require('./models.roles');

// Ejemplo: GET /api/roles
router.get('/', rolesController.getAll); // Hacer público el endpoint para obtener roles

// Crear rol
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre } = req.body;
    await rolesModel.create({ nombre });
    res.status(201).json({ message: 'Rol creado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear rol' });
  }
});

// Actualizar rol
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nombre } = req.body;
    await rolesModel.update(req.params.id, { nombre });
    res.json({ message: 'Rol actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar rol' });
  }
});

// Eliminar rol
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await rolesModel.remove(req.params.id);
    res.json({ message: 'Rol eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar rol' });
  }
});

module.exports = router;
