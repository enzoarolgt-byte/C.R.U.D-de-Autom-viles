const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

async function registrar(req, res) {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Nombre, email y password son obligatorios.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'El password debe tener al menos 6 caracteres.' });
  }

  try {
    const existente = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
    if (existente.rows.length > 0) {
      return res.status(409).json({ error: 'Ya existe una cuenta con ese email.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const resultado = await pool.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol) VALUES ($1, $2, $3, $4) RETURNING id, nombre, email, rol, created_at',
      [nombre, email, passwordHash, 'usuario']
    );

    const usuario = resultado.rows[0];
    const token = generarToken(usuario);

    return res.status(201).json({ usuario, token });
  } catch (error) {
    console.error('Error en registrar:', error);
    return res.status(500).json({ error: 'Error interno al registrar el usuario.' });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password son obligatorios.' });
  }

  try {
    const resultado = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    const usuario = resultado.rows[0];

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales invalidas.' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password_hash);
    if (!passwordValido) {
      return res.status(401).json({ error: 'Credenciales invalidas.' });
    }

    const token = generarToken(usuario);

    return res.json({
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
      token,
    });
  } catch (error) {
    console.error('Error en login:', error);
    return res.status(500).json({ error: 'Error interno al iniciar sesion.' });
  }
}

function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, nombre: usuario.nombre, email: usuario.email, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
}

async function perfil(req, res) {
  return res.json({ usuario: req.usuario });
}

// Nueva funcion exclusiva para el Administrador
async function obtenerUsuarios(req, res) {
  try {
    const resultado = await pool.query('SELECT id, nombre, email, rol, created_at FROM usuarios ORDER BY id ASC');
    return res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return res.status(500).json({ error: 'Error al obtener la lista de usuarios.' });
  }
}

async function cambiarRolUsuario(req, res) {
  const { id } = req.params;
  const { rol } = req.body;

  if (rol !== 'admin' && rol !== 'usuario') {
    return res.status(400).json({ error: 'Rol invalido.' });
  }

  // Prevenir que un admin se quite el rol a si mismo accidentalmente (opcional pero recomendado)
  if (req.usuario.id === parseInt(id)) {
    return res.status(403).json({ error: 'No puedes cambiar tu propio rol.' });
  }

  try {
    const resultado = await pool.query(
      'UPDATE usuarios SET rol = $1 WHERE id = $2 RETURNING id, nombre, email, rol, created_at',
      [rol, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    return res.json(resultado.rows[0]);
  } catch (error) {
    console.error('Error al cambiar rol:', error);
    return res.status(500).json({ error: 'Error interno al actualizar el rol.' });
  }
}

async function eliminarUsuario(req, res) {
  const { id } = req.params;

  if (req.usuario.id === parseInt(id)) {
    return res.status(403).json({ error: 'No puedes eliminar tu propia cuenta desde el panel de admin.' });
  }

  try {
    const resultado = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);
    
    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }

    return res.json({ mensaje: 'Usuario eliminado correctamente.' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return res.status(500).json({ error: 'Error interno al eliminar el usuario.' });
  }
}

module.exports = { registrar, login, perfil, obtenerUsuarios, cambiarRolUsuario, eliminarUsuario };
