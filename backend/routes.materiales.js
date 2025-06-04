// Rutas para materiales
const express = require('express');
const router = express.Router();
const authMiddleware = require('./auth.middleware');
const materialesController = require('./controllers.materiales');

router.get('/', authMiddleware, materialesController.getAll);
router.post('/', authMiddleware, materialesController.create);
router.put('/:id', authMiddleware, materialesController.update);
router.delete('/:id', authMiddleware, materialesController.remove);

module.exports = router;
