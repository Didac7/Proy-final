// Aquí irán las rutas de usuarios
const express = require('express');
const router = express.Router();
const usuariosController = require('./controllers.usuarios');
const authMiddleware = require('./auth.middleware');
const usuariosModel = require('./models.usuarios');
const bcrypt = require('bcryptjs');

// Ejemplo: GET /api/usuarios
router.get('/', authMiddleware, usuariosController.getAll);

// Crear usuario
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { nombre, email, password, rol_id } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await usuariosModel.create({ nombre, email, password: hashedPassword, rol_id });
    res.status(201).json({ message: 'Usuario creado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario' });
  }
});

// Actualizar usuario
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { nombre, email, rol_id } = req.body;
    await usuariosModel.update(req.params.id, { nombre, email, rol_id });
    res.json({ message: 'Usuario actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await usuariosModel.remove(req.params.id);
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Endpoint para obtener el perfil del usuario autenticado
router.get('/perfil', authMiddleware, async (req, res) => {
  try {
    // Suponiendo que el ID del usuario está en req.user.id (por el JWT)
    const usuario = await usuariosModel.getById(req.user.id);
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el perfil' });
  }
});

module.exports = router;
