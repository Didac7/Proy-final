// Controlador de usuarios
const usuariosModel = require('./models.usuarios');

exports.getAll = async (req, res) => {
  try {
    const usuarios = await usuariosModel.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
};
