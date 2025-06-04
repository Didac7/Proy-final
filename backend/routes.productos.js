// Rutas para productos
const express = require('express');
const router = express.Router();
const authMiddleware = require('./auth.middleware');
const productosController = require('./controllers.productos');

router.get('/', authMiddleware, productosController.getAll);
router.post('/', authMiddleware, productosController.create);
router.put('/:id', authMiddleware, productosController.update);
router.delete('/:id', authMiddleware, productosController.remove);

module.exports = router;
