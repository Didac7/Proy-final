# Backend Node.js para MRP

Este backend usa Express y PostgreSQL para un sistema MRP robusto.

## Configuración
1. Renombra `.env` y coloca tus credenciales de PostgreSQL.
2. Instala dependencias con `npm install`.
3. Inicia el servidor con `node index.js`.

## Estructura sugerida
- `index.js`: Entrada principal
- `config.js`: Conexión a base de datos
- `/routes`: Rutas de la API
- `/controllers`: Lógica de negocio
- `/models`: Consultas a la base de datos

## Endpoints de ejemplo
- `GET /` — Prueba de funcionamiento

## Seguridad
- JWT para autenticación
- CORS habilitado

## Próximos pasos
- Crear rutas, controladores y modelos para usuarios, roles y departamentos.
- Implementar autenticación y autorización.
