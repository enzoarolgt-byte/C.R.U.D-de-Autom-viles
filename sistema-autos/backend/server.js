require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./src/routes/auth.routes');
const autosRoutes = require('./src/routes/autos.routes');

const app = express();

// CORS: permite peticiones desde el frontend (Vercel) y desde localhost en desarrollo
const origenesPermitidos = [process.env.FRONTEND_URL, 'http://localhost:5173'].filter(Boolean);
app.use(
  cors({
    origin: origenesPermitidos,
    credentials: true,
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Sistema de Autos activa' });
});

app.get('/api/health', (req, res) => {
  res.json({ estado: 'ok', fecha: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/autos', autosRoutes);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada.' });
});

// Manejador de errores general
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor.' });
});

if (require.main === module) {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
}

module.exports = app;
