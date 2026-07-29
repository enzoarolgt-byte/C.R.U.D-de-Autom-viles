-- 1. Creamos la tabla para los usuarios
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  rol VARCHAR(20) DEFAULT 'usuario',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Creamos la tabla para los autos
CREATE TABLE IF NOT EXISTS autos (
  id SERIAL PRIMARY KEY,
  marca VARCHAR(100) NOT NULL,
  modelo VARCHAR(100) NOT NULL,
  anio INTEGER NOT NULL,
  color VARCHAR(50),
  placa VARCHAR(20) UNIQUE NOT NULL,
  precio NUMERIC(12, 2),
  usuario_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);