import { useEffect, useState } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import AutoForm from '../components/AutoForm';

export default function Autos() {
  const [autos, setAutos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [autoEditando, setAutoEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);

  async function cargarAutos() {
    setCargando(true);
    setError('');
    try {
      const { data } = await api.get('/autos');
      setAutos(data);
    } catch (err) {
      setError('No se pudieron cargar los autos.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarAutos();
  }, []);

  function abrirCrear() {
    setAutoEditando(null);
    setMostrarForm(true);
  }

  function abrirEditar(auto) {
    setAutoEditando(auto);
    setMostrarForm(true);
  }

  async function guardarAuto(datos) {
    setGuardando(true);
    try {
      if (autoEditando) {
        await api.put(`/autos/${autoEditando.id}`, datos);
      } else {
        await api.post('/autos', datos);
      }
      setMostrarForm(false);
      await cargarAutos();
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo guardar el auto.');
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarAuto(id) {
    if (!confirm('¿Eliminar este auto? Esta accion no se puede deshacer.')) return;
    try {
      await api.delete(`/autos/${id}`);
      setAutos((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'No se pudo eliminar el auto.');
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">Mis autos</h2>
            <p className="text-sm text-hueso/60">
              {autos.length} {autos.length === 1 ? 'vehiculo registrado' : 'vehiculos registrados'}
            </p>
          </div>
          <button
            onClick={abrirCrear}
            className="rounded-md bg-naranja px-4 py-2 text-sm font-semibold text-white transition hover:bg-naranja/90"
          >
            + Nuevo auto
          </button>
        </div>

        {cargando && <p className="text-hueso/60">Cargando...</p>}
        {error && <p className="text-naranja">{error}</p>}

        {!cargando && autos.length === 0 && !error && (
          <div className="rounded-lg border border-dashed border-grafito p-10 text-center text-hueso/60">
            Aun no has registrado ningun auto. Usa "Nuevo auto" para agregar el primero.
          </div>
        )}

        {!cargando && autos.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-grafito">
            <table className="w-full text-left text-sm">
              <thead className="bg-panel text-hueso/60">
                <tr>
                  <th className="px-4 py-3 font-medium">Marca</th>
                  <th className="px-4 py-3 font-medium">Modelo</th>
                  <th className="px-4 py-3 font-medium">Año</th>
                  <th className="px-4 py-3 font-medium">Color</th>
                  <th className="px-4 py-3 font-medium">Placa</th>
                  <th className="px-4 py-3 font-medium">Precio</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grafito">
                {autos.map((auto) => (
                  <tr key={auto.id} className="bg-chasis hover:bg-panel/50">
                    <td className="px-4 py-3">{auto.marca}</td>
                    <td className="px-4 py-3">{auto.modelo}</td>
                    <td className="px-4 py-3">{auto.anio}</td>
                    <td className="px-4 py-3">{auto.color || '—'}</td>
                    <td className="px-4 py-3 font-mono uppercase text-acero">{auto.placa}</td>
                    <td className="px-4 py-3">
                      {auto.precio ? `Q${Number(auto.precio).toLocaleString()}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => abrirEditar(auto)}
                        className="mr-3 text-hueso/70 hover:text-acero"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => eliminarAuto(auto.id)}
                        className="text-hueso/70 hover:text-naranja"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {mostrarForm && (
        <AutoForm
          autoInicial={autoEditando}
          guardando={guardando}
          onGuardar={guardarAuto}
          onCancelar={() => setMostrarForm(false)}
        />
      )}
    </div>
  );
}
