const express = require('express');
const { registrar, login, perfil, obtenerUsuarios, cambiarRolUsuario, eliminarUsuario } = require('../controllers/auth.controller');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/registro', registrar);
router.post('/login', login);
router.get('/perfil', verificarToken, perfil);

// Ruta exclusiva para el administrador
router.get('/usuarios', verificarToken, verificarAdmin, obtenerUsuarios);
router.put('/usuarios/:id/rol', verificarToken, verificarAdmin, cambiarRolUsuario);
router.delete('/usuarios/:id', verificarToken, verificarAdmin, eliminarUsuario);

module.exports = router;
