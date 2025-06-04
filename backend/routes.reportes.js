// Ejemplo de endpoint de reporte de inventario
const express = require('express');
const router = express.Router();
const authMiddleware = require('./auth.middleware');
const pool = require('./config');

router.get('/inventario', authMiddleware, async (req, res) => {
  try {
    const productos = await pool.query('SELECT nombre, stock FROM productos');
    const materiales = await pool.query('SELECT nombre, stock, unidad FROM materiales');
    res.json({ productos: productos.rows, materiales: materiales.rows });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reporte de inventario' });
  }
});

// Crear un reporte (POST /api/reportes)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { titulo, descripcion, fecha } = req.body;
    await pool.query('INSERT INTO reportes (titulo, descripcion, fecha) VALUES ($1, $2, $3)', [titulo, descripcion, fecha]);
    res.status(201).json({ message: 'Reporte creado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear reporte' });
  }
});

// Obtener todos los reportes (GET /api/reportes)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reportes');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reportes' });
  }
});

module.exports = router;
