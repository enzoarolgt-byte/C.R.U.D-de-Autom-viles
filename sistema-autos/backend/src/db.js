const { Pool } = require('pg');

// Railway expone la variable DATABASE_URL automaticamente al enlazar
// el plugin de PostgreSQL con este servicio.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de PostgreSQL', err);
});

module.exports = pool;
