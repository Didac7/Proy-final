const departamentosModel = require('./models.departamentos');

// Controlador de departamentos
exports.getAll = async (req, res) => {
  try {
    const departamentos = await departamentosModel.getAll();
    res.json({ departamentos }); // Ahora responde con un objeto
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener departamentos' });
  }
};
