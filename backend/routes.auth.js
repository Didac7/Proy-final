const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('./config');

// Registro de usuario
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query('INSERT INTO usuarios (nombre, email, password) VALUES ($1, $2, $3)', [nombre, email, hashedPassword]);
    res.status(201).json({ message: 'Usuario registrado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      console.error('No existe usuario con ese email');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const usuario = result.rows[0];
    if (!usuario.password) {
      console.error('El usuario no tiene contraseña en la base de datos');
      return res.status(500).json({ error: 'Usuario sin contraseña' });
    }
    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) {
      console.error('Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }
    const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET, { expiresIn: '8h' });
    const { password: pwd, ...userWithoutPassword } = usuario;
    res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error al iniciar sesión', detalle: error.message });
  }
});

module.exports = router;
