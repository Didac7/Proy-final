// Controlador de productos
const productosModel = require('./models.productos');

exports.getAll = async (req, res) => {
  try {
    const productos = await productosModel.getAll();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio } = req.body;
    await productosModel.create({ nombre, descripcion, stock, precio });
    res.status(201).json({ message: 'Producto creado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear producto' });
  }
};

exports.update = async (req, res) => {
  try {
    const { nombre, descripcion, stock, precio } = req.body;
    await productosModel.update(req.params.id, { nombre, descripcion, stock, precio });
    res.json({ message: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar producto' });
  }
};

exports.remove = async (req, res) => {
  try {
    await productosModel.remove(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar producto' });
  }
};
