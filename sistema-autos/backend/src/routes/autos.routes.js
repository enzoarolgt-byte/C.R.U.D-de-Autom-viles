const express = require('express');
const { listar, obtener, crear, actualizar, eliminar, listarTodosAdmin, eliminarGlobalAdmin } = require('../controllers/autos.controller');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');

const router = express.Router();

// Todas las rutas de autos requieren estar autenticado
router.use(verificarToken);

router.get('/', listar);
router.get('/:id', obtener);
router.post('/', crear);
router.put('/:id', actualizar);
router.delete('/:id', eliminar);

// Rutas de administración
router.get('/admin/todos', verificarAdmin, listarTodosAdmin);
router.delete('/admin/:id', verificarAdmin, eliminarGlobalAdmin);

module.exports = router;
