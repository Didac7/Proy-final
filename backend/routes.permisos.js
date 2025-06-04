const express = require('express');
const router = express.Router();

// Simulación de permisos (puedes adaptar esto a tu modelo real)
const permisos = [
  { id: 1, name: 'CREAR_USUARIO' },
  { id: 2, name: 'ELIMINAR_USUARIO' },
  { id: 3, name: 'ACTUALIZAR_USUARIO' },
  { id: 4, name: 'VER_USUARIO' },
  { id: 5, name: 'CREAR_ROL' },
  { id: 6, name: 'ELIMINAR_ROL' },
  { id: 7, name: 'ACTUALIZAR_ROL' },
  { id: 8, name: 'VER_ROL' },
  // Agrega más permisos según tu sistema
];

router.get('/get-all-permisos', (req, res) => {
  res.json(permisos);
});

module.exports = router;
