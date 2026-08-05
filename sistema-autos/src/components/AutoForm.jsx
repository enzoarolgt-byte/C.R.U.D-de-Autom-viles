import { useState, useEffect } from 'react';

const VACIO = { marca: '', modelo: '', anio: '', color: '', placa: '', precio: '' };

export default function AutoForm({ autoInicial, onGuardar, onCancelar, guardando }) {
  const [form, setForm] = useState(VACIO);
  const [error, setError] = useState('');

  useEffect(() => {
    setForm(autoInicial || VACIO);
    setError('');
  }, [autoInicial]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.marca || !form.modelo || !form.anio || !form.placa) {
      setError('Marca, modelo, anio y placa son obligatorios.');
      return;
    }
    onGuardar({
      ...form,
      anio: Number(form.anio),
      precio: form.precio ? Number(form.precio) : null,
    });
  }

  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-lg border border-grafito bg-panel p-6 shadow-xl">
        <h2 className="mb-4 font-display text-lg font-semibold">
          {autoInicial ? 'Editar auto' : 'Registrar auto'}
        </h2>

        {error && (
          <p className="mb-3 rounded-md bg-naranja/10 px-3 py-2 text-sm text-naranja">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Marca" name="marca" value={form.marca} onChange={handleChange} />
            <Campo label="Modelo" name="modelo" value={form.modelo} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Año" name="anio" type="number" value={form.anio} onChange={handleChange} />
            <Campo label="Color" name="color" value={form.color} onChange={handleChange} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Campo label="Placa" name="placa" value={form.placa} onChange={handleChange} mono />
            <Campo label="Precio" name="precio" type="number" value={form.precio} onChange={handleChange} />
          </div>

          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancelar}
              className="rounded-md border border-grafito px-4 py-2 text-sm text-hueso/80 transition hover:text-hueso"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={guardando}
              className="rounded-md bg-naranja px-4 py-2 text-sm font-semibold text-white transition hover:bg-naranja/90 disabled:opacity-60"
            >
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Campo({ label, name, value, onChange, type = 'text', mono = false }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block text-hueso/70">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full rounded-md border border-grafito bg-chasis px-3 py-2 text-hueso outline-none focus:border-acero ${
          mono ? 'font-mono uppercase' : ''
        }`}
      />
    </label>
  );
}
