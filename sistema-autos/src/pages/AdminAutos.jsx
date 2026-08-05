import { useState, useEffect } from 'react';
import { obtenerTodosAutosAdmin, eliminarAutoAdmin } from '../api/admin';

export default function AdminAutos() {
  const [autos, setAutos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarAutos();
  }, []);

  async function cargarAutos() {
    try {
      setCargando(true);
      const data = await obtenerTodosAutosAdmin();
      setAutos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este auto del sistema permanentemente?')) return;
    try {
      await eliminarAutoAdmin(id);
      await cargarAutos(); // Refrescar lista
    } catch (err) {
      alert(err.message);
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-hueso/70 font-mono">Cargando inventario global...</div>
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
          <h1 className="text-2xl font-display font-bold text-hueso tracking-tight">Gestión Global de Autos</h1>
          <p className="text-sm text-hueso/60 mt-1 font-body">
            Audita y administra todos los vehículos registrados por cualquier usuario en la plataforma.
          </p>
        </div>
        <div className="text-sm font-mono text-hueso/50 bg-panel px-3 py-1 rounded-md border border-grafito">
          Total: {autos.length}
        </div>
      </div>

      <div className="bg-panel rounded-xl border border-grafito overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-hueso">
            <thead className="bg-chasis/50 text-hueso/70 font-mono text-xs uppercase tracking-wider border-b border-grafito">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Vehículo</th>
                <th className="px-6 py-4 font-medium">Propietario</th>
                <th className="px-6 py-4 font-medium">Placa</th>
                <th className="px-6 py-4 font-medium">Precio</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grafito">
              {autos.map((auto) => (
                <tr key={auto.id} className="hover:bg-chasis/30 transition-colors group">
                  <td className="px-6 py-4 font-mono text-hueso/50">{auto.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-hueso">{auto.marca} {auto.modelo}</div>
                    <div className="text-xs text-hueso/50">{auto.anio} • {auto.color || 'Sin color'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-hueso/90">{auto.usuario_nombre}</div>
                    <div className="text-xs text-hueso/50 font-mono">{auto.usuario_email}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-naranja/80 bg-naranja/5 inline-flex items-center rounded mt-4 ml-6 px-2 py-0.5 border border-naranja/10">
                    {auto.placa}
                  </td>
                  <td className="px-6 py-4 text-hueso/80 font-mono">
                    {auto.precio ? `$${auto.precio}` : '-'}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleEliminar(auto.id)}
                      className="text-xs font-medium text-red-400 hover:text-red-300 transition-colors"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {autos.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-hueso/50 font-mono">
                    No hay autos registrados en el sistema.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
