const rolesModel = require('./models.roles');

// Controlador de roles
exports.getAll = async (req, res) => {
  try {
    const roles = await rolesModel.getAll();
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener roles' });
  }
};
