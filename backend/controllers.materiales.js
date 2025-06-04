// Controlador de materiales
const materialesModel = require('./models.materiales');

exports.getAll = async (req, res) => {
  try {
    const materiales = await materialesModel.getAll();
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener materiales' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, stock, unidad } = req.body;
    await materialesModel.create({ nombre, descripcion, stock, unidad });
    res.status(201).json({ message: 'Material creado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear material' });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, descripcion, stock, unidad } = req.body;
    await materialesModel.update(req.params.id, { nombre, descripcion, stock, unidad });
    res.json({ message: 'Material actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar material' });
  }
};

exports.remove = async (req, res) => {
  try {
    await materialesModel.remove(req.params.id);
    res.json({ message: 'Material eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar material' });
  }
};
