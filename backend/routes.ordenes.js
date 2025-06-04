// Rutas para órdenes de producción
const express = require('express');
const router = express.Router();
const authMiddleware = require('./auth.middleware');
const ordenesController = require('./controllers.ordenes');

router.get('/', authMiddleware, ordenesController.getAll);
router.post('/', authMiddleware, ordenesController.create);
router.put('/:id', authMiddleware, ordenesController.update);
router.delete('/:id', authMiddleware, ordenesController.remove);

module.exports = router;
