const pool = require('../db');

// GET /api/autos
async function listar(req, res) {
  try {
    const resultado = await pool.query(
      'SELECT * FROM autos WHERE usuario_id = $1 ORDER BY created_at DESC',
      [req.usuario.id]
    );
    return res.json(resultado.rows);
  } catch (error) {
    console.error('Error en listar:', error);
    return res.status(500).json({ error: 'Error interno al listar los autos.' });
  }
}

// GET /api/autos/:id
async function obtener(req, res) {
  try {
    const resultado = await pool.query(
      'SELECT * FROM autos WHERE id = $1 AND usuario_id = $2',
      [req.params.id, req.usuario.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Auto no encontrado.' });
    }
    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error en obtener:', error);
    return res.status(500).json({ error: 'Error interno al obtener el auto.' });
  }
}

// POST /api/autos
async function crear(req, res) {
  const { marca, modelo, anio, color, placa, precio } = req.body;

  if (!marca || !modelo || !anio || !placa) {
    return res.status(400).json({ error: 'Marca, modelo, anio y placa son obligatorios.' });
  }

  try {
    const resultado = await pool.query(
      `INSERT INTO autos (marca, modelo, anio, color, placa, precio, usuario_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [marca, modelo, anio, color || null, placa, precio || null, req.usuario.id]
    );
    return res.status(201).json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un auto con esa placa.' });
    }
    console.error('Error en crear:', error);
    return res.status(500).json({ error: 'Error interno al crear el auto.' });
  }
}

// PUT /api/autos/:id
async function actualizar(req, res) {
  const { marca, modelo, anio, color, placa, precio } = req.body;

  try {
    const resultado = await pool.query(
      `UPDATE autos
       SET marca = $1, modelo = $2, anio = $3, color = $4, placa = $5, precio = $6, updated_at = NOW()
       WHERE id = $7 AND usuario_id = $8 RETURNING *`,
      [marca, modelo, anio, color || null, placa, precio || null, req.params.id, req.usuario.id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Auto no encontrado.' });
    }
    return res.json(resultado.rows[0]);
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'Ya existe un auto con esa placa.' });
    }
    console.error('Error en actualizar:', error);
    return res.status(500).json({ error: 'Error interno al actualizar el auto.' });
  }
}

// DELETE /api/autos/:id
async function eliminar(req, res) {
  try {
    const resultado = await pool.query(
      'DELETE FROM autos WHERE id = $1 AND usuario_id = $2 RETURNING id',
      [req.params.id, req.usuario.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Auto no encontrado.' });
    }
    return res.json({ mensaje: 'Auto eliminado correctamente.' });
  } catch (error) {
    console.error('Error en eliminar:', error);
    return res.status(500).json({ error: 'Error interno al eliminar el auto.' });
  }
}

// Funciones para Administradores
async function listarTodosAdmin(req, res) {
  try {
    const resultado = await pool.query(
      `SELECT autos.*, usuarios.nombre AS usuario_nombre, usuarios.email AS usuario_email 
       FROM autos 
       JOIN usuarios ON autos.usuario_id = usuarios.id 
       ORDER BY autos.created_at DESC`
    );
    return res.json(resultado.rows);
  } catch (error) {
    console.error('Error en listarTodosAdmin:', error);
    return res.status(500).json({ error: 'Error interno al listar todos los autos.' });
  }
}

async function eliminarGlobalAdmin(req, res) {
  try {
    const resultado = await pool.query(
      'DELETE FROM autos WHERE id = $1 RETURNING id',
      [req.params.id]
    );
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Auto no encontrado.' });
    }
    return res.json({ mensaje: 'Auto eliminado correctamente por administrador.' });
  } catch (error) {
    console.error('Error en eliminarGlobalAdmin:', error);
    return res.status(500).json({ error: 'Error interno al eliminar el auto globalmente.' });
  }
}

module.exports = { listar, obtener, crear, actualizar, eliminar, listarTodosAdmin, eliminarGlobalAdmin };
