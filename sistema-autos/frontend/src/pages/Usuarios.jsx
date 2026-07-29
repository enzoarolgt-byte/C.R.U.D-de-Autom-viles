import { useState, useEffect } from 'react';
import { obtenerUsuarios, cambiarRolUsuario, eliminarUsuario } from '../api/admin';
import { useAuth } from '../context/AuthContext';

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const { usuario: currentUser } = useAuth();

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function cargarUsuarios() {
    try {
      setCargando(true);
      const data = await obtenerUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  const handleCambiarRol = async (id, rolActual) => {
    try {
      const nuevoRol = rolActual === 'admin' ? 'usuario' : 'admin';
      await cambiarRolUsuario(id, nuevoRol);
      await cargarUsuarios(); // Refrescar lista
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar a este usuario permanentemente?')) return;
    try {
      await eliminarUsuario(id);
      await cargarUsuarios(); // Refrescar lista
    } catch (err) {
      alert(err.message);
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-hueso/70 font-mono">Cargando usuarios...</div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center mt-8 text-naranja font-mono bg-naranja/10 p-4 rounded-md">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-display font-bold text-hueso tracking-tight">Gestión de Usuarios</h1>
          <p className="text-sm text-hueso/60 mt-1 font-body">
            Administra los roles y accesos de los usuarios registrados.
          </p>
        </div>
        <div className="text-sm font-mono text-hueso/50 bg-panel px-3 py-1 rounded-md border border-grafito">
          Total: {usuarios.length}
        </div>
      </div>

      <div className="bg-panel rounded-xl border border-grafito overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-hueso">
            <thead className="bg-chasis/50 text-hueso/70 font-mono text-xs uppercase tracking-wider border-b border-grafito">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Nombre</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Rol</th>
                <th className="px-6 py-4 font-medium">Fecha de Creación</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grafito">
              {usuarios.map((user) => (
                <tr key={user.id} className="hover:bg-chasis/30 transition-colors group">
                  <td className="px-6 py-4 font-mono text-hueso/50">{user.id}</td>
                  <td className="px-6 py-4 font-medium">{user.nombre}</td>
                  <td className="px-6 py-4 text-hueso/80">{user.email}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      user.rol === 'admin' 
                        ? 'bg-naranja/20 text-naranja border border-naranja/30' 
                        : 'bg-acero/20 text-acero border border-acero/30'
                    }`}>
                      {user.rol}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-hueso/60 font-mono text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    {currentUser.id !== user.id && (
                      <>
                        <button
                          onClick={() => handleCambiarRol(user.id, user.rol)}
                          className="text-xs font-medium text-acero hover:text-hueso transition-colors"
                        >
                          {user.rol === 'admin' ? 'Quitar Admin' : 'Hacer Admin'}
                        </button>
                        <button
                          onClick={() => handleEliminar(user.id)}
                          className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                        >
                          Eliminar
                        </button>
                      </>
                    )}
                    {currentUser.id === user.id && (
                      <span className="text-xs font-medium text-hueso/30 italic">
                        (Tú)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsuariosPage;
