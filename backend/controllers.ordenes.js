// Controlador de órdenes de producción
const ordenesModel = require('./models.ordenes');

exports.getAll = async (req, res) => {
  try {
    const ordenes = await ordenesModel.getAll();
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener órdenes' });
  }
};

exports.create = async (req, res) => {
  try {
    const { producto_id, cantidad, fecha_inicio, fecha_fin, estado } = req.body;
    await ordenesModel.create({ producto_id, cantidad, fecha_inicio, fecha_fin, estado });
    res.status(201).json({ message: 'Orden creada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear orden' });
  }
};

exports.update = async (req, res) => {
  try {
    const { producto_id, cantidad, fecha_inicio, fecha_fin, estado } = req.body;
    await ordenesModel.update(req.params.id, { producto_id, cantidad, fecha_inicio, fecha_fin, estado });
    res.json({ message: 'Orden actualizada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar orden' });
  }
};

exports.remove = async (req, res) => {
  try {
    await ordenesModel.remove(req.params.id);
    res.json({ message: 'Orden eliminada' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar orden' });
  }
};
