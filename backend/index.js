require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 4000;

const usuariosRoutes = require('./routes.usuarios');
const rolesRoutes = require('./routes.roles');
const departamentosRoutes = require('./routes.departamentos');
const authRoutes = require('./routes.auth');
const productosRoutes = require('./routes.productos');
const productosMaterialesRoutes = require('./routes.productos_materiales');
const productosMaterialesCrudRoutes = require('./routes.productos_materiales_crud');
const materialesRoutes = require('./routes.materiales');
const ordenesRoutes = require('./routes.ordenes');
const ordenesMaterialesRoutes = require('./routes.ordenes_materiales');
const ordenesMaterialesCrudRoutes = require('./routes.ordenes_materiales_crud');
const reportesRoutes = require('./routes.reportes');
const permisosRoutes = require('./routes.permisos');

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend MRP funcionando');
});

app.use('/api/usuarios', usuariosRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/departamentos', departamentosRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/productos', productosRoutes);
app.use('/api/productos', productosMaterialesRoutes); // materiales de producto
app.use('/api/productos', productosMaterialesCrudRoutes); // asignar/eliminar materiales a producto
app.use('/api/materiales', materialesRoutes);
app.use('/api/ordenes', ordenesRoutes);
app.use('/api/ordenes', ordenesMaterialesRoutes); // materiales de orden
app.use('/api/ordenes', ordenesMaterialesCrudRoutes); // asignar/eliminar materiales a orden
app.use('/api/reportes', reportesRoutes);
app.use('/api/permisos', permisosRoutes);

app.listen(PORT, () => {
  console.log(`Servidor backend escuchando en el puerto ${PORT}`);
});
