// Aquí irán las rutas de departamentos
const express = require('express');
const router = express.Router();
const departamentosController = require('./controllers.departamentos');
const authMiddleware = require('./auth.middleware');
const departamentosModel = require('./models.departamentos');

// Ejemplo: GET /api/departamentos
router.get('/', authMiddleware, departamentosController.getAll);

// Crear departamento
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre } = req.body;
    await departamentosModel.create({ nombre });
    res.status(201).json({ message: 'Departamento creado' });
  } catch (error) {
    // Mostrar el error real de la base de datos para depuración
    res.status(500).json({ error: 'Error al crear departamento', detalle: error.message });
  }
});

// Actualizar departamento
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nombre } = req.body;
    await departamentosModel.update(req.params.id, { nombre });
    res.json({ message: 'Departamento actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar departamento' });
  }
});

// Eliminar departamento
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await departamentosModel.remove(req.params.id);
    res.json({ message: 'Departamento eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar departamento' });
  }
});

module.exports = router;
