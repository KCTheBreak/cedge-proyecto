## Instrucciones para restaurar la base de datos

1. Crear la base de datos en PostgreSQL
2. Importar el archivo SQL:

-- cambiar por sus datos
psql -U usuario -d basedatos < database/respaldo.sql

-- Crear usuario con contraseña
CREATE USER admin_user WITH PASSWORD 'HelloWorld';

-- Tabla usuarios
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  rol VARCHAR(20) DEFAULT 'usuario' CHECK (rol IN ('admin', 'usuario'))
);

-- Permisos para usuario admin_user en tabla usuarios
GRANT USAGE ON SCHEMA public TO admin_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE usuarios TO admin_user;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE usuarios_id_seq TO admin_user;

-- Tabla materiales
CREATE TABLE materiales (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  codigo VARCHAR(20) UNIQUE NOT NULL,
  cantidad INTEGER NOT NULL DEFAULT 0,
  disponibilidad VARCHAR(20) CHECK (disponibilidad IN ('Disponible', 'Agotado')) NOT NULL
);

-- Permisos para admin_user en materiales
GRANT SELECT, INSERT, UPDATE, DELETE ON materiales TO admin_user;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE materiales_id_seq TO admin_user;

-- Datos iniciales para materiales, hizo falta entrevistas
INSERT INTO materiales (nombre, codigo, cantidad, disponibilidad) VALUES
('Manual de Electrónica', 'MAT006', 8, 'Disponible'),
('Kit de herramientas básicas', 'MAT007', 2, 'Disponible'),
('Cable HDMI 2m', 'MAT008', 10, 'Disponible'),
('Adaptador USB-C a HDMI', 'MAT009', 6, 'Disponible'),
('Libro de Programación en Vue', 'MAT010', 3, 'Disponible');

-- Tabla prestamos
CREATE TABLE prestamos (
    id SERIAL PRIMARY KEY,
    nombre_solicitante VARCHAR(255) NOT NULL,
    grupo VARCHAR(50) NOT NULL,
    tipo_material VARCHAR(100) NOT NULL,
    fecha_solicitud DATE NOT NULL,
    fecha_entrega DATE NOT NULL,
    estado VARCHAR(50) DEFAULT 'pendiente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla prestamo_detalles para los materiales específicos de cada préstamo
CREATE TABLE prestamo_detalles (
    id SERIAL PRIMARY KEY,
    prestamo_id INTEGER REFERENCES prestamos(id) ON DELETE CASCADE,
    material_id INTEGER REFERENCES materiales(id) ON DELETE CASCADE,
    cantidad_prestada INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Permisos para admin_user en prestamos y prestamo_detalles
GRANT SELECT, INSERT, UPDATE, DELETE ON prestamos TO admin_user;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE prestamos_id_seq TO admin_user;

GRANT SELECT, INSERT, UPDATE, DELETE ON prestamo_detalles TO admin_user;
GRANT USAGE, SELECT, UPDATE ON SEQUENCE prestamo_detalles_id_seq TO admin_user;
