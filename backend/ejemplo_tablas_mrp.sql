-- Script de ejemplo para crear tablas y relaciones en PostgreSQL para el MRP

CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE departamentos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    rol_id INTEGER REFERENCES roles(id),
    departamento_id INTEGER REFERENCES departamentos(id)
);

CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    stock INTEGER DEFAULT 0,
    precio NUMERIC(12,2) NOT NULL
);

CREATE TABLE materiales (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    stock INTEGER DEFAULT 0,
    unidad VARCHAR(20) NOT NULL
);

CREATE TABLE productos_materiales (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id) ON DELETE CASCADE,
    material_id INTEGER REFERENCES materiales(id) ON DELETE CASCADE,
    cantidad NUMERIC(12,2) NOT NULL
);

CREATE TABLE ordenes_produccion (
    id SERIAL PRIMARY KEY,
    producto_id INTEGER REFERENCES productos(id),
    cantidad INTEGER NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado VARCHAR(30) NOT NULL
);

CREATE TABLE ordenes_materiales (
    id SERIAL PRIMARY KEY,
    orden_id INTEGER REFERENCES ordenes_produccion(id) ON DELETE CASCADE,
    material_id INTEGER REFERENCES materiales(id),
    cantidad NUMERIC(12,2) NOT NULL
);

-- Tabla para reportes generales con relaciones
CREATE TABLE IF NOT EXISTS reportes (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    usuario_id INTEGER REFERENCES usuarios(id),
    orden_id INTEGER REFERENCES ordenes_produccion(id),
    producto_id INTEGER REFERENCES productos(id)
);
